const data = window.SITE_CONTENT;
const newsItems = data.news;
const articleSlug = n => n.slug || n.title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const articleUrl = n => 'article.html?slug=' + encodeURIComponent(articleSlug(n));
const $ = id => document.getElementById(id);
const t = (s,v) => window.t ? window.t(s,v) : s;
const params = new URLSearchParams(location.search);
if ($('news-list')) {
  const size = Number.isInteger(data.newsPageSize) && data.newsPageSize > 0 ? data.newsPageSize : 2;
  const total = Math.max(1, Math.ceil(newsItems.length / size));
  const requested = Number(params.get('page'));
  const current = Math.max(1, Math.min(total, Number.isInteger(requested) ? requested : 1));
  newsItems.slice((current - 1) * size, current * size).forEach(n => {
    const card = document.createElement('article'); card.className = 'news-card';
    const photoLink = document.createElement('a'); photoLink.href = articleUrl(n);photoLink.setAttribute('aria-label',n.title);
    const img = document.createElement('img');img.src=n.image;img.alt='';img.loading='lazy';photoLink.append(img);
    const tag=document.createElement('p');tag.className='eyebrow';tag.textContent=n.tag;
    const h=document.createElement('h3');const a=document.createElement('a');a.href=articleUrl(n);a.textContent=n.title+' ↗';h.append(a);
    const meta=document.createElement('p');meta.className='meta';meta.textContent=n.meta;card.append(photoLink,tag,h,meta);$('news-list').append(card);
  });
  if(!newsItems.length) $('news-list').textContent='News will be published here soon.';
  for (const [label,destination,isCounter] of [[t('← Previous'),current>1?current-1:null,false],[t('Page {a} of {b}',{a:current,b:total}),null,true],[t('Next →'),current<total?current+1:null,false]]) {
    const el=document.createElement(destination?'a':'span');el.textContent=label;
    if(destination)el.href='news.html?page='+destination;else if(isCounter)el.setAttribute('aria-current','page');else el.setAttribute('aria-disabled','true');
    $('pagination').append(el);
  }
  document.title=`News — Page ${current} | Go Go Education`;
}
if ($('article-content')) {
  const article=newsItems.find(n=>articleSlug(n)===params.get('slug'));
  const area=$('article-content');const h=document.createElement('h1');h.textContent=article?article.title:'Article not found';area.append(h);
  if(article){document.title=article.title+' | Go Go Education';document.querySelector('meta[name="description"]').content=article.body.slice(0,160);const meta=document.createElement('p');meta.className='meta';meta.textContent=article.tag+' · '+article.meta;area.append(meta);if(window.CURRENT_LANG&&window.CURRENT_LANG!=='en'){const n=document.createElement('p');n.className='meta lang-note';n.textContent=t('This article is currently available in English only.');area.append(n);}article.body.split(/\n\s*\n/).forEach(text=>{const p=document.createElement('p');p.textContent=text;area.append(p);});}
  else {const p=document.createElement('p');p.textContent='This article is unavailable. Browse the news list for current stories.';area.append(p);}
  const back=document.createElement('a');back.href='news.html';back.className='article-back';back.textContent='← Back to News';area.append(back);
}
document.querySelectorAll('[data-brand]').forEach(el => el.textContent = data.brand);
if($('hero-title')) $('hero-title').innerHTML = data.hero.title;
if($('hero-description')) $('hero-description').innerHTML = data.hero.description;
if($('hero-image')) $('hero-image').src = data.hero.image;
if($('why-image')) $('why-image').src = data.whyImage;
if($('about-image') && data.aboutImage) $('about-image').src = data.aboutImage;
if($('contact-note')) $('contact-note').textContent = data.contact.note;
$('year').textContent = new Date().getFullYear();
const dialog = $('detail-dialog');
function showDetails(label, title, body, cta = true) {
  $('dialog-label').textContent = label; $('dialog-title').textContent = title;
  $('dialog-body').replaceChildren(...String(body).split(/\n\s*\n/).filter(Boolean).map(t=>{const p=document.createElement('p');p.textContent=t;return p;})); $('dialog-cta').hidden = !cta; dialog.showModal();
}
document.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
$('dialog-cta').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', e => { if(e.target === dialog) {const r=dialog.getBoundingClientRect(); if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
if($('program-list')) data.programs.forEach(p => {
  const card = document.createElement('article'); card.className = 'program-card';
  card.innerHTML = `<img class="program-photo" alt="" loading="lazy"><div class="card-top"><span class="program-symbol"></span><span class="number"></span></div><p class="eyebrow"></p><h3></h3><span class="visa-badge"></span><p class="description"></p><p class="meta"></p><button class="text-link">Explore program <span>↗</span></button>`;
  const photo=card.querySelector('.program-photo');if(p.image)photo.src=p.image;else photo.remove();
  const badge=card.querySelector('.visa-badge');if(p.visa)badge.textContent=p.visa;else badge.remove();
  card.querySelector('.program-symbol').textContent=p.symbol; card.querySelector('.number').textContent=p.number;
  card.querySelector('.eyebrow').textContent=p.tag;card.querySelector('h3').textContent=p.title;card.querySelector('.description').textContent=p.description;card.querySelector('.meta').textContent=p.meta;
  card.querySelector('button').addEventListener('click',()=>showDetails(p.visa?`${p.tag} · ${p.visa}`:p.tag,p.title,p.details));$('program-list').append(card);
});
if($('benefit-list')) data.benefits.forEach((b,i)=>{const el=document.createElement('div');el.className='benefit';const n=document.createElement('span');n.textContent=`0${i+1}`;const inner=document.createElement('div');const h=document.createElement('h3');h.textContent=b.title;const p=document.createElement('p');p.textContent=b.text;inner.append(h,p);el.append(n,inner);$('benefit-list').append(el);});
let story=0;
function renderStory(){const s=data.stories[story];$('story-quote').textContent=`“${s.quote}”`;$('story-name').textContent=`${s.name} · ${s.detail}`;$('story-counter').textContent=`${String(story+1).padStart(2,'0')} / ${String(data.stories.length).padStart(2,'0')}`;}
$('story-prev')?.addEventListener('click',()=>{story=(story-1+data.stories.length)%data.stories.length;renderStory();});$('story-next')?.addEventListener('click',()=>{story=(story+1)%data.stories.length;renderStory();});if($('story-quote')) renderStory();
if($('office-slider') && Array.isArray(data.office) && data.office.length){
  const photos=data.office;let slide=0,timer;
  const track=$('office-track'),dots=$('office-dots'),grid=$('office-grid'),slider=$('office-slider');
  photos.forEach((o,i)=>{
    const fig=document.createElement('figure');fig.className='office-slide';const img=document.createElement('img');img.src=o.image;img.alt=o.caption;img.loading=i?'lazy':'eager';fig.append(img);track.append(fig);
    const dot=document.createElement('button');dot.setAttribute('aria-label',`Show photo ${i+1}`);dot.addEventListener('click',()=>go(i));dots.append(dot);
    const li=document.createElement('li');const b=document.createElement('button');b.setAttribute('aria-label',o.caption);const t=document.createElement('img');t.src=o.image;t.alt='';t.loading='lazy';b.append(t);b.addEventListener('click',()=>{go(i);slider.scrollIntoView({behavior:'smooth',block:'nearest'});});li.append(b);grid.append(li);
  });
  function go(i){slide=(i+photos.length)%photos.length;track.style.transform=`translateX(-${slide*100}%)`;$('office-caption').textContent=photos[slide].caption;$('office-counter').textContent=`${String(slide+1).padStart(2,'0')} / ${String(photos.length).padStart(2,'0')}`;dots.querySelectorAll('button').forEach((d,k)=>d.setAttribute('aria-current',k===slide?'true':'false'));grid.querySelectorAll('li').forEach((l,k)=>l.classList.toggle('active',k===slide));restart();}
  function restart(){clearInterval(timer);timer=setInterval(()=>go(slide+1),5000);}
  $('office-prev').addEventListener('click',()=>go(slide-1));$('office-next').addEventListener('click',()=>go(slide+1));
  slider.addEventListener('mouseenter',()=>clearInterval(timer));slider.addEventListener('mouseleave',restart);
  slider.addEventListener('keydown',e=>{if(e.key==='ArrowLeft')go(slide-1);if(e.key==='ArrowRight')go(slide+1);});
  let startX=null;slider.addEventListener('touchstart',e=>{startX=e.touches[0].clientX;},{passive:true});slider.addEventListener('touchend',e=>{if(startX===null)return;const dx=e.changedTouches[0].clientX-startX;if(Math.abs(dx)>40)go(dx<0?slide+1:slide-1);startX=null;});
  go(0);
}
if($('network-list') && Array.isArray(data.network)) data.network.forEach((d,i)=>{
  const li=document.createElement('li');li.className='network-card'+(d.featured?' featured':'');
  const img=document.createElement('img');img.src=d.image;img.alt='';img.loading='lazy';
  const body=document.createElement('div');body.className='network-body';
  const n=document.createElement('span');n.className='network-index';n.textContent=String(i+1).padStart(2,'0');
  const h=document.createElement('h3');h.textContent=d.name;const p=document.createElement('p');p.textContent=d.note||'';
  body.append(n,h,p);if(d.featured){const b=document.createElement('span');b.className='network-badge';b.textContent='Primary destination';li.append(b);}
  li.append(img,body);$('network-list').append(li);
});
// News list and detail rendering is below.
const menu=document.querySelector('.menu-toggle');const nav=$('navigation');function closeMenu(){menu.setAttribute('aria-expanded','false');nav.classList.remove('open');}menu.addEventListener('click',()=>{const expanded=menu.getAttribute('aria-expanded')==='true';menu.setAttribute('aria-expanded',String(!expanded));nav.classList.toggle('open',!expanded);});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
$('consultation')?.addEventListener('click',()=>{if(data.contact.email){window.location.href=`mailto:${encodeURIComponent(data.contact.email)}?subject=${encodeURIComponent('Education consultation enquiry')}`;}else{showDetails('CONTACT SETUP PENDING','Let’s plan your next chapter','This preview is ready for your agency’s contact details. Add your real email address in content.js to enable enquiries. No message has been sent.',false);}});

