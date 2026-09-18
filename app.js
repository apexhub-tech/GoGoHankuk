const data = window.SITE_CONTENT;
const newsItems = data.news;
const articleSlug = n => n.slug || n.title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const articleUrl = n => 'article.html?slug=' + encodeURIComponent(articleSlug(n));
const $ = id => document.getElementById(id);
const t = (s,v) => window.t ? window.t(s,v) : s;
const params = new URLSearchParams(location.search);
<<<<<<< HEAD
const IMPACT_ICONS = {
  students: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 2 8l10 5 10-5-10-5Z"/><path d="M6 10.5V16c0 1.4 2.7 3 6 3s6-1.6 6-3v-5.5"/><path d="M22 8v6"/></svg>',
  universities: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 21V9l8-5 8 5v12"/><path d="M9 21v-6h6v6"/><path d="M4 21h16"/></svg>',
  established: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/><path d="m8.5 14 2 2 4-4"/></svg>',
};
if ($('impact-stats') && Array.isArray(data.impact)) {
  data.impact.forEach(s => {
    const li = document.createElement('li');
    li.innerHTML = `<span class="impact-icon" aria-hidden="true">${IMPACT_ICONS[s.icon] || ''}</span><strong>${s.value}${s.suffix}</strong><span>${s.label}</span>`;
    $('impact-stats').append(li);
  });
}
=======
>>>>>>> b172e33699dfa4c357cbfc439230308bd1d08ec3
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
<<<<<<< HEAD
  $('dialog-body').replaceChildren(...String(body).split(/\n\s*\n/).filter(Boolean).map(t=>{const p=document.createElement('p');p.textContent=t;return p;})); $('dialog-cta').hidden = !cta; $('dialog-cta').textContent='Talk about your next step ↗'; $('dialog-cta').onclick=null; dialog.showModal();
}
// ---- Book a consultation (Figma: Consultation appointment — form) ----
let appointmentDialog;
function buildAppointmentDialog(){
  if(appointmentDialog) return appointmentDialog;
  const d = document.createElement('dialog');
  d.id='appointment-dialog'; d.className='appointment-dialog'; d.setAttribute('aria-labelledby','appointment-title');
  d.innerHTML = `<button type="button" class="close-dialog" aria-label="Close appointment form">×</button>
    <h2 id="appointment-title">Book a consultation</h2>
    <p class="appointment-intro">Tell us about yourself and choose a time that works for you.</p>
    <form id="appointment-form">
      <label>Full name<input type="text" name="name" placeholder="Enter your full name" required></label>
      <label>Phone number<input type="tel" name="phone" placeholder="Enter your phone number" required></label>
      <label>Consultation topic<select name="topic"><option>Studying in Korea</option><option>Korean language classes</option><option>Partner universities</option><option>Visa & documents</option><option>Other</option></select></label>
      <label>Meeting type<select name="meeting"><option>Online consultation</option><option>In-person at our Yangon office</option><option>Phone call</option></select></label>
      <div class="appointment-row">
        <label>Preferred date<input type="date" name="date"></label>
        <label>Preferred time (MMT)<input type="time" name="time"></label>
      </div>
      <label>What would you like to discuss?<textarea name="message" placeholder="Tell us about your questions or goals" rows="3"></textarea></label>
      <button type="submit" class="button">Request Appointment</button>
      <p class="appointment-note">Times are in Myanmar Time (UTC+6:30). We’ll contact you to confirm your appointment.</p>
    </form>`;
  document.body.append(d);
  d.querySelector('.close-dialog').addEventListener('click', () => d.close());
  d.addEventListener('click', e => { if(e.target === d) {const r=d.getBoundingClientRect(); if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}});
  d.querySelector('#appointment-form').addEventListener('submit', e => {
    e.preventDefault();
    const f = new FormData(e.target);
    const lines = [`Name: ${f.get('name')}`,`Phone: ${f.get('phone')}`,`Topic: ${f.get('topic')}`,`Meeting type: ${f.get('meeting')}`,`Preferred date: ${f.get('date')||'—'}`,`Preferred time (MMT): ${f.get('time')||'—'}`,`Message: ${f.get('message')||'—'}`].join('\n');
    if(data.contact.email){ window.location.href = `mailto:${encodeURIComponent(data.contact.email)}?subject=${encodeURIComponent('Consultation appointment request')}&body=${encodeURIComponent(lines)}`; }
    d.close(); e.target.reset();
    showDetails('REQUEST SENT','Thanks — we’ll be in touch','Your consultation request has been prepared in your email app. Send it and our advisors will contact you to confirm your appointment.',false);
  });
  appointmentDialog = d;
  return d;
}
function openAppointment(){ buildAppointmentDialog().showModal(); }
document.addEventListener('click', e => { const trigger = e.target.closest('.js-appointment'); if(trigger){ e.preventDefault(); openAppointment(); } });
=======
  $('dialog-body').replaceChildren(...String(body).split(/\n\s*\n/).filter(Boolean).map(t=>{const p=document.createElement('p');p.textContent=t;return p;})); $('dialog-cta').hidden = !cta; dialog.showModal();
}
>>>>>>> b172e33699dfa4c357cbfc439230308bd1d08ec3
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
<<<<<<< HEAD
if($('team-carousel')){const step=()=>$('team-carousel').firstElementChild.getBoundingClientRect().width+20;$('team-prev')?.addEventListener('click',()=>$('team-carousel').scrollBy({left:-step(),behavior:'smooth'}));$('team-next')?.addEventListener('click',()=>$('team-carousel').scrollBy({left:step(),behavior:'smooth'}));}
=======
>>>>>>> b172e33699dfa4c357cbfc439230308bd1d08ec3
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
<<<<<<< HEAD
function showUniversity(u){
  $('dialog-label').textContent='';
  $('dialog-title').textContent=u.name;
  $('dialog-body').innerHTML=`<p>Explore this university and ask us about current study options.</p>
    <p class="uni-field-label">Location</p><div class="uni-field">${u.location||'Location details coming soon'}</div>
    <p class="uni-field-label">Available programs</p><div class="uni-field">${u.programs||'Programs to be confirmed'}</div>
    <p class="uni-field-label">Official website</p><div class="uni-field">${u.website?`<a href="${u.website}" target="_blank" rel="noopener">${u.website.replace(/^https?:\/\//,'')}</a>`:'Link coming soon'}</div>`;
  $('dialog-cta').hidden=false;$('dialog-cta').textContent='Get Appointment';
  $('dialog-cta').onclick=e=>{e.preventDefault();dialog.close();openAppointment();};
  dialog.showModal();
}
if($('university-list') && Array.isArray(data.universities)) data.universities.forEach(u=>{
  const btn=document.createElement('button');btn.type='button';btn.className='university-card';
  const img=document.createElement('img');img.src=u.logo;img.alt=u.name;img.loading='lazy';
  const span=document.createElement('span');span.textContent=u.name;
  btn.append(img,span);btn.addEventListener('click',()=>showUniversity(u));$('university-list').append(btn);
});
if($('programs-tabs')){
  const tabs=$('programs-tabs').querySelectorAll('button[data-tab]');
  const panels={korean:$('korean'),programs:$('programs'),universities:$('universities')};
  function showTab(name){
    tabs.forEach(b=>b.toggleAttribute('aria-current',b.dataset.tab===name));
    tabs.forEach(b=>{if(b.dataset.tab===name)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});
    Object.entries(panels).forEach(([k,el])=>{if(el)el.hidden=k!==name;});
  }
  tabs.forEach(b=>b.addEventListener('click',()=>showTab(b.dataset.tab)));
  showTab('programs');
}
$('enquire-korean')?.addEventListener('click',()=>{if(data.contact.email){window.location.href=`mailto:${encodeURIComponent(data.contact.email)}?subject=${encodeURIComponent('Korean language class enquiry')}`;}else{showDetails('CONTACT SETUP PENDING','Let’s plan your next chapter','This preview is ready for your agency’s contact details. Add your real email address in content.js to enable enquiries. No message has been sent.',false);}});
=======
>>>>>>> b172e33699dfa4c357cbfc439230308bd1d08ec3
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
<<<<<<< HEAD
const revealGroups=['.hero-copy','.section-heading','.network-intro>*','.about-media','.about-copy','.vmv-card','.values-grid>li','.leader','.office-layout','.network-card','.why-photo','.why-copy','.program-card','.news-card','.story-layout','.contact>*','.document-page>*','#article-content>*','.footer-main>*','.impact-stats>li','.team-carousel>li','.video-cards>li','.agency-card','.class-grid>article','.university-card'];
=======
const revealGroups=['.hero-copy','.section-heading','.network-intro>*','.about-media','.about-copy','.vmv-card','.values-grid>li','.leader','.office-layout','.network-card','.why-photo','.why-copy','.program-card','.news-card','.story-layout','.contact>*','.document-page>*','#article-content>*','.footer-main>*'];
>>>>>>> b172e33699dfa4c357cbfc439230308bd1d08ec3
if(!matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window){
  revealGroups.forEach(sel=>{const byParent=new Map();document.querySelectorAll(sel).forEach(el=>{if(el.hasAttribute('data-reveal'))return;const list=byParent.get(el.parentElement)||[];list.push(el);byParent.set(el.parentElement,list);});
    byParent.forEach(list=>list.forEach((el,i)=>{el.setAttribute('data-reveal',el.matches('.program-card,.news-card,.values-grid>li,.network-card')?'scale':'');el.style.setProperty('--d',`${Math.min(i,6)*0.12}s`);}));});
  const counters=el=>el.querySelectorAll('.about-stats strong').forEach(n=>{const m=n.textContent.match(/^(\d+)(\+.*)$/);if(!m)return;const target=+m[1],suffix=m[2],start=Math.max(0,target-Math.min(target,60)),t0=performance.now();const tick=now=>{const k=Math.min(1,(now-t0)/1200),e=1-Math.pow(1-k,3);n.textContent=Math.round(start+(target-start)*e)+suffix;if(k<1)requestAnimationFrame(tick);};requestAnimationFrame(tick);});
  const io=new IntersectionObserver(entries=>{entries.forEach(en=>{if(!en.isIntersecting)return;const el=en.target;el.classList.add('in');counters(el);io.unobserve(el);
    const delay=parseFloat(getComputedStyle(el).transitionDelay)||0;setTimeout(()=>{el.removeAttribute('data-reveal');el.classList.remove('in');el.style.removeProperty('--d');},(delay+1)*1000);});},{threshold:0.12,rootMargin:'0px 0px -6% 0px'});
  document.querySelectorAll('[data-reveal]').forEach(el=>io.observe(el));
}
