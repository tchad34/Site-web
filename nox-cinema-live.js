(function(){
'use strict';
(function(){
var SUPABASE_URL='https://mvwtxamnwtnhzuyeaszp.supabase.co';
var SUPABASE_KEY='sb_publishable_s3hMkVzCD-0syFvft2hH6Q_bNnXj6V5';
var API=SUPABASE_URL+'/rest/v1/nox_cinema_films';
function filmUrl(slug){return '/film.html?film='+encodeURIComponent(String(slug||''));}
function makeCard(f){
 var a=document.createElement('a');a.className='nox-reprise-card';a.href=filmUrl(f.slug);
 a.setAttribute('aria-label','Ouvrir la fiche de '+(f.title||'ce film'));
 var img=document.createElement('img');img.src=f.image||'';img.alt=f.title||'Affiche';img.loading='lazy';img.decoding='async';
 img.onerror=function(){img.remove();a.classList.add('no-poster');};a.appendChild(img);return a;
}
function renderHome(rows){
 var row=document.getElementById('noxDernieresSortiesRow');if(!row)return;row.innerHTML='';
 rows.slice(0,20).forEach(function(f){row.appendChild(makeCard(f));});
}
function renderCinema(rows){
 var rail=document.getElementById('cinemaRail');
 if(rail){rail.innerHTML='';rows.forEach(function(f){rail.appendChild(makeCard(f));});}
 var feature=document.querySelector('#cinema .cinema-feature');if(!feature||!rows.length)return;
 var f=rows[0],art=feature.querySelector('.cinema-art'),title=feature.querySelector('h2'),copy=feature.querySelector('p'),button=feature.querySelector('button.primary');
 if(art){art.style.backgroundImage=f.image?'url("'+String(f.image).replace(/"/g,'%22')+'")':'none';art.style.backgroundSize='cover';art.style.backgroundPosition='center';art.style.cursor='pointer';art.textContent='';art.onclick=function(){location.href=filmUrl(f.slug);};}
 if(title)title.textContent=f.title||'';if(copy)copy.textContent=f.synopsis||'Découvrez la fiche complète du film.';
 if(button){button.textContent='Plus d’infos';button.onclick=function(){location.href=filmUrl(f.slug);};}
}
function renderHero(f){
 if(!f)return;var hero=document.querySelector('.hero');if(!hero)return;
 var art=hero.querySelector('.hero-art.art-dune'),title=hero.querySelector('.hero-copy h1'),meta=hero.querySelector('.hero-copy .meta'),copy=hero.querySelector('.hero-copy p'),button=hero.querySelector('.hero-copy [data-film]');
 if(art&&f.image){art.style.backgroundImage='url("'+String(f.image).replace(/"/g,'%22')+'")';art.style.backgroundSize='cover';art.style.backgroundPosition='center';}
 if(title)title.textContent=f.title||'';if(meta)meta.textContent=[f.year,f.duration,f.genre,f.version||f.quality].filter(Boolean).join('  •  ');
 if(copy)copy.textContent=f.synopsis||'Découvrez la fiche complète de ce film.';
 if(button){button.dataset.film=f.title||'';button.onclick=function(){location.href=filmUrl(f.slug);};}
}
async function load(){
 try{
  var r=await fetch(API+'?select=slug,title,year,genre,duration,quality,version,synopsis,image,created_at&order=created_at.desc.nullslast&limit=50',{headers:{apikey:SUPABASE_KEY,Accept:'application/json'},cache:'no-store'});
  if(!r.ok)throw new Error('HTTP '+r.status);
  var data=await r.json(),rows=Array.isArray(data)?data.filter(function(f){return f&&f.slug&&f.title;}):[];
  if(!rows.length)return;renderHome(rows);renderCinema(rows);renderHero(rows[0]);
  document.documentElement.setAttribute('data-nox-cinema-live','1');
 }catch(e){console.warn('[NoxStream] Cinema live indisponible:',e);}
}
function start(){load();setTimeout(load,1000);setTimeout(load,3000);setTimeout(load,7000);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
window.addEventListener('load',function(){setTimeout(load,250);},{once:true});
window.noxReloadCinema=load;
})();
})();
