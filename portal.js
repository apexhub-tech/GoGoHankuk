/* Student Portal — sign in with Facebook (or Google), see application & visa progress.
   Data lives in Firebase (Auth + Firestore); see firebase-config.js for setup.
   Runs in preview mode with sample data until Firebase is configured. */
(function(){
const $=id=>document.getElementById(id);
const FIREBASE_VERSION='10.14.1';
const CDN=name=>`https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-${name}.js`;

const STAGES=[
  {key:'consultation',label:'Initial consultation',hint:'We learn about your goals, background and budget.'},
  {key:'program',label:'Program selected',hint:'Institution and intake confirmed with your advisor.'},
  {key:'application',label:'Application submitted',hint:'Documents sent to the institution.'},
  {key:'admission',label:'Admission letter received',hint:'Certificate of Admission (CoA) issued.'},
  {key:'visa-docs',label:'Visa documents prepared',hint:'Financial proof, forms and photos checked.'},
  {key:'visa-submitted',label:'Visa application submitted',hint:'Biometrics taken at VFS / embassy.'},
  {key:'visa-approved',label:'Visa approved',hint:'Passport returned with visa.'},
  {key:'predeparture',label:'Pre-departure briefing',hint:'Flights, accommodation and arrival plan.'},
  {key:'arrived',label:'Arrived & enrolled',hint:'Welcome to your new chapter!'}
];
const DEFAULT_DOCS=['Passport (valid 12+ months)','Passport photos','High school certificate','Academic transcripts','Bank statement / financial proof','Study plan','Family relationship certificate','Application form'];
const DOC_STATUS={missing:'Missing',checking:'Under review',received:'Received',issue:'Needs attention'};
const VISA_STATUS={'not-started':'Not started',preparing:'Preparing documents',submitted:'Submitted',approved:'Approved',rejected:'Rejected'};

const views={login:$('portal-login'),loading:$('portal-loading'),dash:$('portal-dashboard'),admin:$('portal-admin')};
function show(name){if(!views[name].hidden)return;Object.entries(views).forEach(([k,el])=>{el.hidden=k!==name;});window.scrollTo({top:0});}
const site=window.SITE_CONTENT||{contact:{}};
const providers=window.PORTAL_PROVIDERS||{facebook:true,google:true};
$('login-google').hidden=!providers.google;$('login-facebook').hidden=!providers.facebook;

const fmtDate=d=>{if(!d)return'—';const dt=d.toDate?d.toDate():new Date(d);return isNaN(dt)?String(d):dt.toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'});};
const avatar=(name,url)=>{if(url)return url;const initials=(name||'?').split(/\s+/).map(w=>w[0]).join('').slice(0,2).toUpperCase();return'data:image/svg+xml;utf8,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96"><rect width="96" height="96" rx="48" fill="#0094DF"/><text x="48" y="58" font-family="Arial" font-size="36" fill="#fff" text-anchor="middle">${initials}</text></svg>`);};
function blankRecord(user){return{name:user.displayName||'Student',email:user.email||'',photo:user.photoURL||'',stage:0,program:'',institution:'',intake:'',advisor:'',visa:{type:'',status:'not-started',appointment:'',submitted:'',note:''},documents:DEFAULT_DOCS.map(name=>({name,status:'missing'})),notes:[]};}

/* ---------------- Student dashboard ---------------- */
function renderStudent(user,data){
  data=Object.assign(blankRecord(user),data||{});
  $('user-photo').src=avatar(data.name,data.photo||user.photoURL);$('user-name').textContent=`Hello, ${(data.name||'').split(' ')[0]||'there'}`;$('user-email').textContent=data.email;
  const stage=Math.max(0,Math.min(STAGES.length-1,Number(data.stage)||0));const pct=Math.round(stage/(STAGES.length-1)*100);
  $('progress-percent').textContent=pct+'%';$('progress-ring').style.setProperty('--p',pct);
  $('progress-summary').textContent=stage===STAGES.length-1?'Congratulations — you have completed every step of your journey with us.':`You are at step ${stage+1} of ${STAGES.length}: ${STAGES[stage].label}. Next up: ${STAGES[stage+1].label.toLowerCase()}.`;
  $('stepper').replaceChildren(...STAGES.map((s,i)=>{const li=document.createElement('li');li.className=i<stage?'done':i===stage?'current':'';li.innerHTML=`<span class="step-dot"></span><div><strong></strong><small></small></div>`;li.querySelector('strong').textContent=s.label;li.querySelector('small').textContent=s.hint;return li;}));
  $('program-title').textContent=data.program||'Not selected yet';$('program-intake').textContent=data.intake||'—';$('program-institution').textContent=data.institution||'—';$('program-advisor').textContent=data.advisor||'Your Go Go Hankuk advisor';
  const v=Object.assign({type:'',status:'not-started'},data.visa||{});$('visa-type').textContent=v.type||'Visa not assigned yet';const pill=$('visa-status');pill.textContent=VISA_STATUS[v.status]||v.status;pill.dataset.status=v.status;$('visa-card').dataset.status=v.status;
  $('visa-appointment').textContent=v.appointment||'—';$('visa-submitted').textContent=v.submitted||'—';$('visa-note').textContent=v.note||'';$('visa-note').hidden=!v.note;
  const docs=data.documents||[];const received=docs.filter(d=>d.status==='received').length;$('docs-count').textContent=docs.length?`${received} of ${docs.length} received`:'';
  $('doc-list').replaceChildren(...docs.map(d=>{const li=document.createElement('li');li.dataset.status=d.status;li.innerHTML=`<span class="doc-mark"></span><span class="doc-name"></span><span class="doc-status"></span>`;li.querySelector('.doc-name').textContent=d.name;li.querySelector('.doc-status').textContent=DOC_STATUS[d.status]||d.status;return li;}));
  if(!docs.length)$('doc-list').innerHTML='<li class="empty">Your advisor will add your document checklist soon.</li>';
  const notes=[...(data.notes||[])].sort((a,b)=>new Date(b.date)-new Date(a.date));
  $('note-list').replaceChildren(...notes.map(n=>{const li=document.createElement('li');li.innerHTML=`<time></time><p></p>`;li.querySelector('time').textContent=fmtDate(n.date);li.querySelector('p').textContent=n.text;return li;}));
  if(!notes.length)$('note-list').innerHTML='<li class="empty">No updates yet — your advisor will post notes here as your application moves forward.</li>';
  $('portal-updated').textContent=data.updatedAt?`Last updated ${fmtDate(data.updatedAt)}`:'';
}
$('message-advisor').addEventListener('click',()=>{const email=site.contact&&site.contact.email;if(email)location.href=`mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent('Question about my application')}`;else if(window.showDetails)showDetails('CONTACT','Message your advisor','Add the agency email address in content.js (contact.email) to enable this button. Until then, please contact your advisor directly.',false);});

/* ---------------- Staff dashboard ---------------- */
let students=[],selectedId=null,draft=null,saveHandler=null;
function renderAdminList(filter=''){
  const q=filter.trim().toLowerCase();const list=students.filter(s=>!q||`${s.name} ${s.email} ${s.program}`.toLowerCase().includes(q)).sort((a,b)=>(a.name||'').localeCompare(b.name||''));
  $('admin-count').textContent=`${students.length} student${students.length===1?'':'s'} registered`;
  $('admin-list').replaceChildren(...list.map(s=>{const li=document.createElement('li');const b=document.createElement('button');b.type='button';b.className=s.id===selectedId?'active':'';b.innerHTML=`<img alt="" width="36" height="36"><span><strong></strong><small></small></span><em></em>`;b.querySelector('img').src=avatar(s.name,s.photo);b.querySelector('strong').textContent=s.name||'(no name)';b.querySelector('small').textContent=s.program||s.email||'';b.querySelector('em').textContent=`${Math.round((Number(s.stage)||0)/(STAGES.length-1)*100)}%`;b.addEventListener('click',()=>selectStudent(s.id));li.append(b);return li;}));
  if(!list.length)$('admin-list').innerHTML='<li class="empty">No students found.</li>';
}
$('admin-search').addEventListener('input',e=>renderAdminList(e.target.value));
function selectStudent(id){
  selectedId=id;const s=students.find(x=>x.id===id);if(!s)return;draft=JSON.parse(JSON.stringify(s));
  $('admin-editor').hidden=false;$('admin-empty').hidden=true;renderAdminList($('admin-search').value);
  $('edit-photo').src=avatar(s.name,s.photo);$('edit-name').textContent=s.name;$('edit-email').textContent=s.email;
  $('f-stage').replaceChildren(...STAGES.map((st,i)=>{const o=document.createElement('option');o.value=i;o.textContent=`${i+1}. ${st.label}`;return o;}));$('f-stage').value=Number(s.stage)||0;
  $('program-options').replaceChildren(...((site.programs||[]).map(p=>{const o=document.createElement('option');o.value=p.title;return o;})));
  $('f-program').value=s.program||'';$('f-institution').value=s.institution||'';$('f-intake').value=s.intake||'';$('f-advisor').value=s.advisor||'';
  const v=s.visa||{};$('f-visa-type').value=v.type||'';$('f-visa-status').value=v.status||'not-started';$('f-visa-appointment').value=v.appointment||'';$('f-visa-submitted').value=v.submitted||'';$('f-visa-note').value=v.note||'';
  draft.documents=draft.documents||[];draft.notes=draft.notes||[];renderEditDocs();renderEditNotes();$('f-status').textContent='';
}
function renderEditDocs(){$('f-docs').replaceChildren(...draft.documents.map((d,i)=>{const li=document.createElement('li');li.innerHTML=`<span class="doc-name"></span><select></select><button type="button" class="icon-btn" aria-label="Remove document">×</button>`;li.querySelector('.doc-name').textContent=d.name;const sel=li.querySelector('select');sel.replaceChildren(...Object.entries(DOC_STATUS).map(([k,l])=>{const o=document.createElement('option');o.value=k;o.textContent=l;return o;}));sel.value=d.status||'missing';sel.addEventListener('change',()=>{draft.documents[i].status=sel.value;});li.querySelector('button').addEventListener('click',()=>{draft.documents.splice(i,1);renderEditDocs();});return li;}));}
function renderEditNotes(){$('f-notes').replaceChildren(...[...draft.notes].map((n,i)=>{const li=document.createElement('li');li.innerHTML=`<time></time><p></p><button type="button" class="icon-btn" aria-label="Remove note">×</button>`;li.querySelector('time').textContent=fmtDate(n.date);li.querySelector('p').textContent=n.text;li.querySelector('button').addEventListener('click',()=>{draft.notes.splice(i,1);renderEditNotes();});return li;}).reverse());}
$('f-doc-add').addEventListener('click',()=>{const v=$('f-doc-new').value.trim();if(!v)return;draft.documents.push({name:v,status:'missing'});$('f-doc-new').value='';renderEditDocs();});
$('f-note-add').addEventListener('click',()=>{const v=$('f-note-new').value.trim();if(!v)return;draft.notes.push({text:v,date:new Date().toISOString()});$('f-note-new').value='';renderEditNotes();});
$('f-doc-new').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();$('f-doc-add').click();}});
$('f-note-new').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();$('f-note-add').click();}});
function collectForm(){return{stage:Number($('f-stage').value)||0,program:$('f-program').value.trim(),institution:$('f-institution').value.trim(),intake:$('f-intake').value.trim(),advisor:$('f-advisor').value.trim(),visa:{type:$('f-visa-type').value,status:$('f-visa-status').value,appointment:$('f-visa-appointment').value.trim(),submitted:$('f-visa-submitted').value.trim(),note:$('f-visa-note').value.trim()},documents:draft.documents,notes:draft.notes};}
$('edit-form').addEventListener('submit',async e=>{e.preventDefault();if(!selectedId)return;const changes=collectForm();$('f-save').disabled=true;$('f-status').textContent='Saving…';try{if(saveHandler)await saveHandler(selectedId,changes);else{Object.assign(students.find(s=>s.id===selectedId),changes);renderAdminList($('admin-search').value);}$('f-status').textContent='Saved ✓';}catch(err){console.error(err);$('f-status').textContent='Could not save: '+(err.message||err);}finally{$('f-save').disabled=false;}});

