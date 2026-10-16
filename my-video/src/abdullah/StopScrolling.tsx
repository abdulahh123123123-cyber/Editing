import { AbsoluteFill, useCurrentFrame } from "remotion";
import { BEAT, FONT, MONO, backOut, hash, ip, kickPulse, outExpo } from "../reel/lib";
import { A, POSTERS, SERIF, WORK, gradText } from "./brand";

const CARD_H = 600;
const STOP_AT = 2 * BEAT; // la palabra "stop" cae en el tercer beat

// 00:02 – 00:04 · El titular del sitio, palabra a palabra, mientras un feed de móvil se desliza y frena en seco en "stop".
export const StopScrolling: React.FC<{ from: number }> = ({ from }) => {
  const f = useCurrentFrame();
  const kick = kickPulse(f + from);

  // Scroll rápido que frena con rebote justo en el beat de "stop"
  const target = 6 * CARD_H; // aterriza en GOAT (índice 6 de la lista repetida)
  const scroll =
    f < STOP_AT ? ip(f, [0, STOP_AT], [0, target + 140], (t) => t * t * 0.4 + t * 0.6) : target + 140 * (1 - ip(f, [STOP_AT, STOP_AT + 18], [0, 1], backOut));
  const feed = Array.from({ length: 9 }, (_, i) => (i === 6 ? 0 : (i + 2) % WORK.length));

  const lines = [
    { text: "Edits that", at: 0, size: 120 },
    { text: "make people", at: BEAT, size: 120 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: A.paper, overflow: "hidden" }}>
      <AbsoluteFill style={{ background: `radial-gradient(circle at 75% 50%, ${A.violet}22, transparent 50%)` }} />
      <div style={{ position: "absolute", left: 140, top: 200 }}>
        <div style={{ fontFamily: MONO, fontSize: 22, letterSpacing: "0.3em", color: A.violet, marginBottom: 26, opacity: ip(f, [0, 10], [0, 1]) }}>
          ● AVAILABLE FOR NEW PROJECTS
        </div>
        {lines.map((l) => (
          <div key={l.text} style={{ overflow: "hidden", height: l.size * 1.08 }}>
            <div
              style={{
                fontFamily: FONT,
                fontWeight: 900,
                fontSize: l.size,
                lineHeight: 1.08,
                letterSpacing: "-0.045em",
                color: A.ink,
                translate: `0px ${ip(f, [l.at, l.at + 16], [105, 0], outExpo)}%`,
              }}
            >
              {l.text}
            </div>
          </div>
        ))}
        {/* "stop" se estampa */}
        <div
          style={{
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: 210,
            lineHeight: 1,
            letterSpacing: "-0.05em",
            color: A.ink,
            opacity: f >= STOP_AT ? 1 : 0,
            scale: String(ip(f, [STOP_AT, STOP_AT + 10], [1.6, 1], outExpo)),
            transformOrigin: "left center",
            marginTop: 6,
          }}
        >
          stop
        </div>
        <div
          style={{
            fontFamily: SERIF,
            fontStyle: "italic",
            fontWeight: 600,
            fontSize: 150,
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            paddingRight: 30,
            ...gradText,
            clipPath: `inset(0 ${ip(f, [3 * BEAT, 3 * BEAT + 18], [100, 0], outExpo)}% 0 0)`,
          }}
        >
          scrolling.
        </div>
      </div>

      {/* Móvil con feed */}
      <div
        style={{
          position: "absolute",
          left: 1250,
          top: 140,
          width: 420,
          height: 800,
          borderRadius: 60,
          backgroundColor: A.ink,
          padding: 14,
          boxShadow: `0 40px 120px ${A.violet}55`,
          translate: `0px ${ip(f, [0, 20], [900, 0], outExpo)}px`,
          rotate: `${ip(f, [0, 20], [12, 4], outExpo) - (f >= STOP_AT ? 4 * Math.exp(-(f - STOP_AT) / 8) * Math.cos((f - STOP_AT) * 0.6) : 0)}deg`,
          scale: String(1 + 0.02 * kick),
        }}
      >
        <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 48, overflow: "hidden", backgroundColor: "#000" }}>
          {feed.map((w, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 0,
                top: i * CARD_H - scroll + 86,
                width: "100%",
                height: CARD_H - 12,
                backgroundImage: POSTERS[(i + 1) % POSTERS.length],
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                padding: 28,
                boxSizing: "border-box",
              }}
            >
              <div style={{ fontFamily: MONO, fontSize: 16, letterSpacing: "0.2em", color: "#fff", opacity: 0.85 }}>{WORK[w].label.toUpperCase()}</div>
              <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 64, lineHeight: 1, color: "#fff", letterSpacing: "-0.03em" }}>{WORK[w].title}</div>
              <div style={{ fontFamily: FONT, fontSize: 20, color: "#fff", opacity: 0.9, marginTop: 8 }}>{WORK[w].meta}</div>
            </div>
          ))}
          {/* Corazones al llegar a GOAT */}
          {Array.from({ length: 9 }).map((_, k) => {
            const s = STOP_AT + 18 + k * 3;
            const t = f - s;
            if (t < 0) return null;
            return (
              <div
                key={k}
                style={{
                  position: "absolute",
                  right: 30 + hash(k) * 60,
                  bottom: 120 + t * (4 + hash(k + 2) * 3),
                  fontSize: 30 + hash(k + 5) * 20,
                  color: k % 2 ? A.pink : "#fff",
                  opacity: ip(t, [0, 4, 30, 40], [0, 1, 1, 0]),
                  scale: String(ip(t, [0, 10], [0.2, 1], backOut)),
                }}
              >
                ♥
              </div>
            );
          })}
          <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 86, background: "linear-gradient(#000, transparent)", fontFamily: MONO, fontSize: 15, color: "#fff", display: "flex", justifyContent: "center", alignItems: "center", letterSpacing: "0.2em" }}>
            REELS
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
