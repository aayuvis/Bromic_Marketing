const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1350},deviceScaleFactor:2});
await p.goto('file://'+process.argv[2]);await p.waitForTimeout(800);await p.screenshot({path:process.argv[3],type:'jpeg',quality:92});await b.close();})();
