import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Phone, Mail, MapPin, Clock, MessageCircle, Send, CheckCircle2,
} from 'lucide-react';
import api from '../api/client';
import './Contact.css';

/* Brand glyphs as inline SVG (lucide removed brand icons in recent versions). */
const IconInstagram = (props) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);
const IconFacebook = (props) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);
const IconX = (props) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

/* ── Editable business details — swap these for the client's real info ── */
const CONTACT = {
  phone: '+91 90528 29111',
  phoneHref: 'tel:+919052829111',
  whatsapp: '+91 90528 29111',
  whatsappHref: 'https://wa.me/919052829111',
  email: 'sunandmango@gmail.com',
  emailHref: 'mailto:sunandmango@gmail.com',
  addressLines: ['MangoFarm Orchards', 'Banganapalle, Nandyal District', 'Andhra Pradesh 518124, India'],
  mapsQuery: 'Banganapalle, Andhra Pradesh, India',
};

const METHODS = [
  {
    icon: Phone,
    title: 'Call Us',
    value: CONTACT.phone,
    href: CONTACT.phoneHref,
    note: 'Mon–Sat, 9am – 7pm IST',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp',
    value: CONTACT.whatsapp,
    href: CONTACT.whatsappHref,
    note: 'Quick replies, order updates',
  },
  {
    icon: Mail,
    title: 'Email Us',
    value: CONTACT.email,
    href: CONTACT.emailHref,
    note: 'We reply within 24 hours',
  },
];

const HOURS = [
  { day: 'Monday – Friday', time: '9:00 AM – 7:00 PM' },
  { day: 'Saturday', time: '9:00 AM – 5:00 PM' },
  { day: 'Sunday', time: 'Closed' },
];

const FAQS = [
  { q: 'When will my mangoes be delivered?', a: 'Orders are dispatched within 24 hours and typically arrive in 2–4 days, depending on your location.' },
  { q: 'Do you take bulk or gifting orders?', a: 'Absolutely. For weddings, corporate gifting, or wholesale, message us on WhatsApp for custom pricing.' },
  { q: 'What if my order arrives damaged?', a: 'We pack with great care, but if anything arrives less than perfect, send us a photo within 48 hours for a quick replacement or refund.' },
];

