// FixDali app logic (with PHP backend integration)
let currentScreen = 'splash';
let screenHistory = [];
let selectedTech = null;
let selectedCat = 'all';
let bookingFilter = 'all';
let chatTech = null;
let selectedBooking = null;
let currentUser = null;
let currentWorker = null;
let workerChatBooking = null;
let workerAvailable = true;

const NO_NAV_SCREENS = ['splash','onboard1','onboard2','onboard3','login','register','forgot','adminLogin','workerLogin','booking','bookingConfirmed','techDetail','chat','bookingDetail','workerDash'];
const NO_APPBAR_SCREENS = ['splash'];
const FULL_SCREENS = ['splash','onboard1','onboard2','onboard3'];

function $(id){ return document.getElementById(id); }

async function api(path, opts={}){
  try {
    const r = await fetch(path, Object.assign({credentials:'same-origin', headers:{'Content-Type':'application/json'}}, opts));
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || r.statusText);
    return data;
  } catch(e){ console.warn('API', path, e); return null; }
}

function showScreen(name, pushHistory=true){
  if(name === currentScreen) return;
  if(pushHistory) screenHistory.push(currentScreen);
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  const el = $('screen-'+name);
  if(el) el.classList.add('active');
  currentScreen = name;
  updateChrome(name);
  onScreenShow(name);
}

function goBack(){
  if(screenHistory.length){ showScreen(screenHistory.pop(), false); }
  else { showScreen('home', false); }
}

function updateChrome(name){
  const container = $('screenContainer');
  container.classList.remove('no-nav','full');
  if(NO_NAV_SCREENS.includes(name)) container.classList.add('no-nav');
  if(FULL_SCREENS.includes(name)) container.classList.add('full');
  const nav = $('bottomNav');
  nav.style.display = NO_NAV_SCREENS.includes(name) ? 'none' : 'flex';
  const appbar = $('appbar');
  appbar.style.display = NO_APPBAR_SCREENS.includes(name) ? 'none' : 'flex';
  const back = $('backBtn');
  const showBack = !['home','splash','login','register','adminDash','workerDash'].includes(name) && !NO_APPBAR_SCREENS.includes(name);
  back.style.display = showBack ? 'flex' : 'none';
  const titles = {home:'FixDali',services:'Services',photoAssist:'Fix by photo',techDetail:'Technician',booking:'Book Service',bookingConfirmed:'Confirmed',bookings:'My Bookings',bookingDetail:'Booking Detail',messages:'Messages',chat:'Chat',notifications:'Notifications',profile:'Profile',adminDash:'Admin',workerLogin:'Worker Login',workerDash:'Partner Dashboard',login:'Log In',register:'Sign Up',forgot:'Forgot Password',adminLogin:'Admin Login',onboard1:'Welcome',onboard2:'Welcome',onboard3:'Welcome',splash:'FixDali'};
  $('appTitle').textContent = titles[name] || 'FixDali';
  document.querySelectorAll('.bottomnav button').forEach(b=> b.classList.toggle('active', b.dataset.screen === name));
}

function onScreenShow(name){
  switch(name){
    case 'home': renderHome(); break;
    case 'services': renderServices(); break;
    case 'techDetail': renderTechDetail(); break;
    case 'booking': renderBooking(); break;
    case 'bookings': renderBookings(); break;
    case 'bookingDetail': renderBookingDetail(); break;
    case 'messages': renderMessages(); break;
    case 'chat': renderChat(); break;
    case 'notifications': renderNotifications(); break;
    case 'profile': renderProfile(); break;
    case 'adminDash': renderAdmin(); break;
    case 'workerDash': renderWorkerDashboard(); break;
    case 'photoAssist': renderScanQuota(); break;
    case 'onboard1': setOnboardImgs(); break;
  }
}

function setOnboardImgs(){
  const imgs = [$('onb1img'),$('onb2img'),$('onb3img')];
  imgs.forEach((im,i)=>{ if(im) im.src = 'assets/images/'+SAMPLE_IMAGES[i]; });
}

// ---------- HOME ----------
async function renderHome(){
  // categories
  const cg = $('catGrid');
  if(cg) cg.innerHTML = CATEGORIES.map(c=>`
    <div class="cat" onclick="openCategory('${c.id}')">
      <div class="ico">${c.ico}</div>
      <div class="name">${c.name}</div>
    </div>`).join('');
  // technicians from API (fallback sample)
  let techs = await api('api/technicians.php');
  if(!techs) techs = TECHNICIANS;
  window._techs = techs;
  const featured = techs;
  const fl = $('featuredList');
  if(fl) fl.innerHTML = featured.map(t=>techCard(t)).join('');
  // bookings
  let bks = null;
  if(currentUser){ bks = await api('api/bookings.php'); }
  if(!bks) bks = BOOKINGS;
  window._bookings = bks;
  const recent = bks.slice(0,3);
  const rb = $('recentBookings');
  if(rb) rb.innerHTML = recent.map(b=>{
    const t = (window._techs||TECHNICIANS).find(x=>x.id==b.tech_id||x.id==b.tech) || {};
    const img = b.img ? 'assets/images/'+b.img : (t.avatar||'');
    return `<div class="list-item" onclick="openBookingDetail('${b.id}')">
      <img class="avatar" src="${img}" alt="">
      <div class="info">
        <div class="name">${b.service}</div>
        <div class="sub">${t.name||''} · ${b.booking_date||b.date} ${b.booking_time||b.time||''}</div>
      </div>
      <span class="badge ${statusBadge(b.status)}">${b.status}</span>
    </div>`;
  }).join('');
}

