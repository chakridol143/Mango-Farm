import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Shop.css';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch from backend
    axios.get('http://localhost:3000/api/products')
      .then(res => {
        // Handle varying backend responses (could be directly the array, or wrapped in an object/data)
        const data = Array.isArray(res.data) ? res.data : (res.data.data || res.data.products || []);
        
        // If data is empty but we seeded firestore, ensure we parse correctly, assuming the backend uses the products collection
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching products', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="shop-page">
      <div className="container">
        <motion.div 
          className="shop-header"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="heading-lg">The Collection</h1>
        </motion.div>

        {loading ? (
          <div className="loading">Curating collection...</div>
        ) : (
          <div className="shop-grid">
            {products.map((product, idx) => (
              <motion.div 
                key={product.id || product.product_id || idx}
                className="shop-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Link to={`/shop/${product.id || product.product_id}`} className="card-link">
                  <div className="card-image">
                    <img src={product.image_url || product.image} alt={product.name} />
                  </div>
                  <div className="card-meta">
                    <h3 className="heading-md">{product.name}</h3>
                    <span className="card-price">${parseFloat(product.price).toFixed(2)}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
