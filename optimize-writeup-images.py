#!/usr/bin/env python3
"""
For each PNG/JPG under writeups/assets/<slug>/, generate a WebP sibling
and rewrite each writeup's <img src="...png"> into a <picture> with the
WebP preferred + the original as fallback. Also injects width/height
attributes so the browser can reserve space and avoid layout shift.

Idempotent: rerun safely.
"""
import re
from pathlib import Path
from PIL import Image

WRITEUPS = Path('writeups')
ASSETS = WRITEUPS / 'assets'
WEBP_QUALITY = 82

IMG_EXTS = {'.png', '.jpg', '.jpeg'}


def make_webp(src: Path) -> Path | None:
    out = src.with_suffix('.webp')
    if out.exists() and out.stat().st_mtime >= src.stat().st_mtime:
        return out
    try:
        with Image.open(src) as im:
            if im.mode in ('P', 'LA'):
                im = im.convert('RGBA')
            im.save(out, 'WEBP', quality=WEBP_QUALITY, method=6)
        return out
    except Exception as e:
        print(f'  failed to convert {src}: {e}')
        return None


def get_dims(path: Path) -> tuple[int, int] | None:
    try:
        with Image.open(path) as im:
            return im.size
    except Exception:
        return None


def rewrite_html(path: Path) -> int:
    text = path.read_text()
    if 'data-img-optimized' in text:
        return 0
    base_dir = path.parent

    # Match <img ... src="something"> tags. Avoid double-wrapping.
    img_re = re.compile(r'<img\b([^>]*?)\s*/?>', re.IGNORECASE)
    changed = 0

    def replace(m):
        nonlocal changed
        attrs = m.group(1)
        if '<picture' in m.group(0):
            return m.group(0)
        src_m = re.search(r'\bsrc=["\']([^"\']+)["\']', attrs)
        if not src_m:
            return m.group(0)
        src = src_m.group(1)
        if src.startswith('data:') or src.startswith('http'):
            return m.group(0)
        ext = Path(src).suffix.lower()
        if ext not in IMG_EXTS:
            return m.group(0)

        local = (base_dir / src).resolve()
        if not local.is_file():
            return m.group(0)

        webp_local = local.with_suffix('.webp')
        if not webp_local.is_file():
            make_webp(local)
        if not webp_local.is_file():
            return m.group(0)

        webp_rel = src.rsplit('.', 1)[0] + '.webp'
        dims = get_dims(local)
        attrs2 = attrs
        if dims and 'width=' not in attrs2:
            attrs2 += f' width="{dims[0]}" height="{dims[1]}"'
        if 'loading=' not in attrs2:
            attrs2 += ' loading="lazy" decoding="async"'

        changed += 1
        return (
            f'<picture data-img-optimized="1">'
            f'<source srcset="{webp_rel}" type="image/webp">'
            f'<img{attrs2}>'
            f'</picture>'
        )

    new_text = img_re.sub(replace, text)
    if changed:
        path.write_text(new_text)
    return changed


def main() -> None:
    if not WRITEUPS.is_dir():
        raise SystemExit('writeups/ not found — run from repo root')
    # Generate webp siblings for everything that has one possible.
    for img in ASSETS.rglob('*'):
        if img.suffix.lower() in IMG_EXTS:
            make_webp(img)
    total_changed = 0
    for html in sorted(WRITEUPS.glob('*.html')):
        n = rewrite_html(html)
        if n:
            print(f'  {html.name}: wrapped {n} <img> tag(s)')
            total_changed += n
        else:
            print(f'  {html.name}: already optimized')
    print(f'Done. {total_changed} <img> tag(s) wrapped this run.')


if __name__ == '__main__':
    main()
