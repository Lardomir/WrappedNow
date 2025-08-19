(function () {
  window.DailyTrends = function DailyTrends() {
    return `
      <div class="dt-wrap">
        <header class="dt-header">
          <h1>DAILY TRENDS</h1>
        </header>
        <section class="dt-chart-card">
          <div class="dt-chart-box">
            <svg id="dt-chart" viewBox="0 0 340 200" preserveAspectRatio="xMidYMid meet" class="dt-svg">
              <!-- chart drawn by JS -->
            </svg>
            <div class="dt-xlabels">
              <span>Mon</span><span>Tue</span><span>Wed</span>
              <span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
          </div>
        </section>

        <section class="dt-stats">
          <div class="dt-stat">
            <p class="dt-label">Most Active Day</p>
            <p id="dt-most-day" class="dt-value">—</p>
          </div>
          <div class="dt-sep"></div>
          <div class="dt-stat">
            <p class="dt-label">Total</p>
            <p id="dt-total" class="dt-value">—</p>
          </div>
          <div class="dt-sep"></div>
          <div class="dt-stat">
            <p class="dt-label">Top Activity</p>
            <p id="dt-top-activity" class="dt-value">—</p>
          </div>
        </section>
      </div>
       <div class="container">
              <a href="#/home">← Back Home</a>
            </div>
    `;
  };
})();
