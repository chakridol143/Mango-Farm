import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Resets scroll to the top of the page whenever the route path changes.
// Plays nicely with Lenis (smooth scroll) by resetting its instance directly,
// and leaves in-page #anchor links (e.g. /#about) to scroll themselves.
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) return; // an anchor target was requested — don't override it

    if (window.__lenis) {
      window.__lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}