$('search-open').addEventListener('click',()=>{showDetails(t('FIND YOUR PATHWAY'),t('Search programs'),'',false);const input=document.createElement('input');input.type='search';input.placeholder=t('Search programs…');input.setAttribute('aria-label',t('Search programs'));input.className='search-input';const results=document.createElement('div');function render(){results.replaceChildren();const matches=data.programs.filter(p=>(p.title+' '+p.description).toLowerCase().includes(input.value.toLowerCase()));matches.forEach(p=>{const b=document.createElement('button');b.className='search-result';b.textContent=p.title+' ↗';b.onclick=()=>showDetails(p.tag,p.title,p.details);results.append(b);});if(!matches.length)results.textContent=t('No programs found. Try Korean, bachelor or visa.');}input.addEventListener('input',render);$('dialog-body').append(input,results);render();input.focus();});

// ---- Dark mode toggle ----
const themeBtn=$('theme-toggle');
function applyTheme(t){document.documentElement.setAttribute('data-theme',t);try{localStorage.setItem('theme',t);}catch(e){}if(themeBtn)themeBtn.setAttribute('aria-label',window.t?window.t(t==='dark'?'Switch to light mode':'Switch to dark mode'):(t==='dark'?'Switch to light mode':'Switch to dark mode'));}
applyTheme(document.documentElement.getAttribute('data-theme')||'light');
themeBtn?.addEventListener('click',()=>applyTheme(document.documentElement.getAttribute('data-theme')==='dark'?'light':'dark'));

