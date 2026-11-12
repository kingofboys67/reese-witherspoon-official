/* shared.js — Reese Witherspoon Fan Site */

// ── Page transition ───────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
  document.body.classList.add('loaded');
});

// ── Active nav link ───────────────────────────────────────
(function() {
  var path = location.pathname.split('/').pop() || 'index.html';
  var links = document.querySelectorAll('.nav-links a');
  for (var i = 0; i < links.length; i++) {
    var href = links[i].getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      links[i].classList.add('active');
    }
  }
})();

// ── Sticky nav shadow & frosted backdrop ──────────────────
function syncNavScrollState() {
  var nav = document.getElementById('nav');
  if (!nav) return;
  var scrolled = window.scrollY > 20;
  nav.classList.toggle('nav-scrolled', scrolled);
  nav.style.boxShadow = scrolled ? '0 4px 40px rgba(0,0,0,0.48)' : '';
}
window.addEventListener('scroll', syncNavScrollState, { passive: true });
syncNavScrollState();

// ── Mobile hamburger ──────────────────────────────────────
function initHamburger() {
  var hamburger = document.getElementById('hamburger');
  var navLinks  = document.querySelector('.nav-links');
  if (!hamburger || !navLinks) return;

  function openMenu() {
    // Turn the nav-links UL into a fullscreen overlay using inline styles
    // Inline styles beat ALL CSS rules — no specificity fights
    navLinks.style.cssText =
      'display:flex;' +
      'flex-direction:column;' +
      'position:fixed;' +
      'top:0;left:0;right:0;bottom:0;' +
      'background:#0d0920;' +
      'z-index:99999;' +
      'align-items:center;' +
      'justify-content:center;' +
      'padding:60px 0 40px;' +
      'overflow-y:auto;' +
      'margin:0;gap:0;' +
      'list-style:none;' +
      'box-sizing:border-box;';

    // Style each li
    var lis = navLinks.querySelectorAll('li');
    for (var j = 0; j < lis.length; j++) {
      lis[j].style.cssText =
        'width:100%;text-align:center;list-style:none;' +
        'margin:0;padding:0;' +
        'border-bottom:1px solid rgba(255,255,255,0.07);';
    }
    if (lis.length > 0) lis[lis.length - 1].style.borderBottom = 'none';

    // Style each link — WHITE text, large, readable
    var anchors = navLinks.querySelectorAll('a');
    for (var i = 0; i < anchors.length; i++) {
      var a = anchors[i];
      var isJoin = a.classList.contains('nav-join') || a.id === 'nav-join-link';
      if (isJoin) {
        a.style.cssText =
          'display:inline-block;' +
          'margin:20px auto;' +
          'color:#FFDD00;' +
          '-webkit-text-fill-color:#FFDD00;' +
          'text-shadow:none;' +
          'text-decoration:none;' +
          'font-size:1.25rem;' +
          'font-weight:800;' +
          'letter-spacing:0.06em;' +
          'padding:14px 44px;' +
          'border-radius:100px;' +
          'border:2px solid rgba(192,38,211,0.8);' +
          'background:linear-gradient(135deg,rgba(107,33,168,0.5),rgba(192,38,211,0.3));' +
          'box-shadow:0 0 24px rgba(160,32,240,0.5);' +
          'animation:none;';
      } else {
        a.style.cssText =
          'display:block;' +
          'width:100%;' +
          'box-sizing:border-box;' +
          'text-align:center;' +
          'color:#ffffff;' +
          '-webkit-text-fill-color:#ffffff;' +
          'text-shadow:none;' +
          'text-decoration:none;' +
          'font-size:1.5rem;' +
          'font-weight:700;' +
          'letter-spacing:0.04em;' +
          'padding:20px 32px;' +
          'background:transparent;' +
          'box-shadow:none;' +
          'animation:none;' +
          'border-radius:0;';
      }
    }

    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    // Remove all inline overrides — CSS takes back over naturally
    navLinks.removeAttribute('style');
    var lis = navLinks.querySelectorAll('li');
    for (var j = 0; j < lis.length; j++) {
      lis[j].removeAttribute('style');
    }
    var anchors = navLinks.querySelectorAll('a');
    for (var i = 0; i < anchors.length; i++) {
      anchors[i].removeAttribute('style');
    }
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function isMenuOpen() {
    return navLinks.style.position === 'fixed';
  }

  function toggleMenu(e) {
    if (e) e.stopPropagation();
    if (isMenuOpen()) closeMenu();
    else openMenu();
  }

  // Click + touchstart for iOS/Android reliability
  hamburger.addEventListener('click', toggleMenu);
  hamburger.addEventListener('touchstart', function(e) {
    e.preventDefault();
    toggleMenu(e);
  }, { passive: false });

  // Close when any nav link is tapped
  navLinks.addEventListener('click', function(e) {
    var link = e.target && e.target.closest ? e.target.closest('a') : (e.target.tagName === 'A' ? e.target : null);
    if (link) closeMenu();
  });

  // Escape key closes menu
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeMenu();
  });
}

