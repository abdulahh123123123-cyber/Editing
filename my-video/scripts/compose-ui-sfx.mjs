// Efectos de interfaz (UI) sintetizados para el portfolio de Abdullah y mezcla con la canción.
// Cada sonido está atado a un movimiento concreto del vídeo (tiempos en segundos del vídeo, 60 fps).
// Uso: node scripts/compose-ui-sfx.mjs  → public/ui-sfx.wav
import { writeFileSync } from "node:fs";

const SR = 48000;
const DUR = 17;
const N = SR * DUR;
const { sin, cos, exp, PI, tanh, min, max, pow, abs } = Math;
const TAU = 2 * PI;

let seed = 0x1234567;
const rnd = () => {
  seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5;
  return ((seed >>> 0) / 4294967296) * 2 - 1;
};

class BQ {
  constructor() { this.x1 = this.x2 = this.y1 = this.y2 = 0; }
  set(type, f, q = 0.707) {
    const w = (TAU * min(max(f, 10), SR * 0.45)) / SR, c = cos(w), s = sin(w), a = s / (2 * q);
    let b0, b1, b2;
    if (type === "lp") { b0 = (1 - c) / 2; b1 = 1 - c; b2 = b0; }
    else if (type === "hp") { b0 = (1 + c) / 2; b1 = -(1 + c); b2 = b0; }
    else { b0 = a; b1 = 0; b2 = -a; }
    const a0 = 1 + a;
    this.b0 = b0 / a0; this.b1 = b1 / a0; this.b2 = b2 / a0; this.a1 = (-2 * c) / a0; this.a2 = (1 - a) / a0;
    return this;
  }
  p(x) {
    const y = this.b0 * x + this.b1 * this.x1 + this.b2 * this.x2 - this.a1 * this.y1 - this.a2 * this.y2;
    this.x2 = this.x1; this.x1 = x; this.y2 = this.y1; this.y1 = y;
    return y;
  }
}

const L = new Float32Array(N), R = new Float32Array(N), SEND = new Float32Array(N);
const pan = (p) => [cos(((p + 1) * PI) / 4), sin(((p + 1) * PI) / 4)];
const put = (i, v, p = 0, rev = 0.15) => {
  if (i < 0 || i >= N) return;
  const [pl, pr] = pan(p);
  L[i] += v * pl; R[i] += v * pr; SEND[i] += v * rev;
};
const at = (t) => Math.round(t * SR);
const fr = (frames) => frames / 60;

// v2: ganancia por tipo, medida contra la canción (en v1 clicks, teclas, zip y tics quedaban 15–25 dB por debajo)
const BOOST = { click: 3.2, tick: 3.6, pop: 1.9, key: 3.4, swoosh: 1.8, ding: 0.4, thunk: 1.2, zip: 9, razor: 1.5, riser: 1.0, impact: 1.0 };
const EVENTS = [];
const log = (type, t) => EVENTS.push({ type, t: +t.toFixed(4) });

