import { AbsoluteFill, useCurrentFrame } from "remotion";
import { BEAT, C, FONT, MONO, backOut, hash, ip, kickPulse, outExpo } from "./lib";

const WORD = "CLAUDE";
const SHARDS = 140;

const Shape: React.FC<{ kind: number; color: string; size: number }> = ({ kind, color, size }) => {
  const h = size / 2;
  if (kind === 0) return <circle cx={h} cy={h} r={h} fill={color} />;
  if (kind === 1) return <rect width={size} height={size} fill={color} />;
  if (kind === 2) return <polygon points={`${h},0 ${size},${size} 0,${size}`} fill={color} />;
  const pts = Array.from({ length: 10 }, (_, i) => {
    const a = -Math.PI / 2 + (i / 10) * Math.PI * 2;
    const r = i % 2 ? h * 0.45 : h;
    return `${h + Math.cos(a) * r},${h + Math.sin(a) * r}`;
  }).join(" ");
  return <polygon points={pts} fill={color} />;
};

// 00:12 – 00:14 · El impacto: onda expansiva, estallido de partículas y el logotipo que resuelve todo lo anterior.
export const Payoff: React.FC<{ from: number }> = ({ from }) => {
  const f = useCurrentFrame();
  const kick = kickPulse(f + from);
  const beat = Math.floor(f / BEAT);
  const tb = f % BEAT;

  return (
    <AbsoluteFill style={{ backgroundColor: C.ink, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: `repeating-conic-gradient(from ${f * 0.35}deg at 960px 540px, ${C.orange}22 0deg 5deg, transparent 5deg 10deg)`,
          opacity: ip(f, [0, 20], [0, 1]),
        }}
      />
      <AbsoluteFill style={{ background: `radial-gradient(circle at 960px 540px, ${C.orange}66 0%, ${C.ink}00 50%)`, opacity: 0.6 + 0.5 * kick }} />
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        {/* Onda expansiva */}
        {[0, 5].map((d) => (
          <circle
            key={d}
            cx={960}
            cy={540}
            r={ip(f - d, [0, 45], [0, 1400], outExpo)}
            fill="none"
            stroke={d ? C.paper : C.orange}
            strokeWidth={ip(f - d, [0, 45], [90, 0])}
          />
        ))}
        {/* Fragmentos */}
        {Array.from({ length: SHARDS }).map((_, i) => {
          const a = hash(i) * Math.PI * 2;
          const dist = (300 + hash(i + 7) * 900) * ip(f, [0, 70], [0, 1], outExpo);
          const size = 4 + hash(i + 3) * 14;
          const x = 960 + Math.cos(a) * dist;
          const y = 540 + Math.sin(a) * dist;
          const col = [C.orange, C.paper, C.blue, C.lime][i % 4];
          return (
            <rect
              key={i}
              x={x - size / 2}
              y={y - size / 2}
              width={size}
              height={size}
              fill={col}
              opacity={ip(f, [0, 4, 80, 115], [0, 1, 0.8, 0.15])}
              transform={`rotate(${hash(i + 9) * 360 + f * 4} ${x} ${y})`}
            />
          );
        })}
      </svg>

      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", scale: String(1 + 0.025 * kick) }}>
        <div style={{ display: "flex", marginTop: -60 }}>
          {WORD.split("").map((ch, i) => {
            const s = i * 3;
            // ola rítmica: en cada beat las letras saltan en cascada
            const wave = beat >= 1 ? -26 * Math.exp(-Math.max(0, tb - i * 2) / 5) * (tb >= i * 2 ? 1 : 0) : 0;
            return (
              <div
                key={i}
                style={{
                  fontFamily: FONT,
                  fontWeight: 900,
                  fontSize: 290,
                  lineHeight: 1,
                  letterSpacing: "-0.05em",
                  color: C.paper,
                  scale: String(ip(f, [s, s + 22], [0, 1], backOut)),
                  rotate: `${ip(f, [s, s + 22], [i % 2 ? 40 : -40, 0], outExpo)}deg`,
                  translate: `0px ${wave}px`,
                }}
              >
                {ch}
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", top: 540 + 130, width: ip(f, [14, 50], [0, 1100], outExpo), height: 8, backgroundColor: C.orange }} />
        <div style={{ position: "absolute", top: 540 + 160, width: 1100, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontFamily: MONO, fontSize: 26, letterSpacing: "0.45em", color: C.paper, opacity: ip(f, [26, 40], [0, 1]) }}>MOTION DESIGNER</div>
          <svg width={4 * 46 + 3 * 18} height={46}>
            {[0, 1, 2, 3].map((k) => (
              <g key={k} transform={`translate(${k * 64 + 23} 23) scale(${ip(f, [k * BEAT, k * BEAT + 16], [0, 1], backOut)}) translate(-23 -23)`}>
                <Shape kind={k} size={46} color={[C.orange, C.blue, C.paper, C.lime][k]} />
              </g>
            ))}
          </svg>
          <div style={{ fontFamily: MONO, fontSize: 26, letterSpacing: "0.45em", color: C.paper, opacity: ip(f, [30, 44], [0, 1]) }}>REEL ’26</div>
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: "#fff", opacity: ip(f, [0, 16], [1, 0]) }} />
    </AbsoluteFill>
  );
};

export { Shape };
