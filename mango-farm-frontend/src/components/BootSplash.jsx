import { useEffect, useState } from 'react';
import './BootSplash.css';

export default function BootSplash() {
  const [visible, setVisible] = useState(true);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    // Longer, more relaxed loading time
    const timer1 = setTimeout(() => {
      setVisible(false);
    }, 4500);

    const timer2 = setTimeout(() => {
      setRemoved(true);
    }, 5500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  if (removed) return null;

  return (
    <div className={`boot-splash ${!visible ? 'hidden' : ''}`} aria-hidden="true">
      {/* Elegant atmospheric background glow */}
      <div className="boot-ambient-glow"></div>

      <div className="boot-stage">
        <div className="boot-logo-reveal">
          <img
            src="/images/Final_Logo.png"
            alt="MangoFarm"
            className="boot-logo-img"
          />
        </div>

        <p className="boot-tagline">Purity in Every Bite</p>

        <div className="boot-loader">
          <div className="boot-loader-line"></div>
        </div>
      </div>
    </div>
  );
}
