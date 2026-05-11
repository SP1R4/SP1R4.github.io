#!/bin/bash
# Add a new blog post to posts.json and regenerate feed.xml
# Usage: ./add-post.sh <slug> "<title>" "<description>" <html-path> [tag1,tag2,...]
# Example: ./add-post.sh htb-runner "HTB: Runner" "Walkthrough of the Runner box." writeups/htb-runner.html hackthebox

set -e

if [ $# -lt 4 ]; then
  echo "Usage: $0 <slug> \"<title>\" \"<description>\" <html-path> [tag1,tag2,...]"
  echo "Example: $0 htb-runner \"HTB: Runner\" \"Walkthrough.\" writeups/htb-runner.html hackthebox"
  exit 1
fi

SLUG="$1"
TITLE="$2"
DESC="$3"
HTML_PATH="$4"
TAGS="${5:-hackthebox}"
DATE="$(date +%Y-%m-%d)"

if [ ! -f "$HTML_PATH" ]; then
  echo "Error: $HTML_PATH does not exist" >&2
  exit 1
fi

python3 - <<PYEOF
import json

with open('posts.json') as f:
    posts = json.load(f)

if any(p['slug'] == "$SLUG" for p in posts):
    raise SystemExit("Error: slug '$SLUG' already exists in posts.json")

new_post = {
    "slug": "$SLUG",
    "title": "$TITLE",
    "description": "$DESC",
    "date": "$DATE",
    "tags": "$TAGS".split(','),
    "html": "$HTML_PATH",
}
posts.insert(0, new_post)

with open('posts.json', 'w') as f:
    json.dump(posts, f, indent=2, ensure_ascii=False)
    f.write('\n')

print(f"Added: {new_post['title']} ({new_post['slug']})")
PYEOF

echo
echo "─── Extracting embedded images ───"
python3 extract-writeup-images.py

echo
echo "─── Optimizing images (WebP + dimensions) ───"
python3 optimize-writeup-images.py

echo
echo "─── Computing reading times ───"
python3 compute-reading-time.py

echo
echo "─── Injecting JSON-LD ───"
python3 inject-jsonld.py

echo
echo "─── Generating OG card ───"
python3 generate-og-images.py

echo
echo "─── Regenerating feed.xml ───"
./generate-feed.sh

echo
echo "─── Regenerating sitemap.xml ───"
./generate-sitemap.sh

echo
echo "─── Rebuilding search index (Pagefind) ───"
if command -v npx >/dev/null 2>&1; then
  npx -y pagefind@latest --site . --output-path pagefind --quiet || echo "Pagefind failed; search index not rebuilt"
else
  echo "Skipping Pagefind: npx not found"
fi

echo
echo "─── Validating ───"
./validate.sh

echo
echo "Done. Review changes, then:"
echo "  git add . && git commit -m 'Add $SLUG writeup' && git push"
