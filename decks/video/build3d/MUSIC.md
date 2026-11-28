# Music for the recess-kit film (v4, 28 Nov 2026)

**Track:** original, composed for this film and synthesised in code by `music.py` (numpy only: no samples, no loops, no third-party
recordings). Licence-clean by construction: Bromic owns it outright; nothing to credit or clear.

**Why it changed:** the owner found v3's track ("Another August", CC0) dull and boring. v4 is warmer and more modern, but stays under
the voice: a light groove at 96 BPM in D major.

- Chords, one a bar: Dmaj9 – Bm9 – Gmaj9 – A7sus4 (I – vi – IV – V), resolving on Dmaj9 as the end card lands.
- Electric piano (two-operator FM, soft bell attack, slight tremolo) on every bar, with a gentle re-voice on the "and" of beat 3.
- A pluck arpeggio in eighths from bar 2 (lifted an octave from bar 5), a round sub bass from bar 3, an opening pad.
- A soft tonal pulse: a low sine "thump" on beats 1 and 3 and a very quiet high tick on the off-beats, both made from decaying sine
  tones. **No noise-based sound anywhere** (the owner heard a hiss at 0:07 in v3: the section-sweep whoosh, filtered noise, is gone).
- A lighter two-bar breath mid-film; a dark synthetic reverb (convolved, 2.4 s); gentle tanh glue.

**Mix** (`audio_hq.py`): about 9 dB under the voice in the gaps and about 16 dB under it while the narrator speaks; 1 s fade in, 2 s fade
out; the 16:9 film and the Reels each get their own arrangement timed to their own length and end card. The final mix is normalised to
−14 LUFS integrated, −1.5 dBTP (two-pass loudnorm in `make_hq.sh`).

Sound cues (also all sine-based): a soft click and warm two-note swell as the heater switches on, tonal ticks as the kit reassembles,
a low hum as the fans spin up.

v3's track remains documented here for the record: "Another August" – The Cynic Project, OpenGameArt, CC0 1.0. It is no longer used.
