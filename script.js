/* -------------------------
   ELEMENTE
------------------------- */
const gameList = document.getElementById('game-list');
const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const themeLabel = document.getElementById('themeLabel');
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar = document.getElementById('sidebar');

const miniName = document.getElementById('miniName');
const openLogin = document.getElementById('openLogin');
const modal = document.getElementById('modal');
const modalClose = document.getElementById('modalClose');
const saveUser = document.getElementById('saveUser');
const logoutBtn = document.getElementById('logoutBtn');
const usernameInput = document.getElementById('username');
const statsList = document.getElementById('statsList');
const exportStats = document.getElementById('exportStats');
const importStats = document.getElementById('importStats');
const importFile = document.getElementById('importFile');
const startBtn = document.getElementById('startBtn');

/* -------------------------
   DATEN LADEN
------------------------- */
let games = [];
fetch('modes.json')
  .then(res => res.json())
  .then(data => { games = data; renderGames(); })
  .catch(err => console.error('Fehler beim Laden der Spiele:', err));

/* -------------------------
   RENDERING
------------------------- */
function renderGames(){
  gameList.innerHTML = '';
  games.forEach((g, i) => {
    const el = document.createElement('div');
    el.className = 'card';
    el.style.animationDelay = `${i*0.05}s`;
    el.innerHTML = `
      <div class="meta">
        <div class="tag" style="display:flex;gap:8px;align-items:center">
          <div style="width:44px;height:44px;border-radius:8px;background:${g.color};display:flex;align-items:center;justify-content:center;color:white;font-weight:700">
            ${g.title.split(' ').map(s=>s[0]).slice(0,2).join('')}
          </div>
          <div style="font-weight:700">${g.title}</div>
        </div>
        <div class="rating">★★★★★</div>
      </div>
      <p>${g.desc}</p>
      <div style="display:flex;justify-content:space-between;align-items:center">
        <small style="color:var(--muted)">${g.players}</small>
        <button class="btn" onclick="alert('Starte: ${g.title}')">→</button>
      </div>
    `;
    gameList.appendChild(el);
  });
}

/* -------------------------
   THEME SWITCH (Auto/Hell/Dunkel)
------------------------- */
let themeCycle = ['auto','dark','light'];
function applyTheme(mode){
  if(mode === 'auto'){
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    themeLabel.textContent = 'Auto';
    document.querySelector('.theme-slider').style.left = '0px';
  } else if(mode === 'dark'){
    root.setAttribute('data-theme','dark');
    themeLabel.textContent = 'Dunkel';
    document.querySelector('.theme-slider').style.left = '22px';
  } else {
    root.setAttribute('data-theme','light');
    themeLabel.textContent = 'Hell';
    document.querySelector('.theme-slider').style.left = '44px';
  }
  localStorage.setItem('gc-theme', mode);
}

function initTheme(){
  const saved = localStorage.getItem('gc-theme') || 'auto';
  applyTheme(saved);
  if(saved==='auto'){
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', ()=>applyTheme('auto'));
  }
}
initTheme();

document.querySelector('.theme-row').addEventListener('click', ()=>{
  let cur = localStorage.getItem('gc-theme')||'auto';
  let next = themeCycle[(themeCycle.indexOf(cur)+1)%themeCycle.length];
  applyTheme(next);
});

/* -------------------------
   SIDEBAR TOGGLE MOBILE
------------------------- */
sidebarToggle.addEventListener('click', ()=>{
  const nav = document.querySelector('.nav');
  if(nav.style.display==='flex'){ nav.style.display='none'; }
  else { nav.style.display='flex'; }
});

/* -------------------------
   MINI STATUS / LOGIN
------------------------- */
let user = JSON.parse(localStorage.getItem('gc-user') || 'null');
let stats = JSON.parse(localStorage.getItem('gc-stats') || '{}');

