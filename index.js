// index.js — Homepage-specific interactions

// ── Hero video background (if video available) ────────────
// Using cinematic still with parallax scroll effect
const heroImg = document.getElementById('hero-main-img');
window.addEventListener('scroll', () => {
  if (!heroImg) return;
  const scrolled = window.scrollY;
  heroImg.style.transform = `translateY(${scrolled * 0.08}px)`;
}, { passive: true });

// ── Works grid stagger ────────────────────────────────────
document.querySelectorAll('.work-card').forEach((card, i) => {
  card.setAttribute('data-reveal', '');
  card.setAttribute('data-reveal-delay', i + 1);
});

// ── Fan Club Section & Interactive Official Fan Card Generator ─────────
(function initFanClubGenerator() {
  const FANCLUB_KEY = 'rw_fanclub_member';
  const PROFILE_KEY = 'rw_fancard_profile_v1';
  const REESE_PORTRAIT_SRC = 'reesewitherspoon/reesewitherspoon_1579478144_2225146406606465542_367315644.jpg';

  const section = document.getElementById('fan-club') || document.getElementById('fan-club-home');
  if (!section) return;

  // CTA triggers
  const joinBtn = document.getElementById('home-fanclub-btn');
  const cardBtn = document.getElementById('home-fancard-btn');
  const editCardBtn = document.getElementById('fc-edit-card-btn');
  const benefitCardLink = document.getElementById('fc-benefit-card-link');

  // Live Card DOM elements
  const cardNameEl = document.getElementById('fc-card-name');
  const cardCountryEl = document.getElementById('fc-card-country');
  const cardJoinedEl = document.getElementById('fc-card-joined');
  const cardMemberIdEl = document.getElementById('fc-card-member-id');
  const avatarSlotEl = document.getElementById('fc-card-avatar-slot');
  const avatarImgEl = document.getElementById('fc-card-avatar-img');
  const avatarInitialsEl = document.getElementById('fc-card-avatar-initials');
  const reeseCardImgEl = document.getElementById('fc-card-reese-img');

  // Form DOM elements
  const formEl = document.getElementById('fc-generator-panel');
  const nameInput = document.getElementById('fc-input-name');
  const emailInput = document.getElementById('fc-input-email');
  const countryInput = document.getElementById('fc-input-country');
  const photoInput = document.getElementById('fc-input-photo');
  const photoFilenameEl = document.getElementById('fc-photo-filename');
  const photoClearBtn = document.getElementById('fc-photo-clear-btn');
  const feedbackEl = document.getElementById('fc-gen-feedback');
  const activateBtn = document.getElementById('fc-activate-btn');

  let avatarDataUrl = '';
  let loadedAvatarImg = null;
  let loadedReeseImg = null;

  function randomFourDigits() {
    if (window.crypto && window.crypto.getRandomValues) {
      const buf = new Uint32Array(1);
      window.crypto.getRandomValues(buf);
      return String(1000 + (buf[0] % 9000));
    }
    return String(Math.floor(1000 + Math.random() * 9000));
  }

  function generateMemberId() {
    return `RW-${randomFourDigits()}-${randomFourDigits()}`;
  }

  function currentMonthYear() {
    try {
      return new Date()
        .toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        .toUpperCase();
    } catch {
      return 'NOV 2026';
    }
  }

  function loadSavedProfile() {
    try {
      return JSON.parse(localStorage.getItem(PROFILE_KEY) || '{}') || {};
    } catch {
      return {};
    }
  }

  function saveProfile(data) {
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(data));
    } catch {}
  }

  const saved = loadSavedProfile();
  const memberId = /^RW-\d{4}-\d{4}$/.test(saved.memberId || '')
    ? saved.memberId
    : generateMemberId();
  const joinDate = saved.joinDate || currentMonthYear();

  // Persist initial generated ID & join date so card stays consistent
  saveProfile({
    name: saved.name || '',
    email: saved.email || '',
    country: saved.country || '',
    memberId,
    joinDate,
  });

  function syncSectionState() {
    if (typeof window.syncFanClubUI === 'function') {
      window.syncFanClubUI();
      return;
    }
    let isMember = false;
    try { isMember = Boolean(localStorage.getItem(FANCLUB_KEY)); } catch {}
    section.classList.toggle('is-registered', isMember);
  }

  function computeInitials(fullName) {
    const parts = fullName.trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return '';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  function updateCardPreview() {
    const rawName = nameInput ? nameInput.value.trim() : '';
    const rawCountry = countryInput ? countryInput.value.trim() : '';
    const displayName = rawName ? rawName.toUpperCase() : 'YOUR NAME HERE';
    const displayCountry = rawCountry ? rawCountry.toUpperCase() : 'WORLDWIDE';

    if (cardNameEl) {
      cardNameEl.textContent = displayName;
      cardNameEl.classList.toggle('is-medium', displayName.length > 18 && displayName.length <= 28);
      cardNameEl.classList.toggle('is-long', displayName.length > 28);
    }
    if (cardCountryEl) cardCountryEl.textContent = displayCountry;
    if (cardJoinedEl) cardJoinedEl.textContent = joinDate;
    if (cardMemberIdEl) cardMemberIdEl.textContent = memberId;

    if (avatarSlotEl && avatarInitialsEl) {
      const initials = computeInitials(rawName);
      avatarInitialsEl.textContent = initials;
      avatarSlotEl.classList.toggle('has-initials', Boolean(initials) && !avatarDataUrl);
    }
  }

  function showFeedback(message, isSuccess = false) {
    if (!feedbackEl) return;
    if (!message) {
      feedbackEl.hidden = true;
      feedbackEl.textContent = '';
      feedbackEl.classList.remove('is-success');
      return;
    }
    feedbackEl.textContent = message;
    feedbackEl.classList.toggle('is-success', isSuccess);
    feedbackEl.hidden = false;
  }

  function validEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validateRequiredFields() {
    const nameVal = nameInput ? nameInput.value.trim() : '';
    const emailVal = emailInput ? emailInput.value.trim() : '';

    if (nameInput) nameInput.classList.remove('is-invalid');
    if (emailInput) emailInput.classList.remove('is-invalid');

    if (nameVal.length < 2) {
      if (nameInput) {
        nameInput.classList.add('is-invalid');
        nameInput.focus();
      }
      showFeedback('Please enter your Full Name to personalize your Official Fan Card.');
      return false;
    }
    if (!validEmail(emailVal)) {
      if (emailInput) {
        emailInput.classList.add('is-invalid');
        emailInput.focus();
      }
      showFeedback('Please enter a valid Email Address to register your Founding Membership.');
      return false;
    }
    showFeedback('');
    return true;
  }

  function persistMembership() {
    const profile = {
      name: nameInput ? nameInput.value.trim() : '',
      email: emailInput ? emailInput.value.trim() : '',
      country: countryInput ? countryInput.value.trim() : '',
      memberId,
      joinDate,
    };
    saveProfile(profile);
    if (typeof window.setFanClubMember === 'function') {
      window.setFanClubMember();
    } else {
      try { localStorage.setItem(FANCLUB_KEY, '1'); } catch {}
      syncSectionState();
    }
  }

  function focusGeneratorFlow(e) {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    // If mobile hamburger menu is open, close it cleanly first
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    if (hamburger && (document.body.classList.contains('menu-open') || (navLinks && navLinks.style.position === 'fixed'))) {
      hamburger.click();
    }
    if (window.history && typeof window.history.replaceState === 'function' && e && e.currentTarget) {
      const clickedHref = (e.currentTarget.getAttribute && e.currentTarget.getAttribute('href')) || '';
      const nextHash = clickedHref.includes('community') ? '#community' : '#fan-club';
      window.history.replaceState(null, '', nextHash);
    }
    const reduceMotion = Boolean(
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
    section.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    if (!formEl) return;
    formEl.classList.add('is-highlighted');
    setTimeout(() => formEl.classList.remove('is-highlighted'), 1600);
    setTimeout(() => {
      if (nameInput && !nameInput.value.trim()) nameInput.focus({ preventScroll: true });
      else if (emailInput && !emailInput.value.trim()) emailInput.focus({ preventScroll: true });
      else if (nameInput) nameInput.focus({ preventScroll: true });
    }, 260);
  }
  window.focusFanClubGenerator = focusGeneratorFlow;

  const anchorTriggers = new Set(
    [
      joinBtn,
      cardBtn,
      editCardBtn,
      benefitCardLink,
      document.getElementById('nav-join-link'),
      ...Array.from(
        document.querySelectorAll(
          'a.nav-join, a[href="#fan-club"], a[href="/#fan-club"], a[href="#community"], a[href="/#community"], a[href="#fc-generator-panel"]'
        )
      ),
    ].filter(Boolean)
  );
  anchorTriggers.forEach((btn) => {
    btn.addEventListener('click', focusGeneratorFlow);
  });

  // If arriving via /#fan-club or /#community from another page, scroll & highlight smoothly
  if (window.location && (window.location.hash === '#fan-club' || window.location.hash === '#community')) {
    setTimeout(() => focusGeneratorFlow(), 80);
  }

  // Hydrate inputs from saved profile if present
  if (nameInput && saved.name) nameInput.value = saved.name;
  if (emailInput && saved.email) emailInput.value = saved.email;
  if (countryInput && saved.country) countryInput.value = saved.country;

  syncSectionState();
  updateCardPreview();

  if (nameInput) {
    nameInput.addEventListener('input', () => {
      nameInput.classList.remove('is-invalid');
      updateCardPreview();
    });
  }
  if (emailInput) {
    emailInput.addEventListener('input', () => {
      emailInput.classList.remove('is-invalid');
    });
  }
  if (countryInput) {
    countryInput.addEventListener('input', updateCardPreview);
  }

  // Instant client-side FileReader profile photo preview
  if (photoInput) {
    photoInput.addEventListener('change', () => {
      const file = photoInput.files && photoInput.files[0];
      if (!file) return;
      if (!file.type || !file.type.startsWith('image/')) {
        showFeedback('Please choose an image file (JPG, PNG, WEBP, or GIF).');
        return;
      }
      const reader = new FileReader();
      reader.onload = (evt) => {
        const result = typeof evt.target?.result === 'string' ? evt.target.result : '';
        if (!result) return;
        const img = new Image();
        img.onload = () => {
          avatarDataUrl = result;
          loadedAvatarImg = img;
          if (avatarImgEl) avatarImgEl.src = result;
          if (avatarSlotEl) {
            avatarSlotEl.classList.add('has-photo');
            avatarSlotEl.classList.remove('has-initials');
          }
          if (photoFilenameEl) photoFilenameEl.textContent = file.name;
          if (photoClearBtn) photoClearBtn.hidden = false;
          showFeedback('');
        };
        img.src = result;
      };
      reader.readAsDataURL(file);
    });
  }

  if (photoClearBtn) {
    photoClearBtn.addEventListener('click', () => {
      avatarDataUrl = '';
      loadedAvatarImg = null;
      if (photoInput) photoInput.value = '';
      if (avatarImgEl) {
        avatarImgEl.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
      }
      if (avatarSlotEl) avatarSlotEl.classList.remove('has-photo');
      if (photoFilenameEl) photoFilenameEl.textContent = 'Choose Photo…';
      photoClearBtn.hidden = true;
      updateCardPreview();
    });
  }

  function ensureReesePortrait() {
    if (loadedReeseImg && (loadedReeseImg.naturalWidth || loadedReeseImg.width)) {
      return Promise.resolve(loadedReeseImg);
    }
    if (reeseCardImgEl && reeseCardImgEl.complete && (reeseCardImgEl.naturalWidth || reeseCardImgEl.width)) {
      loadedReeseImg = reeseCardImgEl;
      return Promise.resolve(loadedReeseImg);
    }
    return new Promise((resolve) => {
      const img = new Image();
      let settled = false;
      const done = (val) => {
        if (settled) return;
        settled = true;
        if (val) loadedReeseImg = val;
        resolve(val);
      };
      const timer = setTimeout(() => done(null), 1200);
      img.onload = () => {
        clearTimeout(timer);
        done(img);
      };
      img.onerror = () => {
        clearTimeout(timer);
        done(null);
      };
      img.src = REESE_PORTRAIT_SRC;
    });
  }

  // ── 2x High-DPI HTML5 Canvas Card Renderer & PNG Exporter ───────────
  function roundRectPath(ctx, x, y, w, h, r) {
    const radius = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + w, y, x + w, y + h, radius);
    ctx.arcTo(x + w, y + h, x, y + h, radius);
    ctx.arcTo(x, y + h, x, y, radius);
    ctx.arcTo(x, y, x + w, y, radius);
    ctx.closePath();
  }

  function drawSunburst(ctx, cx, cy, outerR) {
    ctx.save();
    const grad = ctx.createLinearGradient(cx - outerR, cy - outerR, cx + outerR, cy + outerR);
    grad.addColorStop(0, '#fff4b8');
    grad.addColorStop(0.4, '#fcd34d');
    grad.addColorStop(0.75, '#f59e0b');
    grad.addColorStop(1, '#fde68a');

    ctx.fillStyle = grad;
    ctx.strokeStyle = grad;
    const innerR = outerR * 0.34;
    const rays = 16;
    for (let i = 0; i < rays; i++) {
      const angle = (i * Math.PI * 2) / rays - Math.PI / 2;
      const tipR = i % 2 === 0 ? outerR : outerR * 0.78;
      const halfSpread = 0.095;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(angle) * tipR, cy + Math.sin(angle) * tipR);
      ctx.lineTo(
        cx + Math.cos(angle - halfSpread) * (innerR + 2),
        cy + Math.sin(angle - halfSpread) * (innerR + 2)
      );
      ctx.lineTo(
        cx + Math.cos(angle + halfSpread) * (innerR + 2),
        cy + Math.sin(angle + halfSpread) * (innerR + 2)
      );
      ctx.closePath();
      ctx.fill();
    }

    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.arc(cx, cy, innerR - 1.5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  function wrapCardNameLines(ctx, text, maxWidth, fontSizes) {
    for (const size of fontSizes) {
      ctx.font = `900 ${size}px "Playfair Display", Georgia, serif`;
      if (ctx.measureText(text).width <= maxWidth) {
        return { size, lines: [text] };
      }
    }
    const chosenSize = fontSizes[fontSizes.length - 1];
    ctx.font = `900 ${chosenSize}px "Playfair Display", Georgia, serif`;
    const words = text.split(/\s+/);
    const lines = [];
    let current = '';
    for (const word of words) {
      const candidate = current ? `${current} ${word}` : word;
      if (ctx.measureText(candidate).width <= maxWidth || !current) {
        current = candidate;
      } else {
        lines.push(current);
        current = word;
      }
    }
    if (current) lines.push(current);
    if (lines.length > 2) {
      let second = lines.slice(1).join(' ');
      while (second.length > 3 && ctx.measureText(`${second}…`).width > maxWidth) {
        second = second.slice(0, -1);
      }
      return { size: chosenSize, lines: [lines[0], `${second}…`] };
    }
    return { size: chosenSize, lines };
  }

  async function renderFanCardCanvas() {
    if (document.fonts && document.fonts.ready) {
      try {
        await Promise.race([
          document.fonts.ready,
          new Promise((resolve) => setTimeout(resolve, 600)),
        ]);
      } catch {}
    }

    const W = 1200;
    const H = 756;
    const SCALE = 2; // Crisp 2x High-DPI output (2400 x 1512 px)
    const canvas = document.createElement('canvas');
    canvas.width = W * SCALE;
    canvas.height = H * SCALE;
    const ctx = canvas.getContext('2d');
    ctx.scale(SCALE, SCALE);

    // 1. Card Outer Clip & Deep Obsidian Surface
    ctx.save();
    roundRectPath(ctx, 0, 0, W, H, 38);
    ctx.clip();

    const bgGrad = ctx.createLinearGradient(0, 0, W, H);
    bgGrad.addColorStop(0, '#0b0816');
    bgGrad.addColorStop(0.52, '#140c2b');
    bgGrad.addColorStop(1, '#080611');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Editorial Right-Side Reese Witherspoon Portrait Blend
    const reeseImg = await ensureReesePortrait();
    if (reeseImg && (reeseImg.naturalWidth || reeseImg.width)) {
      const rw = reeseImg.naturalWidth || reeseImg.width;
      const rh = reeseImg.naturalHeight || reeseImg.height;
      const panelX = Math.round(W * 0.46);
      const panelW = W - panelX;
      const scale = Math.max(panelW / rw, H / rh);
      const dw = rw * scale;
      const dh = rh * scale;
      const dx = panelX + (panelW - dw) * 0.5;
      const dy = (H - dh) * 0.16;

      ctx.save();
      ctx.beginPath();
      ctx.rect(panelX, 0, panelW, H);
      ctx.clip();
      ctx.globalAlpha = 0.80;
      ctx.drawImage(reeseImg, dx, dy, dw, dh);
      ctx.restore();

      // Horizontal dark luxury blend so left-side gold typography stays 100% legible
      const horizMask = ctx.createLinearGradient(panelX, 0, W, 0);
      horizMask.addColorStop(0, '#100a22');
      horizMask.addColorStop(0.18, 'rgba(16, 10, 34, 0.94)');
      horizMask.addColorStop(0.48, 'rgba(16, 10, 34, 0.52)');
      horizMask.addColorStop(0.78, 'rgba(11, 8, 22, 0.14)');
      horizMask.addColorStop(1, 'rgba(9, 6, 18, 0.44)');
      ctx.fillStyle = horizMask;
      ctx.fillRect(panelX - 2, 0, panelW + 4, H);

      // Vertical top & bottom vignette for Founding Member badge and Verified Fan seal
      const vertMask = ctx.createLinearGradient(0, 0, 0, H);
      vertMask.addColorStop(0, 'rgba(10, 7, 20, 0.78)');
      vertMask.addColorStop(0.28, 'rgba(10, 7, 20, 0.08)');
      vertMask.addColorStop(0.70, 'rgba(10, 7, 20, 0.12)');
      vertMask.addColorStop(1, 'rgba(9, 6, 18, 0.86)');
      ctx.fillStyle = vertMask;
      ctx.fillRect(panelX - 2, 0, panelW + 4, H);
    }

    // Ambient Violet & Pink Glows
    const glowTL = ctx.createRadialGradient(190, 140, 10, 190, 140, 520);
    glowTL.addColorStop(0, 'rgba(124, 58, 237, 0.30)');
    glowTL.addColorStop(1, 'rgba(124, 58, 237, 0)');
    ctx.fillStyle = glowTL;
    ctx.fillRect(0, 0, W, H);

    const glowBR = ctx.createRadialGradient(W - 180, H - 120, 10, W - 180, H - 120, 520);
    glowBR.addColorStop(0, 'rgba(236, 72, 153, 0.25)');
    glowBR.addColorStop(1, 'rgba(236, 72, 153, 0)');
    ctx.fillStyle = glowBR;
    ctx.fillRect(0, 0, W, H);

    const glowGold = ctx.createRadialGradient(W * 0.52, H * 0.48, 10, W * 0.52, H * 0.48, 420);
    glowGold.addColorStop(0, 'rgba(245, 158, 11, 0.08)');
    glowGold.addColorStop(1, 'rgba(245, 158, 11, 0)');
    ctx.fillStyle = glowGold;
    ctx.fillRect(0, 0, W, H);

    // 2. Luminous Purple-to-Pink Perimeter Border
    const borderGrad = ctx.createLinearGradient(22, 22, W - 22, H - 22);
    borderGrad.addColorStop(0, '#7c3aed');
    borderGrad.addColorStop(0.5, '#a855f7');
    borderGrad.addColorStop(1, '#ec4899');

    ctx.save();
    ctx.shadowColor = 'rgba(168, 85, 247, 0.65)';
    ctx.shadowBlur = 26;
    roundRectPath(ctx, 22, 22, W - 44, H - 44, 28);
    ctx.strokeStyle = borderGrad;
    ctx.lineWidth = 3.5;
    ctx.stroke();
    ctx.restore();

    // Inner Gold Hairline Accent
    roundRectPath(ctx, 34, 34, W - 68, H - 68, 22);
    ctx.strokeStyle = 'rgba(252, 211, 77, 0.18)';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Shared Metallic Gold Foil Gradient
    const goldGrad = ctx.createLinearGradient(80, 60, W - 120, H - 80);
    goldGrad.addColorStop(0, '#fff7cc');
    goldGrad.addColorStop(0.35, '#fcd34d');
    goldGrad.addColorStop(0.7, '#f59e0b');
    goldGrad.addColorStop(1, '#fde68a');

    // 3. Header: Sunburst + Club Title + Founding Member Badge
    drawSunburst(ctx, 94, 96, 26);

    ctx.fillStyle = goldGrad;
    ctx.font = '800 20px "Outfit", -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textBaseline = 'middle';
    ctx.fillText('OFFICIAL REESE WITHERSPOON FAN CLUB', 136, 97);

    // Founding Member Pill
    const badgeW = 248;
    const badgeH = 44;
    const badgeX = W - 68 - badgeW;
    const badgeY = 74;
    roundRectPath(ctx, badgeX, badgeY, badgeW, badgeH, 22);
    ctx.fillStyle = 'rgba(15, 10, 32, 0.86)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(252, 211, 77, 0.62)';
    ctx.lineWidth = 1.6;
    ctx.stroke();

    ctx.fillStyle = '#fde68a';
    ctx.font = '800 14px "Outfit", -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('FOUNDING MEMBER', badgeX + badgeW / 2, badgeY + badgeH / 2 + 1);
    ctx.textAlign = 'left';

    // Header Divider
    const divGrad = ctx.createLinearGradient(68, 148, W - 68, 148);
    divGrad.addColorStop(0, 'rgba(252, 211, 77, 0.48)');
    divGrad.addColorStop(0.55, 'rgba(168, 85, 247, 0.38)');
    divGrad.addColorStop(1, 'rgba(252, 211, 77, 0.06)');
    ctx.fillStyle = divGrad;
    ctx.fillRect(68, 148, W - 136, 1.5);

    // 4. Left Avatar Slot (Circular Gold-Bordered Frame)
    const avCx = 196;
    const avCy = 376;
    const avR = 114;

    // Outer dashed gold halo
    ctx.save();
    ctx.setLineDash([7, 7]);
    ctx.strokeStyle = 'rgba(252, 211, 77, 0.42)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(avCx, avCy, avR + 11, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Avatar circular clip & photo / placeholder
    ctx.save();
    ctx.beginPath();
    ctx.arc(avCx, avCy, avR, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    const avBg = ctx.createRadialGradient(avCx - 30, avCy - 35, 10, avCx, avCy, avR);
    avBg.addColorStop(0, '#2a1454');
    avBg.addColorStop(1, '#0d071b');
    ctx.fillStyle = avBg;
    ctx.fillRect(avCx - avR, avCy - avR, avR * 2, avR * 2);

    const rawName = nameInput ? nameInput.value.trim() : '';
    const initials = computeInitials(rawName);

    if (loadedAvatarImg && (loadedAvatarImg.naturalWidth || loadedAvatarImg.width)) {
      const iw = loadedAvatarImg.naturalWidth || loadedAvatarImg.width;
      const ih = loadedAvatarImg.naturalHeight || loadedAvatarImg.height;
      const diam = avR * 2;
      const scale = Math.max(diam / iw, diam / ih);
      const dw = iw * scale;
      const dh = ih * scale;
      ctx.drawImage(loadedAvatarImg, avCx - dw / 2, avCy - dh / 2, dw, dh);
    } else if (initials) {
      ctx.fillStyle = goldGrad;
      ctx.font = '800 68px "Playfair Display", Georgia, serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(initials, avCx, avCy + 3);
      ctx.textAlign = 'left';
    } else {
      // Gold portrait silhouette
      ctx.strokeStyle = '#fcd34d';
      ctx.lineWidth = 4.2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(avCx, avCy - 24, 30, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(avCx, avCy + 72, 62, Math.PI * 1.16, Math.PI * 1.84);
      ctx.stroke();
    }
    ctx.restore();

    // Main Gold Ring around Avatar
    ctx.save();
    ctx.shadowColor = 'rgba(245, 158, 11, 0.38)';
    ctx.shadowBlur = 18;
    ctx.strokeStyle = goldGrad;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(avCx, avCy, avR, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // 5. Personalized Member Details (Right of Avatar, clear of Reese portrait)
    const textX = 356;
    const maxTextW = 480;

    ctx.fillStyle = 'rgba(252, 211, 77, 0.76)';
    ctx.font = '700 14px "Outfit", -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText('OFFICIAL CARDHOLDER', textX, 268);

    const displayName = rawName ? rawName.toUpperCase() : 'YOUR NAME HERE';
    const fitted = wrapCardNameLines(ctx, displayName, maxTextW, [54, 46, 40, 34]);
    ctx.font = `900 ${fitted.size}px "Playfair Display", Georgia, serif`;
    const nameGrad = ctx.createLinearGradient(textX, 285, textX + maxTextW, 380);
    nameGrad.addColorStop(0, '#fff9db');
    nameGrad.addColorStop(0.42, '#fcd34d');
    nameGrad.addColorStop(0.78, '#f59e0b');
    nameGrad.addColorStop(1, '#fde68a');
    ctx.fillStyle = nameGrad;

    fitted.lines.forEach((line, idx) => {
      ctx.fillText(line, textX, 334 + idx * (fitted.size * 1.12));
    });

    const metaBaseY = fitted.lines.length > 1 ? 458 : 426;
    const rawCountry = countryInput ? countryInput.value.trim() : '';
    const displayCountry = (rawCountry ? rawCountry : 'WORLDWIDE').toUpperCase();

    // Country column
    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.font = '700 13px "Outfit", -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('COUNTRY', textX, metaBaseY);

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 22px "Outfit", -apple-system, BlinkMacSystemFont, sans-serif';
    let countryStr = displayCountry;
    while (countryStr.length > 3 && ctx.measureText(countryStr).width > 250) {
      countryStr = `${countryStr.slice(0, -2)}…`;
    }
    ctx.fillText(countryStr, textX, metaBaseY + 30);

    // Join Date column
    const joinColX = textX + 272;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.font = '700 13px "Outfit", -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('JOIN DATE', joinColX, metaBaseY);

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 22px "Outfit", -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(joinDate, joinColX, metaBaseY + 30);

    // 6. Footer: Unique Member ID + Official Verified Fan Seal
    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.fillRect(68, 594, W - 136, 1.2);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.font = '700 13px "Outfit", -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText('MEMBER ID', 68, 636);

    ctx.fillStyle = '#fcd34d';
    ctx.font = '800 26px "Outfit", -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(memberId, 68, 670);

    // Verified Fan Seal Pill
    const sealW = 336;
    const sealH = 52;
    const sealX = W - 68 - sealW;
    const sealY = 626;
    const sealFill = ctx.createLinearGradient(sealX, sealY, sealX + sealW, sealY + sealH);
    sealFill.addColorStop(0, 'rgba(14, 9, 30, 0.88)');
    sealFill.addColorStop(0.55, 'rgba(52, 20, 88, 0.84)');
    sealFill.addColorStop(1, 'rgba(42, 24, 16, 0.86)');

    roundRectPath(ctx, sealX, sealY, sealW, sealH, 26);
    ctx.fillStyle = sealFill;
    ctx.fill();
    ctx.strokeStyle = 'rgba(252, 211, 77, 0.65)';
    ctx.lineWidth = 1.6;
    ctx.stroke();

    ctx.fillStyle = '#fde68a';
    ctx.font = '800 15px "Outfit", -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✦ OFFICIAL VERIFIED FAN', sealX + sealW / 2, sealY + sealH / 2 + 1);

    ctx.restore();
    return canvas;
  }

  if (formEl) {
    formEl.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!validateRequiredFields()) return;

      updateCardPreview();
      persistMembership();

      const fullName = nameInput ? nameInput.value.trim() : '';
      const emailAddr = emailInput ? emailInput.value.trim() : '';
      const countryVal = (countryInput && countryInput.value.trim()) || 'Worldwide';
      const submittedAt = new Date().toISOString();

      const originalLabel = activateBtn ? activateBtn.textContent : '✦ Claim Founding Membership';
      if (activateBtn) {
        activateBtn.disabled = true;
        activateBtn.textContent = '✦ Claiming Membership…';
      }

      // Send real Founding Membership details to Zoho inbox + fan welcome email via Vercel Resend API
      const emailPromise = fetch('/api/sendEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from_name: fullName,
          from_email: emailAddr,
          country: countryVal,
          member_id: memberId,
          join_date: joinDate,
          timestamp: submittedAt,
          source: 'Official Fan Club — Claim Founding Membership (#fan-club)',
        }),
      })
        .then(async (res) => {
          const payload = await res.json().catch(() => ({}));
          if (!res.ok) {
            throw new Error(payload.error || `HTTP ${res.status}`);
          }
          console.log('✅ Founding Membership email delivered (200 OK):', payload);
          return { ok: true, status: res.status, payload };
        })
        .catch((err) => {
          console.warn('⚠️ Founding Membership email delivery warning:', err);
          return { ok: false, error: err?.message || String(err) };
        });

      try {
        const canvas = await renderFanCardCanvas();
        const safeSlug = (fullName || 'member')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '') || 'member';
        const filename = `Reese-Witherspoon-Official-Fan-Card-${safeSlug}-${memberId}.png`;

        const triggerDownload = (url, revokeAfter = false) => {
          const link = document.createElement('a');
          link.href = url;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          if (revokeAfter) {
            setTimeout(() => URL.revokeObjectURL(url), 2000);
          }
        };

        if (typeof canvas.toBlob === 'function') {
          canvas.toBlob((blob) => {
            if (blob) {
              triggerDownload(URL.createObjectURL(blob), true);
            } else {
              triggerDownload(canvas.toDataURL('image/png'));
            }
          }, 'image/png');
        } else {
          triggerDownload(canvas.toDataURL('image/png'));
        }

        const emailResult = await emailPromise;
        if (emailResult.ok) {
          showFeedback(
            `✦ Founding Membership confirmed! Official ID: ${memberId} — welcome email sent to ${emailAddr} & Fan Card PNG downloading.`,
            true
          );
          if (typeof window.showToast === 'function') {
            window.showToast('✦ Welcome, Founding Member! Confirmation email sent & Fan Card PNG downloaded.');
          }
        } else {
          showFeedback(`✦ Founding Membership confirmed! Official ID: ${memberId} — your Fan Card PNG is downloading.`, true);
          if (typeof window.showToast === 'function') {
            window.showToast('✦ Welcome, Founding Member! Your Official Fan Card PNG has downloaded.');
          }
        }
      } catch {
        const emailResult = await emailPromise;
        showFeedback(
          emailResult.ok
            ? `✦ Founding Membership confirmed! Official ID: ${memberId} — welcome email sent to ${emailAddr}.`
            : `✦ Founding Membership confirmed! Official ID: ${memberId}.`,
          true
        );
      } finally {
        if (activateBtn) {
          activateBtn.disabled = false;
          activateBtn.textContent = originalLabel;
        }
      }
    });
  }

  window.addEventListener('pageshow', syncSectionState);
})();

