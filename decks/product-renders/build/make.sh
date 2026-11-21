#!/usr/bin/env bash
# Render every shot at full size (resumable), then lay each on the studio sweep -> decks/product-renders/*.jpg
# WORK = scratch folder for 16-bit PNGs; BPY = Blender's Python (the CAD venv). Run from anywhere.
set -u
HERE=$(cd "$(dirname "$0")" && pwd); OUT=$(dirname "$HERE"); WORK=${WORK:?set WORK}; BPY=${BPY:?set BPY}
mkdir -p "$WORK"
for k in $(python3 -c "import json;print(' '.join(json.load(open('$HERE/shots.json'))))"); do
  if [ ! -f "$WORK/$k.png" ]; then
    s=$(date +%s); nice -n 10 "$BPY" "$HERE/render.py" "$HERE/shots.json" "$k" "$WORK/$k.png" > "$WORK/$k.log" 2>&1
    echo "$k $(( $(date +%s) - s ))s" >> "$WORK/times.txt"
  fi
  c=$(echo "$k" | cut -d- -f1); c=${c^}
  python3 "$HERE/compose.py" "$WORK/$k.png" "$OUT/Tungsten-Series-II-${c}-${k#*-}.jpg" > /dev/null
done
echo ALLDONE >> "$WORK/times.txt"
