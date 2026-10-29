/* ═══════════════════════════════════════════════════════════════
   reels.js — Complete Reels Library System
   30 curated video clips across 5 categories, all local MP4s
   - Category filters with live counts
   - Search / keyword filtering
   - 3-col / 2-col view toggle
   - Load More pagination (12 per batch)
   - Hover-play preview (autoplay on hover, pause on leave)
   - Video modal with related clips, share, download
   - Set any clip as the hero featured video
   - URL ?tab=category deep-linking
   - Keyboard Esc to close modal
═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ══════════════════════════════════════════════════════════
     1. VIDEO DATA — 32 clips across 5 categories
        All using local MP4 files from the assets folder
  ══════════════════════════════════════════════════════════ */
  const REELS = [

    /* ── INTERVIEWS ───────────────────────────────────────── */
    {
      id: 'int01', tab: 'interviews', catLabel: '🎤 Interview',
      title: 'The Tonight Show with Jimmy Fallon — 2024',
      desc: 'Reese joins Jimmy Fallon for an unforgettable late-night chat about The Morning Show Season 4 and Legally Blonde 3.',
      src: 'reesewitherspoon/fallontonight_1757645311_3719720795687025530_18100510.mp4',
      poster: 'reesewitherspoon/reesewitherspoon_1690722597_3158332521502672884_367315644.jpg',
      duration: 'TV Clip', tags: 'fallon tonight show interview tv 2024 morning show'
    },
    {
      id: 'int02', tab: 'interviews', catLabel: '🎤 Interview',
      title: 'Tonight Show — Funny Moments with Fallon',
      desc: 'Reese and Jimmy share hilarious chemistry in this fan-favourite Tonight Show segment.',
      src: 'reesewitherspoon/fallontonight_1665016428_2942689790496040938_18100510.mp4',
      poster: 'reesewitherspoon/reesewitherspoon_1778780649_3897016730459253662_367315644.jpg',
      duration: 'Interview', tags: 'fallon tonight show funny comedy laughing moments'
    },
    {
      id: 'int03', tab: 'interviews', catLabel: '🎤 Interview',
      title: 'Tonight Show — Extended Interview',
      desc: 'An extended sit-down with Fallon covering books, Hello Sunshine, and what\'s coming next.',
      src: 'reesewitherspoon/fallontonight_1665085049_2943267799889287180_18100510.mp4',
      poster: 'reesewitherspoon/reesewitherspoon_1777822494_3888971826742726686_367315644.jpg',
      duration: 'Extended', tags: 'fallon tonight show extended interview hello sunshine books'
    },
    {
      id: 'int04', tab: 'interviews', catLabel: '🎤 Interview',
      title: 'Tonight Show — 2025 Appearance',
      desc: 'Reese\'s latest Tonight Show appearance, discussing her upcoming projects and life in Nashville.',
      src: 'reesewitherspoon/fallontonight_1739915579_3570992601580209432_18100510.mp4',
      poster: 'reesewitherspoon/reesewitherspoon_1779634961_3904183025843630670_367315644.jpg',
      duration: 'TV Clip', tags: 'fallon 2025 tonight show nashville projects upcoming'
    },
    {
      id: 'int05', tab: 'interviews', catLabel: '🎤 Interview',
      title: 'Cosmopolitan — Reese Witherspoon Interview',
      desc: 'Behind the scenes of the Cosmopolitan 2024 shoot — Reese talks empowerment, style, and building an empire.',
      src: 'reesewitherspoon/cosmopolitan_1750240854_3657592860719674368_42725516.mp4',
      poster: 'reesewitherspoon/cosmopolitan_1750240854_3657592786824360179_42725516.jpg',
      duration: 'Magazine', tags: 'cosmopolitan 2024 interview magazine empowerment style empire fashion'
    },
    {
      id: 'int06', tab: 'interviews', catLabel: '🎤 Interview',
      title: 'Good Inside — Dr. Becky Kennedy Podcast',
      desc: 'Reese joins Dr. Becky Kennedy on the Good Inside podcast to talk parenting, self-worth, and her journey.',
      src: 'reesewitherspoon/drbeckyatgoodinside_1696453628_3206406297930444801_25924063931.mp4',
      poster: 'reesewitherspoon/reesewitherspoon_1778888767_3897921861991215508_367315644.jpg',
      duration: 'Podcast', tags: 'dr becky kennedy good inside podcast parenting self worth journey'
    },
    {
      id: 'int07', tab: 'interviews', catLabel: '🎤 Interview',
      title: 'Melinda French Gates — Women in Power',
      desc: 'A powerful conversation between Reese and Melinda French Gates on women, leadership, and changing the world.',
      src: 'reesewitherspoon/melindafrenchgates_1723223967_3430972630644457653_612780582.mp4',
      poster: 'reesewitherspoon/reesewitherspoon_1601570758_2410472685298603652_367315644.jpg',
      duration: 'Interview', tags: 'melinda french gates women leadership power conversation philanthropy'
    },
    {
      id: 'int08', tab: 'interviews', catLabel: '🎤 Interview',
      title: 'Reese — Personal Instagram Reel 2025',
      desc: 'A candid, personal Instagram Reel from Reese — the authentic side fans love most.',
      src: 'reesewitherspoon/reesewitherspoon_1779298397_3901355394135873294_367315644.mp4',
      poster: 'reesewitherspoon/reesewitherspoon_1779634961_3904183028792210490_367315644.jpg',
      duration: 'Reel', tags: 'personal instagram reel 2025 candid authentic fans'
    },

    /* ── MOVIE & TV ───────────────────────────────────────── */
    {
      id: 'mv01', tab: 'movietv', catLabel: '🎬 Movie & TV',
      title: 'Legally Blonde 3 — Amazon Prime Video Announcement',
      desc: 'Elle Woods is BACK! Amazon Prime Video officially announces Legally Blonde 3 with Reese Witherspoon.',
      src: 'reesewitherspoon/primevideo_1778083206_3891149648178026686_1684102154.mp4',
      poster: 'reesewitherspoon/primevideo_1778080751_3891145722754448008_1684102154.jpg',
      duration: 'Announcement', tags: 'legally blonde 3 amazon prime video announcement elle woods sequel official'
    },
    {
      id: 'mv02', tab: 'movietv', catLabel: '🎬 Movie & TV',
      title: 'The Morning Show — Apple TV+ Clip',
      desc: 'Reese as Bradley Jackson in a gripping scene from The Morning Show on Apple TV+.',
      src: 'reesewitherspoon/appletv_1752069614_3672932722377193549_6672060127.mp4',
      poster: 'reesewitherspoon/reesewitherspoon_1640021819_2733023570386325475_367315644.jpg',
      duration: 'TV Clip', tags: 'morning show apple tv bradley jackson season clip drama'
    },
    {
      id: 'mv03', tab: 'movietv', catLabel: '🎬 Movie & TV',
      title: 'Little Fires Everywhere — Kerry Washington BTS',
      desc: 'Behind the scenes with Kerry Washington as they bring the groundbreaking Hulu series to life.',
      src: 'reesewitherspoon/kerrywashington_1661799678_2915708616331989391_20240005.mp4',
      poster: 'reesewitherspoon/reesewitherspoon_1591975593_2329982613323954854_367315644.jpg',
      duration: 'BTS', tags: 'little fires everywhere kerry washington hulu bts behind scenes series'
    },
    {
      id: 'mv04', tab: 'movietv', catLabel: '🎬 Movie & TV',
      title: 'Reese — On-Set Reel 2024',
      desc: 'An exclusive look at Reese on set during a 2024 production — cinematic, raw, and beautiful.',
      src: 'reesewitherspoon/reesewitherspoon_1778602580_3895522713301136158_367315644.mp4',
      poster: 'reesewitherspoon/reesewitherspoon_1631032626_2657616754214583213_367315644.jpg',
      duration: 'On Set', tags: 'on set 2024 production filming behind scenes exclusive'
    },
    {
      id: 'mv05', tab: 'movietv', catLabel: '🎬 Movie & TV',
      title: 'Morning Show — Season Promo Reel',
      desc: 'A dynamic promo reel for The Morning Show — Bradley Jackson is back and bolder than ever.',
      src: 'reesewitherspoon/reesewitherspoon_1777997212_3890443877453509590_367315644.mp4',
      poster: 'reesewitherspoon/reesewitherspoon_1583010420_2254777285947219792_367315644.jpg',
      duration: 'Promo', tags: 'morning show promo reel season bradley jackson bold drama apple'
    },
    {
      id: 'mv06', tab: 'movietv', catLabel: '🎬 Movie & TV',
      title: 'Sunnie — Reese\'s New Project Teaser',
      desc: 'Teaser for Sunnie — the exciting new project from Reese\'s production slate.',
      src: 'reesewitherspoon/sunnie_1750251549_3657696028569270911_56789568378.mp4',
      poster: 'reesewitherspoon/reesewitherspoon_1624029970_2598874215562248361_367315644.jpg',
      duration: 'Teaser', tags: 'sunnie new project teaser production upcoming 2024'
    },
    {
      id: 'mv07', tab: 'movietv', catLabel: '🎬 Movie & TV',
      title: 'Reese — Action Reel 2024',
      desc: 'A high-energy action reel from Reese\'s 2024 projects — she never stops working.',
      src: 'reesewitherspoon/reesewitherspoon_1776810065_3880486353473713725_367315644.mp4',
      poster: 'reesewitherspoon/reesewitherspoon_1597676628_2377806355974102153_367315644.jpg',
      duration: 'Reel', tags: 'action reel 2024 projects working production energy'
    },

    /* ── HELLO SUNSHINE & BOOK CLUB ──────────────────────── */
    {
      id: 'hs01', tab: 'sunshine', catLabel: '☀️ Hello Sunshine',
      title: 'Book Club — Monthly Pick Announcement',
      desc: 'Reese announces this month\'s Reese\'s Book Club pick — every selection changes a book\'s destiny.',
      src: 'reesewitherspoon/reesesbookclub_1658941496_2891732822644896018_2249417883.mp4',
      poster: 'reesewitherspoon/reesesbookclub_1693063724_3177971311774135084_2249417883.jpg',
      duration: 'Book Club', tags: 'book club monthly pick announcement Reese\'s books reading selection'
    },
    {
      id: 'hs02', tab: 'sunshine', catLabel: '☀️ Hello Sunshine',
      title: 'Hello Sunshine — Inspirational Message',
      desc: 'Reese shares an inspiring message about storytelling, women\'s voices, and changing the world.',
      src: 'reesewitherspoon/reesewitherspoon_1776466114_3877601091592773918_367315644.mp4',
      poster: 'reesewitherspoon/reesesbookclub_1693063724_3177971311740674109_2249417883.jpg',
      duration: 'Message', tags: 'hello sunshine inspirational storytelling women voices world message'
    },
    {
      id: 'hs03', tab: 'sunshine', catLabel: '☀️ Hello Sunshine',
      title: 'Hello Sunshine — Media Announcement',
      desc: 'An exciting Hello Sunshine announcement about upcoming productions and new story collaborations.',
      src: 'reesewitherspoon/reesewitherspoon_1776286480_3876093017719945238_367315644.mp4',
      poster: 'reesewitherspoon/reesesbookclub_1693063724_3177971311782426977_2249417883.jpg',
      duration: 'Announcement', tags: 'hello sunshine announcement productions stories collaborations media'
    },
    {
      id: 'hs04', tab: 'sunshine', catLabel: '☀️ Hello Sunshine',
      title: 'Reese on Women\'s Stories',
      desc: '"I believe deeply that women\'s stories matter." Reese on why she built Hello Sunshine.',
      src: 'reesewitherspoon/reesewitherspoon_1776009516_3873770368008278109_367315644.mp4',
      poster: 'reesewitherspoon/reesesbookclub_1693063724_3177971311782487782_2249417883.jpg',
      duration: 'Reel', tags: 'women stories matter hello sunshine why built mission purpose'
    },
    {
      id: 'hs05', tab: 'sunshine', catLabel: '☀️ Hello Sunshine',
      title: 'Hello Sunshine Creator Series',
      desc: 'Behind the scenes of Hello Sunshine\'s creator series — how the magic is made.',
      src: 'reesewitherspoon/reesewitherspoon_1774969819_3865048945550818902_367315644.mp4',
      poster: 'reesewitherspoon/reesesbookclub_1693063724_3177971311824351194_2249417883.jpg',
      duration: 'BTS', tags: 'hello sunshine creator series behind scenes magic made production'
    },
    {
      id: 'hs06', tab: 'sunshine', catLabel: '☀️ Hello Sunshine',
      title: 'Book Club — Reading Recommendation',
      desc: 'Reese\'s personal reading recommendation — her genuine passion for books comes through.',
      src: 'reesewitherspoon/reesewitherspoon_1774798909_3863614301106267126_367315644.mp4',
      poster: 'reesewitherspoon/reesesbookclub_1693063724_3177971311765622810_2249417883.jpg',
      duration: 'Book Reel', tags: 'book club reading recommendation personal passion genuine books'
    },

    /* ── LIFESTYLE & CANDID ───────────────────────────────── */
    {
      id: 'ls01', tab: 'lifestyle', catLabel: '📸 Lifestyle',
      title: 'Nashville Morning — Candid Clip',
      desc: 'A candid morning clip from Nashville — Reese\'s Southern roots always shining through.',
      src: 'reesewitherspoon/reesewitherspoon_1779027421_3899086478961087015_367315644.mp4',
      poster: 'reesewitherspoon/reesewitherspoon_1778780649_3897016730459253662_367315644.jpg',
      duration: 'Candid', tags: 'nashville morning candid southern roots lifestyle personal'
    },
    {
      id: 'ls02', tab: 'lifestyle', catLabel: '📸 Lifestyle',
      title: 'Reese\'s Daily Routine Reel',
      desc: 'A peek inside Reese\'s daily routine — early mornings, reading, and making things happen.',
      src: 'reesewitherspoon/reesewitherspoon_1778888767_3897921942007444963_367315644.mp4',
      poster: 'reesewitherspoon/reesewitherspoon_1778888767_3897921861991215508_367315644.jpg',
      duration: 'Reel', tags: 'daily routine early mornings reading making things happen lifestyle'
    },
    {
      id: 'ls03', tab: 'lifestyle', catLabel: '📸 Lifestyle',
      title: 'Summer 2025 Lifestyle Reel',
      desc: 'Sunshine, flowers, and joy — Reese\'s quintessential summer 2025 lifestyle reel.',
      src: 'reesewitherspoon/reesewitherspoon_1775563205_3870025325296378718_367315644.jpg',
      poster: 'reesewitherspoon/reesewitherspoon_1634488279_2686604866087878895_367315644.jpg',
      duration: 'Lifestyle', tags: 'summer 2025 sunshine flowers joy quintessential lifestyle seasonal',
      isJpg: true
    },
    {
      id: 'ls04', tab: 'lifestyle', catLabel: '📸 Lifestyle',
      title: 'Holiday Season — Reese at Home',
      desc: 'A warm, festive reel from the holiday season — Reese decorating, laughing, and celebrating.',
      src: 'reesewitherspoon/reesewitherspoon_1773676908_3854201687607430646_367315644.mp4',
      poster: 'reesewitherspoon/reesewitherspoon_1612292642_2500414372850068622_367315644.jpg',
      duration: 'Holiday', tags: 'holiday season home decorating laughing celebrating festive family'
    },
    {
      id: 'ls05', tab: 'lifestyle', catLabel: '📸 Lifestyle',
      title: 'Garden & Nature Reel',
      desc: 'Reese\'s love for her garden and the outdoors — a meditative, beautiful clip.',
      src: 'reesewitherspoon/reesewitherspoon_1773327704_3851273497259901514_367315644.mp4',
      poster: 'reesewitherspoon/reesewitherspoon_1623598723_2595256651556757886_367315644.jpg',
      duration: 'Reel', tags: 'garden nature outdoors meditative beautiful clip lifestyle flowers'
    },
    {
      id: 'ls06', tab: 'lifestyle', catLabel: '📸 Lifestyle',
      title: 'Fun & Funny — Reese Being Reese',
      desc: 'Pure, unfiltered Reese — funny, genuine, and completely lovable.',
      src: 'reesewitherspoon/reesewitherspoon_1772816227_3846983443674949440_367315644.mp4',
      poster: 'reesewitherspoon/reesewitherspoon_1634488279_2686604866087878895_367315644.jpg',
      duration: 'Candid', tags: 'funny genuine lovable candid unfiltered funny being reese personality'
    },
    {
      id: 'ls07', tab: 'lifestyle', catLabel: '📸 Lifestyle',
      title: 'Draper James — Fashion Reel',
      desc: 'Reese shows off the latest Draper James collection in an effortlessly stylish reel.',
      src: 'reesewitherspoon/reesewitherspoon_1772559404_3844826993427285029_367315644.mp4',
      poster: 'reesewitherspoon/reesewitherspoon_1774191874_3858523271864335054_367315644.jpg',
      duration: 'Fashion', tags: 'draper james fashion reel collection stylish clothing brand southern'
    },

    /* ── THROWBACKS / EARLY CAREER ───────────────────────── */
    {
      id: 'tb01', tab: 'throwback', catLabel: '🎞️ Throwback',
      title: 'Throwback — Early Career Reel',
      desc: 'A look back at Reese\'s early Hollywood years — the making of a legend from Election to Legally Blonde.',
      src: 'reesewitherspoon/reesewitherspoon_1771953466_3839746209813195604_367315644.mp4',
      poster: 'reesewitherspoon/reesewitherspoon_1566064330_2112623179871571534_367315644.jpg',
      duration: 'Throwback', tags: 'throwback early career hollywood legend election legally blonde 1990s'
    },
    {
      id: 'tb02', tab: 'throwback', catLabel: '🎞️ Throwback',
      title: '2000s Archive — Rise of a Star',
      desc: 'Archival footage from the early 2000s as Reese Witherspoon became one of Hollywood\'s biggest stars.',
      src: 'reesewitherspoon/reesewitherspoon_1771610513_3836867122526533912_367315644.mp4',
      poster: 'reesewitherspoon/reesewitherspoon_1570494823_2149788856218626605_367315644.jpg',
      duration: '2000s', tags: '2000s archive rise star hollywood archive early career growth'
    },
    {
      id: 'tb03', tab: 'throwback', catLabel: '🎞️ Throwback',
      title: 'Walk the Line Era — 2004-2006',
      desc: 'Clips from the Walk the Line era — the years when Reese won every award imaginable.',
      src: 'reesewitherspoon/reesewitherspoon_1771351925_3834699730027358739_367315644.mp4',
      poster: 'reesewitherspoon/reesewitherspoon_1579536534_2225636222863195125_367315644.jpg',
      duration: 'Throwback', tags: 'walk line 2004 2006 era oscar award june carter cash'
    },
    {
      id: 'tb04', tab: 'throwback', catLabel: '🎞️ Throwback',
      title: 'Pre-Hollywood — Nashville Roots',
      desc: 'Rare early footage from Reese\'s Tennessee years — before the world knew her name.',
      src: 'reesewitherspoon/reesewitherspoon_1771180084_3833258015504555354_367315644.mp4',
      poster: 'reesewitherspoon/reesewitherspoon_1577901649_2211921814496504844_367315644.jpg',
      duration: 'Archive', tags: 'nashville roots pre hollywood tennessee early years rare archive young'
    },
    {
      id: 'tb05', tab: 'throwback', catLabel: '🎞️ Throwback',
      title: '2010s Evolution — Producer Era',
      desc: 'Reese\'s transformation into Hollywood\'s most powerful producer — the 2010s in review.',
      src: 'reesewitherspoon/reesewitherspoon_1770818034_3830220825077582422_367315644.mp4',
      poster: 'reesewitherspoon/reesewitherspoon_1580140903_2230706038028481020_367315644.jpg',
      duration: '2010s', tags: '2010s evolution producer era powerful transformation hello sunshine'
    },
  ];

  /* ══════════════════════════════════════════════════════════
     2. STATE
  ══════════════════════════════════════════════════════════ */
  const PAGE_SIZE  = 12;
  let activeTab    = 'all';
  let searchQuery  = '';
  let visibleCount = PAGE_SIZE;
  let currentId    = null;
  let hoverTimers  = {};

  /* ══════════════════════════════════════════════════════════
     3. FILTER & SEARCH
  ══════════════════════════════════════════════════════════ */
  function getFiltered() {
    return REELS.filter(r => {
      const tabMatch = activeTab === 'all' || r.tab === activeTab;
      if (!tabMatch) return false;
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return r.title.toLowerCase().includes(q) ||
             r.desc.toLowerCase().includes(q) ||
             (r.tags || '').toLowerCase().includes(q);
    });
  }

  /* ══════════════════════════════════════════════════════════
     4. COUNT BADGES
  ══════════════════════════════════════════════════════════ */
  function updateCounts() {
    const tabs = ['all','interviews','movietv','sunshine','lifestyle','throwback'];
    tabs.forEach(t => {
      const el = document.getElementById(`cnt-${t}`);
      if (!el) return;
      el.textContent = t === 'all' ? REELS.length : REELS.filter(r => r.tab === t).length;
    });
  }

  /* ══════════════════════════════════════════════════════════
     5. BUILD CARD
  ══════════════════════════════════════════════════════════ */
  function buildCard(reel, delay) {
    const card = document.createElement('div');
    card.className = 'reel-card';
    card.dataset.tab = reel.tab;
    card.dataset.id  = reel.id;
    card.style.animationDelay = `${delay * 0.05}s`;
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `Play: ${reel.title}`);

    card.innerHTML = `
      <div class="reel-thumb">
        <video class="reel-video" preload="none" muted loop playsinline
          ${reel.poster ? `poster="${reel.poster}"` : ''}>
          <source src="${reel.src}" type="video/mp4"/>
        </video>
        <div class="reel-thumb-overlay">
          <button class="reel-play-btn" aria-label="Play ${reel.title}">▶</button>
        </div>
        <div class="reel-duration">${reel.duration}</div>
        <button class="reel-share-btn" aria-label="Share">
          <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
          </svg>
        </button>
      </div>
      <div class="reel-info">
        <div class="reel-cat">${reel.catLabel}</div>
        <h4 class="reel-title">${reel.title}</h4>
        <p class="reel-desc">${reel.desc}</p>
      </div>`;

    const video  = card.querySelector('.reel-video');
    const share  = card.querySelector('.reel-share-btn');

    // Hover preview
    card.addEventListener('mouseenter', () => {
      hoverTimers[reel.id] = setTimeout(() => {
        video.load();
        video.play().catch(() => {});
      }, 250);
    });
    card.addEventListener('mouseleave', () => {
      clearTimeout(hoverTimers[reel.id]);
      video.pause();
      video.currentTime = 0;
    });

    // Click to open modal
    card.addEventListener('click', e => {
      if (e.target === share || share.contains(e.target)) {
        e.stopPropagation();
        shareClip(reel);
        return;
      }
      openModal(reel.id);
    });

    card.addEventListener('keydown', e => {
      if (e.key === 'Enter') openModal(reel.id);
    });

    return card;
  }

  /* ══════════════════════════════════════════════════════════
     6. RENDER GRID
  ══════════════════════════════════════════════════════════ */
  function renderGrid() {
    const grid    = document.getElementById('reelsGrid');
    const empty   = document.getElementById('rl-empty');
    const info    = document.getElementById('rl-info');
    const lmWrap  = document.getElementById('rl-load-wrap');
    const lmBtn   = document.getElementById('rl-load-btn');
    const lmInfo  = document.getElementById('rl-load-info');
    const filtered= getFiltered();
    const batch   = filtered.slice(0, visibleCount);

    if (grid && grid.children.length > 0 && !grid.dataset.hydrated && activeTab === 'all' && !searchQuery) {
      grid.dataset.hydrated = 'true';
      Array.from(grid.querySelectorAll('.reel-card')).forEach(card => {
        const reelId = card.dataset.id;
        const reel = REELS.find(r => r.id === reelId);
        if (!reel) return;
        const video = card.querySelector('.reel-video');
        const share = card.querySelector('.reel-share-btn');

        card.addEventListener('mouseenter', () => {
          hoverTimers[reel.id] = setTimeout(() => {
            if (video) { video.load(); video.play().catch(() => {}); }
          }, 250);
        });
        card.addEventListener('mouseleave', () => {
          clearTimeout(hoverTimers[reel.id]);
          if (video) { video.pause(); video.currentTime = 0; }
        });
        card.addEventListener('click', e => {
          if (share && (e.target === share || share.contains(e.target))) {
            e.stopPropagation();
            shareClip(reel);
            return;
          }
          openModal(reel.id);
        });
        card.addEventListener('keydown', e => {
          if (e.key === 'Enter') openModal(reel.id);
        });
      });
      const shown = batch.filter(r => !r.isJpg).length;
      const total = filtered.filter(r => !r.isJpg).length;
      const remaining = total - shown;
      if (remaining > 0 && lmWrap) {
        lmWrap.style.display = 'flex';
        if (lmBtn) {
          lmBtn.disabled = false;
          lmBtn.innerHTML = `Load ${Math.min(remaining, PAGE_SIZE)} More <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path d="M12 5v14M5 12l7 7 7-7"/></svg>`;
        }
        if (lmInfo) lmInfo.textContent = `Showing ${shown} of ${total} clips`;
      }
      return;
    }

    // Pause all playing videos
    document.querySelectorAll('.reel-video').forEach(v => { v.pause(); v.currentTime = 0; });
    grid.innerHTML = '';

    if (!filtered.length) {
      empty.style.display = 'block';
      lmWrap.style.display = 'none';
      info.textContent = 'No clips found.';
      return;
    }
    empty.style.display = 'none';

    batch.forEach((reel, i) => {
      if (!reel.isJpg) grid.appendChild(buildCard(reel, i));
    });

    const shown = batch.filter(r => !r.isJpg).length;
    const total = filtered.filter(r => !r.isJpg).length;
    const remaining = total - shown;

    if (remaining > 0) {
      lmWrap.style.display = 'flex';
      lmBtn.disabled = false;
      lmBtn.innerHTML = `Load ${Math.min(remaining, PAGE_SIZE)} More <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path d="M12 5v14M5 12l7 7 7-7"/></svg>`;
      lmInfo.textContent = `Showing ${shown} of ${total} clips`;
    } else {
      lmWrap.style.display = 'none';
    }

    info.textContent = searchQuery
      ? `${total} clip${total !== 1 ? 's' : ''} matching "${searchQuery}"`
      : `Showing ${Math.min(shown, total)} of ${total} clip${total !== 1 ? 's' : ''}`;
  }

  /* ══════════════════════════════════════════════════════════
     7. MODAL
  ══════════════════════════════════════════════════════════ */
  function openModal(id) {
    const reel = REELS.find(r => r.id === id);
    if (!reel) return;
    currentId = id;

    const modal  = document.getElementById('rl-modal');
    const vid    = document.getElementById('rlm-video');
    const dlBtn  = document.getElementById('rlm-download');

    // Set video
    vid.src = reel.src;
    vid.poster = reel.poster || '';
    vid.load();
    setTimeout(() => vid.play().catch(() => {}), 300);

    // Set meta
    document.getElementById('rlm-cat').textContent   = reel.catLabel;
    document.getElementById('rlm-title').textContent  = reel.title;
    document.getElementById('rlm-desc').textContent   = reel.desc;
    dlBtn.href = reel.src;
    dlBtn.setAttribute('download', `reese-${reel.id}.mp4`);

    // Related clips (same tab, exclude current)
    const related = REELS.filter(r => r.tab === reel.tab && r.id !== reel.id && !r.isJpg).slice(0, 3);
    buildRelated(related);

    // Wire share
    document.getElementById('rlm-share').onclick = () => shareClip(reel);

    // Wire set-featured
    document.getElementById('rlm-feature').onclick = () => {
      const heroVid = document.getElementById('rh-featured-vid');
      if (heroVid) {
        heroVid.src = reel.src;
        heroVid.poster = reel.poster || '';
        heroVid.load();
        document.getElementById('rh-featured-label').textContent = reel.title;
        closeModal();
        heroVid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        window.showToast?.(`✦ Now featuring: ${reel.title}`);
      }
    };

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    const modal = document.getElementById('rl-modal');
    const vid   = document.getElementById('rlm-video');
    if (modal) {
      modal.classList.remove('open');
      vid.pause();
      vid.src = '';
    }
    document.body.style.overflow = '';
    currentId = null;
  }

  function buildRelated(clips) {
    const grid = document.getElementById('rlm-related-grid');
    grid.innerHTML = '';
    clips.forEach(r => {
      const card = document.createElement('div');
      card.className = 'rlm-related-card';
      card.innerHTML = `
        <div class="rlm-related-thumb">
          <video preload="none" muted ${r.poster ? `poster="${r.poster}"` : ''}>
            <source src="${r.src}" type="video/mp4"/>
          </video>
        </div>
        <div class="rlm-related-info">
          <div class="rlm-related-title-sm">${r.title}</div>
        </div>`;
      card.addEventListener('click', () => openModal(r.id));
      grid.appendChild(card);
    });
    document.getElementById('rlm-related').style.display = clips.length ? '' : 'none';
  }

  /* ══════════════════════════════════════════════════════════
     8. SHARE
  ══════════════════════════════════════════════════════════ */
  function shareClip(reel) {
    if (navigator.share) {
      navigator.share({ title: reel.title, text: reel.desc, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      window.showToast?.('📋 Link copied to clipboard!');
    }
  }

  /* ══════════════════════════════════════════════════════════
     9. INIT CONTROLS
  ══════════════════════════════════════════════════════════ */
  function initSearch() {
    const input = document.getElementById('rl-search');
    const clear = document.getElementById('rl-search-clear');
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
      renderGrid(); input.focus();
    });
  }

  function initTabs() {
    document.querySelectorAll('.reel-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.reel-tab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeTab    = btn.dataset.tab;
        visibleCount = PAGE_SIZE;
        renderGrid();
      });
    });
  }

  function initLoadMore() {
    const btn = document.getElementById('rl-load-btn');
    if (!btn) return;
    btn.addEventListener('click', () => {
      visibleCount += PAGE_SIZE;
      renderGrid();
    });
  }

  function initViewToggle() {
    const grid = document.getElementById('reelsGrid');
    document.getElementById('rl-view-3')?.addEventListener('click', function() {
      grid.classList.remove('cols-2');
      this.classList.add('active');
      document.getElementById('rl-view-2')?.classList.remove('active');
    });
    document.getElementById('rl-view-2')?.addEventListener('click', function() {
      grid.classList.add('cols-2');
      this.classList.add('active');
      document.getElementById('rl-view-3')?.classList.remove('active');
    });
  }

  function initModalEvents() {
    document.getElementById('rlm-close')?.addEventListener('click', closeModal);
    document.getElementById('rlm-backdrop')?.addEventListener('click', closeModal);
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && document.getElementById('rl-modal')?.classList.contains('open')) {
        closeModal();
      }
    });
  }

  function checkUrlTab() {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('tab');
    if (t && ['interviews','movietv','sunshine','lifestyle','throwback'].includes(t)) {
      activeTab = t;
      const btn = document.querySelector(`.reel-tab[data-tab="${t}"]`);
      if (btn) {
        document.querySelectorAll('.reel-tab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      }
    }
  }

  /* ══════════════════════════════════════════════════════════
     10. INIT
  ══════════════════════════════════════════════════════════ */
  function init() {
    checkUrlTab();
    updateCounts();
    initSearch();
    initTabs();
    initLoadMore();
    initViewToggle();
    initModalEvents();
    renderGrid();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

})();
