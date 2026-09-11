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

/* ===================== CARTA: DATOS Y RENDER ===================== */
const fmt = n => '$' + n.toLocaleString('es-CL');

/* Ilustraciones genéricas livianas (SVG) por categoría — no son fotos reales del producto,
   pero le dan una presentación mucho más visual a la carta sin pesar nada. */
const CAT_ART = {
  sinleche: '<svg viewBox="0 0 100 70" width="100%" height="100%" preserveAspectRatio="xMidYMid slice"><rect width="100" height="70" fill="var(--terracotta-deep)"/><g stroke="var(--blush)" stroke-width="1.6" fill="none" opacity=".9"><path d="M30 30h34v13a13 13 0 0 1-13 13H43a13 13 0 0 1-13-13V30z"/><path d="M64 33h4a6.5 6.5 0 0 1 0 13h-4"/><path d="M40 24c0 2-2.5 2-2.5 4.5S40 31 40 33M50 24c0 2-2.5 2-2.5 4.5S50 31 50 33"/></g></svg>',
  conleche: '<svg viewBox="0 0 100 70" width="100%" height="100%" preserveAspectRatio="xMidYMid slice"><rect width="100" height="70" fill="var(--terracotta-deep)"/><g stroke="var(--blush)" stroke-width="1.6" fill="none" opacity=".9"><path d="M30 30h34v13a13 13 0 0 1-13 13H43a13 13 0 0 1-13-13V30z"/><path d="M64 33h4a6.5 6.5 0 0 1 0 13h-4"/><path d="M37 30c3 3 3 5 0 7s0 5 3 7 0 5-1 6"/></g></svg>',
  frias: '<svg viewBox="0 0 100 70" width="100%" height="100%" preserveAspectRatio="xMidYMid slice"><rect width="100" height="70" fill="var(--sage-deep)"/><g stroke="var(--blush)" stroke-width="1.6" fill="none" opacity=".9"><path d="M35 22h30l-3 34a4 4 0 0 1-4 4H42a4 4 0 0 1-4-4l-3-34z"/><path d="M39 30h22M37 40h26"/></g></svg>',
  pasteleria: '<svg viewBox="0 0 100 70" width="100%" height="100%" preserveAspectRatio="xMidYMid slice"><rect width="100" height="70" fill="var(--terracotta-deep)"/><g stroke="var(--blush)" stroke-width="1.6" fill="none" opacity=".9"><path d="M27 42c0-9 10-16 23-16s23 7 23 16"/><path d="M27 42h46l-3 10a3 3 0 0 1-3 2H33a3 3 0 0 1-3-2z"/><path d="M50 26v-6M44 24l-1.5-5M56 24l1.5-5"/></g></svg>',
  sandwiches: '<svg viewBox="0 0 100 70" width="100%" height="100%" preserveAspectRatio="xMidYMid slice"><rect width="100" height="70" fill="var(--sage-deep)"/><g stroke="var(--blush)" stroke-width="1.6" fill="none" opacity=".9"><path d="M24 38h52M27 38c0-8 10-14 23-14s23 6 23 14"/><path d="M26 38l3 10h42l3-10"/><path d="M33 38v6M50 38v8M67 38v6"/></g></svg>',
};

/* Descripciones agregadas donde faltaban (no estaban en la carta original en papel/pizarra),
   redactadas para que la carta se sienta completa — CONFIRMAR CON EL CLIENTE si quiere ajustarlas. */
