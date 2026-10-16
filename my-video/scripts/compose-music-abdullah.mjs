// Banda sonora del portfolio de Abdullah: más oscura y pesada (deportes / peleas).
// Síntesis de la banda sonora del showreel desde cero: osciladores, ruido, filtros y reverb.
// Sin samples. 120 BPM -> 1 beat = 0.5 s = 30 frames a 60 fps.
import { writeFileSync } from "node:fs";

const SR = 48000;
const DUR = 15;
const N = SR * DUR;
const BEAT = 0.5;
const BAR = BEAT * 4;
const { sin, cos, exp, PI, tanh, min, max, pow } = Math;
const TAU = 2 * PI;

let seed = 0x9e3779b9;
const rnd = () => {
  seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5;
  return ((seed >>> 0) / 4294967296) * 2 - 1;
};
const mtof = (m) => 440 * pow(2, (m - 69) / 12);

const buf = () => [new Float32Array(N), new Float32Array(N)];
const drums = buf(), music = buf(), fx = buf(), send = buf();

class BQ {
  constructor() { this.x1 = this.x2 = this.y1 = this.y2 = 0; }
  set(type, f, q = 0.707) {
    const w = (TAU * min(max(f, 10), SR * 0.45)) / SR, c = cos(w), s = sin(w), a = s / (2 * q);
    let b0, b1, b2;
    if (type === "lp") { b0 = (1 - c) / 2; b1 = 1 - c; b2 = b0; }
    else if (type === "hp") { b0 = (1 + c) / 2; b1 = -(1 + c); b2 = b0; }
    else { b0 = a; b1 = 0; b2 = -a; } // bp
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

const put = (b, i, l, r = l) => { if (i >= 0 && i < N) { b[0][i] += l; b[1][i] += r; } };
const pan = (p) => [cos(((p + 1) * PI) / 4), sin(((p + 1) * PI) / 4)];

// Saw band-limited (polyBLEP)
const blep = (t, dt) => {
  if (t < dt) { t /= dt; return t + t - t * t - 1; }
  if (t > 1 - dt) { t = (t - 1) / dt; return t * t + t + t + 1; }
  return 0;
};

// ---------- Partitura ----------
// Compases de 2 s: 0 intro | 1-4 groove | 5 build | 6 impacto | 7 cierre
const chords = [
  [57, 62, 65, 69], // Dm
  [58, 62, 65, 70], // Bb
  [57, 60, 65, 69], // F
  [55, 60, 64, 67], // C
  [57, 62, 65, 69], // Dm
  [57, 61, 64, 69], // A (dominante, tensión)
  [57, 62, 65, 76], // Dm(add9)
  [57, 62, 65, 76],
];
const roots = [38, 34, 41, 36, 38, 33, 38, 38];

const kickTimes = [];
for (let b = 4; b < 24; b++) kickTimes.push(b * BEAT); // 2 s -> 12 s (incl. build)
kickTimes.splice(kickTimes.indexOf(11.5), 1); // hueco antes del drop
for (let b = 24; b < 28; b++) kickTimes.push(b * BEAT); // 12 -> 14 s
kickTimes.push(14);

// ---------- Kick ----------
function kick(t0, big = false) {
  const len = big ? 1.4 : 0.45, i0 = Math.round(t0 * SR);
  let ph = 0;
  for (let n = 0; n < len * SR; n++) {
    const t = n / SR;
    const f = (big ? 38 : 46) + 120 * exp(-t / 0.032);
    ph += (TAU * f) / SR;
    let v = sin(ph) * exp(-t / (big ? 0.42 : 0.17)) * 1.1;
    v += rnd() * exp(-t / 0.0025) * 0.35;
    v = tanh(v * 2.4) * 0.9;
    put(drums, i0 + n, v);
  }
}
// ---------- Clap ----------
function clap(t0, g = 0.5) {
  const bp = new BQ().set("bp", 1400, 0.9), hp = new BQ().set("hp", 600);
  const i0 = Math.round(t0 * SR);
  for (let n = 0; n < 0.3 * SR; n++) {
    const t = n / SR;
    let env = exp(-t / 0.11);
    for (const o of [0, 0.011, 0.022]) if (t >= o && t < o + 0.01) env += exp(-(t - o) / 0.004);
    const v = hp.p(bp.p(rnd())) * env * g;
    put(drums, i0 + n, v * 0.9, v);
    put(send, i0 + n, v * 0.35);
  }
}
// ---------- Hats ----------
function hat(t0, open, g, p = 0) {
  const hp = new BQ().set("hp", 8500, 0.8), i0 = Math.round(t0 * SR), [pl, pr] = pan(p);
  const d = open ? 0.16 : 0.028;
  for (let n = 0; n < d * 6 * SR; n++) {
    const t = n / SR, v = hp.p(rnd()) * exp(-t / d) * g;
    put(drums, i0 + n, v * pl, v * pr);
  }
}
// ---------- Snare (roll) ----------
function snare(t0, g) {
  const bp = new BQ().set("bp", 2200, 0.6), i0 = Math.round(t0 * SR);
  let ph = 0;
  for (let n = 0; n < 0.2 * SR; n++) {
    const t = n / SR;
    ph += (TAU * (180 + 60 * exp(-t / 0.01))) / SR;
    const v = (bp.p(rnd()) * 1.2 * exp(-t / 0.06) + sin(ph) * 0.5 * exp(-t / 0.04)) * g;
    put(drums, i0 + n, v);
    put(send, i0 + n, v * 0.2);
  }
}
// ---------- Bass ----------
function bassNote(t0, dur, m, g) {
  const f = mtof(m), lp = new BQ(), i0 = Math.round(t0 * SR);
  let ph = 0, ph2 = 0;
  for (let n = 0; n < (dur + 0.05) * SR; n++) {
    const t = n / SR;
    ph = (ph + f / SR) % 1; ph2 = (ph2 + f / 2 / SR) % 1;
    const saw = 2 * ph - 1 - blep(ph, f / SR);
    if (n % 16 === 0) lp.set("lp", 180 + 2200 * exp(-t / 0.07), 1.4);
    const env = min(1, t / 0.004) * (t < dur ? 1 : exp(-(t - dur) / 0.01));
    const v = (lp.p(saw) * 0.8 + sin(TAU * ph2) * 0.55) * env * g;
    put(music, i0 + n, v);
  }
}
// ---------- Pad supersaw ----------
const padRaw = buf();
function padChord(t0, dur, notes, g) {
  const i0 = Math.round(t0 * SR), dets = [-0.11, 0, 0.11];
  for (const m of notes) for (let k = 0; k < dets.length; k++) {
    const f = mtof(m + dets[k]); let ph = Math.abs(rnd());
    const [pl, pr] = pan((k - 1) * 0.8);
    for (let n = 0; n < (dur + 0.6) * SR; n++) {
      const t = n / SR;
      ph = (ph + f / SR) % 1;
      const saw = 2 * ph - 1 - blep(ph, f / SR);
      const env = min(1, t / 0.25) * (t < dur ? 1 : exp(-(t - dur) / 0.2));
      const v = saw * env * g;
      put(padRaw, i0 + n, v * pl, v * pr);
    }
  }
}
// ---------- Arp pluck ----------
const arpRaw = buf();
function pluck(t0, m, g, p) {
  const f = mtof(m), i0 = Math.round(t0 * SR), lp = new BQ(), [pl, pr] = pan(p);
  let ph = 0;
  for (let n = 0; n < 0.35 * SR; n++) {
    const t = n / SR;
    ph = (ph + f / SR) % 1;
    const sq = (ph < 0.5 ? 1 : -1) * 0.6 + (2 * ph - 1) * 0.4;
    if (n % 16 === 0) lp.set("lp", 500 + 5000 * exp(-t / 0.04), 2);
    const v = lp.p(sq) * exp(-t / 0.09) * g;
    put(arpRaw, i0 + n, v * pl, v * pr);
  }
}
// ---------- Whoosh / riser / crash / sub ----------
function whoosh(tc, g, len = 0.5) {
  const bp = new BQ(), i0 = Math.round((tc - len * 0.6) * SR);
  for (let n = 0; n < len * SR; n++) {
    const x = n / (len * SR), env = sin(PI * pow(x, 0.8)) ** 2;
    if (n % 16 === 0) bp.set("bp", 300 * pow(30, sin(PI * x)), 1.2);
    const v = bp.p(rnd()) * env * g, [pl, pr] = pan(-1 + 2 * x);
    put(fx, i0 + n, v * pl, v * pr);
    put(send, i0 + n, v * 0.3);
  }
}
function riser(t0, t1, g) {
  const bp = new BQ(), i0 = Math.round(t0 * SR), len = (t1 - t0) * SR;
  let ph = 0;
  for (let n = 0; n < len; n++) {
    const x = n / len;
    if (n % 16 === 0) bp.set("bp", 250 * pow(40, x), 1.5);
    ph = (ph + (110 * pow(8, x * x)) / SR) % 1;
    const v = (bp.p(rnd()) * 1.4 + (2 * ph - 1) * 0.12) * pow(x, 2.2) * g;
    put(fx, i0 + n, v, v * 0.92);
    put(send, i0 + n, v * 0.4);
  }
}
function crash(t0, g, d = 1.1) {
  const hp = new BQ().set("hp", 3500, 0.5), i0 = Math.round(t0 * SR);
  for (let n = 0; n < d * 4 * SR; n++) {
    const t = n / SR, l = hp.p(rnd()) * exp(-t / d) * g, r = l * (0.8 + 0.2 * Math.abs(rnd()));
    put(fx, i0 + n, l, r);
    put(send, i0 + n, l * 0.6);
  }
}
function subDrop(t0, g) {
  const i0 = Math.round(t0 * SR);
  let ph = 0;
  for (let n = 0; n < 2.5 * SR; n++) {
    const t = n / SR;
    ph += (TAU * (32 + 40 * exp(-t / 0.25))) / SR;
    put(fx, i0 + n, sin(ph) * exp(-t / 0.9) * g);
  }
}
function tick(t0, g, f = 2400) {
  const i0 = Math.round(t0 * SR);
  for (let n = 0; n < 0.05 * SR; n++) {
    const t = n / SR, v = sin(TAU * f * t) * exp(-t / 0.008) * g;
    put(fx, i0 + n, v);
    put(send, i0 + n, v * 0.5);
  }
}

// ---------- Braam (golpe cinematográfico grave) ----------
function braam(t0, g, len = 1.1) {
  const i0 = Math.round(t0 * SR), lp = [new BQ(), new BQ()];
  const notes = [26, 38, 45, 50];
  const phs = notes.flatMap(() => [Math.abs(rnd()), Math.abs(rnd()), Math.abs(rnd())]);
  for (let n = 0; n < len * SR; n++) {
    const t = n / SR;
    if (n % 32 === 0) for (const f of lp) f.set("lp", 120 + 2600 * exp(-t / 0.18), 2.2);
    let l = 0, r = 0, k = 0;
    for (const m of notes) for (const d of [-0.15, 0, 0.15]) {
      const f = mtof(m + d);
      phs[k] = (phs[k] + f / SR) % 1;
      const v = 2 * phs[k] - 1 - blep(phs[k], f / SR);
      if (d < 0) l += v; else if (d > 0) r += v; else { l += v * 0.7; r += v * 0.7; }
      k++;
    }
    const env = min(1, t / 0.012) * exp(-t / (len * 0.45));
    const L = tanh(lp[0].p(l) * 0.5) * env * g, R = tanh(lp[1].p(r) * 0.5) * env * g;
    put(fx, i0 + n, L, R);
    put(send, i0 + n, L * 0.5, R * 0.5);
  }
}
// ---------- Golpe (puñetazo) ----------
function punch(t0, g) {
  const i0 = Math.round(t0 * SR), bp = new BQ().set("bp", 900, 0.7);
  let ph = 0;
  for (let n = 0; n < 0.3 * SR; n++) {
    const t = n / SR;
    ph += (TAU * (70 + 200 * exp(-t / 0.015))) / SR;
    const v = (sin(ph) * exp(-t / 0.08) + bp.p(rnd()) * 1.5 * exp(-t / 0.03)) * g;
    put(fx, i0 + n, tanh(v * 2));
    put(send, i0 + n, v * 0.3);
  }
}
// ---------- Power-down antes del silencio ----------
function powerDown(t0, len, g) {
  const i0 = Math.round(t0 * SR);
  let ph = 0;
  for (let n = 0; n < len * SR; n++) {
    const x = n / (len * SR);
    ph = (ph + (220 * pow(0.08, x)) / SR) % 1;
    put(fx, i0 + n, (2 * ph - 1) * (1 - x) * g);
  }
}

// ---------- Arreglo ----------
// Intro: punto que nace (frame 0), pad que se abre, arpegio filtrado, swell hacia el drop
tick(0.0, 0.5, 1800); subDrop(0.0, 0.35);
tick(0.4, 0.25, 2600); tick(0.75, 0.25, 3100);
riser(0.6, 2.0, 0.45);
for (let bar = 0; bar < 8; bar++) {
  const t0 = bar * BAR;
  if (bar < 6) padChord(t0, BAR, chords[bar], 0.05);
}
padChord(12, 1.9, chords[6], 0.07);
padChord(14, 0.9, chords[7], 0.08);

// Arp: semicorcheas sobre notas del acorde
const pat = [0, 1, 2, 3, 2, 1, 3, 2, 0, 2, 1, 3, 2, 3, 1, 2];
for (let s = 0; s < 6 * 16; s++) {
  const t = s * BEAT / 4, bar = Math.floor(t / BAR);
  if (t >= 11.75) break;
  const n = chords[bar][pat[s % 16]] + 12;
  const acc = s % 4 === 0 ? 1 : 0.65;
  pluck(t, n, (bar === 0 ? 0.11 : 0.15) * acc, s % 2 ? 0.45 : -0.45);
}
for (let s = 0; s < 8; s++) pluck(12 + s * BEAT / 4, chords[6][pat[s]] + 24, 0.1, s % 2 ? 0.6 : -0.6);

// Groove 2-11.75 s y 12-14 s
for (const t of kickTimes) kick(t, t === 12 || t === 14);
for (let b = 4; b < 28; b++) {
  const t = b * BEAT;
  if (t >= 11.75 && t < 12) continue;
  if (b % 2 === 1 && t < 10) clap(t, 0.55);
  if (t >= 12 && b % 2 === 1) clap(t, 0.6);
  if (t < 10 || t >= 12) {
    hat(t + BEAT / 2, true, 0.16, 0.2);
    if (t >= 4) for (const k of [0, 1, 3]) hat(t + (k * BEAT) / 4, false, k === 0 ? 0.05 : 0.09, -0.3);
  }
}
// Bajo: corcheas, nota raíz con octava ocasional
for (let e = 4; e < 56; e++) {
  const t = (e * BEAT) / 2;
  if (t >= 11.75 && t < 12) continue;
  if (t >= 14) break;
  const bar = Math.floor(t / BAR), oct = e % 4 === 3 ? 12 : 0;
  bassNote(t, BEAT / 2 - 0.03, roots[bar] + oct, 0.32);
}
// Build 10-11.75: redoble que acelera
let tr = 10;
while (tr < 11.74) {
  const x = (tr - 10) / 1.75;
  snare(tr, 0.12 + 0.3 * x);
  tr += x < 0.45 ? BEAT / 2 : x < 0.8 ? BEAT / 4 : BEAT / 8;
}
riser(10, 11.75, 0.55);
// Transiciones entre escenas
for (const t of [4, 6, 8, 10]) whoosh(t, 0.35);
whoosh(12, 0.25, 0.3);
// Braams en cada cambio de sección y golpes de puño en la escena de deportes
for (const t of [2, 4, 6, 8]) braam(t, t === 2 ? 0.16 : 0.1);
braam(12, 0.2, 1.8);
braam(14, 0.16, 1.0);
punch(4, 0.5); punch(4.25, 0.3);
powerDown(11.5, 0.25, 0.12);
// Impacto 12 s y golpe final 14 s
crash(12, 0.13, 0.9); subDrop(12, 0.55);
crash(14, 0.12, 0.7); subDrop(14, 0.45);
tick(14, 0.35, 1200);

// ---------- Procesado ----------
// Filtro maestro de la sección musical (se abre en la intro, cae y barre en el build)
function cutoff(t) {
  if (t < 2) return 350 * pow(4500 / 350, pow(t / 2, 1.5));
  if (t < 10) return 6500;
  if (t < 11.75) return 900 * pow(14000 / 900, (t - 10) / 1.75);
  return 9000;
}
const fl = [new BQ(), new BQ()], fa = [new BQ(), new BQ()];
const scTimes = kickTimes.slice().sort((a, b) => a - b);
let ki = 0;
const dl = Math.round(0.375 * SR), delay = buf();
for (let i = 0; i < N; i++) {
  const t = i / SR;
  if (i % 32 === 0) for (let c = 0; c < 2; c++) { fl[c].set("lp", cutoff(t) * 0.7, 0.9); fa[c].set("lp", cutoff(t), 1.1); }
  while (ki + 1 < scTimes.length && scTimes[ki + 1] <= t) ki++;
  const dt = t - scTimes[ki];
  const sc = dt >= 0 && dt < 0.5 ? 1 - 0.75 * exp(-dt / 0.09) : 1;
  for (let c = 0; c < 2; c++) {
    const pad = fl[c].p(padRaw[c][i]);
    const arp = fa[c].p(arpRaw[c][i]);
    // delay ping-pong 3/16 en el arpegio
    const d = i >= dl ? delay[1 - c][i - dl] : 0;
    delay[c][i] = arp + d * 0.38;
    music[c][i] = music[c][i] * sc + pad * sc + (arp + d * 0.5) * (0.6 + 0.4 * sc);
    send[c][i] += pad * 0.4 + d * 0.3;
  }
}
// Reverb tipo Freeverb (4 combs + 2 allpass por canal)
function reverb(inp, offset) {
  const out = new Float32Array(N);
  const combs = [1557, 1617, 1491, 1422].map((d) => ({ d: d + offset, b: new Float32Array(d + offset), i: 0, s: 0 }));
  const aps = [556, 441].map((d) => ({ d: d + offset, b: new Float32Array(d + offset), i: 0 }));
  for (let n = 0; n < N; n++) {
    let y = 0;
    for (const c of combs) {
      const o = c.b[c.i];
      c.s = o * 0.7 + c.s * 0.3;
      c.b[c.i] = inp[n] * 0.5 + c.s * 0.86;
      c.i = (c.i + 1) % c.d; y += o;
    }
    for (const a of aps) {
      const o = a.b[a.i]; a.b[a.i] = y + o * 0.5; y = o - y; a.i = (a.i + 1) % a.d;
    }
    out[n] = y;
  }
  return out;
}
const revL = reverb(send[0], 0), revR = reverb(send[1], 23);

const out = buf();
let peak = 0;
for (let i = 0; i < N; i++) {
  const t = i / SR;
  const fade = min(1, t / 0.005) * min(1, (DUR - t) / 0.4);
  for (let c = 0; c < 2; c++) {
    const rev = c ? revR[i] : revL[i];
    let v = drums[c][i] * 0.8 + music[c][i] * 0.8 + fx[c][i] + rev * 0.22;
    v = tanh(v * 0.85) * fade;
    out[c][i] = v; peak = max(peak, Math.abs(v));
  }
}
const g = 0.89 / peak;
const data = Buffer.alloc(44 + N * 4);
data.write("RIFF", 0); data.writeUInt32LE(36 + N * 4, 4); data.write("WAVE", 8);
data.write("fmt ", 12); data.writeUInt32LE(16, 16); data.writeUInt16LE(1, 20); data.writeUInt16LE(2, 22);
data.writeUInt32LE(SR, 24); data.writeUInt32LE(SR * 4, 28); data.writeUInt16LE(4, 32); data.writeUInt16LE(16, 34);
data.write("data", 36); data.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) for (let c = 0; c < 2; c++)
  data.writeInt16LE(Math.round(max(-1, min(1, out[c][i] * g)) * 32767), 44 + i * 4 + c * 2);
writeFileSync(new URL("../public/music-abdullah.wav", import.meta.url), data);
console.log("music-abdullah.wav escrito, pico previo", peak.toFixed(3));
