import { AbsoluteFill, useCurrentFrame } from "remotion";
import { BEAT, C, FONT, MONO, backOut, ip, kickPulse, lerp, outExpo } from "./lib";

const N = 120;
type Pt = [number, number];

const polygon = (verts: Pt[]): Pt[] => {
  // Reparte N puntos a distancia uniforme sobre el perímetro para poder interpolar entre formas
  const segs = verts.map((v, i) => {
    const w = verts[(i + 1) % verts.length];
    return { a: v, b: w, len: Math.hypot(w[0] - v[0], w[1] - v[1]) };
  });
  const total = segs.reduce((s, x) => s + x.len, 0);
  const out: Pt[] = [];
  for (let k = 0; k < N; k++) {
    let d = (k / N) * total;
    for (const s of segs) {
      if (d <= s.len) {
        const t = d / s.len;
        out.push([lerp(s.a[0], s.b[0], t), lerp(s.a[1], s.b[1], t)]);
        break;
      }
      d -= s.len;
    }
  }
  return out;
};
const ngon = (n: number, inner = 0): Pt[] => {
  const v: Pt[] = [];
  const count = inner ? n * 2 : n;
  for (let i = 0; i < count; i++) {
    const a = -Math.PI / 2 + (i / count) * Math.PI * 2;
    const r = inner && i % 2 ? inner : 1;
    v.push([Math.cos(a) * r, Math.sin(a) * r]);
  }
  return polygon(v);
};
const circle: Pt[] = Array.from({ length: N }, (_, k) => {
  const a = -Math.PI / 2 + (k / N) * Math.PI * 2;
  return [Math.cos(a), Math.sin(a)];
});
const SHAPES = [circle, ngon(4).map(([x, y]) => [x * 1.1, y * 1.1] as Pt), ngon(3).map(([x, y]) => [x * 1.15, y * 1.15 + 0.15] as Pt), ngon(5, 0.48).map(([x, y]) => [x * 1.15, y * 1.15 + 0.05] as Pt)];
const COLORS = [C.orange, C.blue, C.ink, C.orange];

const PRINCIPLES = [
  ["SQUASH &", "STRETCH"],
  ["ANTICI-", "PATION"],
  ["FOLLOW", "THROUGH"],
  ["EXAGGE-", "RATION"],
];

// 00:02 – 00:04 · Lenguaje de formas + los principios clásicos de animación, un principio por beat.
export const Principles: React.FC<{ from: number }> = ({ from }) => {
  const f = useCurrentFrame();
  const b = Math.min(3, Math.floor(f / BEAT));
  const t = f - b * BEAT;
  const kick = kickPulse(f + from);

  const morph = ip(t, [0, 16], [0, 1], backOut);
  const prev = SHAPES[Math.max(0, b - 1)];
  const cur = SHAPES[b];
  const R = 220 * (b === 0 ? ip(t, [0, 14], [0.2, 1], backOut) : 1);

  // Salto entre beats: anticipación (se agacha), vuelo en arco y aterrizaje con squash
  const u = t / BEAT;
  const hop = u > 0.35 ? -170 * Math.sin(((u - 0.35) / 0.65) * Math.PI) : 0;
  const land = Math.exp(-t / 6);
  const antic = ip(u, [0.2, 0.35, 0.45], [0, 1, 0]);
  const sy = 1 - 0.32 * land * Math.cos(t * 0.45) - 0.18 * antic + (u > 0.45 ? 0.12 * Math.sin(((u - 0.45) / 0.55) * Math.PI) : 0);
  const sx = 1 / Math.max(0.5, sy);
  const rot = (b * 90 + ip(t, [0, 18], [-90, 0], outExpo)) * (b === 0 ? 0 : 1);

  const pts = cur.map((p, i) => {
    const q = prev[i];
    return [lerp(q[0], p[0], morph), lerp(q[1], p[1], morph)] as Pt;
  });
  const d =
    "M" +
    pts
      .map(([x, y]) => {
        const c = Math.cos((rot * Math.PI) / 180);
        const s = Math.sin((rot * Math.PI) / 180);
        const rx = x * c - y * s;
        const ry = x * s + y * c;
        return `${(rx * R * sx).toFixed(1)},${(ry * R * sy).toFixed(1)}`;
      })
      .join("L") +
    "Z";

  const cx = 1290;
  const floor = 540 + 250;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: C.paper,
        backgroundImage: `radial-gradient(${C.ink}22 2px, transparent 2px)`,
        backgroundSize: "48px 48px",
        backgroundPosition: `${-f * 0.6}px 0px`,
        overflow: "hidden",
      }}
    >
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        {/* Anillos en cada bombo */}
        {[0, 1, 2, 3].map((k) => {
          const tt = f - k * BEAT;
          if (tt < 0) return null;
          return (
            <circle
              key={k}
              cx={cx}
              cy={floor - 20}
              r={ip(tt, [0, 40], [60, 1100], outExpo)}
              fill="none"
              stroke={C.ink}
              strokeWidth={ip(tt, [0, 40], [10, 0])}
              opacity={0.5}
            />
          );
        })}
        {/* Sombra en el suelo */}
        <ellipse
          cx={cx}
          cy={floor + 8}
          rx={ip(-hop, [0, 170], [240, 120]) * (1 + 0.2 * land)}
          ry={22}
          fill={C.ink}
          opacity={ip(-hop, [0, 170], [0.22, 0.08])}
        />
        {/* Trayectoria en arco (arcs) */}
        <path
          d={`M ${cx - 380} ${floor - 230} Q ${cx} ${floor - 700} ${cx + 380} ${floor - 230}`}
          fill="none"
          stroke={C.ink}
          strokeOpacity={0.25}
          strokeDasharray="2 14"
          strokeLinecap="round"
          strokeWidth={4}
        />
        <g transform={`translate(${cx} ${floor - R * sy + hop})`}>
          <path d={d} fill={COLORS[b]} />
          <path d={d} fill="none" stroke={C.ink} strokeWidth={3} transform="translate(14 14)" opacity={0.6} />
        </g>
      </svg>

      {/* Índice y nombre del principio */}
      <div style={{ position: "absolute", left: 140, top: 300, fontFamily: MONO, fontSize: 24, letterSpacing: "0.3em", color: C.ink }}>
        PRINCIPLE{" "}
        <span style={{ color: C.orange }}>{String(b + 1).padStart(2, "0")}</span> / 12
      </div>
      <div style={{ position: "absolute", left: 130, top: 350, width: 900, height: 330, overflow: "hidden" }}>
        {PRINCIPLES.map((lines, i) => {
          const local = f - i * BEAT;
          if (local < 0 || local > BEAT + 14) return null;
          return (
            <div key={i} style={{ position: "absolute", left: 0, top: 0 }}>
              {lines.map((ln, j) => (
                <div key={j} style={{ overflow: "hidden", height: 160 }}>
                  <div
                    style={{
                      fontFamily: FONT,
                      fontWeight: 900,
                      fontSize: 150,
                      lineHeight: "160px",
                      letterSpacing: "-0.04em",
                      color: C.ink,
                      translate: `0px ${
                        local < BEAT ? ip(local, [j * 3, 16 + j * 3], [105, 0], outExpo) : ip(local, [BEAT, BEAT + 12], [0, -105], outExpo)
                      }%`,
                    }}
                  >
                    {ln}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          left: 140,
          top: 700,
          height: 10,
          width: ip(f, [0, 4 * BEAT], [0, 760]),
          backgroundColor: C.orange,
          scale: `1 ${1 + kick}`,
        }}
      />
    </AbsoluteFill>
  );
};