const MENU = {
  sinleche: [
    { title: 'Especialidad sin leche', items: [
      { name: 'Espresso', price: 2600, desc: 'Extracción de café (30–40ml).' },
      { name: 'Lungo', price: 2700, desc: 'Doble shot de espresso diluido en agua.' },
      { name: 'Americano', price: 2800, desc: 'Doble shot de espresso + 150ml de agua.' },
      { name: 'Té o infusión', price: 2500, desc: 'Selección de tés e infusiones.' },
      { name: 'Filtrados (V-60 y Origami)', price: '3.200–4.100', desc: 'Café de origen filtrado a mano, método V-60 u Origami.' },
    ]},
    { title: 'Adicionales', extras: true, items: [
      { name: 'Shot extra café', price: '+$500' },
      { name: 'Leche vegetal', price: '+$700' },
      { name: 'Esencia', price: '+$300' },
      { name: 'Leche extra', price: '+$500' },
    ]},
  ],
  conleche: [
    { title: 'Especialidad con leche', items: [
      { name: 'Machiato', price: 2700, desc: 'Doble shot espresso + espuma de leche.' },
      { name: 'Flat White', price: 2900, desc: 'Doble shot espresso + leche.' },
      { name: 'Cappuccino', price: 3200, desc: 'Doble shot espresso + leche + espuma.' },
      { name: 'Latte', price: 3700, desc: 'Doble shot espresso + 300ml de leche.' },
    ]},
    { title: 'Especiales', items: [
      { name: 'Mocaccino', price: 4200, desc: 'Espresso + chocolate.' },
      { name: 'Chocolate', price: 3800, desc: 'Leche + chocolate.' },
      { name: 'Chailatte', price: 3800, desc: 'Té negro, cardamomo, canela, anís y jengibre + leche.' },
      { name: 'Matchalatte', price: 3800, desc: 'Té verde japonés + leche.' },
      { name: 'Dirty Chai', price: 4100, desc: 'Chai + shot de espresso simple.' },
    ]},
  ],
  frias: [
    { title: 'Un shot de café', items: [
      { name: 'Iced Americano', price: 3500, desc: 'Espresso doble con agua fría y hielo.' },
      { name: 'Iced Latte', price: 4000, desc: 'Espresso doble con leche fría y hielo.' },
      { name: 'Iced Chailatte', price: 4300, desc: 'Chai especiado con leche fría y hielo.' },
      { name: 'Iced Matchalatte', price: 4200, desc: 'Matcha con leche fría y hielo.' },
      { name: 'Iced Tea', price: 3200, desc: 'Té helado clásico.' },
      { name: 'Espresso Tonic / Ginger', price: 4200, desc: 'Espresso doble sobre agua tónica o ginger ale, con hielo.' },
      { name: 'Espresso Orange', price: 4500, desc: 'Espresso doble con jugo de naranja natural y hielo.' },
      { name: 'Cold Brew', price: 3800, desc: 'Extracción en frío, suave y poco ácido.' },
    ]},
    { title: 'Para el calor', items: [
      { name: 'Frappuccino', price: 4900, desc: 'Tradicional, caramelo o chocolate.' },
      { name: 'Café helado', price: 5500, desc: 'Café frío batido con hielo y leche.' },
      { name: 'Afogatto', price: 3800, desc: 'Helado de vainilla ahogado en un shot de espresso.' },
      { name: 'Jugos naturales', price: 3500, desc: 'Mango, maracuyá, frambuesa y arándano.' },
      { name: 'Limonadas', price: 3500, desc: 'Limonada natural, clásica o con menta/jengibre.' },
      { name: 'Agua con/sin gas', price: 1500, desc: 'Agua mineral, con o sin gas.' },
    ]},
  ],
  pasteleria: [
    { title: 'Pastelería y bollería', items: [
      { name: 'Cheesecake Filtra2', price: 5200, desc: 'Receta de la casa, cremoso y con base crocante.' },
      { name: 'Pie limón / tartas', price: 4300, desc: 'Tarta de limón u otras tartas de estación.' },
      { name: 'NY Rolls', price: 5600, desc: 'Rollos estilo Nueva York, esponjosos y glaseados.' },
      { name: 'Danesas', price: 5600, desc: 'Masa danesa de hojaldre, dulce o rellena.' },
      { name: 'Rollo de canela', price: 3500, desc: 'Horneado al momento, con glaseado.' },
      { name: 'Profiterol', price: 4200, desc: 'Choux relleno, bañado en chocolate.' },
    ]},
    { title: 'Para acompañar', items: [
      { name: 'Muffins', price: 2400, desc: 'Muffin del día, distintos sabores.' },
      { name: 'Galletón', price: 3100, desc: 'Grande, crocante por fuera y suave por dentro.' },
      { name: 'Media Luna', price: 1200, desc: 'Clásica media luna de manteca.' },
      { name: 'Blondie de limón', price: 3300, desc: 'Blondie húmedo con toque cítrico.' },
      { name: 'Brownie S/Azúcar', price: 3600, desc: 'Brownie de chocolate sin azúcar añadida.' },
      { name: 'Galletas sin gluten', price: 2600, desc: 'Opción apta para celíacos.' },
    ]},
  ],
  sandwiches: [
    { title: 'Sandwiches', items: [
      { name: 'Con palta (Ciabatta o Molde)', price: 3500, desc: 'Palta fresca, a elección en pan ciabatta o de molde.' },
      { name: 'Ciabatta jamón y queso', price: 3600, desc: 'Jamón y queso en pan ciabatta.' },
      { name: 'Molde jamón y queso', price: 2900, desc: 'Jamón y queso en pan de molde.' },
      { name: 'Croissant jamón y queso', price: 4800, desc: 'Croissant relleno de jamón y queso.' },
    ]},
    { title: 'Especiales', items: [
      { name: 'Ciabatta queso, tomate cherry y rúcula', price: 4500, desc: 'Queso, tomate cherry y rúcula fresca.' },
      { name: 'Croissant jamón serrano, palta y rúcula', price: 6800, desc: 'Jamón serrano, palta y rúcula en croissant.' },
      { name: 'Salmón ahumado, queso crema y rúcula', price: 6800, desc: 'Salmón ahumado, queso crema y rúcula fresca.' },
      { name: 'Adicional Croissant', price: 2800, desc: 'Suma un croissant a tu pedido.' },
    ]},
  ],
};

