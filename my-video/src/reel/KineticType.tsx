import { AbsoluteFill, useCurrentFrame } from "remotion";
import { BEAT, C, FONT, backOut, ip, kickPulse, outExpo } from "./lib";

const WORDS = [
  { w: "TIMING", bg: C.ink, fg: C.paper, accent: C.orange },
  { w: "SPACING", bg: C.orange, fg: C.ink, accent: C.paper },
  { w: "RHYTHM", bg: C.paper, fg: C.ink, accent: C.blue },
  { w: "EASE.", bg: C.blue, fg: C.paper, accent: C.lime },
];

const SIZE = 310;

// 00:04 – 00:06 · Tipografía cinética: una palabra por beat, cada una con un tipo de entrada distinto.
export const KineticType: React.FC<{ from: number }> = ({ from }) => {
  const f = useCurrentFrame();
  const b = Math.min(3, Math.floor(f / BEAT));
  const t = f - b * BEAT;
  const { w, bg, fg, accent } = WORDS[b];
  const kick = kickPulse(f + from);
  const letters = w.split("");
  const mid = (letters.length - 1) / 2;

  const letterStyle = (i: number): React.CSSProperties => {
    if (b === 1) {
      // SPACING: las letras convergen desde un tracking exagerado
      const off = (i - mid) * ip(t, [0, 20], [190, 0], outExpo);
      return { translate: `${off}px 0px` };
    }
    if (b === 2) {
      // RHYTHM: caen una a una con rebote
      const s = i * 2;
      return {
        translate: `0px ${ip(t, [s, s + 16], [-760, 0], backOut)}px`,
        rotate: `${ip(t, [s, s + 16], [i % 2 ? 25 : -25, 0], outExpo)}deg`,
      };
    }
    return {};
  };

  return (
    <AbsoluteFill style={{ backgroundColor: bg, overflow: "hidden" }}>
      {/* Marquesina de fondo con la palabra en contorno */}
      {[0, 1, 2, 3, 4, 5].map((row) => (
        <div
          key={row}
          style={{
            position: "absolute",
            top: -40 + row * 190,
            left: 0,
            whiteSpace: "nowrap",
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: 180,
            lineHeight: "190px",
            color: "transparent",
            WebkitTextStroke: `2px ${fg}`,
            opacity: 0.13,
            translate: `${(row % 2 ? -1 : 1) * (f * 9) - 600}px 0px`,
          }}
        >
          {`${w} `.repeat(8)}
        </div>
      ))}

      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", scale: String(1 + 0.035 * kick) }}>
        {/* EASE.: ecos en contorno que se asientan con la curva */}
        {b === 3 &&
          [5, 4, 3, 2, 1].map((k) => (
            <div
              key={k}
              style={{
                position: "absolute",
                fontFamily: FONT,
                fontWeight: 900,
                fontSize: SIZE,
                letterSpacing: "-0.05em",
                color: "transparent",
                WebkitTextStroke: `3px ${k % 2 ? accent : fg}`,
                translate: `${-k * ip(t, [0, 24], [120, 18], outExpo)}px ${k * ip(t, [0, 24], [40, 6], outExpo)}px`,
                opacity: ip(t, [0, 6], [0, 1]) * (1 - k / 7),
              }}
            >
              {w}
            </div>
          ))}
        <div
          style={{
            display: "flex",
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: SIZE,
            lineHeight: 1,
            color: fg,
            letterSpacing: b === 0 ? `${ip(t, [0, 20], [0.35, -0.05], outExpo)}em` : "-0.05em",
            scale: b === 0 ? String(ip(t, [0, 18], [2.8, 1], outExpo)) : undefined,
            filter: b === 0 ? `blur(${ip(t, [0, 10], [26, 0])}px)` : undefined,
            clipPath: b === 3 ? `inset(0 ${ip(t, [0, 16], [100, 0], outExpo)}% 0 0)` : undefined,
            transform: b === 3 ? `skewX(${ip(t, [0, 18], [-18, 0], outExpo)}deg)` : undefined,
          }}
        >
          {letters.map((ch, i) => (
            <span key={i} style={{ display: "inline-block", ...letterStyle(i) }}>
              {ch}
            </span>
          ))}
        </div>
        {/* Barra de acento que corta en cada beat */}
        <div
          style={{
            position: "absolute",
            top: 540 + 190,
            height: 14,
            backgroundColor: accent,
            width: ip(t, [2, 22], [0, 900], outExpo),
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
