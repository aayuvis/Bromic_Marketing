#!/usr/bin/env bash
# Build the premium 3D recess-kit film. WORK holds nauo.json (STEP part map), didot.ttf, the voice (vo1..vo7.wav from tts.py) and the renders.
#   WORK=/path/to/scratch ./make.sh
# Steps: trim + speed the voice, timeline, render the 3D frames (Blender venv), composite 16:9 / Reels / loop, sound, encode.
set -euo pipefail
B="$(cd "$(dirname "$0")" && pwd)"; OUT="$B/.."; : "${WORK:?set WORK}"; J=${JOBS:-4}; PY=${BLENDER_PY:-$WORK/../cad/venv/bin/python}
cd "$WORK"
for i in 1 2 3 4 5 6 7; do
  ffmpeg -loglevel error -y -i vo$i.wav -af "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,atempo=1.08,aresample=48000" -ac 1 vt$i.wav
done
python3 - "$B" <<'P'
import wave, json, sys; sys.path.insert(0, sys.argv[1]); import shots
L = [round(wave.open('vt%d.wav' % i).getnframes() / 48000, 2) for i in range(1, 8)]
T = shots.timeline(L); T['vo'] = L; json.dump(T, open('timeline.json', 'w'), indent=1); print('total', round(T['total'], 1), 's')
P
GLB="${GLB:-$WORK/../cad/glb/6kW heater and recess kit.glb}" "$PY" "$B/render.py" "$WORK"
run() {  # mode frames
  local M=$1 N=$2 S=$(( ($2 + J - 1) / J )) pids=()
  for ((i=0;i<J;i++)); do python3 "$B/compose.py" "$WORK" "$M" $((i*S)) $(((i+1)*S<N?(i+1)*S:N)) & pids+=($!); done
  for p in "${pids[@]}"; do wait "$p"; done
}
NH=$(python3 -c "import json;print(json.load(open('timeline.json'))['frames'])")
NV=$(python3 -c "import json;T=json.load(open('timeline.json'));print(int(round((T['dur'][4]+T['dur'][6])*30)))")
run h "$NH"; run v "$NV"; run loop 180
python3 "$B/audio.py" "$WORK" h; python3 "$B/audio.py" "$WORK" v
ffmpeg -y -loglevel error -framerate 30 -i fh/%05d.jpg -i audio_h.wav -c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest -movflags +faststart "$OUT/Tungsten-Series-II-Recess-Airflow-3D.mp4"
ffmpeg -y -loglevel error -framerate 30 -i fv/%05d.jpg -i audio_v.wav -c:v libx264 -preset slow -crf 21 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest -movflags +faststart "$OUT/Tungsten-Series-II-Recess-Airflow-3D-Reels.mp4"
ffmpeg -y -loglevel error -framerate 30 -i fl/%05d.jpg -c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p -an -movflags +faststart "$OUT/Tungsten-Series-II-Recess-Airflow-3D-Loop.mp4"
python3 -c "import json;from PIL import Image;T=json.load(open('timeline.json'));f=int((T['start'][4]+T['dur'][4]*0.55)*30);Image.open('fh/%05d.jpg'%f).save('$OUT/Tungsten-Series-II-Recess-Airflow-3D-poster.jpg',quality=92)"
ls -la "$OUT"/Tungsten-Series-II-Recess-Airflow-3D*
