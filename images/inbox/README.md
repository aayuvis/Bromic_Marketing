# Image inbox — drop Bromic images here

Any JPG/PNG/WEBP/TIFF from bromic.com, the Bromic asset library (DAM), photo shoots or dealers. Subfolders are fine:
name a folder after the product or project (e.g. `eclipse/`, `tungsten-coastal/`, `project-malibu-terrace/`) and that
name becomes the image's product/setting tag.

Then run, from the repo root:

    python3 scripts/ingest_images.py            # resize to webp, add to images/library/manifest.json
    python3 scripts/ingest_images.py --dry-run  # see what would happen

Originals stay here (git LFS recommended for large shoots); the library gets a 1600px web copy and a 520px thumb.
After ingest, open the Content Hub → Images, review the auto tags, and edit `images/library/manifest.json`
(product, setting, audiences, alt text, rights) where needed.
