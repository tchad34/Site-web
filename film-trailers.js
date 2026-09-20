(async function () {
  const filmTitle = document.body.dataset.film;
  const player = document.querySelector('[data-film-trailer]');
  if (!filmTitle || !player) return;

  try {
    const data = {};
    for (let i = 1; i <= 9999; i++) {
      const n = String(i).padStart(3, '0');
      const response = await fetch('../bandes-annonces/bandes-annonces-' + n + '.json', { cache: 'no-store' });
      if (response.status === 404) break;
      if (!response.ok) throw new Error('Impossible de charger bandes-annonces-' + n + '.json');
      const chunk = await response.json();
      if (chunk && typeof chunk === 'object' && !Array.isArray(chunk)) Object.assign(data, chunk);
    }
    const trailerUrl = data[filmTitle];
    if (!trailerUrl) return;

    player.src = trailerUrl;
    player.hidden = false;

  } catch (error) {
    console.error('Bande-annonce indisponible :', error);
  }
})();
