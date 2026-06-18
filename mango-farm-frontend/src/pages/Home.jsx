import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ShoppingBag, Leaf, Truck, Shield, Star, ArrowRight, Quote,
  Sprout, Sun, PackageCheck, Mail, Check,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import api from '../api/client';
import './Home.css';

const STEPS = [
  { icon: Sprout, title: 'Hand-Picked', desc: 'Cut by hand at peak maturity from our family orchards.' },
  { icon: Sun, title: 'Naturally Ripened', desc: 'Rested in hay and ripened by warmth — never carbide.' },
  { icon: PackageCheck, title: 'Carefully Packed', desc: 'Cushioned and sealed within hours of selection.' },
  { icon: Truck, title: 'Delivered Fresh', desc: 'At your door in 2–4 days, at the peak of flavour.' },
];

const TESTIMONIALS = [
  {
    name: 'Priya Sharma',
    location: 'Bengaluru',
    rating: 5,
    text: 'The sweetest, most aromatic mangoes I have had since childhood. You can actually taste that they are naturally ripened — no chemical aftertaste at all.',
  },
  {
    name: 'Rahul Verma',
    location: 'Mumbai',
    rating: 5,
    text: 'Ordered the Royale Box as a gift for my parents. Stunning packaging and every single mango was flawless. This is now our family tradition.',
  },
  {
    name: 'Ananya Iyer',
    location: 'Hyderabad',
    rating: 5,
    text: 'Farm-fresh, delivered in two days, and ripened to perfection on my counter exactly as described. Honestly worth every rupee.',
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
};

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { dispatch } = useCart();

  useEffect(() => {
    api.get('/products')
      .then((pRes) => {
        const data = Array.isArray(pRes.data) ? pRes.data : (pRes.data.data || pRes.data.products || []);
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching home data', err);
        setLoading(false);
      });
  }, []);

  const featuredProducts = products.slice(0, 3);

  const handleAddToCart = (product) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        ...product,
        id: product.id || product.product_id,
        image: product.image_url || product.image,
        price: parseFloat(product.price),
      },
    });
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) setSubscribed(true);
  };

  return (
    <div className="home">
      {/* ═══ Hero ═══ */}
      <section className="hero">
        <div className="container hero-container">
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="hero-subtitle">The King of Fruits</span>
            <h1 className="hero-title">
              Premium <br />
              <span className="text-highlight">Banganapalle</span><br />
              Mangoes
            </h1>
            <p className="hero-description">
              Experience the unmatched sweetness and aroma of authentic, naturally ripened Banganapalle mangoes. Handpicked from the finest orchards.
            </p>
            <div className="hero-actions">
              <Link to="/shop" className="btn btn-primary">Shop Fresh</Link>
              <Link to="/about" className="btn btn-outline">Explore Origin</Link>
            </div>
            <div className="hero-trust">
              <div className="hero-stars">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
              </div>
              <span>Loved by <strong>10,000+</strong> families across India</span>
            </div>
          </motion.div>

          <motion.div
            className="hero-image-wrap"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            <div className="mango-glow"></div>
            <img
              src="/assets/images/hero_banner_transparent.png"
              alt="Banganapalle Mango Banner"
              className="hero-mango-img"
            />
          </motion.div>
        </div>
      </section>

      {/* ═══ Features Bar ═══ */}
      <section className="features-bar">
        <div className="container features-container">
          {[
            { Icon: Leaf, h: '100% Organic', p: 'Naturally grown, zero chemicals' },
            { Icon: Truck, h: 'Farm Direct', p: 'Shipped within 24 hours' },
            { Icon: Shield, h: 'Quality Assured', p: 'Every fruit hand-inspected' },
          ].map((f, i) => (
            <motion.div
              key={f.h}
              className="feature-item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <f.Icon size={28} className="feature-icon" />
              <div>
                <h4>{f.h}</h4>
                <p>{f.p}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══ Promo Banner ═══ */}
      <section className="section-padding promo-banner-section">
        <div className="container">
          <motion.div className="promo-banner" {...fadeUp} transition={{ duration: 0.7 }}>
            <Link to="/shop" className="promo-banner-media" aria-label="Shop our mangoes">
              <img
                src="/images/promo-banner.jpeg"
                alt="Naturally ripened Banganapalli mangoes — straight from Chittoor farms"
              />
            </Link>
            <div className="promo-banner-cta">
              <Link to="/shop" className="btn btn-primary promo-banner-btn">
                Shop Now <ArrowRight size={18} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ About Section ═══ */}
      <section id="about" className="section-padding about-section">
        <div className="container about-container">
          <motion.div
            className="about-image-wrap"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <div className="glass-panel about-card">
              <h3 className="card-title">100% Natural</h3>
              <p className="card-desc">Carbide-free, naturally ripened.</p>
            </div>
            <img src="/assets/images/hero_bg.png" alt="Mango Orchard" className="about-image" />
          </motion.div>

          <motion.div
            className="about-content"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            <span className="subtitle">Our Story</span>
            <h2 className="title">Cultivating the Finest Banganapalle</h2>
            <p className="description">
              For generations, we have nurtured our orchards to bring you the authentic taste of Banganapalle mangoes. Every mango is handpicked at the perfect moment of ripeness.
            </p>
            <ul className="benefits-list">
              <li><strong>Zero Artificial Ripening:</strong> We let nature do its work.</li>
              <li><strong>Direct from Farm:</strong> Plucked and shipped directly to your door.</li>
              <li><strong>Premium Selection:</strong> Only the largest, most unblemished fruits make the cut.</li>
            </ul>
            <Link to="/about" className="btn btn-outline" style={{ marginTop: '2rem' }}>
              Read Our Full Story
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══ Featured Products ═══ */}
      <section className="section-padding products-section">
        <div className="container">
          <motion.div className="section-header" {...fadeUp} transition={{ duration: 0.8 }}>
            <span className="subtitle">From Farm to Home</span>
            <h2 className="title">Our Premium Harvest</h2>
            <p className="description">
              Explore our finest selection of Banganapalle mangoes and natural mango products.
            </p>
          </motion.div>

          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Curating collection...</p>
            </div>
          ) : (
            <div className="products-grid">
              {featuredProducts.map((product, idx) => (
                <motion.div
                  key={product.id || product.product_id || idx}
                  className={`product-card ${idx === 0 ? 'highlight-card' : ''}`}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: idx * 0.12 }}
                >
                  <Link to={`/shop/${product.id || product.product_id}`} className="product-card-link">
                    <div className="product-image-wrap">
                      <img
                        src={product.image_url || product.image}
                        alt={product.name}
                        className="product-image"
                      />
                      {idx === 0 && <span className="badge">Bestseller</span>}
                    </div>
                    <div className="product-info">
                      <h3 className="product-name">{product.name}</h3>
                      <p className="product-desc">
                        {product.description ? product.description.slice(0, 80) + '...' : 'Premium mango product'}
                      </p>
                    </div>
                  </Link>
                  <div className="product-footer">
                    <span className="product-price">₹{parseFloat(product.price).toFixed(2)}</span>
                    <button
                      className="add-btn"
                      aria-label="Add to cart"
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingBag size={20} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <motion.div
            className="view-all-wrap"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link to="/shop" className="btn btn-outline">View All Products</Link>
          </motion.div>
        </div>
      </section>

      {/* ═══ From Orchard to Doorstep ═══ */}
      <section className="section-padding process-section">
        <div className="container">
          <motion.div className="section-header" {...fadeUp} transition={{ duration: 0.7 }}>
            <span className="subtitle">How It Works</span>
            <h2 className="title section-title-light">From Orchard to Your Doorstep</h2>
            <p className="description description-light">
              Four careful steps stand between our trees and your table.
            </p>
          </motion.div>

          <div className="process-grid">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.title}
                className="process-step"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="process-icon"><s.icon size={26} /></div>
                <span className="process-num">Step {i + 1}</span>
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Testimonials ═══ */}
      <section className="section-padding testimonials-section">
        <div className="container">
          <motion.div className="section-header" {...fadeUp} transition={{ duration: 0.7 }}>
            <span className="subtitle">Kind Words</span>
            <h2 className="title">Loved Across India</h2>
            <p className="description">
              Thousands of families trust MangoFarm for their summer's sweetest moments.
            </p>
          </motion.div>

          <div className="testimonials-grid">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                className="testimonial-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
              >
                <Quote size={32} className="testimonial-quote" />
                <div className="testimonial-stars">
                  {[...Array(t.rating)].map((_, s) => <Star key={s} size={16} fill="currentColor" />)}
                </div>
                <p className="testimonial-text">{t.text}</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{t.name.charAt(0)}</div>
                  <div>
                    <span className="testimonial-name">{t.name}</span>
                    <span className="testimonial-location">{t.location}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Seasonal Harvest CTA ═══ */}
      <section className="harvest-cta">
        <div className="harvest-glow"></div>
        <div className="container harvest-inner">
          <motion.div {...fadeUp} transition={{ duration: 0.7 }}>
            <span className="harvest-badge">Now In Season</span>
            <h2>This Season's Harvest Is Here</h2>
            <p>
              Our orchards are at their golden peak. Order today and taste sunshine — naturally
              ripened, hand-picked, and rushed to your door at the very moment it tastes like home.
            </p>
            <Link to="/shop" className="btn btn-primary harvest-btn">
              Order This Season's Box <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══ Newsletter ═══ */}
      <section className="section-padding newsletter-section">
        <div className="container">
          <motion.div className="newsletter-box" {...fadeUp} transition={{ duration: 0.7 }}>
            <div className="newsletter-text">
              <Mail size={30} className="newsletter-icon" />
              <h2>Join the Orchard List</h2>
              <p>Be first to know when each variety is in season, plus subscriber-only offers and recipes.</p>
            </div>
            {subscribed ? (
              <div className="newsletter-success">
                <Check size={22} />
                <span>You're on the list! Watch your inbox for the next harvest.</span>
              </div>
            ) : (
              <form className="newsletter-form" onSubmit={handleSubscribe}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  aria-label="Email address"
                />
                <button type="submit" className="btn btn-primary">Subscribe</button>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
