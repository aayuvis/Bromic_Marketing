#!/usr/bin/env bash
# Full-quality build of the recess-kit film (owner, 21 Nov 2026: unsmudged frames, CAD only, female voice, CC0 music).
#   WORK=/path/to/scratch ./make_hq.sh            (WORK holds nauo.json, didot.ttf, vo1..vo7.wav, music/another_august.mp3)
# 1 voice: trim + 1.04x -> vt*.wav and the timeline  2 CAD renders (render_hq.py: plates, aux maps, explode frames, fan regions)
# 3 composite PNG frames (compose_hq.py, 2x supersampled overlays)  4 sound (audio_hq.py) + loudnorm  5 encode (x264 high, CRF 19, film: CRF 17 measured 76 MB for the first 37 s, over the 60 MB budget; 19 is visually identical at 100%)
set -euo pipefail
B="$(cd "$(dirname "$0")" && pwd)"; OUT="$B/.."; : "${WORK:?set WORK}"; J=${JOBS:-4}; PY=${BLENDER_PY:-$WORK/../cad/venv/bin/python}
cd "$WORK"
if [ ! -f timeline.json ] || [ "${RETIME:-0}" = 1 ]; then
  for i in 1 2 3 4 5 6 7; do
    ffmpeg -loglevel error -y -i vo$i.wav -af "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,atempo=1.04,aresample=48000" -ac 1 vt$i.wav
  done
  python3 - "$B" <<'P'
import wave, json, sys; sys.path.insert(0, sys.argv[1]); import shots
L = [round(wave.open('vt%d.wav' % i).getnframes() / 48000, 2) for i in range(1, 8)]
T = shots.timeline(L); T['vo'] = L; json.dump(T, open('timeline.json', 'w'), indent=1); print('total', round(T['total'], 1), 's')
P
fi
GLB="${GLB:-$WORK/../cad/glb/6kW heater and recess kit.glb}" "$PY" "$B/render_hq.py" "$WORK" plates aux explode fans
run() {  # mode frames
  local M=$1 N=$2 S=$(( ($2 + J - 1) / J )) pids=()
  for ((i=0;i<J;i++)); do python3 "$B/compose_hq.py" "$WORK" "$M" $((i*S)) $(((i+1)*S<N?(i+1)*S:N)) & pids+=($!); done
  for p in "${pids[@]}"; do wait "$p"; done
}
NH=$(python3 -c "import json;print(json.load(open('timeline.json'))['frames'])")
NV=$(python3 -c "import json;T=json.load(open('timeline.json'));print(int(round((T['dur'][4]+T['dur'][6])*30)))")
run h "$NH"; run v "$NV"; run loop 180
[ -f music/music.wav ] || ffmpeg -loglevel error -y -i music/another_august.mp3 -ar 48000 -ac 2 music/music.wav
for m in h v; do
  python3 "$B/audio_hq.py" "$WORK" $m
  ffmpeg -loglevel error -y -i audio_hq_$m.wav -af loudnorm=I=-14:TP=-1.5:LRA=11 -ar 48000 audio_hq_${m}_n.wav
done
X264="-c:v libx264 -preset slow -profile:v high -tune film -crf 19 -pix_fmt yuv420p -x264-params keyint=60:min-keyint=30"
ffmpeg -y -loglevel error -framerate 30 -i qh/%05d.png -i audio_hq_h_n.wav $X264 -c:a aac -b:a 256k -shortest -movflags +faststart "$OUT/Tungsten-Series-II-Recess-Airflow-3D.mp4"
ffmpeg -y -loglevel error -framerate 30 -i qv/%05d.png -i audio_hq_v_n.wav $X264 -c:a aac -b:a 256k -shortest -movflags +faststart "$OUT/Tungsten-Series-II-Recess-Airflow-3D-Reels.mp4"
ffmpeg -y -loglevel error -framerate 30 -i ql/%05d.png $X264 -an -movflags +faststart "$OUT/Tungsten-Series-II-Recess-Airflow-3D-Loop.mp4"
python3 -c "import json;from PIL import Image;T=json.load(open('timeline.json'));f=int((T['start'][4]+T['dur'][4]*0.55)*30);Image.open('qh/%05d.png'%f).convert('RGB').save('$OUT/Tungsten-Series-II-Recess-Airflow-3D-poster.jpg',quality=94)"
ls -la "$OUT"/Tungsten-Series-II-Recess-Airflow-3D*
