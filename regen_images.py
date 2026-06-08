# -*- coding: utf-8 -*-
import requests, time, sys
from pathlib import Path
from PIL import Image, ImageOps

sys.stdout.reconfigure(encoding='utf-8', line_buffering=True)

PROJECT = Path(__file__).parent
IMG     = PROJECT / "image" / "products"
TIMEOUT = 40

PRODUCTS = [

    # ── CONSOLAS ─────────────────────────────────────────────────────────────────
    {"id":  1, "nombre": "PlayStation 5 Disc Edition",
     "wiki": "", "url": "https://m.media-amazon.com/images/I/41NQoCqAgPL._AC_SL1440_.jpg"},

    {"id":  2, "nombre": "Nintendo Switch OLED",
     "wiki": "", "url": "https://m.media-amazon.com/images/I/71Q54HnKxwS._AC_SL1500_.jpg"},

    {"id":  3, "nombre": "Xbox Series X",
     "wiki": "", "url": "https://m.media-amazon.com/images/I/411ZXNVURYL._AC_SL1200_.jpg"},

    {"id":  4, "nombre": "Nintendo Switch Lite",
     "wiki": "", "url": "https://m.media-amazon.com/images/I/51uSBSWgaYL._AC_SL1080_.jpg"},

    {"id": 16, "nombre": "PS5 Slim Digital Edition",
     "wiki": "", "url": "https://m.media-amazon.com/images/I/51Q3MtJEJ0L._AC_SL1500_.jpg"},

    {"id": 17, "nombre": "Xbox Series S",
     "wiki": "", "url": "https://m.media-amazon.com/images/I/61MySTAZ5aL._AC_SL1500_.jpg"},

    # ── ACCESORIOS ───────────────────────────────────────────────────────────────
    {"id":  5, "nombre": "Auriculares Razer Kraken V3",
     "wiki": "", "url": "https://m.media-amazon.com/images/I/71xBzWj8M6L._AC_SL1500_.jpg"},

    {"id":  6, "nombre": "Teclado Razer BlackWidow V4",
     "wiki": "", "url": "https://m.media-amazon.com/images/I/61aoJqD5ITL._AC_SL1000_.jpg"},

    {"id":  7, "nombre": "Raton Razer DeathAdder V3",
     "wiki": "", "url": "https://m.media-amazon.com/images/I/61AcT0ZuO3L._AC_SL1500_.jpg"},

    {"id":  8, "nombre": "Monitor LG UltraGear 27 144Hz",
     "wiki": "", "url": "https://m.media-amazon.com/images/I/716H-E70hvL._AC_SL1500_.jpg"},

    {"id":  9, "nombre": "Auriculares Logitech G Pro X",
     "wiki": "", "url": ""},

    {"id": 10, "nombre": "Teclado HyperX Alloy Origins",
     "wiki": "", "url": "https://m.media-amazon.com/images/I/71LZTxxNVxL._AC_SL1500_.jpg"},

    {"id": 18, "nombre": "DualSense Edge Controller",
     "wiki": "", "url": ""},

    {"id": 19, "nombre": "Xbox Elite Controller Series 2",
     "wiki": "", "url": ""},

    {"id": 20, "nombre": "Raton Razer Basilisk V3",
     "wiki": "", "url": "https://m.media-amazon.com/images/I/71ohoFWDWYL._AC_SL1500_.jpg"},

    {"id": 21, "nombre": "Teclado Logitech G915 TKL",
     "wiki": "", "url": ""},

    {"id": 22, "nombre": "Auriculares HyperX Cloud Alpha",
     "wiki": "", "url": ""},

    {"id": 23, "nombre": "Monitor LG 32 4K 144Hz",
     "wiki": "", "url": ""},

    {"id": 24, "nombre": "Alfombrilla Razer Goliathus XXL",
     "wiki": "", "url": "https://m.media-amazon.com/images/I/41oChIiR0+L._AC_.jpg"},

    {"id": 25, "nombre": "PULSE 3D Wireless Headset",
     "wiki": "", "url": ""},

    # ── JUEGOS ───────────────────────────────────────────────────────────────────
    {"id": 11, "nombre": "Spider-Man 2 (PS5)",
     "wiki": "Marvel's_Spider-Man_2", "url": ""},

    {"id": 12, "nombre": "Zelda: Tears of the Kingdom",
     "wiki": "The_Legend_of_Zelda:_Tears_of_the_Kingdom", "url": ""},

    {"id": 13, "nombre": "God of War Ragnarok",
     "wiki": "God_of_War_Ragnar%C3%B6k", "url": ""},

    {"id": 14, "nombre": "Mario Kart 8 Deluxe",
     "wiki": "Mario_Kart_8_Deluxe", "url": ""},

    {"id": 15, "nombre": "Stellar Blade",
     "wiki": "Stellar_Blade", "url": ""},

    {"id": 26, "nombre": "Super Mario Bros. Wonder",
     "wiki": "Super_Mario_Bros._Wonder", "url": ""},

    {"id": 27, "nombre": "Demon's Souls Remake",
     "wiki": "Demon%27s_Souls_(2020_video_game)", "url": ""},

    {"id": 28, "nombre": "Pokemon Escarlata",
     "wiki": "Pok%C3%A9mon_Scarlet_and_Violet", "url": ""},

    {"id": 29, "nombre": "Forza Horizon 5",
     "wiki": "", "url": "https://cdn.cloudflare.steamstatic.com/steam/apps/1551360/header.jpg"},

    {"id": 30, "nombre": "Final Fantasy XVI",
     "wiki": "Final_Fantasy_XVI", "url": ""},

    {"id": 31, "nombre": "Animal Crossing: New Horizons",
     "wiki": "Animal_Crossing:_New_Horizons", "url": ""},

    {"id": 32, "nombre": "Halo Infinite",
     "wiki": "", "url": "https://cdn.cloudflare.steamstatic.com/steam/apps/1240440/header.jpg"},

]
# ────────────────────────────────────────────────────────────────────────────────


