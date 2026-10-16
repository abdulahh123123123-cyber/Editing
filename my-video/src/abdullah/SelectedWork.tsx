import { AbsoluteFill, useCurrentFrame } from "remotion";
import { BEAT, FONT, MONO, backOut, ip, outExpo } from "../reel/lib";
import { A, POSTERS, SERIF, WORK, gradText, kickPulse } from "./brand";

const CW = 380;
const CH = 520;
const GAP = 40;

// 00:08 – 00:10 · Trabajos seleccionados del sitio en un carrusel 3D; en cada beat uno pasa al frente.
export const SelectedWork: React.FC<{ from: number }> = ({ from }) => {
  const f = useCurrentFrame();
  const kick = kickPulse(f + from);
  const b = Math.min(3, Math.floor(f / BEAT));
  const t = f - b * BEAT;
  // La cámara se desplaza para que la tarjeta destacada de cada beat quede centrada
  const pan = ip(f, [0, 120], [720, -960]);

  return (
    <AbsoluteFill style={{ backgroundColor: A.ink, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 60% 60%, ${A.violet}55, transparent 55%)` }} />
      <AbsoluteFill style={{ perspective: 1600 }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 370,
            transformStyle: "preserve-3d",
            transform: `translateX(${pan}px) rotateY(-16deg) rotateX(6deg)`,
          }}
        >
          {WORK.map((w, i) => {
            const featured = i === b;
            const pop = featured ? ip(t, [0, 16], [0, 1], backOut) : i === b - 1 ? ip(t, [0, 12], [1, 0], outExpo) : 0;
            const enter = ip(f, [i * 4, i * 4 + 24], [600, 0], outExpo);
            return (
              <div
                key={w.title}
                style={{
                  position: "absolute",
                  left: i * (CW + GAP),
                  top: 0,
                  width: CW,
                  height: CH,
                  borderRadius: 26,
                  backgroundImage: POSTERS[i % POSTERS.length],
                  transform: `translateY(${enter + pop * 20}px) translateZ(${pop * 110}px) scale(${1 + 0.03 * kick * (featured ? 1 : 0)})`,
                  boxShadow: `0 ${30 + pop * 40}px ${80 + pop * 60}px rgba(10,5,30,${0.45 + pop * 0.3})`,
                  overflow: "hidden",
                }}
              >
                <div style={{ position: "absolute", top: 26, left: 28, fontFamily: MONO, fontSize: 16, letterSpacing: "0.2em", color: "#fff" }}>
                  {String(i + 1).padStart(2, "0")} · {w.label.toUpperCase()}
                </div>
                <div style={{ position: "absolute", top: CH / 2 - 44, left: CW / 2 - 44, width: 88, height: 88, borderRadius: 44, backgroundColor: "rgba(255,255,255,0.25)", display: "flex", justifyContent: "center", alignItems: "center", scale: String(1 + pop * 0.25) }}>
                  <div style={{ width: 0, height: 0, borderTop: "18px solid transparent", borderBottom: "18px solid transparent", borderLeft: "30px solid #fff", marginLeft: 8 }} />
                </div>
                <div style={{ position: "absolute", bottom: 28, left: 28, right: 28 }}>
                  <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: w.title.length > 8 ? 50 : 70, lineHeight: 1, letterSpacing: "-0.03em", color: "#fff" }}>{w.title}</div>
                  <div style={{ fontFamily: FONT, fontSize: 20, color: "#fff", opacity: 0.92, marginTop: 10 }}>{w.meta}</div>
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      {/* El título va encima de las tarjetas para que la que pasa al frente no lo tape */}
      <div style={{ position: "absolute", left: 140, top: 96, display: "flex", alignItems: "baseline", gap: 24 }}>
        <span style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 110, letterSpacing: "-0.025em", color: A.paper, translate: `0px ${ip(f, [0, 16], [40, 0], outExpo)}px`, opacity: ip(f, [0, 10], [0, 1]) }}>Selected</span>
        <span style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 600, fontSize: 120, paddingRight: 24, ...gradText, opacity: ip(f, [6, 16], [0, 1]) }}>work.</span>
      </div>

    </AbsoluteFill>
  );
};
