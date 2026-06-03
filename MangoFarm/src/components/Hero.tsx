import './Hero.css';

export default function Hero() {
  return (
    <section className="hero">
      <div className="container hero-container">
        <div className="hero-content animate-fade-in">
          <span className="hero-subtitle">The King of Fruits</span>
          <h1 className="hero-title">
            Premium <br/>
            <span className="text-highlight">Banganapalle</span><br/>
            Mangoes
          </h1>
          <p className="hero-description">
            Experience the unmatched sweetness and aroma of authentic, naturally ripened Banganapalle mangoes. Handpicked from the finest orchards.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary">Shop Fresh</button>
            <button className="btn btn-outline">Explore Origin</button>
          </div>
        </div>
        <div className="hero-image-wrap delay-200">
          <div className="mango-glow"></div>
          <img 
            src="/assets/images/hero_banner_transparent.png" 
            alt="Banganapalle Mango Banner" 
            className="hero-mango-img" 
          />
        </div>
      </div>
    </section>
  );
}
