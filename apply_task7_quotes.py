import re

# 1. Update explore.html
with open("explore.html", "r", encoding="utf-8") as f:
    html = f.read()

action_snippet = """        <div class="qb-actions">
          <button type="button" class="qb-btn qb-copy-btn" aria-label="Copy quote to clipboard">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            <span>Copy</span>
          </button>
          <button type="button" class="qb-btn qb-og-btn" aria-label="Generate and download 1200x630 OG quote card image">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
            <span>OG Card</span>
          </button>
          <a class="qb-btn qb-share-btn" target="_blank" rel="noopener noreferrer" aria-label="Share quote on X">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            <span>Share</span>
          </a>
        </div>"""

if "qb-actions" not in html:
    # Match each qb-source and append qb-actions right after it
    def add_actions(m):
        return m.group(1) + "\n" + action_snippet

    html = re.sub(r'(<div class="qb-source">[^<]+</div>)', add_actions, html)

    with open("explore.html", "w", encoding="utf-8") as f:
        f.write(html)
    print("Updated explore.html with quote action bars.")
else:
    print("explore.html already contains qb-actions.")

# 2. Update explore.css
with open("explore.css", "r", encoding="utf-8") as f:
    css = f.read()

quotes_css = """
/* Shareable Quote Cards (Task 7) */
.qb-card{display:flex;flex-direction:column;justify-content:space-between;position:relative;}
.qb-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:18px;padding-top:14px;border-top:1px solid rgba(255,255,255,.08);}
.qb-btn{display:inline-flex;align-items:center;gap:6px;padding:6px 12px;border-radius:100px;font-size:.74rem;font-weight:600;letter-spacing:.02em;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12);color:rgba(255,255,255,.85);cursor:pointer;text-decoration:none;transition:all .2s ease;font-family:inherit;}
.qb-btn:hover{background:rgba(236,72,153,.15);border-color:rgba(236,72,153,.4);color:#fff;transform:translateY(-1px);}
.qb-btn.copied{background:rgba(16,185,129,.2);border-color:rgba(16,185,129,.5);color:#34d399;}
.qb-toast{position:fixed;bottom:24px;right:24px;z-index:9999;background:rgba(15,10,26,.95);border:1px solid rgba(236,72,153,.4);backdrop-filter:blur(16px);color:#fff;padding:12px 20px;border-radius:100px;font-size:.84rem;font-weight:600;box-shadow:0 12px 40px rgba(0,0,0,.5);animation:fadeInUp .25s ease forwards;display:flex;align-items:center;gap:8px;}
"""

if ".qb-actions" not in css:
    css += quotes_css
    with open("explore.css", "w", encoding="utf-8") as f:
        f.write(css)
    print("Updated explore.css with qb-actions styles.")
else:
    print("explore.css already contains .qb-actions.")

# 3. Update explore.js with auto-generated OG quote card generator and share handlers
with open("explore.js", "r", encoding="utf-8") as f:
    js = f.read()

quotes_js = """
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
        const shareText = `"${cleanQuote}" — Reese Witherspoon (${sourceText.replace(/^—\s*/, '')})\n\nOfficial Source: ${pageUrl}`;
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
      const tweetText = encodeURIComponent(`"${cleanQuote}" — @ReeseW (${sourceText.replace(/^—\s*/, '')})`);
      const tweetUrl = encodeURIComponent(pageUrl);
      shareBtn.href = `https://twitter.com/intent/tweet?text=${tweetText}&url=${tweetUrl}`;
    }
  });
})();
"""

if "initQuoteCards" not in js:
    js += quotes_js
    with open("explore.js", "w", encoding="utf-8") as f:
        f.write(js)
    print("Updated explore.js with quote cards and OG image generator.")
else:
    print("explore.js already contains initQuoteCards.")
