import { useEffect, useState } from 'react';
import './BootSplash.css';

export default function BootSplash() {
  const [visible, setVisible] = useState(true);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setVisible(false);
    }, 2500); // Start fade out

    const timer2 = setTimeout(() => {
      setRemoved(true);
    }, 3200); // Remove from DOM

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  if (removed) return null;

  return (
    <div className={`boot-splash ${!visible ? 'hidden' : ''}`} aria-hidden="true">
      <div className="boot-stage">
        <div className="boot-logo-wrap">
          <h1 className="boot-logo-text">Mango<span>Farm</span></h1>
        </div>
        <p className="boot-tagline">Purity in Every Bite</p>
        <div className="boot-bar">
          <div className="boot-bar-fill"></div>
        </div>
      </div>
    </div>
  );
}
