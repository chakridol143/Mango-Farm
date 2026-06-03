import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Package } from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import './Orders.css';

const STATUS_LABELS = {
  PENDING_PAYMENT: 'Pending Payment',
  PAID: 'Paid',
  CANCELLED: 'Cancelled',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
};

export default function Orders() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/orders' } });
      return;
    }
    api.get('/orders/my')
      .then(res => setOrders(Array.isArray(res.data) ? res.data : []))
      .catch(err => console.error('Error fetching orders', err))
      .finally(() => setLoading(false));
  }, [isAuthenticated, navigate]);

  return (
    <div className="orders-page">
      <div className="container">
        <motion.div
          className="orders-header"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="subtitle">Your Account</span>
          <h1 className="orders-title">Order History</h1>
        </motion.div>

        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading your orders…</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="empty-state orders-empty">
            <Package size={48} strokeWidth={1.2} />
            <h2>No orders yet</h2>
            <p>When you place an order, it will show up here.</p>
            <Link to="/shop" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <motion.div
                key={order.orderId}
                className="order-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="order-card-head">
                  <div>
                    <span className="order-id">#{order.orderId.slice(0, 8).toUpperCase()}</span>
                    {order.orderDate && (
                      <span className="order-date">
                        {new Date(order.orderDate).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric',
                        })}
                      </span>
                    )}
                  </div>
                  <span className={`order-status status-${(order.status || '').toLowerCase()}`}>
                    {STATUS_LABELS[order.status] || order.status}
                  </span>
                </div>

                <div className="order-items">
                  {order.items.map((item) => (
                    <div key={item.productId} className="order-item">
                      {item.imageUrl && <img src={item.imageUrl} alt={item.name} />}
                      <div className="order-item-info">
                        <span className="order-item-name">{item.name}</span>
                        <span className="order-item-qty">Qty: {item.quantity}</span>
                      </div>
                      <span className="order-item-price">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="order-card-foot">
                  <span>Total</span>
                  <span className="order-total">₹{Number(order.totalAmount).toFixed(2)}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
