import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-brand">
          <h2 className="footer-logo">Mango<span>Farm</span></h2>
          <p className="footer-desc">Delivering the authentic taste of premium Banganapalle mangoes directly from our orchards to your doorstep.</p>
        </div>
        <div className="footer-links">
          <div className="link-group">
            <h3>Shop</h3>
            <a href="#">Fresh Mangoes</a>
            <a href="#">Dried Fruits</a>
            <a href="#">Puree & Nectar</a>
          </div>
          <div className="link-group">
            <h3>Company</h3>
            <a href="#">Our Story</a>
            <a href="#">Sustainability</a>
            <a href="#">Contact Us</a>
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
