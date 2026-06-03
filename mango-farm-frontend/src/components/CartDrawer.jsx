import React from 'react';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './CartDrawer.css';

export default function CartDrawer() {
  const { state, dispatch, total } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    dispatch({ type: 'CLOSE_CART' });
    navigate('/checkout');
  };

  return (
    <AnimatePresence>
      {state.isOpen && (
        <>
          <motion.div
            className="cart-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch({ type: 'CLOSE_CART' })}
          />
          <motion.div
            className="cart-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="cart-header">
              <div className="cart-header-title">
                <ShoppingBag size={22} />
                <h2>Your Selection</h2>
              </div>
              <button onClick={() => dispatch({ type: 'CLOSE_CART' })} className="close-btn" aria-label="Close cart">
                <X size={22} />
              </button>
            </div>

            <div className="cart-items">
              {state.items.length === 0 ? (
                <div className="empty-cart">
                  <div className="empty-cart-icon">🥭</div>
                  <p className="empty-cart-title">Your cart is empty</p>
                  <p className="empty-cart-text">Explore our collection and add some mangoes!</p>
                </div>
              ) : (
                state.items.map(item => (
                  <motion.div
                    key={item.id}
                    className="cart-item"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    layout
                  >
                    <div className="cart-item-image-wrap">
                      <img src={item.image} alt={item.name} className="cart-item-image" />
                    </div>
                    <div className="cart-item-details">
                      <h3>{item.name}</h3>
                      <p className="cart-item-price">₹{parseFloat(item.price).toFixed(2)}</p>

                      <div className="quantity-controls">
                        <button
                          onClick={() => {
                            if (item.quantity > 1) {
                              dispatch({ type: 'UPDATE_QUANTITY', payload: { id: item.id, quantity: item.quantity - 1 } });
                            } else {
                              dispatch({ type: 'REMOVE_ITEM', payload: { id: item.id } });
                            }
                          }}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="qty-display">{item.quantity}</span>
                        <button
                          onClick={() => dispatch({ type: 'UPDATE_QUANTITY', payload: { id: item.id, quantity: item.quantity + 1 } })}
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                    <button
                      className="remove-btn"
                      onClick={() => dispatch({ type: 'REMOVE_ITEM', payload: { id: item.id } })}
                      aria-label="Remove item"
                    >
                      <X size={16} />
                    </button>
                  </motion.div>
                ))
              )}
            </div>

            {state.items.length > 0 && (
              <div className="cart-footer">
                <div className="cart-subtotal">
                  <span>Subtotal</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
                <p className="cart-shipping-note">Shipping calculated at checkout</p>
                <button className="btn-primary checkout-btn" onClick={handleCheckout}>
                  Proceed to Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
