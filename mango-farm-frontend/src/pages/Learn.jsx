import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Sun, Snowflake, Utensils, HeartPulse, ChevronDown,
  Sprout, Clock, Droplets, Flame, Apple, ShieldCheck,
} from 'lucide-react';
import './Learn.css';

const VARIETIES = [
  {
    name: 'Banganapalle',
    tag: 'Our Signature',
    season: 'Apr – Jun',
    img: '/assets/images/fresh_mango.png',
    desc: 'The "King of Mangoes" and India\'s first GI-tagged variety. Large, oblong, and fibreless with deep golden flesh and a honeyed, balanced sweetness.',
  },
  {
    name: 'Alphonso',
    tag: 'The Classic',
    season: 'Apr – May',
    img: '/assets/images/dried_mango.png',
    desc: 'Famed worldwide for its rich, creamy texture and saffron-coloured pulp. Intensely aromatic with a luxurious, dessert-like sweetness.',
  },
  {
    name: 'Kesar',
    tag: 'The Aromatic',
    season: 'May – Jun',
    img: '/assets/images/mango_puree.png',
    desc: 'Recognised by its bright saffron pulp and distinctive fragrance. Perfectly balanced sweetness that makes it the star of aamras and desserts.',
  },
];

const GUIDES = [
  {
    icon: Sun,
    title: 'How to Ripen a Mango',
    desc: 'Rest firm mangoes at room temperature, stem-side down, in a paper bag. Check daily — they\'re ready when they yield gently to a soft press and smell sweet at the stem.',
  },
  {
    icon: Snowflake,
    title: 'How to Store Mangoes',
    desc: 'Keep unripe mangoes on the counter, never the fridge. Once ripe, refrigerate for up to 5 days to slow them down, or peel, cube, and freeze for smoothies year-round.',
  },
  {
    icon: Utensils,
    title: 'How to Cut a Mango',
    desc: 'Slice down either side of the flat central stone to get two "cheeks". Score the flesh in a criss-cross grid, press the skin inward to pop the cubes out, and slice them free.',
  },
  {
    icon: HeartPulse,
    title: 'Health Benefits',
    desc: 'A single mango is rich in vitamin C, vitamin A, fibre, and antioxidants — supporting immunity, digestion, eye health, and glowing skin, all in a naturally sweet package.',
  },
];

const RIPEN_STEPS = [
  { icon: Sprout, title: 'Start Firm', desc: 'A fresh mango arrives firm and green-gold. This is normal — it ripens off the tree.' },
  { icon: Clock, title: 'Wait 2–5 Days', desc: 'Leave it at room temperature, away from direct sun. A paper bag speeds it up.' },
  { icon: Droplets, title: 'Check the Smell', desc: 'A ripe mango gives a sweet, fruity aroma at the stem and softens slightly to the touch.' },
  { icon: Apple, title: 'Enjoy or Chill', desc: 'Eat at peak ripeness, or refrigerate for a few days to hold it at its best.' },
];

const NUTRITION = [
  { value: '99', label: 'Calories per cup', unit: 'kcal' },
  { value: '67%', label: 'Daily Vitamin C', unit: '' },
  { value: '3g', label: 'Dietary Fibre', unit: '' },
  { value: '0g', label: 'Cholesterol & Fat', unit: '' },
];

const RECIPES = [
  {
    icon: Droplets,
    title: 'Classic Mango Lassi',
    time: '5 min',
    desc: 'Blend ripe mango pulp with chilled yoghurt, a touch of honey, and a pinch of cardamom. Serve over ice for the ultimate summer cooler.',
  },
  {
    icon: Flame,
    title: 'Aamras',
    time: '10 min',
    desc: 'Hand-mash sweet Banganapalle pulp with a hint of saffron and cardamom. Serve with warm puri for a timeless Indian classic.',
  },
  {
    icon: Apple,
    title: 'Fresh Mango Salsa',
    time: '15 min',
    desc: 'Dice mango with red onion, coriander, lime, and chilli. A bright, tangy topping for grilled fish, tacos, or crisp papad.',
  },
];

