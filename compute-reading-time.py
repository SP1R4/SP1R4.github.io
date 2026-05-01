#!/usr/bin/env python3
"""
For each post in posts.json, count the words in the linked writeup HTML
and store an integer `reading_time` (minutes, 200 wpm). Run after adding
or editing a writeup.
"""
import json
import re
from pathlib import Path

WPM = 200

with open('posts.json') as f:
    posts = json.load(f)

changed = False
for post in posts:
    html_path = Path(post['html'])
    if not html_path.is_file():
        print(f"  skip {post['slug']}: file not found")
        continue
    text = html_path.read_text()
    text = re.sub(r'<script[^>]*>.*?</script>', '', text, flags=re.DOTALL)
    text = re.sub(r'<style[^>]*>.*?</style>', '', text, flags=re.DOTALL)
    text = re.sub(r'<[^>]+>', ' ', text)
    words = len(re.findall(r"\b[\w'’-]+\b", text))
    minutes = max(1, round(words / WPM))
    if post.get('reading_time') != minutes:
        post['reading_time'] = minutes
        changed = True
    print(f"  {post['slug']}: {words} words → {minutes} min")

if changed:
    with open('posts.json', 'w') as f:
        json.dump(posts, f, indent=2, ensure_ascii=False)
        f.write('\n')
    print('posts.json updated')
else:
    print('No changes.')
