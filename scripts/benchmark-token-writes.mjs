import { chromium } from 'playwright';
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
try {
 await page.goto(process.env.SIGIL_TEST_URL??'http://localhost:4033',{waitUntil:'networkidle'});
 const results=await page.evaluate(async()=>{
   const frame=()=>new Promise(resolve=>requestAnimationFrame(resolve));
   const root=document.documentElement;
   const sheet=document.querySelector('style[data-sigil-tokens]').sheet;
   const results=[];
   for(const method of ['stylesheet','inline']) {
     const frames=[];
     for(let n=0;n<40;n++) {
       await frame();const t=performance.now();
       const style=method==='inline'?root.style:sheet.cssRules[0].style;
       style.setProperty('--s-radius-button',n%2?'1px':'2px','important');
       await frame();frames.push(performance.now()-t);
     }
     frames.sort((a,b)=>a-b);
     results.push({method,medianMs:frames[20],p95Ms:frames[38]});
   }
   return results;
 });console.log(results);
}finally{await browser.close();}
