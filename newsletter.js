/**
 * newsletter.js — Complete Newsletter Subscription System
 *
 * ┌──────────────────────────────────────────────────────────┐
 *  MAILCHIMP / CONVERTKIT / BUTTONDOWN INTEGRATION POINT
 *
 *  To connect a real email backend, replace the
 *  simulateSubmit() function body with your API call:
 *
 *  MAILCHIMP:
 *    POST to: https://us1.api.mailchimp.com/3.0/lists/{LIST_ID}/members
 *    Headers: Authorization: apikey YOUR_API_KEY
 *    Body: { email_address: email, status: "subscribed",
 *             merge_fields: { FNAME: name }, tags: interests }
 *
 *  CONVERTKIT:
 *    POST to: https://api.convertkit.com/v3/forms/{FORM_ID}/subscribe
 *    Body: { api_key: 'YOUR_API_KEY', email, first_name: name }
 *
 *  BUTTONDOWN:
 *    POST to: https://api.buttondown.email/v1/subscribers
 *    Headers: Authorization: Token YOUR_API_KEY
 *    Body: { email, metadata: { name, interests } }
 *
 *  For Netlify / serverless, proxy through a function to hide API key.
 * └──────────────────────────────────────────────────────────┘
 */

(function () {
  'use strict';

  /* ── LocalStorage Keys ──────────────────────────────────── */
  const LS_KEY       = 'rw_newsletter_v2';
  const FANCLUB_KEY  = 'rw_fanclub_member';

  /* ── Fan Club Member State ──────────────────────────────── */
  function isFanClubMember() {
    try { return Boolean(localStorage.getItem(FANCLUB_KEY)); } catch { return false; }
  }
  function syncFanClubUI() {
    const member = isFanClubMember();
    const section = document.getElementById('fan-club') || document.getElementById('fan-club-home');
    if (section) {
      section.classList.toggle('is-registered', member);
    }
    if (member) {
      const popup = document.getElementById('nl-exit-popup');
      if (popup && popup.classList.contains('open')) {
        popup.classList.remove('open');
        document.body.classList.remove('rw-popup-locked');
      }
    }
  }
  function setFanClubMember() {
    try { localStorage.setItem(FANCLUB_KEY, '1'); } catch { }
    syncFanClubUI();
  }
  window.isFanClubMember = isFanClubMember;
  window.setFanClubMember = setFanClubMember;
  window.syncFanClubUI   = syncFanClubUI;

  /* ── Subscriber State ───────────────────────────────────── */
  function getState() {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || '{}'); } catch { return {}; }
  }
  function setState(s) {
    try { localStorage.setItem(LS_KEY, JSON.stringify(s)); } catch { }
  }
  function isSubscribed() { return !!getState().email; }

  /* ── Validation ─────────────────────────────────────────── */
  function validEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e); }
  function validName(n)  { return n.trim().length >= 2; }

  /* ── Real Backend Submission via Vercel Resend (/api/sendEmail) ── */
  function submitNewsletterToApi(data, callback) {
    const submittedAt = new Date().toISOString();
    setState({
      email:     data.email,
      name:      data.name,
      interests: data.interests,
      date:      submittedAt,
    });

    fetch('/api/sendEmail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from_name:  data.name || 'Sunshine Subscriber',
        from_email: data.email,
        interests:  data.interests || [],
        timestamp:  submittedAt,
        source:     data.source || 'Subscribe to Sunshine Newsletter',
      }),
    })
      .then(async (res) => {
        const payload = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(payload.error || `HTTP ${res.status}`);
        console.log('✅ Sunshine Newsletter email delivered (200 OK):', payload);
        callback(true, payload);
      })
      .catch((err) => {
        console.warn('⚠️ Sunshine Newsletter email warning:', err);
        callback(false);
      });
  }

  /* ── Toast ──────────────────────────────────────────────── */
  function toast(msg, type = 'success') {
    let t = document.getElementById('toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'toast';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.style.background = type === 'error'
      ? 'linear-gradient(135deg,rgba(220,38,38,.9),rgba(239,68,68,.9))'
      : 'linear-gradient(135deg,rgba(245,158,11,.92),rgba(252,211,77,.85))';
    t.style.color = type === 'error' ? 'white' : '#1a0533';
    t.classList.add('show');
    clearTimeout(t._t);
    t._t = setTimeout(() => t.classList.remove('show'), 3000);
  }

  /* ── Collect Checked Interests ──────────────────────────── */
  function getInterests(form) {
    return Array.from(form.querySelectorAll('.nl-check-label.checked'))
      .map(el => el.querySelector('span:not(.nl-check-mark)')?.textContent.trim())
      .filter(Boolean);
  }

  /* ── Success UI Swap ─────────────────────────────────────── */
  function showSuccess(formEl, successEl) {
    formEl.style.display = 'none';
    successEl.classList.add('show');
  }

  /* ── Checkbox interactivity ──────────────────────────────── */
  function initCheckboxes(container) {
    container.querySelectorAll('.nl-check-label').forEach(label => {
      label.addEventListener('click', () => {
        label.classList.toggle('checked');
      });
    });
  }

  /* ══════════════════════════════════════════════════════════
     BUILD PIECES
  ══════════════════════════════════════════════════════════ */

  /* ── 1. MODAL ───────────────────────────────────────────── */
  function buildModal() {
    if (document.getElementById('nl-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'nl-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-label', 'Newsletter Subscription');
    modal.innerHTML = `
      <div class="nl-modal-box">
        <button class="nl-modal-close" id="nl-modal-close" aria-label="Close">✕</button>

        <!-- Header -->
        <div class="nl-modal-header">
          <div class="nl-modal-eyebrow">☀️ &nbsp;Subscribe to Sunshine</div>
          <h2>Join the <em>Inner Circle</em></h2>
          <p>Book club picks, Hello Sunshine exclusives, behind-the-scenes drops, and Reese's monthly scoop — delivered straight to you.</p>
        </div>

        <!-- Lead magnet -->
        <div class="nl-magnet">
          <div class="nl-magnet-icon">🎁</div>
          <div class="nl-magnet-text">
            <strong>Free gift when you subscribe:</strong>
            <span>Exclusive Reese-themed wallpaper pack (phone + desktop) + first edition of the monthly scoop.</span>
          </div>
        </div>

        <!-- FORM -->
        <form class="nl-modal-form" id="nl-modal-form" novalidate autocomplete="off">
          <div class="nl-row">
            <div class="nl-field">
              <label for="nl-m-name">Full Name</label>
              <input type="text" id="nl-m-name" placeholder="Elle Woods" autocomplete="name"/>
            </div>
            <div class="nl-field">
              <label for="nl-m-email">Email Address</label>
              <input type="email" id="nl-m-email" placeholder="you@example.com" autocomplete="email"/>
            </div>
          </div>

          <div class="nl-interests">
            <div class="nl-interests-title">I'm most interested in</div>
            <div class="nl-checks">
              <label class="nl-check-label checked"><input type="checkbox"/><span class="nl-check-mark">✓</span><span>Latest News</span></label>
              <label class="nl-check-label checked"><input type="checkbox"/><span class="nl-check-mark">✓</span><span>Book Club</span></label>
              <label class="nl-check-label"><input type="checkbox"/><span class="nl-check-mark">✓</span><span>Movies &amp; TV</span></label>
              <label class="nl-check-label"><input type="checkbox"/><span class="nl-check-mark">✓</span><span>Photos</span></label>
              <label class="nl-check-label"><input type="checkbox"/><span class="nl-check-mark">✓</span><span>Behind-the-Scenes</span></label>
            </div>
          </div>

          <button type="submit" class="btn-nl-gold" id="nl-modal-submit" style="width:100%;justify-content:center">
            <span class="nl-btn-text">Subscribe to Sunshine ☀️</span>
            <span class="nl-btn-loading" style="display:none">Subscribing…</span>
          </button>

          <p class="nl-privacy">
            🔒 We respect your inbox.
            <a href="#">Unsubscribe anytime</a>. No spam, ever.
          </p>
        </form>

        <!-- SUCCESS -->
        <div class="nl-success" id="nl-modal-success">
          <div class="nl-check-anim">☀️</div>
          <h3>Welcome to the Sunshine!</h3>
          <p>You're officially part of the Reese Witherspoon fan community.<br/>Check your email for your free wallpaper pack + first scoop.</p>
          <div class="nl-wallpaper-preview">
            <img src="wallpaper-pack-preview.png" alt="Exclusive Reese Wallpaper Pack"/>
            <div class="nl-wallpaper-label">✦ Your Free Wallpaper Pack — Downloading Soon</div>
          </div>
        </div>
      </div>`;

    document.body.appendChild(modal);
    initCheckboxes(modal);

    // Close handlers
    const closeModal = () => {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    };
    modal.querySelector('#nl-modal-close').addEventListener('click', closeModal);
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

    // Form submit
    const form = modal.querySelector('#nl-modal-form');
    form.addEventListener('submit', e => {
      e.preventDefault();
      handleSubmit(
        form,
        form.querySelector('#nl-m-name'),
        form.querySelector('#nl-m-email'),
        modal.querySelector('#nl-modal-success'),
        modal.querySelector('#nl-modal-submit')
      );
    });
  }

  function openModal() {
    const modal = document.getElementById('nl-modal');
    if (!modal) return;
    if (isSubscribed()) {
      toast('✦ You\'re already subscribed! Check your email for your wallpaper pack.');
      return;
    }
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => modal.querySelector('#nl-m-name')?.focus(), 200);
  }
  window.openNewsletterModal = openModal;

  /* ── 2. FLOATING BUTTON ─────────────────────────────────── */
  function buildFloatBtn() {
    if (document.getElementById('nl-float-btn')) return;
    const btn = document.createElement('button');
    btn.id = 'nl-float-btn';
    btn.setAttribute('aria-label', 'Subscribe to newsletter');
    btn.innerHTML = `<span>☀️</span><span class="nl-float-label">Subscribe</span>`;
    document.body.appendChild(btn);
    btn.addEventListener('click', openModal);
  }

  /* ── 3. ENTRY FAN CLUB POPUP ────────────────────────────── */
  let popupPrevFocus = null;

  function ensureExitPopup() {
    let popup = document.getElementById('nl-exit-popup');
    if (popup) return popup;

    const inPageFanClub = document.getElementById('fan-club') || document.getElementById('fan-club-home');
    const submitHref = inPageFanClub ? '#fan-club' : '/#fan-club';

    popup = document.createElement('div');
    popup.id = 'nl-exit-popup';
    popup.setAttribute('role', 'dialog');
    popup.setAttribute('aria-modal', 'true');
    popup.setAttribute('aria-labelledby', 'nl-exit-heading');
    popup.innerHTML = `
      <div class="nl-exit-inner">
        <div class="nl-exit-emoji" aria-hidden="true">☀️</div>
        <div class="nl-exit-text">
          <h3 id="nl-exit-heading">Join Reese's Fan Club</h3>
          <p>Founding member access — first look at new projects, book club picks, and behind-the-scenes notes. Free.</p>
        </div>
        <div class="nl-exit-form">
          <a href="${submitHref}" class="btn-nl-gold nl-exit-cta" id="nl-exit-submit">Join the Fan Club ☀️</a>
        </div>
        <button type="button" class="nl-exit-dismiss" id="nl-exit-dismiss">Maybe later</button>
        <button type="button" class="nl-exit-close" id="nl-exit-close" aria-label="Close">✕</button>
      </div>`;
    document.body.appendChild(popup);

    popup.querySelector('#nl-exit-close').addEventListener('click', closeFanClubPopup);
    popup.querySelector('#nl-exit-dismiss').addEventListener('click', closeFanClubPopup);
    popup.addEventListener('click', (e) => {
      if (e.target === popup) closeFanClubPopup();
    });

    popup.querySelector('#nl-exit-submit').addEventListener('click', (e) => {
      setFanClubMember();
      popup.classList.remove('open');
      document.body.classList.remove('rw-popup-locked');
      const targetSection = document.getElementById('fan-club') || document.getElementById('fan-club-home');
      if (targetSection) {
        e.preventDefault();
        if (typeof window.focusFanClubGenerator === 'function') {
          window.focusFanClubGenerator();
        } else {
          const reduceMotion = Boolean(
            window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
          );
          targetSection.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
        }
      }
    });

    document.addEventListener('keydown', (e) => {
      if (!popup.classList.contains('open')) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        closeFanClubPopup();
        return;
      }
      if (e.key === 'Tab') {
        const focusables = Array.from(
          popup.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
        );
        if (!focusables.length) return;
        const first = focusables[0];
        const last  = focusables[focusables.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first || !popup.contains(document.activeElement)) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last || !popup.contains(document.activeElement)) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    });

    return popup;
  }

  function openFanClubPopup() {
    const popup = ensureExitPopup();
    if (popup.classList.contains('open')) {
      const btn = popup.querySelector('#nl-exit-submit');
      if (btn) btn.focus({ preventScroll: true });
      return;
    }
    popupPrevFocus = document.activeElement;
    popup.classList.add('open');
    document.body.classList.add('rw-popup-locked');
    const primaryBtn = popup.querySelector('#nl-exit-submit');
    if (primaryBtn) primaryBtn.focus({ preventScroll: true });
  }

  function closeFanClubPopup() {
    const popup = document.getElementById('nl-exit-popup');
    if (!popup || !popup.classList.contains('open')) return;
    popup.classList.remove('open');
    document.body.classList.remove('rw-popup-locked');
    const target = popupPrevFocus;
    popupPrevFocus = null;
    if (target && target !== document.body && typeof target.focus === 'function' && document.contains(target)) {
      target.focus({ preventScroll: true });
    } else {
      if (document.activeElement && popup.contains(document.activeElement) && typeof document.activeElement.blur === 'function') {
        document.activeElement.blur();
      }
      if (target === document.body && document.body.hasAttribute('tabindex')) {
        document.body.focus({ preventScroll: true });
      }
    }
  }

  window.openFanClubPopup  = openFanClubPopup;
  window.closeFanClubPopup = closeFanClubPopup;

  function buildExitPopup() {
    // Check key BEFORE starting the open timer so returning members never see a flash
    if (isFanClubMember()) return;
    ensureExitPopup();
    setTimeout(() => {
      if (!isFanClubMember()) {
        openFanClubPopup();
      }
    }, 800);
  }

  /* ── 4. FOOTER NEWSLETTER STRIP ─────────────────────────── */
  function injectFooterStrip() {
    const footer = document.getElementById('footer');
    if (!footer || footer.querySelector('.footer-nl-strip')) return;

    const strip = document.createElement('div');
    strip.className = 'footer-nl-strip';
    strip.innerHTML = `
      <div class="container">
        <div class="footer-nl-inner">
          <div class="footer-nl-text">
            <h3>Subscribe to <span>Sunshine ☀️</span></h3>
            <p>Book club picks, Hello Sunshine news, and Reese's monthly scoop. Free, always.</p>
          </div>
          <form class="footer-nl-form" id="footer-nl-form-${Math.random().toString(36).slice(2,7)}" novalidate>
            <input class="footer-nl-input nl-footer-email-inp" type="email" placeholder="your@email.com" autocomplete="email"/>
            <button type="submit" class="btn-nl-gold" style="padding:12px 22px;font-size:.88rem">Subscribe ☀️</button>
          </form>
          <p class="nl-privacy" style="flex-basis:100%;padding-top:6px">🔒 We respect your inbox. Unsubscribe anytime. <a href="#">Privacy policy</a>.</p>
        </div>
      </div>`;
    footer.insertBefore(strip, footer.firstChild);

    strip.querySelector('form').addEventListener('submit', e => {
      e.preventDefault();
      const emailEl = strip.querySelector('.nl-footer-email-inp');
      const email   = emailEl.value.trim();
      if (!validEmail(email)) {
        emailEl.style.borderColor = 'rgba(236,72,153,.7)';
        emailEl.placeholder = 'Enter a valid email!';
        return;
      }
      const btn = strip.querySelector('button[type="submit"]');
      btn.textContent = 'Subscribing…';
      btn.disabled = true;
      submitNewsletterToApi({ email, name: 'Sunshine Subscriber', interests: [], source: 'Footer Subscribe to Sunshine' }, () => {
        strip.querySelector('.footer-nl-inner').innerHTML = `
          <div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap">
            <div style="font-size:1.8rem">☀️</div>
            <div>
              <div style="font-weight:800;font-size:1rem;margin-bottom:3px">You're subscribed! Welcome to the community.</div>
              <div style="font-size:.82rem;color:var(--muted)">Check your email for your welcome note and free wallpaper pack.</div>
            </div>
          </div>`;
        toast('🎉 Subscribed! Welcome email sent to your inbox.');
      });
    });
  }

  /* ── 5. HERO BANNER (homepage & explore injection) ──────── */
  window.buildNlHeroBanner = function(container) {
    if (!container) return;
    container.innerHTML = `
      <div class="nl-hero-grid">
        <div class="nl-hero-content" data-reveal>
          <p class="tag" style="margin-bottom:10px">Subscribe to Sunshine</p>
          <h2>The <em>Sunshine Newsletter</em></h2>
          <p class="body" style="margin-bottom:0;max-width:480px">Book club picks, Hello Sunshine announcements, exclusive photos, behind-the-scenes moments, and Reese's personal monthly message — free, straight to you.</p>
          <form class="nl-hero-form" id="nl-hero-form" novalidate>
            <div class="nl-hero-inline">
              <input type="text" id="nl-h-name" placeholder="Your first name" autocomplete="given-name"/>
              <input type="email" id="nl-h-email" placeholder="your@email.com" autocomplete="email"/>
            </div>
            <button type="submit" class="btn-nl-gold" id="nl-hero-submit">Subscribe to Sunshine ☀️</button>
            <p class="nl-privacy">🔒 No spam, ever. Unsubscribe anytime. <a href="#">Privacy</a>.</p>
          </form>
          <!-- Lead magnet badge -->
          <div class="nl-magnet" style="margin-top:14px;margin-bottom:0">
            <div class="nl-magnet-icon">🎁</div>
            <div class="nl-magnet-text">
              <strong>Free gift on signup:</strong>
              <span>Exclusive wallpaper pack (phone + desktop) + Monthly Scoop newsletter.</span>
            </div>
          </div>
        </div>
        <div class="nl-hero-visual" data-reveal data-reveal-delay="2">
          <div class="nl-hero-img-wrap">
            <img src="wallpaper-pack-preview.png" alt="Exclusive Reese Wallpaper Pack"/>
          </div>
          <div class="nl-hero-badges">
            <div class="nl-badge">✦ Free Wallpaper Pack</div>
            <div class="nl-badge">📬 Monthly Scoop</div>
          </div>
        </div>
      </div>
      <div class="nl-success" id="nl-hero-success" style="margin-top:32px">
        <div class="nl-check-anim">☀️</div>
        <h3>You're now part of the Sunshine community!</h3>
        <p>Check your email for your free wallpaper pack + first edition of the Monthly Scoop.</p>
        <div class="nl-wallpaper-preview" style="max-width:500px;margin-top:20px">
          <img src="wallpaper-pack-preview.png" alt="Exclusive Reese Wallpaper Pack"/>
          <div class="nl-wallpaper-label">✦ Your Exclusive Fan Wallpaper Pack</div>
        </div>
      </div>`;

    const form = container.querySelector('#nl-hero-form');
    form.addEventListener('submit', e => {
      e.preventDefault();
      handleSubmit(
        form,
        form.querySelector('#nl-h-name'),
        form.querySelector('#nl-h-email'),
        container.querySelector('#nl-hero-success'),
        container.querySelector('#nl-hero-submit')
      );
    });
  };

  /* ── 6. FULL DEDICATED FORM ──────────────────────────────── */
  window.buildNlDedicatedSection = function(container) {
    if (!container) return;
    container.innerHTML = `
      <div class="nl-dedicated-grid">
        <div class="nl-full-form">
          <div class="nl-form-title">Join the <span>Sunshine Community</span> ☀️</div>
          <p style="color:var(--muted);font-size:.88rem;margin-bottom:6px">What you'll get every month:</p>

          <!-- Magnet -->
          <div class="nl-magnet" style="margin-bottom:6px">
            <div class="nl-magnet-icon">🎁</div>
            <div class="nl-magnet-text">
              <strong>Immediate free gift on signup</strong>
              <span>Exclusive fan wallpaper pack (7 designs for phone &amp; desktop).</span>
            </div>
          </div>

          <form id="nl-dedicated-form" novalidate style="display:flex;flex-direction:column;gap:12px">
            <div class="nl-field">
              <label for="nl-d-name">Full Name</label>
              <input type="text" id="nl-d-name" placeholder="Elle Woods" autocomplete="name"/>
            </div>
            <div class="nl-field">
              <label for="nl-d-email">Email Address</label>
              <input type="email" id="nl-d-email" placeholder="you@example.com" autocomplete="email"/>
            </div>
            <div class="nl-interests">
              <div class="nl-interests-title">What are you most interested in?</div>
              <div class="nl-checks">
                <label class="nl-check-label checked"><input type="checkbox"/><span class="nl-check-mark">✓</span><span>Latest News</span></label>
                <label class="nl-check-label checked"><input type="checkbox"/><span class="nl-check-mark">✓</span><span>Book Club</span></label>
                <label class="nl-check-label"><input type="checkbox"/><span class="nl-check-mark">✓</span><span>Movies &amp; TV</span></label>
                <label class="nl-check-label"><input type="checkbox"/><span class="nl-check-mark">✓</span><span>Photos</span></label>
                <label class="nl-check-label"><input type="checkbox"/><span class="nl-check-mark">✓</span><span>Behind-the-Scenes</span></label>
                <label class="nl-check-label"><input type="checkbox"/><span class="nl-check-mark">✓</span><span>Hello Sunshine</span></label>
              </div>
            </div>
            <button type="submit" class="btn-nl-gold" id="nl-ded-submit" style="width:100%;justify-content:center">Subscribe to Sunshine ☀️</button>
            <p class="nl-privacy">🔒 We respect your inbox. No spam. Unsubscribe anytime. <a href="#">Privacy policy</a>.</p>
          </form>

          <div class="nl-success" id="nl-ded-success" style="padding:12px 0">
            <div class="nl-check-anim">☀️</div>
            <h3>You're in the Sunshine community!</h3>
            <p>Check your email for your free wallpaper pack. Welcome!</p>
            <div class="nl-wallpaper-preview">
              <img src="wallpaper-pack-preview.png" alt="Wallpaper Pack"/>
              <div class="nl-wallpaper-label">✦ Your Exclusive Fan Wallpaper Pack</div>
            </div>
          </div>
        </div>

        <div class="nl-perks-list">
          <div class="nl-perk">
            <div class="nl-perk-icon">📖</div>
            <div class="nl-perk-text">
              <strong>Monthly Book Club Picks</strong>
              <span>Get Reese's pick the moment it's announced — before Instagram.</span>
            </div>
          </div>
          <div class="nl-perk">
            <div class="nl-perk-icon">☀️</div>
            <div class="nl-perk-text">
              <strong>Hello Sunshine Exclusives</strong>
              <span>Behind-the-scenes from Big Little Lies, Morning Show, and new productions.</span>
            </div>
          </div>
          <div class="nl-perk">
            <div class="nl-perk-icon">🎬</div>
            <div class="nl-perk-text">
              <strong>Film News First</strong>
              <span>New projects, trailers, and casting news before anyone else.</span>
            </div>
          </div>
          <div class="nl-perk">
            <div class="nl-perk-icon">📸</div>
            <div class="nl-perk-text">
              <strong>Exclusive Photo Drops</strong>
              <span>Red carpet, behind-the-scenes, and editorial photos not on social media.</span>
            </div>
          </div>
          <div class="nl-perk">
            <div class="nl-perk-icon">💌</div>
            <div class="nl-perk-text">
              <strong>Reese's Monthly Message</strong>
              <span>A personal note from Reese — what she's reading, watching, and loving.</span>
            </div>
          </div>
          <div class="nl-perk">
            <div class="nl-perk-icon">🎁</div>
            <div class="nl-perk-text">
              <strong>Free Wallpaper Pack</strong>
              <span>7 exclusive Sunshine wallpapers for phone and desktop — yours on signup.</span>
            </div>
          </div>
        </div>
      </div>`;

    const form = container.querySelector('#nl-dedicated-form');
    initCheckboxes(form.closest('.nl-dedicated-grid') || container);
    form.addEventListener('submit', e => {
      e.preventDefault();
      handleSubmit(
        form,
        form.querySelector('#nl-d-name'),
        form.querySelector('#nl-d-email'),
        container.querySelector('#nl-ded-success'),
        container.querySelector('#nl-ded-submit')
      );
    });
  };

  /* ── CENTRAL SUBMIT HANDLER ─────────────────────────────── */
  function handleSubmit(form, nameEl, emailEl, successEl, submitBtn) {
    // Reset errors
    [nameEl, emailEl].forEach(el => el && (el.style.borderColor = ''));

    const name     = nameEl?.value.trim() || '';
    const email    = emailEl?.value.trim() || '';
    const interests= getInterests(form);
    let hasError   = false;

    if (nameEl && !validName(name)) {
      nameEl.style.borderColor = 'rgba(236,72,153,.7)';
      hasError = true;
    }
    if (!validEmail(email)) {
      if (emailEl) emailEl.style.borderColor = 'rgba(236,72,153,.7)';
      toast('❗ Please enter a valid email address.', 'error');
      hasError = true;
    }
    if (hasError) return;

    // Loading state
    const btnText = submitBtn.querySelector('.nl-btn-text') || submitBtn;
    const btnLoad = submitBtn.querySelector('.nl-btn-loading');
    submitBtn.disabled = true;
    if (btnLoad) { btnText.style.display = 'none'; btnLoad.style.display = ''; }
    else submitBtn.textContent = 'Subscribing…';

    submitNewsletterToApi({ name, email, interests, source: `Subscribe to Sunshine (${form.id || 'form'})` }, () => {
      showSuccess(form, successEl);
      toast('🎉 You\'re subscribed! Check your inbox for your welcome email.');
      // If subscribed from modal, update float btn
      const floatBtn = document.getElementById('nl-float-btn');
      if (floatBtn) { floatBtn.innerHTML = `<span>✓</span><span class="nl-float-label">Subscribed</span>`; floatBtn.style.background = 'linear-gradient(135deg,#059669,#10b981)'; floatBtn.style.color='white'; floatBtn.style.boxShadow='0 8px 28px rgba(5,150,105,.35)'; floatBtn.onclick = null; }
    });
  }

  /* ── TEASER CARDS ───────────────────────────────────────── */
  window.buildNlTeasers = function(container) {
    if (!container) return;
    const teasers = [
      { tag: '📸 Last Month\'s Exclusive', title: 'Behind the Scenes: Morning Show Season 4 Filming', img: 'reesewitherspoon/reesewitherspoon_1640021819_2733023570386325475_367315644.jpg' },
      { tag: '📚 Book Club Scoop', title: 'Reese\'s Personal Note on This Month\'s Pick', img: 'reesewitherspoon/reesesbookclub_1693063724_3177971311774135084_2249417883.jpg' },
      { tag: '☀️ Hello Sunshine', title: 'First Look: New Production Announcement & Cast', img: 'reesewitherspoon/glamourmag_1756814591_3712752346641580542_10070230.jpg' },
    ];
    container.innerHTML = teasers.map(t => `
      <div class="nl-teaser-card" onclick="window.openNewsletterModal()">
        <div class="nl-teaser-img"><img src="${t.img}" alt="${t.title}" loading="lazy"/></div>
        <div class="nl-teaser-lock">🔒</div>
        <div class="nl-teaser-overlay">
          <div class="nl-teaser-tag">${t.tag}</div>
          <div class="nl-teaser-title">${t.title}</div>
          <div class="nl-teaser-cta">Subscribe to unlock <span>→</span></div>
        </div>
      </div>`).join('');
  };

  /* ── INIT ───────────────────────────────────────────────── */
  function init() {
    syncFanClubUI();
    buildModal();
    buildFloatBtn();
    injectFooterStrip();
    buildExitPopup();

    window.addEventListener('pageshow', syncFanClubUI);
    window.addEventListener('storage', (e) => {
      if (!e.key || e.key === FANCLUB_KEY) syncFanClubUI();
    });

    // Hero banner mount
    document.querySelectorAll('[data-nl-hero-mount]').forEach(window.buildNlHeroBanner);
    // Dedicated section mount
    document.querySelectorAll('[data-nl-dedicated-mount]').forEach(window.buildNlDedicatedSection);
    // Teaser cards mount
    document.querySelectorAll('[data-nl-teasers-mount]').forEach(window.buildNlTeasers);

    // Mark already-subscribed users
    if (isSubscribed()) {
      const btn = document.getElementById('nl-float-btn');
      if (btn) {
        btn.innerHTML = `<span>✓</span><span class="nl-float-label">Subscribed!</span>`;
        btn.style.background = 'linear-gradient(135deg,#059669,#10b981)';
        btn.style.color = 'white';
        btn.style.boxShadow = '0 8px 28px rgba(5,150,105,.35)';
        btn.style.animation = 'none';
      }
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

})();
