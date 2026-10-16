#!/usr/bin/env bash
# Mezcla final del portfolio: canción (no incluida en el repo) + efectos de UI, con la canción
# agachándose ligeramente bajo cada efecto (sidechain). Uso: bash scripts/mix-abdullah.sh <ruta-cancion.mp3>
set -euo pipefail
cd "$(dirname "$0")/.."
SONG="${1:?ruta al mp3 de Timeless (instrumental)}"
mkdir -p public/song
ffmpeg -hide_banner -loglevel error -y -ss 21.045 -t 17 -i "$SONG" -ar 48000 -ac 2 public/song/timeless-21s.wav
ffmpeg -hide_banner -loglevel error -y -i public/song/timeless-21s.wav -i public/ui-sfx.wav -filter_complex "
  [0]afade=t=in:d=0.08,afade=t=out:st=15.6:d=1.4,volume=0.8[s];
  [1]volume=${SFX_GAIN:-0.9},asplit=2[x][key];
  [s][key]sidechaincompress=threshold=0.05:ratio=3:attack=2:release=120:makeup=1[duck];
  [duck][x]amix=inputs=2:normalize=0,alimiter=limit=0.84:level=false,loudnorm=I=-11:TP=-1:LRA=11:linear=true[o]" \
  -map "[o]" -ar 48000 public/abdullah-mix.wav
