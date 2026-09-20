
let filmImages={};
let filmTrailers={};
let filmTrailersPromise=null;
async function loadJsonChunks(folder,prefix){
  const merged={};
  for(let i=1;i<=9999;i++){
    const n=String(i).padStart(3,"0");
    const url=`${folder}/${prefix}-${n}.json`;
    try{
      const response=await fetch(url,{cache:"no-store"});
      if(response.status===404) break;
      if(!response.ok) throw new Error(url);
      const data=await response.json();
      if(data && typeof data==="object" && !Array.isArray(data)) Object.assign(merged,data);
    }catch(e){
      if(i===1) throw e;
      break;
    }
  }
  return merged;
}
async function loadFilmImages(){
  try{
    filmImages=await loadJsonChunks("images-films","images-films");
    applyFilmImages();
  }catch(e){ console.warn("Images centrales indisponibles",e); }
}
function loadFilmTrailers(){
  if(filmTrailersPromise) return filmTrailersPromise;
  filmTrailersPromise=(async()=>{
    try{ filmTrailers=await loadJsonChunks("bandes-annonces","bandes-annonces"); }
    catch(e){ console.warn("Bandes-annonces centrales indisponibles",e); filmTrailers={}; }
    return filmTrailers;
  })();
  return filmTrailersPromise;
}
function applyFilmImages(){
  document.querySelectorAll("[data-film]").forEach(el=>{
    const url=filmImages[el.dataset.film];
    if(!url) return;
    el.style.backgroundColor="transparent";
    el.style.backgroundImage=`url("${url.replace(/"/g,'\\"')}")`;
    el.style.backgroundSize="cover";
    el.style.backgroundPosition="center";
    el.style.backgroundRepeat="no-repeat";
  });
}
const fallbackFilms=[
["Dune — Partie Deux","2024","Science-fiction","poster-dune",""],
["Oppenheimer","2023","Drame","poster-oppen",""],
["John Wick 4","2023","Action","poster-johnwick",""],
["The Batman","2022","Thriller","poster-batman","Films/the-batman.html"],
["Avatar : La Voie de l'eau","2022","Science-fiction","poster-avatar",""],
["Gladiator II","2024","Action","poster-gladiator",""],
["Joker : Folie à Deux","2024","Drame","poster-joker","Films/joker-folie-a-deux.html"],
["Interstellar","2014","Science-fiction","poster-interstellar",""],
["Mad Max : Fury Road","2015","Action","poster-madmax",""],
["Blade Runner 2049","2017","Science-fiction","poster-interstellar",""],
["Top Gun Maverick","2022","Action","poster-batman",""],
["Napoléon","2023","Drame","poster-gladiator",""]
];

const series=[
["Fallout","2024","Science-fiction","poster-interstellar"],
["The Last of Us","2023","Drame","poster-dune"],
["House of the Dragon","2024","Drame","poster-joker"],
["Shōgun","2024","Drame","poster-gladiator"],
["The Penguin","2024","Thriller","poster-batman"],
["Arcane","2024","Animation","poster-avatar"]
];

const desc={
"Dune — Partie Deux":"Paul Atreides s'unit à Chani et aux Fremen pour préparer sa revanche contre ceux qui ont détruit sa famille.",
"Oppenheimer":"Le parcours du scientifique J. Robert Oppenheimer et son rôle dans la création de la première bombe atomique.",
"John Wick 4":"John Wick affronte ses adversaires les plus redoutables dans un nouveau chapitre spectaculaire.",
"The Batman":"Batman enquête sur une série de crimes qui révèle les profondeurs les plus sombres de Gotham."
};

let films=[...fallbackFilms];

