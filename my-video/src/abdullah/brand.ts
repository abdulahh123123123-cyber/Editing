import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Identidad negro + naranja (la versión actual del sitio de Abdullah, según él).
// Los nombres de las claves se mantienen para no tocar cada escena: "violet" es ahora el naranja principal.
export const A = {
  night: "#070707",
  ink: "#141414",
  paper: "#F5F2ED",
  violet: "#FF5C00",
  pink: "#FF9F45",
  sky: "#FFD3A8",
  lilac: "#A39E97",
};

export const GRAD = `linear-gradient(100deg, ${A.violet} 0%, #FF7A1A 45%, ${A.pink} 100%)`;
export const SERIF = "'Playfair Display', Georgia, serif";

// Degradados de los pósters de los proyectos en el sitio
export const POSTERS = [
  "linear-gradient(140deg,#FF5C00 0%,#FF8A3D 50%,#FFB547 100%)",
  "linear-gradient(140deg,#1C1C1C 0%,#3A1A08 55%,#FF5C00 100%)",
  "linear-gradient(140deg,#FF8A3D 0%,#FF5C00 55%,#B23A00 100%)",
  "linear-gradient(140deg,#262626 0%,#141414 50%,#FF6B1A 100%)",
  "linear-gradient(140deg,#FFB547 0%,#FF7A1A 50%,#FF3D00 100%)",
  "linear-gradient(140deg,#0F0F0F 0%,#5A2205 60%,#FF8A3D 100%)",
  "linear-gradient(140deg,#FF6B00 0%,#2A2A2A 100%)",
];

export const WORK = [
  { title: "GOAT", label: "Football Edit", meta: "Ronaldo · 2K likes on Instagram" },
  { title: "MMA", label: "Fight Edit", meta: "Impact sound design" },
  { title: "ADRENALINE", label: "Short-Form", meta: "Motion graphics · Sound design" },
  { title: "PODCAST", label: "Talking-Head Edit", meta: "Edit · Sound Design · Grade" },
  { title: "CINEMATIC SPEECH", label: "Cinematic Edit", meta: "Edit · Sound Design" },
  { title: "CONFIDENCE", label: "Short-Form", meta: "Vertical · 9:16" },
  { title: "THE START", label: "Short-Form", meta: "Vertical · 9:16" },
];

export const STACK = [
  "Premiere Pro", "After Effects", "Media Encoder", "Photoshop",
  "Element 3D", "Sapphire", "Deep Glow", "Dehancer", "Motion Tools Pro",
];

export const loadBrandFonts = () =>
  Promise.all([
    loadFont({ family: "Playfair Display", url: staticFile("fonts/playfair-600-normal.woff2"), weight: "600", style: "normal" }),
    loadFont({ family: "Playfair Display", url: staticFile("fonts/playfair-600-italic.woff2"), weight: "600", style: "italic" }),
  ]);

export const gradText: React.CSSProperties = {
  backgroundImage: GRAD,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
};

// Golpes graves reales de "Timeless" (instrumental) desde 0:21.045, detectados con librosa: [frame, intensidad]
const SONG_KICKS: [number, number][] = [
  [180, 0.71], [224, 0.67], [270, 0.87], [284, 0.48], [314, 0.9], [330, 0.7], [359, 0.64], [373, 0.56], [389, 0.53],
  [398, 0.58], [419, 0.74], [464, 1.0], [509, 0.81], [525, 0.53], [556, 0.61], [571, 0.63], [599, 0.69], [614, 0.52],
  [628, 0.64], [638, 0.59], [659, 0.73], [704, 0.7], [750, 0.9], [763, 0.47], [794, 0.85], [810, 0.72], [839, 0.71],
  [855, 0.71], [871, 0.63], [900, 0.68], [945, 0.85], [990, 0.97], [1004, 0.43],
];

export const kickPulse = (globalFrame: number, decay = 7) => {
  let v = 0;
  for (const [k, s] of SONG_KICKS) {
    const d = globalFrame - k;
    if (d >= 0 && d < 40) v = Math.max(v, s * Math.exp(-d / decay));
  }
  return v;
};
