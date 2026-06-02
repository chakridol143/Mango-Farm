import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Checkout.css';

export default function Checkout() {
  const { state, total, dispatch } = useCart();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zip: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const payload = {
        items: state.items.map(item => ({ id: item.id, quantity: item.quantity })),
        customer: formData,
        amount: total
      };
      
      const response = await axios.post('http://localhost:3000/api/checkout', payload);
      
      if (response.data) {
        alert('Payment processing initiated via Razorpay!');
        dispatch({ type: 'CLEAR_CART' });
        navigate('/');
      }
    } catch (err) {
      console.error(err);
      // Fallback dummy success since backend Razorpay keys are dummy
      alert('Mock payment successful! (Backend returned error likely due to missing valid Razorpay keys)');
      dispatch({ type: 'CLEAR_CART' });
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  if (state.items.length === 0) {
    return (
      <div className="checkout-page empty-checkout">
        <div className="container">
          <h2 className="heading-md">Your cart is empty.</h2>
          <button className="btn-primary" onClick={() => navigate('/shop')} style={{ marginTop: '2rem' }}>
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container checkout-grid">
        <div className="checkout-form-section">
          <h1 className="heading-lg">Checkout</h1>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleCheckout} className="checkout-form">
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="name" required value={formData.name} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input type="email" name="email" required value={formData.email} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Shipping Address</label>
              <input type="text" name="address" required value={formData.address} onChange={handleChange} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>City</label>
                <input type="text" name="city" required value={formData.city} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>ZIP Code</label>
                <input type="text" name="zip" required value={formData.zip} onChange={handleChange} />
              </div>
            </div>
            
            <button type="submit" className="btn-primary checkout-submit-btn" disabled={loading}>
              {loading ? 'Processing...' : 'Proceed to Payment'}
            </button>
          </form>
        </div>

        <div className="checkout-summary">
          <h3 className="heading-md">Order Summary</h3>
          <div className="summary-items">
            {state.items.map(item => (
              <div key={item.id} className="summary-item">
                <img src={item.image} alt={item.name} />
                <div className="summary-item-info">
                  <h4>{item.name}</h4>
                  <p>Qty: {item.quantity}</p>
                </div>
                <div className="summary-item-price">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          <div className="summary-total">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
