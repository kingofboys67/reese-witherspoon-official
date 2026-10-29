import os
import re
import json
from html.parser import HTMLParser
from urllib.parse import unquote

print("=== STARTING COMPREHENSIVE FINAL AUDIT (BUILTIN HTML PARSER) ===")

# Discover all HTML files
html_files = []
for root, dirs, files in os.walk("."):
    if ".git" in root or ".gemini" in root:
        continue
    for f in files:
        if f.endswith(".html") and f != "welcome-email.html":
            html_files.append(os.path.normpath(os.path.join(root, f)))

html_files.sort()
print(f"Discovered {len(html_files)} HTML pages to audit.")

class PageParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.title = ""
        self.in_title = False
        self.meta_desc = ""
        self.links = []
        self.images = []
        self.scripts = []
        self.in_script = False
        self.current_script_type = ""
        self.current_script_content = []
        self.headings = []
        self.in_heading = False
        self.current_heading_tag = ""
        self.current_heading_text = []
        self.text_tokens = []
        self.in_skip = False

    def handle_starttag(self, tag, attrs):
        attr_dict = dict(attrs)
        if tag == "title":
            self.in_title = True
        elif tag == "meta":
            if attr_dict.get("name", "").lower() == "description":
                self.meta_desc = attr_dict.get("content", "")
        elif tag == "a":
            href = attr_dict.get("href")
            if href:
                self.links.append(href)
        elif tag == "img":
            src = attr_dict.get("src")
            if src:
                self.images.append(src)
        elif tag == "script":
            self.in_script = True
            self.current_script_type = attr_dict.get("type", "").lower()
            self.current_script_content = []
        elif tag in ["style", "noscript"]:
            self.in_skip = True
        elif tag in ["h1", "h2", "h3"]:
            self.in_heading = True
            self.current_heading_tag = tag
            self.current_heading_text = []

    def handle_endtag(self, tag):
        if tag == "title":
            self.in_title = False
        elif tag == "script":
            self.in_script = False
            content = "".join(self.current_script_content)
            self.scripts.append((self.current_script_type, content))
        elif tag in ["style", "noscript"]:
            self.in_skip = False
        elif tag in ["h1", "h2", "h3"]:
            self.in_heading = False
            text = "".join(self.current_heading_text).strip()
            self.headings.append((self.current_heading_tag, text))

    def handle_data(self, data):
        if self.in_title:
            self.title += data
        if self.in_script:
            self.current_script_content.append(data)
        if self.in_heading:
            self.current_heading_text.append(data)
        if not self.in_script and not self.in_skip:
            words = data.strip().split()
            if words:
                self.text_tokens.extend(words)

audit_results = []
broken_links_found = []

