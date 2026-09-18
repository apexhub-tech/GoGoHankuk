/* Language switching (English / Myanmar / Korean).
   - The chosen language is remembered in the browser (localStorage "lang").
   - Static page text is translated by matching the English text against
     translations.js → ui (exact match after whitespace is collapsed).
   - Structured content (programs, hero, benefits, stories, office, network …)
     is translated by merging translations.js → content over content.js.
   - Elements with data-i18n="key" take their HTML from translations.js → html.
   - JS code can call t('English text') or t('Step {a} of {b}', {a, b}).
   - Call translateTree(element) after inserting new content dynamically. */
(function(){
  const LANGS={en:'EN',my:'မြန်မာ',ko:'한국어'};
  const T=window.SITE_TRANSLATIONS||{};
  let lang='en';
  try{lang=localStorage.getItem('lang')||'en';}catch(e){}
  if(!LANGS[lang])lang='en';
  const pack=T[lang]||{},ui=pack.ui||{},html=pack.html||{};
  document.documentElement.lang=lang;
  window.CURRENT_LANG=lang;

  window.t=function(text,vars){
    let out=(lang!=='en'&&ui[text]!==undefined)?ui[text]:text;
    if(vars)for(const k in vars)out=out.split('{'+k+'}').join(vars[k]);
    return out;
  };

  // Merge translated content over the English content (arrays are merged by index).
  function merge(dst,src){
    for(const k in src){
      const v=src[k];
      if(Array.isArray(v)&&Array.isArray(dst[k])){v.forEach((item,i)=>{if(dst[k][i]&&item&&typeof item==='object')merge(dst[k][i],item);else if(item!==undefined)dst[k][i]=item;});}
      else if(v&&typeof v==='object'&&dst[k]&&typeof dst[k]==='object')merge(dst[k],v);
      else dst[k]=v;
    }
  }
  if(lang!=='en'&&pack.content&&window.SITE_CONTENT)merge(window.SITE_CONTENT,pack.content);

  // Web font for the active script.
  const FONT={my:'https://fonts.googleapis.com/css2?family=Noto+Sans+Myanmar:wght@400;500;600;700&display=swap',ko:'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;600;700&display=swap'};
  if(FONT[lang]){const l=document.createElement('link');l.rel='stylesheet';l.href=FONT[lang];document.head.append(l);}

  function translateTree(root){
    if(lang==='en'||!root)return;
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:n=>{const p=n.parentElement;if(!p||/^(SCRIPT|STYLE|NOSCRIPT)$/.test(p.tagName)||p.closest('[data-i18n],.lang-switch,.notranslate'))return NodeFilter.FILTER_REJECT;return NodeFilter.FILTER_ACCEPT;}});
    const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
    nodes.forEach(n=>{const raw=n.data,key=raw.replace(/\s+/g,' ').trim();if(!key)return;const tr=ui[key];if(tr===undefined)return;n.data=raw.match(/^\s*/)[0]+tr+raw.match(/\s*$/)[0];});
    root.querySelectorAll('[data-i18n]').forEach(el=>{const v=html[el.getAttribute('data-i18n')];if(v!==undefined)el.innerHTML=v;});
    ['placeholder','aria-label','title'].forEach(a=>root.querySelectorAll('['+a+']').forEach(el=>{const v=el.getAttribute(a);if(v&&ui[v]!==undefined)el.setAttribute(a,ui[v]);}));
  }
  window.translateTree=translateTree;

  function buildSwitch(){
    const nav=document.getElementById('navigation');if(!nav)return;
    const box=document.createElement('div');box.className='lang-switch';box.setAttribute('role','group');box.setAttribute('aria-label','Language');
    Object.keys(LANGS).forEach(code=>{const b=document.createElement('button');b.type='button';b.lang=code;b.textContent=LANGS[code];if(code===lang)b.setAttribute('aria-current','true');
      b.addEventListener('click',()=>{if(code===lang)return;try{localStorage.setItem('lang',code);}catch(e){}location.reload();});box.append(b);});
    nav.append(box);
  }

  document.addEventListener('DOMContentLoaded',()=>{
    buildSwitch();
    translateTree(document.body);
    const tEl=document.querySelector('title');
    if(tEl&&lang!=='en'){const m=tEl.textContent.match(/^(.*?)\s*\|\s*(.*)$/);if(m&&ui[m[1]]!==undefined)tEl.textContent=ui[m[1]]+' | '+m[2];}
  });
})();
