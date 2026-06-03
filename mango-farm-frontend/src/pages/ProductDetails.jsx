import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { ArrowLeft, Minus, Plus, ShoppingBag, Shield, Truck, Leaf } from 'lucide-react';
import api from '../api/client';
import './ProductDetails.css';

export default function ProductDetails() {
  const { id } = useParams();
  const { dispatch } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(res => {
        const data = res.data.data || res.data;
        setProduct(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching product details', err);
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      dispatch({
        type: 'ADD_ITEM',
        payload: {
          ...product,
          id: product.id || product.product_id,
          image: product.image_url || product.image,
          price: parseFloat(product.price)
        }
      });
    }
  };

  if (loading) {
    return (
      <div className="product-details-page">
        <div className="container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading product...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-details-page">
        <div className="container">
          <div className="empty-state">
            <h2>Product not found</h2>
            <Link to="/shop" className="btn btn-outline" style={{ marginTop: '1.5rem' }}>
              Back to Shop
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="product-details-page">
      <div className="container">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/shop" className="back-link">
            <ArrowLeft size={16} strokeWidth={1.5} /> Back to Collection
          </Link>
        </motion.div>

        <div className="product-details-grid">
          {/* Image */}
          <motion.div
            className="product-details-image"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="image-container">
              <img src={product.image_url || product.image} alt={product.name} />
            </div>
          </motion.div>

          {/* Info */}
          <motion.div
            className="product-details-info"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            <span className="product-category-badge">
              {product.category_name || product.category || 'Premium'}
            </span>
            <h1 className="product-title">{product.name}</h1>
            <p className="product-price-large">₹{parseFloat(product.price).toFixed(2)}</p>

            <div className="description-wrapper">
              <p className="product-description">{product.description}</p>
            </div>

            {/* Quantity Selector */}
            <div className="quantity-section">
              <label className="quantity-label">Quantity</label>
              <div className="quantity-selector">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="qty-btn"
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>
                <span className="qty-value">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="qty-btn"
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <button className="btn-primary add-to-cart-btn" onClick={handleAddToCart}>
              <ShoppingBag size={20} />
              Add to Cart
            </button>

            {/* Trust badges */}
            <div className="trust-badges">
              <div className="trust-item">
                <Leaf size={18} />
                <span>100% Organic</span>
              </div>
              <div className="trust-item">
                <Truck size={18} />
                <span>Free Delivery</span>
              </div>
              <div className="trust-item">
                <Shield size={18} />
                <span>Quality Guarantee</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
