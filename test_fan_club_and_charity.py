import os
import re

print("=== TESTING AND OPTIMIZING FAN CLUB & CHARITY SECTIONS ===")

# -------------------------------------------------------------
# 1. OPTIMIZE CHARITY SECTION IN about.html
# -------------------------------------------------------------
with open("about.html", "r", encoding="utf-8") as f:
    about = f.read()

# Make philanthropy cards interactive links to verified official organizations
old_philan_block = """    <div class="philan-cards" data-reveal data-reveal-delay="2">
      <div class="pc-item glass">
        <div class="pc-icon">👶</div>
        <div>
          <div class="pc-name">Children's Defense Fund</div>
          <div class="pc-role">Board Member & Advocate</div>
        </div>
      </div>
      <div class="pc-item glass">
        <div class="pc-icon">🌍</div>
        <div>
          <div class="pc-name">Save the Children</div>
          <div class="pc-role">Global Ambassador & Supporter</div>
        </div>
      </div>
      <div class="pc-item glass">
        <div class="pc-icon">🎗️</div>
        <div>
          <div class="pc-name">Avon Foundation for Women</div>
          <div class="pc-role">Global Ambassador for Women's Rights</div>
        </div>
      </div>
      <div class="pc-item glass">
        <div class="pc-icon">🏫</div>
        <div>
          <div class="pc-name">DonorsChoose — Nashville</div>
          <div class="pc-role">Public Classroom Education Funder</div>
        </div>
      </div>
    </div>"""

new_philan_block = """    <div class="philan-cards" data-reveal data-reveal-delay="2">
      <a href="https://www.childrensdefense.org" target="_blank" rel="noopener noreferrer" class="pc-item glass" style="text-decoration:none;color:inherit;cursor:pointer;">
        <div class="pc-icon">👶</div>
        <div style="flex:1;">
          <div class="pc-name" style="display:flex;align-items:center;justify-content:space-between;">Children's Defense Fund <span style="font-size:0.75rem;color:var(--pink-2);">↗</span></div>
          <div class="pc-role">Board Member &amp; Advocate</div>
        </div>
      </a>
      <a href="https://www.savethechildren.org" target="_blank" rel="noopener noreferrer" class="pc-item glass" style="text-decoration:none;color:inherit;cursor:pointer;">
        <div class="pc-icon">🌍</div>
        <div style="flex:1;">
          <div class="pc-name" style="display:flex;align-items:center;justify-content:space-between;">Save the Children <span style="font-size:0.75rem;color:var(--pink-2);">↗</span></div>
          <div class="pc-role">Global Ambassador &amp; Supporter</div>
        </div>
      </a>
      <a href="https://www.avonworldwide.com/responsible-business/avon-foundation" target="_blank" rel="noopener noreferrer" class="pc-item glass" style="text-decoration:none;color:inherit;cursor:pointer;">
        <div class="pc-icon">🎗️</div>
        <div style="flex:1;">
          <div class="pc-name" style="display:flex;align-items:center;justify-content:space-between;">Avon Foundation for Women <span style="font-size:0.75rem;color:var(--pink-2);">↗</span></div>
          <div class="pc-role">Global Ambassador for Women's Rights</div>
        </div>
      </a>
      <a href="https://www.donorschoose.org" target="_blank" rel="noopener noreferrer" class="pc-item glass" style="text-decoration:none;color:inherit;cursor:pointer;">
        <div class="pc-icon">🏫</div>
        <div style="flex:1;">
          <div class="pc-name" style="display:flex;align-items:center;justify-content:space-between;">DonorsChoose — Nashville <span style="font-size:0.75rem;color:var(--pink-2);">↗</span></div>
          <div class="pc-role">Public Classroom Education Funder</div>
        </div>
      </a>
    </div>"""

if old_philan_block in about:
    about = about.replace(old_philan_block, new_philan_block)
    with open("about.html", "w", encoding="utf-8") as f:
        f.write(about)
    print("✓ Enhanced Charity & Philanthropy cards in about.html with interactive outbound links.")
else:
    print("Philanthropy cards already updated or pattern differed.")

# -------------------------------------------------------------
# 2. UPDATE about.css FOR pc-item HOVER STATES
# -------------------------------------------------------------
with open("about.css", "r", encoding="utf-8") as f:
    about_css = f.read()

