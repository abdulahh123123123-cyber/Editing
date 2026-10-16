import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, FONT, MONO, SNARES, inExpo, ip } from "./lib";

const SQUARES = 18;
const GAP = 105; // 11.75 s: silencio antes del impacto

// 00:10 – 00:12 · Tensión: túnel que acelera con el redoble, contador con aberración cromática, y un hueco de silencio.
export const Build: React.FC = () => {
  const f = useCurrentFrame();
  const x = Math.min(1, f / GAP);
  const travel = 0.012 * f + 0.00011 * f * f * f / 30;
  let strobe = 0;
  for (const s of SNARES) if (f >= s) strobe = Math.max(strobe, Math.exp(-(f - s) / 2.5));
  const shake = 18 * x * x;
  const sx = Math.sin(f * 2.3) * shake + Math.sin(f * 5.1) * shake * 0.5;
  const sy = Math.cos(f * 1.7) * shake + Math.sin(f * 4.3) * shake * 0.5;
  const pct = Math.min(100, Math.floor(ip(f, [0, GAP - 4], [0, 100], inExpo)));
  const ab = 3 + 26 * x * x;

  if (f >= GAP) {
    // Silencio: solo una línea que se cierra
    return (
      <AbsoluteFill style={{ backgroundColor: "#000", justifyContent: "center", alignItems: "center" }}>
        <div style={{ width: ip(f, [GAP, 119], [520, 0], inExpo), height: 3, backgroundColor: C.paper }} />
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{ backgroundColor: C.ink, overflow: "hidden" }}>
      <AbsoluteFill style={{ translate: `${sx}px ${sy}px` }}>
        <svg width={1920} height={1080} style={{ position: "absolute" }}>
          {Array.from({ length: SQUARES }).map((_, i) => {
            const d = (((i / SQUARES + travel) % 1) + 1) % 1;
            const scale = 0.04 * Math.pow(90, d);
            const size = 300 * scale;
            return (
              <rect
                key={i}
                x={960 - size / 2}
                y={540 - size / 2}
                width={size}
                height={size}
                fill="none"
                stroke={i % 3 === 0 ? C.orange : i % 3 === 1 ? C.paper : C.blue}
                strokeWidth={1.5 + 9 * d}
                opacity={ip(d, [0, 0.15, 0.85, 1], [0, 1, 1, 0])}
                transform={`rotate(${i * 9 + f * (0.4 + 3 * x)} 960 540)`}
              />
            );
          })}
        </svg>
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
          {[
            { c: "#FF2A3A", dx: -ab, dy: ab * 0.3 },
            { c: "#00E5FF", dx: ab, dy: -ab * 0.3 },
            { c: C.paper, dx: 0, dy: 0 },
          ].map((l, k) => (
            <div
              key={k}
              style={{
                position: "absolute",
                fontFamily: FONT,
                fontWeight: 900,
                fontSize: 330,
                fontVariantNumeric: "tabular-nums",
                letterSpacing: "-0.04em",
                color: l.c,
                mixBlendMode: k < 2 ? "screen" : "normal",
                opacity: k < 2 ? 0.9 : 1,
                translate: `${l.dx}px ${l.dy}px`,
                scale: String(1 + 0.05 * strobe),
              }}
            >
              {String(pct).padStart(3, "0")}
            </div>
          ))}
        </AbsoluteFill>
        <div style={{ position: "absolute", left: 660, top: 760, width: 600, height: 6, backgroundColor: `${C.paper}33` }}>
          <div style={{ width: `${pct}%`, height: "100%", backgroundColor: C.orange }} />
        </div>
        <div style={{ position: "absolute", left: 660, top: 790, width: 600, display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 22, letterSpacing: "0.3em", color: C.paper }}>
          <span>RENDERING TENSION</span>
          <span>{pct}%</span>
        </div>
      </AbsoluteFill>
      {/* Pulso sutil en vez de estrobo: el redoble llega a 16 golpes/s y un flash a pantalla completa sería un riesgo fotosensible */}
      <AbsoluteFill style={{ backgroundColor: C.orange, opacity: strobe * 0.07 }} />
    </AbsoluteFill>
  );
};
