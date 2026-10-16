import { AbsoluteFill, useCurrentFrame } from "remotion";
import { FONT, MONO, SNARES, inExpo, ip, outExpo } from "../reel/lib";
import { A, STACK } from "./brand";

const GAP = 105;
const SWITCH = 50;

// 00:10 – 00:12 · Tensión con datos reales del sitio: 5+ años y 100K+ vistas, sobre un túnel que acelera.
export const Stats: React.FC = () => {
  const f = useCurrentFrame();
  const x = Math.min(1, f / GAP);
  const travel = 0.012 * f + (0.00011 * f * f * f) / 30;
  let hitp = 0;
  for (const s of SNARES) if (f >= s) hitp = Math.max(hitp, Math.exp(-(f - s) / 2.5));
  const shake = 16 * x * x;
  const sx = Math.sin(f * 2.3) * shake + Math.sin(f * 5.1) * shake * 0.5;
  const sy = Math.cos(f * 1.7) * shake;
  const ab = 3 + 24 * x * x;

  const first = f < SWITCH;
  const value = first ? Math.round(ip(f, [0, 36], [0, 5], outExpo)) : Math.round(ip(f, [SWITCH, GAP - 4], [0, 100], inExpo));
  const label = first ? "YEARS EDITING" : "VIEWS GENERATED";
  const suffix = first ? "+" : "K+";
  const local = first ? f : f - SWITCH;

  if (f >= GAP) {
    return (
      <AbsoluteFill style={{ backgroundColor: "#000", justifyContent: "center", alignItems: "center" }}>
        <div style={{ width: ip(f, [GAP, 119], [520, 0], inExpo), height: 3, backgroundColor: A.paper }} />
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{ backgroundColor: A.night, overflow: "hidden" }}>
      <AbsoluteFill style={{ translate: `${sx}px ${sy}px` }}>
        <svg width={1920} height={1080} style={{ position: "absolute" }}>
          {Array.from({ length: 18 }).map((_, i) => {
            const d = (((i / 18 + travel) % 1) + 1) % 1;
            const size = 300 * 0.04 * Math.pow(90, d);
            return (
              <rect
                key={i}
                x={960 - size / 2}
                y={540 - size / 2}
                width={size}
                height={size}
                rx={size * 0.08}
                fill="none"
                stroke={[A.violet, A.pink, A.sky][i % 3]}
                strokeWidth={1.5 + 9 * d}
                opacity={ip(d, [0, 0.15, 0.85, 1], [0, 1, 1, 0])}
                transform={`rotate(${i * 9 + f * (0.4 + 3 * x)} 960 540)`}
              />
            );
          })}
        </svg>
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", translate: `0px ${ip(local, [0, 12], [80, 0], outExpo)}px`, opacity: ip(local, [0, 6], [0, 1]) }}>
          {[
            { c: "#FF2A8A", dx: -ab, dy: ab * 0.3 },
            { c: "#3AC8FF", dx: ab, dy: -ab * 0.3 },
            { c: A.paper, dx: 0, dy: 0 },
          ].map((l, k) => (
            <div
              key={k}
              style={{
                position: "absolute",
                top: 290,
                fontFamily: FONT,
                fontWeight: 900,
                fontSize: 320,
                fontVariantNumeric: "tabular-nums",
                letterSpacing: "-0.04em",
                color: l.c,
                mixBlendMode: k < 2 ? "screen" : "normal",
                opacity: k < 2 ? 0.9 : 1,
                translate: `${l.dx}px ${l.dy}px`,
                scale: String(1 + 0.05 * hitp),
              }}
            >
              {value}
              {suffix}
            </div>
          ))}
          <div style={{ position: "absolute", top: 680, fontFamily: MONO, fontSize: 30, letterSpacing: "0.45em", color: A.paper }}>{label}</div>
        </AbsoluteFill>
        {/* Las herramientas en una cinta que acelera */}
        <div style={{ position: "absolute", top: 900, left: 0, whiteSpace: "nowrap", fontFamily: MONO, fontSize: 26, letterSpacing: "0.25em", color: A.lilac, translate: `${-travel * 900}px 0px` }}>
          {Array.from({ length: 4 })
            .map(() => STACK.join("  ·  ").toUpperCase())
            .join("  ·  ")}
        </div>
      </AbsoluteFill>
      {/* Pulso sutil en lugar de estrobo (fotosensibilidad) */}
      <AbsoluteFill style={{ backgroundColor: A.violet, opacity: hitp * 0.08 }} />
    </AbsoluteFill>
  );
};
