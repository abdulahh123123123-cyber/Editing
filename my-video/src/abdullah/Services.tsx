import { AbsoluteFill, useCurrentFrame } from "remotion";
import { BEAT, MONO, backOut, hash, ip, outExpo } from "../reel/lib";
import { A, SERIF, gradText, kickPulse } from "./brand";

const SERVICES = [
  { a: "Sports & Fight", b: "edits", tags: "MMA · BOXING · FOOTBALL", bg: A.night, fg: A.paper },
  { a: "Short-Form", b: "social", tags: "REELS · TIKTOK · SHORTS", bg: A.violet, fg: A.paper },
  { a: "Sound Design", b: "& mix", tags: "SFX · IMPACTS · RISERS", bg: A.night, fg: A.paper },
  { a: "Color &", b: "motion", tags: "GRADING · TITLES · VFX", bg: A.ink, fg: A.paper },
];

// Visual de cada servicio
const Visual: React.FC<{ b: number; t: number; kick: number }> = ({ b, t, kick }) => {
  const cx = 1400;
  const cy = 540;
  if (b === 0) {
    // Impacto: líneas de velocidad + guante de onda expansiva
    return (
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        {Array.from({ length: 48 }).map((_, i) => {
          const a = (i / 48) * Math.PI * 2;
          const r0 = ip(t, [0, 14], [40, 220], outExpo) + hash(i) * 40;
          const r1 = r0 + ip(t, [0, 10, 26], [0, 260 + hash(i + 1) * 300, 40], outExpo);
          return <line key={i} x1={cx + Math.cos(a) * r0} y1={cy + Math.sin(a) * r0} x2={cx + Math.cos(a) * r1} y2={cy + Math.sin(a) * r1} stroke={i % 3 ? A.paper : A.pink} strokeWidth={3 + hash(i + 4) * 5} strokeLinecap="round" opacity={ip(t, [0, 4, 28], [0, 1, 0.2])} />;
        })}
        <circle cx={cx} cy={cy} r={ip(t, [0, 8], [20, 150], backOut)} fill={A.pink} />
        <text x={cx} y={cy + 30} textAnchor="middle" fontFamily="Inter Display" fontWeight={900} fontSize={84} fill={A.night}>
          HIT
        </text>
      </svg>
    );
  }
  if (b === 1) {
    // Reencuadre 16:9 → 9:16
    const w = ip(t, [4, 22], [640, 300], outExpo);
    const h = ip(t, [4, 22], [360, 533], outExpo);
    return (
      <div style={{ position: "absolute", left: cx - w / 2, top: cy - h / 2, width: w, height: h, border: `6px solid ${A.paper}`, borderRadius: 24, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div style={{ fontFamily: MONO, fontSize: 28, color: A.paper, letterSpacing: "0.1em" }}>{t < 13 ? "16:9" : "9:16"}</div>
        <div style={{ position: "absolute", bottom: 20, left: 20, right: 20, height: 8, borderRadius: 4, backgroundColor: `${A.paper}44` }}>
          <div style={{ width: `${ip(t, [0, 30], [0, 100])}%`, height: "100%", borderRadius: 4, backgroundColor: A.paper }} />
        </div>
      </div>
    );
  }
  if (b === 2) {
    // Forma de onda que reacciona al golpe
    return (
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        {Array.from({ length: 44 }).map((_, i) => {
          const d = Math.abs(i - 22) / 22;
          const env = Math.exp(-t / 9) * (1 - d * 0.7) + 0.12;
          const h = (40 + 340 * env * (0.5 + 0.5 * hash(i + Math.floor(t / 3) * 7))) * (1 + 0.3 * kick);
          return <rect key={i} x={cx - 440 + i * 20} y={cy - h / 2} width={11} height={h} rx={5.5} fill={i % 2 ? A.violet : A.pink} opacity={ip(t, [i * 0.3, i * 0.3 + 6], [0, 1])} />;
        })}
      </svg>
    );
  }
  // Ruedas de color (lift / gamma / gain)
  return (
    <>
      {[0, 1, 2].map((k) => {
        const x = cx - 330 + k * 330;
        const ang = ip(t, [k * 3 + 4, 30], [0, 1.2 + k], outExpo) + k * 2;
        return (
          <div key={k} style={{ position: "absolute", left: x - 130, top: cy - 130, width: 260, height: 260, scale: String(ip(t, [k * 3, k * 3 + 16], [0, 1], backOut)) }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "conic-gradient(#ff4d6d, #ffd166, #7CFC8A, #4cc9f0, #4361ee, #c77dff, #ff4d6d)", border: `4px solid ${A.paper}`, boxSizing: "border-box" }} />
            <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: `radial-gradient(circle, ${A.paper}cc 0%, transparent 70%)` }} />
            <div style={{ position: "absolute", left: 130 + Math.cos(ang) * 60 - 16, top: 130 + Math.sin(ang) * 60 - 16, width: 32, height: 32, borderRadius: 16, border: `4px solid ${A.ink}`, boxSizing: "border-box" }} />
            <div style={{ position: "absolute", top: 290, width: 260, textAlign: "center", fontFamily: MONO, fontSize: 20, letterSpacing: "0.2em", color: A.lilac }}>{["LIFT", "GAMMA", "GAIN"][k]}</div>
          </div>
        );
      })}
    </>
  );
};

// 00:04 – 00:06 · Los cuatro servicios del sitio, uno por beat, cada uno con su propia demostración visual.
export const Services: React.FC<{ from: number }> = ({ from }) => {
  const f = useCurrentFrame();
  const b = Math.min(3, Math.floor(f / BEAT));
  const t = f - b * BEAT;
  const s = SERVICES[b];
  const kick = kickPulse(f + from);
  const punch = b === 0 ? 16 * Math.exp(-t / 5) : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: s.bg, overflow: "hidden", translate: `${Math.sin(t * 3.1) * punch}px ${Math.cos(t * 2.3) * punch}px` }}>
      <Visual b={b} t={t} kick={kick} />
      <div style={{ position: "absolute", left: 140, top: 330 }}>
        <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: "0.3em", color: s.fg, opacity: 0.75 }}>
          SERVICE {String(b + 1).padStart(2, "0")} / 04
        </div>
        <div style={{ overflow: "hidden", height: 165, marginTop: 18 }}>
          <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 132, lineHeight: "165px", letterSpacing: "-0.025em", color: s.fg, translate: `0px ${ip(t, [0, 14], [105, 0], outExpo)}%` }}>{s.a}</div>
        </div>
        <div style={{ overflow: "hidden", height: 170 }}>
          <div
            style={{
              fontFamily: SERIF,
              fontStyle: "italic",
              fontWeight: 600,
              fontSize: 140,
              lineHeight: "160px",
              paddingRight: 30,
              ...(b === 1 ? { color: A.paper } : gradText),
              translate: `0px ${ip(t, [3, 18], [105, 0], outExpo)}%`,
            }}
          >
            {s.b}
          </div>
        </div>
        <div style={{ marginTop: 20, fontFamily: MONO, fontSize: 24, letterSpacing: "0.25em", color: s.fg, opacity: ip(t, [8, 18], [0, 0.85]) }}>{s.tags}</div>
      </div>
    </AbsoluteFill>
  );
};
