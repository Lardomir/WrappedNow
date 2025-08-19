// www/js/screens/wrapped.js
(function () {
  // ---------- Inject minimal CSS so it never renders "black" ----------
  function injectCSS() {
    if (document.getElementById('wr-inline-css')) return;
    const css = `
      .wr-stage{min-height:100dvh;position:relative;color:#fff;overflow:hidden}
      .wr-topbar{display:flex;justify-content:space-between;align-items:center;padding:12px 14px}
      .wr-topbar a{color:#fff;text-decoration:none;opacity:.9}
      .wr-range select{padding:8px 10px;border-radius:10px;border:1px solid rgba(255,255,255,.18);background:#0b0f14;color:#fff}

      .wr-slides{position:relative}
      .wr-slide{display:none;padding:14px 16px 22px}
      .wr-slide.active{display:block}
      .wr-heading{margin:8px 0 12px 0;font-weight:900;font-size:22px;letter-spacing:.2px}
      .wr-loading,.wr-error{padding:24px;text-align:center;opacity:.9}

      .wr-hero{font-weight:900;font-size:32px;margin:24px 6px 6px}
      .wr-hero-sub{opacity:.9;margin:0 6px 12px}
      .wr-hint{text-align:center;margin:10px 0 14px;opacity:.85}
      .wr-dots{display:flex;gap:6px;justify-content:center;margin-top:8px}
      .wr-dots .wr-dot{width:6px;height:6px;border-radius:50%;background:#fff;opacity:.35}
      .wr-dots .wr-dot.on{opacity:1}

      .wr-media{display:flex;gap:12px;align-items:center;padding:12px 16px;background:#0b0f14;border-radius:14px;border:1px solid rgba(255,255,255,.08)}
      .wr-cover{width:64px;height:64px;border-radius:8px;background:#222;background-size:cover;background-position:center}
      .wr-artist{width:64px;height:64px;border-radius:50%;background:#222;background-size:cover;background-position:center}
      .wr-big{font-weight:800}
      .wr-sub{opacity:.8}

      .wr-card.center{padding:16px;background:#0b0f14;border-radius:14px;border:1px solid rgba(255,255,255,.08);text-align:center}
      .wr-label{opacity:.8;font-size:12px;text-transform:uppercase;letter-spacing:.3px}
      .wr-counter{font-size:32px;font-weight:900;margin-top:6px}
      .wr-note{opacity:.7;margin-top:8px;font-size:12px}

      .wr-chip{display:inline-block;padding:12px 14px;border-radius:14px;background:#0b0f14;border:1px solid rgba(255,255,255,.08);font-weight:800}
      .wr-bars{padding:12px 14px;border-radius:14px;background:#0b0f14;border:1px solid rgba(255,255,255,.08)}
      .wr-bar{display:flex;align-items:center;gap:8px;margin:8px 0}
      .wr-bar span{width:110px;opacity:.9}
      .wr-bar-track{flex:1;height:8px;border-radius:999px;background:rgba(255,255,255,.12);overflow:hidden}
      .wr-bar-fill{display:block;height:100%;width:0;background:#1DB954;transition:width .9s ease}
      .wr-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}
      .wr-li{display:flex;gap:10px;align-items:center;padding:10px;border-radius:12px;background:#0b0f14;border:1px solid rgba(255,255,255,.08)}
      .wr-li-cover{width:44px;height:44px;border-radius:6px;background:#222;background-size:cover;background-position:center}
      .wr-li-title{font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .wr-li-sub{opacity:.75;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .wr-li-rank{opacity:.9}

      /* fun backgrounds per slide */
      .bg-hero{background:radial-gradient(120% 60% at 0% 0%, #ff7a18 0%, transparent 60%),radial-gradient(120% 60% at 100% 0%, #9c27b0 0%, transparent 60%),linear-gradient(160deg,#1DB95422,#000)}
      .bg-1{background:linear-gradient(140deg,#FF3CAC 0%,#784BA0 50%,#2B86C5 100%)}
      .bg-2{background:linear-gradient(135deg,#ff7e5f 0%,#feb47b 100%)}
      .bg-3{background:linear-gradient(135deg,#43cea2 0%,#185a9d 100%)}
      .bg-4{background:linear-gradient(135deg,#f7971e 0%,#ffd200 100%)}
      .bg-5{background:linear-gradient(135deg,#00c6ff 0%,#0072ff 100%)}
      .bg-6{background:linear-gradient(135deg,#e53935 0%,#e35d5b 100%)}
      .bg-end{background:linear-gradient(135deg,#1DB954 0%,#0a7f39 100%)}
    `;
    const tag = document.createElement('style');
    tag.id = 'wr-inline-css';
    tag.textContent = css;
    document.head.appendChild(tag);
  }

  // ---------- View ----------
  window.WrappedScreen = function WrappedScreen() {
    injectCSS();
    return `
      <div id="wrapped-root" class="wr-stage">
        <div class="wr-topbar">
          <a href="#/home">⟵ Back</a>
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

        <div id="wr-dots" class="wr-dots"></div>
        <div id="wr-hint" class="wr-hint">Tap to continue</div>
      </div>
    `;
  };

  // ---------- HTTP (AdvancedHTTP first) ----------
  async function httpJson(url, token) {
    const http = window.cordova?.plugin?.http;
    if (http) {
      return new Promise((resolve, reject) => {
        http.sendRequest(url, { method: 'get', headers: { Authorization: `Bearer ${token}` } },
          res => { try { resolve(JSON.parse(res.data)); } catch (e) { reject(e); } },
          reject
        );
      });
    }
    const r = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!r.ok) throw new Error(`HTTP ${r.status}: ${await r.text()}`);
    return r.json();
  }

  // ---------- Data ----------
  async function getWrappedStats(range) {
    const token = localStorage.getItem('spotify_access_token');
    if (!token) throw new Error('No access token');

    let topTracks = { items: [] }, topArtists = { items: [] }, recent = { items: [] };

    try { topTracks = await httpJson(`https://api.spotify.com/v1/me/top/tracks?limit=10&time_range=${range}`, token); }
    catch (e) { console.warn('[Wrapped] top tracks failed:', e); }

    try { topArtists = await httpJson(`https://api.spotify.com/v1/me/top/artists?limit=10&time_range=${range}`, token); }
    catch (e) { console.warn('[Wrapped] top artists failed:', e); }

    try { recent = await httpJson(`https://api.spotify.com/v1/me/player/recently-played?limit=50`, token); }
    catch (e) { console.warn('[Wrapped] recently played failed:', e); }

    const minutes = Math.max(0, Math.round((recent.items || [])
      .reduce((s, it) => s + ((it.track?.duration_ms || 0) / 60000), 0)));

    const genreCount = {};
    (topArtists.items || []).forEach(a => (a.genres || []).forEach(g => genreCount[g] = (genreCount[g] || 0) + 1));
    const topGenre = Object.entries(genreCount).sort((a,b)=>b[1]-a[1])[0]?.[0] || '—';

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

    const topSong   = topTracks.items?.[0] || null;
    const topArtist = topArtists.items?.[0] || null;

    const top5Tracks = (topTracks.items || []).slice(0, 5).map((t,i)=>({
      name: t.name,
      artist: (t.artists||[]).map(a=>a.name).join(', '),
      cover: (t.album?.images?.[2]?.url || t.album?.images?.[1]?.url || t.album?.images?.[0]?.url || ''),
      rank: i+1
    }));

    const payload = {
      minutes, topGenre, energy, danceability, valence,
      topSongName: topSong?.name || '—',
      topSongArtist: (topSong?.artists||[]).map(a=>a.name).join(', ') || '',
      topSongCover: topSong?.album?.images?.[0]?.url || '',
      topArtistName: topArtist?.name || '—',
      topArtistImg:  topArtist?.images?.[0]?.url || '',
      top5Tracks
    };
    console.log('[Wrapped] stats:', payload);
    return payload;
  }

  // ---------- Slides ----------
  const escUrl = (u) => String(u || '').replace(/'/g, '%27');

  const Slides = {
    title: () => `
      <section class="wr-slide bg-hero active">
        <div class="wr-hero">WRAPPED</div>
        <div class="wr-hero-sub">Tap to begin</div>
      </section>`,

    topSong: (s) => `
      <section class="wr-slide bg-1">
        <h2 class="wr-heading">Top Song</h2>
        <div class="wr-media">
          <div class="wr-cover" style="${s.topSongCover?`background-image:url('${escUrl(s.topSongCover)}')`:''}"></div>
          <div>
            <div class="wr-big">${s.topSongName}</div>
            <div class="wr-sub">${s.topSongArtist}</div>
          </div>
        </div>
      </section>`,

    topArtist: (s) => `
      <section class="wr-slide bg-2">
        <h2 class="wr-heading">Top Artist</h2>
        <div class="wr-media">
          <div class="wr-artist" style="${s.topArtistImg?`background-image:url('${escUrl(s.topArtistImg)}')`:''}"></div>
          <div class="wr-big">${s.topArtistName}</div>
        </div>
      </section>`,

    minutes: (s) => `
      <section class="wr-slide bg-3">
        <h2 class="wr-heading">Listening Time</h2>
        <div class="wr-card center">
          <div class="wr-label">Total Minutes (recent)</div>
          <div class="wr-counter" data-to="${s.minutes}">0</div>
        </div>
        <div class="wr-note">Approx. from last 50 plays</div>
      </section>`,

    genre: (s) => `
      <section class="wr-slide bg-4">
        <h2 class="wr-heading">Top Genre</h2>
        <div class="wr-chip">${s.topGenre}</div>
      </section>`,

    vibe: (s) => {
      const bar = (label, pct) => `
        <div class="wr-bar">
          <span>${label}</span>
          <div class="wr-bar-track"><i class="wr-bar-fill" data-to="${pct}"></i></div>
          <b>${pct}%</b>
        </div>`;
      return `
        <section class="wr-slide bg-5">
          <h2 class="wr-heading">Your Vibe</h2>
          <div class="wr-bars">
            ${bar('Energy', s.energy)}
            ${bar('Danceability', s.danceability)}
            ${bar('Positivity', s.valence)}
          </div>
        </section>`;
    },

    top5: (s) => `
      <section class="wr-slide bg-6">
        <h2 class="wr-heading">Top Tracks</h2>
        <ul class="wr-list">
          ${(s.top5Tracks||[]).map(t=>`
            <li class="wr-li">
              <div class="wr-li-cover" style="${t.cover?`background-image:url('${escUrl(t.cover)}')`:''}"></div>
              <div style="flex:1;min-width:0">
                <div class="wr-li-title">${t.name}</div>
                <div class="wr-li-sub">${t.artist}</div>
              </div>
              <div class="wr-li-rank">#${t.rank}</div>
            </li>`).join('')}
        </ul>
      </section>`,

    end: () => `
      <section class="wr-slide bg-end">
        <h2 class="wr-heading">That’s a wrap 🎁</h2>
        <div class="wr-chip">Tap to replay</div>
      </section>`
  };

  // ---------- Controller ----------
  let index = 0, total = 0, mounted = false;

  function countUp(el, to, ms=1200) {
    const start = performance.now();
    const step = (t) => {
      const p = Math.min(1, (t - start) / ms);
      el.textContent = Math.round(to * (1 - Math.cos(p * Math.PI) / 2)).toLocaleString();
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  function activateSlide(slide) {
    slide.querySelectorAll('.wr-counter').forEach(c => {
      const to = parseInt(c.getAttribute('data-to') || '0', 10);
      countUp(c, to);
    });
    slide.querySelectorAll('.wr-bar-fill').forEach(b => {
      const to = Number(b.getAttribute('data-to') || 0);
      b.style.width = '0%';
      requestAnimationFrame(()=> requestAnimationFrame(()=> { b.style.width = `${to}%`; }));
    });
  }
  function show(slides, i, dots) {
    slides.forEach((el, j) => el.classList.toggle('active', j === i));
    if (dots) Array.from(dots.children).forEach((d,k)=> d.classList.toggle('on', k===i));
    activateSlide(slides[i]);
  }
  const dotStrip = (n) => Array.from({length:n}).map(()=>`<i class="wr-dot"></i>`).join('');

  async function mount() {
    if (mounted) return;
    const root = document.getElementById('wrapped-root');
    if (!root) return;
    if (!localStorage.getItem('spotify_access_token')) { location.hash = '#/login'; return; }
    mounted = true;

    const slidesEl = document.getElementById('wr-slides');
    const dotsEl   = document.getElementById('wr-dots');
    const hintEl   = document.getElementById('wr-hint');
    const rangeSel = document.getElementById('wr-range');

    async function load(range) {
      slidesEl.innerHTML = `<div class="wr-loading">Loading…</div>`;
      hintEl.style.opacity = '.2';
      try {
        const s = await getWrappedStats(range);
        slidesEl.innerHTML = [
          Slides.title(), Slides.topSong(s), Slides.topArtist(s),
          Slides.minutes(s), Slides.genre(s), Slides.vibe(s),
          Slides.top5(s), Slides.end()
        ].join('');

        const slides = Array.from(slidesEl.querySelectorAll('.wr-slide'));
        total = slides.length;
        index = 0;
        dotsEl.innerHTML = dotStrip(total);
        show(slides, index, dotsEl);
        setTimeout(()=>hintEl.style.opacity='1', 250);
      } catch (e) {
        console.error('[Wrapped] load error:', e);
        slidesEl.innerHTML = `<div class="wr-error">Could not load your stats.<br><small>Check scopes/network.</small></div>`;
      }
    }

    await load(rangeSel.value);

    // Tap to advance
    root.addEventListener('click', (ev) => {
      const tag = ev.target?.tagName?.toLowerCase();
      if (tag === 'select' || tag === 'option' || tag === 'a') return;

      const slides = Array.from(slidesEl.querySelectorAll('.wr-slide'));
      if (!slides.length) return;

      index = (index + 1) % total;
      show(slides, index, dotsEl);
      hintEl.textContent = (index === total - 1) ? 'Tap to replay' : 'Tap to continue';
    });

    rangeSel.addEventListener('change', () => load(rangeSel.value));
  }

  // auto-mount
  function tryMount(){ if (document.getElementById('wrapped-root')) mount(); }
  tryMount();
  const app = document.getElementById('app');
  if (app) new MutationObserver(tryMount).observe(app, { childList:true, subtree:true });
})();

// Router compatibility
window.Wrapped = window.WrappedScreen;
