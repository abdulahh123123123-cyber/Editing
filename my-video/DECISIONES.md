# DECISIONES — Showreel de motion design (15 s)

**Entregable:** `entrega/showreel.mp4`, 1920×1080, 60 fps, 900 frames, H.264 (CRF 16) con audio AAC a 320 kbps, 48 kHz estéreo.
**Herramientas:** solo código. El vídeo está hecho con React + Remotion y la música con un sintetizador escrito en JavaScript (`scripts/compose-music.mjs`). No usé ningún modelo de generación de imagen, vídeo o audio, ni samples, fotos o material de stock.

---

## 1. La idea

Un showreel de motion designer no tiene que enseñar efectos, sino **criterio**: timing, espaciado, curvas, ritmo. Por eso la pieza es un pequeño manifiesto de oficio. Cada escena demuestra una herramienta del motion design y la nombra mientras la usa.

| Tiempo | Escena | Qué demuestra |
|---|---|---|
| 0:00–0:02 | **Genesis** | Un punto nace con el golpe de sub, se estira en línea, la línea traza la retícula y el nombre sube letra a letra desde una máscara. Al final todo colapsa hacia el centro (ease-in) y llega un destello: el drop. |
| 0:02–0:04 | **Shape language** | Una forma salta por un arco y cambia en cada beat (círculo → cuadrado → triángulo → estrella). Hace *squash & stretch*, anticipación y aterrizaje mientras el texto nombra cada principio de animación. |
| 0:04–0:06 | **Kinetic type** | Cuatro palabras, una por beat (TIMING, SPACING, RHYTHM, EASE.), cada una con una entrada distinta: zoom con desenfoque, tracking que converge, caída escalonada con rebote y barrido con ecos en contorno. El color de fondo cambia en cada golpe. |
| 0:06–0:08 | **Easing lab** | Una curva `cubic-bezier(.16,1,.3,1)` se dibuja con sus tiradores y tres carriles comparan *linear*, *ease-out* y *spring* con papel cebolla y marcas de espaciado. Es la escena más "de oficio": enseña lo que un motion designer ajusta de verdad. |
| 0:08–0:10 | **Generative** | 700 partículas en 3D (proyección perspectiva hecha a mano) cambian de forma en cada beat: esfera → toro → doble hélice → campo ondulado. "Systems, not keyframes." |
| 0:10–0:12 | **Tension** | Un túnel de cuadrados acelera con el redoble. El contador 000→100 tiene aberración cromática y el temblor de cámara crece. A los 11,75 s entra un silencio negro con una sola línea que se cierra. |
| 0:12–0:14 | **Impact** | Onda expansiva, estallido de 140 fragmentos y rayos que giran. El nombre aterriza letra a letra y en cada beat salta en cascada. Las cuatro formas de la escena 2 vuelven como firma. |
| 0:14–0:15 | **End card** | Golpe final, cartón en papel claro con el nombre y "Every frame and every note of this reel was written in code", y fundido a negro. |

**Capas globales:**
- **HUD de cámara:** timecode a 60 fps, nombre de la escena e indicador de beat, en modo de fusión *difference* para que se lea sobre cualquier fondo.
- **Marcas de registro en las esquinas.**
- **Grano** animado con `feTurbulence`.
- **Viñeta.**
- **Golpe de cámara** en cada bombo (desplazamiento y escala sutiles).
- **Motion blur real** en toda la capa de escenas.

### Paleta y tipografía
- Tinta `#0B0B10`, papel `#F2EEE5`, naranja `#FF5A1F`, azul cobalto `#2F4BFF` y lima `#D7FF3A`, este último solo como acento puntual.
- **Inter Display Black** con tracking negativo para los titulares, y monoespaciada para todo lo "técnico" (datos, HUD, etiquetas). El contraste entre la tipografía expresiva y la técnica es la identidad visual.

---

## 2. La música

Compuse y sinteticé todo desde cero en `scripts/compose-music.mjs`: osciladores, ruido, filtros biquad, delay y reverb, escritos a mano y sin dependencias.

