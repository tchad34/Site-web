#!/usr/bin/env python3
from pathlib import Path
import json, re, html

ROOT=Path(__file__).resolve().parent
FILMS=ROOT/"films"
OUT=FILMS/"catalogue.json"

def text(pattern, content, default=""):
    m=re.search(pattern, content, re.I|re.S)
    return html.unescape(re.sub(r"<[^>]+>","",m.group(1))).strip() if m else default

items=[]
for p in sorted(FILMS.glob("*.html")):
    content=p.read_text(encoding="utf-8", errors="ignore")
    title=text(r"<title[^>]*>(.*?)</title>",content,p.stem.replace("-"," ").title())
    title=re.sub(r"\s*[—|-]\s*NoxStream\s*$","",title,flags=re.I)
    year=text(r"(?:année|year)\s*[:\-]?\s*(20\d{2})",content,"")
    genre=text(r"(?:genre|catégorie)\s*[:\-]?\s*([^<\n]+)",content,"")
    poster=text(r'data-poster-class=["\']([^"\']+)',content,"poster-batman")
    items.append({
        "title":title,
        "year":year,
        "genre":genre,
        "posterClass":poster,
        "file":f"films/{p.name}"
    })

OUT.write_text(json.dumps(items,ensure_ascii=False,indent=2),encoding="utf-8")
print(f"{len(items)} film(s) détecté(s). Catalogue mis à jour : {OUT}")
