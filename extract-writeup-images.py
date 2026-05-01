#!/usr/bin/env python3
"""
Extract base64-embedded images from writeup HTML files into per-writeup
asset folders, replacing data URIs with relative paths. Idempotent: a file
that has no data URIs is left untouched.

Usage: ./extract-writeup-images.py
"""
import base64
import hashlib
import re
from pathlib import Path

WRITEUPS = Path('writeups')
ASSETS = WRITEUPS / 'assets'

EXT_MAP = {
    'jpeg': 'jpg', 'jpg': 'jpg', 'png': 'png', 'gif': 'gif',
    'webp': 'webp', 'svg+xml': 'svg', 'bmp': 'bmp',
}

DATA_URI = re.compile(
    r'data:image/(?P<mime>[a-zA-Z0-9.+-]+);base64,(?P<b64>[A-Za-z0-9+/=\s]+?)(?=["\')\s])'
)

def slug_from_filename(p: Path) -> str:
    return p.stem  # e.g. "htb-sandworm"

def process(html_path: Path) -> int:
    text = html_path.read_text()
    if 'data:image/' not in text:
        return 0
    slug = slug_from_filename(html_path)
    out_dir = ASSETS / slug
    out_dir.mkdir(parents=True, exist_ok=True)
    seen = {}
    counter = [0]

    def replace(match: re.Match) -> str:
        mime = match.group('mime').lower()
        b64 = re.sub(r'\s+', '', match.group('b64'))
        ext = EXT_MAP.get(mime, mime.split('+')[0])
        try:
            raw = base64.b64decode(b64, validate=False)
        except Exception:
            return match.group(0)
        digest = hashlib.sha1(raw).hexdigest()[:10]
        if digest in seen:
            return seen[digest]
        counter[0] += 1
        filename = f'img-{counter[0]:02d}-{digest}.{ext}'
        (out_dir / filename).write_bytes(raw)
        rel = f'assets/{slug}/{filename}'
        seen[digest] = rel
        return rel

    new_text = DATA_URI.sub(replace, text)
    html_path.write_text(new_text)
    return counter[0]

def main() -> None:
    if not WRITEUPS.is_dir():
        raise SystemExit('writeups/ not found — run from repo root')
    total = 0
    for path in sorted(WRITEUPS.glob('*.html')):
        n = process(path)
        if n:
            print(f'  {path.name}: extracted {n} image(s)')
            total += n
        else:
            print(f'  {path.name}: no data URIs')
    print(f'Done. {total} image(s) extracted into {ASSETS}/')

if __name__ == '__main__':
    main()
