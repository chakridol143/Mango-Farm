import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock, CreditCard, Truck, CheckCircle2, Package, LogIn } from 'lucide-react';
import api from '../api/client';
import { loadRazorpayScript } from '../utils/razorpay';
import './Checkout.css';

export default function Checkout() {
  const { state, total, dispatch } = useCart();
  const { isAuthenticated, user, login, register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    password: '',
    address: '',
    city: '',
    state: '',
    zip: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('RAZORPAY');
  const [coupon, setCoupon] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null); // { orderId, method } once placed
  const [quote, setQuote] = useState(null); // backend pricing breakdown (source of truth)

  // Guest flow: new customers create an account inline; returning ones sign in inline.
  const [accountMode, setAccountMode] = useState('create'); // 'create' | 'signin'
  const [signin, setSignin] = useState({ email: '', password: '' });
  const [authBusy, setAuthBusy] = useState(false);
  const [authError, setAuthError] = useState('');

  // When a returning customer signs in (here or elsewhere), prefill their details.
  useEffect(() => {
    if (user) {
      setFormData((f) => ({
        ...f,
        name: f.name || user.name || '',
        email: f.email || user.email || '',
        phone: f.phone || user.phone || '',
      }));
    }
  }, [user]);

  // Fetch the exact pricing breakdown (discount + GST) the backend will charge.
  useEffect(() => {
    if (state.items.length === 0) {
      setQuote(null);
      return;
    }
    let cancelled = false;
    api.post('/checkout/quote', {
      items: state.items.map((i) => ({ productId: i.id, quantity: i.quantity })),
    })
      .then((res) => { if (!cancelled) setQuote(res.data); })
      .catch(() => { if (!cancelled) setQuote(null); });
    return () => { cancelled = true; };
  }, [state.items]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const finishSuccess = (orderId, method) => {
    dispatch({ type: 'CLEAR_CART' });
    setLoading(false);
    setSuccess({ orderId, method });
  };

  const handleInlineSignin = async () => {
    setAuthError('');
    if (!signin.email.trim() || !signin.password) {
      setAuthError('Please enter your email and password.');
      return;
    }
    setAuthBusy(true);
    try {
      await login(signin.email.trim(), signin.password);
      // AuthContext updates isAuthenticated → the gate disappears and the form prefills.
    } catch (err) {
      setAuthError(err.response?.data?.message || 'Could not sign in. Please check your details.');
    } finally {
      setAuthBusy(false);
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 0. Guest creating an account at checkout — register first to get a session.
      if (!isAuthenticated) {
        try {
          await register({
            name: formData.name.trim(),
            email: formData.email.trim(),
            password: formData.password,
            phone: formData.phone.trim() || null,
          });
        } catch (regErr) {
          if (regErr.response?.status === 409) {
            setAccountMode('signin');
            setSignin((s) => ({ ...s, email: formData.email.trim() }));
            throw new Error('This email already has an account. Please sign in to continue.');
          }
          throw regErr;
        }
      }

      // 1. Save the shipping address.
      const shippingRes = await api.post('/shipping', {
        address: formData.address,
        city: formData.city,
        state: formData.state,
        postal_code: formData.zip,
        country: 'India',
        phone: formData.phone || null,
      });
      const shippingId = shippingRes.data.shipping_id;

      // 2. Sync the local cart to the server cart (orders are built from it).
      await api.post('/cart/sync', {
        items: state.items.map((item) => ({ productId: item.id, quantity: item.quantity })),
      });

      // 3. Create the order.
      const orderRes = await api.post('/orders', {
        shippingId,
        paymentMethod,
        coupon_code: coupon.trim() || undefined,
      });
      const { orderId } = orderRes.data;

      // 4a. Cash on delivery — order is placed, we're done.
      if (paymentMethod === 'COD') {
        finishSuccess(orderId, 'COD');
        return;
      }

      // 4b. Online payment via Razorpay.
      const scriptReady = await loadRazorpayScript();
      if (!scriptReady) {
        throw new Error('Could not load the payment gateway. Please try again.');
      }

      const payRes = await api.post('/payment/create-order', { order_id: orderId });
      const { key_id, razorpay_order_id, amount, currency } = payRes.data;

      const rzp = new window.Razorpay({
        key: key_id,
        amount,
        currency,
        name: 'MangoFarm',
        description: 'Premium Banganapalle Mangoes',
        order_id: razorpay_order_id,
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: { color: '#F58A07' },
        handler: async (response) => {
          try {
            await api.post('/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              order_id: orderId,
            });
            finishSuccess(orderId, 'RAZORPAY');
          } catch (verifyErr) {
            setError(
              verifyErr.response?.data?.message ||
                'Payment verification failed. If money was deducted, contact support.'
            );
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setError('Payment was cancelled. Your order is awaiting payment.');
            setLoading(false);
          },
        },
      });

      rzp.on('payment.failed', (resp) => {
        setError(resp.error?.description || 'Payment failed. Please try again.');
        setLoading(false);
      });

      rzp.open();
      // Keep loading=true while the Razorpay modal is open; handlers reset it.
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Checkout failed. Please try again.');
      setLoading(false);
    }
  };

  // Order placed — show a polished confirmation instead of a raw alert().
  if (success) {
    const isCod = success.method === 'COD';
    return (
      <div className="checkout-page success-checkout">
        <div className="container">
          <motion.div
            className="order-success-card"
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="order-success-icon">
              <CheckCircle2 size={56} strokeWidth={1.5} />
            </div>
            <h1 className="order-success-title">
              {isCod ? 'Order Placed!' : 'Payment Successful!'}
            </h1>
            <p className="order-success-text">
              {isCod
                ? 'Thank you! Your order is confirmed and will be paid on delivery. A fresh box of mangoes is on its way.'
                : 'Thank you! Your payment was received and your order is confirmed. A fresh box of mangoes is on its way.'}
            </p>
            <div className="order-success-id">
              <span>Order Reference</span>
              <strong>{success.orderId}</strong>
            </div>
            <div className="order-success-actions">
              <Link to="/orders" className="btn btn-primary">
                <Package size={18} /> View My Orders
              </Link>
              <Link to="/shop" className="btn btn-outline">Continue Shopping</Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (state.items.length === 0) {
    return (
      <div className="checkout-page empty-checkout">
        <div className="container empty-checkout-content">
          <div className="empty-checkout-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p className="empty-checkout-text">Add some premium mangoes before checking out.</p>
          <Link to="/shop" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
            Browse Collection
          </Link>
        </div>
      </div>
    );
  }

  const showMainForm = isAuthenticated || accountMode === 'create';
  const isGuestCreating = !isAuthenticated && accountMode === 'create';

  return (
    <div className="checkout-page">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link to="/shop" className="back-link">
            <ArrowLeft size={16} /> Continue Shopping
          </Link>
        </motion.div>

        <div className="checkout-grid">
          {/* Form Section */}
          <motion.div
            className="checkout-form-section"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="checkout-title">Checkout</h1>
            <p className="checkout-subtitle">
              {isAuthenticated
                ? `Signed in as ${user?.email}. Complete your order below.`
                : 'Complete your order details below — no account needed to start.'}
            </p>

            {/* Guest account gate */}
            {!isAuthenticated && (
              <div className="checkout-account-gate">
                <div className="account-gate-toggle">
                  <button
                    type="button"
                    className={accountMode === 'create' ? 'active' : ''}
                    onClick={() => { setAccountMode('create'); setAuthError(''); }}
                  >
                    New customer
                  </button>
                  <button
                    type="button"
                    className={accountMode === 'signin' ? 'active' : ''}
                    onClick={() => { setAccountMode('signin'); setAuthError(''); }}
                  >
                    I have an account
                  </button>
                </div>

                {accountMode === 'signin' ? (
                  <div className="inline-signin">
                    {authError && <div className="error-message">{authError}</div>}
                    <div className="form-row">
                      <div className="form-group">
                        <label htmlFor="signin-email">Email</label>
                        <input
                          type="email"
                          id="signin-email"
                          value={signin.email}
                          onChange={(e) => setSignin({ ...signin, email: e.target.value })}
                          placeholder="you@example.com"
                        />
                      </div>
                      <div className="form-group">
                        <label htmlFor="signin-password">Password</label>
                        <input
                          type="password"
                          id="signin-password"
                          value={signin.password}
                          onChange={(e) => setSignin({ ...signin, password: e.target.value })}
                          placeholder="Your password"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn-primary inline-signin-btn"
                      onClick={handleInlineSignin}
                      disabled={authBusy}
                    >
                      <LogIn size={18} />
                      {authBusy ? 'Signing in…' : 'Sign In & Continue'}
                    </button>
                  </div>
                ) : (
                  <p className="account-gate-note">
                    Just fill in your details below — we'll create an account with your email so
                    you can track this order and reorder in a tap.
                  </p>
                )}
              </div>
            )}

            {error && <div className="error-message">{error}</div>}

            {showMainForm && (
              <form onSubmit={handleCheckout} className="checkout-form">
                <div className="form-section-label">Contact Information</div>
                <div className="form-group">
                  <label htmlFor="checkout-name">Full Name</label>
                  <input
                    type="text"
                    id="checkout-name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="checkout-email">Email</label>
                    <input
                      type="email"
                      id="checkout-email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      readOnly={isAuthenticated}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="checkout-phone">Phone</label>
                    <input
                      type="tel"
                      id="checkout-phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                </div>

                {isGuestCreating && (
                  <div className="form-group">
                    <label htmlFor="checkout-password">Create a Password</label>
                    <input
                      type="password"
                      id="checkout-password"
                      name="password"
                      required
                      minLength={6}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="At least 6 characters"
                    />
                    <span className="field-hint">We'll set up your account so you can track your order.</span>
                  </div>
                )}

                <div className="form-section-label">Shipping Address</div>
                <div className="form-group">
                  <label htmlFor="checkout-address">Street Address</label>
                  <input
                    type="text"
                    id="checkout-address"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="123 Orchard Lane"
                  />
                </div>
                <div className="form-row form-row-3">
                  <div className="form-group">
                    <label htmlFor="checkout-city">City</label>
                    <input
                      type="text"
                      id="checkout-city"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="City"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="checkout-state">State</label>
                    <input
                      type="text"
                      id="checkout-state"
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="State"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="checkout-zip">PIN Code</label>
                    <input
                      type="text"
                      id="checkout-zip"
                      name="zip"
                      required
                      value={formData.zip}
                      onChange={handleChange}
                      placeholder="XXXXXX"
                    />
                  </div>
                </div>

                <div className="form-section-label">Payment Method</div>
                <div className="payment-options">
                  <label className={`payment-option ${paymentMethod === 'RAZORPAY' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="RAZORPAY"
                      checked={paymentMethod === 'RAZORPAY'}
                      onChange={() => setPaymentMethod('RAZORPAY')}
                    />
                    <CreditCard size={18} />
                    <span>Pay Online (Razorpay)</span>
                  </label>
                  <label className={`payment-option ${paymentMethod === 'COD' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                    />
                    <Truck size={18} />
                    <span>Cash on Delivery</span>
                  </label>
                </div>

                <div className="form-group">
                  <label htmlFor="checkout-coupon">Coupon Code (optional)</label>
                  <input
                    type="text"
                    id="checkout-coupon"
                    name="coupon"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder="Enter coupon code"
                  />
                </div>

                <button type="submit" className="btn-primary checkout-submit-btn" disabled={loading}>
                  <Lock size={18} />
                  {loading
                    ? 'Processing…'
                    : paymentMethod === 'COD'
                    ? 'Place Order'
                    : 'Proceed to Payment'}
                </button>

                <div className="secure-note">
                  <CreditCard size={14} />
                  <span>Secured by Razorpay. Your data is encrypted.</span>
                </div>
              </form>
            )}
          </motion.div>

          {/* Order Summary */}
          <motion.div
            className="checkout-summary"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <h3 className="summary-title">Order Summary</h3>
            <div className="summary-items">
              {state.items.map(item => (
                <div key={item.id} className="summary-item">
                  <div className="summary-item-image-wrap">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="summary-item-info">
                    <h4>{item.name}</h4>
                    <p>Qty: {item.quantity}</p>
                  </div>
                  <div className="summary-item-price">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            <div className="summary-divider"></div>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{(quote ? quote.mrpSubtotal : total).toFixed(2)}</span>
            </div>
            {quote && quote.productDiscount > 0 && (
              <div className="summary-row">
                <span>Discount</span>
                <span className="summary-discount">− ₹{quote.productDiscount.toFixed(2)}</span>
              </div>
            )}
            {quote && quote.tax > 0 && (
              <div className="summary-row">
                <span>GST (18%)</span>
                <span>₹{quote.tax.toFixed(2)}</span>
              </div>
            )}
            <div className="summary-row">
              <span>Shipping</span>
              <span className="free-shipping">Free</span>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-total">
              <span>Total</span>
              <span>₹{(quote ? quote.total : total).toFixed(2)}</span>
            </div>
            {coupon.trim() && (
              <p className="summary-coupon-note">Coupon will be applied at payment.</p>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
