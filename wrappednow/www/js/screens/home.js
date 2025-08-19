(function () {
  function getUser() {
    try { return JSON.parse(localStorage.getItem('spotify_user_data') || 'null'); }
    catch { return null; }
  }

  window.Home = function Home() {
    const u = getUser();
    const name   = u?.display_name ?? 'Friend';
    const avatar = u?.images?.[0]?.url ?? 'img/wrapped.png';

    return `
      <div class="home-compact">
        <header class="hc-header">
          <h1>Welcome back,<br><span>${name}!</span></h1>
          <img class="hc-avatar" src="${avatar}" alt="${name}">
        </header>

        <section class="hc-stats">
          <div class="hc-chip">
            <p class="hc-chip-title">Top Song</p>
            <p id="top-song" class="hc-chip-value">—</p>
          </div>
          <div class="hc-chip">
            <p class="hc-chip-title">Top Artist</p>
            <p id="top-artist" class="hc-chip-value">—</p>
          </div>
          <div class="hc-chip">
            <p class="hc-chip-title">Minutes Listened</p>
            <p id="minutes-listened" class="hc-chip-value">—</p>
          </div>
        </section>

        <nav class="hc-list">
          <a class="hc-item" href="#/wrapped">
            <img class="hc-icon" src="img/wrapped.png" alt="Wrapped icon">  <!-- replace with your icon -->
            <span class="hc-item-title">View Wrapped</span>
            <img class="hc-chevron" src="img/rightArrow.png" alt="">     <!-- replace with your chevron -->
          </a>

          <a class="hc-item" href="#/map">
            <img class="hc-icon" src="img/map.png" alt="Map icon">          <!-- replace -->
            <span class="hc-item-title">Music Map</span>
            <img class="hc-chevron" src="img/rightArrow.png" alt="">
          </a>

          <a class="hc-item" href="#/daily">
            <img class="hc-icon" src="img/trends.png" alt="Trends icon">    <!-- replace -->
            <span class="hc-item-title">Daily Trends</span>
            <img class="hc-chevron" src="img/rightArrow.png" alt="">
          </a>
        </nav>

        <div class="home-footer">
          <button id="logout-btn" class="btn ghost">Logout</button>
        </div>
      </div>
    `;
  };
})();
