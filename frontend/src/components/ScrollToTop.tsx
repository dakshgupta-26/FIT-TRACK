import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

/**
 * Global ScrollToTop Component
 * Ensures every internal route navigation resets the scroll position to top (0, 0),
 * while respecting browser Back/Forward (POP) navigation history restoration.
 */
export const ScrollToTop = () => {
  const { pathname } = useLocation();
  const navType = useNavigationType();

  useEffect(() => {
    // Only reset scroll for PUSH or REPLACE actions (user clicks a link or programmatic navigate)
    // Do NOT scroll to top on POP (browser Back/Forward button clicks)
    if (navType !== 'POP') {
      // 1. Reset standard browser scroll immediately
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant' as ScrollBehavior,
      });
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;

      // 2. If Lenis smooth scroll instance exists on window, sync it to top
      if (typeof window !== 'undefined' && (window as any).lenis) {
        try {
          (window as any).lenis.scrollTo(0, { immediate: true });
        } catch (e) {
          // Fallback handled by window.scrollTo
        }
      }
    }
  }, [pathname, navType]);

  return null;
};

export default ScrollToTop;
