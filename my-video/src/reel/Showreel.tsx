import { Audio } from "@remotion/media";
import { CameraMotionBlur } from "@remotion/motion-blur";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Build } from "./Build";
import { EasingLab } from "./EasingLab";
import { EndCard } from "./EndCard";
import { Genesis } from "./Genesis";
import { KineticType } from "./KineticType";
import { BEAT, C, MONO, hash, inOut, ip, kickPulse } from "./lib";
import { Particles } from "./Particles";
import { Payoff } from "./Payoff";
import { Principles } from "./Principles";

const SCENES = [
  { from: 0, name: "GENESIS" },
  { from: 120, name: "SHAPE LANGUAGE" },
  { from: 240, name: "KINETIC TYPE" },
  { from: 360, name: "EASING" },
  { from: 480, name: "GENERATIVE" },
  { from: 600, name: "TENSION" },
  { from: 720, name: "IMPACT" },
  { from: 840, name: "END" },
];

// Cortinilla diagonal que tapa el corte justo en el beat
const Wipe: React.FC<{ at: number; color: string; stripe: string }> = ({ at, color, stripe }) => {
  const f = useCurrentFrame();
  const t = f - at;
  if (t < -14 || t > 14) return null;
  const x = ip(t, [-14, 14], [-3400, 3400], inOut);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {[
        { w: 140, c: stripe, o: -1620 },
        { w: 2900, c: color, o: 0 },
        { w: 90, c: stripe, o: 1560 },
      ].map((b, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: -300,
            height: 1680,
            left: 960 - b.w / 2,
            width: b.w,
            backgroundColor: b.c,
            translate: `${x + b.o}px 0px`,
            transform: "skewX(-18deg)",
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

const Hud: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scene = [...SCENES].reverse().find((s) => f >= s.from)!;
  const idx = SCENES.indexOf(scene);
  const ss = Math.floor(f / fps);
  const ff = f % fps;
  const beatInBar = Math.floor(f / BEAT) % 4;
  const text: React.CSSProperties = { fontFamily: MONO, fontSize: 18, letterSpacing: "0.22em", color: "#fff", position: "absolute" };
  return (
    <AbsoluteFill style={{ mixBlendMode: "difference", opacity: ip(f, [6, 24, 836, 844], [0, 1, 1, 0]) }}>
      <div style={{ ...text, left: 56, top: 44 }}>CLAUDE ◦ SHOWREEL ’26</div>
      <div style={{ ...text, right: 56, top: 44 }}>TC 00:00:{String(ss).padStart(2, "0")}:{String(ff).padStart(2, "0")}</div>
      <div style={{ ...text, left: 56, bottom: 44 }}>
        {String(idx + 1).padStart(2, "0")} / {scene.name}
      </div>
      <div style={{ ...text, right: 56, bottom: 44, display: "flex", gap: 10, alignItems: "center" }}>
        120 BPM
        {[0, 1, 2, 3].map((k) => (
          <div key={k} style={{ width: 12, height: 12, border: "2px solid #fff", backgroundColor: k === beatInBar ? "#fff" : "transparent" }} />
        ))}
      </div>
      {/* Marcas de registro en las esquinas */}
      {[
        [32, 32, 1, 1],
        [1888, 32, -1, 1],
        [32, 1048, 1, -1],
        [1888, 1048, -1, -1],
      ].map(([x, y, dx, dy], i) => (
        <svg key={i} width={1920} height={1080} style={{ position: "absolute" }}>
          <path d={`M${x} ${y + dy * 22} L${x} ${y} L${x + dx * 22} ${y}`} stroke="#fff" strokeWidth={2} fill="none" />
        </svg>
      ))}
    </AbsoluteFill>
  );
};

const Grain: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "overlay", opacity: 0.32 }}>
      <svg width={1920} height={1080}>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={f % 97} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width={1920} height={1080} filter="url(#grain)" />
      </svg>
    </AbsoluteFill>
  );
};

export const Showreel: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const kick = kickPulse(f);
  // Golpe de cámara en cada bombo
  const a = hash(Math.floor((f + 4) / BEAT)) * Math.PI * 2;
  const shake = 9 * kick;

  return (
    <AbsoluteFill style={{ backgroundColor: C.ink }}>
      <AbsoluteFill
        style={{
          translate: `${Math.cos(a) * shake}px ${Math.sin(a) * shake}px`,
          scale: String(1 + 0.018 * kick),
        }}
      >
        <CameraMotionBlur shutterAngle={180} samples={6}>
        <Sequence name="01 Genesis" durationInFrames={2 * fps} premountFor={fps}>
          <Genesis />
        </Sequence>
        <Sequence name="02 Shape language" from={2 * fps} durationInFrames={2 * fps} premountFor={fps}>
          <Principles from={2 * fps} />
        </Sequence>
        <Sequence name="03 Kinetic type" from={4 * fps} durationInFrames={2 * fps} premountFor={fps}>
          <KineticType from={4 * fps} />
        </Sequence>
        <Sequence name="04 Easing" from={6 * fps} durationInFrames={2 * fps} premountFor={fps}>
          <EasingLab from={6 * fps} />
        </Sequence>
        <Sequence name="05 Generative" from={8 * fps} durationInFrames={2 * fps} premountFor={fps}>
          <Particles from={8 * fps} />
        </Sequence>
        <Sequence name="06 Tension" from={10 * fps} durationInFrames={2 * fps} premountFor={fps}>
          <Build />
        </Sequence>
        <Sequence name="07 Impact" from={12 * fps} durationInFrames={2 * fps} premountFor={fps}>
          <Payoff from={12 * fps} />
        </Sequence>
        <Sequence name="08 End card" from={14 * fps} durationInFrames={1 * fps} premountFor={fps}>
          <EndCard />
        </Sequence>
        </CameraMotionBlur>
      </AbsoluteFill>

      <Wipe at={4 * fps} color={C.ink} stripe={C.orange} />
      <Wipe at={6 * fps} color={C.orange} stripe={C.paper} />
      <Wipe at={8 * fps} color={C.blue} stripe={C.lime} />
      <Wipe at={10 * fps} color={C.paper} stripe={C.orange} />

      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.45) 100%)", pointerEvents: "none" }} />
      <Grain />
      <Hud />
      <Audio src={staticFile("music.wav")} />
    </AbsoluteFill>
  );
};