const FAQS = [
  {
    q: 'Are your mangoes artificially ripened with carbide?',
    a: 'Never. Calcium carbide is unsafe and banned for food use. We ripen every mango naturally in beds of hay using only warmth and time, exactly the way it has been done for generations.',
  },
  {
    q: 'Why did my mango arrive firm and not soft?',
    a: 'That is intentional and a sign of a naturally grown fruit. We pick at the perfect stage of maturity and ship before full ripening so it survives the journey. Rest it at room temperature for 2–5 days and it will ripen to perfection.',
  },
  {
    q: 'What does the small black spot or sap mark mean?',
    a: 'Minor natural marks and a little dried sap near the stem are signs of a tree-ripened, hand-picked mango — not a defect. The flesh inside remains flawless.',
  },
  {
    q: 'How long do ripe mangoes last?',
    a: 'Once ripe, mangoes keep for 4–5 days in the refrigerator. To enjoy them for longer, peel and cube the flesh and freeze it for up to six months — perfect for smoothies and desserts.',
  },
  {
    q: 'Can diabetics eat mangoes?',
    a: 'In moderation, yes. Mangoes have a moderate glycaemic index and are rich in fibre and antioxidants. We always recommend speaking with your doctor about portion sizes that suit you.',
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
};

function FaqItem({ item, isOpen, onToggle }) {
  return (
    <div className={`learn-faq-item ${isOpen ? 'open' : ''}`}>
      <button className="learn-faq-q" onClick={onToggle} aria-expanded={isOpen}>
        <span>{item.q}</span>
        <ChevronDown size={20} className="learn-faq-chevron" />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            className="learn-faq-a-wrap"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
          >
            <p className="learn-faq-a">{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Learn() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="learn-page">
      {/* ═══ Hero ═══ */}
      <section className="learn-hero">
        <div className="container learn-hero-inner">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="subtitle">The Mango Almanac</span>
            <h1 className="learn-hero-title">
              The Art &amp; Science of the <span className="text-highlight">King of Fruits</span>
            </h1>
            <p className="learn-hero-desc">
              Everything you need to choose, ripen, store, and savour the perfect mango —
              from our orchard to your kitchen. Become a true connoisseur of the season.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══ Quick Guides ═══ */}
      <section className="section-padding learn-guides">
        <div className="container">
          <motion.div className="section-header" {...fadeUp} transition={{ duration: 0.7 }}>
            <span className="subtitle">Essentials</span>
            <h2 className="title">Mango, Mastered</h2>
            <p className="description">
              Four quick lessons that take you from "just bought" to "perfectly enjoyed".
            </p>
          </motion.div>

          <div className="learn-guides-grid">
            {GUIDES.map((g, i) => {
              const Icon = g.icon;
              return (
                <motion.div
                  key={g.title}
                  className="learn-guide-card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <div className="learn-guide-icon"><Icon size={26} /></div>
                  <h3>{g.title}</h3>
                  <p>{g.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ Varieties ═══ */}
      <section className="section-padding learn-varieties">
        <div className="container">
          <motion.div className="section-header" {...fadeUp} transition={{ duration: 0.7 }}>
            <span className="subtitle">Know Your Mangoes</span>
            <h2 className="title">A Guide to the Great Varieties</h2>
            <p className="description">
              India grows over a thousand kinds of mango. Here are the legends worth knowing —
              starting with our pride and joy.
            </p>
          </motion.div>

          <div className="learn-variety-grid">
            {VARIETIES.map((v, i) => (
              <motion.article
                key={v.name}
                className={`learn-variety-card ${i === 0 ? 'featured' : ''}`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
              >
                <div className="learn-variety-media">
                  <img src={v.img} alt={v.name} />
                  <span className="learn-variety-tag">{v.tag}</span>
                </div>
                <div className="learn-variety-body">
                  <div className="learn-variety-head">
                    <h3>{v.name}</h3>
                    <span className="learn-variety-season">{v.season}</span>
                  </div>
                  <p>{v.desc}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Ripening Guide ═══ */}
      <section className="section-padding learn-ripen">
        <div className="container">
          <motion.div className="section-header" {...fadeUp} transition={{ duration: 0.7 }}>
            <span className="subtitle">The Right Way</span>
            <h2 className="title">How to Ripen Naturally at Home</h2>
            <p className="description">
              Our mangoes arrive firm on purpose — never force-ripened. Follow these four
              simple steps and let nature finish the job.
            </p>
          </motion.div>

          <div className="learn-ripen-grid">
            {RIPEN_STEPS.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.title}
                  className="learn-ripen-step"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <div className="learn-ripen-num">{i + 1}</div>
                  <Icon size={28} className="learn-ripen-icon" />
                  <h4>{s.title}</h4>
                  <p>{s.desc}</p>
                </motion.div>
              );
            })}
          </div>

          <motion.div className="learn-carbide-note" {...fadeUp} transition={{ duration: 0.6 }}>
            <ShieldCheck size={28} />
            <div>
              <h4>Our No-Carbide Promise</h4>
              <p>
                We never use calcium carbide or any artificial ripening agent. If a mango looks
                uniformly yellow yet stays hard, or smells of chemicals, it has been forced —
                ours never will be.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ Nutrition ═══ */}
      <section className="learn-nutrition">
        <div className="container learn-nutrition-inner">
          <motion.div className="learn-nutrition-text" {...fadeUp} transition={{ duration: 0.7 }}>
            <span className="subtitle learn-subtitle-light">Goodness in Every Bite</span>
            <h2>Nature's Sweetest Multivitamin</h2>
            <p>
              Beyond its irresistible taste, the mango is a genuine superfruit — packed with
              immunity-boosting vitamin C, eye-friendly vitamin A, gut-loving fibre, and a
              wealth of antioxidants, all with zero cholesterol.
            </p>
          </motion.div>
          <div className="learn-nutrition-grid">
            {NUTRITION.map((n, i) => (
              <motion.div
                key={n.label}
                className="learn-nutrition-stat"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <span className="learn-nutrition-value">{n.value}</span>
                <span className="learn-nutrition-label">{n.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Recipes ═══ */}
      <section className="section-padding learn-recipes">
        <div className="container">
          <motion.div className="section-header" {...fadeUp} transition={{ duration: 0.7 }}>
            <span className="subtitle">From the Kitchen</span>
            <h2 className="title">Three Ways to Savour the Season</h2>
            <p className="description">
              Simple, beloved recipes that let the natural sweetness of a great mango shine.
            </p>
          </motion.div>

          <div className="learn-recipe-grid">
            {RECIPES.map((r, i) => {
              const Icon = r.icon;
              return (
                <motion.div
                  key={r.title}
                  className="learn-recipe-card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <div className="learn-recipe-head">
                    <div className="learn-recipe-icon"><Icon size={22} /></div>
                    <span className="learn-recipe-time"><Clock size={14} /> {r.time}</span>
                  </div>
                  <h3>{r.title}</h3>
                  <p>{r.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="section-padding learn-faq">
        <div className="container learn-faq-inner">
          <motion.div className="section-header" {...fadeUp} transition={{ duration: 0.7 }}>
            <span className="subtitle">Good to Know</span>
            <h2 className="title">Frequently Asked Questions</h2>
          </motion.div>

          <motion.div className="learn-faq-list" {...fadeUp} transition={{ duration: 0.6 }}>
            {FAQS.map((item, i) => (
              <FaqItem
                key={item.q}
                item={item}
                isOpen={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? -1 : i)}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="section-padding learn-cta">
        <div className="container">
          <motion.div
            className="learn-cta-box"
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2>Now Put It Into Practice</h2>
            <p>You know the secrets of the perfect mango. This season's naturally ripened harvest is waiting.</p>
            <Link to="/shop" className="btn btn-primary">Shop Fresh Mangoes</Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