const SUBJECTS = ['General Enquiry', 'Order Support', 'Bulk / Wholesale', 'Gifting', 'Feedback'];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: SUBJECTS[0], message: '' });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | submitting | success

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Please enter your name';
    if (!form.email.trim()) next.email = 'Please enter your email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Please enter a valid email';
    if (!form.message.trim()) next.message = 'Please tell us how we can help';
    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const next = validate();
    if (Object.keys(next).length) {
      setErrors(next);
      return;
    }
    setStatus('submitting');
    try {
      await api.post('/contact', {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        subject: form.subject,
        message: form.message.trim(),
      });
      setStatus('success');
    } catch (err) {
      setStatus('idle');
      setErrors({
        submit: err.response?.data?.message || 'Could not send your message. Please try again.',
      });
    }
  };

  const fadeUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-80px' },
  };

  return (
    <div className="contact-page">
      {/* ═══ Hero ═══ */}
      <section className="contact-hero">
        <div className="container contact-hero-inner">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="subtitle">Contact Us</span>
            <h1 className="contact-hero-title">
              We'd Love to <span className="text-highlight">Hear</span> From You
            </h1>
            <p className="contact-hero-desc">
              Questions about your order, our orchards, or a bulk request? Our team is here to
              help — reach out and we'll get back to you within a day.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══ Contact Methods ═══ */}
      <section className="contact-methods-section">
        <div className="container contact-methods-grid">
          {METHODS.map((m, i) => {
            const Icon = m.icon;
            return (
              <motion.a
                key={m.title}
                href={m.href}
                target={m.href.startsWith('http') ? '_blank' : undefined}
                rel={m.href.startsWith('http') ? 'noreferrer' : undefined}
                className="contact-method-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="contact-method-icon"><Icon size={24} /></div>
                <h3>{m.title}</h3>
                <span className="contact-method-value">{m.value}</span>
                <span className="contact-method-note">{m.note}</span>
              </motion.a>
            );
          })}
        </div>
      </section>

      {/* ═══ Form + Info ═══ */}
      <section className="section-padding contact-main">
        <div className="container contact-main-grid">
          {/* Form */}
          <motion.div className="contact-form-wrap" {...fadeUp} transition={{ duration: 0.7 }}>
            <span className="subtitle">Send a Message</span>
            <h2 className="title">Drop Us a Line</h2>

            {status === 'success' ? (
              <div className="contact-success">
                <CheckCircle2 size={56} />
                <h3>Thank you, {form.name.split(' ')[0] || 'friend'}!</h3>
                <p>Your message is on its way. Our team will get back to you within 24 hours.</p>
                <button
                  className="btn btn-outline"
                  onClick={() => {
                    setForm({ name: '', email: '', phone: '', subject: SUBJECTS[0], message: '' });
                    setStatus('idle');
                  }}
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit} noValidate>
                <div className="contact-field-row">
                  <div className="contact-field">
                    <label htmlFor="name">Full Name *</label>
                    <input
                      id="name" name="name" type="text" value={form.name}
                      onChange={handleChange} placeholder="Your name"
                      className={errors.name ? 'has-error' : ''}
                    />
                    {errors.name && <span className="contact-error">{errors.name}</span>}
                  </div>
                  <div className="contact-field">
                    <label htmlFor="phone">Phone</label>
                    <input
                      id="phone" name="phone" type="tel" value={form.phone}
                      onChange={handleChange} placeholder="Optional"
                    />
                  </div>
                </div>

                <div className="contact-field-row">
                  <div className="contact-field">
                    <label htmlFor="email">Email *</label>
                    <input
                      id="email" name="email" type="email" value={form.email}
                      onChange={handleChange} placeholder="you@example.com"
                      className={errors.email ? 'has-error' : ''}
                    />
                    {errors.email && <span className="contact-error">{errors.email}</span>}
                  </div>
                  <div className="contact-field">
                    <label htmlFor="subject">Subject</label>
                    <select id="subject" name="subject" value={form.subject} onChange={handleChange}>
                      {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div className="contact-field">
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message" name="message" rows={5} value={form.message}
                    onChange={handleChange} placeholder="How can we help you?"
                    className={errors.message ? 'has-error' : ''}
                  />
                  {errors.message && <span className="contact-error">{errors.message}</span>}
                </div>

                {errors.submit && <span className="contact-error">{errors.submit}</span>}

                <button type="submit" className="btn btn-primary contact-submit" disabled={status === 'submitting'}>
                  {status === 'submitting' ? 'Sending…' : <>Send Message <Send size={18} /></>}
                </button>
              </form>
            )}
          </motion.div>

          {/* Info sidebar */}
          <motion.aside className="contact-info" {...fadeUp} transition={{ duration: 0.7, delay: 0.15 }}>
            <div className="contact-info-card">
              <div className="contact-info-icon"><MapPin size={22} /></div>
              <h3>Visit the Orchard</h3>
              <address>
                {CONTACT.addressLines.map((line) => <span key={line}>{line}</span>)}
              </address>
              <a
                className="contact-info-link"
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONTACT.mapsQuery)}`}
                target="_blank" rel="noreferrer"
              >
                Get Directions →
              </a>
            </div>

            <div className="contact-info-card">
              <div className="contact-info-icon"><Clock size={22} /></div>
              <h3>Business Hours</h3>
              <ul className="contact-hours">
                {HOURS.map((h) => (
                  <li key={h.day}>
                    <span>{h.day}</span>
                    <span className={h.time === 'Closed' ? 'closed' : ''}>{h.time}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="contact-social">
              <span>Follow the harvest</span>
              <div className="contact-social-links">
                <a href="#" aria-label="Instagram"><IconInstagram /></a>
                <a href="#" aria-label="Facebook"><IconFacebook /></a>
                <a href="#" aria-label="X (Twitter)"><IconX /></a>
              </div>
            </div>
          </motion.aside>
        </div>
      </section>

      {/* ═══ Map ═══ */}
      <section className="contact-map-section">
        <motion.div className="contact-map" {...fadeUp} transition={{ duration: 0.7 }}>
          <iframe
            title="MangoFarm location"
            src={`https://maps.google.com/maps?q=${encodeURIComponent(CONTACT.mapsQuery)}&z=11&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </motion.div>
      </section>

      {/* ═══ Quick FAQ ═══ */}
      <section className="section-padding contact-faq">
        <div className="container">
          <motion.div className="section-header" {...fadeUp} transition={{ duration: 0.7 }}>
            <span className="subtitle">Quick Answers</span>
            <h2 className="title">Before You Reach Out</h2>
          </motion.div>
          <div className="contact-faq-grid">
            {FAQS.map((f, i) => (
              <motion.div
                key={f.q}
                className="contact-faq-card"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <h3>{f.q}</h3>
                <p>{f.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
