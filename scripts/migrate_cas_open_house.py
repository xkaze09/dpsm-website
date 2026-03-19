"""
One-time script: upload CAS Open House images to Supabase storage
and patch the article content with the proper <img> tags.

Run from repo root:
  cd backend && pip install supabase httpx && cd ..
  python scripts/migrate_cas_open_house.py
"""

import asyncio
import os
import sys
from pathlib import Path

# ── Config ────────────────────────────────────────────────────────────────────
SUPABASE_URL = "https://ioljnomsbyegaddveyvs.supabase.co"
SERVICE_ROLE_KEY = (
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9."
    "eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvbGpub21zYnllZ2FkZHZleXZzIiwi"
    "cm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Mzc2MjI3MCwiZXhwIjoyMDg5"
    "MzM4MjcwfQ.0lcgWBIbi2BPZrWfwqqHQvjJH_q8KCvVd_F5YOu28JA"
)
BUCKET = "article-images"
STORAGE_PREFIX = "body/cas-open-house"
ARTICLE_SLUG = "cas-open-house"

IMAGES_DIR = Path(__file__).parent.parent / "images" / "article-images" / "dpsm" / "cas-open-house"

ARTICLE_TEXT = """<p>The Division of Physical Sciences and Mathematics at UP Visayas served science with a delectable fusion of technology and gastronomy during the College of Arts and Sciences Open House. DPSM students creatively showcased their programs through food items like "Memory Chips" and "Soup-ercomputer," drawing curious visitors into the world of mathematics, computer science, statistics, and physics.</p>
<p>The event highlighted the ever-present relevance of technology and the exciting opportunities for innovation that await students in the DPSM programs. Through interactive displays and creative presentations, the division demonstrated how science and mathematics are woven into everyday life.</p>"""

# ── Natural sort for filenames like cas-open-house-0, -1, ..., -20 ──────────
import re

def _natural_key(p: Path):
    parts = re.split(r'(\d+)', p.stem)
    return [int(c) if c.isdigit() else c.lower() for c in parts]


async def main():
    try:
        from supabase import create_async_client
    except ImportError:
        print("ERROR: supabase package not installed. Run: pip install supabase")
        sys.exit(1)

    db = await create_async_client(SUPABASE_URL, SERVICE_ROLE_KEY)

    # Collect and sort images
    image_files = sorted(IMAGES_DIR.glob("*.jpg"), key=_natural_key)
    if not image_files:
        print(f"ERROR: No images found in {IMAGES_DIR}")
        sys.exit(1)

    print(f"Found {len(image_files)} images. Uploading...")

    public_urls = []
    for img_path in image_files:
        dest = f"{STORAGE_PREFIX}/{img_path.name}"
        content = img_path.read_bytes()

        # Try upload; skip if already exists
        try:
            await db.storage.from_(BUCKET).upload(
                dest, content, file_options={"content-type": "image/jpeg"}
            )
            print(f"  [ok] uploaded {img_path.name}")
        except Exception as exc:
            if "already exists" in str(exc).lower() or "duplicate" in str(exc).lower():
                print(f"  [skip] already exists {img_path.name}")
            else:
                print(f"  [FAIL] {img_path.name}: {exc}")
                continue

        url = await db.storage.from_(BUCKET).get_public_url(dest)
        public_urls.append((img_path.stem, url))

    if not public_urls:
        print("No URLs collected — aborting.")
        sys.exit(1)

    # Build Quill-compatible HTML
    img_tags = "\n".join(
        f'<p><img src="{url}" alt="{stem}"></p>'
        for stem, url in public_urls
    )
    content_html = f"{ARTICLE_TEXT}\n{img_tags}"

    # Find the article by slug and update its content
    result = await db.table("articles").select("id, title").eq("slug", ARTICLE_SLUG).execute()
    if not result.data:
        print(f"ERROR: Article with slug '{ARTICLE_SLUG}' not found in database.")
        sys.exit(1)

    article = result.data[0]
    print(f"\nPatching article: [{article['id']}] {article['title']}")

    await db.table("articles").update({"content": content_html}).eq("slug", ARTICLE_SLUG).execute()
    print(f"[ok] Article content updated with {len(public_urls)} images.")
    print(f"\nDone! View at: https://upvdpsm.com/article.html?slug={ARTICLE_SLUG}")


if __name__ == "__main__":
    asyncio.run(main())