- **Tempo:** 120 BPM. **Esta fue la decisión clave del proyecto:** a 60 fps, un beat son exactamente **30 frames** y un compás son 2 s. Eso permite que cada corte de escena caiga en un compás y cada animación en un beat, sin redondeos. El vídeo importa los mismos tiempos (`KICKS`, `SNARES` en `src/reel/lib.ts`), así que la sincronía es exacta por construcción, no a ojo.
- **Tonalidad:** La menor. Progresión Am – F – C – G – Am – **E** (dominante para tensar el build) – Am(add9).
- **Instrumentos:**
  - **Bombo:** seno con barrido de tono y click de ruido.
  - **Palmada:** ruido filtrado con tres ráfagas.
  - **Hi-hats:** ruido en paso alto.
  - **Redoble:** ruido más tono.
  - **Bajo:** sierra con polyBLEP y filtro con envolvente, más sub una octava abajo.
  - **Pad *supersaw*:** 3 voces desafinadas por nota, abiertas en estéreo.
  - **Arpegio *pluck*:** en semicorcheas, con delay ping-pong de 3/16.
  - **Efectos:** whooshes, riser, crash, caída de sub y "ticks".
- **Mezcla:**
  - *Sidechain* por envolvente: todo lo melódico "respira" con el bombo.
  - Filtro maestro automatizado: se abre en la intro y cae y barre en el build.
  - Reverb tipo Freeverb (4 combs + 2 allpass por canal).
  - Saturación suave con `tanh` y normalización a −1 dBFS.
- **Estructura** espejo del vídeo:
  - **Intro (0–2 s):** filtrada y sin bombo.
  - **Groove (2–10 s).**
  - **Build (10–11,75 s):** redoble que acelera de corcheas a fusas, más riser.
  - **Silencio (11,75–12 s).**
  - **Impacto (12 s).**
  - **Golpe final (14 s)** y cola de reverb.

---

## 3. Iteraciones

1. **Música v1:** sonaba demasiado aplastada: **−9,7 LUFS** y rango de sonoridad de solo **1,4 LU**. En el espectrograma, el crash del impacto (12 s) tapaba todas las frecuencias como una pared de ruido.
   → **v2:** bajé el *drive* del saturador (1,15 → 0,85) y el nivel del bombo, y reduje el crash a menos de la mitad y con cola más corta. Resultado: **−11,7 LUFS integrados, pico −1,0 dBFS**, con las secciones claramente diferenciadas (la intro a unos −17 dB de media y el impacto a unos −9 dB).
2. **Primera previsualización:** fallé al renderizar a escala 0,33 (1080 × 0,33 no da una altura entera). Pasé a 0,25 y monté hojas de contactos cada 15 frames para revisar todo el ritmo visual de un vistazo.
3. **Error de TypeScript:** `skew` no es una propiedad CSS independiente (a diferencia de `scale`, `rotate` y `translate`). Lo cambié a `transform: skewX()`.
4. **Fotosensibilidad:** en la hoja de contactos vi que el build lanzaba un flash blanco a pantalla completa en cada golpe de redoble. Al final el redoble llega a **16 golpes por segundo**, muy por encima del límite de unos 3 destellos por segundo que recomiendan las pautas de accesibilidad. Lo sustituí por un pulso naranja muy sutil (7 % de opacidad) y por un pulso de escala en el contador. La tensión la mantienen el movimiento y el sonido, no el parpadeo.
5. **Motion blur:** probé primero `HtmlInCanvasMotionBlur`, que es la opción más moderna de Remotion, pero necesita Chrome 149 o superior y el Chromium disponible es la versión 141. Usé `CameraMotionBlur` (obturador de 180°, 6 muestras) solo sobre la capa de escenas, para que el HUD y el grano sigan nítidos. Antes de renderizar todo lo probé en un tramo (frames 236–300): el desenfoque de las letras de SPACING al converger confirmó que valía la pena, con un coste aceptable (render completo en unos 3 minutos).
6. **Legibilidad:** subí el título de la escena de easing de 64 a 84 px y las etiquetas de los carriles de 20 a 23 px. A tamaño de reproductor de móvil se perdían.

---

## 4. Lo que descarté

