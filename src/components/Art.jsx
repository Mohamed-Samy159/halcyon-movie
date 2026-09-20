import { FONT, rnd } from '../utils.js';

/* One drawing per film. Each returns SVG shapes for a 200 x 300 poster. */
const ART = {
  dunes(f) {
    const [a, b, c] = f.palette;
    const cid = 'clip-' + f.id;
    return (
      <g>
        <defs><clipPath id={cid}><circle cx="100" cy="112" r="48" /></clipPath></defs>
        <circle cx="100" cy="112" r="64" fill="none" stroke={a} strokeOpacity=".35" />
        <circle cx="100" cy="112" r="80" fill="none" stroke={a} strokeOpacity=".18" />
        <g clipPath={`url(#${cid})`}>
          <rect x="52" y="64" width="96" height="52" fill={a} />
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x="52" y={119 + i * 11} width="96" height={8 - i * 1.9} fill={a} />
          ))}
        </g>
        <path d="M0 200 Q40 168 95 196 T200 184 V300 H0Z" fill={b} />
        <path d="M0 232 Q60 196 120 226 T200 214 V300 H0Z" fill={c} />
        <rect x="59" y="203" width="2" height="9" fill={a} />
        <circle cx="60" cy="201" r="1.8" fill={a} />
      </g>
    );
  },

  orchard(f) {
    const [a, b] = f.palette;
    const d = Array.from({ length: 24 }, (_, i) => {
      const ang = i * 2.39996;
      const rad = 8 + Math.sqrt(i) * 13;
      return { x: 100 + Math.cos(ang) * rad * 1.2, y: 100 + Math.sin(ang) * rad * 0.86, s: 9 + (i % 5) * 2.6, r: (i * 41) % 90, o: 0.1 + (i % 4) * 0.07 };
    });
    return (
      <g>
        <circle cx="100" cy="104" r="76" fill={b} fillOpacity=".3" />
        <circle cx="100" cy="104" r="52" fill={a} fillOpacity=".08" />
        <path d="M100 205 V150 M100 178 L82 160 M100 170 L120 152" stroke={a} strokeWidth="2.4" fill="none" strokeLinecap="round" />
        {d.map((p, i) => (
          <g key={i} transform={`translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${p.r})`}>
            <rect x={-p.s / 2} y={-p.s / 2} width={p.s} height={p.s} fill={a} fillOpacity={p.o} stroke={a} strokeWidth=".8" strokeOpacity=".8" />
          </g>
        ))}
        <circle cx="100" cy="104" r="4" fill="#fff" />
        <path d="M20 205 H180" stroke={a} strokeOpacity=".4" />
      </g>
    );
  },

  bus(f) {
    const [a, b] = f.palette;
    const rain = Array.from({ length: 36 }, (_, i) => ({
      x: rnd(f.id + 'x' + i) * 230 - 10,
      y: rnd(f.id + 'y' + i) * 220,
      l: 10 + rnd(f.id + 'l' + i) * 12
    }));
    return (
      <g>
        <circle cx="100" cy="106" r="46" fill={b} />
        <circle cx="100" cy="106" r="57" fill="none" stroke={b} strokeOpacity=".5" />
        {rain.map((r, i) => (
          <line key={i} x1={r.x} y1={r.y} x2={r.x - r.l * 0.3} y2={r.y + r.l} stroke="#cfe3ff" strokeOpacity=".22" strokeWidth=".7" />
        ))}
        <rect x="0" y="222" width="200" height="90" fill="#070a1a" />
        <path d="M0 222 H200" stroke={a} strokeOpacity=".5" />
        <polygon points="172,198 200,180 200,230 172,216" fill="#fff6b0" fillOpacity=".22" />
        <rect x="26" y="146" width="146" height="70" rx="9" fill={a} />
        <rect x="40" y="132" width="40" height="14" rx="3" fill="#070a1a" />
        <text x="60" y="143" textAnchor="middle" fontSize="11" fontWeight="800" fill={a} fontFamily={FONT}>9</text>
        {[0, 1, 2, 3, 4].map((i) => {
          const lit = rnd(f.id + 'w' + i) > 0.35;
          return (
            <g key={i}>
              <rect x={34 + i * 27} y="158" width="21" height="22" rx="3" fill={lit ? '#fff3b0' : '#1b1f3f'} />
              {lit && <circle cx={44.5 + i * 27} cy="169" r="4" fill="#070a1a" fillOpacity=".7" />}
            </g>
          );
        })}
        <rect x="26" y="196" width="146" height="4" fill="#070a1a" fillOpacity=".25" />
        <circle cx="56" cy="216" r="10" fill="#070a1a" stroke={a} />
        <circle cx="146" cy="216" r="10" fill="#070a1a" stroke={a} />
      </g>
    );
  },

  origami(f) {
    const [a, b] = f.palette;
    const ink = '#2b1a2e';
    return (
      <g>
        <polygon points="0,0 96,0 0,96" fill="#fff" fillOpacity=".08" />
        <polygon points="200,300 200,180 100,300" fill="#fff" fillOpacity=".07" />
        <g transform="translate(14 -8) scale(.86)">
          <polygon points="58,108 44,52 92,92" fill={b} />
          <polygon points="142,108 156,52 108,92" fill={b} />
          <polygon points="58,100 52,70 80,92" fill={a} />
          <polygon points="142,100 148,70 120,92" fill={a} />
          <polygon points="56,100 144,100 162,166 100,226 38,166" fill={a} />
          <polygon points="38,166 100,226 70,170" fill="#000" fillOpacity=".14" />
          <polygon points="162,166 100,226 130,170" fill="#000" fillOpacity=".14" />
          <polygon points="56,100 144,100 100,150" fill="#fff" fillOpacity=".16" />
          <polygon points="100,104 94,128 106,128" fill={ink} />
          <polygon points="62,118 84,124 64,136" fill={ink} />
          <polygon points="138,118 116,124 136,136" fill={ink} />
          <polygon points="68,146 92,150 80,161" fill={ink} />
          <polygon points="132,146 108,150 120,161" fill={ink} />
          <polygon points="92,188 108,188 100,201" fill={ink} />
          <polyline points="100,201 100,212 88,218 M100,212 112,218" fill="none" stroke={ink} strokeWidth="2" />
        </g>
      </g>
    );
  },

  harbor(f) {
    const [a] = f.palette;
    const sea = f.palette[2];
    return (
      <g>
        <circle cx="140" cy="76" r="34" fill="#fff3f6" fillOpacity=".12" />
        <circle cx="140" cy="76" r="22" fill="#fff3f6" />
        <rect x="0" y="170" width="200" height="130" fill={sea} fillOpacity=".93" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <path key={i} d={`M-10 ${182 + i * 11} q 15 -5 30 0 t 30 0 t 30 0 t 30 0 t 30 0 t 30 0 t 30 0`} fill="none" stroke={a} strokeOpacity={0.4 - i * 0.05} />
        ))}
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x={140 - (30 - i * 5) / 2} y={176 + i * 7} width={30 - i * 5} height="1.7" fill="#fff3f6" fillOpacity=".6" />
        ))}
        <g className="bob">
          <path d="M62 170 h32 l-6 9 h-20z" fill="#0d0b24" />
          <path d="M78 166 V136 L97 166z" fill={a} />
          <circle cx="66" cy="168" r="1.7" fill="#ffd27a" />
        </g>
        <g className="bob b2">
          <path d="M104 173 h26 l-5 7 h-16z" fill="#0d0b24" />
          <path d="M116 169 V148 L129 169z" fill="#fff" fillOpacity=".88" />
          <circle cx="126" cy="171" r="1.5" fill="#ffd27a" />
        </g>
      </g>
    );
  },

  speed(f) {
    const [a, b] = f.palette;
    const cx = 100, cy = 112;
    const rays = Array.from({ length: 32 }, (_, i) => {
      const ang = (i / 32) * Math.PI * 2 + 0.05;
      const r1 = 16 + rnd(f.id + 'r' + i) * 30;
      return {
        x1: cx + Math.cos(ang) * r1, y1: cy + Math.sin(ang) * r1,
        x2: cx + Math.cos(ang) * 260, y2: cy + Math.sin(ang) * 260,
        col: i % 3 === 0 ? a : i % 3 === 1 ? b : '#fff', w: i % 2 ? 0.6 : 1.3
      };
    });
    const car = (
      <g>
        <ellipse cx="105" cy="242" rx="72" ry="6" fill={b} fillOpacity=".55" />
        <polygon points="34,232 52,214 96,205 132,207 160,222 178,226 178,238 34,238" fill="#0a0a23" stroke={a} strokeWidth="1.3" />
        <polygon points="68,214 96,208 120,209 138,220 68,220" fill={b} fillOpacity=".85" />
        <circle cx="62" cy="238" r="9" fill="#0a0a23" stroke={a} />
        <circle cx="150" cy="238" r="9" fill="#0a0a23" stroke={a} />
        <rect x="34" y="222" width="10" height="4" fill="#ff315c" />
      </g>
    );
    return (
      <g>
        {rays.map((r, i) => (
          <line key={i} x1={r.x1.toFixed(1)} y1={r.y1.toFixed(1)} x2={r.x2.toFixed(1)} y2={r.y2.toFixed(1)} stroke={r.col} strokeOpacity=".5" strokeWidth={r.w} />
        ))}
        <circle cx={cx} cy={cy} r="13" fill="#0a0a23" stroke={a} />
        <g transform="translate(0 -36)">
          <g opacity=".14" transform="translate(-30 0)">{car}</g>
          <g opacity=".3" transform="translate(-15 0)">{car}</g>
          {car}
        </g>
      </g>
    );
  },

  moth(f) {
    const [a, b, c] = f.palette;
    const wing = (
      <g className="flap">
        <path d="M98 138 C78 88 22 84 14 128 C8 164 52 188 98 170Z" fill={a} fillOpacity=".92" />
        <path d="M98 150 C72 120 40 122 32 146 C44 160 70 166 98 162Z" fill={b} fillOpacity=".55" />
        <path d="M98 172 C80 192 52 208 38 198 C40 178 66 168 98 170Z" fill={b} fillOpacity=".8" />
        <circle cx="52" cy="130" r="13" fill={c} />
        <circle cx="52" cy="130" r="8" fill={a} />
        <circle cx="52" cy="130" r="3.5" fill={c} />
      </g>
    );
    return (
      <g>
        <circle cx="100" cy="112" r="76" fill={a} fillOpacity=".1" />
        <circle cx="100" cy="112" r="52" fill={a} fillOpacity=".14" />
        {wing}
        <g transform="translate(200 0) scale(-1 1)">{wing}</g>
        <path d="M96 124 Q86 98 70 92 M104 124 Q114 98 130 92" fill="none" stroke={a} strokeWidth="1.4" />
        <ellipse cx="100" cy="152" rx="5.5" ry="30" fill={c} stroke={a} strokeWidth=".9" />
      </g>
    );
  },

  rings(f) {
    const [a] = f.palette;
    const cx = 100, cy = 112;
    return (
      <g>
        {[22, 44, 66, 88].map((r) => (
          <circle key={r} cx={cx} cy={cy} r={r} fill="none" stroke={a} strokeOpacity=".45" />
        ))}
        <path d="M12 112 H188 M100 24 V200" stroke={a} strokeOpacity=".3" />
        <g className="sweep"><path d="M100 112 L100 24 A88 88 0 0 1 162.2 49.8 Z" fill={a} fillOpacity=".32" /></g>
        {[[128, 84], [70, 140], [142, 140], [86, 72]].map(([x, y], i) => (
          <circle key={i} className="blip" style={{ animationDelay: i * 0.7 + 's' }} cx={x} cy={y} r="2.6" fill="#fff" />
        ))}
        <circle cx={cx} cy={cy} r="3" fill={a} />
      </g>
    );
  }
};

export default ART;
