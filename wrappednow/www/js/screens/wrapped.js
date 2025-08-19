// www/js/screens/wrapped.js
(function () {
  // ---------- View (HTML shell) ----------
  window.WrappedScreen = function WrappedScreen() {
    return `
      <div id="wrapped-root" class="wr-stage">
        <div class="wr-bg"></div>

        <div class="wr-topbar">
          <a href="#/home" class="wr-back">⟵ Back</a>
          <label class="wr-range">
            <select id="wr-range">
              <option value="short_term">Last 4 Weeks</option>
              <option value="medium_term" selected>Last 6 Months</option>
              <option value="long_term">All Time</option>
            </select>
          </label>
        </div>

        <div id="wr-slides" class="wr-slides">
          <div class="wr-loading">Loading…</div>
        </div>

        <div id="wr-progress" class="wr-dots"></div>
        <div id="wr-hint" class="wr-hint">Tap to continue</div>
      </div>
    `;
  };

  // ---------- HTTP helper (prefers AdvancedHTTP in Cordova) ----------
  async function httpJson(url, token) {
    const http = window.cordova?.plugin?.http;
    if (http) {
      return new Promise((resolve, reject) => {
        http.sendRequest(url, {
          method: 'get',
          headers: { Authorization: `Bearer ${token}` }
        }, res => {
          try { resolve(JSON.parse(res.data)); }
          catch (e) { reject(e); }
        }, reject);
      });
    }
    const r = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!r.ok) throw new Error(`HTTP ${r.status}: ${await r.text()}`);
    return r.json();
  }

  // ---------- Data gatherer ----------
  async function getWrappedStats(range) {
    const token = localStorage.getItem('spotify_access_token');
    if (!token) throw new Error('No access token');

    let topTracks = { items: [] };
    let topArtists = { items: [] };
    let recent = { items: [] };

    try {
      topTracks = await httpJson(`https://api.spotify.com/v1/me/top/tracks?limit=10&time_range=${range}`, token);
    } catch (e) { console.warn('[Wrapped] top tracks failed:', e); }

    try {
      topArtists = await httpJson(`https://api.spotify.com/v1/me/top/artists?limit=10&time_range=${range}`, token);
    } catch (e) { console.warn('[Wrapped] top artists failed:', e); }

    try {
      recent = await httpJson(`https://api.spotify.com/v1/me/player/recently-played?limit=50`, token);
    } catch (e) { console.warn('[Wrapped] recently played failed:', e); }

    // Minutes (approx from last 50 plays)
    const minutes = Math.max(0, Math.round((recent.items || [])
      .reduce((s, it) => s + ((it.track?.duration_ms || 0) / 60000), 0)));

    // Top genre from top artists
    const genreCount = {};
    (topArtists.items || []).forEach(a => (a.genres || []).forEach(g => genreCount[g] = (genreCount[g] || 0) + 1));
    const topGenre = Object.entries(genreCount).sort((a,b)=>b[1]-a[1])[0]?.[0] || '—';

    // Audio features vibe from top tracks
    const ids = (topTracks.items || []).map(t => t.id).filter(Boolean).slice(0, 5);
    let energy=0, danceability=0, valence=0;
    if (ids.length) {
      try {
        const feats = await httpJson(`https://api.spotify.com/v1/audio-features?ids=${ids.join(',')}`, token);
        const arr = feats.audio_features?.filter(Boolean) || [];
        if (arr.length) {
          energy       = Math.round(arr.reduce((s,f)=>s+(f.energy||0),0)        / arr.length * 100);
          danceability = Math.round(arr.reduce((s,f)=>s+(f.danceability||0),0)  / arr.length * 100);
          valence      = Math.round(arr.reduce((s,f)=>s+(f.valence||0),0)       / arr.length * 100);
        }
      } catch (e) { console.warn('[Wrapped] audio-features failed:', e); }
    }

    // Primary items + images
    const topSong   = topTracks.items?.[0] || null;
    const topArtist = topArtists.items?.[0] || null;

    const top5Tracks = (topTracks.items || []).slice(0, 5).map(t => ({
      name: t.name,
      artist: (t.artists || []).map(a=>a.name).join(', '),
      cover: (t.album?.images?.[2]?.url || t.album?.images?.[1]?.url || t.album?.images?.[0]?.url || '')
    }));

    return {
      minutes, topGenre, energy, danceability, valence,
      topSongName: topSong?.name || '—',
      topSongArtist: (topSong?.artists || []).map(a=>a.name).join(', ') || '',
      topSongCover: topSong?.album?.images?.[0]?.url || '',
      topArtistName: topArtist?.name || '—',
      topArtistImg:  topArtist?.images?.[0]?.url || '',
      top5Tracks
    };
  }

  // ---------- Slides ----------
  const cssUrl = (u) => String(u || '').replace(/'/g, '%27');

  function slideTitle() {
    return `
      <section class="wr-slide bg-hero active">
        <div class="wr-hero">WRAPPED</div>
        <div class="wr-hero-sub">Tap to begin</div>
      </section>`;
  }

  function slideTopSong(s) {
    return `
      <section class="wr-slide bg-1">
        <h2 class="wr-heading">Top Song</h2>
        <div class="wr-media pop">
          <div class="wr-cover" style="${s.topSongCover ? `background-image:url('${cssUrl(s.topSongCover)}')` : ''}"></div>
          <div class="wr-media-meta">
            <div class="wr-big">${s.topSongName}</div>
            <div class="wr-sub">${s.topSongArtist}</div>
          </div>
        </div>
      </section>`;
  }

  function slideTopArtist(s) {
    return `
      <section class="wr-slide bg-2">
        <h2 class="wr-heading">Top Artist</h2>
        <div class="wr-media pop">
          <div class="wr-artist" style="${s.topArtistImg ? `background-image:url('${cssUrl(s.topArtistImg)}')` : ''}"></div>
          <div class="wr-media-meta">
            <div class="wr-big">${s.topArtistName}</div>
            <div class="wr-sub">Your #1 artist</div>
          </div>
        </div>
      </section>`;
  }

  function slideMinutes(s) {
    return `
      <section class="wr-slide bg-3">
        <h2 class="wr-heading">Listening Time</h2>
        <div class="wr-card pop center">
          <div class="wr-label">Total Minutes (recent)</div>
          <div class="wr-counter" data-to="${s.minutes}">0</div>
        </div>
        <div class="wr-note">Approx. from last 50 plays</div>
      </section>`;
  }

  function slideGenre(s) {
    return `
      <section class="wr-slide bg-4">
        <h2 class="wr-heading">Top Genre</h2>
        <div class="wr-chip pop">${s.topGenre}</div>
      </section>`;
  }

  function barRow(label, pct) {
    return `
      <div class="wr-bar">
        <span>${label}</span>
        <div class="wr-bar-track"><i class="wr-bar-fill" style="--to:${pct}%"></i></div>
        <b>${pct}%</b>
      </div>`;
  }

  function slideVibe(s) {
    return `
      <section class="wr-slide bg-5">
        <h2 class="wr-heading">Your Vibe</h2>
        <div class="wr-bars pop">
          ${barRow('Energy', s.energy)}
          ${barRow('Danceability', s.danceability)}
          ${barRow('Positivity', s.valence)}
        </div>
      </section>`;
  }

  function slideTop5(s) {
    const list = (s.top5Tracks || []).map((t,i)=>`
      <li class="wr-li pop" style="--i:${i}">
        <div class="wr-li-cover" style="${t.cover ? `background-image:url('${cssUrl(t.cover)}')` : ''}"></div>
        <div class="wr-li-meta">
          <div class="wr-li-title">${t.name}</div>
          <div class="wr-li-sub">${t.artist}</div>
        </div>
        <div class="wr-li-rank">#${i+1}</div>
      </li>
    `).join('');
    return `
      <section class="wr-slide bg-6">
        <h2 class="wr-heading">Top Tracks</h2>
        <ul class="wr-list">${list}</ul>
      </section>`;
  }

  function slideEnd() {
    return `
      <section class="wr-slide bg-end">
        <h2 class="wr-heading">That’s a wrap 🎁</h2>
        <div class="wr-chip pop">Tap to replay</div>
      </section>`;
  }

  // ---------- Controller ----------
  let idx = 0, total = 0, mounted = false;

  function countUp(el, to, ms=1200) {
    const start = performance.now(), from = 0;
    const step = (t) => {
      const p = Math.min(1, (t - start) / ms);
      el.textContent = Math.round(from + (to - from) * (1 - Math.cos(p*Math.PI))/2).toLocaleString();
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  function activateSlide(el) {
    el.querySelectorAll('.wr-counter').forEach(c => {
      const to = parseInt(c.getAttribute('data-to') || '0', 10);
      countUp(c, to);
    });
    el.querySelectorAll('.wr-bar-fill').forEach(b => {
      b.style.width = '0%';
      requestAnimationFrame(()=> requestAnimationFrame(()=>{
        b.style.width = b.style.getPropertyValue('--to') || '0%';
      }));
    });
  }

  const buildDots = (n) => Array.from({length:n}, () => '<div class="wr-dot"></div>').join('');

  async function mount() {
    const root = document.getElementById('wrapped-root');
    if (!root || mounted) return;

    // require a token (prevents the “Could not load” when only profile is cached)
    if (!localStorage.getItem('spotify_access_token')) { location.hash = '#/login'; return; }

    mounted = true;

    const slides = document.getElementById('wr-slides');
    const dots   = document.getElementById('wr-progress');
    const hint   = document.getElementById('wr-hint');
    const rangeSel = document.getElementById('wr-range');

    async function load(range) {
      slides.innerHTML = `<div class="wr-loading">Loading…</div>`;
      hint.style.opacity = '0';

      try {
        const s = await getWrappedStats(range);
        const html = [
          slideTitle(),
          slideTopSong(s),
          slideTopArtist(s),
          slideMinutes(s),
          slideGenre(s),
          slideVibe(s),
          slideTop5(s),
          slideEnd()
        ].join('');

        slides.innerHTML = html;

        // set up slide state + dots
        const all = slides.querySelectorAll('.wr-slide');
        idx = 0;
        total = all.length;
        dots.innerHTML = buildDots(total);
        dots.children[0]?.classList.add('on');

        // kick first animations
        activateSlide(all[0]);

        setTimeout(()=>hint.style.opacity='1', 250);
      } catch (e) {
        console.error('[Wrapped] load error:', e);
        slides.innerHTML = `<div class="wr-error">Could not load your stats.<br><small>Check scopes and network.</small></div>`;
      }
    }

    await load(rangeSel.value);

    // Tap to advance
    root.addEventListener('click', (ev) => {
      const tag = ev.target?.tagName?.toLowerCase();
      if (tag === 'select' || tag === 'option' || tag === 'a') return;

      const all = slides.querySelectorAll('.wr-slide');
      if (!all.length) return;

      all[idx]?.classList.remove('active');
      dots.children[idx]?.classList.remove('on');

      idx = (idx + 1) % total;

      all[idx]?.classList.add('active');
      dots.children[idx]?.classList.add('on');
      activateSlide(all[idx]);

      hint.textContent = (idx === total - 1) ? 'Tap to replay' : 'Tap to continue';
    });

    // Range change
    rangeSel.addEventListener('change', () => load(rangeSel.value));
  }

  // Auto-mount when the screen is in the DOM
  function tryMount() {
    if (document.getElementById('wrapped-root')) mount();
  }
  tryMount();
  const mo = new MutationObserver(tryMount);
  const app = document.getElementById('app');
  if (app) mo.observe(app, { childList: true, subtree: true });
})();

// Ensure global registration (router looks for either name)
window.Wrapped = window.WrappedScreen;
console.log('[wrapped] registered?', typeof window.WrappedScreen);
