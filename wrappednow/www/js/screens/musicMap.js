(function () {
  // -------- Screen HTML --------
  window.MusicMap = function MusicMap() {
    return `
      <div class="mm-wrap">
        <div class="ios-header">
          <a class="back-dummy" href="#/home">← Home</a>
          <h1>Music Map</h1>
          <span></span>
        </div>

        <div class="mm-card">
          <div id="map" class="mm-map"></div>
        </div>
      </div>
    `;
  };

  // -------- Logic / Mount --------
  let map, markers, musicIcon;

  async function ensurePermissions() {
    // Android runtime permissions (optional; no-op on iOS/web)
    const perms = window.cordova?.plugins?.permissions;
    if (!perms) return true;
    return new Promise((resolve) => {
      const list = [perms.ACCESS_FINE_LOCATION, perms.ACCESS_COARSE_LOCATION];
      perms.hasPermission(list, (st) => {
        if (st.hasPermission) return resolve(true);
        perms.requestPermissions(list,
          (res) => resolve(!!res.hasPermission),
          () => resolve(false)
        );
      }, () => resolve(false));
    });
  }

  async function resolveAssetUrl(relPath) {
    const tries = [
      relPath,
      new URL(relPath, window.location.href).href,
      'file:///android_asset/www/' + relPath,
      'cdvfile://localhost/www/' + relPath
    ];
    return new Promise((resolve, reject) => {
      let i = 0;
      const next = () => {
        if (i >= tries.length) return reject(new Error('asset not found: ' + relPath));
        const url = tries[i++]; const img = new Image();
        img.onload = () => resolve(url);
        img.onerror = () => next();
        img.src = url;
      };
      next();
    });
  }

  async function initMap() {
    if (map || !window.L) return;

    map = L.map('map', { zoomControl: false, attributionControl: false });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    markers = L.layerGroup().addTo(map);
    map.setView([46.948, 7.447], 12); // Bern default

    try {
      const iconUrl = await resolveAssetUrl('img/map-icon.png'); // replace with your icon later
      musicIcon = L.icon({
        iconUrl,
        iconRetinaUrl: iconUrl,
        iconSize: [32, 32],
        iconAnchor: [16, 31],
        popupAnchor: [0, -28]
      });
    } catch (_) {
      // default icon if not found
    }

    // Ensure tiles layout when first shown
    setTimeout(() => map.invalidateSize(), 0);
  }

  function addMapPoint(sample) {
    if (!map) return;
    const { lat, lon, activity, track, ts } = sample;
    const opts = musicIcon ? { icon: musicIcon } : undefined;
    const m = L.marker([lat, lon], opts).addTo(markers);
    const time = new Date(ts || Date.now()).toLocaleString();

    const esc = (s) => String(s ?? '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[m]));
    const title = esc(track?.title ?? '(no title)');
    const artist = esc(track?.artist ?? '');
    const act = esc(activity ?? 'unknown');

    m.bindPopup(`
      <div class="popup">
        <div class="popup-title">${title}</div>
        <div class="popup-sub">${artist}</div>
        <div class="popup-meta">${act} • ${time}<br/>
        📍 ${lat.toFixed(5)}, ${lon.toFixed(5)}</div>
      </div>
    `);
  }

  // Public bridge (optional)
  window.ContextMap = {
    clear: () => { if (markers) markers.clearLayers(); },
    loadHistory: (events=[]) => {
      if (!Array.isArray(events)) return;
      if (markers) markers.clearLayers();
      for (const ev of events) {
        if (typeof ev.lat === 'number' && typeof ev.lon === 'number') addMapPoint(ev);
      }
      if (events.length && map) map.setView([events[0].lat, events[0].lon], 14);
    }
  };

  // Call this only after the screen HTML exists
  window.mountMusicMap = async function mountMusicMap() {
    const mapDiv = document.getElementById('map');
    if (!mapDiv || mapDiv.dataset.ready) return;

    const ok = await ensurePermissions();
    if (!ok) return;

    await initMap();

    // Center on current position
    if (navigator.geolocation?.getCurrentPosition) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          map.setView([latitude, longitude], 15);
          setTimeout(() => map.invalidateSize(), 0);
        },
        () => {},
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }

    // mark mounted (prevents multiple inits)
    mapDiv.dataset.ready = '1';
    // double RAF to ensure final layout
    requestAnimationFrame(() => requestAnimationFrame(() => map.invalidateSize()));
  };
})();