/* ---------------- Preview mode (no Firebase yet) ---------------- */
const SAMPLE={name:'Aung Kyaw',email:'aung.kyaw@example.com',photo:'',stage:3,program:'Korea Language Program',institution:'Yonsei University KLI',intake:'March 2027',advisor:'Zun Phu Wai',visa:{type:'D-4-1 Visa',status:'preparing',appointment:'Not booked yet',submitted:'',note:'We are waiting for your bank statement to be 30 days old before booking the VFS appointment.'},documents:[{name:'Passport (valid 12+ months)',status:'received'},{name:'Passport photos',status:'received'},{name:'High school certificate',status:'received'},{name:'Academic transcripts',status:'checking'},{name:'Bank statement / financial proof',status:'issue'},{name:'Study plan',status:'received'},{name:'Family relationship certificate',status:'missing'},{name:'Application form',status:'received'}],notes:[{date:'2026-08-20',text:'Welcome to Go Go Hankuk! We have opened your file and confirmed your program choice.'},{date:'2026-09-02',text:'Great news — your Certificate of Admission from Yonsei KLI has arrived. Next we prepare the visa documents.'},{date:'2026-09-10',text:'Bank statement needs to show the balance for at least 30 days. Please re-issue it after 25 September.'}],updatedAt:'2026-09-10'};
const cfg=window.FIREBASE_CONFIG||{};const configured=cfg.apiKey&&!/^YOUR_/i.test(cfg.apiKey)&&cfg.projectId&&!/^YOUR_/i.test(cfg.projectId);
if(!configured){
  $('setup-notice').hidden=false;['login-facebook','login-google'].forEach(id=>{$(id).disabled=true;$(id).title='Connect Firebase to enable sign-in';});
  $('demo-student').addEventListener('click',()=>{renderStudent({displayName:SAMPLE.name,email:SAMPLE.email},SAMPLE);$('user-role').textContent='STUDENT PORTAL · PREVIEW';show('dash');});
  $('demo-admin').addEventListener('click',()=>{students=[Object.assign({id:'s1'},SAMPLE),{id:'s2',name:'Su Su Hlaing',email:'susu@example.com',photo:'',stage:1,program:'Bachelor Program',institution:'',intake:'September 2027',advisor:'Nay Myo Thura Naing',visa:{type:'D-2-2 Visa',status:'not-started'},documents:DEFAULT_DOCS.map(name=>({name,status:'missing'})),notes:[]},{id:'s3',name:'Min Thant',email:'minthant@example.com',photo:'',stage:6,program:'2 Years College Program',institution:'Seoul Business College',intake:'March 2027',advisor:'Zun Phu Wai',visa:{type:'D-2-1 Visa',status:'approved',appointment:'2 Sep 2026',submitted:'2 Sep 2026',note:'Visa approved — passport ready for collection.'},documents:DEFAULT_DOCS.map(name=>({name,status:'received'})),notes:[{date:'2026-09-11',text:'Visa approved! Let’s book your pre-departure briefing.'}]}];$('admin-name').textContent='Students · preview';$('admin-photo').src=avatar('Go Go');selectedId=null;$('admin-editor').hidden=true;$('admin-empty').hidden=false;renderAdminList();show('admin');});
  ['logout','admin-logout'].forEach(id=>$(id).addEventListener('click',()=>show('login')));
  show('login');return;
}

