/* -------------------------
  Daten (später extern als JSON)
   ------------------------- */
const games = [
  { title:"Wahrheit oder Pflicht", desc:"Klassiker für mutige Runden", players:"2-12 Spieler", color:"#ff7675" },
  { title:"Wer würde eher", desc:"Lustige Vermutungen über Freunde", players:"3-10 Spieler", color:"#0984e3" },
  { title:"Ich hab noch nie", desc:"Erfahrt mehr übereinander", players:"3-15 Spieler", color:"#a29bfe" },
  { title:"Entweder/Oder", desc:"Schnelle Entscheidungen", players:"2-8 Spieler", color:"#00b894" },
  { title:"Team-Duelle", desc:"Zwei Teams treten gegeneinander an", players:"4-20 Spieler", color:"#fdcb6e" },
  { title:"Quiz-Show", desc:"Wer sammelt am meisten Punkte?", players:"2-8 Spieler", color:"#e17055" },
  { title:"Melodien-Raten", desc:"Errate den Song in 10 Sekunden", players:"2-12 Spieler", color:"#6c5ce7" },
  { title:"Foto-Challenge", desc:"Kreative Fotoaufgaben für Punkte", players:"2-20 Spieler", color:"#00a8ff" }
];

/* -------------------------
  RENDERING
   ------------------------- */
