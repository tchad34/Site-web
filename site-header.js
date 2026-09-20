(function(){
  if(document.querySelector('.site-global-topbar')) return;
  var root = '/';
  var header = document.createElement('header');
  header.className = 'topbar site-global-topbar';
  header.innerHTML = `
    <button class="mobile-menu site-global-burger" type="button" aria-label="Ouvrir le menu">☰</button>
    <a class="wordmark site-global-wordmark" href="${root}index.html">Nox<span>Stream</span></a>
    <nav class="topnav site-global-nav" aria-label="Navigation principale">
      <a class="toplink" href="${root}index.html">Accueil</a>
    </nav>
    <button class="search-mini site-global-search" type="button" aria-label="Recherche">⌕ <span>Rechercher...</span></button>
    <a class="avatar site-global-avatar" href="${root}index.html" aria-label="Profil">N</a>`;
  document.body.insertBefore(header, document.body.firstChild);
  var search=header.querySelector('.site-global-search');
  search.addEventListener('click',function(){
    var searchOpen=document.getElementById('searchOpen');
    if(searchOpen){searchOpen.click();return;}
    window.location.href='/index.html#search';
  });
  var burger=header.querySelector('.site-global-burger');
  burger.addEventListener('click',function(){
    var drawer=document.querySelector('.site-global-drawer');
    if(drawer){drawer.remove();return;}
    drawer=document.createElement('div'); drawer.className='site-global-drawer';
    drawer.innerHTML='<a href="/index.html#list">♡&nbsp; Ma liste</a><a href="/index.html#profile">◌&nbsp; Profil</a><a href="/films.html">▦&nbsp; Genres</a>';
    document.body.appendChild(drawer);
  });
})();