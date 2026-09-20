import { useRef } from 'react';
import { reduced } from '../utils.js';

/* Tilts its children in 3D toward the mouse and adds a soft glare. */
export default function Tilt({ children, max = 9 }) {
  const ref = useRef(null);

  const move = (e) => {
    const el = ref.current;
    if (!el || reduced()) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty('--rx', ((0.5 - y) * max * 2).toFixed(2) + 'deg');
    el.style.setProperty('--ry', ((x - 0.5) * max * 2).toFixed(2) + 'deg');
    el.style.setProperty('--mx', (x * 100).toFixed(1) + '%');
    el.style.setProperty('--my', (y * 100).toFixed(1) + '%');
  };
  const leave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  };

  return (
    <span ref={ref} className="tilt" onMouseMove={move} onMouseLeave={leave}>
      {children}
      <span className="glare" />
    </span>
  );
}
