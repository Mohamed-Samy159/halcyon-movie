import { useCallback, useEffect, useRef, useState } from 'react';
import { FILMS, GENRES, SOON } from './data/films.js';
import { reduced, runtime } from './utils.js';
import Poster from './components/Poster.jsx';
import Tilt from './components/Tilt.jsx';
import Dust from './components/Dust.jsx';
import Screening from './components/Screening.jsx';

const byId = (id) => FILMS.find((f) => f.id === id);

/* favorites are remembered in the browser */
const loadFavs = () => {
  try { return JSON.parse(localStorage.getItem('halcyon:favs') || '[]'); } catch { return []; }
};

function Reel() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="16" r="14" fill="none" stroke="#ffc857" strokeWidth="2" />
      {[0, 72, 144, 216, 288].map((a) => (
        <circle key={a} cx={16 + Math.cos((a * Math.PI) / 180) * 8} cy={16 + Math.sin((a * Math.PI) / 180) * 8} r="3" fill="#ffc857" />
      ))}
      <circle cx="16" cy="16" r="2" fill="#ffc857" />
    </svg>
  );
}

function Heart({ filled }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 21s-7.5-4.6-9.6-9.1C.9 8.6 3 5 6.5 5c2 0 3.6 1.1 4.5 2.6C11.9 6.1 13.5 5 15.5 5 19 5 21.1 8.6 21.6 11.9 19.5 16.4 12 21 12 21z"
        fill={filled ? '#ff5c7a' : 'none'} stroke={filled ? '#ff5c7a' : '#fff'} strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

export default function App() {
  const [filter, setFilter] = useState('All');
  const [query, setQuery] = useState('');
  const [favs, setFavs] = useState(loadFavs);
  const [openId, setOpenId] = useState(null);
  const [curtain, setCurtain] = useState(false);
  const heroRef = useRef(null);

  // curtains open shortly after the page loads
  useEffect(() => {
    const t = setTimeout(() => setCurtain(true), reduced() ? 0 : 700);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    try { localStorage.setItem('halcyon:favs', JSON.stringify(favs)); } catch { /* storage unavailable */ }
  }, [favs]);

  const toggleFav = (id) => setFavs((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));
  const closeFilm = useCallback(() => setOpenId(null), []);

  const onMove = (e) => {
    const el = heroRef.current;
    if (!el || reduced()) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--px', (((e.clientX - r.left) / r.width - 0.5) * 2).toFixed(3));
    el.style.setProperty('--py', (((e.clientY - r.top) / r.height - 0.5) * 2).toFixed(3));
  };

  const q = query.trim().toLowerCase();
  const shown = FILMS.filter((f) => {
    if (filter === 'Favorites' && !favs.includes(f.id)) return false;
    if (filter !== 'All' && filter !== 'Favorites' && f.genre !== filter) return false;
    if (!q) return true;
    return [f.title, f.genre, f.director, ...f.cast].join(' ').toLowerCase().includes(q);
  });
  const film = byId(openId);
  const surprise = () => setOpenId(FILMS[Math.floor(Math.random() * FILMS.length)].id);

  return (
    <div className="app">
      <header className="site-head theater">
        <a className="brand" href="#top" style={{ color: '#fff' }}><Reel />Halcyon</a>
        <nav className="nav" aria-label="Main">
          <a href="#now" className="keep">Now showing</a>
          <a href="#soon">Coming soon</a>
        </nav>
      </header>

      <main id="top">
        {/* ---------------- hero ---------------- */}
        <section ref={heroRef} className={'hero theater' + (curtain ? ' open' : '')} onMouseMove={onMove} aria-label="Welcome">
          <div className="rod" />
          <div className="beam" />
          <Dust />
          <div className="hero-inner">
            <div>
              <h1 className="title"><span>Tonight,</span><span>pick your</span><span>world.</span></h1>
              <p className="">Eight films on our screen, four days of showtimes. Choose a poster, pick your seats, and your ticket is ready in under a minute.</p>
              <div className="cta wrap  ">
                <a className="btn " href="#now">See what is playing</a>
                <button className="btn ghost" onClick={surprise}>Surprise me</button>
              </div>
            </div>
            <div className="stack">
              {[['moth', 'l'], ['ghost', 'r'], ['salt', 'c']].map(([id, pos]) => (
                <button key={id} className={'stack-item ' + pos} onClick={() => setOpenId(id)} aria-label={'Open ' + byId(id).title}>
                  <Tilt max={8}><Poster film={byId(id)} /></Tilt>
                </button>
              ))}
            </div>
          </div>
          <div className="curtain l" /><div className="curtain r" />
          <button className="curtain-btn" onClick={() => setCurtain((c) => !c)}>
            <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
              <path d="M2 2h12v2H2zM3 4c0 5 1 8 2 10M13 4c0 5-1 8-2 10M8 4v10" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            </svg>
            {curtain ? 'Close the curtains' : 'Open the curtains'}
          </button>
        </section>

        {/* ---------------- now showing ---------------- */}
        <section id="now" className="section">
          <div className="wrap">
            <div className="sign theater">
              <h2>Now showing</h2>
              <p>Tap a poster to watch a teaser, pick a day and time, and choose your seats.</p>
            </div>

            <div className="toolbar">
              <label className="search">
                <span className="sr-only">Search films</span>
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2" />
                  <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by title, actor or director" />
              </label>
              <div className="chips" role="group" aria-label="Filter by genre">
                {GENRES.map((g) => (
                  <button key={g} className="chip" aria-pressed={filter === g} onClick={() => setFilter(g)}>
                    {g === 'Favorites' ? `Favorites (${favs.length})` : g}
                  </button>
                ))}
              </div>
            </div>

            {shown.length === 0 ? (
              <div className="empty">
                <p>
                  {filter === 'Favorites' && !q
                    ? 'No favorites yet. Tap the heart on a poster to save a film here.'
                    : 'No films match your search.'}
                </p>
                <button className="btn" onClick={() => { setFilter('All'); setQuery(''); }}>Show all films</button>
              </div>
            ) : (
              <div className="grid" key={filter + '|' + q}>
                {shown.map((f, i) => (
                  <div key={f.id} className="card-wrap" style={{ '--i': i }}>
                    <button
                      className="card"
                      style={{ '--glow': f.palette[0] + '99' }}
                      onClick={() => setOpenId(f.id)}
                      aria-label={`${f.title}, ${f.genre}, ${runtime(f.runtime)}`}
                    >
                      <Tilt>
                        <Poster film={f} />
                        <span className="score">{f.score.toFixed(1)}</span>
                      </Tilt>
                      <span className="card-title">{f.title}</span>
                      <span className="card-meta">{f.genre}, {runtime(f.runtime)}, {f.rating}</span>
                    </button>
                    <button
                      className={'fav' + (favs.includes(f.id) ? ' on' : '')}
                      onClick={() => toggleFav(f.id)}
                      aria-pressed={favs.includes(f.id)}
                      aria-label={(favs.includes(f.id) ? 'Remove from favorites: ' : 'Add to favorites: ') + f.title}
                    >
                      <Heart filled={favs.includes(f.id)} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ---------------- coming soon ---------------- */}
        <section id="soon" className="strip theater" aria-label="Coming soon">
          <div className="wrap strip-head">
            <h2>Coming soon</h2>
            <p>Five more open through October. Hover to pause the reel.</p>
          </div>
          <div className="track">
            {[0, 1].map((copy) => (
              <div key={copy} style={{ display: 'flex' }} aria-hidden={copy === 1}>
                {SOON.map((s) => (
                  <div key={s.t} className="frame-soon" style={{ '--f1': s.c[0], '--f2': s.c[1], '--fx': s.x, '--fy': s.y }}>
                    <h3>{s.t}</h3>
                    <p>{s.d}, {s.g}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="foot theater">
        <div className="wrap">
          <div>
            <div className="brand" style={{ color: '#fff', marginBottom: '12px' }}><Reel />Halcyon Picture House</div>
            <p>This is a demo. The films, people and showtimes are made up, and no real tickets are sold.</p>
          </div>
          <address>12 Lantern Row<br />Doors open 30 minutes before the first show</address>
        </div>
      </footer>

      {film && <Screening key={film.id} film={film} onClose={closeFilm} />}
    </div>
  );
}