- **HyperFrames:** el repositorio tiene sus skills instaladas y es otra forma válida de hacer vídeo con código, pero el proyecto ya estaba montado en **Remotion**, y mantener un solo framework era lo correcto.
- **Google Fonts por red:** las fuentes locales (Inter Display) dan el mismo resultado sin depender de la red durante el render.
- **Three.js para las partículas:** una proyección perspectiva escrita a mano con 700 círculos SVG es más ligera, determinista y fácil de sincronizar que una escena WebGL.
- **Un logo dibujado o tipográfico complejo:** la firma son las cuatro formas básicas de la escena 2 volviendo al final. Cierra el círculo narrativo mejor que un logo inventado.
- **Flashes a pantalla completa en el build:** se descartaron por fotosensibilidad (ver la iteración 4).
- **Compresor real para el sidechain:** una envolvente disparada por los tiempos del bombo es más predecible y suena más "pumping", que es lo que pide el género.
- **Más escenas o cortes más rápidos:** con 15 s, ocho bloques de 2 s (el último de 1 s) ya son mucha densidad. Más cortes habrían convertido el ritmo en ruido.

---

## 5. Limitaciones honestas

- **No puedo escuchar el audio.** Validé la música con métricas objetivas (sonoridad EBU R128, picos, niveles por sección) y con su forma de onda y espectrograma, no con el oído. La estructura, la armonía y la sincronía son correctas por construcción, pero la mezcla fina merece una escucha humana.
- **Revisé el vídeo con fotogramas y hojas de contactos**, no viéndolo en tiempo real.

---

## 6. Cómo reproducirlo

```bash
cd my-video
node scripts/compose-music.mjs          # genera public/music.wav
npm run dev                             # previsualización en Remotion Studio
npx remotion render Showreel entrega/showreel.mp4 --codec=h264 --crf=16 --audio-bitrate=320k
```

---

## 7. Tiempo total

Unos **16 minutos** de trabajo, desde la primera línea de la música hasta este documento (de las 23:56 a las 00:12 UTC). El reparto aproximado fue:
- Música (composición, síntesis y 2 versiones de mezcla): unos 3 min.
- Escenas y composición en Remotion: unos 6 min.
- Previsualizaciones, revisión y correcciones: unos 2 min.
- Render final a resolución completa: 2 min 53 s.
- Documentación: unos 2 min.

---

## Anexo — Versión portfolio de Abdullah (`entrega/abdullah-portfolio.mp4`)

La misma técnica, pero con todo el contenido sacado del sitio de Abdullah (`index.html`):
- **Contenido:**
  - Nombre y rol.
  - Titular "Edits that make people *stop scrolling*".
  - Los 4 servicios.
  - Los proyectos reales: GOAT, MMA, Adrenaline, Podcast, Cinematic Speech, Confidence y The Start.
  - Las cifras: 5+ años y 100K+ vistas.
  - Sus herramientas.
  - Su llamada a la acción "Let's cut something worth watching" e Instagram/email.
- **Identidad:** su paleta violeta → rosa, los degradados de los pósters del sitio y Playfair Display en cursiva, extraída de las fuentes incrustadas en su propio `index.html`.
- **Escenas pensadas para un editor de vídeo, no para un motion designer:**
  - Una línea de tiempo de NLE que se monta y un corte de cuchilla.
  - Un feed de móvil que frena en seco en "stop".
  - Un 16:9 → 9:16.
  - Ondas de audio que reaccionan al golpe.
  - Ruedas de color.
  - Cortes alineados con los transitorios del audio y una rampa de velocidad.
- **Música** (`scripts/compose-music-abdullah.mjs`): Re menor, más oscura y pesada para encajar con su trabajo de deportes y peleas. Incluye:
  - Bombo más saturado.
  - *Braams* graves en cada cambio de sección.
  - Golpes de puño en la escena de "Sports & Fight".
  - Un *power-down* antes del silencio.
  - Medición: −10,8 LUFS, pico −0,9 dBFS.
- **Iteración:** en el carrusel de trabajos, la tarjeta destacada quedaba en el borde de la pantalla y, al pasar al frente, tapaba el título. Ajusté el paneo de cámara para centrarla, puse el título por encima y reduje el tamaño de los títulos largos (ADRENALINE se cortaba).
- **Tiempo:** unos 25 minutos adicionales, incluidos dos renders completos de unos 5 minutos cada uno.
