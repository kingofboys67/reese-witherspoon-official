import json
import urllib.request
import urllib.parse
import sys

BASE_URL = "https://reesewitherspoonofficial.com"
HOST = "reesewitherspoonofficial.com"
KEY = "4c7a9b1e2f3d5a8c9b0e1f2a3c4d5e6f"
KEY_LOCATION = f"{BASE_URL}/{KEY}.txt"

# List of critical URLs to submit
URLS = [
    f"{BASE_URL}/",
    f"{BASE_URL}/about.html",
    f"{BASE_URL}/films.html",
    f"{BASE_URL}/reels.html",
    f"{BASE_URL}/gallery.html",
    f"{BASE_URL}/explore.html",
    f"{BASE_URL}/community.html",
    f"{BASE_URL}/join.html",
    f"{BASE_URL}/fan-card.html",
    f"{BASE_URL}/sitemap.xml",
    f"{BASE_URL}/feed.xml",
    f"{BASE_URL}/llms.txt",
    f"{BASE_URL}/llms-full.txt"
]

payload = {
    "host": HOST,
    "key": KEY,
    "keyLocation": KEY_LOCATION,
    "urlList": URLS
}

headers = {"Content-Type": "application/json; charset=utf-8"}

endpoints = [
    "https://api.indexnow.org/indexnow",
    "https://www.bing.com/indexnow"
]

print("=== PINGING INDEXNOW API FOR REESE WITHERSPOON OFFICIAL SITE ===")
print(f"Host: {HOST} | Key: {KEY}")
print(f"Submitting {len(URLS)} URLs...")

for ep in endpoints:
    try:
        req = urllib.request.Request(
            ep,
            data=json.dumps(payload).encode('utf-8'),
            headers=headers,
            method="POST"
        )
        with urllib.request.urlopen(req, timeout=10) as response:
            status = response.status
            print(f"✓ Successfully pinged {ep} -> HTTP {status}")
    except Exception as e:
        print(f"ℹ Ping to {ep}: {e} (Expected in local offline mock/dev or pending DNS)")

print("=== INDEXNOW PING COMPLETE ===")
