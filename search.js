// search.js — Global search overlay

(function() {
  'use strict';

  /* ── Inject Search Button into every Nav ───────────────── */
  function injectSearchBtn() {
    const navWraps = document.querySelectorAll('.nav-wrap');
    navWraps.forEach(wrap => {
      if (wrap.querySelector('.nav-search-btn')) return;
      const btn = document.createElement('button');
      btn.className = 'nav-search-btn';
      btn.id = 'search-open-btn';
      btn.setAttribute('aria-label', 'Search');
      btn.innerHTML = `<svg fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>`;
      // Insert before hamburger
      const ham = wrap.querySelector('.nav-hamburger');
      if (ham) wrap.insertBefore(btn, ham);
      else wrap.appendChild(btn);
      btn.addEventListener('click', openSearch);
    });
  }

  /* ── Inject Community Nav Link ─────────────────────────── */
  function injectCommunityLink() {
    document.querySelectorAll('.nav-links').forEach(ul => {
      if (ul.querySelector('a[href="community.html"]')) return;
      const li = document.createElement('li');
      li.innerHTML = `<a href="community.html">Community</a>`;
      // Insert before last li (Watch Now CTA)
      const last = ul.querySelector('li:last-child');
      ul.insertBefore(li, last);
    });
  }

  /* ── Build Overlay ─────────────────────────────────────── */
  function buildOverlay() {
    if (document.getElementById('search-overlay')) return;
    const overlay = document.createElement('div');
    overlay.id = 'search-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-label', 'Search');
    overlay.innerHTML = `
      <p class="so-label">Search the Site</p>
      <div class="so-input-wrap">
        <span class="so-search-icon">
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
        </span>
        <input id="so-input" class="so-input" type="text" placeholder="Search films, reels, gallery…" autocomplete="off" spellcheck="false"/>
        <button id="so-clear" class="so-clear" aria-label="Clear">✕</button>
      </div>
      <div id="so-results"></div>
      <div class="so-quick-links" id="so-quick">
        <span class="so-quick-chip" data-q="Legally Blonde">Legally Blonde</span>
        <span class="so-quick-chip" data-q="Walk the Line">Walk the Line</span>
        <span class="so-quick-chip" data-q="The Morning Show">Morning Show</span>
        <span class="so-quick-chip" data-q="Hello Sunshine">Hello Sunshine</span>
        <span class="so-quick-chip" data-q="Book Club">Book Club</span>
        <span class="so-quick-chip" data-q="Oscar">Oscar</span>
      </div>
      <button id="so-close-btn" class="so-close-btn" aria-label="Close search">✕</button>
    `;
    document.body.appendChild(overlay);

    // Wire up
    const input  = overlay.querySelector('#so-input');
    const clear  = overlay.querySelector('#so-clear');
    const closeB = overlay.querySelector('#so-close-btn');
    const results= overlay.querySelector('#so-results');
    const quick  = overlay.querySelector('#so-quick');

    input.addEventListener('input', () => {
      const q = input.value.trim();
      clear.classList.toggle('visible', q.length > 0);
      quick.style.display = q.length ? 'none' : '';
      if (q.length < 2) { results.innerHTML = ''; return; }
      renderResults(q, results);
    });

    clear.addEventListener('click', () => {
      input.value = ''; clear.classList.remove('visible');
      results.innerHTML = ''; quick.style.display = '';
      input.focus();
    });

    closeB.addEventListener('click', closeSearch);

    overlay.addEventListener('click', e => {
      if (e.target === overlay) closeSearch();
    });

    quick.querySelectorAll('.so-quick-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        input.value = chip.dataset.q;
        clear.classList.add('visible');
        quick.style.display = 'none';
        renderResults(chip.dataset.q, results);
        input.focus();
      });
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && overlay.classList.contains('open')) closeSearch();
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); openSearch(); }
    });
  }

  /* ── Search Logic ──────────────────────────────────────── */
  function highlight(text, q) {
    if (!q) return text;
    const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(re, '<span class="so-highlight">$1</span>');
  }

  function renderResults(q, container) {
    if (typeof SEARCH_DATA === 'undefined') { container.innerHTML = '<p class="so-empty"><div class="so-empty-icon">🔍</div>Search data not loaded.</p>'; return; }

    const ql = q.toLowerCase();
    const scored = SEARCH_DATA.map(item => {
      let score = 0;
      if (item.title.toLowerCase().includes(ql)) score += 10;
      if (item.desc.toLowerCase().includes(ql))  score += 5;
      if ((item.tags || '').toLowerCase().includes(ql)) score += 3;
      if ((item.year || '').includes(ql)) score += 2;
      return { ...item, score };
    }).filter(i => i.score > 0).sort((a,b) => b.score - a.score).slice(0, 10);

    if (!scored.length) {
      container.innerHTML = `
        <div class="so-empty">
          <div class="so-empty-icon">😕</div>
          <p>No results for "<strong>${q}</strong>"</p>
          <p style="margin-top:8px;font-size:.8rem;color:var(--subtle)">Try: Legally Blonde, Oscar, Morning Show, Book Club…</p>
        </div>`;
      return;
    }

    // Group by type
    const groups = {};
    scored.forEach(item => {
      if (!groups[item.type]) groups[item.type] = [];
      groups[item.type].push(item);
    });

    function resolvePath(p) {
      if (!p || p.startsWith('http') || p.startsWith('//') || p.startsWith('data:')) return p;
      const isNested = window.location.pathname.includes('/films/') || 
                       window.location.pathname.includes('/awards/') || 
                       window.location.pathname.includes('/career/');
      const clean = p.replace(/^\.\.\//, '').replace(/^\//, '');
      return isNested ? '../' + clean : clean;
    }

    let html = '';
    Object.entries(groups).forEach(([type, items]) => {
      html += `<div class="so-section-title">${type}</div>`;
      items.forEach(item => {
        const itemUrl = resolvePath(item.url);
        const itemImg = resolvePath(item.img);
        html += `
          <a href="${itemUrl}" class="so-result-item">
            <img class="so-result-thumb" src="${itemImg}" alt="${item.title} — Reese Witherspoon official page" onerror="this.src=''" loading="lazy"/>
            <div>
              <div class="so-result-type">${item.type} ${item.year ? `· ${item.year}` : ''}</div>
              <div class="so-result-title">${highlight(item.title, q)}</div>
              <div class="so-result-excerpt">${highlight(item.desc.substring(0,90) + '…', q)}</div>
            </div>
          </a>`;
      });
    });

    container.innerHTML = html;

    // Animate in
    container.querySelectorAll('.so-result-item').forEach((el, i) => {
      el.style.opacity = '0'; el.style.transform = 'translateY(10px)';
      setTimeout(() => {
        el.style.transition = 'opacity .25s, transform .25s';
        el.style.opacity = '1'; el.style.transform = 'translateY(0)';
      }, i * 40);
    });
  }

  /* ── Open / Close ──────────────────────────────────────── */
  function openSearch() {
    const overlay = document.getElementById('search-overlay');
    if (!overlay) return;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => document.getElementById('so-input')?.focus(), 100);
  }
  function closeSearch() {
    const overlay = document.getElementById('search-overlay');
    if (!overlay) return;
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  /* ── Init ──────────────────────────────────────────────── */
  function init() {
    injectSearchBtn();
    injectCommunityLink();
    buildOverlay();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

})();
