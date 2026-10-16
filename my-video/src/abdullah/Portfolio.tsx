import { Audio } from "@remotion/media";
import { CameraMotionBlur } from "@remotion/motion-blur";
import { useEffect, useState } from "react";
import { AbsoluteFill, Sequence, continueRender, delayRender, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { BEAT, MONO, hash, inOut, ip, kickPulse } from "../reel/lib";
import { A, loadBrandFonts } from "./brand";
import { CutOnTheHit } from "./CutOnTheHit";
import { Impact, Outro } from "./Finale";
import { Intro } from "./Intro";
import { SelectedWork } from "./SelectedWork";
import { Services } from "./Services";
import { Stats } from "./Stats";
import { StopScrolling } from "./StopScrolling";

const SCENES = [
  { from: 0, name: "TIMELINE" },
  { from: 120, name: "STOP SCROLLING" },
  { from: 240, name: "SERVICES" },
  { from: 360, name: "CUT ON THE HIT" },
  { from: 480, name: "SELECTED WORK" },
  { from: 600, name: "NUMBERS" },
  { from: 720, name: "ABDULLAH" },
  { from: 840, name: "CONTACT" },
];

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
        <div key={i} style={{ position: "absolute", top: -300, height: 1680, left: 960 - b.w / 2, width: b.w, backgroundColor: b.c, translate: `${x + b.o}px 0px`, transform: "skewX(-18deg)" }} />
      ))}
    </AbsoluteFill>
  );
};

const Hud: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scene = [...SCENES].reverse().find((s) => f >= s.from)!;
  const idx = SCENES.indexOf(scene);
  const beatInBar = Math.floor(f / BEAT) % 4;
  const text: React.CSSProperties = { fontFamily: MONO, fontSize: 18, letterSpacing: "0.22em", color: "#fff", position: "absolute" };
  return (
    <AbsoluteFill style={{ mixBlendMode: "difference", opacity: ip(f, [6, 24, 836, 844], [0, 1, 1, 0]) }}>
      <div style={{ ...text, left: 56, top: 44, display: "flex", gap: 12, alignItems: "center" }}>
        <div style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: "#fff", opacity: Math.floor(f / 30) % 2 ? 0.25 : 1 }} />
        REC · ABDULLAH ◦ PORTFOLIO ’26
      </div>
      <div style={{ ...text, right: 56, top: 44 }}>
        TC 00:00:{String(Math.floor(f / fps)).padStart(2, "0")}:{String(f % fps).padStart(2, "0")}
      </div>
      <div style={{ ...text, left: 56, bottom: 44 }}>
        {String(idx + 1).padStart(2, "0")} / {scene.name}
      </div>
      <div style={{ ...text, right: 56, bottom: 44, display: "flex", gap: 10, alignItems: "center" }}>
        120 BPM
        {[0, 1, 2, 3].map((k) => (
          <div key={k} style={{ width: 12, height: 12, border: "2px solid #fff", backgroundColor: k === beatInBar ? "#fff" : "transparent" }} />
        ))}
      </div>
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        {[
          [32, 32, 1, 1],
          [1888, 32, -1, 1],
          [32, 1048, 1, -1],
          [1888, 1048, -1, -1],
        ].map(([x, y, dx, dy], i) => (
          <path key={i} d={`M${x} ${y + dy * 22} L${x} ${y} L${x + dx * 22} ${y}`} stroke="#fff" strokeWidth={2} fill="none" />
        ))}
      </svg>
    </AbsoluteFill>
  );
};

const Grain: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "overlay", opacity: 0.3 }}>
      <svg width={1920} height={1080}>
        <filter id="grainA">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={f % 97} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width={1920} height={1080} filter="url(#grainA)" />
      </svg>
    </AbsoluteFill>
  );
};

export const Portfolio: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [handle] = useState(() => delayRender("Cargando Playfair Display"));
  useEffect(() => {
    loadBrandFonts().then(() => continueRender(handle));
  }, [handle]);

  const kick = kickPulse(f);
  const a = hash(Math.floor((f + 4) / BEAT)) * Math.PI * 2;
  const shake = 9 * kick;

  return (
    <AbsoluteFill style={{ backgroundColor: A.night }}>
      <AbsoluteFill style={{ translate: `${Math.cos(a) * shake}px ${Math.sin(a) * shake}px`, scale: String(1 + 0.018 * kick) }}>
        <CameraMotionBlur shutterAngle={180} samples={6}>
          <Sequence name="01 Timeline" durationInFrames={2 * fps} premountFor={fps}>
            <Intro />
          </Sequence>
          <Sequence name="02 Stop scrolling" from={2 * fps} durationInFrames={2 * fps} premountFor={fps}>
            <StopScrolling from={2 * fps} />
          </Sequence>
          <Sequence name="03 Services" from={4 * fps} durationInFrames={2 * fps} premountFor={fps}>
            <Services from={4 * fps} />
          </Sequence>
          <Sequence name="04 Cut on the hit" from={6 * fps} durationInFrames={2 * fps} premountFor={fps}>
            <CutOnTheHit />
          </Sequence>
          <Sequence name="05 Selected work" from={8 * fps} durationInFrames={2 * fps} premountFor={fps}>
            <SelectedWork from={8 * fps} />
          </Sequence>
          <Sequence name="06 Numbers" from={10 * fps} durationInFrames={2 * fps} premountFor={fps}>
            <Stats />
          </Sequence>
          <Sequence name="07 Impact" from={12 * fps} durationInFrames={2 * fps} premountFor={fps}>
            <Impact from={12 * fps} />
          </Sequence>
          <Sequence name="08 Contact" from={14 * fps} durationInFrames={1 * fps} premountFor={fps}>
            <Outro />
          </Sequence>
        </CameraMotionBlur>
      </AbsoluteFill>

      <Wipe at={4 * fps} color={A.night} stripe={A.pink} />
      <Wipe at={6 * fps} color={A.violet} stripe={A.paper} />
      <Wipe at={8 * fps} color={A.pink} stripe={A.sky} />
      <Wipe at={10 * fps} color={A.paper} stripe={A.violet} />

      <AbsoluteFill style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.42) 100%)", pointerEvents: "none" }} />
      <Grain />
      <Hud />
      <Audio src={staticFile("music-abdullah.wav")} />
    </AbsoluteFill>
  );
};
