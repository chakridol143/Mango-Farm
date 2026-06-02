import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { ArrowLeft } from 'lucide-react';
import axios from 'axios';
import './ProductDetails.css';

export default function ProductDetails() {
  const { id } = useParams();
  const { dispatch } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch specific product from backend
    axios.get(`http://localhost:3000/api/products/${id}`)
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

  if (loading) {
    return <div className="container" style={{ paddingTop: '150px' }}>Loading...</div>;
  }

  if (!product) {
    return <div className="container" style={{ paddingTop: '150px' }}>Product not found</div>;
  }

  return (
    <div className="product-details-page">
      <div className="container">
        <Link to="/shop" className="back-link">
          <ArrowLeft size={16} strokeWidth={1.5} /> Back to Collection
        </Link>
        <div className="product-details-grid">
          <motion.div 
            className="product-details-image"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <img src={product.image_url || product.image} alt={product.name} />
          </motion.div>
          
          <motion.div 
            className="product-details-info"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <span className="category">{product.category_name || product.category || 'Premium'}</span>
            <h1 className="heading-lg">{product.name}</h1>
            <p className="price">${parseFloat(product.price).toFixed(2)}</p>
            <div className="description-wrapper">
              <p className="description">{product.description}</p>
            </div>
            
            <button 
              className="btn-primary add-to-cart-btn"
              onClick={() => dispatch({ type: 'ADD_ITEM', payload: { ...product, id: product.id || product.product_id, image: product.image_url || product.image, price: parseFloat(product.price) } })}
            >
              Add to Cart
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