// ---------- Paleta de sonidos de UI ----------
function click(t, g = 0.3, f = 3800, p = 0) {
  g *= BOOST.click; log("click", t);
  const hp = new BQ().set("hp", 2500), i0 = at(t);
  for (let n = 0; n < 0.03 * SR; n++) {
    const x = n / SR;
    put(i0 + n, (hp.p(rnd()) * exp(-x / 0.0018) + sin(TAU * f * x) * exp(-x / 0.005) * 0.6) * g, p, 0.1);
  }
}
function tick(t, g = 0.2, f = 2600, p = 0) {
  g *= BOOST.tick; log("tick", t);
  const i0 = at(t);
  for (let n = 0; n < 0.04 * SR; n++) {
    const x = n / SR;
    put(i0 + n, sin(TAU * f * x) * exp(-x / 0.007) * min(1, x / 0.0005) * g, p, 0.12);
  }
}
function pop(t, g = 0.35, f0 = 950, f1 = 320, p = 0) {
  g *= BOOST.pop; log("pop", t);
  const i0 = at(t);
  let ph = 0;
  for (let n = 0; n < 0.12 * SR; n++) {
    const x = n / SR;
    ph += (TAU * (f1 + (f0 - f1) * exp(-x / 0.018))) / SR;
    put(i0 + n, (sin(ph) + 0.25 * sin(2 * ph)) * exp(-x / 0.035) * min(1, x / 0.001) * g, p, 0.2);
  }
}
function keyPress(t, g = 0.12, p = 0) {
  g *= BOOST.key; log("key", t);
  const bp = new BQ().set("bp", 2800 + rnd() * 600, 1.2), i0 = at(t);
  for (let n = 0; n < 0.05 * SR; n++) {
    const x = n / SR;
    let e = exp(-x / 0.004);
    if (x > 0.028) e += 0.5 * exp(-(x - 0.028) / 0.003);
    put(i0 + n, bp.p(rnd()) * e * g * 2.2, p, 0.05);
  }
}
function swoosh(tc, g = 0.3, len = 0.45, from = -0.8, to = 0.8, fLo = 400, fHi = 6000) {
  g *= BOOST.swoosh; log("swoosh", tc);
  const bp = new BQ(), i0 = at(tc - len * 0.55);
  for (let n = 0; n < len * SR; n++) {
    const x = n / (len * SR);
    const env = pow(sin(PI * pow(x, 0.75)), 2);
    if (n % 16 === 0) bp.set("bp", fLo * pow(fHi / fLo, sin(PI * x)), 1.1);
    put(i0 + n, bp.p(rnd()) * env * g * 1.6, from + (to - from) * x, 0.25);
  }
}
function ding(t, g = 0.18, f = 1318.5, p = 0) {
  g *= BOOST.ding; log("ding", t);
  const i0 = at(t);
  for (let n = 0; n < 0.9 * SR; n++) {
    const x = n / SR;
    const v = sin(TAU * f * x) * exp(-x / 0.35) + 0.5 * sin(TAU * f * 1.5 * x) * exp(-x / 0.22) + 0.2 * sin(TAU * f * 2.76 * x) * exp(-x / 0.08);
    put(i0 + n, v * min(1, x / 0.002) * g, p, 0.35);
  }
}
function thunk(t, g = 0.45) {
  g *= BOOST.thunk; log("thunk", t);
  const i0 = at(t);
  let ph = 0;
  for (let n = 0; n < 0.2 * SR; n++) {
    const x = n / SR;
    ph += (TAU * (55 + 90 * exp(-x / 0.02))) / SR;
    put(i0 + n, tanh(sin(ph) * 2) * exp(-x / 0.06) * g, 0, 0.1);
  }
  click(t, (g * 0.6) / BOOST.click, 2200);
}
function zip(t, g = 0.18, p = 0) {
  g *= BOOST.zip; log("zip", t);
  const i0 = at(t);
  let ph = 0;
  const len = 0.16;
  for (let n = 0; n < len * SR; n++) {
    const x = n / SR, u = x / len;
    ph += (TAU * (300 * pow(9, u))) / SR;
    const trem = 0.6 + 0.4 * sin(TAU * 60 * x);
    put(i0 + n, sin(ph) * trem * sin(PI * u) * g, p, 0.2);
  }
}
function razor(t, g = 0.3, p = 0) {
  g *= BOOST.razor; log("razor", t);
  const hp = new BQ().set("hp", 5000), i0 = at(t);
  for (let n = 0; n < 0.08 * SR; n++) {
    const x = n / SR;
    put(i0 + n, (hp.p(rnd()) * exp(-x / 0.003) + sin(TAU * 5200 * x) * exp(-x / 0.012) * 0.35 + sin(TAU * 7400 * x) * exp(-x / 0.02) * 0.2) * g, p, 0.3);
  }
}
function riser(t0, t1, g = 0.2) {
  const bp = new BQ(), i0 = at(t0), len = (t1 - t0) * SR;
  for (let n = 0; n < len; n++) {
    const u = n / len;
    if (n % 16 === 0) bp.set("bp", 300 * pow(30, u), 2);
    put(i0 + n, bp.p(rnd()) * pow(u, 2.5) * g * 1.8, (u - 0.5) * 0.6, 0.4);
  }
}
function impact(t, g = 0.5) {
  g *= BOOST.impact; log("impact", t);
  const i0 = at(t);
  let ph = 0;
  const lp = new BQ().set("lp", 1800, 0.8);
  for (let n = 0; n < 1.6 * SR; n++) {
    const x = n / SR;
    ph += (TAU * (34 + 60 * exp(-x / 0.12))) / SR;
    const boom = tanh(sin(ph) * 2.5) * exp(-x / 0.5);
    const crack = lp.p(rnd()) * exp(-x / 0.05);
    const shimmer = (sin(TAU * 2637 * x) + sin(TAU * 3520.5 * x) + sin(TAU * 4186 * x)) * exp(-x / 0.45) * 0.08;
    put(i0 + n, (boom * 0.9 + crack * 0.7 + shimmer) * g, 0, 0.35);
  }
}

