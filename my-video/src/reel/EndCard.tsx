import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, FONT, MONO, ip, outExpo } from "./lib";
import { Shape } from "./Payoff";

// 00:14 – 00:15 · Golpe final y cartón de cierre.
export const EndCard: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: C.paper, justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 250,
          lineHeight: 1,
          letterSpacing: "-0.05em",
          color: C.ink,
          scale: String(ip(f, [0, 30], [1.18, 1], outExpo)),
          marginTop: -80,
        }}
      >
        CLAUDE<span style={{ color: C.orange }}>.</span>
      </div>
      <div style={{ marginTop: 26, width: ip(f, [2, 26], [0, 980], outExpo), height: 6, backgroundColor: C.ink }} />
      <div style={{ marginTop: 34, fontFamily: MONO, fontSize: 26, color: C.ink, letterSpacing: "0.08em", opacity: ip(f, [6, 18], [0, 1]) }}>
        Every frame and every note of this reel was written in code.
      </div>
      <div style={{ marginTop: 26, display: "flex", gap: 20, alignItems: "center", opacity: ip(f, [12, 24], [0, 1]) }}>
        <svg width={4 * 30 + 3 * 14} height={30}>
          {[0, 1, 2, 3].map((k) => (
            <g key={k} transform={`translate(${k * 44} 0)`}>
              <Shape kind={k} size={30} color={[C.orange, C.blue, C.ink, C.orange][k]} />
            </g>
          ))}
        </svg>
        <span style={{ fontFamily: MONO, fontSize: 20, letterSpacing: "0.3em", color: C.ink, opacity: 0.7 }}>
          1920×1080 · 60 FPS · 0 SAMPLES · 0 STOCK
        </span>
      </div>
      <AbsoluteFill style={{ backgroundColor: "#000", opacity: ip(f, [40, 60], [0, 1]) }} />
    </AbsoluteFill>
  );
};
