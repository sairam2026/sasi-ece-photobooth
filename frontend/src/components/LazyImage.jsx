import { useState, useRef, useEffect } from 'react';

const LazyImage = ({ src, alt, className = '', thumbSrc }) => {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.disconnect(); } },
      { rootMargin: '200px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`relative overflow-hidden bg-dark-700 ${className}`}>
      {/* Blurred thumbnail placeholder */}
      {thumbSrc && !loaded && (
        <img
          src={thumbSrc}
          alt=""
          className="absolute inset-0 w-full h-full object-cover filter blur-lg scale-110 opacity-60"
        />
      )}
      {/* Skeleton shimmer when not yet in view */}
      {!inView && <div className="skeleton absolute inset-0" />}
      {/* Actual image */}
      {inView && (
        <img
          src={src}
          alt={alt}
          className={`lazy-img w-full h-full object-cover ${loaded ? 'loaded' : 'loading'}`}
          onLoad={() => setLoaded(true)}
        />
      )}
    </div>
  );
};

export default LazyImage;