function techCard(t){
  const id = t.id;
  const name = t.name;
  const cat = (typeof catName==='function') ? catName(t.cat) : t.cat;
  const rating = t.rating;
  const reviews = t.reviews;
  const price = t.price;
  const exp = t.exp;
  const verified = t.verified==1||t.verified===true;
  const avatar = t.avatar ? (t.avatar.startsWith('assets')?t.avatar:'assets/images/'+t.avatar) : '';
  return `<div class="list-item" onclick="openTech(${id})">
    <img class="avatar" src="${avatar}" alt="">
    <div class="info">
      <div class="name">${name} ${verified?'<span style="color:var(--success)">✓</span>':''}</div>
      <div class="sub">${cat} · ${exp} exp</div>
      <div class="hours-line">◷ ${t.hours||'By appointment'} · <span class="worker-availability-text ${t.available==1||t.available===true?'is-open':''}">${t.available==1||t.available===true?'Available today':'Currently busy'}</span></div>
      <div class="stars">${'★'.repeat(Math.round(rating))} <span style="color:var(--muted)">${rating} (${reviews})</span></div>
    </div>
    <div style="text-align:right">
      <div class="price">₱${price}</div>
      <div class="small muted">/hr</div>
    </div>
  </div>`;
}

function openCategory(id){ selectedCat = id; showScreen('services'); }
function openTech(id){ selectedTech = id; showScreen('techDetail'); }
function catName(id){ const c=CATEGORIES.find(x=>x.id===id); return c?c.name:id; }
function statusBadge(s){
  if(s==='completed'||s==='confirmed') return 'badge-success';
  if(s==='pending') return 'badge-warning';
  if(s==='cancelled') return 'badge-danger';
  return 'badge-info';
}

// ---------- SERVICES ----------
async function renderServices(){
  const tabs = [{id:'all',name:'All'}].concat(CATEGORIES.map(c=>({id:c.id,name:c.name})));
  const tb = $('catTabs');
  if(tb) tb.innerHTML = tabs.map(t=>`<button class="${t.id===selectedCat?'active':''}" onclick="setCat('${t.id}',this)">${t.name}</button>`).join('');
  await renderTechList();
}
function setCat(id,btn){
  selectedCat = id;
  document.querySelectorAll('#catTabs button').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  renderTechList();
}
async function renderTechList(){
  let techs = await api('api/technicians.php'+(selectedCat&&selectedCat!=='all'?'?cat='+selectedCat:''));
  if(!techs) techs = (selectedCat&&selectedCat!=='all') ? TECHNICIANS.filter(t=>t.cat===selectedCat) : TECHNICIANS;
  window._techs = techs;
  const q = ($('searchInput')||{value:''}).value.toLowerCase();
  if(q) techs = techs.filter(t=>t.name.toLowerCase().includes(q)||catName(t.cat).toLowerCase().includes(q));
  const tl = $('techList');
  if(tl) tl.innerHTML = techs.length ? techs.map(t=>techCard(t)).join('') : '<div class="empty"><div class="ico">🔍</div>No technicians found</div>';
}
function filterTechs(){ if(currentScreen==='home') renderHome(); if(currentScreen==='services') renderTechList(); }

// ---------- TECH DETAIL ----------
async function renderTechDetail(){
  let t = await api('api/technician.php?id='+selectedTech);
  if(!t) t = TECHNICIANS.find(x=>x.id==selectedTech);
  if(!t) return;
  window._currentTech = t;
  const content = $('techDetailContent');
  if(!content) return;
  content.innerHTML = `
    <div style="text-align:center;padding:10px 0">
      <img class="avatar-lg" src="${t.avatar&&t.avatar.startsWith('assets')?t.avatar:'assets/images/'+(t.avatar||'')}" alt="">
      <h3>${t.name} ${t.verified==1||t.verified===true?'<span style="color:var(--success)">✓ Verified</span>':''}</h3>
      <p class="muted">${catName(t.cat)} · ${t.exp} experience</p>
      <div class="hours-pill">◷ Service hours: ${t.hours||'By appointment'}</div>
      <div class="rating-big">${t.rating} ★</div>
      <div class="muted">${t.reviews} reviews · ${t.jobs} jobs done</div>
    </div>
    <div class="card">
      <div class="card-title">About</div>
      <p class="muted">${t.bio}</p>
    </div>
    <div class="card">
      <div class="row"><span class="muted">Hourly rate</span><span style="margin-left:auto;font-weight:800;color:var(--primary)">₱${t.price}</span></div>
      <div class="row"><span class="muted">Availability</span><span style="margin-left:auto" class="badge ${t.available==1||t.available===true?'badge-success':'badge-danger'}">${t.available==1||t.available===true?'Available':'Busy'}</span></div>
    </div>
    <div class="section-title">Reviews</div>
    ${REVIEWS.map(r=>`<div class="review">
      <div class="head"><span class="name">${r.user}</span><span class="stars">${'★'.repeat(r.rating)}</span></div>
      <p class="muted" style="font-size:13px">${r.text}</p>
      <div class="small muted" style="margin-top:4px">${r.date}</div>
    </div>`).join('')}
    <div class="row" style="gap:8px;margin-top:12px">
      <button class="btn btn-outline" onclick="startChat(${t.id})">Message</button>
      <button class="btn btn-primary" onclick="startBooking(${t.id})">Book Now</button>
    </div>
  `;
}

