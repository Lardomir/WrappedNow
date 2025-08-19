(function () {
  window.Home = function Home() {
    const user = JSON.parse(localStorage.getItem('spotify_user_data') || 'null');
    const name = user?.display_name || 'Friend';
    return `
      <div class="container">
        <h1>Welcome, ${name} 👋</h1>
        <p>You’re connected to Spotify.</p>

        <nav style="margin:16px 0; display:flex; gap:10px; flex-wrap:wrap;">
          <a href="#/wrapped">Your Wrapped</a>
          <a href="#/daily">Daily Trends</a>
          <a href="#/map">Music Map</a>
        </nav>

        <button id="logout-btn">LOGOUT</button>
      </div>
    `;
  };
})();
