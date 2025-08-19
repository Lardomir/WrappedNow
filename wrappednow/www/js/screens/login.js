(function () {
  window.Login = function Login() {
    return `
      <div class="center-page">
        <div class="container">
          <div class="logo-container">
            <img src="img/wrapped.png" alt="WrappedNow Logo" class="logo">
          </div>

          <h1>WrappedNow</h1>

          <button id="login-btn">
            <svg class="spotify-icon" viewBox="0 0 168 168" xmlns="http://www.w3.org/2000/svg">
              <path fill="currentColor" d="M84 0c46.3 0 84 37.7 84 84s-37.7 84-84 84S0 130.3 0 84 37.7 0 84 0zm19.6 120.4c-1.3 2.1-3.9 2.8-6.1 1.5-18.7-11.4-42.3-13.3-64.8-5.7-2.3.8-4.7-.6-5.5-2.9-.8-2.3.6-4.7 2.9-5.5 24.3-8.2 49.3-6.1 69.7 6.1 2.3 1.3 3 3.9 1.7 6.1zm15.6-21.8c-1.6 2.6-4.9 3.5-7.5 1.9-20.9-12.8-52.6-16.7-74.9-9.3-2.6.9-5.4-.5-6.3-3.1-.9-2.6.5-5.4 3.1-6.3 25.4-8.7 59.2-4.7 82.5 9.3 2.5 1.6 3.4 4.9 1.8 7.5zm15.4-23.7c-1.9 3.1-6.1 4.1-9.2 2.2-26.6-16.3-66.3-20.5-98.2-10.3-3.1.9-6.3-1-7.2-4.1-.9-3.1 1-6.3 4.1-7.2 35.8-11.2 78.4-6.8 107.2 11.2 3.1 1.9 4.1 6.1 2.2 9.2z"/>
            </svg>
            LOG IN WITH SPOTIFY
          </button>

          <p id="not-connected-text" class="not-connected">Not connected to Spotify?</p>

          <div id="user-info" style="display:none;"></div>
          <button id="logout-btn" style="display:none;">LOGOUT</button>
        </div>
      </div>
    `;
  };
})();
