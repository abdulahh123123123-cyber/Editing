import { AbsoluteFill, useCurrentFrame } from "remotion";
import { BEAT, FONT, MONO, backOut, hash, ip, outExpo } from "../reel/lib";
import { A, POSTERS, SERIF, gradText } from "./brand";

const X0 = 200;
const W = 1520;
const DUR = 120;
const toX = (fr: number) => X0 + (fr / DUR) * W;
const CUTS = [BEAT, 2 * BEAT, 3 * BEAT];

// Curva de rampa de velocidad: 100 % → cámara lenta → 400 % → 100 %
const speed = (u: number) => {
  if (u < 0.25) return 1;
  if (u < 0.5) return 1 - 0.75 * Math.sin(((u - 0.25) / 0.25) * (Math.PI / 2));
  if (u < 0.75) return 0.25 + 3.75 * Math.sin(((u - 0.5) / 0.25) * (Math.PI / 2)) ** 2;
  return 4 - 3 * ((u - 0.75) / 0.25);
};

// 00:06 – 00:08 · El oficio: cortes en el golpe, transitorios de audio alineados y una rampa de velocidad.
export const CutOnTheHit: React.FC = () => {
  const f = useCurrentFrame();
  const ph = Math.min(DUR, f);
  const px = toX(ph);
  const lastCut = [...CUTS].reverse().find((c) => f >= c);
  const sinceCut = lastCut === undefined ? 99 : f - lastCut;

  // Forma de onda con transitorios exactamente en los cortes
  const wave = Array.from({ length: 190 }, (_, i) => {
    const fr = (i / 190) * DUR;
    let a = 0.12 + 0.18 * hash(i * 1.7);
    for (const c of CUTS) if (fr >= c) a += 0.9 * Math.exp(-(fr - c) / 5);
    if (fr < 3) a += 0.6;
    return Math.min(1, a);
  });

  const rampY = (u: number) => 900 - (speed(u) / 4) * 150;
  const rampPath = Array.from({ length: 101 }, (_, k) => `${k ? "L" : "M"}${toX((k / 100) * DUR)},${rampY(k / 100)}`).join(" ");

  return (
    <AbsoluteFill style={{ backgroundColor: A.night, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: X0, top: 96, display: "flex", alignItems: "baseline", gap: 26 }}>
        <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 120, letterSpacing: "-0.045em", color: A.paper }}>Cut on the</span>
        <span style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 600, fontSize: 130, paddingRight: 24, ...gradText, scale: String(f >= BEAT ? ip(f, [BEAT, BEAT + 10], [1.3, 1], outExpo) : 1) }}>hit.</span>
      </div>
      <div style={{ position: "absolute", left: X0, top: 270, fontFamily: MONO, fontSize: 22, color: A.lilac, letterSpacing: "0.08em", opacity: ip(f, [10, 24], [0, 1]) }}>
        Anyone can cut clips together. The difference is what you hear.
      </div>

      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        {/* Regla de tiempo */}
        {Array.from({ length: 41 }).map((_, k) => (
          <line key={k} x1={X0 + (k / 40) * W} x2={X0 + (k / 40) * W} y1={360} y2={k % 5 ? 370 : 380} stroke={A.lilac} strokeOpacity={0.5} />
        ))}
        {/* V1: clips que cambian en cada corte */}
        {[0, ...CUTS].map((c, k) => {
          const end = k < CUTS.length ? CUTS[k] : DUR;
          return (
            <g key={k} opacity={ip(f, [k * 4, k * 4 + 12], [0, 1])}>
              <rect x={toX(c) + 2} y={400} width={toX(end) - toX(c) - 4} height={120} rx={8} fill={A.violet} opacity={0.18} />
              <foreignObject x={toX(c) + 2} y={400} width={toX(end) - toX(c) - 4} height={120}>
                <div style={{ width: "100%", height: "100%", borderRadius: 8, backgroundImage: POSTERS[k + 1], opacity: 0.85, display: "flex", alignItems: "flex-end", padding: 12, boxSizing: "border-box", fontFamily: MONO, fontSize: 16, color: "#fff", letterSpacing: "0.15em" }}>
                  {["SHOT_A", "IMPACT", "SLOW-MO", "RAMP"][k]}
                </div>
              </foreignObject>
            </g>
          );
        })}
        {/* A1: forma de onda */}
        {wave.map((a, i) => {
          const x = X0 + (i / 190) * W;
          const h = a * 70;
          return <rect key={i} x={x} y={600 - h} width={4} height={h * 2} rx={2} fill={x <= px ? A.pink : A.sky} opacity={x <= px ? 1 : 0.45} />;
        })}
        {/* Marcadores de corte */}
        {CUTS.map((c, k) => {
          const hit = f >= c;
          const t = f - c;
          return (
            <g key={k}>
              <line x1={toX(c)} x2={toX(c)} y1={392} y2={690} stroke={A.paper} strokeDasharray="4 6" strokeOpacity={0.4} />
              <polygon points={`${toX(c)},${372} ${toX(c) + 12},${384} ${toX(c)},${396} ${toX(c) - 12},${384}`} fill={hit ? A.pink : A.lilac} />
              {hit && <circle cx={toX(c)} cy={600} r={ip(t, [0, 20], [10, 140], outExpo)} fill="none" stroke={A.pink} strokeWidth={ip(t, [0, 20], [8, 0])} />}
              {hit && (
                <text x={toX(c)} y={350} textAnchor="middle" fontFamily="Inter Display" fontWeight={900} fontSize={34} fill={A.pink} opacity={ip(t, [0, 3, 22, 30], [0, 1, 1, 0])} transform={`translate(0 ${-ip(t, [0, 30], [0, 20])})`}>
                  HIT
                </text>
              )}
            </g>
          );
        })}
        {/* Rampa de velocidad */}
        <text x={X0} y={735} fontFamily="DejaVu Sans Mono" fontSize={18} fill={A.lilac} letterSpacing={4}>
          SPEED RAMP
        </text>
        <line x1={X0} x2={X0 + W} y1={rampY(0)} y2={rampY(0)} stroke={A.lilac} strokeOpacity={0.2} />
        <path d={rampPath} fill="none" stroke={A.violet} strokeWidth={5} pathLength={1} strokeDasharray="1 1" strokeDashoffset={ip(f, [0, 40], [1, 0], outExpo)} />
        <circle cx={px} cy={rampY(ph / DUR)} r={11} fill={A.paper} />
        <text x={px + 18} y={rampY(ph / DUR) - 14} fontFamily="DejaVu Sans Mono" fontSize={20} fill={A.paper}>
          {Math.round(speed(ph / DUR) * 100)}%
        </text>
        {/* Cabezal */}
        <line x1={px} x2={px} y1={356} y2={920} stroke={A.pink} strokeWidth={3} />
        <polygon points={`${px - 11},346 ${px + 11},346 ${px},362`} fill={A.pink} />
      </svg>
      {/* Pequeño destello en cada corte */}
      <AbsoluteFill style={{ backgroundColor: A.violet, opacity: 0.12 * Math.exp(-sinceCut / 4), pointerEvents: "none", scale: String(ip(sinceCut, [0, 10], [1.01, 1], backOut)) }} />
    </AbsoluteFill>
  );
};
