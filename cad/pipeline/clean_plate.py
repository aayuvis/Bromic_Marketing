import base64,json,ssl,urllib.request,io,sys
from PIL import Image
KEY=open('/root/.gkey').read().strip()
src,out=sys.argv[1],sys.argv[2]
im=Image.open(src).convert('RGB'); W,H=im.size; b=io.BytesIO(); im.save(b,'JPEG',quality=95)
r=W/H; ar=min(['16:9','21:9','3:2','4:3','2:3','1:1','3:4','9:16'],key=lambda a:abs(eval(a.replace(':','/'))-r))
prompt=("Remove every outdoor infrared heater in this photograph completely, together with its mounting brackets, posts, drop poles, chains, cables and junction boxes. "
 "Rebuild the wall, ceiling, beams, louvres, glass, sky or whatever is behind them so it looks as if no heater was ever installed. "
 "Change nothing else: keep the exact composition, framing, camera angle, lighting, colours, people, furniture and every other object identical, pixel for pixel where possible. "
 "Keep the warm evening light in the scene as it is. Photographic, no text.")
body={'contents':[{'parts':[{'inline_data':{'mime_type':'image/jpeg','data':base64.b64encode(b.getvalue()).decode()}},{'text':prompt}]}],'generationConfig':{'responseModalities':['IMAGE'],'imageConfig':{'aspectRatio':ar}}}
ctx=ssl.create_default_context(cafile='/root/.ccr/ca-bundle.crt'); op=urllib.request.build_opener(urllib.request.ProxyHandler(),urllib.request.HTTPSHandler(context=ctx))
for attempt in range(3):
  try:
    req=urllib.request.Request('https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image:generateContent',data=json.dumps(body).encode(),headers={'x-goog-api-key':KEY,'Content-Type':'application/json'})
    r=json.loads(op.open(req,timeout=300).read()); break
  except Exception as e: print('retry',e)
for p in r['candidates'][0]['content']['parts']:
  d=p.get('inlineData') or p.get('inline_data')
  if d: Image.open(io.BytesIO(base64.b64decode(d['data']))).convert('RGB').resize((W,H),Image.LANCZOS).save(out); print(out,'ok',ar)
