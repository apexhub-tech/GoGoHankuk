/* Applies dashboard-published content (see cms-bridge.js) on top of the static
   defaults in content.js. Runs after content.js, before app.js, so app.js always
   renders the merged data. Also live-updates the page if the dashboard publishes
   again while this page is still open (e.g. two tabs side by side). */
(function () {
  if (!window.GGH_CMS || !window.SITE_CONTENT) return;

  function mergeNews(base, incoming) {
    if (!Array.isArray(incoming) || !incoming.length) return base;
    const mapped = incoming.map(n => ({
      slug: n.slug || String(n.id || n.title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      tag: (n.category || 'NEWS').toUpperCase(),
      title: n.title,
      image: n.image || 'assets/figma/why-campus.jpg',
      meta: n.updated ? `${n.updated} · Go Go Hankuk` : 'Go Go Hankuk',
      body: n.body || n.desc || '',
    }));
    const existingSlugs = new Set(mapped.map(n => n.slug));
    return mapped.concat(base.filter(n => !existingSlugs.has(n.slug)));
  }

  function applyOverlay(shared) {
    const content = shared && shared.content;
    if (!content) return;
    const data = window.SITE_CONTENT;
    if (Array.isArray(content.news)) data.news = mergeNews(data.news, content.news);
    if (Array.isArray(content.team) && content.team.length) {
      data.team = content.team.map(t => ({ name: t.name, role: t.role }));
    }
    if (Array.isArray(content.universities) && content.universities.length) {
      data.universities = content.universities.map(u => ({
        slug: u.slug, name: u.name, logo: u.logo,
        location: u.location, programs: u.programs, website: u.website,
      }));
    }
    if (content.mainBanner && content.mainBanner.image) {
      document.querySelectorAll('.web-banner img').forEach(img => { img.src = content.mainBanner.image; });
    }
    if (Array.isArray(content.banners) && content.banners.length) {
      const b = content.banners[0];
      if (document.getElementById('hero-title') && b.title) data.hero.title = b.title;
      if (document.getElementById('hero-description') && b.subtitle) data.hero.description = b.subtitle;
    }
  }

  // Apply once synchronously so app.js (which runs right after, also deferred)
  // sees the merged data on first render.
  applyOverlay(window.GGH_CMS.read());

  // If the dashboard publishes again while this page is already open (e.g. two
  // tabs side by side), reload so app.js re-renders with the new merged data —
  // simplest reliable way to reflect a live push without duplicating app.js's
  // render logic here.
  let first = true;
  window.GGH_CMS.onUpdate(function () {
    if (first) { first = false; return; }
    location.reload();
  });
})();