for file_path in html_files:
    clean_path = file_path.lstrip("./")
    page_url = f"https://reesewitherspoonofficial.com/{clean_path}"
    file_dir = os.path.dirname(file_path)

    with open(file_path, "r", encoding="utf-8") as f:
        raw_html = f.read()

    parser = PageParser()
    parser.feed(raw_html)

    # 1. Title & Meta Description
    title = parser.title.strip()
    title_len = len(title)
    desc = parser.meta_desc.strip()
    desc_len = len(desc)

    # 2. Schema
    schema_types = []
    schema_valid = True
    json_ld_scripts = [c for t, c in parser.scripts if "application/ld+json" in t]
    
    if not json_ld_scripts:
        schema_valid = False
        schema_summary = "None"
        schema_status = "Missing"
    else:
        for script_content in json_ld_scripts:
            try:
                data = json.loads(script_content)
                def extract_types(obj):
                    res = []
                    if isinstance(obj, dict):
                        if "@type" in obj:
                            res.append(obj["@type"])
                        for v in obj.values():
                            res.extend(extract_types(v))
                    elif isinstance(obj, list):
                        for item in obj:
                            res.extend(extract_types(item))
                    return res
                schema_types.extend(extract_types(data))
            except Exception as e:
                schema_valid = False
                print(f"JSON-LD Error in {file_path}: {e}")

        # Filter out minor internal items for summary
        unique_types = []
        for t in schema_types:
            if t not in unique_types and t not in ["ListItem", "Place", "Country", "EducationalOrganization"]:
                unique_types.append(t)
        schema_summary = ", ".join(unique_types)
        schema_status = "Valid" if schema_valid else "Error"

    # 3. Raw HTML Visibility
    h1_count = len([h for t, h in parser.headings if t == "h1"])
    total_headings = len(parser.headings)
    word_count = len(parser.text_tokens)
    raw_visible = bool(h1_count == 1 and total_headings >= 2 and word_count >= 50)
    raw_status = f"Yes ({word_count} words, {total_headings} headings)" if raw_visible else f"Check: {h1_count} H1s, {word_count} words"

    # 4. Broken Link Checks
    page_broken = []
    for href in parser.links:
        href_clean = href.strip()
        if not href_clean or href_clean.startswith("#") or href_clean.startswith("mailto:") or href_clean.startswith("tel:") or href_clean.startswith("javascript:"):
            continue
        if href_clean.startswith("http://") or href_clean.startswith("https://"):
            if href_clean.startswith("https://reesewitherspoonofficial.com/"):
                sub = href_clean.replace("https://reesewitherspoonofficial.com/", "")
                sub = unquote(sub.split("#")[0].split("?")[0])
                if sub and not os.path.exists(sub) and not os.path.exists(sub + ".html"):
                    page_broken.append((href_clean, "Internal absolute 404"))
            continue

        # Relative link
        rel_target = unquote(href_clean.split("#")[0].split("?")[0])
        if not rel_target:
            continue
        if rel_target.startswith("/"):
            target_path = os.path.normpath(rel_target.lstrip("/"))
        else:
            target_path = os.path.normpath(os.path.join(file_dir, rel_target))

        if not os.path.exists(target_path) and not os.path.exists(target_path + ".html"):
            page_broken.append((href_clean, target_path))
            broken_links_found.append((clean_path, href_clean, target_path))

    # 5. Broken Images Checks
    page_broken_imgs = []
    for src in parser.images:
        src_clean = src.strip()
        if src_clean.startswith("http") or src_clean.startswith("data:"):
            continue
        rel_img = unquote(src_clean.split("?")[0])
        if rel_img.startswith("/"):
            target_img = os.path.normpath(rel_img.lstrip("/"))
        else:
            target_img = os.path.normpath(os.path.join(file_dir, rel_img))
        if not os.path.exists(target_img):
            page_broken_imgs.append((src_clean, target_img))

    audit_results.append({
        "clean_path": clean_path,
        "url": page_url,
        "title": title,
        "title_len": title_len,
        "desc": desc,
        "desc_len": desc_len,
        "schema_types": schema_summary,
        "schema_status": schema_status,
        "raw_status": raw_status,
        "broken_links": page_broken,
        "broken_imgs": page_broken_imgs
    })

print(f"\n--- DETAILED AUDIT RESULTS ---")
print(f"Total Pages Checked: {len(audit_results)}")

title_violations = [r for r in audit_results if r["title_len"] > 60]
desc_violations = [r for r in audit_results if r["desc_len"] > 155]
schema_errors = [r for r in audit_results if r["schema_status"] != "Valid"]
raw_issues = [r for r in audit_results if not r["raw_status"].startswith("Yes")]
broken_link_pages = [r for r in audit_results if len(r["broken_links"]) > 0]
broken_img_pages = [r for r in audit_results if len(r["broken_imgs"]) > 0]

print(f"Title > 60 chars: {len(title_violations)}")
for t in title_violations:
    print(f"  {t['clean_path']}: len {t['title_len']} -> '{t['title']}'")

print(f"Desc > 155 chars: {len(desc_violations)}")
for d in desc_violations:
    print(f"  {d['clean_path']}: len {d['desc_len']} -> '{d['desc']}'")

print(f"Schema errors: {len(schema_errors)}")
for s in schema_errors:
    print(f"  {s['clean_path']}: {s['schema_status']}")

print(f"Raw HTML issues: {len(raw_issues)}")
for r in raw_issues:
    print(f"  {r['clean_path']}: {r['raw_status']}")

print(f"Broken links: {len(broken_link_pages)}")
for b in broken_link_pages:
    print(f"  {b['clean_path']}: {b['broken_links']}")

print(f"Broken images: {len(broken_img_pages)}")
for bi in broken_img_pages:
    print(f"  {bi['clean_path']}: {bi['broken_imgs']}")

# Save full results as JSON for reporting
with open("final_audit_data.json", "w", encoding="utf-8") as f:
    json.dump(audit_results, f, indent=2)

print("\nSaved full audit data to final_audit_data.json.")
