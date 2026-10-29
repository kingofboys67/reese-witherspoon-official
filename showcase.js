/* ═══════════════════════════════════════════════════════════════
   showcase.js — Official Filmography filters + on-site Reels player
   - Filterable filmography (All / Feature Films / Television Series /
     Producer (Hello Sunshine) / Award Winners)
   - 9:16 vertical reel player, plays inside reesewitherspoonofficial.com
   - Trailer player for filmography cards (privacy-enhanced YouTube)
   ═══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  /* ---------------- Filmography filters ---------------- */
  function initFilters() {
    var bars = document.querySelectorAll('[data-fg-bar]');
    if (!bars.length) return;

    Array.prototype.forEach.call(bars, function (bar) {
      var scope = bar.getAttribute('data-fg-bar');
      var root = scope ? document.querySelector('[data-fg-grid="' + scope + '"]') : null;
      if (!root) return;

      var cards = Array.prototype.slice.call(root.querySelectorAll('[data-cats]'));
      var buttons = Array.prototype.slice.call(bar.querySelectorAll('[data-filter]'));

      function counts() {
        var map = { all: cards.length, feature: 0, series: 0, producer: 0, award: 0 };
        cards.forEach(function (card) {
          (card.getAttribute('data-cats') || '').split(/\s+/).forEach(function (cat) {
            if (cat && map[cat] !== undefined) map[cat] += 1;
          });
        });
        return map;
      }

      var totals = counts();

      function paint(filter) {
        var shown = 0;
        cards.forEach(function (card) {
          var cats = ' ' + (card.getAttribute('data-cats') || '') + ' ';
          var match = filter === 'all' || cats.indexOf(' ' + filter + ' ') !== -1;
          card.hidden = !match;
          if (match) shown += 1;
        });
        buttons.forEach(function (btn) {
          btn.setAttribute('aria-pressed', String(btn.getAttribute('data-filter') === filter));
        });
        var live = (bar.parentElement || root).querySelector('[data-fg-live]');
        if (live) live.textContent = shown + ' of ' + cards.length + ' titles shown';
        root.setAttribute('data-fg-active', filter);
      }

      buttons.forEach(function (btn) {
        var filter = btn.getAttribute('data-filter') || 'all';
        var badge = btn.querySelector('.fgx-count');
        if (badge && totals[filter] !== undefined) badge.textContent = totals[filter];
        btn.addEventListener('click', function () {
          paint(filter);
          var url = new URL(window.location.href);
          if (filter === 'all') url.searchParams.delete('show');
          else url.searchParams.set('show', filter);
          window.history.replaceState({}, '', url);
        });
      });

      var initial = new URL(window.location.href).searchParams.get('show') || 'all';
      paint(totals[initial] === undefined ? 'all' : initial);
    });
  }

  /* ---------------- Modal player ---------------- */
  var modal;
  var modalBody;
  var modalTitle;
  var lastFocus;

  function buildModal() {
    if (modal) return;
    modal = document.createElement('div');
    modal.className = 'rxl-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Reese Witherspoon video player');
    modal.innerHTML =
      '<div class="rxl-modal-inner">' +
        '<button type="button" class="rxl-modal-close" aria-label="Close video">✕</button>' +
        '<div class="rxl-modal-body"></div>' +
        '<p class="rxl-modal-title"></p>' +
      '</div>';
    document.body.appendChild(modal);
    modalBody = modal.querySelector('.rxl-modal-body');
    modalTitle = modal.querySelector('.rxl-modal-title');
    modal.addEventListener('click', function (event) {
      if (event.target === modal) closeModal();
    });
    modal.querySelector('.rxl-modal-close').addEventListener('click', closeModal);
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeModal();
    });
  }

  function openModal(html, label) {
    buildModal();
    lastFocus = document.activeElement;
    modalBody.innerHTML = html;
    modalTitle.textContent = label || '';
    modal.classList.add('is-open');
    document.body.classList.add('rxl-locked');
    var focusTarget = modal.querySelector('button, video, iframe');
    if (focusTarget && focusTarget.focus) focusTarget.focus();
  }

  function closeModal() {
    if (!modal || !modal.classList.contains('is-open')) return;
    modal.classList.remove('is-open');
    document.body.classList.remove('rxl-locked');
    modalBody.innerHTML = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  function playFile(src, poster, label) {
    var autoplay = reduceMotion ? '' : ' autoplay';
    var html =
      '<video controls playsinline preload="metadata"' + autoplay +
      ' poster="' + poster + '" aria-label="' + escapeAttr(label) + '">' +
      '<source src="' + src + '" type="video/mp4">' +
      'Your browser does not support embedded video. ' +
      '<a href="' + src + '">Download the clip</a>.' +
      '</video>';
    openModal(html, label);
    var video = modalBody.querySelector('video');
    if (video) {
      var playPromise = video.play();
      if (playPromise && playPromise.catch) playPromise.catch(function () {});
    }
  }

  function playYouTube(id, label) {
    var html =
      '<iframe src="https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) +
      '?autoplay=1&rel=0&modestbranding=1" title="' + escapeAttr(label) +
      '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"' +
      ' allowfullscreen loading="lazy"></iframe>';
    openModal(html, label);
  }

  function escapeAttr(value) {
    return String(value || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  }

  function initPlayers() {
    document.addEventListener('click', function (event) {
      var reel = event.target.closest('[data-reel-src]');
      if (reel) {
        event.preventDefault();
        playFile(
          reel.getAttribute('data-reel-src'),
          reel.getAttribute('data-reel-poster') || '',
          reel.getAttribute('data-reel-title') || 'Official reel'
        );
        return;
      }
      var trailer = event.target.closest('[data-trailer]');
      if (trailer) {
        event.preventDefault();
        playYouTube(
          trailer.getAttribute('data-trailer'),
          trailer.getAttribute('data-trailer-title') || 'Official trailer'
        );
      }
    });
  }

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    initFilters();
    initPlayers();
  });
})();

