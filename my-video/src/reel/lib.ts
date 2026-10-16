import { Easing, interpolate } from "remotion";

export const C = {
  ink: "#0B0B10",
  paper: "#F2EEE5",
  orange: "#FF5A1F",
  blue: "#2F4BFF",
  lime: "#D7FF3A",
};

export const FONT = "'Inter Display', 'Inter', sans-serif";
export const MONO = "'DejaVu Sans Mono', monospace";

export const outExpo = Easing.bezier(0.16, 1, 0.3, 1);
export const inExpo = Easing.bezier(0.7, 0, 0.84, 0);
export const inOut = Easing.bezier(0.76, 0, 0.24, 1);
export const backOut = Easing.bezier(0.34, 1.56, 0.64, 1);

// 120 BPM a 60 fps: un beat = 30 frames. Debe coincidir con scripts/compose-music.mjs
export const BEAT = 30;

export const ip = (
  f: number,
  input: number[],
  output: number[],
  easing?: (t: number) => number,
) =>
  interpolate(f, input, output, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

// Frames globales donde suena el bombo
export const KICKS: number[] = (() => {
  const k: number[] = [];
  for (let f = 120; f <= 660; f += BEAT) k.push(f);
  for (let f = 720; f <= 840; f += BEAT) k.push(f);
  return k;
})();

export const kickPulse = (globalFrame: number, decay = 7) => {
  let last = -Infinity;
  for (const k of KICKS) if (k <= globalFrame) last = k;
  const d = globalFrame - last;
  return d >= 0 && d < 40 ? Math.exp(-d / decay) : 0;
};

// Redoble del build (misma lógica que el script de música), en frames locales de la escena 6
export const SNARES: number[] = (() => {
  const out: number[] = [];
  let t = 10;
  while (t < 11.74) {
    const x = (t - 10) / 1.75;
    out.push(Math.round((t - 10) * 60));
    t += x < 0.45 ? 0.25 : x < 0.8 ? 0.125 : 0.0625;
  }
  return out;
})();

// Ruido determinista
export const hash = (n: number) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const mixHex = (a: string, b: string, t: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  const c = pa.map((v, i) => Math.round(lerp(v, pb[i], Math.max(0, Math.min(1, t)))));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
};