function priceLabel(p){ return typeof p === 'number' ? fmt(p) : (typeof p === 'string' && p.startsWith('+') ? p : (typeof p === 'string' && p.includes('–') ? '$' + p : p)); }

function renderMenuPanel(cat){
  const data = MENU[cat];
  const html = data.map(group => {
    if (group.extras){
      return `
        <div class="menu-cat">
          <h3>${group.title}</h3>
          <div class="menu-extras">
            ${group.items.map(it => `<div class="menu-extra-item"><span>${it.name}</span><span class="price">${it.price}</span></div>`).join('')}
          </div>
        </div>`;
    }
    return `
      <div class="menu-cat">
        <h3>${group.title}</h3>
        <div class="menu-cards">
          ${group.items.map(it => `
            <button class="menu-card" data-name="${it.name}" data-desc="${it.desc || ''}" data-price="${priceLabel(it.price)}">
              <div class="menu-card-photo">${CAT_ART[cat]}</div>
              <div class="menu-card-body">
                <h4>${it.name}</h4>
                <p>${it.desc || ''}</p>
              </div>
              <div class="menu-card-bottom">
                <span class="menu-card-price">${priceLabel(it.price)}</span>
                <span class="menu-card-cta">Ver +</span>
              </div>
            </button>`).join('')}
        </div>
      </div>`;
  }).join('');
  return `<div class="menu-panel active">${html}</div>`;
}

const menuPanelsEl = document.getElementById('menu-panels');
function showMenuCat(cat){
  menuPanelsEl.innerHTML = renderMenuPanel(cat);
  menuPanelsEl.querySelectorAll('.menu-card').forEach(card => {
    card.addEventListener('click', () => openProductModal(card.dataset.name, card.dataset.desc, card.dataset.price));
  });
}
showMenuCat('sinleche');

document.querySelectorAll('.menu-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.menu-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    showMenuCat(btn.dataset.cat);
  });
});

/* ===================== MODAL DE PRODUCTO ===================== */
const modalOverlay = document.getElementById('modal-overlay');
function openProductModal(name, desc, price){
  document.getElementById('modal-name').textContent = name;
  document.getElementById('modal-desc').textContent = desc;
  document.getElementById('modal-price').textContent = price;
  const cat = document.querySelector('.menu-tab.active').dataset.cat;
  document.getElementById('modal-photo').innerHTML = CAT_ART[cat];
  modalOverlay.classList.remove('hidden');
}
function closeProductModal(){ modalOverlay.classList.add('hidden'); }
document.getElementById('modal-close').addEventListener('click', closeProductModal);
modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeProductModal(); });

/* ===================== ENLACES DE GOOGLE (PLACE ID REAL) ===================== */
/* Place ID confirmado en Google Maps para "FILTRA2 CAFE", Portugal 87 Local 2B, Santiago Centro. */
const PLACE_ID = '0x9662c5601ff670bf:0x11ca0986d1f96b8a';
document.getElementById('reviews-link').href = `https://search.google.com/local/writereview?placeid=${PLACE_ID}`;
document.getElementById('directions-link').href = `https://www.google.com/maps/dir/?api=1&destination=Filtra2+Cafe&destination_place_id=${PLACE_ID}`;
/* Coordenadas reales de la misma ficha (las del embed del mapa). */
document.getElementById('waze-link').href = 'https://waze.com/ul?ll=-33.4428307,-70.6384584&navigate=yes';

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
