/* ═══════════════════════════════════════════════════════════════
   gallery.js  —  Complete Gallery Data + Interactions
   ═══════════════════════════════════════════════════════════════
   - 70+ richly-categorised photos using local assets
   - Category filters with live counts
   - Search/keyword filtering
   - Masonry AND even-grid view toggle
   - "Load More" pagination (12 per batch)
   - Enhanced lightbox: title, description, prev/next,
     thumbnail strip, download, Pinterest share, Web Share API
   - URL ?filter=category deep-linking
   - Keyboard navigation (← → Esc)
═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ══════════════════════════════════════════════════════════
     1. GALLERY DATA — 70+ curated photos across 6 categories
  ══════════════════════════════════════════════════════════ */
  const GALLERY = [

    /* ── RED CARPET & EVENTS ─────────────────────────────── */
    { id:'rc01', cat:'redcarpet', catLabel:'🌟 Red Carpet', img:'reesewitherspoon/reesewitherspoon_1579478144_2225146406606465542_367315644.jpg', title:'Academy Awards 2006', desc:'Reese wins Best Actress for Walk the Line — her iconic Oscar moment in a champagne gown by Christian Dior.', tags:'oscars academy awards 2006 gown elegant ceremony' },
    { id:'rc02', cat:'redcarpet', catLabel:'🌟 Red Carpet', img:'reesewitherspoon/people_1752166095_3673757936850124429_28759374.jpg', title:'People\'s 100 Most Beautiful', desc:'Gracing the cover of People Magazine\'s annual beauty issue.', tags:'people magazine beautiful 2024 cover portrait' },
    { id:'rc03', cat:'redcarpet', catLabel:'🌟 Red Carpet', img:'reesewitherspoon/reesewitherspoon_1590170650_2314841648514737315_367315644.jpg', title:'Emmy Awards — Big Little Lies', desc:'Reese attends the Emmy Awards for Big Little Lies alongside Nicole Kidman.', tags:'emmys emmy awards big little lies HBO premiere' },
    { id:'rc04', cat:'redcarpet', catLabel:'🌟 Red Carpet', img:'reesewitherspoon/reesewitherspoon_1779634961_3904183025843630670_367315644.jpg', title:'Spring 2025 Event', desc:'Making a stunning entrance at a 2025 spring event in Los Angeles.', tags:'2025 event premiere red carpet LA Los Angeles' },
    { id:'rc05', cat:'redcarpet', catLabel:'🌟 Red Carpet', img:'reesewitherspoon/reesewitherspoon_1779634961_3904183027030585442_367315644.jpg', title:'Spring 2025 — Full Look', desc:'A full-length editorial shot from the same Spring 2025 appearance.', tags:'2025 event gown full length editorial' },
    { id:'rc06', cat:'redcarpet', catLabel:'🌟 Red Carpet', img:'reesewitherspoon/reesewitherspoon_1778417445_3893969129120386774_367315644.jpg', title:'Hello Sunshine Event', desc:'Representing Hello Sunshine at an industry event.', tags:'hello sunshine event 2024 premiere appearance' },
    { id:'rc07', cat:'redcarpet', catLabel:'🌟 Red Carpet', img:'reesewitherspoon/reesewitherspoon_1778417445_3893969131167161129_367315644.jpg', title:'Hello Sunshine Event — Candid', desc:'A candid moment backstage at a Hello Sunshine industry event.', tags:'hello sunshine backstage candid 2024' },
    { id:'rc08', cat:'redcarpet', catLabel:'🌟 Red Carpet', img:'reesewitherspoon/reesewitherspoon_1777221599_3883938583736733041_367315644.jpg', title:'Premiere Night', desc:'Arriving at a major premiere in a statement designer look.', tags:'premiere 2024 designer look arriving' },
    { id:'rc09', cat:'redcarpet', catLabel:'🌟 Red Carpet', img:'reesewitherspoon/reesewitherspoon_1777221599_3883938584902709941_367315644.jpg', title:'Premiere — Close-Up', desc:'A striking close-up portrait from a 2024 premiere event.', tags:'premiere close up portrait 2024' },
    { id:'rc10', cat:'redcarpet', catLabel:'🌟 Red Carpet', img:'reesewitherspoon/reesewitherspoon_1774008353_3856982772565257781_367315644.jpg', title:'Spring Gala', desc:'Reese at a spring gala supporting women in the arts.', tags:'gala spring 2024 charity arts women' },
    { id:'rc11', cat:'redcarpet', catLabel:'🌟 Red Carpet', img:'reesewitherspoon/reesewitherspoon_1775746066_3871560255683815558_367315644.jpg', title:'2024 Awards Season', desc:'A glamorous appearance during awards season 2024.', tags:'awards season 2024 glamour evening' },
    { id:'rc12', cat:'redcarpet', catLabel:'🌟 Red Carpet', img:'reesewitherspoon/reesewitherspoon_1771777767_3838272269840090972_367315644.jpg', title:'Industry Gala', desc:'Making an impact at a prestigious industry gala.', tags:'gala industry 2024 statement look' },

    /* ── MOVIES & TV ─────────────────────────────────────── */
    { id:'mv01', cat:'movietv', catLabel:'🎬 Movies & TV', img:'reesewitherspoon/reesewitherspoon_1578332631_2215537149606891783_367315644.jpg', title:'Legally Blonde — Elle Woods', desc:'The iconic Elle Woods in her signature pink from the 2001 classic that made Reese a global star.', tags:'legally blonde elle woods pink harvard comedy 2001' },
    { id:'mv02', cat:'movietv', catLabel:'🎬 Movies & TV', img:'reesewitherspoon/reesewitherspoon_1578332631_2215537149682550300_367315644.jpg', title:'Legally Blonde — Promotional', desc:'A promotional still from Legally Blonde, the film that launched a thousand pink suits.', tags:'legally blonde promotion still pink suit 2001' },
    { id:'mv03', cat:'movietv', catLabel:'🎬 Movies & TV', img:'reesewitherspoon/reesewitherspoon_1579536534_2225636222863195125_367315644.jpg', title:'Walk the Line — Promotional', desc:'As June Carter Cash in Walk the Line (2005), the role that earned Reese the Academy Award.', tags:'walk the line june carter cash country music oscar 2005' },
    { id:'mv04', cat:'movietv', catLabel:'🎬 Movies & TV', img:'reesewitherspoon/reesewitherspoon_1591975593_2329982613323954854_367315644.jpg', title:'Little Fires Everywhere', desc:'Reese as Elena Richardson in Hulu\'s critically-acclaimed Little Fires Everywhere (2020).', tags:'little fires everywhere hulu elena richardson 2020 series' },
    { id:'mv05', cat:'movietv', catLabel:'🎬 Movies & TV', img:'reesewitherspoon/reesewitherspoon_1640021819_2733023570386325475_367315644.jpg', title:'The Morning Show — Season 3', desc:'As Bradley Jackson in Apple TV+\'s The Morning Show.', tags:'morning show apple tv bradley jackson season 3' },
    { id:'mv06', cat:'movietv', catLabel:'🎬 Movies & TV', img:'reesewitherspoon/reesewitherspoon_1583010420_2254777285947219792_367315644.jpg', title:'Wild — Promotional', desc:'In Cheryl Strayed\'s Wild (2014), a raw and powerful performance nominated for Academy Award.', tags:'wild cheryl strayed 2014 oscar nomination hiking' },
    { id:'mv07', cat:'movietv', catLabel:'🎬 Movies & TV', img:'reesewitherspoon/primevideo_1738771222_3561393602053836340_1684102154.jpg', title:'Legally Blonde 3 — Coming Soon', desc:'Amazon Prime Video announces Legally Blonde 3, with Reese reprising her beloved Elle Woods.', tags:'legally blonde 3 amazon prime video elle woods announcement' },
    { id:'mv08', cat:'movietv', catLabel:'🎬 Movies & TV', img:'reesewitherspoon/primevideo_1778080751_3891145722754448008_1684102154.jpg', title:'Amazon Prime — Legally Blonde 3', desc:'Behind-the-scenes teaser imagery for the upcoming Legally Blonde 3.', tags:'legally blonde 3 bts behind scenes amazon' },
    { id:'mv09', cat:'movietv', catLabel:'🎬 Movies & TV', img:'reesewitherspoon/primevideo_1778080751_3891145724298835748_1684102154.jpg', title:'LB3 — Production Shots', desc:'Exclusive production imagery from the Legally Blonde 3 Amazon shoot.', tags:'legally blonde 3 production shoot on set 2024' },
    { id:'mv10', cat:'movietv', catLabel:'🎬 Movies & TV', img:'reesewitherspoon/primevideo_1778080751_3891145724986731545_1684102154.jpg', title:'LB3 — Elle Returns', desc:'Elle Woods is officially back. Amazon Prime Video\'s most anticipated sequel.', tags:'elle woods returns legally blonde 3 amazon sequel' },
    { id:'mv11', cat:'movietv', catLabel:'🎬 Movies & TV', img:'reesewitherspoon/reesewitherspoon_1631032626_2657616754214583213_367315644.jpg', title:'The Morning Show — Press', desc:'Press tour for Apple TV+\'s The Morning Show alongside Jennifer Aniston.', tags:'morning show apple tv press tour jennifer aniston' },
    { id:'mv12', cat:'movietv', catLabel:'🎬 Movies & TV', img:'reesewitherspoon/reesewitherspoon_1592143032_2331387194129814173_367315644.jpg', title:'Sweet Home Alabama', desc:'As Melanie Carmichael in the beloved 2002 romantic comedy Sweet Home Alabama.', tags:'sweet home alabama melanie carmichael 2002 romantic comedy' },

    /* ── CANDID & LIFESTYLE ──────────────────────────────── */
    { id:'cn01', cat:'candid', catLabel:'📸 Candid', img:'reesewitherspoon/reesewitherspoon_1779634961_3904183028792210490_367315644.jpg', title:'Morning Walk — Nashville', desc:'Reese on her morning walk in Nashville, the city she has always called home.', tags:'nashville morning walk candid lifestyle 2024' },
    { id:'cn02', cat:'candid', catLabel:'📸 Candid', img:'reesewitherspoon/reesewitherspoon_1778780649_3897016730459253662_367315644.jpg', title:'Nashville Morning', desc:'A golden morning in Nashville — Reese\'s favorite city.', tags:'nashville morning golden hour candid lifestyle home' },
    { id:'cn03', cat:'candid', catLabel:'📸 Candid', img:'reesewitherspoon/reesewitherspoon_1778780649_3897016731742756549_367315644.jpg', title:'At Home in Nashville', desc:'Reese shares a glimpse of her everyday life in Tennessee.', tags:'home nashville everyday life tennessee candid personal' },
    { id:'cn04', cat:'candid', catLabel:'📸 Candid', img:'reesewitherspoon/reesewitherspoon_1778888767_3897921861991215508_367315644.jpg', title:'Reading Day', desc:'A quiet reading day — Reese lives by the motto that books can change your world.', tags:'reading books book club quiet day home candid' },
    { id:'cn05', cat:'candid', catLabel:'📸 Candid', img:'reesewitherspoon/reesewitherspoon_1777822494_3888971826742726686_367315644.jpg', title:'Family Moments', desc:'Reese spending time with loved ones — family always comes first.', tags:'family friends candid personal moments joy' },
    { id:'cn06', cat:'candid', catLabel:'📸 Candid', img:'reesewitherspoon/reesewitherspoon_1777822494_3888971835399753815_367315644.jpg', title:'Sunny Afternoon', desc:'A bright, sunny afternoon captured in a candid lifestyle moment.', tags:'sunny afternoon lifestyle candid brightness joy' },
    { id:'cn07', cat:'candid', catLabel:'📸 Candid', img:'reesewitherspoon/reesewitherspoon_1624038955_2598949585862994546_367315644.jpg', title:'Day in Her Life', desc:'A behind-the-scenes look at a typical day in Reese\'s busy, beautiful life.', tags:'day in life behind scenes typical day bts personal' },
    { id:'cn08', cat:'candid', catLabel:'📸 Candid', img:'reesewitherspoon/reesewitherspoon_1634488279_2686604866087878895_367315644.jpg', title:'Garden Afternoon', desc:'Reese in her garden — a true Southern belle in her element.', tags:'garden southern belle home outdoor afternoon flowers' },
    { id:'cn09', cat:'candid', catLabel:'📸 Candid', img:'reesewitherspoon/reesewitherspoon_1612292642_2500414372850068622_367315644.jpg', title:'Pure Joy', desc:'A candid moment of pure, unfiltered joy — this is the Reese her fans love.', tags:'joy happy smile candid unfiltered laugh pure' },
    { id:'cn10', cat:'candid', catLabel:'📸 Candid', img:'reesewitherspoon/reesewitherspoon_1601570758_2410472685298603652_367315644.jpg', title:'Working from Home', desc:'Reese at work from her home office — always busy creating the next big thing.', tags:'work from home office creative working busy productive' },
    { id:'cn11', cat:'candid', catLabel:'📸 Candid', img:'reesewitherspoon/reesewitherspoon_1623598723_2595256651556757886_367315644.jpg', title:'Nashville Roots', desc:'Coming home to Nashville, the place that grounds and inspires everything Reese does.', tags:'nashville roots home ground inspiration personal southern' },
    { id:'cn12', cat:'candid', catLabel:'📸 Candid', img:'reesewitherspoon/reesewitherspoon_1770747385_3829628212184427647_367315644.jpg', title:'2024 Lifestyle', desc:'A candid lifestyle snap from 2024 — always radiant, always herself.', tags:'2024 lifestyle candid radiant herself authentic' },
    { id:'cn13', cat:'candid', catLabel:'📸 Candid', img:'reesewitherspoon/reesewitherspoon_1770747385_3829628214541637876_367315644.jpg', title:'Outdoor Moment', desc:'Enjoying the outdoors — Reese is known for her morning runs and outdoor lifestyle.', tags:'outdoor exercise outdoors morning run lifestyle fitness' },
    { id:'cn14', cat:'candid', catLabel:'📸 Candid', img:'reesewitherspoon/reesewitherspoon_1772979814_3848355368510780426_367315644.jpg', title:'Candid Portrait 2024', desc:'A beautiful candid portrait captured in 2024.', tags:'portrait 2024 candid beautiful natural light' },

    /* ── HELLO SUNSHINE & BOOK CLUB ──────────────────────── */
    { id:'hs01', cat:'sunshine', catLabel:'☀️ Hello Sunshine', img:'reesewitherspoon/reesesbookclub_1693063724_3177971311740674109_2249417883.jpg', title:'Where the Crawdads Sing', desc:'Reese\'s Book Club pick that changed everything — Delia Owens\' debut novel sold 12M+ copies.', tags:'book club where crawdads sing delia owens 12 million' },
    { id:'hs02', cat:'sunshine', catLabel:'☀️ Hello Sunshine', img:'reesewitherspoon/reesesbookclub_1693063724_3177971311774082540_2249417883.jpg', title:'Little Fires Everywhere — Book', desc:'Celeste Ng\'s novel that became a landmark Hulu series produced by Hello Sunshine.', tags:'book club little fires everywhere celeste ng hulu' },
    { id:'hs03', cat:'sunshine', catLabel:'☀️ Hello Sunshine', img:'reesewitherspoon/reesesbookclub_1693063724_3177971311782487782_2249417883.jpg', title:'Daisy Jones & The Six', desc:'Taylor Jenkins Reid\'s rock novel became an Amazon Prime Video series via Hello Sunshine.', tags:'book club daisy jones six amazon prime rock novel' },
    { id:'hs04', cat:'sunshine', catLabel:'☀️ Hello Sunshine', img:'reesewitherspoon/reesesbookclub_1693063724_3177971311774135084_2249417883.jpg', title:'Book Club — Latest Pick', desc:'Reese personally reading this month\'s book club selection.', tags:'book club latest pick reading personal selection monthly' },
    { id:'hs05', cat:'sunshine', catLabel:'☀️ Hello Sunshine', img:'reesewitherspoon/reesesbookclub_1693063724_3177971311782426977_2249417883.jpg', title:'Book Club — Philanthropy', desc:'Reese using the book club\'s reach to support literacy and women\'s education.', tags:'book club philanthropy literacy women education causes' },
    { id:'hs06', cat:'sunshine', catLabel:'☀️ Hello Sunshine', img:'reesewitherspoon/reesesbookclub_1693063724_3177971311782437758_2249417883.jpg', title:'Hello Sunshine Meeting', desc:'Behind the scenes at a Hello Sunshine creative meeting.', tags:'hello sunshine creative meeting bts production company' },
    { id:'hs07', cat:'sunshine', catLabel:'☀️ Hello Sunshine', img:'reesewitherspoon/reesesbookclub_1693063724_3177971311824351194_2249417883.jpg', title:'Book Club Community', desc:'The Reese\'s Book Club community — millions of women reading together.', tags:'book club community millions women reading together' },
    { id:'hs08', cat:'sunshine', catLabel:'☀️ Hello Sunshine', img:'reesewitherspoon/reesesbookclub_1693063724_3177971311765622810_2249417883.jpg', title:'Hello Sunshine Productions', desc:'Hello Sunshine\'s landmark productions have won 8 Emmy Awards and generated $139M at the box office.', tags:'hello sunshine productions emmy oscar box office awards' },
    { id:'hs09', cat:'sunshine', catLabel:'☀️ Hello Sunshine', img:'reesewitherspoon/reesesbookclub_1693063724_3177971311790806176_2249417883.jpg', title:'Storytelling Platform', desc:'Reese\'s mission: every woman\'s story deserves to be told and heard.', tags:'storytelling mission women stories heard platform media' },
    { id:'hs10', cat:'sunshine', catLabel:'☀️ Hello Sunshine', img:'reesewitherspoon/reesewitherspoon_1597676628_2377806355974102153_367315644.jpg', title:'Building Hello Sunshine', desc:'The story of how a simple conviction became a $900M media empire.', tags:'hello sunshine building company 900 million media empire business' },

    /* ── FASHION & DRAPER JAMES ──────────────────────────── */
    { id:'fa01', cat:'fashion', catLabel:'👗 Fashion', img:'reesewitherspoon/glamourmag_1756814591_3712752346641580542_10070230.jpg', title:'Glamour Magazine 2025', desc:'Reese\'s stunning Glamour cover shoot for the Morning Show Season 4 promotional campaign.', tags:'glamour magazine 2025 cover shoot editorial fashion' },
    { id:'fa02', cat:'fashion', catLabel:'👗 Fashion', img:'reesewitherspoon/glamourmag_1756814591_3712752346700284336_10070230.jpg', title:'Glamour — Behind the Shoot', desc:'Behind-the-scenes from the Glamour Magazine 2025 cover shoot.', tags:'glamour behind scenes shoot bts editorial 2025' },
    { id:'fa03', cat:'fashion', catLabel:'👗 Fashion', img:'reesewitherspoon/cosmopolitan_1750240854_3657592786824360179_42725516.jpg', title:'Cosmopolitan 2024', desc:'A vibrant Cosmopolitan editorial — Reese discusses empowerment, style, and building an empire.', tags:'cosmopolitan 2024 editorial fashion empowerment style cover' },
    { id:'fa04', cat:'fashion', catLabel:'👗 Fashion', img:'reesewitherspoon/cosmopolitan_1750240854_3657592819967657427_42725516.jpg', title:'Cosmopolitan — Fashion Story', desc:'Full fashion story from Cosmopolitan\'s 2024 feature on Reese Witherspoon.', tags:'cosmopolitan fashion story 2024 full editorial spread' },
    { id:'fa05', cat:'fashion', catLabel:'👗 Fashion', img:'reesewitherspoon/cosmopolitan_1750240854_3657593022025503817_42725516.jpg', title:'Cosmopolitan — Alternate Look', desc:'Reese in an alternate look from the iconic Cosmopolitan 2024 shoot.', tags:'cosmopolitan alternate look 2024 fashion editorial' },
    { id:'fa06', cat:'fashion', catLabel:'👗 Fashion', img:'reesewitherspoon/bazaaruk_1762159027_3757584728598605611_43088132.jpg', title:'Harper\'s Bazaar UK', desc:'An exquisite editorial for Harper\'s Bazaar UK — Reese at her most sophisticated.', tags:'harpers bazaar uk editorial sophisticated high fashion magazine' },
    { id:'fa07', cat:'fashion', catLabel:'👗 Fashion', img:'reesewitherspoon/reesewitherspoon_1774191874_3858523271864335054_367315644.jpg', title:'Draper James Collection', desc:'Reese models her beloved Draper James Southern-inspired fashion label.', tags:'draper james collection fashion southern label own brand design' },
    { id:'fa08', cat:'fashion', catLabel:'👗 Fashion', img:'reesewitherspoon/reesewitherspoon_1774191874_3858523279204391820_367315644.jpg', title:'Draper James — Spring Collection', desc:'The Draper James Spring Collection — Southern charm meets modern style.', tags:'draper james spring collection fashion southern charm modern' },
    { id:'fa09', cat:'fashion', catLabel:'👗 Fashion', img:'reesewitherspoon/reesewitherspoon_1774191874_3858523281033098699_367315644.jpg', title:'Draper James — Editorial', desc:'A beautiful editorial for the Draper James brand.', tags:'draper james editorial fashion brand beautiful shoot' },
    { id:'fa10', cat:'fashion', catLabel:'👗 Fashion', img:'reesewitherspoon/reesewitherspoon_1774191874_3858523283641959799_367315644.jpg', title:'Draper James — Portrait', desc:'A portrait shot showcasing the signature Draper James aesthetic.', tags:'draper james portrait aesthetic signature southern fashion' },
    { id:'fa11', cat:'fashion', catLabel:'👗 Fashion', img:'reesewitherspoon/reesewitherspoon_1774191874_3858523284287883137_367315644.jpg', title:'Draper James — Campaign', desc:'Campaign imagery for Draper James, the brand Reese founded in 2015.', tags:'draper james campaign 2015 founded fashion brand southern' },
    { id:'fa12', cat:'fashion', catLabel:'👗 Fashion', img:'reesewitherspoon/reesewitherspoon_1774191874_3858523287081293075_367315644.jpg', title:'Fashion Week', desc:'Reese front-row at fashion week, where she\'s become a perennial style icon.', tags:'fashion week front row style icon perennial editorial' },

    /* ── EARLY CAREER & THROWBACKS ───────────────────────── */
    { id:'tb01', cat:'throwback', catLabel:'🎞️ Throwbacks', img:'reesewitherspoon/reesewitherspoon_1566064330_2112623179871571534_367315644.jpg', title:'Early Career — 1998', desc:'A young Reese in the late 1990s, before she became one of the biggest stars in Hollywood.', tags:'throwback 1990s early career young 1998 before fame' },
    { id:'tb02', cat:'throwback', catLabel:'🎞️ Throwbacks', img:'reesewitherspoon/reesewitherspoon_1569949265_2145212380576138250_367315644.jpg', title:'Late 1990s Portrait', desc:'A portrait from the late 1990s during the early years of Reese\'s Hollywood career.', tags:'1990s portrait early career Hollywood young throwback' },
    { id:'tb03', cat:'throwback', catLabel:'🎞️ Throwbacks', img:'reesewitherspoon/reesewitherspoon_1570494823_2149788856218626605_367315644.jpg', title:'Election — 1999', desc:'As Tracy Flick in Election (1999), one of her earliest critically-acclaimed performances.', tags:'election 1999 tracy flick film early career critically acclaimed' },
    { id:'tb04', cat:'throwback', catLabel:'🎞️ Throwbacks', img:'reesewitherspoon/reesewitherspoon_1577901649_2211921814496504844_367315644.jpg', title:'Year 2000 — Rise to Stardom', desc:'Reese in 2000, just before Legally Blonde would make her a global superstar.', tags:'2000 rise stardom pre legally blonde year 2000' },
    { id:'tb05', cat:'throwback', catLabel:'🎞️ Throwbacks', img:'reesewitherspoon/reesewitherspoon_1578012068_2212848069828112141_367315644.jpg', title:'Early 2000s — Hollywood Rising', desc:'A stunning portrait from the early 2000s as Reese was becoming Hollywood royalty.', tags:'early 2000s hollywood rising royalty portrait young career' },
    { id:'tb06', cat:'throwback', catLabel:'🎞️ Throwbacks', img:'reesewitherspoon/reesewitherspoon_1578269767_2215009812800867349_367315644.jpg', title:'Pre-Oscars — 2005', desc:'Reese in 2005, the year before her history-making Academy Award win.', tags:'2005 pre oscars pre awards year walk the line filming' },
    { id:'tb07', cat:'throwback', catLabel:'🎞️ Throwbacks', img:'reesewitherspoon/reesewitherspoon_1580140903_2230706038028481020_367315644.jpg', title:'2010s — Reinvention', desc:'Reese in the 2010s, reinventing herself as a producer and business mogul.', tags:'2010s reinvention producer business mogul career evolution' },
    { id:'tb08', cat:'throwback', catLabel:'🎞️ Throwbacks', img:'reesewitherspoon/reesewitherspoon_1576863068_2203209566987023911_367315644.jpg', title:'Pre-Legally Blonde', desc:'A throwback to the 1990s before Legally Blonde changed everything.', tags:'pre legally blonde 1990s throwback before fame career start' },
    { id:'tb09', cat:'throwback', catLabel:'🎞️ Throwbacks', img:'reesewitherspoon/reesewitherspoon_1578501160_2216950870816342978_367315644.jpg', title:'Sweet Home Alabama Era', desc:'Reese during the Sweet Home Alabama era — at the height of her early career fame.', tags:'sweet home alabama era 2002 height fame early career' },
    { id:'tb10', cat:'throwback', catLabel:'🎞️ Throwbacks', img:'reesewitherspoon/reesewitherspoon_1578511076_2217034055642426363_367315644.jpg', title:'Mid-2000s Classic Look', desc:'A classic portrait from the mid-2000s, Reese\'s golden era.', tags:'mid 2000s classic golden era portrait career peak' },
    { id:'tb11', cat:'throwback', catLabel:'🎞️ Throwbacks', img:'reesewitherspoon/reesewitherspoon_1579892639_2228623450170427988_367315644.jpg', title:'2007 — Post-Oscar', desc:'Reese photographed in 2007 following her Academy Award triumph.', tags:'2007 post oscar following award triumph year after' },
    { id:'tb12', cat:'throwback', catLabel:'🎞️ Throwbacks', img:'reesewitherspoon/reesewitherspoon_1583942658_2262597468992752413_367315644.jpg', title:'2020 Quarantine Era', desc:'Reese during the 2020 quarantine era, connecting with fans through social media.', tags:'2020 quarantine era social media fans connecting pandemic' },
    { id:'tb13', cat:'throwback', catLabel:'🎞️ Throwbacks', img:'reesewitherspoon/reesewitherspoon_1586362033_2282892660425556623_367315644.jpg', title:'Morning Show Announcement', desc:'Announcing The Morning Show partnership with Apple TV+ in 2019.', tags:'morning show announcement apple tv 2019 partnership announcement' },
    { id:'tb14', cat:'throwback', catLabel:'🎞️ Throwbacks', img:'reesewitherspoon/reesewitherspoon_1624029970_2598874215562248361_367315644.jpg', title:'Mid-2021 Moment', desc:'A beautiful portrait from 2021 as Reese continued building her media empire.', tags:'2021 portrait media empire building hello sunshine growth' },

    /* ── RED CARPET (NEW) ─────────────────────────────── */
    { id:'rc13', cat:'redcarpet', catLabel:'🌟 Red Carpet', img:'reesewitherspoon/reesewitherspoon_1778417445_3893969131200714334_367315644.jpg', title:'Hello Sunshine Gala 2024', desc:'Reese looking radiant at a Hello Sunshine industry gala in late 2024.', tags:'hello sunshine gala 2024 event industry premiere' },
    { id:'rc14', cat:'redcarpet', catLabel:'🌟 Red Carpet', img:'reesewitherspoon/reesewitherspoon_1778417445_3893969134413559415_367315644.jpg', title:'2024 Evening Event', desc:'A stunning evening appearance at a high-profile 2024 industry event.', tags:'evening event 2024 stunning industry high profile' },
    { id:'rc15', cat:'redcarpet', catLabel:'🌟 Red Carpet', img:'reesewitherspoon/reesewitherspoon_1778417445_3893969135529286468_367315644.jpg', title:'Red Carpet Elegance', desc:'Reese exuding elegance and confidence on the red carpet.', tags:'red carpet elegance confidence 2024 event formal' },
    { id:'rc16', cat:'redcarpet', catLabel:'🌟 Red Carpet', img:'reesewitherspoon/reesewitherspoon_1778417445_3893969136175213634_367315644.jpg', title:'Premiere Close-Up 2024', desc:'A striking close-up from a major premiere event in 2024.', tags:'premiere close up 2024 major event striking portrait' },
    { id:'rc17', cat:'redcarpet', catLabel:'🌟 Red Carpet', img:'reesewitherspoon/reesewitherspoon_1777221599_3883938585162802883_367315644.jpg', title:'Statement Look 2024', desc:'Reese in a bold statement outfit at a 2024 premiere.', tags:'statement look 2024 bold premiere outfit designer' },
    { id:'rc18', cat:'redcarpet', catLabel:'🌟 Red Carpet', img:'reesewitherspoon/reesewitherspoon_1777221599_3883938585523470987_367315644.jpg', title:'Awards Appearance', desc:'A glamorous awards season appearance from 2024.', tags:'awards season 2024 glamorous appearance formal gown' },
    { id:'rc19', cat:'redcarpet', catLabel:'🌟 Red Carpet', img:'reesewitherspoon/reesewitherspoon_1777221599_3883938586127491900_367315644.jpg', title:'Industry Event 2024', desc:'Reese commanding attention at a major industry event.', tags:'industry event 2024 commanding attention presence star' },
    { id:'rc20', cat:'redcarpet', catLabel:'🌟 Red Carpet', img:'reesewitherspoon/reesewitherspoon_1777221599_3883938586353947300_367315644.jpg', title:'Red Carpet Portrait', desc:'A beautiful formal portrait from a 2024 red carpet event.', tags:'red carpet portrait formal 2024 beautiful professional' },
    { id:'rc21', cat:'redcarpet', catLabel:'🌟 Red Carpet', img:'reesewitherspoon/reesewitherspoon_1777221599_3883938586387484997_367315644.jpg', title:'Reese in Full Glamour', desc:'Full-length glamour shot at a 2024 major event.', tags:'full length glamour 2024 event major star' },
    { id:'rc22', cat:'redcarpet', catLabel:'🌟 Red Carpet', img:'reesewitherspoon/reesewitherspoon_1770387707_3826611319135363206_367315644.jpg', title:'Spring Event 2024', desc:'Making a spring 2024 appearance in radiant style.', tags:'spring 2024 appearance radiant style event premiere' },
    { id:'rc23', cat:'redcarpet', catLabel:'🌟 Red Carpet', img:'reesewitherspoon/reesewitherspoon_1779634961_3904183028179877661_367315644.jpg', title:'2025 Premiere Night', desc:'Reese at a 2025 premiere night looking absolutely stunning.', tags:'2025 premiere night stunning appearance red carpet' },
    { id:'rc24', cat:'redcarpet', catLabel:'🌟 Red Carpet', img:'reesewitherspoon/reesewitherspoon_1779634961_3904183029639445487_367315644.jpg', title:'2025 Full Length Look', desc:'A full-length shot from Reese\'s standout 2025 premiere appearance.', tags:'2025 full length look premiere red carpet standout' },

    /* ── MOVIES & TV (NEW) ─────────────────────────────── */
    { id:'mv13', cat:'movietv', catLabel:'🎬 Movies & TV', img:'reesewitherspoon/primevideo_1778080751_3891145723341478177_1684102154.jpg', title:'LB3 — Elle & Cast', desc:'Reese with the Legally Blonde 3 cast during Amazon Prime Video\'s production.', tags:'legally blonde 3 cast elle woods amazon prime 2024 cast' },
    { id:'mv14', cat:'movietv', catLabel:'🎬 Movies & TV', img:'reesewitherspoon/primevideo_1778080751_3891145724465756985_1684102154.jpg', title:'LB3 — On Set', desc:'Behind-the-scenes on the set of Legally Blonde 3.', tags:'legally blonde 3 on set bts behind scenes 2024 production' },
    { id:'mv15', cat:'movietv', catLabel:'🎬 Movies & TV', img:'reesewitherspoon/primevideo_1778080751_3891145724549434084_1684102154.jpg', title:'LB3 — Director\'s Shot', desc:'A director\'s shot from the Legally Blonde 3 production.', tags:'legally blonde 3 director shot production amazon filming' },
    { id:'mv16', cat:'movietv', catLabel:'🎬 Movies & TV', img:'reesewitherspoon/primevideo_1778080751_3891145727536749987_1684102154.jpg', title:'LB3 — Pink Is Back', desc:'Elle Woods\' signature pink is back in force for Legally Blonde 3.', tags:'legally blonde 3 pink elle woods back iconic sequel' },
    { id:'mv17', cat:'movietv', catLabel:'🎬 Movies & TV', img:'reesewitherspoon/primevideo_1778080751_3891145727863253279_1684102154.jpg', title:'LB3 — Promo Shot', desc:'An exclusive promotional shot from Legally Blonde 3.', tags:'legally blonde 3 promo promotional shot exclusive amazon' },
    { id:'mv18', cat:'movietv', catLabel:'🎬 Movies & TV', img:'reesewitherspoon/primevideo_1778080751_3891145732795245414_1684102154.jpg', title:'LB3 — Final Look', desc:'One of the final promotional images from Legally Blonde 3.', tags:'legally blonde 3 final promo image amazon prime 2025' },
    { id:'mv19', cat:'movietv', catLabel:'🎬 Movies & TV', img:'reesewitherspoon/reesewitherspoon_1640021819_2733023570369557446_367315644.jpg', title:'The Morning Show — Cast', desc:'Reese with the full cast of Apple TV+\'s The Morning Show.', tags:'morning show cast apple tv full cast season 2021' },

    /* ── CANDID & LIFESTYLE (NEW) ─────────────────────── */
    { id:'cn15', cat:'candid', catLabel:'📸 Candid', img:'reesewitherspoon/reesewitherspoon_1778780649_3897016733948771976_367315644.jpg', title:'Golden Hour Walk', desc:'Reese on a golden-hour walk, looking relaxed and at peace.', tags:'golden hour walk candid relaxed peaceful outdoors lifestyle' },
    { id:'cn16', cat:'candid', catLabel:'📸 Candid', img:'reesewitherspoon/reesewitherspoon_1778780649_3897016735190277178_367315644.jpg', title:'Sunny Lifestyle 2024', desc:'A bright and breezy lifestyle shot from 2024.', tags:'sunny lifestyle 2024 bright breezy candid personal' },
    { id:'cn17', cat:'candid', catLabel:'📸 Candid', img:'reesewitherspoon/reesewitherspoon_1778780649_3897016738092843743_367315644.jpg', title:'Morning Stroll', desc:'Reese enjoying a morning stroll in her neighborhood.', tags:'morning stroll neighborhood candid everyday life personal 2024' },
    { id:'cn18', cat:'candid', catLabel:'📸 Candid', img:'reesewitherspoon/reesewitherspoon_1778888767_3897921878491650173_367315644.jpg', title:'Cozy Reading Day', desc:'A cozy reading day at home — a true Reese Witherspoon moment.', tags:'cozy reading day home books candid personal lifestyle' },
    { id:'cn19', cat:'candid', catLabel:'📸 Candid', img:'reesewitherspoon/reesewitherspoon_1778888767_3897921899521690223_367315644.jpg', title:'Weekend Vibes', desc:'Reese\'s weekend vibes — relaxed, authentic and joyful.', tags:'weekend vibes relaxed authentic joyful candid personal' },
    { id:'cn20', cat:'candid', catLabel:'📸 Candid', img:'reesewitherspoon/reesewitherspoon_1778888767_3897921916433150406_367315644.jpg', title:'Natural Beauty', desc:'Reese\'s natural beauty captured in a candid 2024 moment.', tags:'natural beauty candid 2024 unfiltered authentic personal' },
    { id:'cn21', cat:'candid', catLabel:'📸 Candid', img:'reesewitherspoon/reesewitherspoon_1778888768_3897921889656734984_367315644.jpg', title:'Bright Smile 2024', desc:'That iconic Reese smile — captured candidly in 2024.', tags:'bright smile 2024 iconic candid joy happy authentic' },
    { id:'cn22', cat:'candid', catLabel:'📸 Candid', img:'reesewitherspoon/reesewitherspoon_1770747385_3829628215816686827_367315644.jpg', title:'Outdoors 2024', desc:'Reese enjoying time outdoors, living her best life in 2024.', tags:'outdoors 2024 best life enjoying nature candid personal' },
    { id:'cn23', cat:'candid', catLabel:'📸 Candid', img:'reesewitherspoon/reesewitherspoon_1770747385_3829628217536410486_367315644.jpg', title:'Active Lifestyle', desc:'Reese\'s active lifestyle — always on the move and loving it.', tags:'active lifestyle fitness moving health candid outdoor 2024' },
    { id:'cn24', cat:'candid', catLabel:'📸 Candid', img:'reesewitherspoon/reesewitherspoon_1770747385_3829628217980979689_367315644.jpg', title:'Free Spirit', desc:'A free-spirited candid moment — Reese at her most authentic.', tags:'free spirit candid authentic moment real personal lifestyle' },
    { id:'cn25', cat:'candid', catLabel:'📸 Candid', img:'reesewitherspoon/reesewitherspoon_1770747385_3829628218165525651_367315644.jpg', title:'Joyful Moment', desc:'An utterly joyful candid moment from 2024.', tags:'joyful moment candid 2024 happiness smile authentic real' },
    { id:'cn26', cat:'candid', catLabel:'📸 Candid', img:'reesewitherspoon/reesewitherspoon_1771777767_3838272269957536899_367315644.jpg', title:'Summer 2024', desc:'Reese living her best summer in 2024.', tags:'summer 2024 best life sunny outdoor candid lifestyle warm' },
    { id:'cn27', cat:'candid', catLabel:'📸 Candid', img:'reesewitherspoon/reesewitherspoon_1771777767_3838272270712530715_367315644.jpg', title:'Life in Full Colour', desc:'Life in full colour — a vibrant candid snapshot from 2024.', tags:'full colour vibrant snapshot 2024 candid colourful joy life' },
    { id:'cn28', cat:'candid', catLabel:'📸 Candid', img:'reesewitherspoon/reesewitherspoon_1771777767_3838272271064871082_367315644.jpg', title:'Candid Radiance', desc:'Candid radiance — Reese glowing without trying.', tags:'candid radiance glowing effortless natural 2024 beautiful' },
    { id:'cn29', cat:'candid', catLabel:'📸 Candid', img:'reesewitherspoon/reesewitherspoon_1772979814_3848355370549188812_367315644.jpg', title:'Tennessee Roots', desc:'Reese back in Tennessee, where it all began.', tags:'tennessee roots home nashville personal candid lifestyle 2024' },
    { id:'cn30', cat:'candid', catLabel:'📸 Candid', img:'reesewitherspoon/reesewitherspoon_1772979814_3848355372478576590_367315644.jpg', title:'Garden Moments', desc:'A peaceful garden moment, a glimpse into Reese\'s private world.', tags:'garden peaceful private world candid personal home outdoor' },
    { id:'cn31', cat:'candid', catLabel:'📸 Candid', img:'reesewitherspoon/reesewitherspoon_1772979814_3848355373090938560_367315644.jpg', title:'Happy Candid', desc:'One of the happiest candid shots you\'ll ever see of Reese.', tags:'happy candid smile laugh joy authentic personal 2024' },
    { id:'cn32', cat:'candid', catLabel:'📸 Candid', img:'reesewitherspoon/reesewitherspoon_1772979814_3848355374391208558_367315644.jpg', title:'Southern Living', desc:'Southern living at its finest — Reese in her element.', tags:'southern living nashville element home outdoor sun candid' },
    { id:'cn33', cat:'candid', catLabel:'📸 Candid', img:'reesewitherspoon/reesewitherspoon_1772979814_3848355375892783245_367315644.jpg', title:'Lifestyle Portrait', desc:'A beautiful lifestyle portrait from mid-2024.', tags:'lifestyle portrait mid 2024 beautiful candid personal' },
    { id:'cn34', cat:'candid', catLabel:'📸 Candid', img:'reesewitherspoon/reesewitherspoon_1774008353_3856982773152446344_367315644.jpg', title:'Afternoon Light', desc:'Reese in beautiful afternoon light — a magical candid moment.', tags:'afternoon light magical candid golden portrait beautiful 2024' },
    { id:'cn35', cat:'candid', catLabel:'📸 Candid', img:'reesewitherspoon/reesewitherspoon_1774008353_3856982773236335389_367315644.jpg', title:'Spring Freshness', desc:'A fresh and bright spring moment captured candidly.', tags:'spring fresh bright candid season 2024 outdoors flowers' },

    /* ── FASHION (NEW) ─────────────────────────────────── */
    { id:'fa13', cat:'fashion', catLabel:'👗 Fashion', img:'reesewitherspoon/reesewitherspoon_1774191874_3858523287668461072_367315644.jpg', title:'Draper James — Summer', desc:'The Draper James Summer Collection showcasing Southern-inspired fashion.', tags:'draper james summer collection fashion southern inspired brand' },
    { id:'fa14', cat:'fashion', catLabel:'👗 Fashion', img:'reesewitherspoon/reesewitherspoon_1774191874_3858523289262317073_367315644.jpg', title:'Draper James — Outdoor', desc:'An outdoor editorial shoot for the Draper James fashion brand.', tags:'draper james outdoor editorial shoot fashion brand summer' },
    { id:'fa15', cat:'fashion', catLabel:'👗 Fashion', img:'reesewitherspoon/reesewitherspoon_1774191874_3858523293221764528_367315644.jpg', title:'Draper James — Classic', desc:'Classic Southern elegance from the Draper James collection.', tags:'draper james classic southern elegance collection fashion style' },
    { id:'fa16', cat:'fashion', catLabel:'👗 Fashion', img:'reesewitherspoon/reesewitherspoon_1774191874_3858523294572342136_367315644.jpg', title:'Draper James — Pattern', desc:'Reese in a signature Draper James floral pattern.', tags:'draper james floral pattern signature southern style design' },
    { id:'fa17', cat:'fashion', catLabel:'👗 Fashion', img:'reesewitherspoon/reesewitherspoon_1775563205_3870025325296378718_367315644.jpg', title:'Spring Fashion 2024', desc:'Reese in a stunning spring fashion look from 2024.', tags:'spring fashion 2024 stunning look editorial style' },
    { id:'fa18', cat:'fashion', catLabel:'👗 Fashion', img:'reesewitherspoon/reesewitherspoon_1775746066_3871560257009176995_367315644.jpg', title:'Evening Elegance', desc:'An elegant evening fashion look from a 2024 fashion event.', tags:'evening elegance fashion event 2024 gown formal designer' },
    { id:'fa19', cat:'fashion', catLabel:'👗 Fashion', img:'reesewitherspoon/reesewitherspoon_1775746066_3871560258821153405_367315644.jpg', title:'Fashion Forward', desc:'Reese pushing the boundaries of fashion in 2024.', tags:'fashion forward 2024 boundary pushing editorial creative style' },
    { id:'fa20', cat:'fashion', catLabel:'👗 Fashion', img:'reesewitherspoon/reesewitherspoon_1775746066_3871560258837927373_367315644.jpg', title:'Chic & Polished', desc:'Chic and polished — Reese\'s fashion sense never misses.', tags:'chic polished fashion style never misses 2024 editorial' },
    { id:'fa21', cat:'fashion', catLabel:'👗 Fashion', img:'reesewitherspoon/reesewitherspoon_1762359060_3759262728222534224_367315644.jpg', title:'2024 Spring Style', desc:'Reese in a fresh spring editorial from 2024.', tags:'spring style 2024 editorial fresh fashion look shoot' },
    { id:'fa22', cat:'fashion', catLabel:'👗 Fashion', img:'reesewitherspoon/reesewitherspoon_1762359060_3759262728256046215_367315644.jpg', title:'Pastel Perfection', desc:'Pastel perfection in this stunning 2024 fashion shoot.', tags:'pastel perfection 2024 fashion shoot editorial colours' },
    { id:'fa23', cat:'fashion', catLabel:'👗 Fashion', img:'reesewitherspoon/reesewitherspoon_1762359060_3759262728256076637_367315644.jpg', title:'Editorial Grace', desc:'Editorial grace — Reese commanding a fashion shoot.', tags:'editorial grace fashion shoot command presence 2024 magazine' },
    { id:'fa24', cat:'fashion', catLabel:'👗 Fashion', img:'reesewitherspoon/reesewitherspoon_1762705202_3762166371917616651_367315644.jpg', title:'Summer Fashion Shoot', desc:'A vibrant summer fashion shoot featuring Reese.', tags:'summer fashion shoot vibrant 2024 editorial colourful' },
    { id:'fa25', cat:'fashion', catLabel:'👗 Fashion', img:'reesewitherspoon/reesewitherspoon_1762705202_3762166371934351072_367315644.jpg', title:'Boho Chic', desc:'Reese in a boho-chic editorial look for summer 2024.', tags:'boho chic editorial summer 2024 fashion style relaxed' },
    { id:'fa26', cat:'fashion', catLabel:'👗 Fashion', img:'reesewitherspoon/reesewitherspoon_1762705202_3762166371976300797_367315644.jpg', title:'Colour Pop Look', desc:'A bold colour pop look from a 2024 fashion editorial.', tags:'colour pop bold look fashion editorial 2024 vibrant' },

    /* ── HELLO SUNSHINE / BOOK CLUB (NEW) ─────────────── */
    { id:'hs11', cat:'sunshine', catLabel:'☀️ Hello Sunshine', img:'reesewitherspoon/reesewitherspoon_1763920830_3772363801451638596_367315644.jpg', title:'Hello Sunshine 2024', desc:'Reese representing Hello Sunshine at a 2024 event.', tags:'hello sunshine 2024 event media company representation' },
    { id:'hs12', cat:'sunshine', catLabel:'☀️ Hello Sunshine', img:'reesewitherspoon/reesewitherspoon_1763920830_3772363801460065057_367315644.jpg', title:'Sunshine Moment', desc:'A warm Hello Sunshine moment — Reese embodying her brand.', tags:'hello sunshine brand embodying warm moment company 2024' },
    { id:'hs13', cat:'sunshine', catLabel:'☀️ Hello Sunshine', img:'reesewitherspoon/reesewitherspoon_1763920830_3772363801460068897_367315644.jpg', title:'Hello Sunshine Meeting', desc:'Inside a Hello Sunshine creative meeting in 2024.', tags:'hello sunshine creative meeting inside 2024 company production' },
    { id:'hs14', cat:'sunshine', catLabel:'☀️ Hello Sunshine', img:'reesewitherspoon/reesewitherspoon_1763920830_3772363801485218823_367315644.jpg', title:'Sunshine Leadership', desc:'Reese leading the Hello Sunshine team with vision and purpose.', tags:'hello sunshine leadership team vision purpose 2024 ceo founder' },
    { id:'hs15', cat:'sunshine', catLabel:'☀️ Hello Sunshine', img:'reesewitherspoon/reesewitherspoon_1763920830_3772363801485238265_367315644.jpg', title:'Media Empire 2024', desc:'Reese building her $900M media empire — Hello Sunshine in action.', tags:'media empire 900 million hello sunshine action 2024 company' },
    { id:'hs16', cat:'sunshine', catLabel:'☀️ Hello Sunshine', img:'reesewitherspoon/reesewitherspoon_1763920830_3772363801518748011_367315644.jpg', title:'Brand Ambassador', desc:'Reese as the face and soul of Hello Sunshine.', tags:'brand ambassador face soul hello sunshine 2024 founder company' },
    { id:'hs17', cat:'sunshine', catLabel:'☀️ Hello Sunshine', img:'reesewitherspoon/reesewitherspoon_1763920830_3772363801527166940_367315644.jpg', title:'Storytelling Vision', desc:'Reese sharing her vision for storytelling and women\'s voices.', tags:'storytelling vision women voices sharing 2024 hello sunshine' },
    { id:'hs18', cat:'sunshine', catLabel:'☀️ Hello Sunshine', img:'reesewitherspoon/reesewitherspoon_1763920830_3772363801535572482_367315644.jpg', title:'Hello Sunshine — 2024 Highlight', desc:'One of Hello Sunshine\'s 2024 highlight moments.', tags:'hello sunshine 2024 highlight moment company year brand' },
    { id:'hs19', cat:'sunshine', catLabel:'☀️ Hello Sunshine', img:'reesewitherspoon/reesewitherspoon_1766764835_3796221047801211261_367315644.jpg', title:'Sunshine & Friends', desc:'Reese with friends and collaborators at a Hello Sunshine event.', tags:'hello sunshine friends collaborators event 2024 social networking' },
    { id:'hs20', cat:'sunshine', catLabel:'☀️ Hello Sunshine', img:'reesewitherspoon/reesewitherspoon_1766764835_3796221047801211729_367315644.jpg', title:'Bright Futures', desc:'Reese celebrating the bright future of Hello Sunshine.', tags:'bright futures celebration hello sunshine 2024 growth optimism' },
    { id:'hs21', cat:'sunshine', catLabel:'☀️ Hello Sunshine', img:'reesewitherspoon/reesewitherspoon_1766764835_3796221047801223173_367315644.jpg', title:'Women in Media', desc:'Reese championing women in media through Hello Sunshine.', tags:'women media championing hello sunshine advocacy 2024 equality' },
    { id:'hs22', cat:'sunshine', catLabel:'☀️ Hello Sunshine', img:'reesewitherspoon/reesewitherspoon_1766764835_3796221047801236942_367315644.jpg', title:'Hello Sunshine Community', desc:'The Hello Sunshine community celebrating women\'s stories.', tags:'hello sunshine community celebrating women stories 2024 event' },
    { id:'hs23', cat:'sunshine', catLabel:'☀️ Hello Sunshine', img:'reesewitherspoon/reesewitherspoon_1766764835_3796221047801240391_367315644.jpg', title:'Creative Direction', desc:'Reese providing creative direction for a Hello Sunshine project.', tags:'creative direction hello sunshine project 2024 vision leadership' },
    { id:'hs24', cat:'sunshine', catLabel:'☀️ Hello Sunshine', img:'reesewitherspoon/reesewitherspoon_1766764835_3796221047801242214_367315644.jpg', title:'Sunshine Glow', desc:'The Sunshine glow — Reese radiating positivity at a Hello Sunshine event.', tags:'sunshine glow positivity radiating hello sunshine event 2024' },

    /* ── THROWBACKS (NEW) ─────────────────────────────── */
    { id:'tb15', cat:'throwback', catLabel:'🎞️ Throwbacks', img:'reesewitherspoon/reesewitherspoon_1578332631_2215537149632232812_367315644.jpg', title:'Legally Blonde — BTS', desc:'Behind-the-scenes from the Legally Blonde set in 2001.', tags:'legally blonde bts behind scenes set 2001 elle woods throwback' },
    { id:'tb16', cat:'throwback', catLabel:'🎞️ Throwbacks', img:'reesewitherspoon/reesewitherspoon_1578332631_2215537149640688138_367315644.jpg', title:'Legally Blonde — Iconic Shot', desc:'One of the most iconic promotional shots from Legally Blonde.', tags:'legally blonde iconic shot promotional 2001 elle woods pink' },
    { id:'tb17', cat:'throwback', catLabel:'🎞️ Throwbacks', img:'reesewitherspoon/reesewitherspoon_1578332631_2215537149649023618_367315644.jpg', title:'Legally Blonde — On Set', desc:'Reese as Elle Woods on the Legally Blonde set, Harvard Law never looked so good.', tags:'legally blonde on set elle woods harvard law pink 2001' },
    { id:'tb18', cat:'throwback', catLabel:'🎞️ Throwbacks', img:'reesewitherspoon/reesewitherspoon_1578332631_2215537149657328110_367315644.jpg', title:'Legally Blonde — Cast Shot', desc:'A cast shot from the Legally Blonde production, 2001.', tags:'legally blonde cast shot 2001 production ensemble comedy' },
    { id:'tb19', cat:'throwback', catLabel:'🎞️ Throwbacks', img:'reesewitherspoon/reesewitherspoon_1578332631_2215537149665714469_367315644.jpg', title:'Early 2000s Promo', desc:'A promotional shot from the early 2000s at the height of Reese\'s first big wave.', tags:'early 2000s promo promotional first wave career height star' },
    { id:'tb20', cat:'throwback', catLabel:'🎞️ Throwbacks', img:'reesewitherspoon/reesewitherspoon_1578332631_2215537149690782752_367315644.jpg', title:'Iconic Reese — 2001', desc:'One of the most iconic portraits of Reese Witherspoon from 2001.', tags:'iconic portrait 2001 reese witherspoon early career throwback famous' },
    { id:'tb21', cat:'throwback', catLabel:'🎞️ Throwbacks', img:'reesewitherspoon/reesewitherspoon_1579536534_2225636222888326103_367315644.jpg', title:'Walk the Line — On Set', desc:'On set filming Walk the Line, the role that defined a generation.', tags:'walk the line on set filming 2005 june carter cash country oscar' },
    { id:'tb22', cat:'throwback', catLabel:'🎞️ Throwbacks', img:'reesewitherspoon/reesewitherspoon_1579536534_2225636222896777336_367315644.jpg', title:'Walk the Line — Press', desc:'Press tour for Walk the Line — Reese on her way to Oscar glory.', tags:'walk the line press tour oscar 2005 june carter country music' },
    { id:'tb23', cat:'throwback', catLabel:'🎞️ Throwbacks', img:'reesewitherspoon/reesewitherspoon_1579536534_2225636222905237457_367315644.jpg', title:'Walk the Line — Co-Star', desc:'Reese with co-stars from Walk the Line during the press tour.', tags:'walk the line co stars press tour 2005 oscar nomination campaign' },
    { id:'tb24', cat:'throwback', catLabel:'🎞️ Throwbacks', img:'reesewitherspoon/reesewitherspoon_1579536534_2225636222913509897_367315644.jpg', title:'Walk the Line — Portrait', desc:'A stunning portrait from the Walk the Line promotional campaign.', tags:'walk the line portrait promo campaign 2005 stunning oscar' },
    { id:'tb25', cat:'throwback', catLabel:'🎞️ Throwbacks', img:'reesewitherspoon/reesewitherspoon_1579543405_2225693863027294946_367315644.jpg', title:'2006 — Oscar Glow', desc:'Reese following her historic Oscar win for Walk the Line in 2006.', tags:'2006 oscar glow win historic walk the line academy award' },
    { id:'tb26', cat:'throwback', catLabel:'🎞️ Throwbacks', img:'reesewitherspoon/reesewitherspoon_1579637641_2226484364902997486_367315644.jpg', title:'Mid-2000s Portrait', desc:'A timeless mid-2000s portrait of Reese at the peak of her first era.', tags:'mid 2000s portrait timeless peak first era career beauty' },
    { id:'tb27', cat:'throwback', catLabel:'🎞️ Throwbacks', img:'reesewitherspoon/reesewitherspoon_1579713894_2227124026462007405_367315644.jpg', title:'Blonde Ambition', desc:'Blonde ambition — Reese in the mid-2000s ruling Hollywood.', tags:'blonde ambition mid 2000s ruling hollywood career peak power' },
    { id:'tb28', cat:'throwback', catLabel:'🎞️ Throwbacks', img:'reesewitherspoon/reesewitherspoon_1579801900_2227862275061086086_367315644.jpg', title:'The Reese Era', desc:'This was the era that cemented Reese Witherspoon as Hollywood royalty.', tags:'reese era cemented hollywood royalty 2006 2007 post oscar career' },
    { id:'tb29', cat:'throwback', catLabel:'🎞️ Throwbacks', img:'reesewitherspoon/reesewitherspoon_1580403467_2232908580825155190_367315644.jpg', title:'2010 — New Chapter', desc:'Reese in 2010, beginning a bold new chapter in her storied career.', tags:'2010 new chapter bold career evolution producing hello sunshine start' },
    { id:'tb30', cat:'throwback', catLabel:'🎞️ Throwbacks', img:'reesewitherspoon/reesewitherspoon_1580488385_2233620928456287287_367315644.jpg', title:'Producer Era', desc:'The beginning of Reese\'s producer era — building stories on her own terms.', tags:'producer era building stories own terms 2010s career evolution mogul' },
    { id:'tb31', cat:'throwback', catLabel:'🎞️ Throwbacks', img:'reesewitherspoon/reesewitherspoon_1580579831_2234388033917028775_367315644.jpg', title:'2010s Glamour', desc:'Reese in the 2010s — glamour, sophistication and serious business acumen.', tags:'2010s glamour sophistication business acumen producer mogul star' },
    { id:'tb32', cat:'throwback', catLabel:'🎞️ Throwbacks', img:'reesewitherspoon/reesewitherspoon_1581311973_2240529682690946700_367315644.jpg', title:'Nashville Pride', desc:'Reese beaming with pride in her beloved Nashville.', tags:'nashville pride beloved home city 2010s personal southern roots' },
    { id:'tb33', cat:'throwback', catLabel:'🎞️ Throwbacks', img:'reesewitherspoon/reesewitherspoon_1581361119_2240941950393962391_367315644.jpg', title:'Book Club Founding', desc:'Early days of the Reese\'s Book Club — the movement that changed reading.', tags:'book club founding early days reading movement changed literature' },
    { id:'tb34', cat:'throwback', catLabel:'🎞️ Throwbacks', img:'reesewitherspoon/reesewitherspoon_1581439999_2241603639598822539_367315644.jpg', title:'2020 — Big Little Lies Era', desc:'Reese during the Big Little Lies era, her Emmy-winning turn as Madeline Mackenzie.', tags:'big little lies emmy madeline mackenzie 2020 hbo era winning' },
    { id:'tb35', cat:'throwback', catLabel:'🎞️ Throwbacks', img:'reesewitherspoon/reesewitherspoon_1583085205_2255404629749841480_367315644.jpg', title:'Wild — Behind the Scenes', desc:'Behind-the-scenes footage from the filming of Wild (2014).', tags:'wild behind scenes filming 2014 cheryl strayed bts production' },

    /* ── EXTRA THROWBACKS ─────────────────────────────── */
    { id:'tb36', cat:'throwback', catLabel:'🎞️ Throwbacks', img:'reesewitherspoon/reesewitherspoon_1570494823_2149788856226969089_367315644.jpg', title:'Election Era — 1999 (II)', desc:'Another shot from the Election promotional campaign — one of Reese\'s first great roles.', tags:'election 1999 tracy flick promo throwback early career comedy' },
    { id:'tb37', cat:'throwback', catLabel:'🎞️ Throwbacks', img:'reesewitherspoon/reesewitherspoon_1570494823_2149788856235408150_367315644.jpg', title:'Late 90s — On Set', desc:'On set in the late 1990s — Reese building her craft one film at a time.', tags:'late 90s on set 1999 early career building craft film' },
    { id:'tb38', cat:'throwback', catLabel:'🎞️ Throwbacks', img:'reesewitherspoon/reesewitherspoon_1570494823_2149788856243751164_367315644.jpg', title:'Rising Star — 1999', desc:'A rising star captured in 1999 — just two years before Legally Blonde changed everything.', tags:'rising star 1999 two years before legally blonde career start' },
    { id:'tb39', cat:'throwback', catLabel:'🎞️ Throwbacks', img:'reesewitherspoon/reesewitherspoon_1577995644_2212710300598288071_367315644.jpg', title:'2000 Portrait', desc:'A striking portrait from 2000 — on the cusp of superstardom.', tags:'2000 portrait cusp superstardom early career golden year' },
    { id:'tb40', cat:'throwback', catLabel:'🎞️ Throwbacks', img:'reesewitherspoon/reesewitherspoon_1578012068_2212848069844838691_367315644.jpg', title:'Millennium Reese', desc:'Reese at the turn of the millennium — fresh-faced and full of ambition.', tags:'millennium 2000 fresh faced ambition young career start throwback' },
    { id:'tb41', cat:'throwback', catLabel:'🎞️ Throwbacks', img:'reesewitherspoon/reesewitherspoon_1578511076_2217034055659204362_367315644.jpg', title:'Sweet Home Era II', desc:'Another gem from the Sweet Home Alabama era — Reese at her most charming.', tags:'sweet home alabama era 2002 charming southern belle rom com' },
    { id:'tb42', cat:'throwback', catLabel:'🎞️ Throwbacks', img:'reesewitherspoon/reesewitherspoon_1578787912_2219356325241144343_367315644.jpg', title:'Pre-Walk the Line', desc:'Reese between Legally Blonde and Walk the Line — building momentum fast.', tags:'pre walk the line legally blonde 2003 2004 career momentum building' },
    { id:'tb43', cat:'throwback', catLabel:'🎞️ Throwbacks', img:'reesewitherspoon/reesewitherspoon_1578935087_2220590916769493988_367315644.jpg', title:'Golden Year — 2004', desc:'Reese in 2004, the year she filmed Walk the Line.', tags:'golden year 2004 filming walk the line june carter oscar prep' },
    { id:'tb44', cat:'throwback', catLabel:'🎞️ Throwbacks', img:'reesewitherspoon/reesewitherspoon_1579713894_2227124026487203737_367315644.jpg', title:'Post-Oscar Glow II', desc:'Reese basking in the post-Oscar glow following her 2006 Academy Award win.', tags:'post oscar glow 2006 academy award win best actress walk line' },
    { id:'tb45', cat:'throwback', catLabel:'🎞️ Throwbacks', img:'reesewitherspoon/reesewitherspoon_1579713894_2227124026495553555_367315644.jpg', title:'2007 Classic', desc:'A classic portrait from 2007, Reese at the height of her power.', tags:'2007 classic portrait height power star hollywood royalty' },
    { id:'tb46', cat:'throwback', catLabel:'🎞️ Throwbacks', img:'reesewitherspoon/reesewitherspoon_1579713894_2227124026503885114_367315644.jpg', title:'Icon Status — 2007', desc:'Icon status achieved — Reese Witherspoon redefining Hollywood in 2007.', tags:'icon status 2007 redefining hollywood career peak royalty fame' },
    { id:'tb47', cat:'throwback', catLabel:'🎞️ Throwbacks', img:'reesewitherspoon/reesewitherspoon_1579988027_2229423619270930341_367315644.jpg', title:'2008 Elegance', desc:'Reese in 2008, entering the next chapter of her extraordinary career.', tags:'2008 elegance next chapter career evolution grace hollywood' },
    { id:'tb48', cat:'throwback', catLabel:'🎞️ Throwbacks', img:'reesewitherspoon/reesewitherspoon_1580749895_2235814635028670860_367315644.jpg', title:'Late 2000s Portrait', desc:'A polished portrait from the late 2000s — style and substance in equal measure.', tags:'late 2000s portrait polished style substance career beautiful' },
    { id:'tb49', cat:'throwback', catLabel:'🎞️ Throwbacks', img:'reesewitherspoon/reesewitherspoon_1580845730_2236618550582202909_367315644.jpg', title:'2010 — New Decade', desc:'Reese stepping into a new decade with fresh vision and unstoppable ambition.', tags:'2010 new decade fresh vision ambition hello sunshine seed producer' },
    { id:'tb50', cat:'throwback', catLabel:'🎞️ Throwbacks', img:'reesewitherspoon/reesewitherspoon_1583338954_2257533236437740718_367315644.jpg', title:'Wild Era', desc:'During the Wild press tour, Reese captivated audiences worldwide.', tags:'wild era 2014 press tour cheryl strayed oscars nomination tour' },
    { id:'tb51', cat:'throwback', catLabel:'🎞️ Throwbacks', img:'reesewitherspoon/reesewitherspoon_1584388578_2266338114152750499_367315644.jpg', title:'Hello Sunshine Founding', desc:'Around the time Reese founded Hello Sunshine in 2016, changing the industry forever.', tags:'hello sunshine founding 2016 media company women stories landmark' },
    { id:'tb52', cat:'throwback', catLabel:'🎞️ Throwbacks', img:'reesewitherspoon/reesewitherspoon_1584388578_2266338114178052967_367315644.jpg', title:'2016 Power Move', desc:'Reese\'s 2016 power move — founding Hello Sunshine while starring in Big Little Lies.', tags:'2016 power move hello sunshine big little lies hbo emmy award' },
    { id:'tb53', cat:'throwback', catLabel:'🎞️ Throwbacks', img:'reesewitherspoon/reesewitherspoon_1584457430_2266915690298612136_367315644.jpg', title:'Big Little Lies — 2017', desc:'Reese during the Big Little Lies premiere and awards campaign in 2017.', tags:'big little lies 2017 hbo premiere awards emmy golden globe campaign' },
    { id:'tb54', cat:'throwback', catLabel:'🎞️ Throwbacks', img:'reesewitherspoon/reesewitherspoon_1584457430_2266915690315307312_367315644.jpg', title:'Emmy Night 2017', desc:'Emmy night 2017 — Reese wins Outstanding Limited Series for Big Little Lies.', tags:'emmy 2017 outstanding limited series big little lies win award' },
    { id:'tb55', cat:'throwback', catLabel:'🎞️ Throwbacks', img:'reesewitherspoon/reesewitherspoon_1584457430_2266915690340478289_367315644.jpg', title:'BLL Cast Moments', desc:'Candid cast moments from the Big Little Lies press circuit.', tags:'big little lies cast candid press circuit 2017 hbo ensemble' },
    { id:'tb56', cat:'throwback', catLabel:'🎞️ Throwbacks', img:'reesewitherspoon/reesewitherspoon_1585066102_2272021602801731706_367315644.jpg', title:'2020 — Morning Show Launch', desc:'During the Apple TV+ Morning Show launch, a landmark moment for Reese.', tags:'2020 morning show launch apple tv landmark moment reese career' },
    { id:'tb57', cat:'throwback', catLabel:'🎞️ Throwbacks', img:'reesewitherspoon/reesewitherspoon_1585152312_2272744785955563172_367315644.jpg', title:'Pandemic Era Resilience', desc:'Reese staying connected with fans and projects during the 2020 pandemic.', tags:'pandemic era 2020 resilience fans connecting projects quarantine creative' },
    { id:'tb58', cat:'throwback', catLabel:'🎞️ Throwbacks', img:'reesewitherspoon/reesewitherspoon_1585239462_2273475849133093396_367315644.jpg', title:'Home Office Legend', desc:'Reese working from home during lockdown — productivity never stopped.', tags:'home office lockdown 2020 working productivity creator storyteller' },

    /* ── EXTRA CANDID ─────────────────────────────────── */
    { id:'cn36', cat:'candid', catLabel:'📸 Candid', img:'reesewitherspoon/reesewitherspoon_1585327488_2274214266594849844_367315644.jpg', title:'Backyard Bliss', desc:'Reese in her backyard — the Southern belle at peace in her favourite setting.', tags:'backyard bliss southern belle peace outdoors home candid personal' },
    { id:'cn37', cat:'candid', catLabel:'📸 Candid', img:'reesewitherspoon/reesewitherspoon_1585327488_2274214266603166755_367315644.jpg', title:'Sunny Day at Home', desc:'A sunny day at home — Reese living her most authentic life.', tags:'sunny day home authentic life candid personal lifestyle warm' },
    { id:'cn38', cat:'candid', catLabel:'📸 Candid', img:'reesewitherspoon/reesewitherspoon_1585327488_2274214266619887150_367315644.jpg', title:'Afternoon Joy', desc:'Afternoon joy captured candidly — Reese always finds the sunshine.', tags:'afternoon joy candid sunshine finds it personal happy lifestyle' },
    { id:'cn39', cat:'candid', catLabel:'📸 Candid', img:'reesewitherspoon/reesewitherspoon_1585584308_2276368623037758765_367315644.jpg', title:'Dog Days', desc:'Reese spending quality time with her beloved dogs — she\'s a huge animal lover.', tags:'dogs animals pets quality time home candid personal lifestyle' },
    { id:'cn40', cat:'candid', catLabel:'📸 Candid', img:'reesewitherspoon/reesewitherspoon_1585763362_2277870640973302662_367315644.jpg', title:'Coffee & Sunshine', desc:'Coffee and sunshine — Reese\'s perfect morning ritual.', tags:'coffee sunshine morning ritual candid personal lifestyle home cozy' },
    { id:'cn41', cat:'candid', catLabel:'📸 Candid', img:'reesewitherspoon/reesewitherspoon_1585787070_2278069518746137826_367315644.jpg', title:'Laughter Lines', desc:'Pure laughter captured candidly — Reese at her most joyful.', tags:'laughter lines joy candid pure moment personal authentic smile' },
    { id:'cn42', cat:'candid', catLabel:'📸 Candid', img:'reesewitherspoon/reesewitherspoon_1586448656_2283619299434250174_367315644.jpg', title:'Thoughtful Moment', desc:'A rare thoughtful, introspective moment captured candidly.', tags:'thoughtful introspective moment candid rare personal quiet reflective' },
    { id:'cn43', cat:'candid', catLabel:'📸 Candid', img:'reesewitherspoon/reesewitherspoon_1586621038_2285065347100862560_367315644.jpg', title:'Creative Energy', desc:'Reese radiating creative energy — always working, always thinking, always creating.', tags:'creative energy working thinking creating candid personal 2020' },
    { id:'cn44', cat:'candid', catLabel:'📸 Candid', img:'reesewitherspoon/reesewitherspoon_1587571813_2293041023607295297_367315644.jpg', title:'Family Love', desc:'A glimpse of Reese\'s warm family life — love is always at the center.', tags:'family love warm home life candid personal children motherhood' },
    { id:'cn45', cat:'candid', catLabel:'📸 Candid', img:'reesewitherspoon/reesewitherspoon_1587571813_2293041023632461063_367315644.jpg', title:'Family Joy', desc:'Joy radiating from every family moment Reese shares.', tags:'family joy radiating candid personal home life love children' },
    { id:'cn46', cat:'candid', catLabel:'📸 Candid', img:'reesewitherspoon/reesewitherspoon_1587571813_2293041023640775885_367315644.jpg', title:'Nature Walk', desc:'Reese on one of her famous nature walks — always outdoors when possible.', tags:'nature walk outdoor famous exercise lifestyle health candid' },
    { id:'cn47', cat:'candid', catLabel:'📸 Candid', img:'reesewitherspoon/reesewitherspoon_1587571813_2293041023649107292_367315644.jpg', title:'Fresh Air Fix', desc:'Fresh air and sunshine — Reese\'s ultimate wellness prescription.', tags:'fresh air sunshine wellness prescription outdoor healthy lifestyle' },
    { id:'cn48', cat:'candid', catLabel:'📸 Candid', img:'reesewitherspoon/reesewitherspoon_1587598841_2293267754637152380_367315644.jpg', title:'Book Nook', desc:'Reese in her favourite book nook — the ultimate reading corner.', tags:'book nook reading corner favourite home cozy books lifestyle' },
    { id:'cn49', cat:'candid', catLabel:'📸 Candid', img:'reesewitherspoon/reesewitherspoon_1587598841_2293267754645495443_367315644.jpg', title:'Storytime', desc:'Reese sharing her love of stories — books truly are her love language.', tags:'storytime books love language sharing stories reading personal' },
    { id:'cn50', cat:'candid', catLabel:'📸 Candid', img:'reesewitherspoon/reesewitherspoon_1587598841_2293267754662481350_367315644.jpg', title:'Instagram Diary', desc:'A page from Reese\'s Instagram diary — authentic and unfiltered.', tags:'instagram diary authentic unfiltered candid real personal social media' },

    /* ── EXTRA MOVIES & TV ────────────────────────────── */
    { id:'mv20', cat:'movietv', catLabel:'🎬 Movies & TV', img:'reesewitherspoon/reesewitherspoon_1591975593_2329982613332201438_367315644.jpg', title:'Little Fires — Behind Scenes', desc:'Behind-the-scenes from the Little Fires Everywhere production on Hulu.', tags:'little fires everywhere hulu bts behind scenes production 2020' },
    { id:'mv21', cat:'movietv', catLabel:'🎬 Movies & TV', img:'reesewitherspoon/reesewitherspoon_1591975593_2329982613340649021_367315644.jpg', title:'Little Fires — Elena II', desc:'A powerful scene still from Little Fires Everywhere as Elena Richardson.', tags:'little fires everywhere elena richardson scene still 2020 hulu dramatic' },
    { id:'mv22', cat:'movietv', catLabel:'🎬 Movies & TV', img:'reesewitherspoon/reesewitherspoon_1591975593_2329982613365903469_367315644.jpg', title:'Little Fires — Promo', desc:'Promotional imagery from the Little Fires Everywhere Hulu series.', tags:'little fires everywhere promo promotional hulu series 2020 emmy' },
    { id:'mv23', cat:'movietv', catLabel:'🎬 Movies & TV', img:'reesewitherspoon/reesewitherspoon_1591975593_2329982613374267255_367315644.jpg', title:'Little Fires — Press', desc:'Press day for Little Fires Everywhere alongside Kerry Washington.', tags:'little fires everywhere press day kerry washington hulu 2020 promo' },
    { id:'mv24', cat:'movietv', catLabel:'🎬 Movies & TV', img:'reesewitherspoon/reesewitherspoon_1591975593_2329982613382645356_367315644.jpg', title:'Little Fires — Cast', desc:'The full cast of Little Fires Everywhere at the Hulu premiere.', tags:'little fires everywhere cast hulu premiere full ensemble 2020' },
    { id:'mv25', cat:'movietv', catLabel:'🎬 Movies & TV', img:'reesewitherspoon/reesewitherspoon_1591975593_2329982613390900867_367315644.jpg', title:'Little Fires — Award Season', desc:'Reese during the Little Fires Everywhere award season campaign.', tags:'little fires everywhere award season campaign emmy golden globe 2020' },
    { id:'mv26', cat:'movietv', catLabel:'🎬 Movies & TV', img:'reesewitherspoon/reesewitherspoon_1592143032_2331387194138383902_367315644.jpg', title:'Sweet Home Alabama — BTS II', desc:'More behind-the-scenes gems from Sweet Home Alabama (2002).', tags:'sweet home alabama bts behind scenes 2002 rom com southern classic' },
    { id:'mv27', cat:'movietv', catLabel:'🎬 Movies & TV', img:'reesewitherspoon/reesewitherspoon_1592143032_2331387194155059386_367315644.jpg', title:'Sweet Home Alabama — Set III', desc:'On set during Sweet Home Alabama, one of Reese\'s most beloved comedies.', tags:'sweet home alabama set 2002 beloved comedy southern romance classic' },

    /* ── EXTRA BOOK CLUB ──────────────────────────────── */
    { id:'hs25', cat:'sunshine', catLabel:'☀️ Hello Sunshine', img:'reesewitherspoon/reesesbookclub_1693063724_3177971311774149582_2249417883.jpg', title:'Book Club — Special Edition', desc:'A special edition book club moment — Reese choosing books that change lives.', tags:'book club special edition books change lives reese pick curation' },
    { id:'hs26', cat:'sunshine', catLabel:'☀️ Hello Sunshine', img:'reesewitherspoon/reesewitherspoon_1592670045_2335808098188545410_367315644.jpg', title:'Book Club 2020 Launch', desc:'Launching the 2020 book club season with fresh, bold picks for women.', tags:'book club 2020 launch fresh bold picks women literature stories' },
    { id:'hs27', cat:'sunshine', catLabel:'☀️ Hello Sunshine', img:'reesewitherspoon/reesewitherspoon_1592670045_2335808098197033185_367315644.jpg', title:'Reading for the Soul', desc:'Reading for the soul — Reese\'s book club is a movement, not just a list.', tags:'reading soul movement not list book club women literature community' },
    { id:'hs28', cat:'sunshine', catLabel:'☀️ Hello Sunshine', img:'reesewitherspoon/reesewitherspoon_1592670045_2335808098213717925_367315644.jpg', title:'Hello Sunshine 2020', desc:'Hello Sunshine making waves in 2020 despite the pandemic.', tags:'hello sunshine 2020 waves pandemic resilience media women stories' },
    { id:'hs29', cat:'sunshine', catLabel:'☀️ Hello Sunshine', img:'reesewitherspoon/reesewitherspoon_1593027733_2338808605299487607_367315644.jpg', title:'Storytelling at Scale', desc:'Hello Sunshine\'s storytelling at scale — reaching millions with women\'s voices.', tags:'storytelling scale millions women voices hello sunshine media 2020' },

    /* ── EXTRA FASHION ────────────────────────────────── */
    { id:'fa27', cat:'fashion', catLabel:'👗 Fashion', img:'reesewitherspoon/reesewitherspoon_1584547476_2267671053092292499_367315644.jpg', title:'Quarantine Chic', desc:'Reese proving you can be chic even in quarantine — style is a state of mind.', tags:'quarantine chic style state of mind 2020 fashion personal home look' },
    { id:'fa28', cat:'fashion', catLabel:'👗 Fashion', img:'reesewitherspoon/reesewitherspoon_1584634208_2268398610771196679_367315644.jpg', title:'Southern Summer Style', desc:'Reese in a beautiful summer look — Southern style at its most vibrant.', tags:'southern summer style vibrant beautiful fashion look personal lifestyle' },
    { id:'fa29', cat:'fashion', catLabel:'👗 Fashion', img:'reesewitherspoon/reesewitherspoon_1584634208_2268398610779615984_367315644.jpg', title:'Summer Whites', desc:'Reese in crisp summer whites — timeless, elegant and effortlessly beautiful.', tags:'summer whites crisp timeless elegant effortless beautiful fashion style' },
    { id:'fa30', cat:'fashion', catLabel:'👗 Fashion', img:'reesewitherspoon/reesewitherspoon_1584721083_2269127367173851422_367315644.jpg', title:'Floral Power', desc:'Reese in full floral power — a nod to her Draper James Southern roots.', tags:'floral power draper james southern roots fashion style personal brand' },
    { id:'fa31', cat:'fashion', catLabel:'👗 Fashion', img:'reesewitherspoon/reesewitherspoon_1584721083_2269127367198781831_367315644.jpg', title:'Sunday Best', desc:'Sunday best — Reese dressed to perfection for a relaxed weekend look.', tags:'sunday best weekend relaxed perfection look style southern fashion' },
    { id:'fa32', cat:'fashion', catLabel:'👗 Fashion', img:'reesewitherspoon/reesewitherspoon_1587919059_2295953938937135880_367315644.jpg', title:'Draper James Campaign II', desc:'Another stunning campaign for the beloved Draper James fashion brand.', tags:'draper james campaign stunning beloved brand fashion southern style 2' },
    { id:'fa33', cat:'fashion', catLabel:'👗 Fashion', img:'reesewitherspoon/reesewitherspoon_1588354011_2299602581879632221_367315644.jpg', title:'Fashion Moments 2020', desc:'Reese\'s top fashion moments from 2020 — even staying home, she never missed.', tags:'fashion moments 2020 top home style never missed chic personality' },
    { id:'fa34', cat:'fashion', catLabel:'👗 Fashion', img:'reesewitherspoon/reesewitherspoon_1588435588_2300286895386589993_367315644.jpg', title:'Bright & Bold', desc:'Bright and bold — Reese\'s colour choices always tell a story.', tags:'bright bold colour choices story fashion style personal expression' },
    { id:'fa35', cat:'fashion', catLabel:'👗 Fashion', img:'reesewitherspoon/reesewitherspoon_1588435588_2300286895445273804_367315644.jpg', title:'Statement Accessories', desc:'Reese making a statement with her accessories — the details always matter.', tags:'statement accessories details matter fashion style personal look' },
    { id:'fa36', cat:'fashion', catLabel:'👗 Fashion', img:'reesewitherspoon/reesewitherspoon_1588611082_2301759048124491187_367315644.jpg', title:'Casual Glam', desc:'Casual glamour — Reese looking effortlessly stunning in a low-key look.', tags:'casual glamour effortless stunning low key look fashion personal' },
    { id:'fa37', cat:'fashion', catLabel:'👗 Fashion', img:'reesewitherspoon/reesewitherspoon_1588611082_2301759048141288923_367315644.jpg', title:'Feminine Force', desc:'The feminine force of fashion — Reese owns every look she wears.', tags:'feminine force fashion owns look style confidence power personal' },
    { id:'fa38', cat:'fashion', catLabel:'👗 Fashion', img:'reesewitherspoon/reesewitherspoon_1588965745_2304734173522376815_367315644.jpg', title:'Monochrome Moment', desc:'A chic monochrome moment — Reese showing her high-fashion credentials.', tags:'monochrome chic high fashion credentials moment style editorial 2020' },
    { id:'fa39', cat:'fashion', catLabel:'👗 Fashion', img:'reesewitherspoon/reesewitherspoon_1589043216_2305384047096045149_367315644.jpg', title:'Weekend Wardrobe', desc:'Reese\'s weekend wardrobe goals — relaxed, polished and always inspired.', tags:'weekend wardrobe goals relaxed polished inspired fashion personal style' },
    { id:'fa40', cat:'fashion', catLabel:'👗 Fashion', img:'reesewitherspoon/reesewitherspoon_1589566769_2309775934556925602_367315644.jpg', title:'Spring Garden Style', desc:'Spring garden style — Reese blooming just like the flowers around her.', tags:'spring garden style blooming flowers outdoors fashion look seasonal' },
    { id:'fa41', cat:'fashion', catLabel:'👗 Fashion', img:'reesewitherspoon/reesewitherspoon_1589908172_2312639825779527962_367315644.jpg', title:'Garden Party Look', desc:'Garden party perfection — a quintessential Reese Witherspoon fashion moment.', tags:'garden party perfection quintessential fashion moment style look outdoor' },
    { id:'fa42', cat:'fashion', catLabel:'👗 Fashion', img:'reesewitherspoon/reesewitherspoon_1589908172_2312639825913617327_367315644.jpg', title:'Southern Charm Style', desc:'Southern charm in every thread — Reese embodies her brand philosophy daily.', tags:'southern charm thread brand philosophy daily fashion lifestyle personal' },
  ];

  /* ══════════════════════════════════════════════════════════
     2. STATE
  ══════════════════════════════════════════════════════════ */
  const PAGE_SIZE   = 16;
  let activeFilter  = 'all';
  let searchQuery   = '';
  let visibleCount  = PAGE_SIZE;
  let currentIndex  = -1;
  let isGridView    = false;

  /* ══════════════════════════════════════════════════════════
     3. RENDER HELPERS
  ══════════════════════════════════════════════════════════ */
  function getFiltered() {
    return GALLERY.filter(item => {
      const catMatch = activeFilter === 'all' || item.cat === activeFilter;
      if (!catMatch) return false;
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.desc.toLowerCase().includes(q) ||
        item.tags.toLowerCase().includes(q) ||
        item.catLabel.toLowerCase().includes(q)
      );
    });
  }

  function catEmoji(cat) {
    return { redcarpet:'🌟', movietv:'🎬', candid:'📸', sunshine:'☀️', fashion:'👗', throwback:'🎞️' }[cat] || '✦';
  }

  function catName(cat) {
    return { redcarpet:'Red Carpet', movietv:'Movies & TV', candid:'Candid', sunshine:'Hello Sunshine', fashion:'Fashion', throwback:'Throwbacks' }[cat] || cat;
  }

  function buildCard(item, delay) {
    const el = document.createElement('div');
    el.className = 'mg-item';
    el.dataset.id  = item.id;
    el.dataset.galCat = item.cat;
    el.style.animationDelay = `${delay * 0.04}s`;
    el.setAttribute('aria-label', item.title);
    el.setAttribute('role', 'button');
    el.setAttribute('tabindex', '0');
    el.innerHTML = `
      <img src="${item.img}" alt="${item.title} — Reese Witherspoon official photo" loading="lazy" onerror="this.parentElement.style.display='none'"/>
      <div class="mg-overlay">
        <div class="mg-overlay-text">
          <div class="mg-overlay-cat">${catEmoji(item.cat)} ${catName(item.cat)}</div>
          <div class="mg-overlay-title">${item.title}</div>
        </div>
        <div class="mg-zoom">⤢</div>
      </div>`;
    el.addEventListener('click', () => openLightbox(item.id));
    el.addEventListener('keydown', e => { if (e.key === 'Enter') openLightbox(item.id); });
    return el;
  }

  /* ══════════════════════════════════════════════════════════
     4. RENDER GRID
  ══════════════════════════════════════════════════════════ */
  function renderGrid() {
    const grid     = document.getElementById('masonryGrid');
    const empty    = document.getElementById('gal-empty');
    const info     = document.getElementById('gal-showing');
    const lmWrap   = document.getElementById('gal-load-more-wrap');
    const lmBtn    = document.getElementById('gal-load-more');
    const lmInfo   = document.getElementById('gal-load-info');
    const filtered = getFiltered();
    const batch    = filtered.slice(0, visibleCount);

    if (grid && grid.children.length > 0 && !grid.dataset.hydrated && activeFilter === 'all' && !searchQuery) {
      grid.dataset.hydrated = 'true';
      Array.from(grid.querySelectorAll('.mg-item')).forEach(el => {
        const id = el.dataset.id;
        el.addEventListener('click', () => openLightbox(id));
        el.addEventListener('keydown', e => { if (e.key === 'Enter') openLightbox(id); });
      });
      const remaining = filtered.length - batch.length;
      if (remaining > 0) {
        lmWrap.style.display = 'flex';
        lmBtn.disabled = false;
        lmBtn.innerHTML = `Load ${Math.min(remaining, PAGE_SIZE)} More <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path d="M12 5v14M5 12l7 7 7-7"/></svg>`;
        lmInfo.textContent = `Showing ${batch.length} of ${filtered.length} photos`;
      } else {
        lmWrap.style.display = 'none';
        lmInfo.textContent = '';
      }
      info.textContent = `Showing ${batch.length} of ${filtered.length} photos`;
      return;
    }

    grid.innerHTML = '';

    if (!filtered.length) {
      empty.style.display = 'block';
      lmWrap.style.display = 'none';
      info.textContent = 'No photos found.';
      return;
    }
    empty.style.display = 'none';

    batch.forEach((item, i) => grid.appendChild(buildCard(item, i)));

    // Show/hide Load More
    const remaining = filtered.length - batch.length;
    if (remaining > 0) {
      lmWrap.style.display = 'flex';
      lmBtn.disabled = false;
      lmBtn.innerHTML = `Load ${Math.min(remaining, PAGE_SIZE)} More <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path d="M12 5v14M5 12l7 7 7-7"/></svg>`;
      lmInfo.textContent = `Showing ${batch.length} of ${filtered.length} photos`;
    } else {
      lmWrap.style.display = 'none';
      lmInfo.textContent = '';
    }

    info.textContent = searchQuery
      ? `${filtered.length} photo${filtered.length !== 1 ? 's' : ''} matching "${searchQuery}"`
      : `Showing ${Math.min(batch.length, filtered.length)} of ${filtered.length} photo${filtered.length !== 1 ? 's' : ''}`;

    updateCounts();
  }

  /* ══════════════════════════════════════════════════════════
     5. CATEGORY COUNTS
  ══════════════════════════════════════════════════════════ */
  function updateCounts() {
    const cats = ['all','redcarpet','movietv','candid','sunshine','fashion','throwback'];
    cats.forEach(c => {
      const el = document.getElementById(`count-${c}`);
      if (!el) return;
      const n = c === 'all' ? GALLERY.length : GALLERY.filter(i => i.cat === c).length;
      el.textContent = n;
    });
  }

  /* ══════════════════════════════════════════════════════════
     6. LIGHTBOX
  ══════════════════════════════════════════════════════════ */
  function openLightbox(id) {
    const filtered = getFiltered();
    currentIndex   = filtered.findIndex(i => i.id === id);
    if (currentIndex === -1) return;
    showLightboxItem(filtered[currentIndex], filtered);
    document.getElementById('lightbox').classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    document.getElementById('lightbox').classList.remove('active');
    document.body.style.overflow = '';
    currentIndex = -1;
  }

  function navLightbox(dir) {
    const filtered = getFiltered();
    currentIndex = (currentIndex + dir + filtered.length) % filtered.length;
    showLightboxItem(filtered[currentIndex], filtered);
  }

  function showLightboxItem(item, all) {
    const img    = document.getElementById('lb-img');
    const loader = document.getElementById('lb-loader');

    // Image with loader
    img.classList.add('loading');
    loader.classList.add('visible');
    img.src = item.img;
    img.alt = item.title + ' — Reese Witherspoon official photo';
    img.onload = () => { img.classList.remove('loading'); loader.classList.remove('visible'); };
    img.onerror = () => { img.classList.remove('loading'); loader.classList.remove('visible'); };

    // Meta
    document.getElementById('lb-cat').textContent = `${catEmoji(item.cat)} ${catName(item.cat)}`;
    document.getElementById('lb-title').textContent = item.title;
    document.getElementById('lb-desc').textContent = item.desc;
    document.getElementById('lb-counter').textContent = `Photo ${currentIndex + 1} of ${all.length}`;

    // Download
    const dlBtn = document.getElementById('lb-download');
    dlBtn.href = item.img;
    dlBtn.setAttribute('download', `reese-witherspoon-${item.id}.jpg`);

    // Pinterest
    document.getElementById('lb-pinterest').onclick = () => {
      const url = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(window.location.href)}&media=${encodeURIComponent(window.location.origin + '/' + item.img)}&description=${encodeURIComponent(item.title + ' — Reese Witherspoon')}`;
      window.open(url, '_blank', 'width=750,height=600');
    };

    // Share
    document.getElementById('lb-share').onclick = () => {
      if (navigator.share) {
        navigator.share({ title: item.title, text: item.desc, url: window.location.href });
      } else {
        navigator.clipboard?.writeText(window.location.href);
        window.showToast?.('📋 Link copied!');
      }
    };

    // Thumbnails — show up to 9 around current
    buildThumbnails(all);
  }

  function buildThumbnails(all) {
    const strip = document.getElementById('lb-thumbnails');
    strip.innerHTML = '';
    const start = Math.max(0, currentIndex - 4);
    const end   = Math.min(all.length, start + 9);
    for (let i = start; i < end; i++) {
      const item = all[i];
      const thumb = document.createElement('div');
      thumb.className = 'lb-thumb' + (i === currentIndex ? ' lb-thumb-active' : '');
      thumb.innerHTML = `<img src="${item.img}" alt="${item.title} — Reese Witherspoon official photo" loading="lazy"/>`;
      thumb.addEventListener('click', () => {
        currentIndex = i;
        showLightboxItem(all[i], all);
      });
      strip.appendChild(thumb);
    }
  }

  /* ══════════════════════════════════════════════════════════
     7. SEARCH
  ══════════════════════════════════════════════════════════ */
  function initSearch() {
    const input = document.getElementById('gal-search');
    const clear = document.getElementById('gal-search-clear');
    if (!input) return;

    input.addEventListener('input', () => {
      searchQuery  = input.value.trim();
      visibleCount = PAGE_SIZE;
      clear.classList.toggle('visible', searchQuery.length > 0);
      renderGrid();
    });
    clear.addEventListener('click', () => {
      input.value = ''; searchQuery = '';
      clear.classList.remove('visible');
      renderGrid();
      input.focus();
    });
  }

  /* ══════════════════════════════════════════════════════════
     8. FILTER BUTTONS
  ══════════════════════════════════════════════════════════ */
  function initFilters() {
    document.querySelectorAll('.gal-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.gal-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeFilter = btn.dataset.gal;
        visibleCount = PAGE_SIZE;
        renderGrid();
      });
    });
  }

  /* ══════════════════════════════════════════════════════════
     9. LOAD MORE
  ══════════════════════════════════════════════════════════ */
  function initLoadMore() {
    const btn = document.getElementById('gal-load-more');
    if (!btn) return;
    btn.addEventListener('click', () => {
      visibleCount += PAGE_SIZE;
      renderGrid();
      // Scroll to new items
      setTimeout(() => {
        const items = document.querySelectorAll('.mg-item');
        items[visibleCount - PAGE_SIZE]?.scrollIntoView({ behavior:'smooth', block:'center' });
      }, 100);
    });
  }

  /* ══════════════════════════════════════════════════════════
     10. VIEW TOGGLE (masonry <-> grid)
  ══════════════════════════════════════════════════════════ */
  function initViewToggle() {
    const grid     = document.getElementById('masonryGrid');
    const masonBtn = document.getElementById('view-masonry');
    const gridBtn  = document.getElementById('view-grid');
    if (!masonBtn) return;

    masonBtn.addEventListener('click', () => {
      isGridView = false;
      grid.classList.remove('view-grid');
      masonBtn.classList.add('active'); gridBtn.classList.remove('active');
    });
    gridBtn.addEventListener('click', () => {
      isGridView = true;
      grid.classList.add('view-grid');
      gridBtn.classList.add('active'); masonBtn.classList.remove('active');
    });
  }

  /* ══════════════════════════════════════════════════════════
     11. KEYBOARD + LIGHTBOX EVENTS
  ══════════════════════════════════════════════════════════ */
  function initLightboxEvents() {
    document.getElementById('lb-close')?.addEventListener('click', closeLightbox);
    document.getElementById('lb-backdrop')?.addEventListener('click', closeLightbox);
    document.getElementById('lb-prev')?.addEventListener('click', () => navLightbox(-1));
    document.getElementById('lb-next')?.addEventListener('click', () => navLightbox(+1));

    document.addEventListener('keydown', e => {
      const lb = document.getElementById('lightbox');
      if (!lb?.classList.contains('active')) return;
      if (e.key === 'Escape')      closeLightbox();
      if (e.key === 'ArrowLeft')   navLightbox(-1);
      if (e.key === 'ArrowRight')  navLightbox(+1);
    });

    // Touch swipe for mobile
    let touchStartX = 0;
    const lb = document.getElementById('lightbox');
    lb?.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; });
    lb?.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 50) navLightbox(dx < 0 ? 1 : -1);
    });
  }

  /* ══════════════════════════════════════════════════════════
     12. URL DEEP-LINKING (?filter=category)
  ══════════════════════════════════════════════════════════ */
  function checkUrlFilter() {
    const params = new URLSearchParams(window.location.search);
    const f = params.get('filter');
    if (f && ['redcarpet','movietv','candid','sunshine','fashion','throwback'].includes(f)) {
      activeFilter = f;
      const btn = document.querySelector(`.gal-btn[data-gal="${f}"]`);
      if (btn) {
        document.querySelectorAll('.gal-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      }
    }
  }

  /* ══════════════════════════════════════════════════════════
     13. INIT
  ══════════════════════════════════════════════════════════ */
  function init() {
    checkUrlFilter();
    initSearch();
    initFilters();
    initLoadMore();
    initViewToggle();
    initLightboxEvents();
    renderGrid();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

})();
