// On phones/tablets, lay the page out at 1024px wide and let the browser
// zoom it out to fit the screen. Visitors can pinch-zoom in to read.
(function () {
  var narrowest = Math.min(screen.width, screen.height);
  if (narrowest < 1024) {
    var m = document.querySelector('meta[name="viewport"]');
    if (m) m.setAttribute('content', 'width=1024');
  }
})();