function startBooking(id){ selectedTech = id; showScreen('booking'); }
function startChat(id){ chatTech = id; showScreen('chat'); }

// ---------- BOOKING ----------
async function renderBooking(){
  let t = (window._techs||[]).find(x=>x.id==selectedTech);
  if(!t) t = await api('api/technician.php?id='+selectedTech);
  if(!t) t = TECHNICIANS.find(x=>x.id==selectedTech);
  $('bookingTechName').textContent = 'with ' + (t?t.name:'');
  const svcs = t ? [ (t.cat||'')+' service', 'Inspection', 'Emergency repair'] : [];
  $('bookService').innerHTML = svcs.map(s=>`<option>${s}</option>`).join('');
  $('bookAddr').innerHTML = ADDRESSES.map(a=>`<option>${a.label}: ${a.value}</option>`).join('');
  $('bookPay').innerHTML = PAYMENTS.map(p=>`<option value="${p.type}">${p.type} · ${p.value}</option>`).join('');
  const fee = t?t.price:450;
  $('bookFee').textContent = '₱'+fee;
  $('bookTotal').textContent = '₱'+(fee+25);
  window._bookingTech = t;
}

async function confirmBooking(){
  const t = window._bookingTech || TECHNICIANS.find(x=>x.id==selectedTech);
  const id = 'BK-'+(1000 + (BOOKINGS.length||0) + Math.floor(Math.random()*1000));
  const body = {
    tech_id: selectedTech,
    service: $('bookService').value,
    date: $('bookDate').value,
    time: $('bookTime').value,
    address: $('bookAddr').value.split(': ').slice(1).join(': ') || $('bookAddr').value,
    price: (t?t.price:450)+25,
    img: t ? (t.avatar||'').split('/').pop() : SAMPLE_IMAGES[0],
    payment_method: $('bookPay').value || 'Cash'
  };
  const res = await api('api/bookings.php', {method:'POST', body: JSON.stringify(body)});
  const newId = res && res.id ? res.id : id;
  // local list update
  BOOKINGS.unshift({id:newId, tech:selectedTech, service:body.service, date:body.date, time:body.time, status:'pending', address:body.address, price:body.price, img:body.img, payment_method:body.payment_method});
  $('confId').textContent = newId;
  $('confTech').textContent = t?t.name:'';
  $('confDT').textContent = body.date+' · '+body.time;
  $('confTotal').textContent = '₱'+body.price;
  showScreen('bookingConfirmed');
}

// ---------- BOOKINGS ----------
async function renderBookings(){ await renderBookingsList(bookingFilter); }
function filterBookings(f,btn){
  bookingFilter=f;
  if(btn){ document.querySelectorAll('#screen-bookings .tabbar button').forEach(b=>b.classList.remove('active')); btn.classList.add('active'); }
  renderBookingsList(f);
}
async function renderBookingsList(f){
  let list = await api('api/bookings.php');
  if(!list) list = BOOKINGS;
  window._bookings = list;
  if(f==='upcoming') list = list.filter(b=>b.status==='pending'||b.status==='confirmed');
  else if(f==='completed') list = list.filter(b=>b.status==='completed');
  else if(f==='cancelled') list = list.filter(b=>b.status==='cancelled');
  const container = $('bookingsList');
  if(!container) return;
  if(!list.length){ container.innerHTML='<div class="empty"><div class="ico">📅</div>No bookings</div>'; return; }
  const techs = window._techs || TECHNICIANS;
  container.innerHTML = list.map(b=>{
    const t = techs.find(x=>x.id==(b.tech_id||b.tech)) || {};
    const img = b.img ? 'assets/images/'+b.img : (t.avatar||'');
    const date = b.booking_date||b.date;
    const time = b.booking_time||b.time;
    return `<div class="list-item" onclick="openBookingDetail('${b.id}')">
      <img class="avatar" src="${img}" onerror="this.src='${t.avatar||''}'" alt="">
      <div class="info">
        <div class="name">${b.service}</div>
        <div class="sub">${t.name||''} · ${date} ${time}</div>
      </div>
      <div style="text-align:right">
        <span class="badge ${statusBadge(b.status)}">${b.status}</span>
        <div class="price" style="margin-top:4px">₱${b.price}</div>
      </div>
    </div>`;
  }).join('');
}
function openBookingDetail(id){ selectedBooking = id; showScreen('bookingDetail'); }

