(function(){'use strict';
const CFG_URL='nox-blocks.json';
const CATALOG_URL='Films/catalogue.json';
function norm(v){return String(v||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9\s-]/g,' ').replace(/\s+/g,' ').trim()}
function hash(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
function weekKey(){const d=new Date(),x=new Date(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())),day=x.getUTCDay()||7;x.setUTCDate(x.getUTCDate()+4-day);const y=new Date(Date.UTC(x.getUTCFullYear(),0,1));return x.getUTCFullYear()+'-'+Math.ceil((((x-y)/86400000)+1)/7)}
function score(f,keywords){const text=norm([f.title,f.genre,f.synopsis,f.country,f.director,f.actors].join(' '));let s=0;keywords.forEach(k=>{const n=norm(k);if(n&&text.includes(n))s+=n.length>7?3:2});return s}
function card(f){const el=document.createElement('a');el.className='film-link nox-auto-film-link';el.href=f.dynamicCinema&&f.slug?('/film.html?film='+encodeURIComponent(f.slug)):(f.file||'#');el.style.textDecoration='none';el.style.color='inherit';el.innerHTML='<article class="card nox-auto-film-card '+(f.posterClass||'')+'" data-film=""><b></b><small></small><button type="button" class="film-add" aria-label="Ajouter à ma liste" title="Ajouter à ma liste">＋</button></article>';const a=el.querySelector('article');a.dataset.film=f.title||'';if(f.image){a.style.backgroundImage='url("'+String(f.image).replace(/"/g,'%22')+'")';a.style.backgroundSize='cover';a.style.backgroundPosition='center';}a.querySelector('b').textContent=f.title||'Film';a.querySelector('small').textContent=(f.year||'')+' · '+(f.genre||'').split(',')[0].trim();const btn=a.querySelector('.film-add');restoreListButton(btn,f.title||'Film');btn.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();toggleList(f.title||'Film',btn);});return el;}
function listTitles(){try{const a=JSON.parse(localStorage.getItem('noxstream_list')||'[]');return Array.isArray(a)?a:[]}catch(e){return[]}}
function toggleList(title,btn){let a=listTitles();const i=a.indexOf(title);if(i>=0){a.splice(i,1);btn.textContent='＋';btn.setAttribute('aria-label','Ajouter à ma liste');btn.title='Ajouter à ma liste';btn.classList.remove('is-active')}else{a.push(title);btn.textContent='✓';btn.setAttribute('aria-label','Retirer de ma liste');btn.title='Retirer de ma liste';btn.classList.add('is-active')}try{localStorage.setItem('noxstream_list',JSON.stringify(a))}catch(e){}}
function restoreListButton(btn,title){const active=listTitles().includes(title);btn.textContent=active?'✓':'＋';btn.setAttribute('aria-label',active?'Retirer de ma liste':'Ajouter à ma liste');btn.title=active?'Retirer de ma liste':'Ajouter à ma liste';btn.classList.toggle('is-active',active)}
function watched(){try{return JSON.parse(localStorage.getItem('noxstream_watch_history')||'[]')}catch(e){return[]}}
function pick(block,films,key){
 if(block.id==='parce-que-vous-avez-aime'){
  const w=watched().map(norm);if(!w.length)return[];
  return films.map(f=>({...f,_s:w.reduce((n,t)=>n+(t&&norm(f.title).includes(t)?5:0),0)})).filter(f=>f._s>0).sort((a,b)=>b._s-a._s||hash(key+a.title)-hash(key+b.title)).slice(0,block.count);
 }
 return films.map(f=>({...f,_s:score(f,block.keywords)})).filter(f=>f._s>0).sort((a,b)=>b._s-a._s||hash(key+a.title)-hash(key+b.title)).slice(0,block.count)
}
async function init(){const host=document.getElementById('noxAutoBlocks');if(!host)return;try{const [cfg,films0]=await Promise.all([fetch(CFG_URL,{cache:'no-store'}).then(r=>r.json()),fetch(CATALOG_URL,{cache:'no-store'}).then(r=>r.json())]);let films=Array.isArray(films0)?films0.slice():[];try{const r=await fetch('https://mvwtxamnwtnhzuyeaszp.supabase.co/rest/v1/nox_cinema_films?select=slug,title,year,genre,duration,quality,version,synopsis,image,created_at&order=created_at.desc&limit=50',{headers:{apikey:'sb_publishable_s3hMkVzCD-0syFvft2hH6Q_bNnXj6V5',Accept:'application/json'},cache:'no-store'});if(r.ok){const rows=await r.json();const dynamic=(Array.isArray(rows)?rows:[]).map(x=>({slug:x.slug,title:x.title,year:x.year,genre:x.genre,duration:x.duration,quality:x.quality,version:x.version,synopsis:x.synopsis,image:x.image,dynamicCinema:true,createdAt:new Date(x.created_at||0).getTime(),posterClass:'dynamic-cinema-'+String(x.slug||'')}));films=[...dynamic,...films];}}catch(e){console.warn('NoxStream: films Sortie cinéma dynamiques indisponibles',e)}const key=weekKey();host.innerHTML='';cfg.blocks.filter(b=>b.enabled).forEach(b=>{let chosen;if(b.id==='sortie-cinema'){const dynamic=films.filter(f=>f&&f.dynamicCinema).sort((a,z)=>Number(z.createdAt||0)-Number(a.createdAt||0));const staticChosen=Array.isArray(b.films)&&b.films.length?b.films:pick(b,films,key);const seen=new Set();chosen=[...dynamic,...staticChosen].filter(f=>{const k=norm(f.title);if(!k||seen.has(k)){return false;}seen.add(k);return true;}).slice(0,b.count);}else{chosen=pick(b,films,key);}if(!chosen.length)return;const sec=document.createElement('section');sec.className='section nox-auto-block';sec.dataset.blockId=b.id;sec.innerHTML='<div class="section-head"><h2></h2></div><div class="rail"></div>';sec.querySelector('h2').textContent=b.title;const rail=sec.querySelector('.rail');
 if(b.id==='sortie-cinema'){
  rail.classList.add('nox-slow-slide-rail');
  const track=document.createElement('div'); track.className='nox-slow-slide-track';
  chosen.forEach(f=>track.appendChild(card(f)));
  chosen.forEach(f=>track.appendChild(card(f)));
  rail.innerHTML=''; rail.appendChild(track);
 }else{chosen.forEach(f=>rail.appendChild(card(f)));}
 host.appendChild(sec)});if(window.applyFilmImages)window.applyFilmImages()}catch(e){console.warn('NoxStream blocs automatiques:',e)}}
window.NoxBlockEngine={init,weekKey};document.addEventListener('DOMContentLoaded',init);
})();
