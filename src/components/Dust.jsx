import { useEffect, useRef } from 'react';
import { reduced } from '../utils.js';

/* Dust floating in the projector beam (canvas). */
export default function Dust() {
  const ref = useRef(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv || reduced()) return;
    const ctx = cv.getContext && cv.getContext('2d');
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0, raf = 0, last = performance.now();
    const P = Array.from({ length: 80 }, () => ({
      x: Math.random(), y: Math.random(), r: Math.random() * 1.6 + 0.4,
      s: Math.random() * 0.00006 + 0.00002, a: Math.random() * 0.6 + 0.25, ph: Math.random() * 6.28
    }));
    const resize = () => {
      w = cv.clientWidth; h = cv.clientHeight;
      cv.width = w * dpr; cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);
    const tick = (t) => {
      const dt = Math.min(t - last, 64);
      last = t;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#fff6d8';
      for (const p of P) {
        p.y -= p.s * dt;
        p.x += Math.sin(t * 0.0004 + p.ph) * 0.00006 * dt;
        if (p.y < -0.02) { p.y = 1.02; p.x = Math.random(); }
        ctx.globalAlpha = p.a * (0.5 + 0.5 * Math.sin(t * 0.002 + p.ph));
        ctx.beginPath();
        ctx.arc(p.x * w, p.y * h, p.r, 0, 6.283);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={ref} className="dust" aria-hidden="true" />;
}
