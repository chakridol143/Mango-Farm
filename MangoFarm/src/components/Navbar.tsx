import { ShoppingCart, Menu } from 'lucide-react';
import { useState, useEffect } from 'react';
import './Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-container">
        <a href="/" className="logo">
          Mango<span>Farm</span>
        </a>
        <nav className="nav-links">
          <a href="#about">Our Story</a>
          <a href="#products">Products</a>
          <a href="#features">Benefits</a>
        </nav>
        <div className="nav-actions">
          <button className="cart-btn" aria-label="Cart">
            <ShoppingCart size={20} />
            <span className="cart-badge">2</span>
          </button>
          <button className="menu-btn" aria-label="Menu">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </header>
  );
}
