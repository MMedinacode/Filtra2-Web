/* =====================================================================
   FILTRA2 — script.js (Vanilla JS)
   ===================================================================== */

/* ===================== NAVEGACIÓN SPA POR PESTAÑAS ===================== */
const navLinks = document.querySelectorAll('[data-tab]');
const panels = document.querySelectorAll('.tab-panel');

function goToTab(tabId){
  panels.forEach(p => p.classList.toggle('active', p.dataset.tabPanel === tabId));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.toggle('active', l.dataset.tab === tabId));
  window.scrollTo({ top: 0, behavior: 'smooth' });
  document.getElementById('main-nav').classList.remove('open');
}

navLinks.forEach(el => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    goToTab(el.dataset.tab);
  });
});

document.getElementById('menu-toggle').addEventListener('click', () => {
  document.getElementById('main-nav').classList.toggle('open');
});

/* ===================== SCROLL REVEAL ===================== */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('show'); });
}, { threshold: 0.15 });
document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
panels.forEach(p => {
  const mo = new MutationObserver(() => {
    if (p.classList.contains('active')) {
      p.querySelectorAll('.fade-up').forEach(el => {
        if (!el.classList.contains('show')) observer.observe(el);
      });
    }
  });
  mo.observe(p, { attributes: true, attributeFilter: ['class'] });
});

/* ===================== CARTA: TABS DE MENÚ ===================== */
document.querySelectorAll('.menu-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.menu-tab').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.menu-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('panel-' + btn.dataset.tab).classList.add('active');
  });
});

/* ===================== ENLACES DE GOOGLE (PLACE ID REAL) ===================== */
/* Place ID confirmado en Google Maps para "FILTRA2 CAFE", Portugal 87 Local 2B, Santiago Centro. */
const PLACE_ID = '0x9662c5601ff670bf:0x11ca0986d1f96b8a';
document.getElementById('reviews-link').href = `https://search.google.com/local/writereview?placeid=${PLACE_ID}`;
document.getElementById('directions-link').href = `https://www.google.com/maps/dir/?api=1&destination=Filtra2+Cafe&destination_place_id=${PLACE_ID}`;

/* ===================== HORARIO / ABIERTO-CERRADO ===================== */
/* Horario real verificado en Google Maps (ficha "FILTRA2 CAFE"). */
const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const HOURS = {
  0: null,
  1: { open: 7.5, close: 18 + 20/60 }, 2: { open: 7.5, close: 18 + 20/60 }, 3: { open: 7.5, close: 18 + 20/60 },
  4: { open: 7.5, close: 18 + 20/60 }, 5: { open: 7.5, close: 18 + 20/60 },
  6: { open: 9 + 40/60, close: 15 }
};

function fmtHour(h){
  const hh = Math.floor(h);
  const mm = Math.round((h - hh) * 60);
  return `${hh}:${mm.toString().padStart(2, '0')}`;
}

function renderHours(){
  const list = document.getElementById('hours-list');
  list.innerHTML = DIAS.map((d, i) => {
    const h = HOURS[i];
    return `<div><span>${d}</span><span>${h ? fmtHour(h.open) + ' – ' + fmtHour(h.close) : 'Cerrado'}</span></div>`;
  }).join('');

  const now = new Date();
  const day = now.getDay();
  const hourDecimal = now.getHours() + now.getMinutes() / 60;
  const badge = document.getElementById('open-badge');
  const today = HOURS[day];
  if (today && hourDecimal >= today.open && hourDecimal < today.close){
    badge.textContent = `Abierto ahora · cierra ${fmtHour(today.close)}`;
    badge.className = 'open-badge open';
  } else {
    badge.textContent = 'Cerrado ahora';
    badge.className = 'open-badge closed';
  }
}
renderHours();
