'use strict';
// locations.js is generated from the canonical JSON manifest for direct file:// use.
const places = window.NORWAY_LOCATIONS;
const $ = id => document.getElementById(id);
const grid = $('grid'), search = $('search'), presentation = $('presentation');
const slides = places.flatMap((place, locationIndex) => place.images.map((photo, photoIndex) => ({place, photo, locationIndex, photoIndex})));
let slide = 0, playing = false, timer, idleTimer, previousFocus, renderVersion = 0;
let front = 0, keepPresentationOpen = false;
const frames = [$('stage-image'), $('stage-image-back')];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function el(tag, className, text) { const node = document.createElement(tag); if(className)node.className=className;if(text!==undefined)node.textContent=text;return node; }
function link(text, url) { const a=el('a','',text);a.href=url;a.target='_blank';a.rel='noopener noreferrer';return a; }
function credit(photo) { return `${photo.photographer} · ${photo.license}`; }
const cards = places.map((p, i) => {
  const card=el('article','card');card.dataset.name=`${p.name} ${p.region}`.toLocaleLowerCase();
  const box=el('div','photos'), body=el('div','body');
  if(p.images.length) {
    const photo=p.images[0], button=el('button','photo-button');button.type='button';button.setAttribute('aria-label',`View ${p.name}, ${p.images.length} photograph${p.images.length===1?'':'s'}`);
    const img=el('img');img.src=photo.preview||photo.src;img.alt=photo.alt;img.width=photo.width;img.height=photo.height;img.loading=i<2?'eager':'lazy';img.decoding='async';
    img.addEventListener('error',()=>{button.replaceChildren(el('span','photo-error','Photograph unavailable — see source below'));});
    button.append(img,el('span','photo-count',`${String(i+1).padStart(2,'0')} / ${p.images.length>1?p.images.length+' photographs':'Norway'}`));
    button.onclick=()=>openPresentation(slides.findIndex(s=>s.locationIndex===i));box.append(button);
  } else {box.append(el('p','photo-error',p.imageLimitation||'See the official photography source below.'));}
  body.append(el('span','index',p.region),el('h2','',p.name),el('p','description',p.description));
  const links=el('div','links');links.append(link('Official guide ↗',p.official),link('Regional guide ↗',p.regional));body.append(links);
  if(p.images.length) {const details=el('details','credits');details.append(el('summary','',`Photo credits · ${p.images.length}`));for(const photo of p.images){const line=el('p');line.append(link(credit(photo),photo.sourceUrl));if(photo.licenseUrl)line.append(' · ',link('License',photo.licenseUrl));details.append(line);}if(p.selectionNote)details.append(el('p','',p.selectionNote));body.append(details);}
  card.append(box,body);grid.append(card);return card;
});
search.addEventListener('input',()=>{const term=search.value.trim().toLocaleLowerCase();let n=0;cards.forEach(c=>{c.hidden=!c.dataset.name.includes(term);if(!c.hidden)n++;});$('count').textContent=`${n} / ${places.length} places`;$('no-results').hidden=n>0;});
function wakeControls(){presentation.classList.remove('idle');clearTimeout(idleTimer);idleTimer=setTimeout(()=>{if(!presentation.querySelector('.nav:focus-within'))presentation.classList.add('idle');},3500);}
function resetTimer(){clearTimeout(timer);if(playing&&!presentation.hidden&&!document.hidden)timer=setTimeout(()=>navigate(1),Number($('duration').value)*1000);}
function setPlaying(value){playing=value;$('play').textContent=value?'Ⅱ Pause':'▶ Play';$('play').setAttribute('aria-pressed',String(value));resetTimer();}
async function renderSlide(){
  if(!slides.length)return;
  const version=++renderVersion,s=slides[slide];
  $('stage-title').textContent=s.place.name;$('stage-description').textContent=s.place.description;
  $('stage-counter').textContent=`${String(slide+1).padStart(2,'0')} / ${slides.length} · ${s.place.region}`;
  $('stage-credit').textContent=credit(s.photo);$('stage-credit').href=s.photo.sourceUrl;
  $('stage-official').href=s.place.official;$('stage-regional').href=s.place.regional;
  $('stage-empty').hidden=true;
  const img=frames[1-front];img.classList.remove('visible');img.alt=s.photo.alt;img.src=s.photo.src;
  try {await img.decode();if(version!==renderVersion||presentation.hidden)return;frames[front].classList.remove('visible');img.classList.add('visible');front=1-front;}
  catch {if(version!==renderVersion)return;frames.forEach(f=>f.classList.remove('visible'));$('stage-empty').textContent=`The photograph for ${s.place.name} could not be loaded. Use the source link or continue to the next slide.`;$('stage-empty').hidden=false;}
  // A single full-size image is preloaded; all gallery previews outside the viewport are lazy.
  const preload=new Image();preload.src=slides[(slide+1)%slides.length].photo.src;
  resetTimer();
}
function navigate(delta){slide=(slide+delta+slides.length)%slides.length;renderSlide();wakeControls();}
function openPresentation(index=0){
  if(!slides.length)return;previousFocus=document.activeElement;slide=Math.max(0,index);presentation.hidden=false;
  $('page').inert=true;document.body.classList.add('presenting');presentation.focus();renderSlide();wakeControls();
  if(presentation.requestFullscreen)presentation.requestFullscreen().catch(()=>{$('fullscreen-status').textContent='Fullscreen unavailable. Presentation remains open; use your browser fullscreen command.';});
}
async function exitPresentation(){++renderVersion;setPlaying(false);clearTimeout(idleTimer);presentation.hidden=true;document.body.classList.remove('presenting');$('page').inert=false;if(document.fullscreenElement)await document.exitFullscreen().catch(()=>{});previousFocus?.focus();}
$('present').onclick=()=>openPresentation();$('prev').onclick=()=>navigate(-1);$('next').onclick=()=>navigate(1);$('exit').onclick=exitPresentation;
$('play').onclick=()=>setPlaying(!playing);$('duration').onchange=resetTimer;
$('fullscreen').onclick=()=>{if(document.fullscreenElement){keepPresentationOpen=true;document.exitFullscreen().catch(()=>{keepPresentationOpen=false;});}else presentation.requestFullscreen?.().catch(()=>{$('fullscreen-status').textContent='Fullscreen is unavailable in this browser.';});};
presentation.addEventListener('pointermove',wakeControls);presentation.addEventListener('pointerdown',wakeControls);presentation.addEventListener('focusin',wakeControls);
document.addEventListener('visibilitychange',resetTimer);
document.addEventListener('fullscreenchange',()=>{if(!document.fullscreenElement&&!presentation.hidden){if(keepPresentationOpen){keepPresentationOpen=false;wakeControls();}else exitPresentation();}});
document.addEventListener('keydown',e=>{
  if(presentation.hidden)return;
  wakeControls();
  if(e.key==='Escape'){e.preventDefault();exitPresentation();return;}
  if(e.key==='Tab'){const focusable=[...presentation.querySelectorAll('button,a[href],select')].filter(x=>!x.hidden);const first=focusable[0],last=focusable.at(-1);if(e.shiftKey&&(document.activeElement===first||document.activeElement===presentation)){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}return;}
  if(e.target.tagName==='SELECT')return;
  if(e.key==='ArrowRight'){e.preventDefault();navigate(1);}else if(e.key==='ArrowLeft'){e.preventDefault();navigate(-1);}else if(e.code==='Space'){e.preventDefault();setPlaying(!playing);}else if(e.key.toLowerCase()==='f'){$('fullscreen').click();}
});
$('share').onclick=async()=>{const status=$('share-status');if(location.protocol==='file:'||['localhost','127.0.0.1'].includes(location.hostname)){status.textContent='To copy this private presentation, copy the entire Norway-Road-Trip folder, including assets.';return;}try{if(navigator.share)await navigator.share({title:document.title,url:location.href});else{await navigator.clipboard.writeText(location.href);status.textContent='Link copied.';}}catch(e){if(e.name!=='AbortError')status.textContent='Could not share. Copy the presentation folder instead.';}};
if(reducedMotion)document.documentElement.classList.add('reduced-motion');
$('photo-total').textContent=`${slides.length} curated photographs · ${places.length} places · Ålesund → Stavanger`;
