import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const browser=await chromium.launch({headless:true});
const errors=[];
const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
page.on('pageerror',error=>errors.push(String(error)));
const base=process.env.SIGIL_TEST_URL??'http://localhost:4033';
const settle=()=>page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(()=>requestAnimationFrame(r)))));
const token=name=>page.evaluate(name=>document.querySelector('style[data-sigil-tokens]').sheet.cssRules[0].style.getPropertyValue(name).trim(),name);
try {
 await page.goto(base,{waitUntil:'networkidle'});
 await page.getByRole('button',{name:'Studio',exact:true}).click();
 const sidebar=page.locator('#sigil-studio-sidebar');
 const section=sidebar.locator('[data-studio-section="Radius"]');
 await section.getByRole('button',{name:'Radius',exact:true}).click();
 const slider=section.getByRole('slider',{name:'button',exact:true});
 await slider.scrollIntoViewIfNeeded();
 const track=section.locator('[data-studio-row="button"] [data-slot="slider-track"]');
 const box=await track.boundingBox();
 await page.mouse.move(box.x+2,box.y+box.height/2);await page.mouse.down();
 await page.mouse.move(box.x+box.width,box.y+box.height/2,{steps:40});await page.mouse.up();await settle();
 assert.equal(await slider.getAttribute('aria-valuenow'),'24');
 assert.equal(await token('--s-radius-button'),'1.5rem');
 // A reset immediately following an input must update both the stylesheet and thumb.
 await slider.evaluate(el=>{
  el.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowLeft',bubbles:true}));
  document.querySelector('#sigil-studio-sidebar [title="Reset"]').click();
 });await settle();
 assert.equal(await slider.getAttribute('aria-valuenow'),'0');
 assert.equal(await token('--s-radius-button'),'0');
 await slider.focus();
 for(let i=0;i<12;i++) await page.keyboard.press('ArrowRight');
 await settle();
 assert.equal(await token('--s-radius-button'),'0.75rem');
 assert.equal(await slider.getAttribute('aria-valuenow'),'12');
 // A newer edit wins over a loading preset and cannot inherit a stale name.
 await slider.evaluate(el=>{
  document.querySelector('[aria-label="Site presets"] button[aria-label="Noir"]').click();
  el.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));
 });await page.waitForTimeout(500);await settle();
 assert.equal(await token('--s-radius-button'),'0.8125rem');
 assert.equal(await slider.getAttribute('aria-valuenow'),'13');
 assert.equal(await page.locator('html').getAttribute('data-sigil-preset-switching'),null);
 await sidebar.getByRole('button',{name:'Reset',exact:true}).click();await settle();
 assert.equal(await slider.getAttribute('aria-valuenow'),'0');
 // Native range edits should keep their final value, including maximum bounce.
 const duration=sidebar.getByRole('slider',{name:'Duration',exact:true});
 await duration.evaluate(el=>{ Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(el,'0.75'); el.dispatchEvent(new Event('input',{bubbles:true})); });
 const bounce=sidebar.getByRole('slider',{name:'Bounce',exact:true});
 await bounce.evaluate(el=>{ Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(el,'1'); el.dispatchEvent(new Event('input',{bubbles:true})); });await settle();
 assert.equal(await token('--s-duration-normal'),'750ms');
 assert.equal(await duration.inputValue(),'0.75');
 assert.equal(await bounce.inputValue(),'1');
 assert.equal(await sidebar.locator('svg path').evaluateAll(paths=>paths.some(p=>/NaN|Infinity/.test(p.getAttribute('d')??''))),false);
 await sidebar.getByRole('button',{name:'Physics',exact:true}).click();
 await page.locator('[aria-label="Site presets"]').getByRole('button',{name:'Rose',exact:true}).click();await page.waitForTimeout(250);await settle();
 const physics=await sidebar.getByRole('slider',{name:'Stiffness',exact:true}).inputValue();
 const seconds=parseFloat(await token('--s-duration-normal'))/1000;
 assert.ok(Math.abs(Number(physics)-(2*Math.PI/seconds)**2)<5,'physics controls synchronize to a new preset');
 for(const viewport of [{width:390,height:844},{width:844,height:390}]) {
  await page.setViewportSize(viewport);await settle();
  const settings=sidebar.locator('.devbar-scroll').last();
  assert.ok((await settings.boundingBox()).height>100,'settings remain usable on short screens');
  await sidebar.getByRole('button',{name:'Sound',exact:true}).scrollIntoViewIfNeeded();
  assert.ok(await sidebar.getByRole('button',{name:'Sound',exact:true}).isVisible());
 }
 assert.deepEqual(errors,[]);
 console.log('PASS pointer drag, rapid keyboard edits, reset races, preset import races, native ranges, physics synchronization and short-screen access');
}finally{await browser.close();}
