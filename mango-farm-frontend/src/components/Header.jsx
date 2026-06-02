import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';
import './Header.css';

export default function Header() {
  const { count, dispatch } = useCart();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header 
      className={`header ${scrolled ? 'scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="header-container container">
        <div className="header-left">
          <button className="menu-btn"><Menu size={24} strokeWidth={1.5} /></button>
          <nav className="nav-links">
            <Link to="/shop">Shop</Link>
            <Link to="/about">Story</Link>
          </nav>
        </div>
        
        <Link to="/" className="logo-container">
          <img src="/images/Final_Logo.png" alt="Mango Farm" className="header-logo" style={{ height: '60px' }} />
        </Link>
        
        <div className="header-right">
          <Link to="/account" className="nav-link-desktop">Account</Link>
          <button className="cart-btn" onClick={() => dispatch({ type: 'TOGGLE_CART' })}>
            <span>Cart</span>
            {count > 0 && <span className="cart-count">({count})</span>}
          </button>
        </div>
      </div>
    </motion.header>
  );
}
