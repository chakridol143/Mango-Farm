import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sun, Leaf, Truck, Heart, Sprout, HandHeart, ClipboardCheck, PackageCheck } from 'lucide-react';
import './About.css';

const VALUES = [
  {
    icon: Sun,
    title: 'Naturally Ripened',
    desc: 'Sun-ripened on the tree and rested in hay — never artificially forced with carbide or chemicals.',
  },
  {
    icon: Leaf,
    title: 'Chemical-Free',
    desc: 'No pesticides on the fruit, no wax, no preservatives. Just clean mangoes the way nature intended.',
  },
  {
    icon: Truck,
    title: 'Farm to Doorstep',
    desc: 'Plucked to order and shipped within 24 hours, so the fruit that reaches you is the fruit we picked.',
  },
  {
    icon: Heart,
    title: 'Grown with Care',
    desc: 'Every tree is tended by hand, every fruit hand-selected. Quality is personal to us, not a slogan.',
  },
];

const TIMELINE = [
  {
    icon: Sprout,
    step: '01',
    title: 'Spring Blossom',
    desc: 'In February the orchards turn gold with blossom. We let only the healthiest flowers set fruit, thinning the rest so each mango grows full and sweet.',
  },
  {
    icon: HandHeart,
    step: '02',
    title: 'Hand Harvest',
    desc: 'When the fruit reaches the perfect stage of maturity, it is cut by hand with the stalk intact — never shaken loose or dropped — to protect every mango.',
  },
  {
    icon: Sun,
    step: '03',
    title: 'Natural Ripening',
    desc: 'The mangoes are laid to rest in beds of dry hay and ripened slowly by warmth alone. No carbide, no ethylene, no shortcuts — only patience.',
  },
  {
    icon: ClipboardCheck,
    step: '04',
    title: 'Quality Inspection',
    desc: 'Each fruit is inspected by hand for ripeness, aroma, and blemish. Only the finest mangoes carry our name; the rest never leave the farm.',
  },
  {
    icon: PackageCheck,
    step: '05',
    title: 'Careful Packing',
    desc: 'Graded mangoes are cradled in protective trays and sealed within hours, then dispatched straight to your door at the peak of freshness.',
  },
];

const STATS = [
  { value: '40+', label: 'Years of Cultivation' },
  { value: '120', label: 'Acres of Orchards' },
  { value: '50K+', label: 'Trees Tended by Hand' },
  { value: '100%', label: 'Naturally Ripened' },
];

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
};

export default function About() {
  return (
    <div className="story-page">
      {/* ═══ Hero ═══ */}
      <section className="story-hero">
        <div className="container story-hero-inner">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="subtitle">Our Story</span>
            <h1 className="story-hero-title">
              Rooted in Tradition,<br />
              <span className="text-highlight">Ripened</span> by the Sun
            </h1>
            <p className="story-hero-desc">
              For three generations, our family has nurtured a single promise — to grow the
              finest, most honest mangoes in India and carry them, untouched by shortcuts,
              from our orchards in Banganapalle to your table.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══ Origin ═══ */}
      <section className="section-padding story-origin">
        <div className="container story-origin-grid">
          <motion.div className="story-origin-media" {...fadeUp} transition={{ duration: 0.8 }}>
            <img src="/assets/images/hero_bg.png" alt="Our mango orchard in Banganapalle" />
            <div className="glass-panel story-origin-badge">
              <span className="story-badge-since">Est. 1984</span>
              <span className="story-badge-place">Banganapalle, Andhra Pradesh</span>
            </div>
          </motion.div>

          <motion.div className="story-origin-text" {...fadeUp} transition={{ duration: 0.8, delay: 0.15 }}>
            <span className="subtitle">Where It Began</span>
            <h2 className="title">From a Single Orchard to a Family Legacy</h2>
            <p className="description">
              Our roots run deep in the red soil of Banganapalle — the very village that gave
              the world its most celebrated mango. What began in 1984 as a modest grove tended
              by our grandfather has grown into orchards stretching across the valley, yet our
              way of farming has never changed.
            </p>
            <p className="description">
              We still believe a great mango cannot be hurried. It must be allowed to drink the
              sun, swell on the branch, and ripen in its own time. That patience is the secret
              behind the deep golden flesh, the honeyed aroma, and the buttery sweetness our
              customers have trusted for decades.
            </p>
            <p className="story-signature">— The MangoFarm Family</p>
          </motion.div>
        </div>
      </section>

      {/* ═══ Stats ═══ */}
      <section className="story-stats">
        <div className="container story-stats-grid">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              className="story-stat"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <span className="story-stat-value">{s.value}</span>
              <span className="story-stat-label">{s.label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══ Values ═══ */}
      <section className="section-padding story-values">
        <div className="container">
          <motion.div className="section-header" {...fadeUp} transition={{ duration: 0.7 }}>
            <span className="subtitle">What We Stand For</span>
            <h2 className="title">Our Promise in Every Fruit</h2>
            <p className="description">
              These four principles have guided our family since the first harvest — and they
              are the reason our mangoes taste the way they do.
            </p>
          </motion.div>

          <div className="story-values-grid">
            {VALUES.map((v, i) => {
              const Icon = v.icon;
              return (
                <motion.div
                  key={v.title}
                  className="story-value-card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <div className="story-value-icon">
                    <Icon size={26} />
                  </div>
                  <h3>{v.title}</h3>
                  <p>{v.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ Process Timeline ═══ */}
      <section className="section-padding story-process">
        <div className="container">
          <motion.div className="section-header" {...fadeUp} transition={{ duration: 0.7 }}>
            <span className="subtitle">Our Process</span>
            <h2 className="title">From Blossom to Box</h2>
            <p className="description">
              Every mango we send you has travelled a slow, careful journey. Here is how it
              reaches your hands at its very best.
            </p>
          </motion.div>

          <div className="story-timeline">
            {TIMELINE.map((t, i) => {
              const Icon = t.icon;
              return (
                <motion.div
                  key={t.step}
                  className="story-timeline-item"
                  initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="story-timeline-icon">
                    <Icon size={24} />
                  </div>
                  <div className="story-timeline-body">
                    <span className="story-timeline-step">{t.step}</span>
                    <h3>{t.title}</h3>
                    <p>{t.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ Pull Quote ═══ */}
      <section className="story-quote">
        <div className="container">
          <motion.blockquote {...fadeUp} transition={{ duration: 0.8 }}>
            “We don't sell mangoes. We share a season of sunshine, grown the honest way and
            picked at the moment it tastes like home.”
          </motion.blockquote>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="section-padding story-cta">
        <div className="container">
          <motion.div
            className="story-cta-box"
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2>Taste the Difference Patience Makes</h2>
            <p>
              Join thousands of families who've made our naturally ripened mangoes a part of
              their summer. This season's harvest is ready.
            </p>
            <div className="story-cta-actions">
              <Link to="/shop" className="btn btn-primary">Shop the Harvest</Link>
              <Link to="/contact" className="btn btn-outline">Talk to Us</Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
