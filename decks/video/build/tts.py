import base64,json,ssl,urllib.request,sys,wave
KEY=open('/root/.gkey').read().strip()
text,out,voice=sys.argv[1],sys.argv[2],(sys.argv[3] if len(sys.argv)>3 else 'Charon')
body={'contents':[{'parts':[{'text':text}]}],'generationConfig':{'responseModalities':['AUDIO'],'speechConfig':{'voiceConfig':{'prebuiltVoiceConfig':{'voiceName':voice}}}}}
ctx=ssl.create_default_context(cafile='/root/.ccr/ca-bundle.crt'); op=urllib.request.build_opener(urllib.request.ProxyHandler(),urllib.request.HTTPSHandler(context=ctx))
for m in ['gemini-2.5-pro-preview-tts','gemini-2.5-flash-preview-tts']:
  try:
    req=urllib.request.Request(f'https://generativelanguage.googleapis.com/v1beta/models/{m}:generateContent',data=json.dumps(body).encode(),headers={'x-goog-api-key':KEY,'Content-Type':'application/json'})
    r=json.loads(op.open(req,timeout=300).read())
    d=r['candidates'][0]['content']['parts'][0]['inlineData']['data']
    pcm=base64.b64decode(d)
    with wave.open(out,'wb') as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(24000); w.writeframes(pcm)
    print(out,m,len(pcm)/48000,'s'); sys.exit(0)
  except Exception as e: print('fail',m,str(e)[:200])
