import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:3000/api/products')
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : (res.data.data || res.data.products || []);
        setFeaturedProducts(data.slice(0, 3));
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching featured products', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="home">
      <section className="editorial-hero">
        <div className="container hero-grid">
          <motion.div 
            className="hero-text"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="heading-xl">
              Harvested<br/>
              <em>with</em> Soul.
            </h1>
            <p className="hero-description">
              Elevating the organic mango experience. Cultivated in the finest soils and hand-selected for an unparalleled taste.
            </p>
            <Link to="/shop" className="btn-primary">Explore Collection</Link>
          </motion.div>

          <motion.div 
            className="hero-image-wrapper"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            <img src="/images/hero.png" alt="Mango Farm Harvest" className="hero-image" />
          </motion.div>
        </div>
      </section>

      <section className="gallery-section">
        <div className="container">
          <motion.div 
            className="gallery-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <span className="section-kicker">Curated Selection</span>
            <h2 className="heading-lg">Signature Editions</h2>
          </motion.div>

          {loading ? (
            <div className="loading" style={{ textAlign: 'center', fontStyle: 'italic' }}>Curating collection...</div>
          ) : (
            <div className="editorial-grid">
              {featuredProducts.map((product, idx) => (
                <motion.div 
                  key={product.id || product.product_id || idx}
                  className={`editorial-card item-${idx}`}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: idx * 0.15 }}
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
      </section>
    </div>
  );
}