function getMyList(){try{const a=JSON.parse(localStorage.getItem('noxstream_list')||'[]');return Array.isArray(a)?a:[]}catch(e){return[]}}
function toggleMyList(title,btn){let a=getMyList();const i=a.indexOf(title);if(i>=0){a.splice(i,1);btn.textContent='＋';btn.setAttribute('aria-label','Ajouter à ma liste');btn.title='Ajouter à ma liste';btn.classList.remove('is-active')}else{a.push(title);btn.textContent='✓';btn.setAttribute('aria-label','Retirer de ma liste');btn.title='Retirer de ma liste';btn.classList.add('is-active')}try{localStorage.setItem('noxstream_list',JSON.stringify(a))}catch(e){};renderFilms()}
function card(item){
  const title=item[0], year=item[1], genre=item[2], poster=item[3], file=item[4]||"";
  const link=file ? `<a class="film-link" href="${file}" onclick="event.stopPropagation()">` : "";
  const end=file ? "</a>" : "";
  const active=getMyList().includes(title);
  return `${link}<article class="card ${poster}" data-film="${title}"><b>${title}</b><small>${year} · ${genre}</small><button type="button" class="film-add${active?' is-active':''}" aria-label="${active?'Retirer de ma liste':'Ajouter à ma liste'}" title="${active?'Retirer de ma liste':'Ajouter à ma liste'}">${active?'✓':'＋'}</button></article>${end}`;
}
function fill(id,data){
  const el=document.getElementById(id);
  if(el) { el.innerHTML=data.map(card).join(""); el.querySelectorAll('.film-add').forEach(btn=>btn.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();const film=btn.closest('[data-film]');if(film)toggleMyList(film.dataset.film,btn);})); }
}
function renderFilms(){
  fill("catalog",films);
  const mine=new Set(getMyList());
  fill("listCatalog",films.filter(x=>mine.has(x[0])));
  const note=document.getElementById("filmsNote");
  if(note) note.textContent=`${films.length} film(s) détecté(s) dans le catalogue.`;
}
function renderCinema(){
  const el=document.getElementById("cinemaRail");
  if(el) el.innerHTML=films.slice(5,10).map(card).join("");
}
function renderAll(){
  renderFilms();
  fill("seriesCatalog",series);
  renderCinema();
}
async function loadFilmManifest(){
  try{
    const response=await fetch("Films/catalogue.json",{cache:"no-store"});
    if(!response.ok) throw new Error("manifest");
    const data=await response.json();
    if(Array.isArray(data) && data.length){
      films=data.map(x=>[
        x.title||x.name||"Film",
        x.year||"",
        x.genre||"",
        x.posterClass||"poster-batman",
        x.file||""
      ]);
    }
  }catch(e){
    // Le site reste fonctionnel avec le catalogue de secours.
  }
  renderAll();
}

function openPage(id){
  const target=document.getElementById(id);
  if(!target)return;
  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active-page"));
  target.classList.add("active-page");
  document.querySelectorAll("[data-page]").forEach(b=>b.classList.toggle("active",b.dataset.page===id));
  const main=document.querySelector(".main");
  if(main)main.scrollTop=0;
}

function openFilmPage(title){
  const item=films.find(x=>x&&x[0]===title);
  if(item&&item[4]){ window.location.href=item[4]; return; }
  const special={"Dune — Partie Deux":"Films/dune-partie-deux.html"};
  if(special[title]){ window.location.href=special[title]; return; }
  const slug=String(title||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"");
  if(slug) window.location.href=`Films/${slug}.html`;
}

document.addEventListener("click",function(e){const info=e.target.closest(".hero-copy [data-film]");if(info){e.preventDefault();openFilmPage(info.dataset.film);}},true);

document.addEventListener("click",e=>{
  const pageButton=e.target.closest("[data-page]");
  if(pageButton){openPage(pageButton.dataset.page);return}
  const film=e.target.closest("[data-film]");
  if(film){
    const link=film.closest("a.film-link");
    if(link) return;
    openFilmPage(film.dataset.film);
    return;
  }
});

document.getElementById("searchOpen").onclick=()=>{
  openPage("search");
  setTimeout(()=>document.getElementById("searchInput").focus(),50);
};

const input=document.getElementById("searchInput");
input.addEventListener("input",()=>{
  const q=input.value.toLowerCase().trim();
  const out=films.concat(series).filter(x=>x[0].toLowerCase().includes(q)||x[2].toLowerCase().includes(q));
  document.getElementById("searchResults").innerHTML=(q?out:films.slice(0,6)).map(card).join("");
});

document.querySelectorAll(".chip").forEach(ch=>{
  ch.onclick=()=>{
    ch.parentElement.querySelectorAll(".chip").forEach(x=>x.classList.remove("active"));
    ch.classList.add("active");
  };
});

window.addEventListener("load",()=>{
  loadFilmImages();
  loadFilmTrailers();
  loadFilmManifest();
  // Le splash est désormais contrôlé exclusivement par le verrou de création du profil.
  // Aucun fondu automatique ne doit être déclenché ici.
});
