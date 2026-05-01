#!/bin/bash
# Validates posts.json + feed.xml + linked HTML files all agree.
# Run before committing, or in CI.

set -e

python3 <<'PYEOF'
import json, os, sys, xml.etree.ElementTree as ET
from pathlib import Path

errors = []

with open('posts.json') as f:
    posts = json.load(f)

required = {'slug', 'title', 'description', 'date', 'tags', 'html'}
seen_slugs = set()

for i, p in enumerate(posts):
    missing = required - p.keys()
    if missing:
        errors.append(f"posts.json[{i}]: missing fields {missing}")
        continue
    if p['slug'] in seen_slugs:
        errors.append(f"posts.json[{i}]: duplicate slug '{p['slug']}'")
    seen_slugs.add(p['slug'])
    if not Path(p['html']).is_file():
        errors.append(f"posts.json[{i}] '{p['slug']}': html path does not exist: {p['html']}")
    try:
        from datetime import datetime
        datetime.strptime(p['date'], '%Y-%m-%d')
    except ValueError:
        errors.append(f"posts.json[{i}] '{p['slug']}': bad date format: {p['date']}")
    if not isinstance(p.get('tags'), list) or not p['tags']:
        errors.append(f"posts.json[{i}] '{p['slug']}': tags must be a non-empty list")

if Path('feed.xml').exists():
    try:
        tree = ET.parse('feed.xml')
        feed_slugs = set()
        for item in tree.iter('item'):
            link = item.findtext('link', '')
            slug = link.split('#')[-1] if '#' in link else ''
            if slug:
                feed_slugs.add(slug)
        post_slugs = {p['slug'] for p in posts}
        if feed_slugs != post_slugs:
            missing = post_slugs - feed_slugs
            extra = feed_slugs - post_slugs
            if missing:
                errors.append(f"feed.xml is missing slugs: {missing}. Run ./generate-feed.sh")
            if extra:
                errors.append(f"feed.xml has stale slugs: {extra}. Run ./generate-feed.sh")
    except ET.ParseError as e:
        errors.append(f"feed.xml is malformed: {e}")
else:
    errors.append("feed.xml is missing. Run ./generate-feed.sh")

if errors:
    print("Validation failed:")
    for e in errors:
        print(f"  - {e}")
    sys.exit(1)

print(f"OK: {len(posts)} posts, all html paths exist, feed.xml in sync.")
PYEOF
