import { AbsoluteFill, useCurrentFrame } from "remotion";
import { BEAT, FONT, MONO, backOut, hash, ip, outExpo } from "../reel/lib";
import { A, GRAD, SERIF, gradText, kickPulse } from "./brand";

const NAME = "ABDULLAH";
const TAGS = ["MMA", "FOOTBALL", "REELS", "SOUND", "COLOR", "MOTION"];

// 00:12 – 00:14 · Impacto: onda expansiva, fragmentos y el nombre que aterriza.
export const Impact: React.FC<{ from: number }> = ({ from }) => {
  const f = useCurrentFrame();
  const kick = kickPulse(f + from);
  const beat = Math.floor(f / BEAT);
  const tb = f % BEAT;
  return (
    <AbsoluteFill style={{ backgroundColor: A.night, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: `repeating-conic-gradient(from ${f * 0.35}deg at 960px 540px, ${A.violet}2a 0deg 5deg, transparent 5deg 10deg)`, opacity: ip(f, [0, 20], [0, 1]) }} />
      <AbsoluteFill style={{ background: `radial-gradient(circle at 960px 540px, ${A.pink}55 0%, transparent 50%)`, opacity: 0.6 + 0.5 * kick }} />
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        {[0, 5].map((d) => (
          <circle key={d} cx={960} cy={540} r={ip(f - d, [0, 45], [0, 1400], outExpo)} fill="none" stroke={d ? A.paper : A.pink} strokeWidth={ip(f - d, [0, 45], [90, 0])} />
        ))}
        {Array.from({ length: 140 }).map((_, i) => {
          const a = hash(i) * Math.PI * 2;
          const dist = (300 + hash(i + 7) * 900) * ip(f, [0, 70], [0, 1], outExpo);
          const size = 4 + hash(i + 3) * 14;
          const x = 960 + Math.cos(a) * dist;
          const y = 540 + Math.sin(a) * dist;
          return <rect key={i} x={x - size / 2} y={y - size / 2} width={size} height={size} rx={i % 2 ? size / 2 : 2} fill={[A.violet, A.paper, A.pink, A.sky][i % 4]} opacity={ip(f, [0, 4, 80, 115], [0, 1, 0.8, 0.15])} transform={`rotate(${hash(i + 9) * 360 + f * 4} ${x} ${y})`} />;
        })}
      </svg>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", scale: String(1 + 0.025 * kick) }}>
        <div style={{ display: "flex", marginTop: -70 }}>
          {NAME.split("").map((ch, i) => {
            const s = i * 2.5;
            const wave = beat >= 1 && tb >= i * 2 ? -24 * Math.exp(-(tb - i * 2) / 5) : 0;
            return (
              <div key={i} style={{ fontFamily: FONT, fontWeight: 900, fontSize: 250, lineHeight: 1, letterSpacing: "-0.045em", color: A.paper, scale: String(ip(f, [s, s + 22], [0, 1], backOut)), rotate: `${ip(f, [s, s + 22], [i % 2 ? 40 : -40, 0], outExpo)}deg`, translate: `0px ${wave}px` }}>
                {ch}
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", top: 540 + 110, width: ip(f, [14, 50], [0, 1180], outExpo), height: 8, backgroundImage: GRAD, borderRadius: 4 }} />
        <div style={{ position: "absolute", top: 540 + 140, fontFamily: SERIF, fontStyle: "italic", fontWeight: 600, fontSize: 56, paddingRight: 16, ...gradText, opacity: ip(f, [20, 34], [0, 1]) }}>
          Video Editor &amp; Post-Production
        </div>
        <div style={{ position: "absolute", top: 540 + 240, display: "flex", gap: 18 }}>
          {TAGS.map((t, k) => {
            const s = 24 + k * 10;
            return (
              <div key={t} style={{ fontFamily: MONO, fontSize: 20, letterSpacing: "0.25em", color: A.paper, border: `2px solid ${A.paper}55`, borderRadius: 999, padding: "10px 22px", scale: String(ip(f, [s, s + 14], [0, 1], backOut)) }}>
                {t}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: "#fff", opacity: ip(f, [0, 16], [1, 0]) }} />
    </AbsoluteFill>
  );
};

// 00:15 – 00:17 · Llamada a la acción del sitio + contacto.
export const Outro: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: A.night, justifyContent: "center", alignItems: "center" }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 45%, ${A.violet}33, transparent 60%)` }} />
      <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 140, lineHeight: 1, letterSpacing: "-0.045em", color: A.paper, scale: String(ip(f, [0, 30], [1.15, 1], outExpo)), marginTop: -70 }}>
        Let’s cut something
      </div>
      <div style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 600, fontSize: 150, lineHeight: 1.15, paddingRight: 30, ...gradText, clipPath: `inset(0 ${ip(f, [2, 20], [100, 0], outExpo)}% 0 0)` }}>worth watching.</div>
      <div style={{ marginTop: 34, display: "flex", gap: 34, fontFamily: MONO, fontSize: 26, letterSpacing: "0.12em", color: A.paper, opacity: ip(f, [8, 20], [0, 1]) }}>
        <span>@abdullah_h000</span>
        <span style={{ color: A.violet }}>●</span>
        <span>abdulahh123123123@gmail.com</span>
      </div>
      <div style={{ marginTop: 18, fontFamily: MONO, fontSize: 20, letterSpacing: "0.3em", color: A.paper, opacity: ip(f, [14, 26], [0, 0.65]) }}>
        AVAILABLE FOR NEW PROJECTS · EGYPT → WORLDWIDE
      </div>
      <AbsoluteFill style={{ backgroundColor: "#000", opacity: ip(f, [90, 120], [0, 1]) }} />
    </AbsoluteFill>
  );
};
