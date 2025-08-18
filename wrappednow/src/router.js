const routes = {
  '': 'login',
  '#/login': 'login',
  '#/home': 'home',
  '#/wrapped': 'wrapped',
  '#/daily': 'daily',
  '#/map': 'map',
};

export function startRouter(render) {
  const go = () => render(routes[location.hash] || 'login');
  window.addEventListener('hashchange', go);
  go();
}