// ---------- Partitura de efectos (sincronizada con las escenas) ----------
// 0–3 s · Intro (la animación original está estirada 1,5×: frame antiguo x → x/40 s)
pop(0, 0.4, 1200, 260);
for (const x of [14, 19, 20, 25, 26, 30, 32, 35, 37]) click(x / 40, 0.16, 3000 + (x % 5) * 300, 0.3 * ((x % 3) - 1));
swoosh(40 / 40 + 0.1, 0.16, 0.4, -0.4, 0.4, 600, 5000);
for (let i = 0; i < 8; i++) tick((40 + i * 3) / 40, 0.07, 1800 + i * 160, -0.6 + i * 0.17);
for (let i = 0; i < 30; i++) keyPress((58 + i) / 40, 0.09 + 0.03 * ((i * 7) % 3), ((i % 5) - 2) * 0.1);
razor(94 / 40, 0.35);
swoosh(100 / 40 + 0.1, 0.3, 0.5, 0, 0, 300, 4000);
riser(2.3, 3.0, 0.18);
impact(3.0, 0.42);

// 3–5 s · Stop scrolling
pop(3.0, 0.22, 900, 300, -0.5);
swoosh(3.12, 0.22, 0.35, 0.6, 0.6, 700, 7000);
pop(3.5, 0.2, 1000, 330, -0.5);
{
  // trinquete del scroll: un tic cada vez que pasan 220 px del feed
  const total = 6 * 600 + 140;
  let last = 0;
  for (let k = 1; k <= 60; k++) {
    const u = k / 60, s = total * (u * u * 0.4 + u * 0.6);
    if (Math.floor(s / 220) > Math.floor(last / 220)) tick(3 + fr(k), 0.09, 3400, 0.55);
    last = s;
  }
}
thunk(4.0, 0.5);
click(4.0, 0.3, 1800, -0.4);
for (let k = 0; k < 9; k++) pop(4.0 + fr(18 + k * 3), 0.1, 1400 + k * 90, 700, 0.6);
ding(4.3, 0.14, 1318.5, 0.5);
swoosh(4.55, 0.18, 0.35, -0.6, 0.2, 900, 8000);

// 5–7 s · Servicios
thunk(5.0, 0.4); click(5.0, 0.25, 2600);
zip(5.5, 0.16, 0.4);
for (let i = 0; i < 6; i++) tick(6.0 + fr(i * 3), 0.08, 1500 + i * 400, 0.4);
for (let k = 0; k < 3; k++) pop(6.5 + fr(k * 3), 0.16, 1100 - k * 120, 380, 0.2 + k * 0.25);
for (const t of [5.0, 5.5, 6.0, 6.5]) swoosh(t + 0.08, 0.08, 0.3, -0.7, -0.3, 800, 6000);

// 7–9 s · Cut on the hit
for (const t of [7.5, 8.0, 8.5]) { razor(t, 0.28, ((t - 8) * 1.2)); pop(t + 0.01, 0.13, 1600, 600, (t - 8) * 1.2); }
for (let i = 0; i < 4; i++) click(7 + fr(i * 4), 0.08, 2400, -0.6);

// 9–11 s · Trabajos
for (let i = 0; i < 7; i++) tick(9 + fr(i * 4), 0.08, 2200 + i * 120, -0.5 + i * 0.15);
for (const t of [9.0, 9.5, 10.0, 10.5]) { pop(t, 0.2, 800, 260, 0.1); swoosh(t + 0.06, 0.07, 0.25, -0.2, 0.4, 1200, 6000); }

