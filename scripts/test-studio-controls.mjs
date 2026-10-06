import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';

const base = process.env.SIGIL_TEST_URL ?? 'http://localhost:4033';
const browser = await chromium.launch({ headless: true });
const results = [], failures = [];
const sectionNames = ['Colors','Typography','Spacing','Radius','Borders & Shadows','Motion','Buttons','Cards','Inputs','Headings','Backgrounds','Navigation','Hero','CTA','Footer','Grid & Layout','Patterns','Alignment','Sound'];
const expected = {
  Typography: { display: 'font-display', body: 'font-body', mono: 'font-mono', 'heading wt': 'heading-weight', 'heading trk': 'heading-tracking', 'base size': 'size-base' },
  Spacing: { 'page margin':'page-margin','section pad':'section-padding-y','card pad':'card-padding','grid gap':'gutter','stack gap':'stack-gap' },
  Radius: { medium:'radius-md',button:'radius-button',card:'radius-card',input:'radius-input' },
  'Borders & Shadows': { 'border w':'border-thin',style:'border-style','card border':'card-border-style','card shadow':'card-shadow','btn shadow':'shadow-button',glow:'shadow-glow' },
  Motion: { Duration:'duration-normal',Bounce:'ease-spring',Stiffness:'duration-normal',Damping:'ease-spring',Mass:'duration-normal',fast:'duration-fast',normal:'duration-normal',slow:'duration-slow','hover scale':'hover-scale','press scale':'press-scale','hover lift':'hover-lift',stagger:'stagger-interval' },
  Buttons: { weight:'button-font-weight',transform:'button-text-transform',hover:'button-hover-effect','active scale':'button-active-scale','min-width':'button-min-width','letter sp':'button-letter-spacing','icon gap':'button-icon-gap',shadow:'shadow-button' },
  Cards: { hover:'card-hover-effect',border:'card-border-style',shadow:'card-shadow',padding:'card-padding','title size':'card-title-size','title wt':'card-title-weight','desc size':'card-description-size',aspect:'card-aspect-ratio',outline:'card-outline' },
  Inputs: { height:'input-height','focus ring':'input-focus-ring-width' },
  Headings: { 'h1 size':'heading-h1-size','h2 size':'heading-h2-size','h3 size':'heading-h3-size','h4 size':'heading-h4-size','h1 weight':'heading-h1-weight','h1 tracking':'heading-h1-tracking','h1 leading':'heading-h1-leading' },
  Backgrounds: { pattern:'bg-pattern','pattern α':'bg-pattern-opacity',noise:'bg-noise',gradient:'bg-gradient-type','grad angle':'bg-gradient-angle' },
  Navigation: { height:'navbar-height',blur:'navbar-backdrop-blur',border:'navbar-border',padding:'navbar-padding-x','item gap':'navbar-item-gap' },
  Hero: { 'min-height':'hero-min-height','padding Y':'hero-padding-y','content-max':'hero-content-max',layout:'hero-layout','title size':'hero-title-size','desc size':'hero-description-size' },
  CTA: { 'padding Y':'cta-padding-y','max-width':'cta-max-width',layout:'cta-layout','title size':'cta-title-size' },
  Footer: { 'padding Y':'footer-padding-y',columns:'footer-columns',gap:'footer-column-gap' },
  'Grid & Layout': { 'content-max':'content-max','rail-gap':'rail-gap','grid-cell':'grid-cell','cross-stroke':'cross-stroke','navbar-h':'navbar-height','bento-gap':'bento-gap','grid lines':'grid-show-lines',dots:'grid-show-dots','cell borders':'grid-cell-border','cell bg':'grid-cell-background' },
  Alignment: {content:'align-content-align',hero:'align-hero-align',navbar:'align-navbar-align','rail visible':'align-rail-visible'},
};
function cssSnapshot(page) { return page.evaluate(() => Array.from(document.querySelector('style[data-sigil-tokens]').sheet.cssRules, rule => Object.fromEntries(Array.from(rule.style, key => [key, rule.style.getPropertyValue(key)])))); }
async function settle(page) { await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(() => requestAnimationFrame(resolve))))); }

