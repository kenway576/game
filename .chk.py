# -*- coding: utf-8 -*-
import io, re, glob, os, collections
def outfits(char):
    d='public/images/characters/'+char
    if not os.path.isdir(d): return set()
    pre=set()
    for f in os.listdir(d):
        n=re.sub(r'_alt\d*$','',f.replace('.webp',''))
        if '_' in n: pre.add(n.split('_')[0])
    return pre
CH=[d for d in os.listdir('public/images/characters') if os.path.isdir('public/images/characters/'+d) and not d.startswith('_')]
OUT={c:outfits(c) for c in CH}
def fam(ch,name):
    n=re.sub(r'_alt\d*$','',name); h=n.split('_')[0]
    return h if h in OUT.get(ch,set()) else 'default'
bad=[]
for path in glob.glob('story/**/*.ts', recursive=True):
    s=io.open(path,encoding='utf-8').read()
    v2c=dict(re.findall(r"const (\w+)\s*=\s*'/images/characters/(\w+)/'", s))
    if not v2c: continue
    for pi,part in enumerate(re.split(r"type: 'scene'", s)):
        by=collections.defaultdict(lambda: collections.defaultdict(list))
        for m in re.finditer(r"characterImage: `\$\{(\w+)\}([a-z0-9_]+)\.webp`", part):
            v,n=m.groups(); ch=v2c.get(v)
            if ch: by[ch][fam(ch,n)].append(n)
        for ch,fs in by.items():
            if len(fs)>1: bad.append((os.path.basename(path),pi,ch,{k:v[:3] for k,v in fs.items()}))
print(len(bad),'处场景内换衣')
for b in bad[:12]: print(' ',b[0],'段',b[1],b[2],b[3])
