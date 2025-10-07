
import React, { useMemo, useState } from 'react'
import { ShoppingBag, Sparkles, Candle, Leaf, Flame, Star, Truck, Shield, Minus, Plus, Mail } from 'lucide-react'
import { Button } from './components/Button'
import { Badge } from './components/Badge'
import { Input } from './components/Input'
import { Separator } from './components/Separator'

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
const waxes = [{id:'soja',label:'Cire de soja'},{id:'colza',label:'Cire de colza'},{id:\"abeille\",label:\"Cire d'abeille\"}]
const wicks = [{id:'coton',label:'Mèche coton'},{id:'bois',label:'Mèche bois (crépitement)'}]
const sizes = [{id:'160',label:'160g',price:0},{id:'200',label:'200g',price:3},{id:'320',label:'320g',price:9}]

function formatEUR(n){ return new Intl.NumberFormat('fr-FR',{style:'currency',currency:'EUR'}).format(n) }

function GradientJar({ seed=0, className='' }){
  const colors = [
    ['#fef3c7','#fde68a'],
    ['#e0e7ff','#c7d2fe'],
    ['#cffafe','#a7f3d0'],
    ['#fee2e2','#fecaca'],
  ]
  const pair = colors[seed % colors.length]
  return (
    <div className={'aspect-square w-full rounded-2xl shadow-inner border ' + className} style={{background:`linear-gradient(135deg, ${pair[0]}, ${pair[1]})`}}>
      <div className='h-full w-full flex items-center justify-center'>
        <Candle className='w-10 h-10 opacity-60'/>
      </div>
    </div>
  )
}

export default function App(){
  const [cart, setCart] = useState([])
  const [openCart, setOpenCart] = useState(false)

  const [custom, setCustom] = useState({ scent:scents[0].id, wax:waxes[0].id, wick:wicks[0].id, size:sizes[1].id, engraving:'', qty:1 })
  const customPrice = useMemo(()=>{
    const base=21; const sizeExtra = sizes.find(s=>s.id===custom.size)?.price||0; const engravingExtra = custom.engraving?4:0; return base+sizeExtra+engravingExtra
  },[custom.size,custom.engraving])
  const cartTotal = useMemo(()=> cart.reduce((s,i)=>s+i.price*i.qty,0),[cart])

  function addToCart(item){
    setCart(prev => {
      const i = prev.findIndex(p=>p.key===item.key)
      if(i>=0){ const copy=[...prev]; copy[i]={...copy[i], qty:copy[i].qty+item.qty}; return copy }
      return [...prev, item]
    })
  }
  function removeFromCart(key){ setCart(prev=>prev.filter(i=>i.key!==key)) }
  function changeQty(key,delta){ setCart(prev=>prev.map(i=>i.key===key?{...i, qty: Math.max(1, i.qty+delta)}:i)) }
  function checkout(){ alert('Ceci est une démo. Connectez Stripe/PayPal pour finaliser le paiement.') }

  return (
    <div className='min-h-screen bg-gradient-to-b from-white to-slate-50'>
      <header className='sticky top-0 z-30 bg-white/80 backdrop-blur border-b'>
        <div className='mx-auto max-w-7xl px-4 md:px-8 h-16 flex items-center justify-between'>
          <a href='#' className='flex items-center gap-2 font-semibold text-lg'>
            <Candle className='w-6 h-6'/><span>Bougie Fix</span>
          </a>
          <nav className='hidden md:flex items-center gap-6 text-sm'>
            <a className='hover:underline' href='#produits'>Produits</a>
            <a className='hover:underline' href='#personnaliser'>Personnaliser</a>
            <a className='hover:underline' href='#abonnements'>Abonnements</a>
            <a className='hover:underline' href='#faq'>FAQ</a>
            <a className='hover:underline' href='#contact'>Contact</a>
          </nav>
          <div className='flex items-center gap-2'>
            <Button variant='ghost' onClick={()=>setOpenCart(true)}>
              <ShoppingBag className='w-4 h-4 mr-2'/> Panier
              <span className='ml-2 inline-flex items-center justify-center rounded-full bg-slate-900 text-white text-xs w-5 h-5'>
                {cart.reduce((s,i)=>s+i.qty,0)}
              </span>
            </Button>
          </div>
        </div>
      </header>

      <main className='mx-auto max-w-7xl px-4 md:px-8'>
        <section className='py-12 md:py-20'>
          <div className='grid md:grid-cols-2 gap-10 items-center'>
            <div>
              <div className='inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm mb-3'>
                <Sparkles className='w-4 h-4'/><span>Nouveau : configurateur de bougie sur mesure</span>
              </div>
              <h1 className='text-4xl md:text-6xl font-semibold tracking-tight'>Bougie Fix</h1>
              <p className='mt-4 text-lg text-slate-600 max-w-prose'>Des bougies propres, durables et personnalisables, coulées en petites séries à Paris. Créez la vôtre en quelques clics.</p>
              <div className='mt-6 flex flex-wrap gap-3'>
                <a href='#personnaliser'><Button>Personnaliser ma bougie</Button></a>
                <a href='#produits'><Button variant='ghost'>Voir les produits</Button></a>
              </div>
              <div className='mt-6 flex items-center gap-6 text-sm text-slate-600'>
                <div className='flex items-center gap-2'><Truck className='w-4 h-4'/> Livraison 48h</div>
                <div className='flex items-center gap-2'><Shield className='w-4 h-4'/> Satisfait ou remboursé</div>
              </div>
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <GradientJar seed={0}/>
              <GradientJar seed={1}/>
              <GradientJar seed={2} className='hidden md:block'/>
              <GradientJar seed={3} className='hidden md:block'/>
            </div>
          </div>
        </section>

        <section id='produits' className='py-12'>
          <div className='flex items-end justify-between mb-6'>
            <h2 className='text-2xl md:text-3xl font-semibold'>Nos bougies</h2>
            <p className='text-slate-600 text-sm'>Cire végétale • Mèches sans plomb • Parfums IFRA</p>
          </div>
          <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-6'>
            {products.map((p, idx)=>(
              <div key={p.id} className='card'>
                <div className='card-header'>
                  <div className='flex items-center gap-2 mb-2'>{p.tags.map(t=> <Badge key={t}>{t}</Badge>)}</div>
                  <div className='text-xl font-semibold'>{p.name}</div>
                  <div className='text-slate-500 text-sm'>{p.size} • {formatEUR(p.price)}</div>
                </div>
                <div className='card-body'>
                  <GradientJar seed={idx}/>
                  <p className='mt-3 text-sm text-slate-600'>{p.scentNotes}</p>
                  <div className='mt-2 flex items-center gap-1 text-amber-500'>
                    {Array.from({length:5}).map((_,i)=> <Star key={i} className={'w-4 h-4 ' + (i<Math.round(p.rating)?'':'opacity-20')}/>)}
                    <span className='text-xs text-slate-500 ml-2'>{p.rating.toFixed(1)}</span>
                  </div>
                </div>
                <div className='card-footer flex justify-between items-center'>
                  <Button onClick={()=>addToCart({ key:p.id, id:p.id, name:p.name, price:p.price, qty:1 })}>Ajouter</Button>
                  <Button variant='ghost' onClick={()=>setOpenCart(true)}>Voir le panier</Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <Separator/>

        <section id='personnaliser' className='py-12'>
          <h2 className='text-2xl md:text-3xl font-semibold mb-6'>Créez votre bougie</h2>
          <div className='grid md:grid-cols-2 gap-8 mt-6'>
            <div>
              <GradientJar seed={2}/>
              <div className='mt-3 text-slate-600 text-sm'>Prix estimé : <span className='font-semibold text-slate-900'>{formatEUR(customPrice)}</span></div>
            </div>
            <div>
              <div className='grid grid-cols-2 gap-3 mb-6'>
                {scents.map(s=>(
                  <label key={s.id} className={'cursor-pointer rounded-2xl border p-3 flex items-center gap-2 ' + (custom.scent===s.id?'border-slate-900':'')}>
                    <input type='radio' name='scent' className='hidden' checked={custom.scent===s.id} onChange={()=>setCustom(c=>({...c, scent:s.id}))}/>
                    <Leaf className='w-4 h-4'/> {s.label}
                  </label>
                ))}
              </div>
              <div className='grid grid-cols-2 gap-3 mb-6'>
                {waxes.map(w=>(
                  <label key={w.id} className={'cursor-pointer rounded-2xl border p-3 flex items-center gap-2 ' + (custom.wax===w.id?'border-slate-900':'')}>
                    <input type='radio' name='wax' className='hidden' checked={custom.wax===w.id} onChange={()=>setCustom(c=>({...c, wax:w.id}))}/>
                    <Flame className='w-4 h-4'/> {w.label}
                  </label>
                ))}
              </div>
              <div className='grid grid-cols-2 gap-3 mb-6'>
                {wicks.map(w=>(
                  <label key={w.id} className={'cursor-pointer rounded-2xl border p-3 flex items-center gap-2 ' + (custom.wick===w.id?'border-slate-900':'')}>
                    <input type='radio' name='wick' className='hidden' checked={custom.wick===w.id} onChange={()=>setCustom(c=>({...c, wick:w.id}))}/>
                    <Flame className='w-4 h-4'/> {w.label}
                  </label>
                ))}
              </div>
              <div className='grid grid-cols-3 gap-3 mb-6'>
                {sizes.map(s=>(
                  <label key={s.id} className={'cursor-pointer rounded-2xl border p-3 flex items-center justify-between ' + (custom.size===s.id?'border-slate-900':'')}>
                    <input type='radio' name='size' className='hidden' checked={custom.size===s.id} onChange={()=>setCustom(c=>({...c, size:s.id}))}/>
                    <span>{s.label}</span>
                    <span className='badge'>{s.price?`+${formatEUR(s.price)}`:'Inclus'}</span>\n                  </label>\n                ))}\n              </div>\n              <div className='space-y-2 mb-4'>\n                <label className='text-sm'>Gravure (optionnelle)</label>\n                <Input placeholder='Ex: Pour Marie ♥' value={custom.engraving} onChange={e=>setCustom(c=>({...c, engraving: e.target.value.slice(0,24)}))}/>\n                <p className='text-xs text-slate-500'>24 caractères max • +{formatEUR(4)}</p>\n              </div>\n              <div className='mt-6 flex items-center gap-3'>\n                <div className='inline-flex items-center rounded-full border px-2'>\n                  <button className='p-2' onClick={()=>setCustom(c=>({...c, qty: Math.max(1, c.qty-1)}))}><Minus className='w-4 h-4'/></button>\n                  <span className='px-3 min-w-[2rem] text-center'>{custom.qty}</span>\n                  <button className='p-2' onClick={()=>setCustom(c=>({...c, qty: c.qty+1}))}><Plus className='w-4 h-4'/></button>\n                </div>\n                <Button onClick={()=>{ const key=`custom-${custom.scent}-${custom.wax}-${custom.wick}-${custom.size}-${custom.engraving||'none'}`; addToCart({ key, id:key, name:`Bougie sur mesure (${sizes.find(s=>s.id===custom.size)?.label})`, price:customPrice, qty:custom.qty, meta:{...custom} }); setOpenCart(true); }}>\n                  <ShoppingBag className='w-4 h-4 mr-2'/> Ajouter au panier — {formatEUR(customPrice)}\n                </Button>\n              </div>\n            </div>\n          </div>\n        </section>\n\n        <Separator/>\n\n        <section id='abonnements' className='py-12'>\n          <div className='grid md:grid-cols-3 gap-6'>\n            {[\n              {id:'mensuel', title:'Mensuel', price:19, desc:'1 bougie 160g chaque mois'},\n              {id:'confort', title:'Confort', price:34, desc:'2 bougies 200g chaque mois'},\n              {id:'ambiance', title:'Ambiance', price:59, desc:'3 bougies 320g chaque mois'},\n            ].map((p)=> (\n              <div key={p.id} className='card'>\n                <div className='card-header'>\n                  <div className='flex items-center justify-between'>\n                    <div className='text-lg font-semibold'>{p.title}</div>\n                    <span className='badge'>-15% vs à l'unité</span>\n                  </div>\n                  <div className='text-slate-500'>{p.desc}</div>\n                </div>\n                <div className='card-body'>\n                  <p className='text-3xl font-semibold'>{formatEUR(p.price)}<span className='text-base font-normal text-slate-500'>/mois</span></p>\n                  <p className='text-sm text-slate-600 mt-2'>Sans engagement, résiliable en 1 clic.</p>\n                </div>\n                <div className='card-footer'>\n                  <Button onClick={()=>{ addToCart({ key:`sub-${p.id}`, id:`sub-${p.id}`, name:`Abonnement ${p.title}`, price:p.price, qty:1 }); setOpenCart(true); }}>Choisir</Button>\n                </div>\n              </div>\n            ))}\n          </div>\n        </section>\n\n        <Separator/>\n\n        <section id='faq' className='py-12'>\n          <h2 className='text-2xl md:text-3xl font-semibold mb-6'>FAQ</h2>\n          <div className='space-y-3'>\n            <details className='border rounded-2xl p-4'>\n              <summary className='cursor-pointer font-medium'>De quoi sont faites vos bougies ?</summary>\n              <p className='mt-2 text-slate-600'>Nos bougies sont à base de cires végétales (soja/colza), avec des mèches 100% coton ou bois, et des parfums conformes IFRA.</p>\n            </details>\n            <details className='border rounded-2xl p-4'>\n              <summary className='cursor-pointer font-medium'>Quels sont les délais d'expédition ?</summary>\n              <p className='mt-2 text-slate-600'>Nous préparons vos commandes sous 24h et livrons en 48h ouvrées en France métropolitaine.</p>\n            </details>\n            <details className='border rounded-2xl p-4'>\n              <summary className='cursor-pointer font-medium'>Puis-je personnaliser une bougie pour un événement ?</summary>\n              <p className='mt-2 text-slate-600'>Oui, nous proposons des séries personnalisées pour mariages et entreprises. Contactez-nous pour un devis.</p>\n            </details>\n          </div>\n        </section>\n\n        <section className='py-12'>\n          <div className='card'>\n            <div className='card-body grid md:grid-cols-2 gap-6 items-center'>\n              <div>\n                <h3 className='text-xl md:text-2xl font-semibold'>Restez au parfum</h3>\n                <p className='text-slate-600 mt-2'>Recevez des offres, nouvelles senteurs et conseils d'entretien.</p>\n              </div>\n              <form className='flex w-full gap-3' onSubmit={(e)=>{e.preventDefault(); alert(\"Merci ! Vous êtes inscrit·e à la newsletter Bougie Fix.\")}}>\n                <div className='w-full'>\n                  <Input type='email' required placeholder='vous@exemple.com'/>\n                </div>\n                <Button type='submit'><Mail className='w-4 h-4 mr-2'/>S'inscrire</Button>\n              </form>\n            </div>\n          </div>\n        </section>\n      </main>\n\n      <footer id='contact' className='border-t mt-16'>\n        <div className='mx-auto max-w-7xl px-4 md:px-8 py-10 grid md:grid-cols-3 gap-8'>\n          <div>\n            <div className='flex items-center gap-2 font-semibold text-lg'><Candle className='w-5 h-5'/> Bougie Fix</div>\n            <p className='text-sm text-slate-600 mt-2'>Atelier à Paris 11e • Fabriqué en France</p>\n            <div className='mt-3 flex items-center gap-2 text-sm text-slate-600'><Shield className='w-4 h-4'/> Satisfait ou remboursé 30 jours</div>\n          </div>\n          <div>\n            <h4 className='font-semibold mb-3'>Contact</h4>\n            <ul className='space-y-2 text-sm text-slate-600'>\n              <li>Email : bonjour@bougiefix.com</li>\n              <li>Instagram : @bougiefix</li>\n              <li>Adresse : 12 rue des Bougies, 75011 Paris</li>\n            </ul>\n          </div>\n          <div>\n            <h4 className='font-semibold mb-3'>Conseils d'entretien</h4>\n            <ul className='space-y-2 text-sm text-slate-600 list-disc pl-4'>\n              <li>Laissez fondre toute la surface lors du premier allumage.</li>\n              <li>Recoupez la mèche à 5 mm avant chaque utilisation.</li>\n              <li>Éteignez après 3h d'utilisation continue.</li>\n            </ul>\n          </div>\n        </div>\n        <div className='text-center text-xs text-slate-500 py-6'>© {new Date().getFullYear()} Bougie Fix — Tous droits réservés.</div>\n      </footer>\n\n      {openCart && (\n        <div className='fixed inset-0 bg-black/40 flex items-end md:items-center justify-center p-4' onClick={()=>setOpenCart(false)}>\n          <div className='bg-white rounded-3xl w-full max-w-lg p-4' onClick={e=>e.stopPropagation()}>\n            <div className='flex items-center gap-2 text-lg font-semibold mb-3'><ShoppingBag className='w-5 h-5'/> Panier</div>\n            {cart.length===0 ? (\n              <div className='py-10 text-center text-slate-600'>Votre panier est vide.</div>\n            ) : (\n              <div className='space-y-4'>\n                {cart.map(it=> (\n                  <div key={it.key} className='flex items-center justify-between border rounded-2xl p-3'>\n                    <div>\n                      <div className='font-medium'>{it.name}</div>\n                      <div className='text-xs text-slate-500'>{formatEUR(it.price)}</div>\n                      {it.meta?.engraving && <div className='text-xs text-slate-500 mt-1'>Gravure: “{it.meta.engraving}”</div>}\n                    </div>\n                    <div className='flex items-center gap-2'>\n                      <button className='p-2' onClick={()=>changeQty(it.key,-1)}><Minus className='w-4 h-4'/></button>\n                      <span className='min-w-[2rem] text-center'>{it.qty}</span>\n                      <button className='p-2' onClick={()=>changeQty(it.key,1)}><Plus className='w-4 h-4'/></button>\n                      <Button variant='ghost' onClick={()=>removeFromCart(it.key)}>Retirer</Button>\n                    </div>\n                  </div>\n                ))}\n                <div className='flex items-center justify-between text-sm'>\n                  <span>Sous-total</span>\n                  <span className='font-semibold'>{formatEUR(cartTotal)}</span>\n                </div>\n                <Button className='w-full' onClick={checkout}>Passer au paiement</Button>\n                <p className='text-xs text-slate-500 text-center'>Taxes et frais d'expédition calculés à l'étape suivante.</p>\n              </div>\n            )}\n          </div>\n        </div>\n      )}\n    </div>\n  )\n}\n