import {chromium} from '@playwright/test';
import {writeFile,mkdir} from 'node:fs/promises';
const root=process.cwd()+'/docs/audit/evidence/after';
const ids=['neuron','python-basics','python-flow','intro','perceptron','tensor','propagation','backprop','activation','loss','gradient-depth','beginner','training-project','library','python','dashboard','python-workshop','math-workshop'];
const browser=await chromium.launch({executablePath:'/usr/bin/chromium'});
const results=[];
try{
for(const width of [1440,1280,768,390,320]){
 const context=await browser.newContext({viewport:{width,height:width>=1280?1000:width===768?1024:844},reducedMotion:'reduce'});
 for(const id of ids){
  const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(`http://127.0.0.1:4176/#/lab/${id}`,{waitUntil:'networkidle'});
  await page.locator('main h1').waitFor();await page.waitForTimeout(150);
  const snapshot=await page.evaluate(()=>{
   const main=document.querySelector('main');
   const visible=e=>{const r=e.getBoundingClientRect(),s=getComputedStyle(e);return r.width>0&&r.height>0&&s.visibility!=='hidden'&&s.display!=='none'};
   const elements=[...main.querySelectorAll('*')];
   const small=elements.filter(e=>visible(e)&&e.childElementCount===0&&e.textContent.trim()&&parseFloat(getComputedStyle(e).fontSize)<12).slice(0,35).map(e=>({tag:e.tagName,text:e.textContent.trim().slice(0,100),size:getComputedStyle(e).fontSize}));
   const controls=[...main.querySelectorAll('button,input,select,textarea,[role="button"],[role="tab"]')].filter(visible).map(e=>{const r=e.getBoundingClientRect();return {role:e.getAttribute('role')||e.tagName.toLowerCase(),name:e.getAttribute('aria-label')||e.textContent.trim().slice(0,100),width:Math.round(r.width),height:Math.round(r.height)}});
   return {title:main.querySelector('h1').innerText,text:main.innerText,headings:[...main.querySelectorAll('h1,h2,h3,h4')].map(e=>({level:e.tagName,text:e.innerText})),bodyHeight:document.documentElement.scrollHeight,overflow:document.documentElement.scrollWidth-innerWidth,smallText:small,controls,tinyTargets:controls.filter(c=>c.width<24||c.height<24),panels:main.querySelectorAll('section,article,[class*="panel"],[class*="card"]').length,resources:performance.getEntriesByType('resource').map(r=>({name:r.name.split('/').pop(),bytes:r.transferSize,duration:Math.round(r.duration)})),navigation:performance.getEntriesByType('navigation').map(n=>({domContentLoaded:Math.round(n.domContentLoadedEventEnd),load:Math.round(n.loadEventEnd)}))};
  });
  await page.screenshot({path:`${root}/${id}-${width}.png`,fullPage:true});
  await page.evaluate(()=>window.scrollTo(0,document.documentElement.scrollHeight));
  await page.keyboard.press('Tab');const focus=await page.evaluate(()=>({tag:document.activeElement.tagName,text:document.activeElement.textContent.slice(0,100)}));
  let axe;
  if(width===1440||width===390){await page.addScriptTag({path:process.cwd()+'/docs/audit/tools/axe.min.js'});axe=await page.evaluate(async()=>{const r=await window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}});return {violations:r.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),incomplete:r.incomplete.map(v=>({id:v.id,nodes:v.nodes.length})),passes:r.passes.length}})}
  results.push({id,width,...snapshot,errors,focus,axe});
  await writeFile(`${root}/inspection.json`,JSON.stringify(results,null,2));
  console.log(width,id,'height',snapshot.bodyHeight,'overflow',snapshot.overflow,'axe',axe?.violations.map(v=>v.id).join(',')||'—');await page.close();
 }
 await context.close();
}
}finally{await browser.close()}
