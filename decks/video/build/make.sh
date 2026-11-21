#!/usr/bin/env bash
# Build the recess airflow video. WORK holds the renders (render.py), the voice (tts.py) and didot.ttf.
#   WORK=/path/to/scratch ./make.sh
set -euo pipefail
B="$(cd "$(dirname "$0")" && pwd)"; OUT="$B/.."; : "${WORK:?set WORK}"; J=${JOBS:-8}
for M in h v; do
  python3 "$B/compose.py" "$WORK" "$M" 0 1                       # writes timing_$M.json
  N=$(python3 -c "import json;print(json.load(open('$WORK/timing_$M.json'))['frames'])")
  STEP=$(( (N + J - 1) / J )); pids=()
  for ((i=0;i<J;i++)); do python3 "$B/compose.py" "$WORK" "$M" $((i*STEP)) $(((i+1)*STEP)) & pids+=($!); done
  for p in "${pids[@]}"; do wait "$p"; done
  python3 "$B/audio.py" "$WORK" "$M"
done
ffmpeg -y -loglevel error -framerate 30 -i "$WORK/frames_h/%05d.jpg" -i "$WORK/audio_h.wav" -c:v libx264 -preset slow -crf 21 -pix_fmt yuv420p \
  -c:a aac -b:a 160k -shortest -movflags +faststart "$OUT/Tungsten-Series-II-Recess-Airflow.mp4"
ffmpeg -y -loglevel error -framerate 30 -i "$WORK/frames_v/%05d.jpg" -i "$WORK/audio_v.wav" -c:v libx264 -preset slow -crf 22 -pix_fmt yuv420p \
  -c:a aac -b:a 160k -shortest -movflags +faststart "$OUT/Tungsten-Series-II-Recess-Airflow-Reels.mp4"
python3 - "$WORK" "$OUT" <<'P'
import sys; from PIL import Image
w, o = sys.argv[1:]; Image.open(f'{w}/frames_h/01500.jpg').save(f'{o}/Tungsten-Series-II-Recess-Airflow-poster.jpg', quality=90)
P
ls -la "$OUT"
