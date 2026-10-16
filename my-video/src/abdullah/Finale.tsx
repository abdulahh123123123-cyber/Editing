import { AbsoluteFill, useCurrentFrame } from "remotion";
import { BEAT, hash, ip, outExpo } from "../reel/lib";
import { A, GRAD, SERIF, gradText, kickPulse } from "./brand";

const NAME = "ABDULLAH";
const TAGS = ["MMA", "FOOTBALL", "REELS", "SOUND", "COLOR", "MOTION"];

const SHIMMER = `linear-gradient(100deg, ${A.paper} 0%, ${A.paper} 40%, ${A.pink} 47%, ${A.violet} 52%, ${A.paper} 60%, ${A.paper} 100%)`;
const LETTER_W = 172; // ancho medio aproximado de una mayúscula de Playfair 600 a 240 px

// 00:13 – 00:15 · Revelación del nombre con el lenguaje de movimiento del sitio:
// máscara "wordUp" letra a letra, el tracking se cierra (de .5em del preloader al titular) y un brillo "shimmer" lo recorre.
export const Impact: React.FC<{ from: number }> = ({ from }) => {
  const f = useCurrentFrame();
  const kick = kickPulse(f + from);
  const beat = Math.floor(f / BEAT);
  const tb = f % BEAT;
  const shift = ip(f, [26, 84], [-1700, 1700]);
  return (
    <AbsoluteFill style={{ backgroundColor: A.night, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: `repeating-conic-gradient(from ${f * 0.3}deg at 960px 520px, ${A.violet}1c 0deg 4deg, transparent 4deg 9deg)`, opacity: ip(f, [0, 24], [0, 0.8]) }} />
      <AbsoluteFill style={{ background: `radial-gradient(circle at 960px 520px, ${A.violet}44 0%, transparent 48%)`, opacity: 0.55 + 0.45 * kick }} />
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        {[0, 6].map((d) => (
          <circle key={d} cx={960} cy={520} r={ip(f - d, [0, 48], [0, 1400], outExpo)} fill="none" stroke={d ? A.paper : A.violet} strokeWidth={ip(f - d, [0, 48], [70, 0])} opacity={d ? 0.6 : 1} />
        ))}
        {Array.from({ length: 90 }).map((_, i) => {
          const a = hash(i) * Math.PI * 2;
          const dist = (320 + hash(i + 7) * 880) * ip(f, [0, 80], [0, 1], outExpo);
          const size = 3 + hash(i + 3) * 9;
          const x = 960 + Math.cos(a) * dist;
          const y = 520 + Math.sin(a) * dist;
          return <circle key={i} cx={x} cy={y} r={size / 2} fill={[A.violet, A.paper, A.pink][i % 3]} opacity={ip(f, [0, 4, 70, 115], [0, 0.9, 0.55, 0.1])} />;
        })}
      </svg>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", scale: String(ip(f, [0, 40], [1.06, 1], outExpo) + 0.015 * kick) }}>
        <div style={{ display: "flex", marginTop: -90, letterSpacing: `${ip(f, [0, 30], [0.32, -0.01], outExpo)}em` }}>
          {NAME.split("").map((ch, i) => {
            const s = i * 3;
            const wave = beat >= 1 && tb >= i * 2 ? -12 * Math.exp(-(tb - i * 2) / 5) : 0;
            return (
              <div key={i} style={{ overflow: "hidden", height: 300, lineHeight: "300px", paddingInline: 2 }}>
                <div
                  style={{
                    fontFamily: SERIF,
                    fontWeight: 600,
                    fontSize: 240,
                    color: "transparent",
                    backgroundImage: SHIMMER,
                    backgroundSize: "1700px 100%",
                    backgroundPosition: `${shift - i * LETTER_W}px 0px`,
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    translate: `0px calc(${ip(f, [s, s + 26], [110, 0], outExpo)}% + ${wave}px)`,
                  }}
                >
                  {ch}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", top: 520 + 108, width: ip(f, [16, 52], [0, 1100], outExpo), height: 4, backgroundImage: GRAD, borderRadius: 4 }} />
        <div style={{ position: "absolute", top: 520 + 132, overflow: "hidden", height: 80 }}>
          <div style={{ fontFamily: SERIF, fontStyle: "italic", fontWeight: 600, fontSize: 54, lineHeight: "80px", paddingRight: 16, ...gradText, translate: `0px ${ip(f, [20, 46], [110, 0], outExpo)}%` }}>
            Video Editor &amp; Post-Production
          </div>
        </div>
        <div style={{ position: "absolute", top: 520 + 240, display: "flex", gap: 14 }}>
          {TAGS.map((t, k) => {
            const s = 24 + k * 10;
            return (
              <div
                key={t}
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 500,
                  fontSize: 19,
                  letterSpacing: "0.16em",
                  color: A.paper,
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  borderRadius: 999,
                  padding: "10px 22px",
                  opacity: ip(f, [s, s + 8], [0, 1]),
                  translate: `0px ${ip(f, [s, s + 16], [18, 0], outExpo)}px`,
                }}
              >
                {t}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      {/* Destello cálido en el golpe (antes era blanco puro y quemaba la imagen) */}
      <AbsoluteFill style={{ backgroundColor: "#FFE2C4", opacity: ip(f, [0, 10], [0.85, 0]) }} />
    </AbsoluteFill>
  );
};

// 00:15 – 00:17 · Cierre con los componentes reales del sitio: insignia "Available" con punto verde, titular y botón en píldora.
export const Outro: React.FC = () => {
  const f = useCurrentFrame();
  const words = ["Let’s", "cut", "something"];
  return (
    <AbsoluteFill style={{ backgroundColor: A.night, justifyContent: "center", alignItems: "center" }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 45%, ${A.violet}2e, transparent 60%)` }} />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginTop: -40,
          marginBottom: 34,
          padding: "10px 22px 10px 16px",
          borderRadius: 999,
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.16)",
          fontFamily: "'Inter', sans-serif",
          fontWeight: 500,
          fontSize: 22,
          color: A.paper,
          opacity: ip(f, [0, 10], [0, 1]),
          translate: `0px ${ip(f, [0, 18], [16, 0], outExpo)}px`,
        }}
      >
        <span style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: "#22C55E", boxShadow: `0 0 0 ${ip(f % 40, [0, 28, 40], [0, 9, 9])}px rgba(34,197,94,${ip(f % 40, [0, 28, 40], [0.5, 0, 0])})` }} />
        Available for new projects
      </div>
      <div style={{ display: "flex", gap: 30 }}>
        {words.map((w, i) => (
          <div key={w} style={{ overflow: "hidden", height: 150 }}>
            <div style={{ fontFamily: SERIF, fontWeight: 600, fontSize: 124, lineHeight: "150px", letterSpacing: "-0.03em", color: A.paper, translate: `0px ${ip(f, [i * 3.6, i * 3.6 + 30], [110, 0], outExpo)}%` }}>{w}</div>
          </div>
        ))}
      </div>
      <div style={{ overflow: "hidden", height: 170 }}>
        <div
          style={{
            fontFamily: SERIF,
            fontStyle: "italic",
            fontWeight: 600,
            fontSize: 140,
            lineHeight: "170px",
            paddingRight: 30,
            backgroundImage: `linear-gradient(100deg, ${A.violet} 5%, ${A.pink} 46%, ${A.violet} 92%)`,
            backgroundSize: "200% auto",
            backgroundPosition: `${ip(f, [0, 120], [0, 120])}% center`,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            translate: `0px ${ip(f, [10, 40], [110, 0], outExpo)}%`,
          }}
        >
          worth watching.
        </div>
      </div>
      <div style={{ marginTop: 30, display: "flex", gap: 22, alignItems: "center", opacity: ip(f, [22, 34], [0, 1]), translate: `0px ${ip(f, [22, 40], [16, 0], outExpo)}px` }}>
        <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: 24, color: A.night, backgroundColor: A.violet, borderRadius: 999, padding: "16px 30px" }}>Start a project →</div>
        <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: 24, color: A.paper, border: "1px solid rgba(255,255,255,0.22)", borderRadius: 999, padding: "15px 28px" }}>@abdullah_h000</div>
      </div>
      <div style={{ marginTop: 26, fontFamily: "'Inter', sans-serif", fontSize: 20, letterSpacing: "0.04em", color: A.lilac, opacity: ip(f, [30, 42], [0, 1]) }}>
        abdulahh123123123@gmail.com · Egypt · Working worldwide (remote)
      </div>
      <AbsoluteFill style={{ backgroundColor: "#000", opacity: ip(f, [92, 120], [0, 1]) }} />
    </AbsoluteFill>
  );
};