async function renderBookingDetail(){
  let b = (window._bookings||[]).find(x=>x.id===selectedBooking);
  if(!b){
    const all = await api('api/bookings.php');
    if(all) b = all.find(x=>x.id===selectedBooking);
  }
  if(!b) return;
  const techs = window._techs || TECHNICIANS;
  const t = techs.find(x=>x.id==(b.tech_id||b.tech)) || TECHNICIANS.find(x=>x.id==(b.tech_id||b.tech)) || {};
  const date = b.booking_date||b.date;
  const time = b.booking_time||b.time;
  const address = b.address;
  const steps = [
    {label:'Booking placed', done:true, date:date},
    {label:'Confirmed by technician', done:b.status!=='pending', date:b.status!=='pending'?'Confirmed':''},
    {label:'Technician on the way', done:b.status==='completed', date:''},
    {label:'Service completed', done:b.status==='completed', date:b.status==='completed'?date:''},
  ];
  if(b.status==='cancelled') steps.push({label:'Cancelled', done:true, date:date});
  const content = $('bookingDetailContent');
  if(!content) return;
  content.innerHTML = `
    <div class="card">
      <div class="row"><span class="muted">Booking ID</span><span style="margin-left:auto;font-weight:700">${b.id}</span></div>
      <div class="row"><span class="muted">Status</span><span style="margin-left:auto" class="badge ${statusBadge(b.status)}">${b.status}</span></div>
    </div>
    <div class="list-item" onclick="openTech(${t.id})" style="cursor:pointer">
      <img class="avatar" src="${t.avatar&&t.avatar.startsWith('assets')?t.avatar:'assets/images/'+(t.avatar||'')}" alt="">
      <div class="info">
        <div class="name">${t.name}</div>
        <div class="sub">${catName(t.cat)}</div>
      </div>
      <button class="btn btn-outline btn-sm" onclick="event.stopPropagation();startChat(${t.id})">Chat</button>
    </div>
    <div class="card">
      <div class="card-title">Service Details</div>
      <div class="row"><span class="muted">Service</span><span style="margin-left:auto">${b.service}</span></div>
      <div class="row"><span class="muted">Date</span><span style="margin-left:auto">${date}</span></div>
      <div class="row"><span class="muted">Time</span><span style="margin-left:auto">${time}</span></div>
      <div class="row"><span class="muted">Address</span><span style="margin-left:auto;text-align:right;max-width:60%">${address}</span></div>
      <div class="row"><span class="muted">Payment</span><span style="margin-left:auto;text-align:right">${b.payment_method||'Cash'}</span></div>
      <div class="row"><span class="muted">Total</span><span style="margin-left:auto;font-weight:800;color:var(--primary)">₱${b.price}</span></div>
    </div>
    <div class="card">
      <div class="card-title">Progress</div>
      <div class="timeline">
        ${steps.map(s=>`<div class="step ${s.done?'done':''} ${s.done?'':'active'}"><div class="label">${s.label}</div><div class="date">${s.date}</div></div>`).join('')}
      </div>
    </div>
    <div class="row" style="gap:8px;margin-top:12px">
      ${b.status==='pending'||b.status==='confirmed' ? `<button class="btn btn-danger" onclick="cancelBooking('${b.id}')">Cancel</button>` : ''}
      ${b.status==='completed' ? `<button class="btn btn-accent" onclick="rateBooking('${b.id}')">Rate Service</button>` : ''}
      <button class="btn btn-outline" onclick="startChat(${t.id})">Message</button>
    </div>
  `;
}

async function cancelBooking(id){
  await api('api/booking_cancel.php?id='+id);
  const b = (window._bookings||[]).find(x=>x.id===id) || BOOKINGS.find(x=>x.id===id);
  if(b) b.status='cancelled';
  toast('Booking cancelled'); renderBookingDetail();
}
function rateBooking(id){
  openModal(`<h3>Rate Service</h3>
    <div style="text-align:center;font-size:32px;margin:12px 0">★★★★★</div>
    <div class="field"><label>Comment</label><textarea class="input" rows="3" placeholder="Share your experience..."></textarea></div>
    <button class="btn btn-primary" onclick="closeModal();toast('Thanks for your review!')">Submit Review</button>`);
}

// ---------- MESSAGES ----------
function renderMessages(){
  const ml = $('messagesList');
  if(!ml) return;
  ml.innerHTML = MESSAGES.map(m=>{
    const t = TECHNICIANS.find(x=>x.id===m.tech);
    return `<div class="list-item" onclick="openChat(${m.tech})">
      <img class="avatar" src="${t.avatar}" alt="">
      <div class="info">
        <div class="name">${t.name} ${m.unread?`<span class="badge badge-danger">${m.unread}</span>`:''}</div>
        <div class="sub">${m.last}</div>
      </div>
      <div class="small muted">${m.time}</div>
    </div>`;
  }).join('');
}
function openChat(id){ chatTech = id; showScreen('chat'); }