// ── Stats bar count-up (once on scroll into view, reduced-motion off) ──
(function initStatsCountUp() {
  const statsSection = document.getElementById('stats');
  if (!statsSection) return;

  const statEls = Array.from(statsSection.querySelectorAll('.stat-num[data-count]'));
  if (!statEls.length) return;

  const prefersReducedMotion = Boolean(
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  function setFinalValues() {
    statEls.forEach((el) => {
      const prefix = el.dataset.prefix || '';
      const target = parseInt(el.dataset.count, 10) || 0;
      const suffix = el.dataset.suffix || '';
      el.textContent = `${prefix}${target}${suffix}`;
    });
  }

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    setFinalValues();
    return;
  }

  let hasRun = false;
  const duration = 1200;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting || hasRun) return;
      hasRun = true;
      observer.disconnect();

      const startTime = performance.now();
      function tick(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);

        statEls.forEach((el) => {
          const prefix = el.dataset.prefix || '';
          const target = parseInt(el.dataset.count, 10) || 0;
          const suffix = el.dataset.suffix || '';
          const value = progress < 1 ? Math.round(target * eased) : target;
          el.textContent = `${prefix}${value}${suffix}`;
        });

        if (progress < 1) {
          requestAnimationFrame(tick);
        }
      }

      requestAnimationFrame(tick);
    });
  }, { threshold: 0.25 });

  observer.observe(statsSection);
})();
