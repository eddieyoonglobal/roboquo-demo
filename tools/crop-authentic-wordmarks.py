#!/usr/bin/env python3
"""Trim whitespace around *existing authentic* RoboQuo logo artwork.
No recreated lettering, colors or iconography. Original source SVG stays intact.
"""
from __future__ import annotations
import base64
import io
import json
import re
from pathlib import Path
from PIL import Image
ROOT=Path(__file__).resolve().parents[1]
FOLDER=ROOT/"assets"/"maker-logos"
ENTRIES={"FANUC":"fanuc", "OnRobot":"onrobot", "SCHUNK":"schunk"}
manifest=[]
def raster_svg(svg_path:Path)->Image.Image:
    data=svg_path.read_bytes()
    match=re.search(rb'data:image/png;base64,([^"\x27]+)',data)
    if match:
        raw=base64.b64decode(match.group(1))
        return Image.open(io.BytesIO(raw)).convert("RGBA")
    import cairosvg
    return Image.open(io.BytesIO(cairosvg.svg2png(bytestring=data))).convert("RGBA")
for brand,slug in ENTRIES.items():
    src=FOLDER/(slug+".svg")
    if not src.is_file():
        raise FileNotFoundError(src)
    im=raster_svg(src)
    px=im.load()
    x0,y0,x1,y1=im.width,im.height,-1,-1
    detected=0
    # Visible artwork has alpha or significantly non-white pixels.
    # This treats an opaque white canvas as whitespace, without modifying any pixels inside the crop.
    for y in range(im.height):
        for x in range(im.width):
            r,g,b,a=px[x,y]
            visible=a>30 and (a<245 or min(r,g,b)<224)
            if visible:
                x0=min(x0,x);y0=min(y0,y)
                x1=max(x1,x);y1=max(y1,y)
                detected+=1
    if detected<300 or x1<=x0 or y1<=y0:
        raise RuntimeError(f"{brand} failed to detect authentic artwork: {detected} pixels")
    pad_x=max(5,round((x1-x0)*.035))
    pad_y=max(5,round((y1-y0)*.075))
    box=(max(0,x0-pad_x),max(0,y0-pad_y),min(im.width,x1+pad_x+1),min(im.height,y1+pad_y+1))
    crop=im.crop(box)
    # Keep original colors, proportions and complete glyphs; only remove outer empty margins.
    if crop.width>1100:
        target=(1100,round(crop.height*1100/crop.width))
        crop=crop.resize(target,Image.Resampling.LANCZOS)
    dest=FOLDER/(slug+"-trimmed-20261114.png")
    crop.save(dest,format="PNG",optimize=True)
    stat={"brand":brand,"source":str(src.relative_to(ROOT)),"output":str(dest.relative_to(ROOT)),
          "originalSize":[im.width,im.height],"contentBounds":[x0,y0,x1,y1],
          "crop":[*box],"outputSize":[crop.width,crop.height],"visiblePixels":detected}
    manifest.append(stat)
    print(json.dumps(stat),flush=True)
(FOLDER/"TRIMMED_WORDMARKS_20261114.json").write_text(json.dumps(manifest,indent=2,ensure_ascii=False)+"\n",encoding="utf-8")
print("PASS authentic cropped wordmarks",len(manifest))
