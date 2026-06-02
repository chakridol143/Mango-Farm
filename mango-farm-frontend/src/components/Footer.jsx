import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-logo">
          <img src="/images/Final_Logo.png" alt="Mango Farm" />
        </div>
        <div className="footer-links">
          <div>
            <h4>Shop</h4>
            <ul>
              <li><a href="/shop">All Products</a></li>
              <li><a href="/shop">Fresh Mangoes</a></li>
              <li><a href="/shop">Pantry</a></li>
            </ul>
          </div>
          <div>
            <h4>About</h4>
            <ul>
              <li><a href="#">Our Farm</a></li>
              <li><a href="#">Sustainability</a></li>
              <li><a href="#">Contact Us</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Sun & Mango (Mango Box). All rights reserved.</p>
      </div>
    </footer>
  );
}