const gameList = document.getElementById('game-list');
function renderGames(){
  gameList.innerHTML = "";
  games.forEach(g => {
    const el = document.createElement('div');
    el.className = 'card';
    el.innerHTML = `
      <div class="meta">
        <div class="tag" style="display:flex;gap:8px;align-items:center">
          <div style="width:44px;height:44px;border-radius:8px;background:${g.color};display:flex;align-items:center;justify-content:center;color:white;font-weight:700">${g.title.split(' ').map(s => s[0]).slice(0,2).join('')}</div>
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
renderGames();

/* -------------------------
  THEME SWITCH (auto + manual)
   - wir unterstützen:
     - auto (prefers-color-scheme)
     - light
     - dark
   - speichern in localStorage: 'gc-theme' = 'auto'|'light'|'dark'
   ------------------------- */

// helper
const root = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const themeLabel = document.getElementById('themeLabel');

function applyTheme(mode){
  // mode: 'auto' | 'light' | 'dark'
  if(mode === 'auto'){
    // check matchMedia
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    themeToggle.checked = false;
    themeLabel.textContent = 'Auto';
  } else if(mode === 'dark'){
    root.setAttribute('data-theme','dark');
    themeToggle.checked = true;
    themeLabel.textContent = 'Dunkel';
  } else {
    root.setAttribute('data-theme','light');
    themeToggle.checked = false;
    themeLabel.textContent = 'Hell';
  }
  localStorage.setItem('gc-theme', mode);
}

function initTheme(){
  const saved = localStorage.getItem('gc-theme') || 'auto';
  applyTheme(saved);

  // if auto: listen to system changes
  if(saved === 'auto'){
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      applyTheme('auto');
    });
  }
}
initTheme();

// Toggle behavior: clicking checkbox cycles modes: auto -> dark -> light -> auto
let modeCycle = (() => {
  const map = { 'auto':'dark','dark':'light','light':'auto' };
  return () => {
    const cur = localStorage.getItem('gc-theme') || 'auto';
    const next = map[cur];
    applyTheme(next);
  };
})();
document.querySelector('.theme-row').addEventListener('click', modeCycle);

/* -------------------------
  SIDEBAR TOGGLE (mobile)
   ------------------------- */
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
sidebarToggle.addEventListener('click', () => {
  const nav = document.querySelector('.nav');
  nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
});

/* -------------------------
  MINI STATUS / LOGIN (lokale Demo)
   ------------------------- */
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

openLogin.addEventListener('click', () => {
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden','false');
  // fill
  usernameInput.value = user ? user.name : '';
  renderStats();
});
modalClose.addEventListener('click', closeModal);
function closeModal(){
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden','true');
}

saveUser.addEventListener('click', () => {
  const name = usernameInput.value.trim();
  if(!name){ alert('Bitte Namen eingeben'); return; }
  user = { name, id: 'u_' + Date.now() };
  localStorage.setItem('gc-user', JSON.stringify(user));
  // ensure stats slot
  if(!stats[user.id]) stats[user.id] = { plays:0, wins:0, lastPlay: null };
  localStorage.setItem('gc-stats', JSON.stringify(stats));
  updateMini();
  renderStats();
  alert('Gespeichert (lokal)');
});

logoutBtn.addEventListener('click', () => {
  if(confirm('Lokales Profil entfernen?')) {
    if(user) {
      // optional keep stats; here we don't delete stats, just remove user pointer
      localStorage.removeItem('gc-user');
      user = null;
      updateMini();
      renderStats();
    }
  }
});

function renderStats(){
  statsList.innerHTML = '';
  if(!user){
    statsList.innerHTML = '<p class="muted">Kein eingeloggter Benutzer. Erstelle ein lokales Profil für Demo-Statistiken.</p>';
    return;
  }
  const s = stats[user.id] || { plays:0, wins:0, lastPlay:null };
  statsList.innerHTML = `
    <div><strong>Benutzer:</strong> ${user.name}</div>
    <div><strong>Runden gespielt:</strong> ${s.plays}</div>
    <div><strong>Siege:</strong> ${s.wins}</div>
    <div><strong>Letzte Runde:</strong> ${s.lastPlay || '-'}</div>
    <div style="margin-top:10px;">
      <button id="addPlay" class="btn">+ Runde simulieren</button>
      <button id="resetStats" class="btn">Reset</button>
    </div>
  `;
  document.getElementById('addPlay').addEventListener('click', () => {
    if(!stats[user.id]) stats[user.id] = { plays:0, wins:0, lastPlay:null };
    stats[user.id].plays++;
    stats[user.id].lastPlay = new Date().toLocaleString();
    localStorage.setItem('gc-stats', JSON.stringify(stats));
    renderStats();
  });
  document.getElementById('resetStats').addEventListener('click', () => {
    if(confirm('Statistiken für diesen Nutzer wirklich zurücksetzen?')) {
      stats[user.id] = { plays:0, wins:0, lastPlay:null };
      localStorage.setItem('gc-stats', JSON.stringify(stats));
      renderStats();
    }
  });
}

/* EXPORT / IMPORT */
exportStats.addEventListener('click', () => {
  const data = { stats, user };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type:'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'gamecircle_stats.json'; document.body.appendChild(a); a.click();
  a.remove(); URL.revokeObjectURL(url);
});
importStats.addEventListener('click', () => importFile.click());
importFile.addEventListener('change', (e) => {
  const f = e.target.files[0];
  if(!f) return;
  const reader = new FileReader();
  reader.onload = () => {
    try{
      const parsed = JSON.parse(reader.result);
      if(parsed.stats) {
        stats = parsed.stats;
        if(parsed.user) localStorage.setItem('gc-user', JSON.stringify(parsed.user));
        localStorage.setItem('gc-stats', JSON.stringify(stats));
        user = JSON.parse(localStorage.getItem('gc-user') || 'null');
        updateMini(); renderStats();
        alert('Import erfolgreich');
      } else alert('Ungültiges Format');
    } catch(err){ alert('Fehler beim Import'); }
  };
  reader.readAsText(f);
});

/* init year */
document.getElementById('year').textContent = new Date().getFullYear();

/* Start-Button scroll to games */
document.getElementById('startBtn').addEventListener('click', () => {
  document.querySelector('.games').scrollIntoView({behavior:'smooth'});
});

/* small helper to auto-close modal on ESC */
window.addEventListener('keydown', (e) => {
  if(e.key === 'Escape') closeModal();
});
