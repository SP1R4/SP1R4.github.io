#!/bin/bash
# Generates feed.xml from posts.json
# Usage: ./generate-feed.sh

set -e

SITE="https://sp1r4.github.io"
POSTS_JSON="posts.json"
OUTPUT="feed.xml"

if [ ! -f "$POSTS_JSON" ]; then
  echo "Error: $POSTS_JSON not found" >&2
  exit 1
fi

cat > "$OUTPUT" << 'HEADER'
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>NOCTIS Blog</title>
    <link>https://sp1r4.github.io/blog.html</link>
    <description>Cybersecurity research, CTF writeups, and development notes by S. Markakis.</description>
    <language>en</language>
    <atom:link href="https://sp1r4.github.io/feed.xml" rel="self" type="application/rss+xml"/>
HEADER

python3 -c "
import json, sys
from datetime import datetime

with open('$POSTS_JSON') as f:
    posts = json.load(f)

posts.sort(key=lambda p: p['date'], reverse=True)

for post in posts:
    date = datetime.strptime(post['date'], '%Y-%m-%d')
    rfc822 = date.strftime('%a, %d %b %Y 00:00:00 GMT')
    tags = ''.join(f'      <category>{t}</category>\n' for t in post.get('tags', []))
    print(f'''    <item>
      <title>{post['title']}</title>
      <link>$SITE/blog.html#{post['slug']}</link>
      <guid>$SITE/blog.html#{post['slug']}</guid>
      <pubDate>{rfc822}</pubDate>
      <description>{post['description']}</description>
{tags.rstrip()}
    </item>''')
" >> "$OUTPUT"

cat >> "$OUTPUT" << 'FOOTER'
  </channel>
</rss>
FOOTER

echo "Generated $OUTPUT with $(python3 -c "import json; print(len(json.load(open('$POSTS_JSON'))))" ) posts"
