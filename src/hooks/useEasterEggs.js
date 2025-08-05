import { useEffect, useRef, useState } from 'react';

export default function useEasterEggs() {
  const [showBlooper, setShowBlooper] = useState(false);

  // Konami code tracking
  const konamiRef = useRef({
    seq: ['arrowup','arrowup','arrowdown','arrowdown','arrowleft','arrowright','arrowleft','arrowright','b','a'],
    keys: [],
  });

  useEffect(() => {
    const onKey = (e) => {
      const k = e.key.toLowerCase();

      // Konami code
      const { seq, keys } = konamiRef.current;
      keys.push(k);
      if (keys.length > seq.length) keys.shift();
      if (seq.every((v, i) => v === keys[i])) {
        setShowBlooper(true);
        konamiRef.current.keys = [];
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Logo glitch on double-click
  useEffect(() => {
    const logo = document.querySelector('#navbar-logo');
    if (!logo) return;

    const glitch = () => {
      logo.classList.add('glitch');
      setTimeout(() => logo.classList.remove('glitch'), 2000);
    };

    logo.addEventListener('dblclick', glitch);
    return () => logo.removeEventListener('dblclick', glitch);
  }, []);

  return { showBlooper, setShowBlooper };
}