try {
 for (const theme of ['dark','light']) {
  const page = await browser.newPage({ viewport: {width:1440,height:1000}, reducedMotion:'reduce' });
  page.on('pageerror', error => failures.push(`${theme}: ${error}`));
  await page.addInitScript(theme => {
    localStorage.setItem('sigil-theme', theme);
    Object.defineProperty(navigator,'clipboard',{value:{writeText:async value=>{if(window.__denyCopy) throw Error('denied'); window.__studioExport=value;}}});
  },theme);
  await page.goto(`${base}/docs/components/chart-container`,{waitUntil:'networkidle'});
  assert.equal(await page.locator('html').getAttribute('data-theme'),theme);
  await page.getByRole('button',{name:'Studio',exact:true}).click();
  const sidebar=page.locator('#sigil-studio-sidebar');
  for(const name of sectionNames) {
    console.log(`Checking ${theme}/${name}`);
    const section=sidebar.locator(`[data-studio-section="${name}"]`);
    const toggle=section.getByRole('button',{name,exact:true});
    if(await toggle.getAttribute('aria-expanded') !== 'true') await toggle.click();
    if(name==='Motion') for(const title of ['Durations','Interaction']) await section.getByRole('button',{name:title,exact:true}).click();
    const controls=section.locator('[role="slider"],input[type="range"],[role="switch"],[role="combobox"],[role="radiogroup"],input[type="color"]');
    for(let index=0;index<await controls.count();index++) {
      const control=controls.nth(index);
      const meta=await control.evaluate(el=>({role:el.getAttribute('role')||el.type,label:el.closest('[data-studio-row]')?.dataset.studioRow, name:el.getAttribute('aria-label')}));
      const id=`${theme}/${name}/${meta.label??meta.name}/${meta.role}`;
      let optionNames = [];
      try {
        await control.scrollIntoViewIfNeeded();
        const before=await cssSnapshot(page);
        if(meta.role==='slider' || meta.role==='range') {
          const direction=await control.evaluate(el=>Number(el.getAttribute('aria-valuenow')??el.value)>=Number(el.getAttribute('aria-valuemax')??el.max)?'ArrowLeft':'ArrowRight');
          await control.focus();await page.keyboard.press(direction);
        } else if(meta.role==='switch') await control.click();
        else if(meta.role==='combobox') {
          await control.click();
          optionNames = await page.getByRole('option').allTextContents();
          // Radix places the selected state on the option itself.
          const option=page.locator('[role="option"][data-state="unchecked"]').first();
          await option.click();
        } else if(meta.role==='radiogroup') await control.locator('[role="radio"][aria-checked="false"]').first().click();
        else if(meta.role==='color') {
          await control.evaluate(el=>{
            Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(el,'#d06532');
            el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));
          });
        }
        await settle(page);
        assert.equal(await page.locator('html').getAttribute('data-sigil-token-status'),'ok');
        const after=await cssSnapshot(page);
        if(name!=='Sound') {
          assert.notDeepEqual(after,before,'control must change compiled CSS');
          const target=expected[name]?.[meta.label];
          if(target && meta.role!=='color') assert.notEqual(after[0][`--s-${target}`],before[0][`--s-${target}`],`must update --s-${target}`);
        }
        if(name==='Colors') {
          const key=`--s-${meta.label}`;
          const active=theme==='dark'?1:0, inactive=theme==='dark'?0:1;
          // Some accent/status colors intentionally share a single value.
          if(before[1][key]) assert.equal(after[inactive][key],before[inactive][key],'editing one mode preserves the other palette');
          assert.notEqual(after[active][key]??after[0][key],before[active][key]??before[0][key]);
        }
        results.push(id);
        if(meta.role==='combobox') for(const optionName of optionNames) {
          await control.click();
          await page.getByRole('option',{name:optionName.trim(),exact:true}).click();
          await settle(page);
          assert.equal(await page.locator('html').getAttribute('data-sigil-token-status'),'ok');
          results.push(`${id}/${optionName.trim()}`);
        }
        if(name==='Typography' && meta.label==='display') {
          const css=await cssSnapshot(page);
          assert.equal(css[0]['--s-font-display'],css[0]['--s-heading-family']);
          const family=await page.locator('h1').first().evaluate(el=>getComputedStyle(el).fontFamily);
          assert.ok(family.includes(css[0]['--s-font-display'].split(',')[0].replaceAll('"','')));
        }
        if(name==='Grid & Layout' && meta.label==='content-max') {
          const css=await cssSnapshot(page);
          assert.equal(css[0]['--s-content-max'],css[0]['--s-content-max-wide']);
        }
      } catch(error) { failures.push(`${id}: ${error.message}`); console.log(failures.at(-1)); if(await page.getByRole('listbox').count()) await page.keyboard.press('Escape'); }
    }
    if(name==='Motion') {
      for(const easing of ['ease-out-expo','ease-in-out','spring','bounce','ease-out','ease-in','snappy','linear']) {
        await section.getByRole('button',{name:easing,exact:true}).click();await settle(page);
        assert.equal(await section.getByRole('button',{name:easing,exact:true}).getAttribute('aria-pressed'),'true');
        results.push(`${theme}/Motion/easing/${easing}`);
      }
      await section.getByRole('button',{name:'Physics',exact:true}).click();
      for(const label of ['Stiffness','Damping','Mass']) {
        const control=section.getByRole('slider',{name:label,exact:true});
        await control.focus();await page.keyboard.press('ArrowRight');await settle(page);
        assert.equal(await page.locator('html').getAttribute('data-sigil-token-status'),'ok');
        const bad=await section.locator('svg path').evaluateAll(paths=>paths.some(p=>/NaN|Infinity/.test(p.getAttribute('d')??'')));
        assert.equal(bad,false);
        results.push(`${theme}/Motion/physics/${label}`);
      }
    }
    if(name==='Patterns') {
      for(const chip of await section.locator('button:not([aria-expanded])').all()) {
        await chip.click();await settle(page);
        assert.equal(await page.locator('html').getAttribute('data-sigil-token-status'),'ok');
        results.push(`${theme}/Patterns/${await chip.innerText()}`);
      }
    }
    await sidebar.getByRole('button',{name:'Reset',exact:true}).click();await settle(page);
    await toggle.click();
    assert.equal(await section.locator('[role="slider"],input,[role="combobox"]').count(),0,'collapsed controls are unmounted');
  }
  // Saving must include a final edit even before deferred React bookkeeping.
  const radius=sidebar.locator('[data-studio-section="Radius"]');
  await radius.getByRole('button',{name:'Radius',exact:true}).click();
  await sidebar.getByRole('button',{name:'Save preset',exact:true}).click();
  await sidebar.getByPlaceholder('Preset name').fill('studio-regression');
  await radius.locator('[data-studio-row="button"] [role="slider"]').evaluate(el=>{
    el.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));
    document.querySelector('#sigil-studio-sidebar button[title="Save preset"]').click();
  });
  await settle(page);
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('sigil-custom-presets')).find(p=>p.name==='studio-regression'));
  assert.equal(saved.tokens.radius.button,'1px');
  await sidebar.getByRole('button',{name:'Export CSS',exact:true}).click();
  await page.waitForFunction(()=>!!window.__studioExport);
  assert.match(await page.evaluate(()=>window.__studioExport),/--s-radius-button:\s*0\.0625rem/);
  await page.evaluate(()=>window.__denyCopy=true);
  await sidebar.getByRole('button',{name:'Export CSS',exact:true}).click();
  await page.getByRole('status').filter({hasText:'Could not copy CSS'}).waitFor();
  await page.reload({waitUntil:'networkidle'});
  await page.getByRole('button',{name:'Studio',exact:true}).click();
  await sidebar.getByRole('button',{name:'studio-regression',exact:true}).click();await settle(page);
  assert.equal((await cssSnapshot(page))[0]['--s-radius-button'].trim(),'0.0625rem');
  await sidebar.getByRole('button',{name:'Delete studio-regression',exact:true}).click();await settle(page);
  assert.equal(await sidebar.getByRole('button',{name:'studio-regression',exact:true}).count(),0);
  results.push(`${theme}/save/reset/export/reload/delete`);
  await page.close();
 }
} finally {await browser.close();}
await mkdir('output/product-polish/studio-audit',{recursive:true});
await writeFile('output/product-polish/studio-audit/controls.json',JSON.stringify({checks:results.length,results,failures},null,2));
console.log(JSON.stringify({checks:results.length,failures},null,2));
assert.deepEqual(failures,[]);