function renderChat(){
  const t = TECHNICIANS.find(x=>x.id===chatTech);
  const container = $('chatContent');
  if(!container) return;
  container.innerHTML = `
    <div style="padding:8px 0;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:10px">
      <img src="${t?t.avatar:''}" style="width:36px;height:36px;border-radius:50%;object-fit:cover">
      <div><div style="font-weight:700;font-size:14px">${t?t.name:''}</div><div class="small muted">Online</div></div>
    </div>
    <div style="flex:1;overflow-y:auto;padding:12px 0" id="chatThread"></div>
    <div style="display:flex;gap:8px;padding:8px 0">
      <input class="input" id="chatInput" placeholder="Type a message..." style="flex:1">
      <button class="btn btn-primary btn-sm" onclick="sendMsg()" style="width:auto">Send</button>
    </div>`;
  const thread = $('chatThread');
  thread.innerHTML = CHAT_THREAD.map(c=>`<div class="chat-bubble ${c.from==='me'?'me':'them'}">${c.text}<div class="small" style="opacity:.7;margin-top:2px">${c.time}</div></div>`).join('');
  thread.scrollTop = thread.scrollHeight;
}
function sendMsg(){
  const inp = $('chatInput');
  const txt = inp.value.trim();
  if(!txt) return;
  const thread = $('chatThread');
  const time = new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
  thread.innerHTML += `<div class="chat-bubble me">${txt}<div class="small" style="opacity:.7;margin-top:2px">${time}</div></div>`;
  inp.value='';
  thread.scrollTop = thread.scrollHeight;
  setTimeout(()=>{
    thread.innerHTML += `<div class="chat-bubble them">Thanks! I'll get back to you shortly.<div class="small" style="opacity:.7;margin-top:2px">${time}</div></div>`;
    thread.scrollTop = thread.scrollHeight;
  },1200);
}

