(async function () {
  const filmTitle = document.body?.dataset?.film;
  const img = document.querySelector('[data-film-poster]');
  if (!filmTitle || !img) return;

  async function loadFilmImagesLikeCatalog() {
    const merged = {};
    for (let i = 1; i <= 9999; i++) {
      const n = String(i).padStart(3, '0');
      const url = new URL(`../images-films/images-films-${n}.json`, document.baseURI).href;
      try {
        const response = await fetch(url, { cache: 'no-store' });
        if (response.status === 404) break;
        if (!response.ok) throw new Error(url);
        const data = await response.json();
        if (data && typeof data === 'object' && !Array.isArray(data)) Object.assign(merged, data);
      } catch (e) {
        if (i === 1) throw e;
        break;
      }
    }
    return merged;
  }

  try {
    const images = await loadFilmImagesLikeCatalog();
    const imageUrl = images[filmTitle];
    if (!imageUrl) {
      console.warn('Image introuvable dans images-films :', filmTitle);
      return;
    }

    img.setAttribute('src', imageUrl);
    img.setAttribute('alt', filmTitle);
    img.removeAttribute('hidden');
    img.style.display = 'block';
    img.style.width = '100%';
    img.style.height = 'auto';
    img.style.maxHeight = 'none';
    img.style.objectFit = 'contain';

    img.addEventListener('error', () => {
      console.error('URL R2 non chargée :', imageUrl);
    }, { once: true });
  } catch (error) {
    console.error('Image film indisponible :', error);
  }
})();