// 11–13 s · Números: un tic por cada incremento del contador
{
  const outExpo = (x) => 1 - pow(1 - x, 4);
  const inExpo = (x) => pow(x, 4);
  let prev = 0;
  for (let f = 0; f <= 36; f++) {
    const v = Math.round(5 * outExpo(f / 36));
    if (v !== prev) tick(11 + fr(f), 0.14, 1400 + v * 120, 0);
    prev = v;
  }
  swoosh(11 + fr(50) + 0.05, 0.22, 0.35, -0.8, 0.8, 500, 6000);
  prev = 0;
  for (let f = 50; f <= 101; f++) {
    const v = Math.round(100 * inExpo((f - 50) / 51));
    if (Math.floor(v / 4) !== Math.floor(prev / 4)) tick(11 + fr(f), 0.1 + v * 0.0006, 1200 + v * 22, 0);
    prev = v;
  }
  riser(12.2, 13.0, 0.16);
}

// 13–15 s · Impacto del nombre
impact(13.0, 0.48);
for (let i = 0; i < 8; i++) pop(13 + fr(i * 3), 0.09, 700 + i * 70, 260, -0.7 + i * 0.2);
// brillo suave cuando el "shimmer" recorre el nombre
swoosh(13.75, 0.07, 0.9, -0.8, 0.8, 3000, 12000);
for (let k = 0; k < 6; k++) click(13 + fr(24 + k * 10), 0.12, 3200 + k * 150, -0.5 + k * 0.2);

// 15–17 s · Contacto
pop(15.0, 0.22, 1100, 300);
for (let i = 0; i < 3; i++) tick(15 + fr(i * 3.6), 0.06, 2000 + i * 250, -0.4 + i * 0.4);
swoosh(15 + fr(14), 0.14, 0.45, -0.6, 0.6, 900, 7000);
ding(15.2, 0.12, 1760, 0);
click(15 + fr(24), 0.16, 1700, 0.2); // botón "Start a project"
click(16.4, 0.1, 2000);

// ---------- Reverb ligera + salida ----------
const rev = (offset) => {
  const out = new Float32Array(N);
  const combs = [1311, 1427, 1553, 1617].map((d) => ({ d: d + offset, b: new Float32Array(d + offset), i: 0, s: 0 }));
  for (let n = 0; n < N; n++) {
    let y = 0;
    for (const c of combs) {
      const o = c.b[c.i];
      c.s = o * 0.6 + c.s * 0.4;
      c.b[c.i] = SEND[n] * 0.4 + c.s * 0.8;
      c.i = (c.i + 1) % c.d; y += o;
    }
    out[n] = y * 0.25;
  }
  return out;
};
const rl = rev(0), rr = rev(29);
let peak = 0;
for (let n = 0; n < N; n++) {
  L[n] = tanh((L[n] + rl[n]) * 1.1); R[n] = tanh((R[n] + rr[n]) * 1.1);
  peak = max(peak, abs(L[n]), abs(R[n]));
}
const g = 0.95 / peak;
const data = Buffer.alloc(44 + N * 4);
data.write("RIFF", 0); data.writeUInt32LE(36 + N * 4, 4); data.write("WAVE", 8);
data.write("fmt ", 12); data.writeUInt32LE(16, 16); data.writeUInt16LE(1, 20); data.writeUInt16LE(2, 22);
data.writeUInt32LE(SR, 24); data.writeUInt32LE(SR * 4, 28); data.writeUInt16LE(4, 32); data.writeUInt16LE(16, 34);
data.write("data", 36); data.writeUInt32LE(N * 4, 40);
for (let n = 0; n < N; n++) {
  data.writeInt16LE(Math.round(max(-1, min(1, L[n] * g)) * 32767), 44 + n * 4);
  data.writeInt16LE(Math.round(max(-1, min(1, R[n] * g)) * 32767), 46 + n * 4);
}
writeFileSync(new URL("../public/ui-sfx.wav", import.meta.url), data);
writeFileSync(new URL("../public/ui-sfx-events.json", import.meta.url), JSON.stringify(EVENTS));
console.log("ui-sfx.wav escrito");