def get_wiki_thumbnail(wiki_title):
    """Wikipedia REST API — devuelve URL directa del archivo (sin restriccion de tamaño)."""
    import re
    api = f"https://en.wikipedia.org/api/rest_v1/page/summary/{wiki_title}"
    r = requests.get(api, timeout=15, headers={
        "User-Agent": "Mozilla/5.0 (compatible; GameXStore-TFG/1.0)",
        "Accept": "application/json",
    })
    r.raise_for_status()
    thumb = r.json().get("thumbnail", {}).get("source", "")
    if not thumb:
        raise ValueError("Sin thumbnail en Wikipedia")
    # SVG = logo, no sirve como foto de producto
    if ".svg" in thumb.lower():
        raise ValueError("Logo SVG detectado — aniade URL manual de Amazon.es")
    # Commons thumbnail → URL directa del archivo (evita restricciones de tamaño)
    if "/wikipedia/commons/thumb/" in thumb:
        thumb = thumb.replace("/wikipedia/commons/thumb/", "/wikipedia/commons/")
        thumb = re.sub(r"/\d+px-[^/?#]+$", "", thumb)
    # EN Wikipedia thumbnail → URL directa del archivo
    elif "/wikipedia/en/thumb/" in thumb:
        thumb = thumb.replace("/wikipedia/en/thumb/", "/wikipedia/en/")
        thumb = re.sub(r"/\d+px-[^/?#]+$", "", thumb)
    # EN Wikipedia directo (portadas de juegos) → usar tal cual
    return thumb


def download(url, dest, retries=3):
    dest.parent.mkdir(parents=True, exist_ok=True)
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Referer": "https://en.wikipedia.org/",
    }
    for attempt in range(retries):
        r = requests.get(url, timeout=TIMEOUT, headers=headers)
        if r.status_code == 429:
            wait = 30 * (attempt + 1)
            print(f"      rate limit — esperando {wait}s...", flush=True)
            time.sleep(wait)
            continue
        r.raise_for_status()
        if len(r.content) < 5000:
            raise ValueError("Imagen demasiado pequena (< 5KB)")
        dest.write_bytes(r.content)
        return
    raise Exception(f"Fallo tras {retries} intentos")


def process(raw_path, pid):
    img = Image.open(raw_path).convert("RGBA")
    bg  = Image.new("RGBA", img.size, (255, 255, 255, 255))
    bg.paste(img, mask=img.split()[3])
    img = bg.convert("RGB")
    for size_name, (w, h, q) in [("thumb",(300,300,88)), ("card",(600,600,88)), ("full",(1200,1200,92))]:
        out = IMG / size_name / f"{pid}.webp"
        out.parent.mkdir(parents=True, exist_ok=True)
        ImageOps.fit(img, (w, h), Image.LANCZOS, centering=(0.5, 0.4)).save(out, "WEBP", quality=q)
    jpg = IMG / "card" / f"{pid}.jpg"
    ImageOps.fit(img, (600, 600), Image.LANCZOS, centering=(0.5, 0.4)).save(jpg, "JPEG", quality=88, optimize=True)


# ── Ejecucion ────────────────────────────────────────────────────────────────────
sin_fuente = [p for p in PRODUCTS if not p["url"].strip() and not p["wiki"].strip()]
con_fuente = [p for p in PRODUCTS if p["url"].strip() or p["wiki"].strip()]

if sin_fuente:
    print("=" * 60)
    print(f"  {len(sin_fuente)} accesorios sin URL — busca en Amazon.es:")
    print("=" * 60)
    for p in sin_fuente:
        print(f"  ID {p['id']:02d}  {p['nombre']}")
    print()
    print("  Amazon.es → busca el producto → click derecho foto")
    print("  → 'Copiar direccion de imagen' → pega en campo url")
    print("=" * 60)
    print()

if not con_fuente:
    print("Ningun producto tiene fuente. Rellena wiki o url y ejecuta de nuevo.")
    sys.exit(0)

print(f"=== Procesando {len(con_fuente)}/32 productos ===\n")
ok, failed = 0, []
raw_dir = IMG / "raw"
raw_dir.mkdir(parents=True, exist_ok=True)

for p in sorted(con_fuente, key=lambda x: x["id"]):
    pid  = p["id"]
    name = p["nombre"]
    print(f"[{pid:02d}] {name}")

    img_url = p["url"].strip()

    # Si no hay URL manual, usar Wikipedia API
    if not img_url and p["wiki"].strip():
        try:
            img_url = get_wiki_thumbnail(p["wiki"])
            print(f"      wiki OK: {img_url[:70]}...")
        except Exception as e:
            print(f"      FAIL wiki: {e}")
            failed.append(pid)
            time.sleep(5)
            continue

    try:
        ext = img_url.split("?")[0].rsplit(".", 1)[-1].lower()
        ext = ext if ext in ("jpg", "jpeg", "png", "webp") else "jpg"
        raw = raw_dir / f"{pid}.{ext}"
        download(img_url, raw)
        process(raw, pid)
        print(f"      OK")
        ok += 1
    except Exception as e:
        print(f"      FAIL: {e}")
        failed.append(pid)

    time.sleep(5)

print(f"\n=== Terminado: {ok}/{len(con_fuente)} OK ===")
if failed:
    print(f"Fallos IDs: {failed}")
if sin_fuente:
    print(f"\n{len(sin_fuente)} accesorios pendientes — anadir URLs de Amazon.es y ejecutar de nuevo")