// ── Smooth in-page scroll for Join Now / Community / Fan Club triggers ──
function initJoinNowSmoothScroll() {
  document.addEventListener('click', function(e) {
    var link = e.target && e.target.closest ? e.target.closest('a') : null;
    if (!link) return;
    var href = (link.getAttribute('href') || '').trim();
    var isJoinTrigger =
      link.id === 'nav-join-link' ||
      link.classList.contains('nav-join') ||
      href === '#fan-club' ||
      href === '/#fan-club' ||
      href === '#community' ||
      href === '/#community';
    if (!isJoinTrigger) return;

    var target = document.getElementById('fan-club') || document.getElementById('community') || document.getElementById('fan-club-home');
    if (!target) return; // On subpages without #fan-club, allow clean navigation to /#fan-club

    e.preventDefault();
    if (window.history && typeof window.history.replaceState === 'function') {
      var nextHash = href.indexOf('community') !== -1 ? '#community' : '#fan-club';
      window.history.replaceState(null, '', nextHash);
    }
    if (typeof window.focusFanClubGenerator === 'function') {
      window.focusFanClubGenerator();
    } else {
      var reduceMotion = Boolean(
        window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
      );
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    }
  });
}

// ── Init ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
  initHamburger();
  initJoinNowSmoothScroll();
});

// ── Scroll Reveal ────────────────────────────────────────
var revealObs = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('[data-reveal]').forEach(function(el) {
  revealObs.observe(el);
});

// ── Lightbox ─────────────────────────────────────────────
(function() {
  var lb = document.getElementById('lightbox');
  var lbImg = document.getElementById('lb-img');
  var lbClose = document.getElementById('lb-close');
  if (!lb || !lbImg || !lbClose) return;

  function openLb(src, alt) {
    lbImg.src = src;
    lbImg.alt = alt || '';
    lb.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeLb() {
    lb.classList.remove('active');
    document.body.style.overflow = '';
    lbImg.src = '';
  }

  document.addEventListener('click', function(e) {
    var img = e.target.closest('[data-lightbox]');
    if (img) {
      e.preventDefault();
      openLb(img.dataset.lightbox || img.src, img.alt);
    }
  });

  lbClose.addEventListener('click', closeLb);
  lb.addEventListener('click', function(e) {
    if (e.target === lb) closeLb();
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeLb();
  });
})();

// ── Search toggle ─────────────────────────────────────────
(function() {
  var btn = document.getElementById('search-btn');
  var box = document.getElementById('search-box');
  if (!btn || !box) return;
  btn.addEventListener('click', function() {
    var hidden = box.style.display === 'none' || box.style.display === '';
    box.style.display = hidden ? 'block' : 'none';
    if (hidden) box.querySelector('input') && box.querySelector('input').focus();
  });
})();
