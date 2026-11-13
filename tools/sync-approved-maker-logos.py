#!/usr/bin/env python3
"""One-time download of verified maker logos into the release branch.
No manufacturer mark is generated or redrawn. Reuses official hosted originals.
"""
from __future__ import annotations
import hashlib, json, os, time, urllib.request, urllib.parse
from pathlib import Path
from io import BytesIO
from PIL import Image
ROOT=Path(__file__).resolve().parent.parent
DEST=ROOT/"assets"/"maker-logos"
DEST.mkdir(parents=True,exist_ok=True)
USER_AGENT="RoboQuo brand reference sync (contact info@roboquo.com)"
def download(url):
    for n in range(4):
        try:
            request=urllib.request.Request(url,headers={"User-Agent":USER_AGENT})
            with urllib.request.urlopen(request,timeout=25) as f:
                data=f.read(4_000_001)
                if len(data)>4_000_000: raise ValueError("Image too large")
                if data[:8]!=bytes.fromhex("89504e470d0a1a0a"): raise ValueError("Expected real PNG image")
                return data
        except Exception:
            if n==3: raise
            time.sleep(2*(n+1))
def commons(title):
    query=urllib.parse.urlencode({"action":"query","titles":"File:"+title,"prop":"imageinfo","iiprop":"url|mime","iiurlwidth":"560","format":"json"})
    r=urllib.request.Request("https://commons.wikimedia.org/w/api.php?"+query,headers={"User-Agent":USER_AGENT})
    with urllib.request.urlopen(r,timeout=30) as f: obj=json.load(f)
    page=next(iter(obj["query"]["pages"].values()))
    info=page["imageinfo"][0]
    return info.get("thumburl") or info["url"]
def trim_aidin(data):
    im=Image.open(BytesIO(data)).convert("RGBA")
    px=im.load()
    x0,y0,x1,y1=im.width,im.height,0,0
    for y in range(0,im.height,2):
        for x in range(0,im.width,2):
            r,g,b,a=px[x,y]
            if a>70 and r+g+b<670:
                x0=min(x0,x);y0=min(y0,y);x1=max(x1,x);y1=max(y1,y)
    if x1<=x0 or y1<=y0: raise ValueError("AIDIN image contains no visible logo")
    im=im.crop((max(0,x0-18),max(0,y0-18),min(im.width,x1+19),min(im.height,y1+19)))
    o=BytesIO();im.save(o,format="PNG");return o.getvalue()
def crop_pisco(data):
    im=Image.open(BytesIO(data)).convert("RGBA")
    if im.width<157 or im.height<106: raise ValueError("Unexpected PISCO original dimensions")
    o=BytesIO();im.crop((0,0,157,106)).save(o,format="PNG");return o.getvalue()
images=[
("dobot-approved.png",lambda:commons("Copy of 横版.svg"),None),
("jaka-approved.png",lambda:"https://www.jaka.com/profile/upload/2023/11/16/02%20%20RGB%E6%A8%A1%E5%BC%8F%20logo-%E9%80%8F%E6%98%8E%E5%BA%95_20231116160604A005.png",None),
("estun-approved.png",lambda:commons("Estun Logo.svg"),None),
("techman-approved.png",lambda:"https://www.tm-robot.com/images/footer/footer-logo.png",None),
("hiwin-approved.png",lambda:commons("Hiwin logo.svg"),None),
("delta-approved.png",lambda:"https://www.deltaww.com/images/delta_logo.png",None),
("hanwha-approved.png",lambda:commons("Hanwha Robotics CMYK 4 KEH.png"),None),
("neuromeka-approved.png",lambda:"https://static.wixstatic.com/media/a83c47_6d3e6f5a51fa48e5a2bd3a099937b525~mv2.png",None),
("piab-approved.png",lambda:"https://www.piabgroup.com/globalassets/piab-group/brands-images-and-blocks/piab.png",None),
("aidin-robotics-approved.png",lambda:"https://static.wixstatic.com/media/d71e42_e1d5db6bf45d40c484b0c0ff01481556~mv2.png",trim_aidin),
("pisco-approved.png",lambda:"https://shop.pisco.com/wp-content/uploads/2023/04/logo.png",crop_pisco),
]
manifest=[]
for file,urlfn,transform in images:
    url=urlfn();raw=download(url)
    if transform: raw=transform(raw)
    im=Image.open(BytesIO(raw)); im.verify()
    if len(raw)<150: raise RuntimeError("Unexpected tiny logo "+file)
    (DEST/file).write_bytes(raw)
    manifest.append({"file":file,"source":url,"sha256":hashlib.sha256(raw).hexdigest(),"bytes":len(raw)})
    print("OK",file,len(raw),flush=True)
(DEST/"APPROVED_SOURCES_20261114.json").write_text(json.dumps(manifest,indent=2,ensure_ascii=False)+"\n",encoding="utf-8")
print("OK verified logo count",len(manifest))
