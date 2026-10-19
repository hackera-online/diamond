// Добави в index.html преди </body>: <script src="js/gallery.js" defer></script>
(function () {
  var grid = document.querySelector('[data-gallery-grid]');
  if (!grid) return;
  var step = parseInt(grid.dataset.step, 10) || 12;
  var moreBtn = document.querySelector('[data-gallery-more]');
  var moreWrap = moreBtn && moreBtn.parentElement;
  var items = Array.prototype.slice.call(grid.querySelectorAll('[data-gallery]'));

  function updateBtn() {
    if (!moreWrap) return;
    moreWrap.hidden = !items.some(function (a) { return a.hidden; });
  }
  if (moreBtn) {
    moreBtn.addEventListener('click', function () {
      items.filter(function (a) { return a.hidden; }).slice(0, step)
        .forEach(function (a) { a.hidden = false; });
      updateBtn();
    });
  }
  updateBtn();

  // Lightbox
  var box = document.createElement('div');
  box.className = 'lightbox';
  box.setAttribute('role', 'dialog');
  box.setAttribute('aria-modal', 'true');
  box.innerHTML = '<button class="lightbox__close" aria-label="Затвори">&times;</button>' +
    '<button class="lightbox__prev" aria-label="Предишна">&#8249;</button>' +
    '<img alt=""><button class="lightbox__next" aria-label="Следваща">&#8250;</button>';
  document.body.appendChild(box);
  var img = box.querySelector('img'), idx = 0;

  function visible() { return items.filter(function (a) { return !a.hidden; }); }
  function show(i) {
    var v = visible();
    idx = (i + v.length) % v.length;
    img.src = v[idx].href;
    img.alt = v[idx].querySelector('img').alt;
    box.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }
  function close() {
    box.classList.remove('is-open');
    document.body.style.overflow = '';
  }
  grid.addEventListener('click', function (e) {
    var a = e.target.closest('[data-gallery]');
    if (!a) return;
    e.preventDefault();
    show(visible().indexOf(a));
  });
  box.querySelector('.lightbox__close').onclick = close;
  box.querySelector('.lightbox__prev').onclick = function () { show(idx - 1); };
  box.querySelector('.lightbox__next').onclick = function () { show(idx + 1); };
  box.addEventListener('click', function (e) { if (e.target === box) close(); });
  document.addEventListener('keydown', function (e) {
    if (!box.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(idx - 1);
    if (e.key === 'ArrowRight') show(idx + 1);
  });
})();
