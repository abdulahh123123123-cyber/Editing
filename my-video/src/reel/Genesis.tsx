import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, FONT, MONO, backOut, inExpo, ip, outExpo } from "./lib";

const WORD = "CLAUDE";
const SUB = "MOTION DESIGN SHOWREEL — 2026";

// 00:00 – 00:02 · Un punto nace, se estira en una línea, la línea traza la retícula y escribe el nombre.
export const Genesis: React.FC = () => {
  const f = useCurrentFrame();

  const lineW = ip(f, [16, 44], [0, 1180], outExpo);
  const dotSize = ip(f, [0, 14], [0, 28], backOut);
  const collapse = ip(f, [98, 118], [1, 0], inExpo);

  return (
    <AbsoluteFill style={{ backgroundColor: C.ink, overflow: "hidden" }}>
      {/* Onda del sub al nacer el punto */}
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        {[0, 6, 12].map((d) => (
          <circle
            key={d}
            cx={960}
            cy={540}
            r={ip(f, [d, d + 50], [10, 700], outExpo)}
            fill="none"
            stroke={C.paper}
            strokeWidth={ip(f, [d, d + 50], [3, 0])}
            opacity={0.5}
          />
        ))}
        {/* Retícula que se dibuja desde el centro */}
        {Array.from({ length: 11 }).map((_, i) => {
          const x = 160 + i * 160;
          const p = ip(f, [24 + Math.abs(i - 5) * 2, 60 + Math.abs(i - 5) * 2], [0, 1], outExpo);
          return (
            <line
              key={`v${i}`}
              x1={x}
              x2={x}
              y1={540 - 540 * p}
              y2={540 + 540 * p}
              stroke={C.paper}
              strokeOpacity={0.09 * collapse}
            />
          );
        })}
        {Array.from({ length: 6 }).map((_, i) => {
          const y = 90 + i * 180;
          const p = ip(f, [28 + i * 3, 64 + i * 3], [0, 1], outExpo);
          return (
            <line
              key={`h${i}`}
              y1={y}
              y2={y}
              x1={960 - 960 * p}
              x2={960 + 960 * p}
              stroke={C.paper}
              strokeOpacity={0.09 * collapse}
            />
          );
        })}
      </svg>

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          scale: String(ip(f, [98, 118], [1, 0.04], inExpo)),
          rotate: `${ip(f, [98, 118], [0, -14], inExpo)}deg`,
        }}
      >
        {/* Nombre: cada letra sube desde una máscara */}
        <div style={{ display: "flex", marginTop: -40 }}>
          {WORD.split("").map((ch, i) => (
            <div key={i} style={{ overflow: "hidden", height: 300, lineHeight: "300px" }}>
              <div
                style={{
                  fontFamily: FONT,
                  fontWeight: 900,
                  fontSize: 300,
                  color: C.paper,
                  letterSpacing: "-0.05em",
                  translate: `0px ${ip(f, [44 + i * 4, 72 + i * 4], [110, 0], outExpo)}%`,
                  rotate: `${ip(f, [44 + i * 4, 72 + i * 4], [12, 0], outExpo)}deg`,
                }}
              >
                {ch}
              </div>
            </div>
          ))}
        </div>

        {/* El punto que se convierte en línea y luego en subrayado */}
        <div
          style={{
            position: "absolute",
            left: 960 - Math.max(dotSize, lineW) / 2,
            top: 540 - ip(f, [16, 30], [dotSize, 8]) / 2,
            width: Math.max(dotSize, lineW),
            height: ip(f, [16, 30], [dotSize, 8]),
            borderRadius: 20,
            backgroundColor: C.orange,
            translate: `0px ${ip(f, [40, 66], [0, 150], outExpo)}px`,
          }}
        />

        <div
          style={{
            position: "absolute",
            top: 540 + 186,
            fontFamily: MONO,
            fontSize: 26,
            letterSpacing: "0.32em",
            color: C.paper,
          }}
        >
          {SUB.slice(0, Math.floor(ip(f, [60, 92], [0, SUB.length])))}
          <span style={{ opacity: Math.floor(f / 6) % 2 ? 1 : 0, color: C.orange }}>▍</span>
        </div>
      </AbsoluteFill>

      {/* Destello que anuncia el drop */}
      <AbsoluteFill style={{ backgroundColor: C.paper, opacity: ip(f, [110, 120], [0, 1], inExpo) }} />
    </AbsoluteFill>
  );
};
