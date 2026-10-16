import { AbsoluteFill, useCurrentFrame } from "remotion";
import { MONO, backOut, hash, inExpo, ip, outExpo } from "../reel/lib";
import { A, SERIF } from "./brand";

const NAME = "ABDULLAH";
const SUB = "VIDEO EDITOR & POST-PRODUCTION";

const TRACKS = [
  { id: "V2", clips: [[0.18, 0.34], [0.52, 0.66]], color: A.pink },
  { id: "V1", clips: [[0.02, 0.27], [0.27, 0.49], [0.49, 0.78], [0.78, 0.98]], color: A.violet },
  { id: "A1", clips: [[0.02, 0.98]], color: A.sky, wave: true },
  { id: "A2", clips: [[0.1, 0.42], [0.6, 0.9]], color: "#7DD3FC", wave: true },
];

const TL = { x: 260, y: 790, w: 1400, rowH: 46 };

const Content: React.FC<{ f: number }> = ({ f }) => (
  <AbsoluteFill>
    {/* Línea de tiempo de un editor: los clips entran y encajan */}
    <svg width={1920} height={1080} style={{ position: "absolute" }}>
      {TRACKS.map((tr, ti) => {
        const y = TL.y + ti * TL.rowH;
        return (
          <g key={tr.id} opacity={ip(f, [8 + ti * 3, 22 + ti * 3], [0, 1])}>
            <text x={TL.x - 56} y={y + 28} fill={A.lilac} fontFamily="DejaVu Sans Mono" fontSize={18}>
              {tr.id}
            </text>
            <rect x={TL.x} y={y + 4} width={TL.w} height={TL.rowH - 8} fill="#ffffff" opacity={0.04} rx={6} />
            {tr.clips.map(([a, b], ci) => {
              const s = 14 + ti * 6 + ci * 5;
              const slide = ip(f, [s, s + 22], [1200, 0], outExpo);
              const x = TL.x + a * TL.w + slide;
              const w = (b - a) * TL.w - 4;
              return (
                <g key={ci} opacity={ip(f, [s, s + 6], [0, 1])}>
                  <rect x={x} y={y + 6} width={w} height={TL.rowH - 12} rx={6} fill={tr.color} opacity={tr.wave ? 0.25 : 0.9} />
                  {tr.wave &&
                    Array.from({ length: Math.floor(w / 6) }).map((_, k) => {
                      const amp = (0.25 + 0.75 * hash(k * 3.1 + ti * 50 + ci) ** 2) * (TL.rowH - 18) * 0.5;
                      return <rect key={k} x={x + 3 + k * 6} y={y + TL.rowH / 2 - amp} width={3} height={amp * 2} fill={tr.color} />;
                    })}
                </g>
              );
            })}
          </g>
        );
      })}
      {/* Cabezal de reproducción */}
      <g transform={`translate(${TL.x + ip(f, [20, 116], [0, TL.w])} 0)`} opacity={ip(f, [18, 24], [0, 1])}>
        <line y1={TL.y - 14} y2={TL.y + TL.rowH * 4} stroke={A.pink} strokeWidth={3} />
        <polygon points={`-10,${TL.y - 26} 10,${TL.y - 26} 0,${TL.y - 12}`} fill={A.pink} />
      </g>
    </svg>

    <AbsoluteFill style={{ alignItems: "center", top: 240 }}>
      <div style={{ display: "flex" }}>
        {NAME.split("").map((ch, i) => (
          <div key={i} style={{ overflow: "hidden", height: 290, lineHeight: "290px" }}>
            <div
              style={{
                fontFamily: SERIF,
                fontWeight: 600,
                fontSize: 230,
                color: A.paper,
                letterSpacing: "-0.01em",
                translate: `0px ${ip(f, [40 + i * 3, 66 + i * 3], [110, 0], outExpo)}%`,
              }}
            >
              {ch}
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 22, fontFamily: MONO, fontSize: 26, letterSpacing: "0.32em", color: A.lilac }}>
        {SUB.slice(0, Math.floor(ip(f, [58, 88], [0, SUB.length])))}
        <span style={{ opacity: Math.floor(f / 6) % 2 ? 1 : 0, color: A.pink }}>▍</span>
      </div>
    </AbsoluteFill>
  </AbsoluteFill>
);

// 00:00 – 00:03 · La línea de tiempo se monta, el nombre aparece, y un corte de cuchilla parte la imagen en dos.
export const Intro: React.FC = () => {
  // La intro de la canción dura 3 s (180 frames): la animación, diseñada para 120, se estira 1,5×
  const f = (useCurrentFrame() * 2) / 3;
  const cut = ip(f, [100, 118], [0, 1], inExpo);
  return (
    <AbsoluteFill style={{ backgroundColor: A.night, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 40%, ${A.violet}33, transparent 55%)` }} />
      {/* Punto REC que nace con el sub */}
      <div
        style={{
          position: "absolute",
          left: 960 - 14,
          top: 540 - 14,
          width: 28,
          height: 28,
          borderRadius: 14,
          backgroundColor: A.pink,
          scale: String(ip(f, [0, 12], [0, 1], backOut) * ip(f, [20, 34], [1, 0], inExpo)),
          boxShadow: `0 0 40px ${A.pink}`,
        }}
      />
      {/* El corte: la imagen se divide en dos mitades que se separan */}
      <AbsoluteFill style={{ clipPath: "polygon(0 0, 52% 0, 48% 100%, 0 100%)", translate: `${-cut * 1100}px ${cut * 60}px` }}>
        <Content f={f} />
      </AbsoluteFill>
      <AbsoluteFill style={{ clipPath: "polygon(52% 0, 100% 0, 100% 100%, 48% 100%)", translate: `${cut * 1100}px ${-cut * 60}px` }}>
        <Content f={f} />
      </AbsoluteFill>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <line x1={998} y1={0} x2={922} y2={1080} stroke={A.paper} strokeWidth={4} pathLength={1} strokeDasharray="1 1" strokeDashoffset={ip(f, [94, 102], [1, 0], outExpo)} opacity={ip(f, [94, 96, 110, 116], [0, 1, 1, 0])} />
      </svg>
      <AbsoluteFill style={{ backgroundColor: A.paper, opacity: ip(f, [112, 120], [0, 1], inExpo) }} />
    </AbsoluteFill>
  );
};
