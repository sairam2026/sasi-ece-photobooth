import { useEffect, useRef } from 'react';

export const useIntersectionObserver = (callback, options = {}) => {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) callback();
    }, { threshold: 0.1, ...options });

    observer.observe(element);
    return () => observer.disconnect();
  }, [callback, options]);

  return ref;
};
