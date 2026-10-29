/* ═══════════════════════════════════════════════════════════════
   films.js  —  Complete Filmography System  v3.0
   ═══════════════════════════════════════════════════════════════
   FEATURES:
   - 26 major films with real YouTube trailer IDs (fixed)
   - IMDb + Rotten Tomatoes ratings on every card & modal
   - Hover 2s on desktop → trailer preview in card (muted, loop)
   - Long-press 8s on mobile → trailer preview in card
   - SVG ring countdown shows progress before trailer loads
   - Click card → premium detail modal (synopsis, ratings, stats, trailer, where-to-watch)
   - Search by title, year, genre, role
   - Sort by Year ↑↓ | A–Z | Popularity
   - Genre filter pills with live counts
   - Load More pagination (15 per batch)
   - Keyboard Esc closes modal
═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ══════════════════════════════════════════════════════════
     1. COMPLETE FILMOGRAPHY DATA
        trailerYt: YouTube video ID for official trailer
        poster:    local asset path
        imdb:      IMDb score string e.g. "7.1"
        rt:        Rotten Tomatoes % string e.g. "69%"
        producers: key producers
        watch:     streaming/purchase links
  ══════════════════════════════════════════════════════════ */
  const FILMS = [
    {
      id: 'mitm1991',
      title: 'The Man in the Moon',
      year: 1991, popularity: 60,
      genres: ['drama', 'romance'],
      role: 'Dani Trant',
      award: null,
      imdb: '7.4', rt: '90%',
      synopsis: 'Reese\'s professional film debut at just 14. She plays Dani, a tomboyish teenager experiencing her first love during a summer in rural Louisiana. Critics immediately recognized an extraordinary natural talent that would define her career for decades. A moving, bittersweet coming-of-age story directed by Robert Mulligan.',
      director: 'Robert Mulligan',
      producers: 'Mark Rydell, Robert Mulligan',
      studio: 'MGM', boxOffice: '$4M',
      poster: 'posters/The Man in the Moon.jpg',
      posterFallback: 'reesewitherspoon/reesewitherspoon_1566064330_2112623179871571534_367315644.jpg',
      trailerYt: 'rNdaJ1MNU-0',
      watch: [{ name: 'Apple TV', url: 'https://tv.apple.com' }, { name: 'Amazon', url: 'https://www.amazon.com/primevideo' }]
    },
    {
      id: 'freeway1996',
      title: 'Freeway',
      year: 1996, popularity: 55,
      genres: ['thriller', 'drama'],
      role: 'Vanessa Lutz',
      award: null,
      imdb: '7.0', rt: '79%',
      synopsis: 'A darkly comic modern reworking of Little Red Riding Hood. Reese plays Vanessa Lutz, a teenage runaway headed to grandma\'s house who encounters a serial killer played by Kiefer Sutherland. A fierce, fearless early performance that showcased a raw dramatic range far beyond her years.',
      director: 'Matthew Bright',
      producers: 'Chris Hanley, Brad Wyman',
      studio: 'Republic Pictures', boxOffice: '$900K',
      poster: 'posters/Freeway.jpg',
      posterFallback: 'reesewitherspoon/reesewitherspoon_1569949265_2145212380576138250_367315644.jpg',
      trailerYt: 'C5aNEQ-xP48',
      watch: [{ name: 'Amazon', url: 'https://www.amazon.com/primevideo' }]
    },
    {
      id: 'fear1996',
      title: 'Fear',
      year: 1996, popularity: 70,
      genres: ['thriller'],
      role: 'Nicole Walker',
      award: null,
      imdb: '6.5', rt: '44%',
      synopsis: 'A psychological thriller alongside Mark Wahlberg. Reese plays Nicole Walker, a teenager whose seemingly perfect boyfriend reveals a terrifyingly obsessive and violent nature. A suspenseful domestic horror film that became a cult favourite of the era.',
      director: 'James Foley',
      producers: 'Brian Grazer',
      studio: 'Universal', boxOffice: '$19M',
      poster: 'posters/Fear.jpg',
      posterFallback: 'reesewitherspoon/reesewitherspoon_1570494823_2149788856226969089_367315644.jpg',
      trailerYt: 'p2AlffKozbg',
      watch: [{ name: 'Amazon', url: 'https://www.amazon.com/primevideo' }, { name: 'Peacock', url: 'https://peacocktv.com' }]
    },
    {
      id: 'pleasantville1998',
      title: 'Pleasantville',
      year: 1998, popularity: 80,
      genres: ['drama', 'comedy'],
      role: 'Jennifer',
      award: null,
      imdb: '7.5', rt: '86%',
      synopsis: 'Alongside Tobey Maguire in this acclaimed satirical fantasy. Two 1990s siblings are transported into a black-and-white 1950s TV sitcom, gradually bringing colour — and liberation — to its repressed world. A profound meditation on conformity, freedom, and change.',
      director: 'Gary Ross',
      producers: 'Jon Kilik, Robert J. Degus, Gary Ross',
      studio: 'New Line Cinema', boxOffice: '$50M',
      poster: 'posters/Pleasantville.jpg',
      posterFallback: 'reesewitherspoon/reesewitherspoon_1570494823_2149788856218626605_367315644.jpg',
      trailerYt: 'dSDm62Hmbf4',
      watch: [{ name: 'Netflix', url: 'https://netflix.com' }, { name: 'Amazon', url: 'https://www.amazon.com/primevideo' }]
    },
    {
      id: 'cruelintentions1999',
      title: 'Cruel Intentions',
      year: 1999, popularity: 85,
      genres: ['drama', 'romance', 'thriller'],
      role: 'Annette Hargrove',
      award: null,
      imdb: '6.9', rt: '52%',
      synopsis: 'A modern retelling of Les Liaisons Dangereuses set in privileged Manhattan prep-school society. Reese plays innocent Annette Hargrove opposite Ryan Phillippe and Sarah Michelle Gellar. A seductive, stylish teen drama that became an instant cult classic.',
      director: 'Roger Kumble',
      producers: 'Neal H. Moritz',
      studio: 'Columbia', boxOffice: '$76M',
      poster: 'posters/Cruel Intentions.jpg',
      posterFallback: 'reesewitherspoon/reesewitherspoon_1578012068_2212848069828112141_367315644.jpg',
      trailerYt: 'UzlKsS-IhEo',
      watch: [{ name: 'Hulu', url: 'https://hulu.com' }, { name: 'Amazon', url: 'https://www.amazon.com/primevideo' }]
    },
    {
      id: 'election1999',
      title: 'Election',
      year: 1999, popularity: 88,
      genres: ['comedy', 'drama'],
      role: 'Tracy Flick',
      award: '🌟 Golden Globe Nominated',
      imdb: '7.2', rt: '86%',
      synopsis: 'Her breakthrough performance as the fiercely ambitious Tracy Flick in Alexander Payne\'s dark political satire. Reese delivers a perfectly calibrated, fearlessly committed performance that became one of the defining comedic roles of the decade — and remains her personal favourite.',
      director: 'Alexander Payne',
      producers: 'Albert Berger, Ron Yerxa',
      studio: 'Paramount', boxOffice: '$17M',
      poster: 'https://image.tmdb.org/t/p/w780/jH0UVCJhVlJBzlU8xE9K95bT9mF.jpg',
      posterFallback: 'reesewitherspoon/reesewitherspoon_1577901649_2211921814496504844_367315644.jpg',
      trailerYt: 'tBgM_Kw6PSM',
      watch: [{ name: 'Netflix', url: 'https://netflix.com' }, { name: 'Paramount+', url: 'https://www.paramountplus.com' }]
    },
    {
      id: 'legallyblonde2001',
      title: 'Legally Blonde',
      year: 2001, popularity: 99,
      genres: ['comedy', 'romance'],
      role: 'Elle Woods',
      award: '🌟 Golden Globe Nominated',
      imdb: '6.9', rt: '69%',
      synopsis: 'Elle Woods — the role that changed everything. A feminist comedy that shattered stereotypes, earned Reese a Golden Globe nomination, and grossed $141M worldwide on an $18M budget. Reese\'s luminous, pitch-perfect performance transforms a fish-out-of-water premise into a genuine cultural phenomenon about intelligence and identity.',
      director: 'Robert Luketic',
      producers: 'Marc E. Platt, Ric Kidney',
      studio: 'MGM', boxOffice: '$141M',
      poster: 'posters/legally-blonde-movie-cover.webp',
      posterFallback: 'reesewitherspoon/reesewitherspoon_1578332631_2215537149606891783_367315644.jpg',
      trailerYt: 'Phm3lpdR3_g',
      watch: [{ name: 'Netflix', url: 'https://netflix.com' }, { name: 'HBO Max', url: 'https://hbomax.com' }, { name: 'Amazon', url: 'https://www.amazon.com/primevideo' }]
    },
    {
      id: 'sweethomealabama2002',
      title: 'Sweet Home Alabama',
      year: 2002, popularity: 92,
      genres: ['comedy', 'romance'],
      role: 'Melanie Carmichael',
      award: null,
      imdb: '6.7', rt: '39%',
      synopsis: 'A massive commercial hit grossing $180M+ worldwide. Reese plays a New York fashion designer who must return to her Alabama hometown — and reckon with her high school sweetheart — before her glamorous New York wedding. Charming, warm, and endlessly rewatchable.',
      director: 'Andy Tennant',
      producers: 'Neal H. Moritz, Stokley Chaffin',
      studio: 'Touchstone', boxOffice: '$180M',
      poster: 'posters/Sweet Home Alabama.jpg',
      posterFallback: 'reesewitherspoon/reesewitherspoon_1579536534_2225636222888326103_367315644.jpg',
      trailerYt: 'YMfEJ4N4PbA',
      watch: [{ name: 'Disney+', url: 'https://www.disneyplus.com' }, { name: 'Amazon', url: 'https://www.amazon.com/primevideo' }]
    },
    {
      id: 'lb22003',
      title: 'Legally Blonde 2',
      year: 2003, popularity: 80,
      genres: ['comedy'],
      role: 'Elle Woods',
      award: null,
      imdb: '5.5', rt: '39%',
      synopsis: 'Elle Woods heads to Washington D.C. to fight for animal rights legislation. Reese brings the same infectious energy and heart that made the first film a classic, delivering a warm performance in a cheerful, feel-good sequel. Grossed $124M worldwide.',
      director: 'Charles Herman-Wurmfeld',
      producers: 'Marc E. Platt',
      studio: 'MGM', boxOffice: '$124M',
      poster: 'posters/Legally Blonde 2.webp',
      posterFallback: 'reesewitherspoon/reesewitherspoon_1578332631_2215537149640688138_367315644.jpg',
      trailerYt: 'oqr9If4z2s4',
      watch: [{ name: 'Netflix', url: 'https://netflix.com' }, { name: 'Amazon', url: 'https://www.amazon.com/primevideo' }]
    },
    {
      id: 'walktheline2005',
      title: 'Walk the Line',
      year: 2005, popularity: 97,
      genres: ['drama'],
      role: 'June Carter Cash',
      award: '🏆 Academy Award Winner',
      imdb: '7.9', rt: '83%',
      synopsis: 'Her Oscar-winning portrayal of June Carter Cash alongside Joaquin Phoenix. Reese performed every note live, mastering a completely different singing style. Widely considered one of the finest biographical acting performances in cinema history — earning the Oscar, Golden Globe, and SAG Award in a clean sweep.',
      director: 'James Mangold',
      producers: 'James Mangold, Cathy Konrad, Judy Hofflund',
      studio: '20th Century Fox', boxOffice: '$186M',
      poster: 'posters/Walk the Line.jpg',
      posterFallback: 'reesewitherspoon/reesewitherspoon_1579536534_2225636222863195125_367315644.jpg',
      trailerYt: 'pbQ22zWPYbw',
      watch: [{ name: 'Disney+', url: 'https://www.disneyplus.com' }, { name: 'Hulu', url: 'https://hulu.com' }]
    },
    {
      id: 'justlikeheaven2005',
      title: 'Just Like Heaven',
      year: 2005, popularity: 72,
      genres: ['romance', 'comedy'],
      role: 'Elizabeth Masterson',
      award: null,
      imdb: '6.5', rt: '46%',
      synopsis: 'A romantic fantasy comedy alongside Mark Ruffalo. Reese plays a driven doctor whose spirit haunts her old apartment, falling for its charming new tenant. A light, sweet supernatural romance that showcases Reese\'s effortless comedic timing.',
      director: 'Mark Waters',
      producers: 'Laurie MacDonald, Walter F. Parkes',
      studio: 'DreamWorks', boxOffice: '$101M',
      poster: 'posters/Just Like Heaven.jpg',
      posterFallback: 'reesewitherspoon/reesewitherspoon_1579637641_2226484364902997486_367315644.jpg',
      trailerYt: 'hW2jkBQO_UE',
      watch: [{ name: 'Amazon', url: 'https://www.amazon.com/primevideo' }, { name: 'Apple TV', url: 'https://tv.apple.com' }]
    },
    {
      id: 'rendition2007',
      title: 'Rendition',
      year: 2007, popularity: 65,
      genres: ['thriller', 'drama'],
      role: 'Isabella El-Ibrahim',
      award: null,
      imdb: '6.6', rt: '47%',
      synopsis: 'A serious political thriller about extraordinary rendition. Reese plays a pregnant woman desperately fighting to free her Egyptian-American husband who has been mistakenly taken into CIA custody. A courageous dramatic turn in one of her most politically charged films.',
      director: 'Gavin Hood',
      producers: 'Steve Golin, Marcus Viscidi',
      studio: 'New Line Cinema', boxOffice: '$9M',
      poster: 'posters/Rendition.jpg',
      posterFallback: 'reesewitherspoon/reesewitherspoon_1580403467_2232908580825155190_367315644.jpg',
      trailerYt: '9vcFRfGdkz0',
      watch: [{ name: 'Amazon', url: 'https://www.amazon.com/primevideo' }]
    },
    {
      id: 'fourchristmases2008',
      title: 'Four Christmases',
      year: 2008, popularity: 75,
      genres: ['comedy', 'romance'],
      role: 'Kate',
      award: null,
      imdb: '5.8', rt: '25%',
      synopsis: 'A holiday comedy alongside Vince Vaughn. When a couple\'s exotic Christmas vacation is cancelled, they must visit all four of their divorced parents\' homes in one chaotic day. A festive, boisterous crowd-pleaser that became a seasonal fan favourite.',
      director: 'Seth Gordon',
      producers: 'Roger Birnbaum, Gary Barber, Jonathan Glickman',
      studio: 'Warner Bros.', boxOffice: '$163M',
      poster: 'posters/Four Christmases.jpg',
      posterFallback: 'reesewitherspoon/reesewitherspoon_1580579831_2234388033917028775_367315644.jpg',
      trailerYt: '6veo6Js7HUE',
      watch: [{ name: 'HBO Max', url: 'https://hbomax.com' }, { name: 'Amazon', url: 'https://www.amazon.com/primevideo' }]
    },
    {
      id: 'monstersvsaliens2009',
      title: 'Monsters vs. Aliens',
      year: 2009, popularity: 82,
      genres: ['animation', 'comedy'],
      role: 'Susan Murphy / Ginormica (voice)',
      award: null,
      imdb: '6.6', rt: '72%',
      synopsis: 'Reese voices Susan Murphy — an ordinary woman who transforms into a 49-foot giant after being struck by a meteorite on her wedding day and is recruited by the government to fight alien invaders. An animated smash grossing $381M worldwide, Reese\'s voice brings warmth and humour to a beloved character.',
      director: 'Rob Letterman & Conrad Vernon',
      producers: 'Lisa Stewart',
      studio: 'DreamWorks Animation', boxOffice: '$381M',
      poster: 'posters/Monsters vs. Aliens.jpg',
      posterFallback: 'reesewitherspoon/reesewitherspoon_1580749895_2235814635028670860_367315644.jpg',
      trailerYt: 'pA_O6AOHM5Q',
      watch: [{ name: 'Paramount+', url: 'https://www.paramountplus.com' }, { name: 'Amazon', url: 'https://www.amazon.com/primevideo' }]
    },
    {
      id: 'waterforelephants2011',
      title: 'Water for Elephants',
      year: 2011, popularity: 84,
      genres: ['drama', 'romance'],
      role: 'Marlena',
      award: null,
      imdb: '7.0', rt: '60%',
      synopsis: 'A Depression-era love story set inside the most dangerous place on earth — a traveling circus. Starring alongside Robert Pattinson and Christoph Waltz, adapted from Sara Gruen\'s beloved bestselling novel. Reese brings grace and vulnerability to the role of the star performer trapped in a dangerous marriage.',
      director: 'Francis Lawrence',
      producers: 'Gil Netter, Andrew R. Tennenbaum',
      studio: '20th Century Fox', boxOffice: '$117M',
      poster: 'posters/Water for Elephants.jpg',
      posterFallback: 'reesewitherspoon/reesewitherspoon_1581311973_2240529682690946700_367315644.jpg',
      trailerYt: 'RRKuS9z9-vA',
      watch: [{ name: 'Disney+', url: 'https://www.disneyplus.com' }, { name: 'Amazon', url: 'https://www.amazon.com/primevideo' }]
    },
    {
      id: 'thismeanwar2012',
      title: 'This Means War',
      year: 2012, popularity: 74,
      genres: ['comedy', 'romance', 'thriller'],
      role: 'Lauren Scott',
      award: null,
      imdb: '6.4', rt: '27%',
      synopsis: 'Two CIA agents and best friends discover they are dating the same woman. Alongside Chris Pine and Tom Hardy, Reese plays the unwitting woman at the centre of a high-tech spy love triangle. A fun, glossy action-comedy that became a Valentine\'s Day hit.',
      director: 'McG',
      producers: 'Will Smith, James Lassiter, Simon Kinberg',
      studio: '20th Century Fox', boxOffice: '$156M',
      poster: 'posters/This Means War.jpg',
      posterFallback: 'reesewitherspoon/reesewitherspoon_1583085205_2255404629749841480_367315644.jpg',
      trailerYt: 'oleuD8479uM',
      watch: [{ name: 'Disney+', url: 'https://www.disneyplus.com' }, { name: 'Amazon', url: 'https://www.amazon.com/primevideo' }]
    },
    {
      id: 'mud2012',
      title: 'Mud',
      year: 2012, popularity: 78,
      genres: ['drama'],
      role: 'Juniper',
      award: null,
      imdb: '7.4', rt: '98%',
      synopsis: 'Jeff Nichols\' critically-acclaimed Southern drama. Reese plays Juniper, the object of obsession for Matthew McConaughey\'s fugitive Mud — a complex, layered supporting performance in one of the decade\'s finest American films. Earned the top prize at Cannes.',
      director: 'Jeff Nichols',
      producers: 'Sarah Green, Lisa Maria Falcone',
      studio: 'Lionsgate', boxOffice: '$22M',
      poster: 'posters/Mud.jpg',
      posterFallback: 'reesewitherspoon/reesewitherspoon_1584388578_2266338114152750499_367315644.jpg',
      trailerYt: 'n0nSgQqvUOM',
      watch: [{ name: 'Amazon', url: 'https://www.amazon.com/primevideo' }, { name: 'Apple TV', url: 'https://tv.apple.com' }]
    },
    {
      id: 'goodlie2014',
      title: 'The Good Lie',
      year: 2014, popularity: 68,
      genres: ['drama'],
      role: 'Carrie Davis',
      award: null,
      imdb: '7.3', rt: '76%',
      synopsis: 'Reese plays an employment agency worker who helps Sudanese Lost Boys navigate American life in Kansas City. A moving, underrated dramatic performance in a deeply human story about trauma, resilience and community. One of her most genuine and underappreciated roles.',
      director: 'Philippe Falardeau',
      producers: 'Ron Howard, Brian Grazer, Karen Kehela Sherwood',
      studio: 'Warner Bros.', boxOffice: '$3M',
      poster: 'posters/The Good Lie.jpg',
      posterFallback: 'reesewitherspoon/reesewitherspoon_1585152312_2272744785955563172_367315644.jpg',
      trailerYt: 'O5mrvffezmM',
      watch: [{ name: 'Amazon', url: 'https://www.amazon.com/primevideo' }, { name: 'Hulu', url: 'https://hulu.com' }]
    },
    {
      id: 'wild2014',
      title: 'Wild',
      year: 2014, popularity: 91,
      genres: ['drama'],
      role: 'Cheryl Strayed',
      award: '🏆 Oscar Nominated · Producer',
      imdb: '7.1', rt: '90%',
      synopsis: 'Based on Cheryl Strayed\'s memoir of her solo 1,100-mile trek along the Pacific Crest Trail following personal tragedy. Reese both starred and produced through Pacific Standard, delivering a raw, physically demanding performance that earned her second Academy Award nomination and universal critical acclaim.',
      director: 'Jean-Marc Vallée',
      producers: 'Reese Witherspoon, Bruna Papandrea',
      studio: 'Fox Searchlight', boxOffice: '$52M',
      poster: 'posters/WILD_movie_poster.webp',
      posterFallback: 'reesewitherspoon/reesewitherspoon_1583010420_2254777285947219792_367315644.jpg',
      trailerYt: 'tn2-GSqPyl0',
      watch: [{ name: 'Hulu', url: 'https://hulu.com' }, { name: 'Amazon', url: 'https://www.amazon.com/primevideo' }]
    },
    {
      id: 'hotpursuit2015',
      title: 'Hot Pursuit',
      year: 2015, popularity: 65,
      genres: ['comedy'],
      role: 'Cooper',
      award: null,
      imdb: '5.5', rt: '8%',
      synopsis: 'A comedy action road movie alongside Sofía Vergara. Reese plays an uptight, by-the-book cop tasked with transporting a cartel boss\'s widow to Dallas — and chaos ensues at every turn. An energetic, fast-paced comedy that works on the chemistry of its two leads.',
      director: 'Anne Fletcher',
      producers: 'Dana Fox, Bruna Papandrea',
      studio: 'Warner Bros.', boxOffice: '$48M',
      poster: 'posters/Hot Pursuit.jpg',
      posterFallback: 'reesewitherspoon/reesewitherspoon_1585327488_2274214266594849844_367315644.jpg',
      trailerYt: '6qBRBS8pL-w',
      watch: [{ name: 'HBO Max', url: 'https://hbomax.com' }, { name: 'Amazon', url: 'https://www.amazon.com/primevideo' }]
    },
    {
      id: 'sing2016',
      title: 'Sing',
      year: 2016, popularity: 89,
      genres: ['animation', 'comedy'],
      role: 'Rosita (voice)',
      award: null,
      imdb: '7.1', rt: '72%',
      synopsis: 'Reese voices Rosita, an overworked mother pig who rediscovers her passion by entering a singing competition in this smash animated hit from Illumination. Grossed $634M worldwide. Reese\'s energetic, heartfelt voice performance became an instant fan favourite.',
      director: 'Garth Jennings',
      producers: 'Chris Meledandri, Janet Healy',
      studio: 'Universal / Illumination', boxOffice: '$634M',
      poster: 'posters/Sing.jpg',
      posterFallback: 'reesewitherspoon/reesewitherspoon_1586621038_2285065347100862560_367315644.jpg',
      trailerYt: 'SH5N44b5Rrw',
      watch: [{ name: 'Netflix', url: 'https://netflix.com' }, { name: 'Peacock', url: 'https://peacocktv.com' }]
    },
    {
      id: 'homeagain2017',
      title: 'Home Again',
      year: 2017, popularity: 66,
      genres: ['comedy', 'romance'],
      role: 'Alice Kinney',
      award: null,
      imdb: '5.9', rt: '33%',
      synopsis: 'Reese plays Alice Kinney, a newly separated woman who lets three young aspiring filmmakers move into her guesthouse in this breezy romantic comedy set against a sun-drenched Los Angeles backdrop. Also executive produced by Reese, it showcases her gift for grounded, relatable comedy.',
      director: 'Hallie Meyers-Shyer',
      producers: 'Erika Olde, Nancy Meyers',
      studio: 'Open Road Films', boxOffice: '$37M',
      poster: 'posters/Home Again.jpg',
      posterFallback: 'reesewitherspoon/reesewitherspoon_1591975593_2329982613332201438_367315644.jpg',
      trailerYt: 'y-oFOgFB2uM',
      watch: [{ name: 'Netflix', url: 'https://netflix.com' }, { name: 'Amazon', url: 'https://www.amazon.com/primevideo' }]
    },
    {
      id: 'wrinkleintime2018',
      title: 'A Wrinkle in Time',
      year: 2018, popularity: 75,
      genres: ['drama', 'animation'],
      role: 'Mrs. Whatsit',
      award: null,
      imdb: '5.9', rt: '42%',
      synopsis: 'Ava DuVernay\'s visually stunning Disney adaptation of the classic Madeleine L\'Engle novel. Reese plays the shape-shifting, wise Mrs. Whatsit alongside Oprah Winfrey and Mindy Kaling in this cosmic, magical adventure about light triumphing over darkness.',
      director: 'Ava DuVernay',
      producers: 'Jim Whitaker, Catherine Hand',
      studio: 'Disney', boxOffice: '$132M',
      poster: 'posters/A Wrinkle in Time.jpg',
      posterFallback: 'reesewitherspoon/reesewitherspoon_1594670220_2352586780433406159_367315644.jpg',
      trailerYt: 'mTY6syC5ZBg',
      watch: [{ name: 'Disney+', url: 'https://www.disneyplus.com' }]
    },
    {
      id: 'sing22021',
      title: 'Sing 2',
      year: 2021, popularity: 88,
      genres: ['animation', 'comedy'],
      role: 'Rosita (voice)',
      award: null,
      imdb: '7.3', rt: '73%',
      synopsis: 'The spectacular sequel. Buster Moon\'s company attempts to put on an ambitious show at a glitzy entertainment resort, recruiting the reclusive rock legend Clay Calloway. Grossed $408M worldwide. Reese reprises her fan-favourite voice role with even more heart and humour.',
      director: 'Garth Jennings',
      producers: 'Chris Meledandri, Janet Healy',
      studio: 'Universal / Illumination', boxOffice: '$408M',
      poster: 'posters/Sing 2.jpg',
      posterFallback: 'reesewitherspoon/reesewitherspoon_1596300723_2366264433493222874_367315644.jpg',
      trailerYt: 'EPZu5MA2uqI',
      watch: [{ name: 'Peacock', url: 'https://peacocktv.com' }, { name: 'Amazon', url: 'https://www.amazon.com/primevideo' }]
    },
    {
      id: 'yourplacormine2023',
      title: 'Your Place or Mine',
      year: 2023, popularity: 76,
      genres: ['comedy', 'romance'],
      role: 'Debbie',
      award: null,
      imdb: '5.8', rt: '30%',
      synopsis: 'Netflix\'s romantic comedy starring Reese and Ashton Kutcher as lifelong best friends who swap homes for a week and discover that the life they\'ve each always wanted might be closer than they think. A warm, nostalgic film that leans into the chemistry of its two charming leads.',
      director: 'Aline Brosh McKenna',
      producers: 'Reese Witherspoon, Lauren Neustadter',
      studio: 'Netflix', boxOffice: 'Netflix',
      poster: 'posters/Your Place or Mine.jpg',
      posterFallback: 'reesewitherspoon/reesewitherspoon_1597676628_2377806355974102153_367315644.jpg',
      trailerYt: '5JyfgkPMXk0',
      watch: [{ name: 'Netflix', url: 'https://netflix.com' }]
    },
    {
      id: 'lb32025',
      title: 'Legally Blonde 3',
      year: 2025, popularity: 100,
      genres: ['comedy'],
      role: 'Elle Woods',
      award: '⭐ Most Anticipated 2025',
      imdb: 'TBA', rt: 'TBA',
      synopsis: 'Elle Woods is BACK. Amazon Prime Video\'s most anticipated sequel officially announced with Reese Witherspoon returning to her iconic role. Elle returns to Harvard Law two decades later — wiser, fiercer, and pinkier than ever. Production underway. The world has been waiting.',
      director: 'TBA',
      producers: 'Reese Witherspoon, Marc E. Platt',
      studio: 'Amazon Prime Video / MGM', boxOffice: 'Coming 2025',
      poster: 'posters/Legally Blonde 3.jpeg',
      posterFallback: 'reesewitherspoon/primevideo_1778080751_3891145722754448008_1684102154.jpg',
      trailerYt: 'Phm3lpdR3_g',
      watch: [{ name: 'Amazon Prime', url: 'https://www.amazon.com/primevideo' }]
    },
  ];

  /* ══════════════════════════════════════════════════════════
     2. STATE
  ══════════════════════════════════════════════════════════ */
  const PAGE_SIZE   = 15;
  let activeGenre   = 'all';
  let searchQuery   = '';
  let sortMode      = 'year-asc';
  let visibleCount  = PAGE_SIZE;



  /* ══════════════════════════════════════════════════════════
     3. FILTER + SORT
  ══════════════════════════════════════════════════════════ */
  function getFiltered() {
    let list = FILMS.filter(f => {
      const genreMatch = activeGenre === 'all' ||
        (activeGenre === 'award' ? !!f.award : f.genres.includes(activeGenre));
      if (!genreMatch) return false;
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return f.title.toLowerCase().includes(q) ||
             String(f.year).includes(q) ||
             (f.role || '').toLowerCase().includes(q) ||
             f.genres.join(' ').includes(q) ||
             (f.director || '').toLowerCase().includes(q) ||
             (f.synopsis || '').toLowerCase().includes(q);
    });
    if (sortMode === 'year-asc')  list.sort((a,b) => a.year - b.year);
    if (sortMode === 'year-desc') list.sort((a,b) => b.year - a.year);
    if (sortMode === 'alpha')     list.sort((a,b) => a.title.localeCompare(b.title));
    if (sortMode === 'popular')   list.sort((a,b) => b.popularity - a.popularity);
    return list;
  }

  /* ══════════════════════════════════════════════════════════
     4. UPDATE PILL COUNTS
  ══════════════════════════════════════════════════════════ */
  function updateCounts() {
    const genres = ['all','comedy','drama','romance','thriller','animation','award'];
    genres.forEach(g => {
      const el = document.getElementById(`fpc-${g}`);
      if (!el) return;
      el.textContent = g === 'all' ? FILMS.length :
                       g === 'award' ? FILMS.filter(f => !!f.award).length :
                       FILMS.filter(f => f.genres.includes(g)).length;
    });
  }

  /* ══════════════════════════════════════════════════════════
     5. RATING HELPERS
  ══════════════════════════════════════════════════════════ */
  function rtColor(rt) {
    if (!rt || rt === 'TBA') return 'var(--muted)';
    const n = parseInt(rt);
    if (n >= 75) return '#21d07a';
    if (n >= 60) return '#f5c518';
    return '#f44336';
  }

  function imdbColor(imdb) {
    if (!imdb || imdb === 'TBA') return 'var(--muted)';
    const n = parseFloat(imdb);
    if (n >= 7.5) return '#f5c518';
    if (n >= 6.0) return '#e2a800';
    return 'var(--muted)';
  }

  function ratingBadgesHTML(film) {
    const imdbBadge = film.imdb ? `
      <span class="fg-rating-badge fg-rating-imdb" title="IMDb Rating">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="#f5c518" style="flex-shrink:0"><rect width="24" height="24" rx="4"/><text x="12" y="17" text-anchor="middle" font-size="11" font-weight="900" fill="#000" font-family="Arial">IMDb</text></svg>
        <span style="color:${imdbColor(film.imdb)}">${film.imdb}</span>
      </span>` : '';
    const rtBadge = film.rt ? `
      <span class="fg-rating-badge fg-rating-rt" title="Rotten Tomatoes">
        <span style="font-size:.7rem">🍅</span>
        <span style="color:${rtColor(film.rt)}">${film.rt}</span>
      </span>` : '';
    return imdbBadge + rtBadge;
  }

  /* ══════════════════════════════════════════════════════════
     6. BUILD CARD
  ══════════════════════════════════════════════════════════ */
  function buildCard(film, delay) {
    const card = document.createElement('div');
    card.className = 'fg-card';
    card.dataset.id = film.id;
    card.style.animationDelay = `${delay * 0.04}s`;
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `${film.title} (${film.year})`);

    card.innerHTML = `
      <div class="fg-poster-wrap">
        <img class="fg-poster-img" src="${film.poster}" alt="${film.title} (${film.year}) — Reese Witherspoon official movie poster" loading="lazy"
             onerror="this.src='${film.posterFallback || ''}';this.onerror=null;"/>

        ${film.award ? `<div class="fg-award-badge">${film.award.split(' ').slice(0,2).join(' ')}</div>` : ''}

        <!-- Rating overlay -->
        <div class="fg-card-ratings">${ratingBadgesHTML(film)}</div>
      </div>

      <div class="fg-card-info">
        <div class="fg-card-year">${film.year}</div>
        <div class="fg-card-title">${film.title}</div>
        ${film.role ? `<div class="fg-card-role">as ${film.role}</div>` : ''}
      </div>`;

    /* ── Click → modal ──────────────────────────────────── */
    card.addEventListener('click', () => openModal(film.id));
    card.addEventListener('keydown', e => { if (e.key === 'Enter') openModal(film.id); });

    return card;
  }



  /* ══════════════════════════════════════════════════════════
     7. RENDER GRID
  ══════════════════════════════════════════════════════════ */
  function renderGrid() {
    const grid   = document.getElementById('fgGrid');
    const empty  = document.getElementById('fg-empty');
    const info   = document.getElementById('fg-info');
    const lmWrap = document.getElementById('fg-load-wrap');
    const lmBtn  = document.getElementById('fg-load-btn');
    const lmInfo = document.getElementById('fg-load-info');
    if (!grid) return;

    if (grid && grid.children.length > 0 && !grid.dataset.hydrated && activeGenre === 'all' && !searchQuery && sortMode === 'year-asc') {
      grid.dataset.hydrated = 'true';
      Array.from(grid.children).forEach(card => {
        const id = card.dataset.id;
        if (!id) return;
        card.addEventListener('click', () => openModal(id));
        card.addEventListener('keydown', e => { if (e.key === 'Enter') openModal(id); });
      });
      const filtered = getFiltered();
      const batch    = filtered.slice(0, visibleCount);
      const remaining = filtered.length - batch.length;
      if (lmWrap) {
        if (remaining > 0) {
          lmWrap.style.display = 'flex';
          if (lmBtn) { lmBtn.disabled = false; lmBtn.innerHTML = `Show ${Math.min(remaining, PAGE_SIZE)} More Films <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path d="M12 5v14M5 12l7 7 7-7"/></svg>`; }
          if (lmInfo) lmInfo.textContent = `Showing ${batch.length} of ${filtered.length} films`;
        } else {
          lmWrap.style.display = 'none';
        }
      }
      if (info) {
        info.textContent = `Showing ${Math.min(batch.length, filtered.length)} of ${filtered.length} films`;
      }
      return;
    }

    grid.innerHTML = '';

    const filtered = getFiltered();
    const batch    = filtered.slice(0, visibleCount);

    if (!filtered.length) {
      if (empty) empty.style.display = 'block';
      if (lmWrap) lmWrap.style.display = 'none';
      if (info) info.textContent = 'No films found.';
      return;
    }
    if (empty) empty.style.display = 'none';
    batch.forEach((f, i) => grid.appendChild(buildCard(f, i)));

    const remaining = filtered.length - batch.length;
    if (lmWrap) {
      if (remaining > 0) {
        lmWrap.style.display = 'flex';
        if (lmBtn) { lmBtn.disabled = false; lmBtn.innerHTML = `Show ${Math.min(remaining, PAGE_SIZE)} More Films <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path d="M12 5v14M5 12l7 7 7-7"/></svg>`; }
        if (lmInfo) lmInfo.textContent = `Showing ${batch.length} of ${filtered.length} films`;
      } else {
        lmWrap.style.display = 'none';
      }
    }
    if (info) {
      info.textContent = searchQuery
        ? `${filtered.length} film${filtered.length !== 1 ? 's' : ''} matching "${searchQuery}"`
        : `${Math.min(batch.length, filtered.length)} of ${filtered.length} films`;
    }
  }

  /* ══════════════════════════════════════════════════════════
     8. PREMIUM MODAL
  ══════════════════════════════════════════════════════════ */
  function openModal(id) {
    const film = FILMS.find(f => f.id === id);
    if (!film) return;



    // Poster
    const posterImg = document.getElementById('fm-poster-img');
    if (posterImg) {
      posterImg.src = film.poster;
      posterImg.alt = film.title + ' — Reese Witherspoon official movie poster';
      posterImg.onerror = function() { this.src = film.posterFallback || ''; this.onerror = null; };
    }

    // Badges
    const badges = document.getElementById('fm-badges');
    if (badges) {
      badges.innerHTML = '';
      film.genres.forEach(g => {
        const b = document.createElement('span');
        b.className = 'fm-badge-pill fm-badge-genre';
        b.textContent = g.charAt(0).toUpperCase() + g.slice(1);
        badges.appendChild(b);
      });
      if (film.award) {
        const a = document.createElement('span');
        a.className = 'fm-badge-pill fm-badge-award';
        a.textContent = film.award;
        badges.appendChild(a);
      }
    }

    // Title / year / role / synopsis
    const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    setEl('fm-modal-title', film.title);
    setEl('fm-modal-year',  `${film.year} · ${film.director || 'TBA'}`);
    setEl('fm-role-line',   film.role ? `Role: ${film.role}` : '');
    setEl('fm-synopsis',    film.synopsis);

    // Ratings row
    const ratingsRow = document.getElementById('fm-ratings-row');
    if (ratingsRow) {
      const imdbScore = film.imdb || 'N/A';
      const rtScore   = film.rt   || 'N/A';
      ratingsRow.innerHTML = `
        <div class="fm-rating-chip fm-rating-imdb-chip">
          <span class="fm-rating-label">IMDb</span>
          <span class="fm-rating-score" style="color:${imdbColor(film.imdb)}">${imdbScore}</span>
          <span class="fm-rating-max">/10</span>
        </div>
        <div class="fm-rating-chip fm-rating-rt-chip">
          <span class="fm-rating-label">🍅 Rotten Tomatoes</span>
          <span class="fm-rating-score" style="color:${rtColor(film.rt)}">${rtScore}</span>
        </div>
        <div class="fm-rating-chip fm-rating-pop-chip">
          <span class="fm-rating-label">Popularity</span>
          <span class="fm-rating-score" style="color:var(--purple-2)">${film.popularity}%</span>
        </div>`;
    }

    // Stats
    const stats = document.getElementById('fm-stats');
    if (stats) {
      stats.innerHTML = [
        ['Director',   film.director  || 'TBA'],
        ['Producers',  film.producers || '—'],
        ['Studio',     film.studio    || '—'],
        ['Box Office', film.boxOffice || '—'],
      ].map(([l,v]) => `<div class="fm-stat-item"><div class="fm-stat-label">${l}</div><div class="fm-stat-val">${v}</div></div>`).join('');
    }

    // Trailer embed — set src blank first so it reloads cleanly
    const te = document.getElementById('fm-trailer-embed');
    if (te) {
      te.innerHTML = '';
      if (film.trailerYt) {
        te.innerHTML = `<iframe src="about:blank" data-src="https://www.youtube-nocookie.com/embed/${film.trailerYt}?rel=0&modestbranding=1&iv_load_policy=3" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen title="${film.title} official trailer"></iframe>`;
      } else {
        te.innerHTML = '<div class="fm-no-trailer">No trailer available.</div>';
      }
    }

    // Watch Trailer button
    const trailerBtn = document.getElementById('fm-trailer-btn');
    if (trailerBtn) {
      if (film.trailerYt) {
        trailerBtn.href = `https://www.youtube.com/watch?v=${film.trailerYt}`;
        trailerBtn.style.display = 'inline-flex';
      } else {
        trailerBtn.style.display = 'none';
      }
    }

    // Where to Watch
    const watchLinks = document.getElementById('fm-watch-links');
    if (watchLinks) {
      watchLinks.innerHTML = (film.watch || []).map(w =>
        `<a class="fm-watch-link" href="${w.url}" target="_blank" rel="noopener">${w.name} →</a>`
      ).join('');
    }

    const modal = document.getElementById('film-modal');
    if (modal) {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
      // Lazy-load trailer iframe on open
      setTimeout(() => {
        const iframe = te ? te.querySelector('iframe[data-src]') : null;
        if (iframe) { iframe.src = iframe.dataset.src; }
      }, 200);
    }
  }

  function closeModal() {
    const modal = document.getElementById('film-modal');
    if (!modal) return;
    const te = document.getElementById('fm-trailer-embed');
    if (te) te.innerHTML = '';
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  /* ══════════════════════════════════════════════════════════
     9. INIT CONTROLS
  ══════════════════════════════════════════════════════════ */
  function initSearch() {
    const input = document.getElementById('fg-search');
    const clear = document.getElementById('fg-search-clear');
    if (!input) return;
    input.addEventListener('input', () => {
      searchQuery  = input.value.trim();
      visibleCount = PAGE_SIZE;
      if (clear) clear.classList.toggle('visible', searchQuery.length > 0);
      renderGrid();
    });
    if (clear) clear.addEventListener('click', () => {
      input.value = ''; searchQuery = '';
      clear.classList.remove('visible');
      renderGrid(); input.focus();
    });
  }

  function initSort() {
    const sel = document.getElementById('fg-sort');
    if (!sel) return;
    sel.addEventListener('change', () => {
      sortMode     = sel.value;
      visibleCount = PAGE_SIZE;
      renderGrid();
    });
  }

  function initFilters() {
    document.querySelectorAll('.fg-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.fg-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeGenre  = btn.dataset.genre;
        visibleCount = PAGE_SIZE;
        renderGrid();
      });
    });
  }

  function initLoadMore() {
    const btn = document.getElementById('fg-load-btn');
    if (!btn) return;
    btn.addEventListener('click', () => {
      visibleCount += PAGE_SIZE;
      renderGrid();
    });
  }

  function initModal() {
    document.getElementById('fm-close')?.addEventListener('click', closeModal);
    document.getElementById('fm-backdrop')?.addEventListener('click', closeModal);
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && document.getElementById('film-modal')?.classList.contains('open')) {
        closeModal();
      }
    });
  }

  function initOldFilterBtns() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const f = btn.dataset.filter;
        document.querySelectorAll('#filmsGrid .film-card, #filmsGrid + .films-grid .film-card').forEach(card => {
          const cat = (card.dataset.category || '');
          card.style.display = (f === 'all' || cat.includes(f)) ? '' : 'none';
        });
      });
    });
  }

  /* ══════════════════════════════════════════════════════════
     10. INIT
  ══════════════════════════════════════════════════════════ */
  function init() {
    updateCounts();
    initSearch();
    initSort();
    initFilters();
    initLoadMore();
    initModal();
    initOldFilterBtns();
    renderGrid();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

})();

