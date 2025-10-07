const products = [
  { id:'bf-classic', name:'Bougie Classique', price:24, size:'180g', scentNotes:'Vanille, Fève tonka, Musc blanc', tags:['Best-seller'], rating:4.8 },
  { id:'bf-woodland', name:'Forêt du Soir', price:28, size:'220g', scentNotes:'Cèdre, Vétiver, Ambre', tags:['Nouveau'], rating:4.7 },
  { id:'bf-citrus', name:'Citrus Zest', price:22, size:'160g', scentNotes:\"Yuzu, Bergamote, Zeste d'orange\", tags:[], rating:4.6 },
  { id:'bf-linen', name:'Coton Frais', price:26, size:'200g', scentNotes:'Linge propre, Fleurs blanches, Muguet', tags:['Maison'], rating:4.9 },
]
const scents = [
  { id:'vanille', label:'Vanille' },
  { id:'bois', label:'Boisé' },
  { id:'agrumes', label:'Agrumes' },
  { id:'fleurs', label:'Florale' },
  { id:'marine', label:'Marine' },
]
const waxes = [{id:'soja',label:'Cire de soja'},{id:'colza',label:'Cire de colza'},{id:'abeille',label:\"Cire d'abeille\"}]
const wicks = [{id:'coton',label:'Mèche coton'},{id:'bois',label:'Mèche bois (crépitement)'}]
const sizes = [{id:'160',label:'160g',price:0},{id:'200',label:'200g',price:3},{id:'320',label:'320g',price:9}]

const fmt = new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR'})
const $ = s => document.querySelector(s)

// year
$('#year').textContent = new Date().getFullYear()

// render products
const grid = $('#productGrid')
grid.innerHTML = products.map((p,i)=>`
  <div class="card">
    <div class="head">
      ${(p.tags||[]).map(t=>`<span class="badge">${t}</span>`).join('')}
      <h3>${p.name}</h3>
      <div class="muted small">${p.size} • ${fmt.format(p.price)}</div>
    </div>
    <div class="body">
      <div class="jar j${(i%4)+1}"></div>
      <p class="muted small">${p.scentNotes}</p>
      <div class="row between" style="margin-top:8px">
        <button class="btn ghost" onclick="add('${p.id}')">Ajouter</button>
        <button class="btn ghost" onclick="openDrawer()">Voir le panier</button>
      </div>
    </div>
  </div>
`).join('')

// builder selects
function fillSelect(el, list){ el.innerHTML = list.map(o=>`<option value="${o.id}">${o.label||o.name||o}</option>`).join('') }
fillSelect($('#scent'),scents); fillSelect($('#wax'),waxes); fillSelect($('#wick'),wicks); fillSelect($('#size'),sizes.map(s=>({id:s.id,label:`${s.label}${s.price?` (+${fmt.format(s.price)})`:''}`})))

let custom = { scent:scents[0].id, wax:waxes[0].id, wick:wicks[0].id, size:sizes[1].id, engraving:'', qty:1 }
function price(){ const base=21; const sizeExtra = sizes.find(s=>s.id===custom.size)?.price||0; const engr = custom.engraving?4:0; return base+sizeExtra+engr }
function updatePrice(){ $('#estPrice').textContent = fmt.format(price()) }
updatePrice()

$('#scent').onchange = e=>{ custom.scent=e.target.value; }
$('#wax').onchange = e=>{ custom.wax=e.target.value; }
$('#wick').onchange = e=>{ custom.wick=e.target.value; }
$('#size').onchange = e=>{ custom.size=e.target.value; updatePrice() }
$('#engraving').oninput = e=>{ custom.engraving=e.target.value.slice(0,24); updatePrice() }
$('#minus').onclick = ()=>{ custom.qty = Math.max(1, custom.qty-1); $('#qty').textContent = custom.qty }
$('#plus').onclick  = ()=>{ custom.qty = custom.qty+1; $('#qty').textContent = custom.qty }
$('#addCustom').onclick = ()=>{
  const key = `custom-${custom.scent}-${custom.wax}-${custom.wick}-${custom.size}-${custom.engraving||'none'}`
  add(key, { name:`Bougie sur mesure (${sizes.find(s=>s.id===custom.size)?.label})`, price: price() }, custom.qty, {engraving: custom.engraving})
  openDrawer()
}

// cart
function getCart(){ try{return JSON.parse(localStorage.getItem('bf_cart')||'[]')}catch{return[]} }
function saveCart(c){ localStorage.setItem('bf_cart', JSON.stringify(c)); }
function renderCart(){
  const c = getCart()
  const count = c.reduce((s,i)=>s+i.qty,0)
  const total = c.reduce((s,i)=>s+i.price*i.qty,0)
  $('#cartCount').textContent = count
  $('#cartItems').innerHTML = c.length? c.map(it=>`
    <div class="cart-item">
      <div>
        <div><b>${it.name}</b></div>
        <div class="muted small">${fmt.format(it.price)}</div>
        ${it.meta?.engraving?`<div class="muted small">Gravure: “${it.meta.engraving}”</div>`:''}
      </div>
      <div class="row">
        <button class="btn ghost" onclick="qty('${it.key}',-1)">−</button>
        <span class="qty">${it.qty}</span>
        <button class="btn ghost" onclick="qty('${it.key}',1)">+</button>
        <button class="btn ghost" onclick="removeItem('${it.key}')">Retirer</button>
      </div>
    </div>`).join('') : `<p class="muted center">Votre panier est vide.</p>`
  $('#cartTotal').textContent = fmt.format(total)
}
function add(key, data=null, qty=1, meta={}){
  const prod = data || products.find(p=>p.id===key)
  const item = { key, id:key, name: prod.name, price: prod.price, qty, meta }
  const c = getCart()
  const i = c.findIndex(x=>x.key===key)
  if(i>=0){ c[i].qty += qty } else { c.push(item) }
  saveCart(c); renderCart()
}
function qty(key, delta){ const c=getCart(); const i=c.findIndex(x=>x.key===key); if(i>=0){ c[i].qty = Math.max(1, c[i].qty+delta); saveCart(c); renderCart() } }
function removeItem(key){ const c=getCart().filter(x=>x.key!==key); saveCart(c); renderCart() }

// drawer
function openDrawer(){ document.getElementById('drawer').classList.remove('hidden'); renderCart() }
function closeDrawer(){ document.getElementById('drawer').classList.add('hidden') }
document.getElementById('openCart').onclick = openDrawer
document.getElementById('closeCart').onclick = closeDrawer
document.querySelector('.drawer-bg').onclick = closeDrawer
document.getElementById('checkout').onclick = ()=> alert('Démo : connectez Stripe/PayPal pour finaliser le paiement.')

// initial render
renderCart()
