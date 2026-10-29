// about.js — About page interactions

// Animate skill bars on scroll
document.querySelectorAll('.skill-bar').forEach(bar => {
  const targetWidth = bar.style.width;
  bar.style.width = '0';
  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      bar.style.transition = 'width 1.4s 0.2s cubic-bezier(0.4,0,0.2,1)';
      bar.style.width = targetWidth;
      obs.disconnect();
    }
  }, { threshold: 0.5 });
  obs.observe(bar.parentElement);
});

// Interactive Career Timeline Era Filter (Task 7)
(function initTimelineFilter() {
  const filterWrap = document.getElementById('timelineFilters');
  const statusEl = document.getElementById('timelineStatus');
  const items = document.querySelectorAll('.timeline-item');
  if (!filterWrap || !items.length) return;

  const eraDescriptions = {
    'all': "Showing all 12 major milestones across Reese's 30-year career.",
    'early-breakthrough': "Showing 1976–1998: Nashville roots and breakout debut in The Man in the Moon.",
    'iconic-stardom': "Showing 1999–2004: Tracy Flick in Election and Elle Woods in Legally Blonde.",
    'oscar-acclaim': "Showing 2005–2015: Best Actress Oscar for Walk the Line, Pacific Standard, and Wild.",
    'producer-mogul': "Showing 2016–Present: Hello Sunshine, Reese's Book Club, Big Little Lies, and The Morning Show."
  };

  filterWrap.addEventListener('click', (e) => {
    const btn = e.target.closest('.ti-pill');
    if (!btn) return;
    const era = btn.dataset.era;

    filterWrap.querySelectorAll('.ti-pill').forEach(b => {
      const active = b === btn;
      b.classList.toggle('active', active);
      b.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    let visibleCount = 0;
    items.forEach(item => {
      const match = era === 'all' || item.dataset.era === era;
      if (match) {
        item.style.display = 'grid';
        item.style.animation = 'fadeInUp 0.35s ease forwards';
        visibleCount++;
      } else {
        item.style.display = 'none';
      }
    });

    if (statusEl) {
      statusEl.textContent = eraDescriptions[era] || `Showing ${visibleCount} milestones.`;
    }
  });
})();
