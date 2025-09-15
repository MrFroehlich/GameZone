/* -------------------------
   ELEMENTE
------------------------- */
const gameList = document.getElementById('game-list');
const gamesGrid = document.getElementById('games-grid');
const root = document.documentElement;
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebarOverlay = document.getElementById('sidebarOverlay');
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
  .then(res=>res.json())
  .then(data=>{ games=data; renderGames(); renderGamesPage(); })
  .catch(err=>console.error('Fehler beim Laden der Spiele:',err));

/* -------------------------
   RENDER HOMEPAGE
------------------------- */
function renderGames(){
  gameList.innerHTML='';
  games.forEach((g,i)=>{
    const el=document.createElement('div');
    el.className='card';
    el.style.animationDelay=`${i*0.05}s`;
    el.innerHTML=`
      <div class="meta">
        <div class="tag">
          <div style="background:${g.color}">${g.title.split(' ').map(s=>s[0]).slice(0,2).join('')}</div>
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
   RENDER SPIELE PAGE
------------------------- */
function renderGamesPage(){
  gamesGrid.innerHTML='';
  games.forEach((g,i)=>{
    const el=document.createElement('div');
    el.className='card';
    el.style.animationDelay=`${i*0.04}s`;
    el.innerHTML=`
      <h3>${g.title}</h3>
      <p>${g.desc}</p>
      <small>Spieler: ${g.players}</small>
      <div class="tag" style="margin-top:6px;">${g.tags.map(t=>`<span style="background:${g.color};padding:2px 6px;border-radius:6px;color:white;margin-right:4px">${t}</span>`).join('')}</div>
    `;
    gamesGrid.appendChild(el);
  });
}

/* -------------------------
   SIDEBAR MOBILE TOGGLE
------------------------- */
sidebarToggle.addEventListener('click',()=>{
  sidebar.style.transform='translateX(0)';
  sidebarOverlay.classList.remove('hidden');
});
sidebarOverlay.addEventListener('click',()=>{
  sidebar.style.transform='translateX(-100%)';
  sidebarOverlay.classList.add('hidden');
});

/* -------------------------
   THEME SLIDER
------------------------- */
const points=document.querySelectorAll('.theme-points span');
const marker=document.querySelector('.marker');
points.forEach((p,i)=>{
  p.addEventListener('click',()=>{
    marker.style.left=`${i*36}px`;
    const mode=p.dataset.mode;
    if(mode==='auto'){ root.removeAttribute('data-theme'); }
    else{ root.setAttribute('data-theme',mode); }
  });
});

/* -------------------------
   LOGIN MODAL
------------------------- */
openLogin.addEventListener('click',()=> modal.classList.remove('hidden'));
modalClose.addEventListener('click',()=> modal.classList.add('hidden'));
saveUser.addEventListener('click',()=>{
  const name=usernameInput.value.trim();
  if(!name) return alert('Bitte Name eingeben');
  localStorage.setItem('gc_user',name);
  miniName.textContent=name;
  modal.classList.add('hidden');
});
logoutBtn.addEventListener('click',()=>{
  localStorage.removeItem('gc_user');
  miniName.textContent='GameCircle';
});

/* -------------------------
   USER INIT
------------------------- */
const saved=localStorage.getItem('gc_user');
if(saved) miniName.textContent=saved;

/* -------------------------
   FOOTER YEAR
------------------------- */
document.getElementById('year').textContent=new Date().getFullYear();

/* -------------------------
   START BUTTON
------------------------- */
startBtn.addEventListener('click',()=>{
  alert('Hier würde das Spiel starten!');
});
