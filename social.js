// social.js — Social Feeds (Instagram + X mock feed) + Community Modal + Floating Button

(function() {
  'use strict';

  /* ── Mock Instagram Posts ───────────────────────────────── */
  const IG_POSTS = [
    { img: 'reesewitherspoon/reesewitherspoon_1779634961_3904183025843630670_367315644.jpg', caption: '✨ So grateful for every single one of you. This journey just keeps getting better and better. #HelloSunshine', likes: '284K', time: '2h ago' },
    { img: 'reesewitherspoon/reesewitherspoon_1778888767_3897921861991215508_367315644.jpg', caption: '📚 This month\'s book club pick has me absolutely OBSESSED. Cannot wait to hear what you all think! @ReesesBookClub', likes: '391K', time: '1d ago' },
    { img: 'reesewitherspoon/reesewitherspoon_1778780649_3897016730459253662_367315644.jpg', caption: 'Nashville morning 🌸 There is truly nowhere like home. So much gratitude. #Nashville #Tennessee', likes: '512K', time: '3d ago' },
    { img: 'reesewitherspoon/reesewitherspoon_1778417445_3893969129120386774_367315644.jpg', caption: '☀️ Big things coming from @HelloSunshine this year. Stay tuned! #WomenInFilm #Storytelling', likes: '445K', time: '5d ago' },
    { img: 'reesewitherspoon/cosmopolitan_1750240854_3657592786824360179_42725516.jpg',     caption: 'Had so much fun with @Cosmopolitan! Read the full interview — link in bio. 💖', likes: '672K', time: '1w ago' },
    { img: 'reesewitherspoon/glamourmag_1756814591_3712752346641580542_10070230.jpg',       caption: 'The @GlamourMag shoot was a dream. Thank you for having us 🥂 #MorningShow Season 4', likes: '798K', time: '2w ago' },
    { img: 'reesewitherspoon/people_1752166095_3673757936850124429_28759374.jpg',           caption: 'People Magazine ❤️ Honored to be featured alongside so many incredible women. #People100', likes: '934K', time: '3w ago' },
    { img: 'reesewitherspoon/reesewitherspoon_1777822494_3888971826742726686_367315644.jpg', caption: 'Every story matters. Every voice deserves to be heard. Keep reading, keep creating. 🌟', likes: '301K', time: '1mo ago' },
    { img: 'reesewitherspoon/reesesbookclub_1693063724_3177971311774135084_2249417883.jpg', caption: 'JUST announced — this is the book you need in your life RIGHT NOW. @ReesesBookClub 📖', likes: '567K', time: '1mo ago' },
  ];

  /* ── Mock X/Twitter Posts ───────────────────────────────── */
  const X_POSTS = [
    { avatar: 'reesewitherspoon/reesewitherspoon_1579478144_2225146406606465542_367315644.jpg', name: 'Reese Witherspoon', handle: '@RWitherspoon', text: '📚 Just finished the most incredible book and I need you ALL to read it immediately. Details on @ReesesBookClub!', likes: '18.4K', retweets: '4.2K', time: '3h ago' },
    { avatar: 'reesewitherspoon/reesewitherspoon_1579478144_2225146406606465542_367315644.jpg', name: 'Reese Witherspoon', handle: '@RWitherspoon', text: 'Women\'s stories change the world. They always have. They always will. Keep telling them. ☀️ #HelloSunshine', likes: '42.1K', retweets: '9.8K', time: '1d ago' },
    { avatar: 'reesewitherspoon/reesewitherspoon_1579478144_2225146406606465542_367315644.jpg', name: 'Reese Witherspoon', handle: '@RWitherspoon', text: 'So proud of the entire @MorningShowAppleTV team. Season 4 is something really special. You are not ready 🎬', likes: '67.3K', retweets: '14.5K', time: '2d ago' },
    { avatar: 'reesewitherspoon/reesewitherspoon_1579478144_2225146406606465542_367315644.jpg', name: 'Reese Witherspoon', handle: '@RWitherspoon', text: 'Nashville will forever be home. So grateful to this city that raised me. 🤍 #Nashville', likes: '31.2K', retweets: '6.1K', time: '4d ago' },
    { avatar: 'reesewitherspoon/reesewitherspoon_1579478144_2225146406606465542_367315644.jpg', name: 'Reese Witherspoon', handle: '@RWitherspoon', text: 'PSA: The new @HelloSunshine announcement is coming and it\'s EVERYTHING. Watch this space. ✨', likes: '55.9K', retweets: '12.3K', time: '6d ago' },
  ];

  /* ── Build Social Section HTML ──────────────────────────── */
  function buildSocialSection(container) {
    container.innerHTML = `
      <div class="social-grid">

        <!-- Instagram Feed -->
        <div class="social-feed-card">
          <div class="sfc-header">
            <div class="sfc-platform">
              <div class="sfc-platform-icon sfc-ig">📸</div>
              <div>
                <div class="sfc-platform-name">Instagram</div>
                <div class="sfc-platform-handle">@reesewitherspoon · 29.8M followers</div>
              </div>
            </div>
            <a href="https://www.instagram.com/reesewitherspoon" target="_blank" rel="noopener" class="sfc-follow-btn">Follow</a>
          </div>
          <div class="ig-grid" id="ig-grid"></div>
          <div class="sfc-posts" id="ig-posts" style="display:none"></div>
          <div class="sfc-footer">
            <button class="sfc-view-all" id="ig-toggle">View Posts ↓</button>
          </div>
        </div>

        <!-- X/Twitter Feed -->
        <div class="social-feed-card">
          <div class="sfc-header">
            <div class="sfc-platform">
              <div class="sfc-platform-icon sfc-x">𝕏</div>
              <div>
                <div class="sfc-platform-name">X (Twitter)</div>
                <div class="sfc-platform-handle">@RWitherspoon · 6.2M followers</div>
              </div>
            </div>
            <a href="https://twitter.com/ReeseW" target="_blank" rel="noopener" class="sfc-follow-btn">Follow</a>
          </div>
          <div class="sfc-posts" id="x-posts"></div>
          <div class="sfc-footer">
            <a href="https://twitter.com/ReeseW" target="_blank" rel="noopener" class="sfc-view-all">View on X ↗</a>
          </div>
        </div>

      </div>

      <!-- Social stats bar -->
      <div class="social-stats-bar">
        <div class="ssb-item">
          <div class="ssb-icon">📸</div>
          <div class="ssb-num" data-count="29" data-suffix=".8M">29.8M</div>
          <div class="ssb-lbl">Instagram Followers</div>
        </div>
        <div class="ssb-item">
          <div class="ssb-icon">𝕏</div>
          <div class="ssb-num" data-count="6" data-suffix=".2M">6.2M</div>
          <div class="ssb-lbl">X Followers</div>
        </div>
        <div class="ssb-item">
          <div class="ssb-icon">☀️</div>
          <div class="ssb-num" data-count="900" data-suffix="M+">$900M+</div>
          <div class="ssb-lbl">Hello Sunshine Value</div>
        </div>
        <div class="ssb-item">
          <div class="ssb-icon">📚</div>
          <div class="ssb-num" data-count="100" data-suffix="+">100+</div>
          <div class="ssb-lbl">Book Club Picks</div>
        </div>
      </div>
    `;

    // Populate IG grid
    const igGrid = container.querySelector('#ig-grid');
    IG_POSTS.slice(0,9).forEach(p => {
      const cell = document.createElement('div');
      cell.className = 'ig-cell';
      cell.innerHTML = `<img src="${p.img}" alt="Reese Witherspoon Instagram post" loading="lazy"/><div class="ig-cell-overlay">❤️ ${p.likes}</div>`;
      cell.addEventListener('click', () => window.open('https://www.instagram.com/reesewitherspoon','_blank'));
      igGrid.appendChild(cell);
    });

    // IG posts list (hidden by default)
    const igPostsWrap = container.querySelector('#ig-posts');
    IG_POSTS.forEach(p => {
      const post = document.createElement('div');
      post.className = 'sfc-post';
      post.innerHTML = `
        <img class="sfc-post-avatar" src="reesewitherspoon/reesewitherspoon_1579478144_2225146406606465542_367315644.jpg" alt="Reese Witherspoon official portrait"/>
        <div class="sfc-post-body">
          <div class="sfc-post-name">Reese Witherspoon</div>
          <div class="sfc-post-handle">@reesewitherspoon · ${p.time}</div>
          <div class="sfc-post-text">${p.caption}</div>
          <div class="sfc-post-actions">
            <button class="sfc-action" onclick="likePost(this)">♥ <span>${p.likes}</span></button>
            <button class="sfc-action">💬 View</button>
          </div>
        </div>
        <img class="sfc-post-media" src="${p.img}" alt="Reese Witherspoon official post" loading="lazy"/>
      `;
      post.addEventListener('click', () => window.open('https://www.instagram.com/reesewitherspoon','_blank'));
      igPostsWrap.appendChild(post);
    });

    // Toggle IG grid vs posts
    let showingPosts = false;
    container.querySelector('#ig-toggle').addEventListener('click', function() {
      showingPosts = !showingPosts;
      igGrid.style.display = showingPosts ? 'none' : '';
      igPostsWrap.style.display = showingPosts ? '' : 'none';
      this.textContent = showingPosts ? 'View Grid ↑' : 'View Posts ↓';
    });

    // Populate X posts
    const xPostsWrap = container.querySelector('#x-posts');
    X_POSTS.forEach(p => {
      const post = document.createElement('div');
      post.className = 'sfc-post';
      post.innerHTML = `
        <img class="sfc-post-avatar" src="${p.avatar}" alt="${p.name}"/>
        <div class="sfc-post-body">
          <div class="sfc-post-name">${p.name} <span style="color:var(--muted);font-weight:400;font-size:.8rem">${p.handle} · ${p.time}</span></div>
          <div class="sfc-post-text" style="margin-top:6px">${p.text}</div>
          <div class="sfc-post-actions">
            <button class="sfc-action" onclick="likePost(this)">♥ <span>${p.likes}</span></button>
            <button class="sfc-action">🔁 ${p.retweets}</button>
          </div>
        </div>
      `;
      post.addEventListener('click', () => window.open('https://twitter.com/ReeseW','_blank'));
      xPostsWrap.appendChild(post);
    });
  }

  /* ── Like animation ─────────────────────────────────────── */
  window.likePost = function(btn) {
    const span = btn.querySelector('span');
    if (btn.dataset.liked) return;
    btn.dataset.liked = '1';
    btn.style.color = 'var(--pink)';
    // increment displayed count (demo)
    const cur = span.textContent.replace(/[^0-9.]/g,'');
    span.textContent = span.textContent; // keep as-is (mock)
    btn.style.transform = 'scale(1.3)';
    setTimeout(() => btn.style.transform = '', 300);
  };

  /* ── Community Modal ──────────────────────────────────────── */
  function buildCommunityModal() {
    if (document.getElementById('community-modal')) return;
    const modal = document.createElement('div');
    modal.id = 'community-modal';
    modal.innerHTML = `
      <div class="cm-box">
        <button class="cm-close" id="cm-close">✕</button>
        <p style="font-size:2rem;margin-bottom:8px">✦</p>
        <h2>Join the Community</h2>
        <p>Get book club picks, new film alerts, Hello Sunshine news — and vote in exclusive fan polls.</p>
        <div class="cm-nl-wrap">
          <input class="cm-nl-input" id="cm-email" type="email" placeholder="your@email.com"/>
          <button class="btn btn-primary" id="cm-subscribe" style="padding:13px 20px;white-space:nowrap">Subscribe ✦</button>
        </div>
        <div class="cm-links">
          <a href="https://www.instagram.com/reesewitherspoon" target="_blank" class="cm-social-link">
            <span class="cm-social-icon">📸</span>
            <span>Follow on Instagram — @reesewitherspoon</span>
            <span style="margin-left:auto;color:var(--muted)">↗</span>
          </a>
          <a href="https://twitter.com/ReeseW" target="_blank" class="cm-social-link">
            <span class="cm-social-icon">𝕏</span>
            <span>Follow on X — @RWitherspoon</span>
            <span style="margin-left:auto;color:var(--muted)">↗</span>
          </a>
          <a href="https://reesewitherspoonofficial.com/explore.html#book-club" target="_blank" class="cm-social-link">
            <span class="cm-social-icon">📚</span>
            <span>Join Reese's Book Club</span>
            <span style="margin-left:auto;color:var(--muted)">↗</span>
          </a>
          <a href="community.html" class="cm-social-link">
            <span class="cm-social-icon">🗳️</span>
            <span>Vote in Fan Polls</span>
            <span style="margin-left:auto;color:var(--pink-2)">→</span>
          </a>
        </div>
      </div>`;
    document.body.appendChild(modal);

    // Close
    modal.querySelector('#cm-close').addEventListener('click', closeModal);
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

    // Subscribe
    modal.querySelector('#cm-subscribe').addEventListener('click', () => {
      const email = modal.querySelector('#cm-email').value.trim();
      if (!email || !email.includes('@')) {
        window.showToast && window.showToast('❗ Please enter a valid email');
        return;
      }
      modal.querySelector('#cm-subscribe').textContent = '✓ Subscribed!';
      modal.querySelector('#cm-subscribe').style.background = 'linear-gradient(135deg,#059669,#10b981)';
      modal.querySelector('#cm-email').disabled = true;
      window.showToast && window.showToast('🎉 You\'re in! Welcome to the community.');
    });
  }

  function openModal()  { document.getElementById('community-modal')?.classList.add('open'); document.body.style.overflow='hidden'; }
  function closeModal() { document.getElementById('community-modal')?.classList.remove('open'); document.body.style.overflow=''; }
  window.openCommunityModal = openModal;

  /* ── Floating Button ─────────────────────────────────────── */
  function buildFloatingBtn() {
    if (document.getElementById('float-community-btn')) return;
    const btn = document.createElement('button');
    btn.id = 'float-community-btn';
    btn.setAttribute('aria-label', 'Join the Community');
    btn.innerHTML = `<span>✦</span><span class="fc-pill">Join the Community</span>`;
    document.body.appendChild(btn);
    btn.addEventListener('click', openModal);
  }

  /* ── Toast (fallback if polls.js not loaded) ──────────────── */
  if (!window.showToast) {
    window.showToast = function(msg) {
      let t = document.getElementById('toast');
      if (!t) { t = document.createElement('div'); t.id = 'toast'; document.body.appendChild(t); }
      t.textContent = msg;
      t.classList.add('show');
      clearTimeout(t._timeout);
      t._timeout = setTimeout(() => t.classList.remove('show'), 2800);
    };
  }

  /* ── Mount ──────────────────────────────────────────────── */
  function init() {
    // Social sections
    document.querySelectorAll('[data-social-mount]').forEach(buildSocialSection);
    // Modal + floating btn
    buildCommunityModal();
    buildFloatingBtn();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

})();
