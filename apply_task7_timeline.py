import re

with open("about.html", "r", encoding="utf-8") as f:
    content = f.read()

# Map year to era and chapter link
era_map = {
    "1976": ("early-breakthrough", "career/early-breakthrough.html", "Explore 1991–1998 Early Breakthrough &rarr;"),
    "1991": ("early-breakthrough", "career/early-breakthrough.html", "Explore 1991–1998 Early Breakthrough &rarr;"),
    "1999": ("iconic-stardom", "career/iconic-stardom.html", "Explore 1999–2004 Iconic Stardom &rarr;"),
    "2001": ("iconic-stardom", "career/iconic-stardom.html", "Explore 1999–2004 Iconic Stardom &rarr;"),
    "2006": ("oscar-acclaim", "career/oscar-acclaim.html", "Explore 2005–2015 Oscar & Acclaim &rarr;"),
    "2012": ("oscar-acclaim", "career/oscar-acclaim.html", "Explore 2005–2015 Oscar & Acclaim &rarr;"),
    "2014": ("oscar-acclaim", "career/oscar-acclaim.html", "Explore 2005–2015 Oscar & Acclaim &rarr;"),
    "2016": ("producer-mogul", "career/producer-mogul.html", "Explore 2016–Present Producer & Mogul &rarr;"),
    "2017": ("producer-mogul", "career/producer-mogul.html", "Explore 2016–Present Producer & Mogul &rarr;"),
    "2019": ("producer-mogul", "career/producer-mogul.html", "Explore 2016–Present Producer & Mogul &rarr;"),
    "2021": ("producer-mogul", "career/producer-mogul.html", "Explore 2016–Present Producer & Mogul &rarr;"),
    "2026": ("producer-mogul", "career/producer-mogul.html", "Explore 2016–Present Producer & Mogul &rarr;")
}

controls_html = """    <!-- Interactive Timeline Era Controls (Task 7) -->
    <div class="timeline-controls" data-reveal>
      <div class="ti-filters" role="group" aria-label="Career Era Filters" id="timelineFilters">
        <button class="ti-pill active" data-era="all" aria-pressed="true">All Eras <span class="ti-pill-count">12</span></button>
        <button class="ti-pill" data-era="early-breakthrough" aria-pressed="false">1976–1998 Breakthrough <span class="ti-pill-count">2</span></button>
        <button class="ti-pill" data-era="iconic-stardom" aria-pressed="false">1999–2004 Iconic Stardom <span class="ti-pill-count">2</span></button>
        <button class="ti-pill" data-era="oscar-acclaim" aria-pressed="false">2005–2015 Oscar &amp; Acclaim <span class="ti-pill-count">3</span></button>
        <button class="ti-pill" data-era="producer-mogul" aria-pressed="false">2016–Present Mogul &amp; Producer <span class="ti-pill-count">5</span></button>
      </div>
      <div class="ti-era-meta" id="timelineStatus" aria-live="polite">Showing all 12 major milestones across Reese's 30-year career.</div>
    </div>"""

# Insert controls before <div class="timeline-wrap">
if "timeline-controls" not in content:
    content = content.replace('<div class="timeline-wrap">', controls_html + '\n    <div class="timeline-wrap" id="timelineWrap">')

# Update timeline-item tags and insert link inside ti-card if not already present
for year, (era, link, label) in era_map.items():
    pattern = rf'(<div class="timeline-item(?:[^"]*)"[^>]*>\s*<div class="ti-year">{year}</div>.*?<div class="ti-card glass">.*?)(\s*</div>\s*</div>)'
    
    def replacer(m):
        block = m.group(1)
        closing = m.group(2)
        # Ensure data-era is on the root item
        if f'data-era="{era}"' not in block:
            block = block.replace('<div class="timeline-item', f'<div class="timeline-item" data-era="{era}"')
        # Ensure link is in ti-card
        if link not in block:
            block += f'\n          <div><a href="{link}" class="ti-era-link">{label}</a></div>'
        return block + closing

    content = re.sub(pattern, replacer, content, flags=re.DOTALL)

with open("about.html", "w", encoding="utf-8") as f:
    f.write(content)

print("Updated about.html with interactive timeline controls and era links.")