// ---------- PHOTO TRIAGE ----------
let selectedPhoto = null;
function scanUsage(){ return Number(localStorage.getItem('fixdali_scan_usage')||0); }
function scanSubscribed(){ return localStorage.getItem('fixdali_scan_subscribed')==='true'; }
function renderScanQuota(){
  const el=$('scanQuota');
  if(!el) return;
  const used=scanUsage();
  if(scanSubscribed()) el.innerHTML='<div class="scan-quota-copy"><strong>AI Scan Plus</strong><span>Unlimited home issue scans</span></div><span class="scan-plan-badge">₱49 / month</span>';
  else el.innerHTML=`<div class="scan-quota-copy"><strong>${Math.max(0,3-used)} free scan${Math.max(0,3-used)===1?'':'s'} left</strong><span>Included with your FixDali account</span></div><div class="scan-dots">${[0,1,2].map(i=>`<i class="${i<used?'used':''}"></i>`).join('')}</div>`;
}
function openScanSubscription(){
  openModal(`<div class="subscription-modal"><div class="subscription-icon">✦</div><div class="eyebrow">AI SCAN PLUS</div><h3>Keep diagnosing home problems</h3><p class="muted">You’ve used your 3 free scans. Continue scanning damaged areas and get instant service recommendations.</p><div class="subscription-price"><strong>₱49</strong><span>/ month</span></div><div class="subscription-benefits"><span>✓ Unlimited photo scans</span><span>✓ Suggested repair category</span><span>✓ Matching trusted workers</span></div><button class="btn btn-primary" onclick="subscribeToScanPlus()">Subscribe for ₱49 / month</button><button class="btn btn-outline" onclick="closeModal()">Not now</button></div>`);
}
function subscribeToScanPlus(){
  localStorage.setItem('fixdali_scan_subscribed','true');
  closeModal();
  renderScanQuota();
  toast('AI Scan Plus is active');
}
function handlePhoto(event){
  const file = event.target.files && event.target.files[0];
  if(!file) return;
  if(!file.type.startsWith('image/') || file.size > 8 * 1024 * 1024){
    toast('Choose an image under 8 MB');
    event.target.value = '';
    return;
  }
  selectedPhoto = file;
  const reader = new FileReader();
  reader.onload = e => {
    $('photoPreview').src = e.target.result;
    $('photoPreviewWrap').classList.remove('hidden');
    $('uploadTitle').textContent = file.name;
    $('uploadHint').textContent = 'Photo ready — add a note if you like';
    $('analyzePhotoBtn').disabled = false;
    $('triageResult').classList.add('hidden');
  };
  reader.readAsDataURL(file);
}
function clearPhoto(){
  selectedPhoto = null;
  $('issuePhoto').value = '';
  $('photoPreview').removeAttribute('src');
  $('photoPreviewWrap').classList.add('hidden');
  $('uploadTitle').textContent = 'Add a photo';
  $('uploadHint').textContent = 'Tap to choose from your gallery or camera';
  $('analyzePhotoBtn').disabled = true;
  $('triageResult').classList.add('hidden');
}
function localPhotoGuess(){
  const text = (($('issueNotes').value||'')+' '+(selectedPhoto?.name||'')).toLowerCase();
  const rules = [
    {keys:['leak','water','pipe','faucet','sink','drain','toilet'],cat:'plumbing',title:'Plumbing service',detail:'This looks like a water or pipe issue. A plumber can inspect the source, stop the leak, and recommend the right repair.'},
    {keys:['wire','socket','outlet','switch','light','power','electrical'],cat:'electrical',title:'Electrical service',detail:'This sounds related to wiring, power, or a fixture. A certified electrician can make it safe and diagnose the fault.'},
    {keys:['paint','wall','ceiling','color','stain'],cat:'painting',title:'Painting service',detail:'A painting specialist can assess the surface, prep the area, and match the finish.'},
    {keys:['aircon','ac','cool','cooling','split'],cat:'ac',title:'AC repair service',detail:'An AC technician can check airflow, filters, refrigerant, and the unit’s electrical connections.'},
    {keys:['wash','fridge','refrigerator','oven','appliance'],cat:'appliance',title:'Appliance repair',detail:'An appliance specialist can inspect the unit and identify whether it needs a part, cleaning, or repair.'},
    {keys:['clean','dust','mess','sanitize'],cat:'cleaning',title:'Cleaning service',detail:'A cleaning professional can handle deep cleaning, sanitation, and the hard-to-reach areas shown.'},
    {keys:['wood','cabinet','furniture','door','shelf'],cat:'carpentry',title:'Carpentry service',detail:'A carpenter can inspect the woodwork, measure the damage, and repair or rebuild the affected area.'},
    {keys:['termite','roach','ant','pest','insect'],cat:'pest',title:'Pest control service',detail:'A pest specialist can identify the source, recommend a safe treatment, and help prevent it from returning.'}
  ];
  const hit = rules.find(r=>r.keys.some(k=>text.includes(k))) || {cat:'plumbing',title:'Home repair inspection',detail:'A trusted technician can inspect the photo in person and confirm the safest repair before work begins.'};
  return {...hit,confidence:text.length>8?'92% match':'78% match'};
}
async function analyzePhoto(){
  if(!selectedPhoto) return;
  if(!scanSubscribed() && scanUsage()>=3){ openScanSubscription(); return; }
  const btn = $('analyzePhotoBtn');
  btn.disabled = true; btn.innerHTML = '<span>Checking your photo…</span><span>• • •</span>';
  let result = null;
  try{
    const form = new FormData();
    form.append('photo', selectedPhoto);
    form.append('notes', $('issueNotes').value||'');
    const response = await Promise.race([
      fetch('api/analyze-photo.php',{method:'POST',body:form,credentials:'same-origin'}),
      new Promise((_, reject)=>setTimeout(()=>reject(new Error('analysis timeout')),7000))
    ]);
    if(response.ok) result = await response.json();
  }catch(e){ console.info('Photo analysis fallback',e); }
  result = result && result.category ? result : localPhotoGuess();
  const techs = (window._techs||TECHNICIANS).filter(t=>t.cat===result.category && (t.available==1||t.available===true));
  const primary = techs[0] || TECHNICIANS.find(t=>t.cat===result.category) || TECHNICIANS[0];
  const category = result.category||result.cat;
  $('triageResult').innerHTML = `<div class="result-kicker">OUR BEST MATCH</div><h3>${result.title}</h3><div class="result-meta"><span class="badge badge-info">${catName(category)}</span><span class="confidence">${result.confidence||'Recommended'}</span></div><p class="result-explain">${result.detail||result.explanation||'We found a service category that should be a good starting point.'}</p><div class="match-tech"><img src="${primary.avatar||''}" alt=""><div><strong>${primary.name}</strong><span>${primary.rating} ★ · ${primary.exp} experience</span></div><em>From ₱${primary.price}/hr</em></div><div class="result-actions"><button class="btn btn-outline" onclick="startBooking(${primary.id})">Book ${primary.name.split(' ')[0]}</button><button class="btn btn-primary" onclick="openCategory('${category}')">See all matches <span>→</span></button></div>`;
  $('triageResult').classList.remove('hidden');
  if(!scanSubscribed()) localStorage.setItem('fixdali_scan_usage',String(scanUsage()+1));
  renderScanQuota();
  btn.disabled = false; btn.innerHTML = '<span>Find my service</span><span>→</span>';
  toast('Service match ready');
}

// ---------- NOTIFICATIONS ----------
async function renderNotifications(){
  const list = await api('api/notifications.php');
  const data = list || NOTIFICATIONS;
  const container = $('notifList');
  if(!container) return;
  container.innerHTML = data.map(n=>`
    <div class="notif">
      <div class="ico">${n.ico}</div>
      <div style="flex:1">
        <div style="font-weight:700;font-size:13px">${n.title}</div>
        <div class="muted" style="font-size:12px">${n.body}</div>
        <div class="small muted" style="margin-top:2px">${n.time}</div>
      </div>
    </div>`).join('');
}

// ---------- PROFILE ----------
function renderProfile(){
  $('profAvatar').src = USER.avatar;
  $('profName').textContent = USER.name;
  $('profEmail').textContent = USER.email;
  $('addrList').innerHTML = ADDRESSES.map(a=>`<div class="row" style="padding:8px 0;border-bottom:1px solid var(--border)"><span style="font-weight:600">${a.label}</span><span style="margin-left:auto" class="muted small">${a.value}</span></div>`).join('');
  $('payList').innerHTML = PAYMENTS.map(p=>`<div class="row" style="padding:8px 0;border-bottom:1px solid var(--border)"><span style="font-weight:600">${p.type}</span><span style="margin-left:auto" class="muted small">${p.value} ${p.primary?'<span class="badge badge-success">Primary</span>':''}</span></div>`).join('');
}

