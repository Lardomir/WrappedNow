// Tiny hash router that renders registered screens
(function () {
  const routes = {
    '': 'login',
    '#/login': 'login',
    '#/home': 'home',
    '#/wrapped': 'wrapped',
    '#/daily': 'daily',
    '#/map': 'map',
  };

  function render(which) {
    const root = document.getElementById('app');
    const screens = {
      login: window.Login,
      home: window.Home,
      wrapped: window.Wrapped,
      daily: window.DailyTrends,
      map: window.MusicMap,
    };
    const view = (screens[which] || window.Login);
    root.innerHTML = view();
    // Re-bind buttons/handlers after each render
    if (typeof window.wireUi === 'function') window.wireUi();
  }

  function startRouter() {
    const go = () => {
      const key = routes[location.hash] || 'login';
      render(key);
    };
    window.addEventListener('hashchange', go);
    go();
  }

  // expose
  window.startRouter = startRouter;
  window.render = render;
})();