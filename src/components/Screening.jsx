import { useEffect, useMemo, useRef, useState } from 'react';
import Poster from './Poster.jsx';
import { rnd, runtime } from '../utils.js';

const ROWS = 'ABCDEFGH'.split('');
const COLS = 12;
const rowPrice = (r) => (r < 2 ? 10 : r < 6 ? 14 : 12);
const isTaken = (fid, day, time, r, c) => rnd([fid, day, time, r, c].join('|')) < 0.27;

/* The "screening room": film details, then seats, then the ticket. */
export default function Screening({ film, onClose }) {
  const [step, setStep] = useState('info'); // info | seats | ticket
  const [dayIdx, setDayIdx] = useState(0);
  const [time, setTime] = useState(null);
  const [seats, setSeats] = useState([]);
  const [teaser, setTeaser] = useState(false);
  const [code, setCode] = useState('');
  const [torn, setTorn] = useState(false);
  const closeRef = useRef(null);
  const [c0, c1, c2] = film.palette;

  const days = useMemo(() => {
    const base = new Date();
    return Array.from({ length: 4 }, (_, i) => {
      const d = new Date(base.getFullYear(), base.getMonth(), base.getDate() + i);
      return {
        key: d.getMonth() + 1 + '-' + d.getDate(),
        top: i === 0 ? 'Today' : d.toLocaleDateString('en-US', { weekday: 'short' }),
        sub: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        long: d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
      };
    });
  }, []);
  const day = days[dayIdx];

  // Esc closes, page scroll is locked while the panel is open
  useEffect(() => {
    closeRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  // the teaser stops by itself
  useEffect(() => {
    if (!teaser) return;
    const t = setTimeout(() => setTeaser(false), 7600);
    return () => clearTimeout(t);
  }, [teaser]);

  const pickDay = (i) => { setDayIdx(i); setTime(null); setSeats([]); };
  const pickTime = (t) => { setTime(t); setSeats([]); };
  const toggleSeat = (id) =>
    setSeats((s) => (s.includes(id) ? s.filter((x) => x !== id) : s.length >= 6 ? s : [...s, id]));

  const total = seats.reduce((sum, id) => sum + rowPrice(ROWS.indexOf(id[0])), 0);
  const sortedSeats = [...seats].sort((a, b) =>
    a[0] === b[0] ? parseInt(a.slice(1)) - parseInt(b.slice(1)) : a.localeCompare(b)
  );

  const confirm = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    setCode('HPH-' + Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join(''));
    setTorn(false);
    setStep('ticket');
  };

  const bars = useMemo(() => {
    if (!code) return { list: [], w: 1 };
    const list = [];
    let x = 0;
    for (let i = 0; i < 46; i++) {
      const w = 1 + Math.floor(rnd(code + 'w' + i) * 3);
      const g = 1 + Math.floor(rnd(code + 'g' + i) * 2);
      list.push({ x, w });
      x += w + g;
    }
    return { list, w: x };
  }, [code]);

  return (
    <div className="overlay theater" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="panel" role="dialog" aria-modal="true" aria-label={film.title} style={{ '--c0': c0, '--c1': c1, '--c2': c2 }}>
        <button className="close" ref={closeRef} onClick={onClose} aria-label="Close">
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M3 3l10 10M13 3L3 13" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        {step === 'info' && (
          <div className="info">
            <div>
              <div className={'frame' + (teaser ? ' play' : '')}>
                <Poster film={film} />
                <span className="bar t" /><span className="bar b" />
                <span className="teaser-line">{film.tagline}</span>
              </div>
              <button className="btn ghost teaser-btn" onClick={() => setTeaser((t) => !t)}>
                {teaser ? 'Stop teaser' : 'Play teaser'}
              </button>
            </div>

            <div className="detail">
              <h2>{film.title}</h2>
              <p className="tagline">{film.tagline}</p>
              <div className="facts">
                <span className="fact">{film.genre}</span>
                <span className="fact">{film.year}</span>
                <span className="fact">{runtime(film.runtime)}</span>
                <span className="fact">{film.rating}</span>
                <span className="fact">Score {film.score.toFixed(1)}</span>
              </div>
              <p className="synopsis">{film.synopsis}</p>
              <p className="credits">
                Directed by <b>{film.director}</b>. Starring <b>{film.cast.join(', ')}</b>.
              </p>

              <div className="picker">
                <h3>Choose a day</h3>
                <div className="days">
                  {days.map((d, i) => (
                    <button key={d.key} className="day" aria-pressed={i === dayIdx} onClick={() => pickDay(i)}>
                      {d.top}<small>{d.sub}</small>
                    </button>
                  ))}
                </div>
              </div>
              <div className="picker">
                <h3>Choose a time</h3>
                <div className="times">
                  {film.times.map((t) => (
                    <button key={t} className="tbtn" aria-pressed={time === t} onClick={() => pickTime(t)}>{t}</button>
                  ))}
                </div>
              </div>
              <button className="btn gold go" disabled={!time} onClick={() => setStep('seats')}>
                {time ? 'Choose seats for ' + time : 'Pick a time to continue'}
              </button>
            </div>
          </div>
        )}

        {step === 'seats' && (
          <div className="seats-view">
            <button className="linkbtn" onClick={() => setStep('info')}>Change day or time</button>
            <h2>{film.title}</h2>
            <p className="sub">{day.long} at {time}, Screen 2</p>

            <div className="screen" aria-hidden="true">
              <svg viewBox="0 0 400 36" preserveAspectRatio="none">
                <path d="M4 32 Q200 -6 396 32" fill="none" stroke={c0} strokeWidth="5" strokeLinecap="round" style={{ filter: `drop-shadow(0 0 8px ${c0})` }} />
              </svg>
              <div className="cone" />
            </div>

            <div className="seatmap" role="group" aria-label="Seat map">
              {ROWS.map((rl, r) => (
                <div className="row" key={rl}>
                  <span className="lbl">{rl}</span>
                  {Array.from({ length: COLS }, (_, c) => {
                    const id = rl + (c + 1);
                    const taken = isTaken(film.id, day.key, time, r, c);
                    const sel = seats.includes(id);
                    return (
                      <button
                        key={id}
                        className={'seat' + (r >= 2 && r < 6 ? ' prime' : '') + (sel ? ' sel' : '') + (c === 5 ? ' aisle' : '')}
                        disabled={taken || (!sel && seats.length >= 6)}
                        aria-pressed={sel}
                        aria-label={`Row ${rl}, seat ${c + 1}, $${rowPrice(r)}${taken ? ', taken' : ''}`}
                        onClick={() => toggleSeat(id)}
                      />
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="legend">
              <span><i style={{ background: '#3b2d5f' }} />Free, $10 to $12</span>
              <span><i style={{ background: '#54408a' }} />Best rows, $14</span>
              <span><i style={{ background: 'var(--gold)' }} />Yours</span>
              <span><i style={{ background: '#241a3a' }} />Taken</span>
            </div>

            <div className="summary">
              <div className="sum-l">
                <strong>{seats.length ? '$' + total : 'No seats yet'}</strong>
                <div className="picked">
                  {seats.length
                    ? sortedSeats.join(', ') + (seats.length === 6 ? ' (6 is the most per booking)' : '')
                    : 'Tap a seat to select it. Up to 6 per booking.'}
                </div>
              </div>
              <button className="btn gold" disabled={!seats.length} onClick={confirm}>
                {seats.length ? `Book ${seats.length} ${seats.length === 1 ? 'seat' : 'seats'}` : 'Book seats'}
              </button>
            </div>
          </div>
        )}

        {step === 'ticket' && (
          <div className="ticket-view">
            <h2>You are going to the movies</h2>
            <div className={'ticket' + (torn ? ' torn' : '')}>
              <span className="notch tp" /><span className="notch bt" />
              <div className="t-main">
                <Poster film={film} />
                <div>
                  <h3>{film.title}</h3>
                  <div className="t-info">
                    <div><b>Date</b>{day.long}</div>
                    <div><b>Time</b>{time}</div>
                    <div><b>Seats</b>{sortedSeats.join(', ')}</div>
                    <div><b>Paid</b>{'$' + total}, Screen 2</div>
                  </div>
                </div>
                <svg className="barcode" viewBox={`0 0 ${bars.w} 28`} preserveAspectRatio="none" aria-hidden="true">
                  {bars.list.map((b, i) => (
                    <rect key={i} x={b.x} y="0" width={b.w} height="28" fill="#fff" fillOpacity=".85" />
                  ))}
                </svg>
              </div>
              <button className="stub" onClick={() => setTorn(true)} aria-label="Tear off the ticket stub" disabled={torn}>
                <span>
                  <span className="n">{seats.length}</span>
                  <small>admit</small>
                  <code>{code}</code>
                </span>
              </button>
            </div>
            <p className="hint" role="status">{torn ? 'Stub torn. Enjoy the show!' : 'Click the stub to tear it off.'}</p>
            <div className="ticket-actions">
              <button className="btn ghost" onClick={() => { setStep('seats'); setSeats([]); }}>Book more seats</button>
              <button className="btn gold" onClick={onClose}>Back to films</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
