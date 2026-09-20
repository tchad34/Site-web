
(function(){'use strict';
const DATA=window.NOX_FILM_DATA||{};
const title=DATA.title||document.body.dataset.film||'';
const readers=DATA.readers||{};
const imageUrl=DATA.image||'';
const trailer=DATA.trailer||'';
const detail=document.querySelector('.standalone-detail');
const frame=document.getElementById('standalonePlayerFrame');
const placeholder=document.getElementById('standalonePlayerPlaceholder');
const status=document.getElementById('standalonePlayerStatus');
const poster=document.querySelector('[data-film-poster]');
if(imageUrl&&poster) poster.src=imageUrl;
function openUrl(url,label){if(!url){status.textContent='Lien vidéo indisponible';return;}frame.hidden=false;frame.src=url;placeholder.hidden=true;status.textContent=label||'Lecteur sélectionné';detail.scrollIntoView({behavior:'smooth',block:'start'});}
function renderReaders(){const box=document.getElementById('standalonePlayerLinks');box.innerHTML='';[['Version française',readers.version_francaise||[]],['Version originale',readers.version_originale||[]]].forEach(([label,items])=>{const sec=document.createElement('section');sec.className='player-version';const h=document.createElement('h2');h.textContent=label;sec.appendChild(h);const row=document.createElement('div');row.className='player-version-row';if(!items.length){const e=document.createElement('span');e.className='player-empty';row.appendChild(e);}else items.forEach((item,i)=>{const b=document.createElement('button');b.type='button';b.className='player-link-btn';b.textContent=item.name||('Lecteur '+(i+1));b.addEventListener('click',()=>openUrl(item.url||'',b.textContent));row.appendChild(b);});sec.appendChild(row);box.appendChild(sec);});}
function launchTrailer(){openUrl(trailer,'Bande-annonce');}
document.getElementById('trailerButton').addEventListener('click',launchTrailer);placeholder.addEventListener('click',launchTrailer);renderReaders();
// Synopsis compact : simple texte « Lire plus », sans bouton visible.
const synopsis=document.getElementById('filmSynopsis');
if(synopsis){
  const more=document.createElement('span');
  more.className='synopsis-more';
  more.textContent='Lire plus';
  more.setAttribute('role','button');
  more.setAttribute('tabindex','0');
  more.style.display='inline';
  more.style.margin='8px 0 0';
  more.style.padding='0';
  more.style.border='0';
  more.style.background='none';
  more.style.borderRadius='0';
  more.style.color='#f1d28c';
  more.style.fontSize='13px';
  more.style.fontWeight='600';
  more.style.cursor='pointer';
  synopsis.classList.add('synopsis-collapsed');
  synopsis.insertAdjacentElement('afterend',more);
  const toggleSynopsis=()=>{
    const expanded=synopsis.classList.toggle('synopsis-expanded');
    synopsis.classList.toggle('synopsis-collapsed',!expanded);
    more.textContent=expanded?'Réduire':'Lire plus';
  };
  more.addEventListener('click',toggleSynopsis);
  more.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggleSynopsis();}});
  const refresh=()=>{ more.hidden = synopsis.scrollHeight <= synopsis.clientHeight + 2; };
  requestAnimationFrame(refresh); window.addEventListener('resize',refresh,{passive:true});
}

const listKey='noxstream_list',favKey='noxstream_favorites';
function toggle(key,btn,on,off){let a=[];try{a=JSON.parse(localStorage.getItem(key)||'[]')}catch{}const i=a.indexOf(title);if(i>=0){a.splice(i,1);btn.textContent=off;btn.classList.remove('is-active')}else{a.push(title);btn.textContent=on;btn.classList.add('is-active')}localStorage.setItem(key,JSON.stringify(a));}
function restore(key,btn,on,off){try{const a=JSON.parse(localStorage.getItem(key)||'[]');if(a.includes(title)){btn.textContent=on;btn.classList.add('is-active')}else btn.textContent=off}catch{}}
const lb=document.getElementById('listButton'),fb=document.getElementById('favButton');lb.onclick=()=>toggle(listKey,lb,'✓ Dans ma liste','＋ Ma liste');fb.onclick=()=>toggle(favKey,fb,'♥','♡');restore(listKey,lb,'✓ Dans ma liste','＋ Ma liste');restore(favKey,fb,'♥','♡');
document.getElementById('backButton').onclick=()=>{location.href='../films.html';};
})();