/* ---------------- Live mode (Firebase) ---------------- */
show('loading');
(async()=>{
  const [{initializeApp},A,F]=await Promise.all([import(CDN('app')),import(CDN('auth')),import(CDN('firestore'))]);
  const app=initializeApp(cfg),auth=A.getAuth(app),db=F.getFirestore(app);
  let unsubscribe=null;
  const showError=msg=>{const el=$('login-error');el.textContent=msg;el.hidden=!msg;};
  async function signIn(provider){showError('');try{await A.signInWithPopup(auth,provider);}catch(err){
    if(err.code==='auth/popup-blocked'||err.code==='auth/operation-not-supported-in-this-environment'){return A.signInWithRedirect(auth,provider);}
    if(err.code==='auth/account-exists-with-different-credential')showError('An account with this email already exists using a different sign-in method. Please use the same method you used before.');
    else if(err.code!=='auth/popup-closed-by-user'&&err.code!=='auth/cancelled-popup-request')showError('Sign-in failed: '+(err.message||err.code));}}
  $('login-facebook').addEventListener('click',()=>{const p=new A.FacebookAuthProvider();p.addScope('email');signIn(p);});
  $('login-google').addEventListener('click',()=>signIn(new A.GoogleAuthProvider()));
  ['logout','admin-logout'].forEach(id=>$(id).addEventListener('click',()=>A.signOut(auth)));
  A.getRedirectResult(auth).catch(err=>showError('Sign-in failed: '+(err.message||err.code)));

  A.onAuthStateChanged(auth,async user=>{
    if(unsubscribe){unsubscribe();unsubscribe=null;}
    if(!user){show('login');return;}
    show('loading');
    let isAdmin=false;try{isAdmin=(await F.getDoc(F.doc(db,'admins',user.uid))).exists();}catch(e){isAdmin=false;}
    if(isAdmin){
      $('admin-name').textContent=`Students`;$('admin-photo').src=avatar(user.displayName,user.photoURL);
      saveHandler=async(id,changes)=>{await F.updateDoc(F.doc(db,'students',id),Object.assign({},changes,{updatedAt:F.serverTimestamp()}));};
      unsubscribe=F.onSnapshot(F.collection(db,'students'),snap=>{students=snap.docs.map(d=>Object.assign({id:d.id},d.data()));renderAdminList($('admin-search').value);if(selectedId&&!students.some(s=>s.id===selectedId)){selectedId=null;$('admin-editor').hidden=true;$('admin-empty').hidden=false;}},err=>{console.error(err);});
      $('admin-editor').hidden=true;$('admin-empty').hidden=false;show('admin');
    } else {
      const ref=F.doc(db,'students',user.uid);
      try{const snap=await F.getDoc(ref);if(!snap.exists())await F.setDoc(ref,Object.assign(blankRecord(user),{createdAt:F.serverTimestamp(),updatedAt:F.serverTimestamp()}));}
      catch(err){console.error(err);showError('Could not load your record: '+(err.message||err.code));show('login');return;}
      $('user-role').textContent='STUDENT PORTAL';
      unsubscribe=F.onSnapshot(ref,snap=>{renderStudent(user,snap.data());show('dash');},err=>{console.error(err);showError('Could not load your record: '+(err.message||err.code));show('login');});
    }
  });
})().catch(err=>{console.error(err);show('login');$('login-error').textContent='The portal could not start: '+(err.message||err);$('login-error').hidden=false;});
})();