// ---- Scroll reveal (fade + slide up, staggered per group) ----
const revealGroups=['.hero-copy','.section-heading','.network-intro>*','.about-media','.about-copy','.vmv-card','.values-grid>li','.leader','.office-layout','.network-card','.why-photo','.why-copy','.program-card','.news-card','.story-layout','.contact>*','.document-page>*','#article-content>*','.footer-main>*'];
if(!matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window){
  revealGroups.forEach(sel=>{const byParent=new Map();document.querySelectorAll(sel).forEach(el=>{if(el.hasAttribute('data-reveal'))return;const list=byParent.get(el.parentElement)||[];list.push(el);byParent.set(el.parentElement,list);});
    byParent.forEach(list=>list.forEach((el,i)=>{el.setAttribute('data-reveal',el.matches('.program-card,.news-card,.values-grid>li,.network-card')?'scale':'');el.style.setProperty('--d',`${Math.min(i,6)*0.12}s`);}));});
  const counters=el=>el.querySelectorAll('.about-stats strong').forEach(n=>{const m=n.textContent.match(/^(\d+)(\+.*)$/);if(!m)return;const target=+m[1],suffix=m[2],start=Math.max(0,target-Math.min(target,60)),t0=performance.now();const tick=now=>{const k=Math.min(1,(now-t0)/1200),e=1-Math.pow(1-k,3);n.textContent=Math.round(start+(target-start)*e)+suffix;if(k<1)requestAnimationFrame(tick);};requestAnimationFrame(tick);});
  const io=new IntersectionObserver(entries=>{entries.forEach(en=>{if(!en.isIntersecting)return;const el=en.target;el.classList.add('in');counters(el);io.unobserve(el);
    const delay=parseFloat(getComputedStyle(el).transitionDelay)||0;setTimeout(()=>{el.removeAttribute('data-reveal');el.classList.remove('in');el.style.removeProperty('--d');},(delay+1)*1000);});},{threshold:0.12,rootMargin:'0px 0px -6% 0px'});
  document.querySelectorAll('[data-reveal]').forEach(el=>io.observe(el));
}