// ---------- ADMIN ----------
function doWorkerLogin(){
  const email = ($('workerEmail').value||'').trim().toLowerCase();
  const worker = TECHNICIANS.find(t=>t.id===1) || TECHNICIANS[0];
  currentWorker = worker;
  if(email && email !== 'juan@fixdali.test') toast('Demo mode: opening Juan’s dashboard');
  else toast('Welcome back, '+worker.name.split(' ')[0]);
  showScreen('workerDash');
}
function workerBookings(){
  return BOOKINGS.filter(b=>(b.tech_id||b.tech)===(currentWorker?.id||1) && b.status!=='cancelled');
}
function renderWorkerDashboard(){
  const w = currentWorker || TECHNICIANS[0];
  const jobs = workerBookings();
  const pending = jobs.filter(b=>b.status==='pending').length;
  const content = $('workerDashContent');
  if(!content) return;
  content.innerHTML = `
    <div class="worker-welcome"><div class="worker-welcome-copy"><div class="eyebrow">FIXDALI PARTNER · MON, NOV 23</div><h2>Good morning, ${w.name.split(' ')[0]}</h2><p>Stay on top of today’s service requests.</p></div><div class="worker-avatar-wrap"><img src="${w.avatar}" alt="${w.name}"><span class="online-dot"></span></div></div>
    <div class="worker-availability"><div><span class="availability-dot ${workerAvailable?'on':''}"></span><div><strong>${workerAvailable?'You’re available':'You’re offline'}</strong><small>${workerAvailable?'Customers can request your services':'New requests are paused'}</small></div></div><button class="availability-switch ${workerAvailable?'on':''}" onclick="toggleWorkerAvailability()"><span></span></button></div>
    <div class="worker-stats"><div><span class="stat-icon">▣</span><strong>${jobs.length}</strong><span>Assigned jobs</span></div><div><span class="stat-icon amber">!</span><strong>${pending}</strong><span>Needs response</span></div><div><span class="stat-icon green">★</span><strong>${w.rating}</strong><span>Your rating</span></div></div>
    <div class="section-title worker-section-head"><span>My service requests</span><span class="badge badge-warning">${pending} to review</span></div>
    <div class="worker-job-list">${jobs.length ? jobs.map(workerJobCard).join('') : '<div class="empty"><div class="ico">✓</div>No assigned jobs yet</div>'}</div>
    <div class="section-title worker-section-head"><span>Partner profile</span><button class="text-button" onclick="editWorkerProfile()">Edit</button></div>
    <div class="worker-profile-card"><img src="${w.avatar}" alt=""><div><strong>${w.name}</strong><span>${catName(w.cat)} · ${w.exp} experience</span><span>${w.rating} ★ · ${w.reviews} reviews</span></div><span class="badge badge-success">Verified</span></div>
    <button class="btn btn-outline worker-logout" onclick="currentWorker=null;showScreen('login')">Log out of worker portal</button>`;
}
function workerJobCard(b){
  const customer = b.customer || 'Ashley Reyes';
  const isPending = b.status==='pending';
  const cat = CATEGORIES.find(c=>b.service.toLowerCase().includes(c.name.split(' ')[0].toLowerCase())) || CATEGORIES.find(c=>c.id===currentWorker?.cat);
  return `<div class="worker-job-card"><div class="worker-job-top"><div class="worker-job-title"><span class="worker-job-icon">${cat?.ico||'🔧'}</span><div><strong>${b.service}</strong><span>${b.id} · ${b.date||b.booking_date} at ${b.time||b.booking_time}</span></div></div><span class="badge ${statusBadge(b.status)}">${isPending?'New request':b.status}</span></div><div class="worker-customer"><span class="customer-avatar">${customer.charAt(0)}</span><div><strong>${customer}</strong><span>${b.address||'123 Rizal St., Dali'}</span></div><button class="icon-btn light-icon" onclick="workerOpenChat('${b.id}')">💬</button></div><div class="worker-job-meta"><span>Estimated payout</span><strong>₱${b.price||currentWorker?.price||450}</strong></div><div class="worker-job-actions">${isPending?`<button class="btn btn-primary btn-sm" onclick="workerConfirmBooking('${b.id}')">Accept request</button>`:'<span class="confirmed-label">✓ Customer notified</span>'}<button class="btn btn-outline btn-sm" onclick="workerOpenChat('${b.id}')">Chat customer</button></div></div>`;
}
function toggleWorkerAvailability(){
  workerAvailable=!workerAvailable;
  renderWorkerDashboard();
  toast(workerAvailable?'You’re now available':'New requests paused');
}
function workerConfirmBooking(id){
  const b = BOOKINGS.find(x=>x.id===id);
  if(!b) return;
  b.status='confirmed';
  toast('Service confirmed — customer notified');
  renderWorkerDashboard();
}
function editWorkerProfile(){
  const w = currentWorker || TECHNICIANS[0];
  openModal(`<h3>Edit partner profile</h3><div class="field"><label>Display name</label><input class="input" id="workerEditName" value="${w.name}"></div><div class="field"><label>About your service</label><textarea class="input" id="workerEditBio" rows="4">${w.bio}</textarea></div><div class="field"><label>Hourly rate (₱)</label><input class="input" id="workerEditPrice" type="number" value="${w.price}"></div><button class="btn btn-primary" onclick="saveWorkerProfile()">Save profile</button>`);
}
function saveWorkerProfile(){
  const w = currentWorker || TECHNICIANS[0];
  w.name = $('workerEditName').value.trim() || w.name;
  w.bio = $('workerEditBio').value.trim() || w.bio;
  w.price = Number($('workerEditPrice').value) || w.price;
  closeModal();
  renderWorkerDashboard();
  toast('Profile updated');
}
function workerOpenChat(bookingId){
  workerChatBooking = bookingId;
  const b = BOOKINGS.find(x=>x.id===bookingId) || {};
  const customer = b.customer || 'Ashley Reyes';
  openModal(`<div class="worker-chat-head"><div class="customer-avatar">${customer.charAt(0)}</div><div><strong>${customer}</strong><span>${b.service||'Service request'}</span></div></div><div class="worker-chat-thread" id="workerChatThread"><div class="chat-bubble them">Hi! I’m reviewing your service request now.</div><div class="chat-bubble me">Thanks, I’ll confirm the schedule shortly.</div></div><div class="worker-chat-compose"><input class="input" id="workerChatInput" placeholder="Message customer..."><button class="btn btn-primary btn-sm" onclick="sendWorkerMessage()">Send</button></div>`);
}
function sendWorkerMessage(){
  const input=$('workerChatInput'), text=input?.value.trim();
  if(!text) return;
  const thread=$('workerChatThread');
  thread.innerHTML += `<div class="chat-bubble me">${text}</div>`;
  input.value='';
  toast('Message sent');
}

