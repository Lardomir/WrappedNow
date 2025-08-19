// www/js/router.js
(function () {
  const routes = {
    '': 'login',
    '#/login': 'login',
    '#/home': 'home',
    '#/wrapped': 'wrapped',
    '#/daily': 'daily',
    '#/map': 'map',
  };

  const pick = (...fns) => fns.find(fn => typeof fn === 'function') || null;
  const hasToken = () => {
    const t = localStorage.getItem('spotify_access_token');
    console.log('[router] hasToken?', !!t);
    return !!t;
  };

  // Pages that call Spotify must have a token
  const needsToken = new Set(['home', 'wrapped', 'daily', 'map']);

  function render(which) {
    const root = document.getElementById('app');
    if (!root) return;

    if (needsToken.has(which) && !hasToken()) {
      console.warn('[router] guard → login (token required for', which, ')');
      localStorage.setItem(
        'post_login_route',
        Object.keys(routes).find(k => routes[k] === which) || '#/home'
      );
      location.hash = '#/login';
      return;
    }

    const screens = {
      login:   pick(window.LoginScreen,   window.Login),
      home:    pick(window.HomeScreen,    window.Home),
      wrapped: pick(window.WrappedScreen, window.Wrapped),
      daily:   pick(window.DailyTrends,   window.Daily),
      map:     pick(window.MusicMap,      window.MapScreen),
    };

    const view = screens[which];
    if (!view) {
      root.innerHTML = `<div style="padding:16px">
        Screen <b>${which}</b> not registered. Make sure the file defines <code>window.${which[0].toUpperCase()+which.slice(1)}Screen</code> and is loaded before <code>app.js</code>.
      </div>`;
      return;
    }

    root.innerHTML = view();
    if (typeof window.wireUi === 'function') window.wireUi();
  }

  function go() {
    const key = routes[location.hash] || 'login';
    console.log('[router] route ->', location.hash || '(empty)', 'screen:', key);
    render(key);
  }

  window.addEventListener('hashchange', go);
  window.startRouter = function startRouter() { go(); };
})();
