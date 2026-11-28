#!/usr/bin/env bash
# Full-quality build of the recess-kit film, v4 (owner's review, 28 Nov 2026): two voice versions (US, AU) sharing one picture.
#   WORK=/path/to/scratch ./make_hq.sh     (WORK holds nauo.json (STEP part map), didot.ttf and vo/us, vo/au: vo1..vo8.wav from tts_batch.py)
# 1 voice: trim + 1.02x -> vt*.wav; one timeline from the longer of the two reads per line
# 2 CAD renders (render_hq.py: plates, aux maps, explode states, fan states; 3 threads)
# 3 composite (compose_hq.py, 3 workers) piped straight into lossless-ish segments (no PNG frames on disk), concatenated per format
# 4 sound per version (audio_hq.py: voice + music.py + tonal cues) + two-pass loudnorm to -14 LUFS
# 5 encode: subtitles burned per version (subs.py ASS), x264 high CRF 19, 3 threads
set -euo pipefail
B="$(cd "$(dirname "$0")" && pwd)"; OUT="$B/.."; : "${WORK:?set WORK}"; J=${JOBS:-3}; PY=${BLENDER_PY:-$WORK/../cad/venv/bin/python}
cd "$WORK"
if [ ! -f timeline.json ] || [ "${RETIME:-0}" = 1 ]; then
  for v in us au; do for i in 1 2 3 4 5 6 7 8; do
    ffmpeg -loglevel error -y -i vo/$v/vo$i.wav -af "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse,atempo=1.02,aresample=48000" -ac 1 vo/$v/vt$i.wav
  done; done
  python3 - "$B" <<'P'
import wave, json, sys; sys.path.insert(0, sys.argv[1]); import shots
L = {v: [round(wave.open('vo/%s/vt%d.wav' % (v, i)).getnframes() / 48000, 2) for i in range(1, 9)] for v in ('us', 'au')}
T = shots.timeline([max(a, b) for a, b in zip(L['us'], L['au'])]); T['vo'] = L; json.dump(T, open('timeline.json', 'w'), indent=1); print('total', round(T['total'], 1), 's')
P
fi
GLB="${GLB:-$WORK/../cad/glb/6kW heater and recess kit.glb}" THREADS=3 "$PY" "$B/render_hq.py" "$WORK" plates aux explode fans
X264="-c:v libx264 -preset slow -profile:v high -tune film -crf 19 -pix_fmt yuv420p -threads 3 -x264-params keyint=60:min-keyint=30"
seg() {  # mode frames WxH -> master_<mode>.mkv
  local M=$1 N=$2 S=$3 K=$(( ($2 + J - 1) / J )) pids=()
  for ((i=0;i<J;i++)); do
    local a=$((i*K)) b=$(((i+1)*K<N?(i+1)*K:N))
    ( PIPE=1 python3 "$B/compose_hq.py" "$WORK" "$M" $a $b | ffmpeg -loglevel error -y -f rawvideo -pix_fmt rgb24 -s $S -r 30 -i - -c:v libx264 -preset fast -crf 12 -pix_fmt yuv420p -threads 1 seg_${M}_$i.mkv ) & pids+=($!)
  done
  for p in "${pids[@]}"; do wait "$p"; done
  : > seg_$M.txt; for ((i=0;i<J;i++)); do echo "file 'seg_${M}_$i.mkv'" >> seg_$M.txt; done
  ffmpeg -loglevel error -y -f concat -safe 0 -i seg_$M.txt -c copy master_$M.mkv && rm -f seg_${M}_*.mkv
}
NH=$(python3 -c "import json;print(json.load(open('timeline.json'))['frames'])")
NV=$(python3 -c "import json,sys;sys.path.insert(0,'$B');import shots;T=json.load(open('timeline.json'));print(int(round((T['dur'][shots.KIT]+T['dur'][shots.END])*30)))")
[ -f master_h.mkv ] || seg h "$NH" 1920x1080
[ -f master_v.mkv ] || seg v "$NV" 1080x1920
[ -f master_loop.mkv ] || seg loop 180 1920x1080
norm() {  # two-pass loudnorm to -14 LUFS / -1.5 dBTP
  local s; s=$(ffmpeg -hide_banner -i "$1" -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
  local mi mt ml mth mo; mi=$(echo "$s" | python3 -c "import json,sys;d=json.load(sys.stdin);print(d['input_i'],d['input_tp'],d['input_lra'],d['input_thresh'],d['target_offset'])")
  read mi mt ml mth mo <<< "$mi"
  ffmpeg -loglevel error -y -i "$1" -af loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=$mi:measured_TP=$mt:measured_LRA=$ml:measured_thresh=$mth:offset=$mo:linear=true -ar 48000 "$2"
}
for v in us au; do
  sfx=$([ $v = au ] && echo "-AU" || echo "")
  python3 "$B/subs.py" "$WORK" $v subs_$v.ass
  for m in h v; do python3 "$B/audio_hq.py" "$WORK" $m $v; norm audio_${m}_$v.wav audio_${m}_${v}_n.wav; done
  ffmpeg -y -loglevel error -i master_h.mkv -i audio_h_${v}_n.wav -vf "ass=subs_$v.ass" $X264 -c:a aac -b:a 256k -shortest -movflags +faststart "$OUT/Tungsten-Series-II-Recess-Airflow-3D$sfx.mp4"
  ffmpeg -y -loglevel error -i master_v.mkv -i audio_v_${v}_n.wav $X264 -c:a aac -b:a 256k -shortest -movflags +faststart "$OUT/Tungsten-Series-II-Recess-Airflow-3D-Reels$sfx.mp4"
done
ffmpeg -y -loglevel error -i master_loop.mkv $X264 -an -movflags +faststart "$OUT/Tungsten-Series-II-Recess-Airflow-3D-Loop.mp4"
TP=$(python3 -c "import json,sys;sys.path.insert(0,'$B');import shots;T=json.load(open('timeline.json'));print(round(T['start'][shots.KIT]+T['dur'][shots.KIT]*0.62,2))")
ffmpeg -y -loglevel error -ss $TP -i master_h.mkv -frames:v 1 -q:v 2 "$OUT/Tungsten-Series-II-Recess-Airflow-3D-poster.jpg"
ls -la "$OUT"/Tungsten-Series-II-Recess-Airflow-3D*
