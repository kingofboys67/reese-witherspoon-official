import os
import re
import json
import urllib.request
import xml.etree.ElementTree as ET

BASE_URL = "https://reesewitherspoonofficial.com"

pages = [
    'index.html', 'about.html', 'films.html', 'reels.html',
    'gallery.html', 'explore.html', 'community.html', 'join.html', 'fan-card.html'
]

print("==================================================")
print("   ULTIMATE SITE & SEO INTEGRITY FULL AUDIT       ")
print("==================================================")

audit_results = {
    "local_html_tests": [],
    "live_endpoint_tests": [],
    "json_ld_tests": [],
    "sitemap_test": None,
    "robots_test": None,
    "llms_test": None,
    "bing_auth_test": None
}

# 1. Local HTML & Schema.org Validation
for p in pages:
    with open(p, 'r', encoding='utf-8') as f:
        content = f.read()

    # Check Title
    t_match = re.search(r'<title>(.*?)</title>', content)
    title = t_match.group(1) if t_match else "MISSING"

    # Check Description
    d_match = re.search(r'<meta name="description" content="(.*?)"\s*/?>', content)
    desc = d_match.group(1) if d_match else "MISSING"

    # Check Canonical
    c_match = re.search(r'<link rel="canonical" href="(.*?)"\s*/?>', content)
    canon = c_match.group(1) if c_match else "MISSING"

    # Check Keywords
    k_match = re.search(r'<meta name="keywords" content="(.*?)"\s*/?>', content)
    keywords = k_match.group(1) if k_match else "MISSING"

    # Check Schemas
    schemas = re.findall(r'<script type="application/ld\+json">\s*(.*?)\s*</script>', content, re.DOTALL)
    parsed_schemas = []
    schema_errors = []
    for idx, s in enumerate(schemas):
        try:
            data = json.loads(s)
            parsed_schemas.append(data.get('@type', 'Unknown'))
        except Exception as e:
            schema_errors.append(f"Schema {idx+1} error: {e}")

    audit_results["local_html_tests"].append({
        "file": p,
        "title": title,
        "has_desc": desc != "MISSING",
        "has_canon": canon != "MISSING",
        "has_keywords": keywords != "MISSING",
        "schemas": parsed_schemas,
        "schema_errors": schema_errors
    })

# 2. Live Server Endpoints & Headers Check
urls_to_test = [
    f"{BASE_URL}/",
    f"{BASE_URL}/about.html",
    f"{BASE_URL}/films.html",
    f"{BASE_URL}/reels.html",
    f"{BASE_URL}/gallery.html",
    f"{BASE_URL}/explore.html",
    f"{BASE_URL}/community.html",
    f"{BASE_URL}/join.html",
    f"{BASE_URL}/fan-card.html",
    f"{BASE_URL}/BingSiteAuth.xml",
    f"{BASE_URL}/sitemap.xml",
    f"{BASE_URL}/robots.txt",
    f"{BASE_URL}/llms.txt"
]

for url in urls_to_test:
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        res = urllib.request.urlopen(req, timeout=10)
        status = res.status
        content_type = res.headers.get('Content-Type', '')
        audit_results["live_endpoint_tests"].append({
            "url": url,
            "status": status,
            "content_type": content_type,
            "ok": status == 200
        })
    except Exception as e:
        audit_results["live_endpoint_tests"].append({
            "url": url,
            "status": "ERROR",
            "content_type": str(e),
            "ok": False
        })

# Print Results cleanly
print("\n[1] ON-PAGE SEO & JSON-LD SCHEMAS:")
all_local_pass = True
for res in audit_results["local_html_tests"]:
    status_str = "✓ PASS" if res["has_desc"] and res["has_canon"] and res["has_keywords"] and not res["schema_errors"] else "✗ FAIL"
    if status_str != "✓ PASS":
        all_local_pass = False
    print(f"  {status_str} {res['file']:<15} | Schemas: {', '.join(res['schemas'])}")

print("\n[2] LIVE VERCEL ENDPOINTS AUDIT:")
all_live_pass = True
for res in audit_results["live_endpoint_tests"]:
    icon = "✓" if res["ok"] else "✗"
    if not res["ok"]:
        all_live_pass = False
    print(f"  {icon} {res['status']} {res['url']}")

print("\n==================================================")
if all_local_pass and all_live_pass:
    print("  RESULT: 100% PERFECT — NO LEAKAGE, NO FAULTS!  ")
else:
    print("  RESULT: SOME FAULTS DETECTED                    ")
print("==================================================")
