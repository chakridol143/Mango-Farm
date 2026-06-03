import './About.css';

export default function About() {
  return (
    <section id="about" className="section-padding about-section">
      <div className="container about-container">
        <div className="about-image-wrap delay-200">
          <div className="glass-panel about-card">
            <h3 className="card-title">100% Natural</h3>
            <p className="card-desc">Carbide-free, naturally ripened.</p>
          </div>
          <img src="/assets/images/hero_bg.png" alt="Mango Orchard" className="about-image" />
        </div>
        <div className="about-content">
          <span className="subtitle">Our Story</span>
          <h2 className="title">Cultivating the Finest Banganapalle</h2>
          <p className="description">
            For generations, we have nurtured our orchards to bring you the authentic taste of Banganapalle mangoes. Every mango is handpicked at the perfect moment of ripeness.
          </p>
          <ul className="benefits-list">
            <li>
              <strong>Zero Artificial Ripening:</strong> We let nature do its work.
            </li>
            <li>
              <strong>Direct from Farm:</strong> Plucked and shipped directly to your door.
            </li>
            <li>
              <strong>Premium Selection:</strong> Only the largest, most unblemished fruits make the cut.
            </li>
          </ul>
          <button className="btn btn-outline" style={{ marginTop: '2rem' }}>Learn More</button>
        </div>
      </div>
    </section>
  );
}
