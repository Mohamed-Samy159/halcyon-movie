import ART from './Art.jsx';
import { FONT } from '../utils.js';

export default function Poster({ film, className = '' }) {
  const gid = 'bg-' + film.id;
  const sid = 'shade-' + film.id;
  const n = film.lines.length;
  const lh = film.fs * 0.88;
  const firstY = 272 - (n - 1) * lh;

  return (
    <svg className={'poster ' + className} viewBox="0 0 200 300" role="img" aria-label={film.title + ' poster'}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          {film.bg.map(([o, col]) => <stop key={o} offset={o} stopColor={col} />)}
        </linearGradient>
        <linearGradient id={sid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity=".74" />
        </linearGradient>
      </defs>
      <rect width="200" height="300" fill={`url(#${gid})`} />
      {ART[film.motif](film)}
      <rect y="168" width="200" height="132" fill={`url(#${sid})`} />
      {film.lines.map((ln, i) => (
        <text key={i} x="100" y={firstY + i * lh} textAnchor="middle" fontFamily={FONT} fontWeight="900" fontSize={film.fs} fill="#fff" letterSpacing="1">{ln}</text>
      ))}
      <text x="100" y="291" textAnchor="middle" fontFamily={FONT} fontWeight="700" fontSize="5.6" fill="#fff" fillOpacity=".72" letterSpacing="1.8">
        {'A FILM BY ' + film.director.toUpperCase()}
      </text>
      <rect x="3" y="3" width="194" height="294" fill="none" stroke="#fff" strokeOpacity=".16" />
    </svg>
  );
}
