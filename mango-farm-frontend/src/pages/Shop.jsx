import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { ShoppingBag, Filter } from 'lucide-react';
import { useCart } from '../context/CartContext';
import api from '../api/client';
import './Shop.css';

const categoryOf = (p) => p.category_name || p.category || 'General';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [categoryOrder, setCategoryOrder] = useState([]); // category names in sort order
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const { dispatch } = useCart();

  const activeFilter = searchParams.get('category') || 'All';

  useEffect(() => {
    Promise.all([
      api.get('/products'),
      api.get('/categories').catch(() => ({ data: [] })),
    ])
      .then(([pRes, cRes]) => {
        const data = Array.isArray(pRes.data) ? pRes.data : (pRes.data.data || pRes.data.products || []);
        setProducts(data);
        const cats = Array.isArray(cRes.data) ? cRes.data : [];
        setCategoryOrder(cats.map((c) => c.name));
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching shop data', err);
        setLoading(false);
      });
  }, []);

  // Build filter tabs in the catalog's intended order, only for categories present.
  const present = new Set(products.map(categoryOf));
  const ordered = categoryOrder.filter((name) => present.has(name));
  present.forEach((name) => { if (!ordered.includes(name)) ordered.push(name); });
  const categories = ['All', ...ordered];

  const setFilter = (cat) => {
    if (cat === 'All') setSearchParams({});
    else setSearchParams({ category: cat });
  };

  const filteredProducts = activeFilter === 'All'
    ? products
    : products.filter((p) => categoryOf(p) === activeFilter);

  // Display order: keep the catalog order, but always show Rumani last.
  const isRumani = (p) => /rumani/i.test(p.name || '');
  const orderedProducts = [...filteredProducts].sort(
    (a, b) => (isRumani(a) ? 1 : 0) - (isRumani(b) ? 1 : 0)
  );

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

  return (
    <div className="shop-page">
      <div className="container">
        {/* Page Header */}
        <motion.div
          className="shop-hero"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="subtitle">Our Collection</span>
          <h1 className="shop-title">The Harvest Selection</h1>
          <p className="shop-description">
            Discover our curated range of premium mango products, handpicked and delivered fresh from the orchards.
          </p>
        </motion.div>

        {/* Filters */}
        {categories.length > 1 && (
          <motion.div
            className="filter-bar"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Filter size={16} className="filter-icon" />
            {categories.map((cat) => (
              <button
                key={cat}
                className={`filter-btn ${activeFilter === cat ? 'active' : ''}`}
                onClick={() => setFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </motion.div>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Curating collection...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="empty-state">
            <p>No products found in this category.</p>
          </div>
        ) : (
          <div className="shop-grid">
            {orderedProducts.map((product, idx) => (
              <motion.div
                key={product.id || product.product_id || idx}
                className="product-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08, duration: 0.5 }}
              >
                <Link to={`/shop/${product.id || product.product_id}`} className="product-card-link">
                  <div className="product-image-wrap">
                    <img
                      src={product.image_url || product.image}
                      alt={product.name}
                      className="product-image"
                    />
                    {product.stock !== undefined && product.stock < 10 && (
                      <span className="badge badge-limited">Limited Stock</span>
                    )}
                  </div>
                  <div className="product-info">
                    <span className="product-category">
                      {product.category_name || product.category || 'Premium'}
                    </span>
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-desc">
                      {product.description ? product.description.slice(0, 70) + '...' : 'Premium mango product'}
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
                    <ShoppingBag size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
