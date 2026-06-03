import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <img src="/images/Final_Logo.png" alt="MangoFarm" className="footer-logo-img" />
          </Link>
          <p className="footer-desc">
            Delivering the authentic taste of premium Banganapalle mangoes directly from our orchards to your doorstep.
          </p>
        </div>
        <div className="footer-links">
          <div className="link-group">
            <h3>Shop</h3>
            <Link to="/shop">All Products</Link>
            <Link to="/shop">Fresh Mangoes</Link>
            <Link to="/shop">Dried Fruits</Link>
            <Link to="/shop">Puree & Nectar</Link>
          </div>
          <div className="link-group">
            <h3>Company</h3>
            <Link to="/about">Our Story</Link>
            <Link to="/learn">Learn</Link>
            <Link to="/contact">Contact Us</Link>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} MangoFarm. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
