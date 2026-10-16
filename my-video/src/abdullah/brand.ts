import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Identidad tomada del sitio de Abdullah (index.html): violeta → rosa, tinta morada, Playfair Display en cursiva para los acentos.
export const A = {
  night: "#110D22",
  ink: "#1E1A38",
  paper: "#FBFAFF",
  violet: "#8B5CF6",
  pink: "#F472B6",
  sky: "#60A5FA",
  lilac: "#C3BEDA",
};

export const GRAD = `linear-gradient(100deg, ${A.violet} 0%, #C084FC 45%, ${A.pink} 100%)`;
export const SERIF = "'Playfair Display', Georgia, serif";

// Degradados de los pósters de los proyectos en el sitio
export const POSTERS = [
  "linear-gradient(140deg,#A78BFA 0%,#C084FC 45%,#F472B6 100%)",
  "linear-gradient(140deg,#60A5FA 0%,#818CF8 50%,#A78BFA 100%)",
  "linear-gradient(140deg,#F472B6 0%,#C084FC 55%,#818CF8 100%)",
  "linear-gradient(140deg,#38BDF8 0%,#60A5FA 48%,#8B5CF6 100%)",
  "linear-gradient(140deg,#C084FC 0%,#F472B6 50%,#FB7FB4 100%)",
  "linear-gradient(140deg,#818CF8 0%,#A78BFA 45%,#F0ABFC 100%)",
  "linear-gradient(140deg,#8B5CF6 0%,#38BDF8 55%,#7DD3FC 100%)",
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
