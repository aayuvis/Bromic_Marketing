"""Gemini TTS for the recess-kit film. The style prompt (STYLE env, or argv[4]) steers delivery and accent; it is spoken by no one.
  python3 tts.py "text" out.wav [voice] [style]      (key from /root/.gkey; never printed)"""
import base64, json, ssl, urllib.request, sys, wave, os
KEY = open(os.environ.get('GKEY_FILE', '/root/.gkey')).read().strip()
text, out = sys.argv[1], sys.argv[2]
voice = sys.argv[3] if len(sys.argv) > 3 else 'Sulafat'
style = sys.argv[4] if len(sys.argv) > 4 else os.environ.get('STYLE', '')
prompt = (style.strip() + '\n\n' + text) if style else text
body = {'contents': [{'parts': [{'text': prompt}]}], 'generationConfig': {'responseModalities': ['AUDIO'], 'speechConfig': {'voiceConfig': {'prebuiltVoiceConfig': {'voiceName': voice}}}}}
ctx = ssl.create_default_context(cafile='/root/.ccr/ca-bundle.crt'); op = urllib.request.build_opener(urllib.request.ProxyHandler(), urllib.request.HTTPSHandler(context=ctx))
for m in os.environ.get('TTS_MODELS', 'gemini-2.5-pro-preview-tts,gemini-2.5-flash-preview-tts').split(','):
    try:
        req = urllib.request.Request(f'https://generativelanguage.googleapis.com/v1beta/models/{m}:generateContent', data=json.dumps(body).encode(),
                                     headers={'x-goog-api-key': KEY, 'Content-Type': 'application/json'})
        r = json.loads(op.open(req, timeout=300).read())
        pcm = base64.b64decode(r['candidates'][0]['content']['parts'][0]['inlineData']['data'])
        with wave.open(out, 'wb') as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(24000); w.writeframes(pcm)
        print(out, m, round(len(pcm) / 48000, 2), 's'); sys.exit(0)
    except Exception as e: print('fail', m, str(e)[:200])
sys.exit(1)
