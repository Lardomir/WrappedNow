// Single deviceready handler
document.addEventListener('deviceready', onDeviceReady, false);

// UI toggles
const SHOW_POSITION_LOGS = false;   // no position spam in the log
const SHOW_LIVE_MARKERS  = false;   // don't drop markers for raw geolocation updates

function onDeviceReady() {
  console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);

  // ---------- Logger ----------
  const logEl = document.getElementById('log');
  const log = (m) => { if (logEl) { logEl.textContent += m + '\n'; logEl.scrollTop = logEl.scrollHeight; } console.log(m); };

  // pretty HTML lines for music start/stop (high-contrast badges)
  function logHTML(html) {
    if (!logEl) return;
    const row = document.createElement('div');
    row.className = 'log-line';
    row.innerHTML = html;
    logEl.appendChild(row);
    logEl.scrollTop = logEl.scrollHeight;
  }
  function esc(s){return String(s ?? '').replace(/[&<>"']/g,m=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m]));}
  function logMusicStart(title, artist){ logHTML(`<span class="badge badge-start">START</span> 🎵 ${esc(title||'Unknown')} — ${esc(artist||'')}`); }
  function logMusicStop (title, artist){ logHTML(`<span class="badge badge-stop">STOP</span> 🎵 ${esc(title||'Unknown')} — ${esc(artist||'')}`); }

  // keep scroll position on theme change (colors are CSS-driven)
  try {
    const mm = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
    mm && mm.addEventListener('change', () => { if (logEl) logEl.scrollTop = logEl.scrollHeight; });
  } catch (_) {}

  // ---------- STATE ----------
  let accelWatch = null;
  let geoWatch = null;
  let accelBuf = [];
  const ACCEL_BUF_SIZE = 20; // ~10s at 500ms
  const samples = [];        // local fallback until backend is ready

  // live context values used when a track changes
  let lastKnownPosition = null;   // { lat, lon, acc }
  let lastActivity = 'unknown';

  // ---------- (Optional) Runtime Permissions ----------
  const perms = window.cordova?.plugins?.permissions;
  async function ensurePermissions() {
    if (!perms) return true;
    return new Promise((resolve) => {
      const list = [perms.ACCESS_FINE_LOCATION, perms.ACCESS_COARSE_LOCATION];
      perms.hasPermission(list, (st) => {
        if (st.hasPermission) return resolve(true);
        perms.requestPermissions(list, (res) => resolve(!!res.hasPermission), () => resolve(false));
      }, () => resolve(false));
    });
  }

  // ---------- Simple activity classification ----------
  function classifyActivity() {
    if (accelBuf.length < 8) return 'unknown';
    const mags = accelBuf.map(v => Math.hypot(v.x, v.y, v.z));
    const mean = mags.reduce((a,b)=>a+b,0) / mags.length;
    const variance = mags.reduce((a,b)=>a+(b-mean)*(b-mean),0) / mags.length;
    const std = Math.sqrt(variance);
    if (std < 0.30) return 'sitting';
    if (std < 1.50) return 'walking';
    return 'running';
  }

  function startAccel() {
    if (accelWatch) return;
    accelWatch = navigator.accelerometer?.watchAcceleration?.(
      (a) => {
        accelBuf.push({ x: a.x, y: a.y, z: a.z });
        if (accelBuf.length > ACCEL_BUF_SIZE) accelBuf.shift();
        // keep an updated activity label for future track events
        lastActivity = classifyActivity();
      },
      (e) => log('Accel error: ' + e),
      { frequency: 500 }
    );
    if (!accelWatch) log('⚠️ device-motion plugin missing? (cordova-plugin-device-motion)');
  }

  function stopAccel() {
    if (accelWatch && navigator.accelerometer?.clearWatch) {
      navigator.accelerometer.clearWatch(accelWatch);
    }
    accelWatch = null;
    accelBuf = [];
  }

  // ---------- Geolocation ----------
  function startGeo() {
    if (geoWatch) return;
    if (!navigator.geolocation?.watchPosition) {
      log('⚠️ geolocation plugin missing? (cordova-plugin-geolocation)');
      return;
    }
    geoWatch = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        lastKnownPosition = { lat: latitude, lon: longitude, acc: accuracy };

        // silent unless explicitly enabled
        if (SHOW_POSITION_LOGS) {
          const activity = lastActivity;
          log(`• ${activity} @ ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
        }
        if (SHOW_LIVE_MARKERS) {
          addMapPoint({
            ts: Date.now(),
            lat: latitude, lon: longitude, acc: accuracy,
            activity: lastActivity, track: null
          });
        }
      },
      (err) => log('Geo error: ' + err.message),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 }
    );
  }

  function stopGeo() {
    if (geoWatch && navigator.geolocation?.clearWatch) {
      navigator.geolocation.clearWatch(geoWatch);
    }
    geoWatch = null;
  }

  // ---------- Robust asset resolver (API 35/36, file:// & cdvfile://) ----------
  function resolveAssetUrl(relPath) {
    const tries = [
      relPath,
      new URL(relPath, window.location.href).href,
      'file:///android_asset/www/' + relPath,
      'cdvfile://localhost/www/' + relPath
    ];
    return new Promise((resolve, reject) => {
      let i = 0;
      const tryNext = () => {
        if (i >= tries.length) return reject(new Error('asset not found: ' + relPath));
        const url = tries[i++];
        const img = new Image();
        img.onload = () => resolve(url);
        img.onerror = () => tryNext();
        img.src = url;
      };
      tryNext();
    });
  }

  // ---------- Map (Leaflet) ----------
  let map, markers, musicIcon;

  async function initMap() {
    if (map || !window.L) return;
    map = L.map('map');
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap' }).addTo(map);
    markers = L.layerGroup().addTo(map);
    map.setView([46.948, 7.447], 12); // Bern default

    try {
      const iconUrl = await resolveAssetUrl('img/map-icon.png'); // keep your file here
      console.log('Marker icon path:', iconUrl);
      musicIcon = L.icon({
        iconUrl,
        iconRetinaUrl: iconUrl,
        iconSize: [32, 32],
        iconAnchor: [16, 31],   // bottom center (tip on location)
        popupAnchor: [0, -28]
      });
    } catch (e) {
      console.warn('Icon load failed, using Leaflet default. Reason:', e.message);
    }
  }

  function addMapPoint(sample) {
    if (!map) return;
    const { lat, lon, activity, track, ts } = sample;
    const opts = musicIcon ? { icon: musicIcon } : undefined;
    const m = L.marker([lat, lon], opts).addTo(markers);
    const time = new Date(ts || Date.now()).toLocaleString();
    const song = track ? `<div>🎵 <b>${esc(track.title)}</b><br/>${esc(track.artist || '')}</div>` : '<div>(kein Track-Link)</div>';
    const cover = track?.image ? `<img src="${esc(track.image)}" alt="" style="width:48px;height:48px;border-radius:8px;object-fit:cover;margin-right:8px">` : '';
    m.bindPopup(`
      <div style="font:14px system-ui;display:flex;gap:8px;align-items:center">
        ${cover}
        <div>
          <div><b>${esc(track?.title ?? '(ohne Titel)')}</b> – ${esc(track?.artist ?? '')}</div>
          <div style="opacity:.8">${esc(activity ?? 'unknown')} • ${time}</div>
          <div style="opacity:.8">📍 ${lat.toFixed(5)}, ${lon.toFixed(5)}</div>
        </div>
      </div>
    `);
  }

  function clearMapMarkers() {
    if (!markers) return;
    markers.clearLayers();
  }

  // Plot a list of play events (e.g., loaded from Firebase)
  function addMapEvents(events = []) {
    if (!Array.isArray(events)) return;
    for (const ev of events) {
      if (!ev || typeof ev.lat !== 'number' || typeof ev.lon !== 'number') continue;
      addMapPoint(ev);
    }
    // focus map if we have at least one point
    if (events.length > 0) {
      const first = events[0];
      map.setView([first.lat, first.lon], 14);
    }
  }

  // ---------- Track-change hook (called by Spotify integration) ----------
  function handleSongChange(track) {
    // track = { id, name, artist, album, image, duration_ms }
    if (!track || !lastKnownPosition) {
      // No GPS yet; queue locally
      samples.push({ pendingTrack: track, ts: Date.now() });
      return;
    }

    const playEvent = {
      ts: Date.now(),
      lat: lastKnownPosition.lat,
      lon: lastKnownPosition.lon,
      acc: lastKnownPosition.acc,
      activity: lastActivity,
      track: {
        id: track.id,
        title: track.name,
        artist: track.artist,
        album: track.album,
        image: track.image,
        duration_ms: track.duration_ms
      },
      source: { device: window.device?.model || 'unknown', platform: window.device?.platform || 'android' }
    };

    // Persist via backend (Person 1 implements this)
    if (window.App && window.App.savePlayEvent) {
      try { window.App.savePlayEvent(playEvent); } catch (e) { console.warn('savePlayEvent error:', e); }
    } else {
      samples.push(playEvent); // fallback
    }

    // Optional UI cue
    window.ContextLog?.musicStart(track.name, track.artist);
    // Intentionally NOT dropping a live marker here (we’ll load from DB via Load History)
    // If you want a live marker too, uncomment:
    // addMapPoint(playEvent);
  }

  // ---------- UI ----------
  document.getElementById('btnStart')?.addEventListener('click', async () => {
    await initMap();
    const ok = await ensurePermissions();
    if (!ok) { log('🚫 Permissions denied'); return; }

    // Center map on current position (no marker)
    if (navigator.geolocation?.getCurrentPosition) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude, accuracy } = pos.coords;
          lastKnownPosition = { lat: latitude, lon: longitude, acc: accuracy };
          map.setView([latitude, longitude], 15);
          if (SHOW_POSITION_LOGS) {
            log(`📍 Initial position @ ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`);
          }
        },
        (err) => log('Initial GPS error: ' + err.message),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }

    startAccel();
    startGeo();
    log('▶️ Sampling gestartet');
  });

  document.getElementById('btnStop')?.addEventListener('click', () => {
    stopAccel();
    stopGeo();
    log('⏹️ Sampling gestoppt');
  });

  // Load saved history from backend (MVP: last N plays)
  document.getElementById('btnLoadHistory')?.addEventListener('click', async () => {
    if (!(window.App && window.App.loadPlays)) { console.warn('window.App.loadPlays not implemented yet'); return; }
    try {
      const events = await window.App.loadPlays({ limit: 300 });
      window.ContextMap.loadHistory(events);
      log(`📦 Loaded ${events?.length ?? 0} events from backend`);
    } catch (e) {
      console.error('loadPlays error:', e);
      log('❌ loadPlays error: ' + e.message);
    }
  });

  // ---------- Expose APIs ----------
  // Called by Spotify integration (Person 1) when a new track starts
  window.ContextBridge = {
    onTrackChanged: handleSongChange
  };

  // Called by UI / backend to control the map and load history
  window.ContextMap = {
    start:  () => document.getElementById('btnStart')?.click(),
    stop:   () => document.getElementById('btnStop')?.click(),
    clear:  clearMapMarkers,
    loadHistory: (events) => { clearMapMarkers(); addMapEvents(events); } // expects array of playEvent docs
  };

  // Optional: expose badge helpers for Person 2
  window.ContextLog = {
    musicStart: logMusicStart,
    musicStop:  logMusicStop
  };

  // Browser hint (native Firebase not available in browser — expected)
  if (!window.FirebasePlugin) log('Hinweis: Native Firebase im Browser nicht verfügbar (erwartet).');

  // ---------- Native Firebase (Android only, optional) ----------
  if (window.FirebasePlugin) {
    if (FirebasePlugin.hasPermission) {
      FirebasePlugin.hasPermission((granted) => {
        log('Push permission: ' + granted);
        if (!granted && FirebasePlugin.grantPermission) {
          FirebasePlugin.grantPermission((r)=>log('Permission requested: '+r),(e)=>log('Perm error: '+e));
        }
      });
    }
    FirebasePlugin.getToken(
      (t)=>log('FCM token: ' + t),
      (e)=>log('getToken error: ' + e)
    );
    FirebasePlugin.logEvent('app_open', {});
  }

  // (Optional) Background mode if plugin installed:
  // if (cordova?.plugins?.backgroundMode) {
  //   cordova.plugins.backgroundMode.setDefaults({ title: 'WrappedNow', text: 'Tracking context…' });
  //   cordova.plugins.backgroundMode.enable();
  // }
}