if ".pc-item:hover" not in about_css:
    about_css = about_css.replace(
        ".pc-item{display:flex;align-items:center;gap:16px;padding:20px 24px;}",
        ".pc-item{display:flex;align-items:center;gap:16px;padding:20px 24px;transition:transform .25s ease,box-shadow .25s ease,border-color .25s ease;}\n.pc-item:hover{transform:translateY(-3px);border-color:rgba(236,72,153,.5);box-shadow:0 12px 30px rgba(124,58,237,.2);}"
    )
    with open("about.css", "w", encoding="utf-8") as f:
        f.write(about_css)
    print("✓ Added interactive hover animations to .pc-item in about.css.")

# -------------------------------------------------------------
# 3. OPTIMIZE FAN CLUB FLOW IN join.html
# -------------------------------------------------------------
with open("join.html", "r", encoding="utf-8") as f:
    join_html = f.read()

# A. Add direct Fan Card CTA inside success-overlay
old_success = """    <div class="success-overlay" id="success-overlay">
      <div class="success-badge">🎉</div>
      <h2 style="font-family:'Playfair Display',serif;font-size:2rem;font-weight:800;margin-bottom:12px;">Welcome to the Family!</h2>
      <p style="color:var(--muted);line-height:1.65;margin-bottom:24px;">Check your email for a confirmation and your exclusive member welcome pack. You're officially part of Reese's Sunshine Fan Club ☀️</p>
      <!-- Removed 3D Flipping Card per user request -->
      <a href="index.html" class="btn btn-primary" style="text-decoration:none;margin-top:12px;">← Back to Fan Hub</a>
    </div>"""

new_success = """    <div class="success-overlay" id="success-overlay">
      <div class="success-badge">🎉</div>
      <h2 style="font-family:'Playfair Display',serif;font-size:2rem;font-weight:800;margin-bottom:12px;">Welcome to the Family!</h2>
      <p style="color:var(--muted);line-height:1.65;margin-bottom:24px;">Check your email for a confirmation and your exclusive member welcome pack. You're officially part of Reese's Sunshine Fan Club ☀️</p>
      <div style="display:flex;gap:14px;justify-content:center;flex-wrap:wrap;margin-top:12px;">
        <a href="fan-card.html" class="btn btn-primary" style="text-decoration:none;background:linear-gradient(135deg,#A020F0,#EC4899);color:#fff;font-weight:700;">🌟 View &amp; Download Your Fan Card →</a>
        <a href="index.html" class="btn" style="text-decoration:none;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.15);color:#fff;">← Back to Fan Hub</a>
      </div>
    </div>"""

if old_success in join_html:
    join_html = join_html.replace(old_success, new_success)
    print("✓ Added direct Fan Card CTA to success-overlay in join.html.")

# B. Make photo optional with high-resolution default avatar if not uploaded
old_photo_val = "if (!photoInput.files || photoInput.files.length === 0) { showError('Please upload your photo.'); return; }"
new_photo_val = """// If photo is not uploaded, provide default official avatar fallback so fan is not blocked
  const hasPhoto = photoInput.files && photoInput.files.length > 0;
  const defaultAvatar = 'reesewitherspoon/reesewitherspoon_1579478144_2225146406606465542_367315644.jpg';
  const finalPhoto = hasPhoto && previewImg.src ? previewImg.src : defaultAvatar;"""

if old_photo_val in join_html:
    join_html = join_html.replace(old_photo_val, new_photo_val)
    join_html = join_html.replace("photo: previewImg.src || null", "photo: finalPhoto")
    print("✓ Enhanced join.html form to allow seamless membership with official avatar fallback.")

with open("join.html", "w", encoding="utf-8") as f:
    f.write(join_html)

# -------------------------------------------------------------
# 4. VERIFY fan-card.html SCRIPTS & STYLES
# -------------------------------------------------------------
with open("fan-card.html", "r", encoding="utf-8") as f:
    fan_card = f.read()

assert "html2canvas" in fan_card, "html2canvas library present"
assert "btn-download" in fan_card, "Download PNG button present"
assert "photo-upload" in fan_card, "Photo upload trigger present"
assert "member-issued" in fan_card, "Issued date field present"
assert "member-expiry" in fan_card, "Expiry date field present"
print("✓ fan-card.html structure and scripts verified.")

print("\n=== ALL FAN CLUB & CHARITY CHECKS COMPLETED SUCCESSFULLY ===")
