import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, User, LogOut, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import './Header.css';

export default function Header() {
  const { count, dispatch } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 20);

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleLogout = () => {
    logout();
    setAccountOpen(false);
    navigate('/');
  };

  return (
    <motion.header
      className={`navbar ${scrolled ? 'scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: hidden ? '-100%' : 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="container nav-container">
        <Link to="/" className="logo-container">
          <img src="/images/Final_Logo.png" alt="MangoFarm" className="header-logo-img" />
        </Link>

        <nav className="nav-links">
          <Link to="/">HOME</Link>
          <Link to="/shop">SHOP</Link>
          <Link to="/about">OUR STORY</Link>
          <Link to="/learn">LEARN</Link>
          <Link to="/contact">CONTACT US</Link>
        </nav>

        <div className="nav-actions">
          {isAuthenticated ? (
            <div className="account-menu">
              <button
                className="icon-btn account-trigger"
                aria-label="Account"
                onClick={() => setAccountOpen((open) => !open)}
              >
                <User size={20} />
                <span className="account-name">{(user?.name || 'Account').split(' ')[0]}</span>
              </button>
              <AnimatePresence>
                {accountOpen && (
                  <motion.div
                    className="account-dropdown"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link to="/orders" onClick={() => setAccountOpen(false)}>
                      <Package size={16} /> My Orders
                    </Link>
                    <button onClick={handleLogout}>
                      <LogOut size={16} /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link to="/login" className="icon-btn" aria-label="Sign In">
              <User size={20} />
            </Link>
          )}
          <button
            className="cart-btn"
            onClick={() => dispatch({ type: 'TOGGLE_CART' })}
            aria-label="Cart"
          >
            <ShoppingCart size={20} />
            {count > 0 && <span className="cart-badge">{count}</span>}
          </button>
          <button
            className="menu-btn"
            aria-label="Menu"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            className="mobile-nav"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
          >
            <Link to="/" onClick={() => setMobileOpen(false)}>HOME</Link>
            <Link to="/shop" onClick={() => setMobileOpen(false)}>SHOP</Link>
            <Link to="/about" onClick={() => setMobileOpen(false)}>OUR STORY</Link>
            <Link to="/learn" onClick={() => setMobileOpen(false)}>LEARN</Link>
            <Link to="/contact" onClick={() => setMobileOpen(false)}>CONTACT US</Link>
            {isAuthenticated ? (
              <>
                <Link to="/orders" onClick={() => setMobileOpen(false)}>MY ORDERS</Link>
                <button
                  className="mobile-logout"
                  onClick={() => { setMobileOpen(false); handleLogout(); }}
                >
                  LOGOUT
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMobileOpen(false)}>SIGN IN</Link>
            )}
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
