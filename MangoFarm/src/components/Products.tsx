import { ShoppingBag } from 'lucide-react';
import './Products.css';

const products = [
  {
    id: 1,
    name: "Fresh Banganapalle Mangoes",
    description: "The crown jewel. Sweet, aromatic, and perfectly ripened.",
    price: "₹899 / Dozen",
    image: "/assets/images/fresh_mango.png",
    highlight: true,
  },
  {
    id: 2,
    name: "Premium Dried Mango",
    description: "Sun-dried to perfection. Zero added sugar. The perfect healthy snack.",
    price: "₹450 / 200g",
    image: "/assets/images/dried_mango.png",
  },
  {
    id: 3,
    name: "Organic Mango Puree",
    description: "Rich, velvety puree made from 100% organic Banganapalle mangoes.",
    price: "₹350 / 500ml",
    image: "/assets/images/mango_puree.png",
  }
];

export default function Products() {
  return (
    <section id="products" className="section-padding products-section">
      <div className="container">
        <div className="section-header text-center">
          <span className="subtitle">From Farm to Home</span>
          <h2 className="title">Our Premium Harvest</h2>
          <p className="description">Explore our finest selection of Banganapalle mangoes and natural mango products.</p>
        </div>

        <div className="products-grid">
          {products.map((product, index) => (
            <div key={product.id} className={`product-card delay-${(index + 1) * 100} ${product.highlight ? 'highlight-card' : ''}`}>
              <div className="product-image-wrap">
                <img src={product.image} alt={product.name} className="product-image" />
                {product.highlight && <span className="badge">Bestseller</span>}
              </div>
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-desc">{product.description}</p>
                <div className="product-footer">
                  <span className="product-price">{product.price}</span>
                  <button className="add-btn" aria-label="Add to cart">
                    <ShoppingBag size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
