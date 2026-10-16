import { AbsoluteFill, Easing, spring, useCurrentFrame } from "remotion";
import { C, FONT, MONO, backOut, ip, kickPulse, outExpo } from "./lib";

const curve = Easing.bezier(0.16, 1, 0.3, 1);
const GX = 170;
const GY = 820;
const GS = 600;
const toG = (x: number, y: number) => [GX + x * GS, GY - y * GS] as const;

const RUN = 44; // frames de cada recorrido
const PERIOD = 60; // cada dos beats

const LANES = [
  { name: "LINEAR", fn: (u: number) => u, color: C.paper },
  { name: "EASE-OUT · cubic-bezier(.16,1,.3,1)", fn: (u: number) => curve(u), color: C.orange },
  { name: "SPRING · damping 9", fn: (u: number) => spring({ frame: u * RUN, fps: 60, config: { damping: 9, stiffness: 120, mass: 0.9 } }), color: C.lime },
];

// 00:06 – 00:08 · El laboratorio de curvas: lo que un motion designer realmente ajusta.
export const EasingLab: React.FC<{ from: number }> = ({ from }) => {
  const f = useCurrentFrame();
  const kick = kickPulse(f + from);
  const local = Math.max(0, f - 16);
  const u = ip(local % PERIOD, [0, RUN], [0, 1]);
  const p0 = toG(0, 0);
  const p1 = toG(0.16, 1);
  const p2 = toG(0.3, 1);
  const p3 = toG(1, 1);
  const draw = ip(f, [0, 36], [1, 0], outExpo);
  const [bx, by] = toG(u, curve(u));

  return (
    <AbsoluteFill style={{ backgroundColor: C.ink, overflow: "hidden" }}>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        {/* Papel milimetrado del gráfico */}
        {Array.from({ length: 11 }).map((_, i) => (
          <g key={i} opacity={ip(f, [i, i + 14], [0, 1])}>
            <line x1={GX + i * 60} x2={GX + i * 60} y1={GY - GS} y2={GY} stroke={C.paper} strokeOpacity={i % 5 ? 0.06 : 0.16} />
            <line y1={GY - i * 60} y2={GY - i * 60} x1={GX} x2={GX + GS} stroke={C.paper} strokeOpacity={i % 5 ? 0.06 : 0.16} />
          </g>
        ))}
        <line x1={GX} y1={GY} x2={GX + GS} y2={GY} stroke={C.paper} strokeWidth={2} />
        <line x1={GX} y1={GY} x2={GX} y2={GY - GS} stroke={C.paper} strokeWidth={2} />
        {/* Lineal como referencia */}
        <line x1={p0[0]} y1={p0[1]} x2={p3[0]} y2={GY - GS} stroke={C.paper} strokeOpacity={0.25} strokeDasharray="6 10" />
        {/* Manejadores bezier */}
        <g opacity={ip(f, [8, 20], [0, 1])}>
          <line x1={p0[0]} y1={p0[1]} x2={p1[0]} y2={p1[1]} stroke={C.orange} strokeWidth={2} />
          <line x1={p3[0]} y1={p3[1]} x2={p2[0]} y2={p2[1]} stroke={C.orange} strokeWidth={2} />
          <circle cx={p1[0]} cy={p1[1]} r={ip(f, [10, 22], [0, 11], backOut)} fill={C.ink} stroke={C.orange} strokeWidth={3} />
          <circle cx={p2[0]} cy={p2[1]} r={ip(f, [14, 26], [0, 11], backOut)} fill={C.ink} stroke={C.orange} strokeWidth={3} />
        </g>
        <path
          d={`M${p0[0]},${p0[1]} C${p1[0]},${p1[1]} ${p2[0]},${p2[1]} ${p3[0]},${p3[1]}`}
          fill="none"
          stroke={C.paper}
          strokeWidth={6}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray="1 1"
          strokeDashoffset={draw}
        />
        {/* Cursor de tiempo */}
        <line x1={bx} x2={bx} y1={GY} y2={by} stroke={C.orange} strokeOpacity={0.6} strokeDasharray="4 6" />
        <line x1={GX} x2={bx} y1={by} y2={by} stroke={C.orange} strokeOpacity={0.6} strokeDasharray="4 6" />
        <circle cx={bx} cy={by} r={13 + 6 * kick} fill={C.orange} />

        {/* Carriles comparativos con papel cebolla y marcas de espaciado */}
        {LANES.map((lane, li) => {
          const y = 330 + li * 210;
          const x0 = 960;
          const L = 780;
          return (
            <g key={li} opacity={ip(f, [6 + li * 5, 20 + li * 5], [0, 1])}>
              <line x1={x0} x2={x0 + L} y1={y} y2={y} stroke={C.paper} strokeOpacity={0.2} strokeWidth={2} />
              {Array.from({ length: 13 }).map((_, k) => {
                const v = lane.fn(k / 12);
                return <line key={k} x1={x0 + L * v} x2={x0 + L * v} y1={y - 16} y2={y + 16} stroke={lane.color} strokeOpacity={0.55} strokeWidth={2} />;
              })}
              {[7, 6, 5, 4, 3, 2, 1].map((g) => {
                const ug = Math.max(0, u - g * 0.035);
                return <circle key={g} cx={x0 + L * lane.fn(ug)} cy={y} r={26} fill="none" stroke={lane.color} strokeOpacity={0.5 - g * 0.06} strokeWidth={2} />;
              })}
              <circle cx={x0 + L * lane.fn(u)} cy={y} r={26 + 6 * kick} fill={lane.color} />
            </g>
          );
        })}
      </svg>
      {LANES.map((lane, li) => (
        <div
          key={li}
          style={{
            position: "absolute",
            left: 960,
            top: 330 + li * 210 - 78,
            fontFamily: MONO,
            fontSize: 23,
            letterSpacing: "0.2em",
            color: lane.color,
            opacity: ip(f, [6 + li * 5, 20 + li * 5], [0, 1]),
          }}
        >
          {lane.name}
        </div>
      ))}
      <div style={{ position: "absolute", left: GX, top: 96, fontFamily: FONT, fontWeight: 900, fontSize: 84, color: C.paper, letterSpacing: "-0.03em" }}>
        Easing is <span style={{ color: C.orange }}>everything.</span>
      </div>
      <div style={{ position: "absolute", left: GX, top: GY + 30, fontFamily: MONO, fontSize: 22, color: C.paper, opacity: 0.8, letterSpacing: "0.08em" }}>
        t = {u.toFixed(3)} → y = {curve(u).toFixed(3)}
      </div>
    </AbsoluteFill>
  );
};