/* ══════════════════════════════════════════════════════════════
   TRAILERS SHOWCASE — Click-to-Play + Filter Tabs
   (outside the main IIFE so it runs independently)
══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  function initTrailerShowcase() {
    document.querySelectorAll('.trailer-thumb').forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        const ytId  = thumb.dataset.ytid;
        if (!ytId) return;

        const wrap   = thumb.closest('.trailer-embed-wrap');
        if (!wrap) return;

        const iframe = wrap.querySelector('.trailer-iframe');
        if (!iframe) return;

        if (!iframe.classList.contains('hidden')) return;

        iframe.src = 'https://www.youtube-nocookie.com/embed/' + ytId +
          '?autoplay=1&rel=0&modestbranding=1&iv_load_policy=3';
        iframe.classList.remove('hidden');

        thumb.style.transition   = 'opacity .35s';
        thumb.style.opacity      = '0';
        thumb.style.pointerEvents = 'none';
      });
    });

    const tabs  = document.querySelectorAll('#trailerTabs .reel-tab');
    const cards = document.querySelectorAll('#trailersGrid .trailer-card');

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');

        const filter = tab.dataset.tfilter || 'all';

        cards.forEach(function (card) {
          const cats = (card.dataset.tcat || '').split(' ');
          const show = filter === 'all' || cats.includes(filter);

          if (show) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
            const iframe = card.querySelector('.trailer-iframe');
            const thumb  = card.querySelector('.trailer-thumb');
            if (iframe) { iframe.src = ''; iframe.classList.add('hidden'); }
            if (thumb)  { thumb.style.opacity = '1'; thumb.style.pointerEvents = ''; }
          }
        });
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTrailerShowcase);
  } else {
    initTrailerShowcase();
  }
})();
