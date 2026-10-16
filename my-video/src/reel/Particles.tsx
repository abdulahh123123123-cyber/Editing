import { AbsoluteFill, useCurrentFrame } from "remotion";
import { BEAT, C, FONT, MONO, hash, inOut, ip, kickPulse, mixHex, outExpo } from "./lib";

const N = 700;
type V3 = [number, number, number];

const sphere: V3[] = Array.from({ length: N }, (_, i) => {
  const y = 1 - (i / (N - 1)) * 2;
  const r = Math.sqrt(1 - y * y);
  const a = i * Math.PI * (3 - Math.sqrt(5));
  return [Math.cos(a) * r * 330, y * 330, Math.sin(a) * r * 330];
});
const torus: V3[] = Array.from({ length: N }, (_, i) => {
  const ring = Math.floor(i / 28);
  const k = i % 28;
  const u = (ring / 25) * Math.PI * 2;
  const v = (k / 28) * Math.PI * 2;
  const R = 300;
  const r = 110;
  return [(R + r * Math.cos(v)) * Math.cos(u), r * Math.sin(v), (R + r * Math.cos(v)) * Math.sin(u)];
});
const helix: V3[] = Array.from({ length: N }, (_, i) => {
  const strand = i % 2;
  const y = ((i >> 1) / (N / 2)) * 760 - 380;
  const a = y / 55 + strand * Math.PI;
  return [Math.cos(a) * 190, y, Math.sin(a) * 190];
});
const wave = (time: number): V3[] =>
  Array.from({ length: N }, (_, i) => {
    const gx = (i % 28) - 13.5;
    const gz = Math.floor(i / 28) - 12;
    const x = gx * 34;
    const z = gz * 34;
    return [x, 70 * Math.sin(x / 70 + time) * Math.cos(z / 90 + time * 0.7), z];
  });

// 00:08 – 00:10 · Sistemas generativos: 700 partículas que cambian de forma en cada beat.
export const Particles: React.FC<{ from: number }> = ({ from }) => {
  const f = useCurrentFrame();
  const kick = kickPulse(f + from);
  const shapes = [sphere, torus, helix, wave(f * 0.08)];
  const b = Math.min(3, Math.floor(f / BEAT));
  const t = f - b * BEAT;
  const prevShape = shapes[Math.max(0, b - 1)];
  const curShape = shapes[b];

  const ry = f * 0.022 + 0.4;
  const rx = 0.42 + 0.12 * Math.sin(f * 0.04);
  const cyr = Math.cos(ry);
  const syr = Math.sin(ry);
  const cxr = Math.cos(rx);
  const sxr = Math.sin(rx);

  const pts = curShape.map((p, i) => {
    const q = prevShape[i];
    const delay = hash(i) * 8;
    const m = b === 0 ? 1 : ip(t, [delay, delay + 18], [0, 1], inOut);
    const intro = b === 0 ? ip(f, [0, 26], [0, 1], outExpo) : 1;
    // dispersión durante el morph para que parezca orgánico
    const scatter = Math.sin(m * Math.PI) * 60;
    let x = (q[0] + (p[0] - q[0]) * m + (hash(i + 1) - 0.5) * scatter) * intro;
    let y = (q[1] + (p[1] - q[1]) * m + (hash(i + 2) - 0.5) * scatter) * intro;
    let z = (q[2] + (p[2] - q[2]) * m + (hash(i + 3) - 0.5) * scatter) * intro;
    const s = 1 + 0.07 * kick;
    x *= s; y *= s; z *= s;
    const x1 = x * cyr - z * syr;
    const z1 = x * syr + z * cyr;
    const y1 = y * cxr - z1 * sxr;
    const z2 = y * sxr + z1 * cxr;
    const persp = 1100 / (1100 + z2);
    return { x: 1180 + x1 * persp, y: 540 + y1 * persp, z: z2, s: persp, i };
  });
  pts.sort((a, c) => c.z - a.z);

  return (
    <AbsoluteFill style={{ backgroundColor: C.ink, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 1180px 540px, ${C.blue}55 0%, transparent 45%)`,
          opacity: 0.8 + 0.4 * kick,
        }}
      />
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        {pts.map((p) => {
          const depth = (p.z + 380) / 760;
          return (
            <circle
              key={p.i}
              cx={p.x}
              cy={p.y}
              r={Math.max(0.6, 4.2 * p.s * (1 + 0.6 * kick))}
              fill={depth < 0.5 ? mixHex(C.paper, C.orange, depth * 2) : mixHex(C.orange, C.blue, (depth - 0.5) * 2)}
              opacity={0.35 + 0.65 * (1 - Math.min(1, Math.max(0, depth)))}
            />
          );
        })}
      </svg>
      <div style={{ position: "absolute", left: 140, top: 370, width: 700 }}>
        {["Systems,", "not", "keyframes."].map((ln, i) => (
          <div key={i} style={{ overflow: "hidden", height: 128 }}>
            <div
              style={{
                fontFamily: FONT,
                fontWeight: 900,
                fontSize: 118,
                lineHeight: "128px",
                letterSpacing: "-0.04em",
                color: i === 2 ? C.orange : C.paper,
                translate: `0px ${ip(f, [6 + i * 8, 30 + i * 8], [110, 0], outExpo)}%`,
              }}
            >
              {ln}
            </div>
          </div>
        ))}
        <div style={{ marginTop: 28, fontFamily: MONO, fontSize: 22, letterSpacing: "0.18em", color: C.paper, opacity: 0.7 }}>
          {N} PARTICLES · {["SPHERE", "TORUS", "HELIX", "FIELD"][b]} · 0 HAND KEYS
        </div>
      </div>
    </AbsoluteFill>
  );
};