function updateMini(){
  if(user && user.name){
    miniName.textContent = user.name;
    document.querySelector('.status-mini .avatar').textContent = user.name.charAt(0).toUpperCase();
  } else {
    miniName.textContent = 'GameCircle';
    document.querySelector('.status-mini .avatar').textContent = 'G';
  }
}
updateMini();

openLogin.addEventListener('click', ()=>{
  modal.classList.remove('hidden'); modal.setAttribute('aria-hidden','false');
  usernameInput.value = user?user.name:'';
  renderStats();
});
modalClose.addEventListener('click', ()=>{ modal.classList.add('hidden'); modal.setAttribute('aria-hidden','true'); });

saveUser.addEventListener('click', ()=>{
  const name = usernameInput.value.trim();
  if(!name){ alert('Bitte Namen eingeben'); return; }
  user={ name, id:'u_'+Date.now() };
  localStorage.setItem('gc-user',JSON.stringify(user));
  if(!stats[user.id]) stats[user.id]={plays:0,wins:0,lastPlay:null};
  localStorage.setItem('gc-stats',JSON.stringify(stats));
  updateMini(); renderStats();
  alert('Gespeichert (lokal)');
});

logoutBtn.addEventListener('click', ()=>{
  if(confirm('Lokales Profil entfernen?')){
    localStorage.removeItem('gc-user');
    user=null; updateMini(); renderStats();
  }
});

function renderStats(){
  statsList.innerHTML='';
  if(!user){
    statsList.innerHTML='<p class="muted">Kein eingeloggter Benutzer. Erstelle ein lokales Profil für Demo-Statistiken.</p>';
    return;
  }
  const s = stats[user.id]||{plays:0,wins:0,lastPlay:null};
  statsList.innerHTML=`
    <div><strong>Benutzer:</strong> ${user.name}</div>
    <div><strong>Runden gespielt:</strong> ${s.plays}</div>
    <div><strong>Siege:</strong> ${s.wins}</div>
    <div><strong>Letzte Runde:</strong> ${s.lastPlay||'-'}</div>
    <div style="margin-top:10px;">
      <button id="addPlay" class="btn">+ Runde simulieren</button>
      <button id="resetStats" class="btn">Reset</button>
    </div>
  `;
  document.getElementById('addPlay').addEventListener('click', ()=>{
    if(!stats[user.id]) stats[user.id]={plays:0,wins:0,lastPlay:null};
    stats[user.id].plays++; stats[user.id].lastPlay=new Date().toLocaleString();
    localStorage.setItem('gc-stats',JSON.stringify(stats));
    renderStats();
  });
  document.getElementById('resetStats').addEventListener('click', ()=>{
    if(confirm('Statistiken für diesen Nutzer wirklich zurücksetzen?')){
      stats[user.id]={plays:0,wins:0,lastPlay:null};
      localStorage.setItem('gc-stats',JSON.stringify(stats));
      renderStats();
    }
  });
}

/* -------------------------
   EXPORT / IMPORT
------------------------- */
exportStats.addEventListener('click', ()=>{
  const data={stats,user};
  const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;a.download='gamecircle_stats.json';document.body.appendChild(a);a.click();
  a.remove();URL.revokeObjectURL(url);
});

importStats.addEventListener('click', ()=>importFile.click());
importFile.addEventListener('change',(e)=>{
  const f=e.target.files[0]; if(!f) return;
  const reader=new FileReader();
  reader.onload=()=>{
    try{
      const data=JSON.parse(reader.result);
      if(data.stats) stats=data.stats;
      if(data.user) { user=data.user; localStorage.setItem('gc-user',JSON.stringify(user)); }
      localStorage.setItem('gc-stats',JSON.stringify(stats));
      updateMini(); renderStats();
      alert('Import erfolgreich');
    }catch(err){alert('Fehler beim Import');}
  };
  reader.readAsText(f);
});

/* -------------------------
   START BUTTON DEMO
------------------------- */
startBtn.addEventListener('click', ()=>{
  alert('Spielstart-Demo: Wähle später Modus oder Karte!');
});