async function renderAdmin(){
  const stats = $('adminStats');
  if(stats) stats.innerHTML = ADMIN_STATS.map(s=>`<div class="stat"><div class="val">${s.val}</div><div class="lbl">${s.lbl}</div></div>`).join('');
  const aiCard=$('adminAiCard');
  if(aiCard) aiCard.innerHTML=`<div class="admin-ai-card"><div class="admin-ai-top"><div><div class="eyebrow">RECURRING REVENUE</div><h3>AI Scanning Subscription</h3><p>3 free scans per user, then AI Scan Plus at ${ADMIN_AI.price}.</p></div><span class="ai-spark">✦</span></div><div class="admin-ai-metrics"><div><strong>${ADMIN_AI.subscribers}</strong><span>Subscribers</span></div><div><strong>${ADMIN_AI.mrr}</strong><span>Monthly revenue</span></div><div><strong>${ADMIN_AI.freeScansUsed}</strong><span>Free scans used</span></div></div></div>`;
  let bks = await api('api/bookings.php');
  if(!bks) bks = (window._bookings||BOOKINGS);
  const ab = $('adminBookings');
  if(ab) ab.innerHTML = bks.map(b=>`
    <div class="list-item">
      <div class="info">
        <div class="name">${b.id} · ${b.customer||'User'}</div>
        <div class="sub">Tech: ${(window._techs||TECHNICIANS).find(t=>t.id==(b.tech_id||b.tech))?.name||''}</div>
      </div>
      <div style="text-align:right">
        <span class="badge ${statusBadge(b.status)}">${b.status}</span>
        <div class="price" style="margin-top:4px">₱${b.price}</div>
      </div>
    </div>`).join('');
}

// ---------- AUTH ----------
async function doLogin(){
  const email = $('loginEmail').value;
  const pass = $('loginPass').value;
  const res = await api('api/login.php', {method:'POST', body: JSON.stringify({email,password:pass})});
  if(res && res.success){ currentUser = res.user; toast('Welcome back, '+(res.user.name||'!')); showScreen('home'); }
  else { toast('Login failed (demo mode)'); currentUser = USER; showScreen('home'); }
}
async function doRegister(){
  const res = await api('api/register.php', {method:'POST', body: JSON.stringify({name:$('regName').value,email:$('regEmail').value,phone:$('regPhone').value,password:$('regPass').value})});
  if(res && res.success){ currentUser = res.user; toast('Account created!'); showScreen('home'); }
  else { toast('Register failed (demo mode)'); currentUser = USER; showScreen('home'); }
}

// ---------- MODAL ----------
function openModal(html){ $('modalContent').innerHTML = html; $('modalBackdrop').classList.add('show'); }
function closeModal(e){ if(!e || e.target.id==='modalBackdrop'){ $('modalBackdrop').classList.remove('show'); } }

// ---------- TOAST ----------
let toastTimer;
function toast(msg){
  const t = $('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>t.classList.remove('show'),2200);
}

function onRightBtn(){
  if(currentScreen==='home'){ showScreen('notifications'); }
  else if(currentScreen==='profile'){ toast('Settings'); }
  else { toast('Menu'); }
}

document.addEventListener('DOMContentLoaded', ()=>{
  setOnboardImgs();
});
