# Genera icons/palmeras.svg (escena tropical) e icons/discoball.svg (bola disco realista)
import math, random

def f(v):
    s = f"{v:.1f}"
    return s[:-2] if s.endswith(".0") else s

def fmt(p):
    return f"{f(p[0])} {f(p[1])}"

def bez(p0, p1, p2, t):
    return ((1-t)**2*p0[0] + 2*(1-t)*t*p1[0] + t*t*p2[0],
            (1-t)**2*p0[1] + 2*(1-t)*t*p1[1] + t*t*p2[1])

def bez_tan(p0, p1, p2, t):
    dx = 2*(1-t)*(p1[0]-p0[0]) + 2*t*(p2[0]-p1[0])
    dy = 2*(1-t)*(p1[1]-p0[1]) + 2*t*(p2[1]-p1[1])
    l = math.hypot(dx, dy) or 1
    return dx/l, dy/l

# ---------------- PALMERAS ----------------

def frond(cx, cy, ang, L, droop=0.5, nl=None, width=0.23, sweep=0.2, rnd=None):
    if nl is None:
        nl = max(16, int(L/5.5))   # foliolos proporcionales al largo: nunca "guirnalda"
    a = math.radians(ang)
    dx, dy = math.cos(a), math.sin(a)
    p0 = (cx, cy)
    p1 = (cx + dx*L*0.52, cy + dy*L*0.52 - L*0.12)
    p2 = (cx + dx*L, cy + dy*L + L*droop)
    pts = [bez(p0, p1, p2, i/nl) for i in range(nl+1)]
    tans = [bez_tan(p0, p1, p2, i/nl) for i in range(nl+1)]
    def tip(i, side):
        t = i/nl
        rx, ry = pts[i]
        tx, ty = tans[i]
        px, py = -ty*side, tx*side
        ll = L*width*(1.05 - 0.85*t) * (0.86 + 0.28*rnd.random())
        lx = rx + px*ll - tx*ll*sweep
        ly = ry + py*ll - ty*ll*sweep + ll*0.22
        return (lx, ly)
    d = f"M{fmt(p0)}"
    for i in range(1, nl+1):
        d += f"L{fmt(tip(i, 1))}L{fmt(pts[i])}"
    for i in range(nl, 0, -1):
        d += f"L{fmt(tip(i, -1))}L{fmt(pts[i-1])}"
    return d + "Z"

def trunk(base, ctrl, top, wb, wt, n=14):
    left, right = [], []
    for i in range(n+1):
        t = i/n
        x, y = bez(base, ctrl, top, t)
        tx, ty = bez_tan(base, ctrl, top, t)
        w = (wb + (wt-wb)*t) / 2
        left.append((x - ty*w*-1, y + tx*w*-1))
        right.append((x - ty*w, y + tx*w))
    d = f"M{fmt(left[0])}"
    for p in left[1:]:
        d += f"L{fmt(p)}"
    for p in reversed(right):
        d += f"L{fmt(p)}"
    return d + "Z"

def palm(bx, by, cxp, cyp, wb, wt, fr_len, seed, bend=40, nfr=11, droop=0.5):
    rnd = random.Random(seed)
    ctrl = ((bx+cxp)/2 + bend, (by+cyp)/2)
    d = trunk((bx, by), ctrl, (cxp, cyp), wb, wt)
    # núcleo de la copa para que las frondas nazcan de algo sólido
    hub = wt * 1.7
    d += (f"M{f(cxp+hub)} {f(cyp)}"
          f"a{f(hub)} {f(hub)} 0 1 0 {f(-2*hub)} 0"
          f"a{f(hub)} {f(hub)} 0 1 0 {f(2*hub)} 0Z")
    angs = []
    for i in range(nfr):
        angs.append(-176 + i*(172/(nfr-1)) + rnd.uniform(-5, 5))
    for a in angs:
        up = abs(a + 90) / 90            # 0 = vertical, 1 = horizontal
        L = fr_len * (0.7 + 0.4*up) * rnd.uniform(0.92, 1.08)
        dr = droop * (0.55 + 0.6*up)
        d += frond(cxp, cyp, a, L, droop=dr, rnd=rnd)
    # cocos
    for i, (ox, oy, r) in enumerate([(-10, 12, 9.5), (4, 16, 8.5), (14, 8, 7.5)]):
        d += (f"M{f(cxp+ox+r)} {f(cyp+oy)}"
              f"a{f(r)} {f(r)} 0 1 0 {f(-2*r)} 0"
              f"a{f(r)} {f(r)} 0 1 0 {f(2*r)} 0Z")
    return d

def palms_svg():
    parts = []
    # --- lejanas (más claras, cerca del sol a 250,522) ---
    far = palm(96, 640, 120, 520, 8, 5, 62, seed=11, bend=14, nfr=7, droop=0.55)
    far += palm(392, 655, 372, 525, 8, 5, 60, seed=12, bend=-12, nfr=7, droop=0.55)
    parts.append(f'<path fill="#0e4a33" opacity=".9" d="{far}"/>')
    # --- capa media: fronda colgando de arriba + arbusto bajo ---
    rnd = random.Random(21)
    mid = ""
    for a, L in [(52, 175), (72, 150), (34, 155)]:
        mid += frond(30, -30, a, L, droop=0.32, rnd=rnd)
    for a, L in [(128, 180), (108, 155), (146, 160)]:
        mid += frond(475, -35, a, L, droop=0.32, rnd=rnd)
    for a, L in [(-118, 150), (-95, 170), (-68, 145), (-142, 125)]:
        mid += frond(250, 940, a, L, droop=0.22, rnd=rnd)
    parts.append(f'<path fill="#0a3a27" d="{mid}"/>')
    # --- principales: una a cada lado, enmarcando ---
    left = palm(52, 950, 134, 442, 34, 15, 162, seed=5, bend=52, nfr=10, droop=0.5)
    right = palm(452, 960, 356, 375, 38, 16, 172, seed=8, bend=-58, nfr=10, droop=0.5)
    parts.append(f'<path fill="#052018" d="{left}{right}"/>')
    body = "".join(parts)
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 900">{body}</svg>')

# ---------------- BOLA DISCO ----------------

def norm(v):
    l = math.sqrt(sum(x*x for x in v))
    return tuple(x/l for x in v)

def mix(c1, c2, t):
    return tuple(round(c1[i] + (c2[i]-c1[i])*t) for i in range(3))

def hexc(c):
    return "#%02x%02x%02x" % c

def disco_svg():
    rnd = random.Random(9)
    W, H = 260, 310
    cx, cy, r = 130, 176, 108
    Ldir = norm((-0.42, -0.68, 0.6))
    dark, light = (30, 34, 54), (233, 239, 252)
    tints = [(244, 114, 182), (56, 189, 248), (168, 85, 247), (251, 191, 36), (52, 211, 153)]
    facets = []
    spark_spots = []
    dlat, dlon = 12, 12
    for lat in range(-90, 90, dlat):
        for lon in range(-90, 90, dlon):
            la_c = math.radians(lat + dlat/2)
            lo_c = math.radians(lon + dlon/2)
            n = (math.cos(la_c)*math.sin(lo_c), math.sin(la_c), math.cos(la_c)*math.cos(lo_c))
            if n[2] < 0.03:
                continue
            corners3d = []
            for (la, lo) in [(lat, lon), (lat+dlat, lon), (lat+dlat, lon+dlon), (lat, lon+dlon)]:
                la_r, lo_r = math.radians(la), math.radians(lo)
                p = (math.cos(la_r)*math.sin(lo_r), math.sin(la_r), math.cos(la_r)*math.cos(lo_r))
                # encoge hacia el centro (junta de los espejitos)
                p = tuple(n[i] + (p[i]-n[i])*0.9 for i in range(3))
                corners3d.append(p)
            b = max(0.0, sum(n[i]*Ldir[i] for i in range(3)))
            v = max(0.05, min(1.0, b**0.8 + rnd.uniform(-0.09, 0.09)))
            col = mix(dark, light, v)
            if rnd.random() < 0.15:
                col = mix(col, rnd.choice(tints), 0.5)
            if b > 0.88 and rnd.random() < 0.55:
                col = mix(col, (255, 255, 255), 0.75)
            pts = " ".join(f"{f(cx + p[0]*r)},{f(cy + p[1]*r)}" for p in corners3d)
            facets.append(f'<polygon points="{pts}" fill="{hexc(col)}"/>')
            if b > 0.6 and n[2] > 0.4 and rnd.random() < 0.12 and len(spark_spots) < 6:
                spark_spots.append((cx + n[0]*r*0.96, cy + n[1]*r*0.96))
    sparks = ""
    for i, (sx, sy) in enumerate(spark_spots):
        dur = 2.2 + i*0.7
        beg = i*0.9
        sparks += (
            f'<g opacity="0" transform="translate({f(sx)} {f(sy)})">'
            f'<rect x="-9" y="-1" width="18" height="2" rx="1" fill="#fff"/>'
            f'<rect x="-1" y="-9" width="2" height="18" rx="1" fill="#fff"/>'
            f'<circle r="2.4" fill="#fff"/>'
            f'<animate attributeName="opacity" values="0;1;0" dur="{dur}s" begin="{beg}s" repeatCount="indefinite"/>'
            f'</g>')
    chain = (
        '<rect x="128" y="0" width="4" height="20" rx="2" fill="#9aa3ba"/>'
        '<circle cx="130" cy="26" r="7" fill="none" stroke="#aeb7cc" stroke-width="3.5"/>'
        '<circle cx="130" cy="40" r="7" fill="none" stroke="#8f98b0" stroke-width="3.5"/>'
        '<path d="M114 52 L146 52 L140 66 L120 66 Z" fill="#6d7590"/>')
    defs = (
        '<defs>'
        '<radialGradient id="sh" cx="0.36" cy="0.28" r="0.85">'
        '<stop offset="0" stop-color="#fff" stop-opacity=".55"/>'
        '<stop offset=".22" stop-color="#fff" stop-opacity=".12"/>'
        '<stop offset=".6" stop-color="#000" stop-opacity="0"/>'
        '<stop offset="1" stop-color="#05060d" stop-opacity=".6"/>'
        '</radialGradient>'
        '</defs>')
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}">{defs}{chain}'
            f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="#10121d"/>'
            f'{"".join(facets)}'
            f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="url(#sh)"/>'
            f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="none" stroke="#c6cfeb" stroke-opacity=".4" stroke-width="1.6"/>'
            f'{sparks}</svg>')

# ---------------- LUNA (Medianoche) ----------------

def luna_svg():
    rnd = random.Random(4)
    cx = cy = 100
    r = 66
    craters = ""
    placed = []
    tries = 0
    while len(placed) < 8 and tries < 200:
        tries += 1
        a = rnd.uniform(0, 2*math.pi)
        d = rnd.uniform(0, 0.74) * r
        x, y = cx + math.cos(a)*d, cy + math.sin(a)*d
        cr = rnd.uniform(4, 11) * (1 - d/(r*1.6))
        if all(math.hypot(x-px, y-py) > cr + pr + 3 for (px, py, pr) in placed):
            placed.append((x, y, cr))
    for (x, y, cr) in placed:
        craters += (f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(cr)}" fill="#b7c8e6" opacity=".55"/>'
                    f'<circle cx="{f(x - cr*0.18)}" cy="{f(y - cr*0.18)}" r="{f(cr*0.72)}" fill="#a9bcde" opacity=".5"/>')
    mares = ('<ellipse cx="82" cy="86" rx="26" ry="18" fill="#c3d2ec" opacity=".35"/>'
             '<ellipse cx="118" cy="118" rx="20" ry="14" fill="#c3d2ec" opacity=".3"/>')
    return ('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><defs>'
            '<radialGradient id="halo" cx="0.5" cy="0.5" r="0.5">'
            '<stop offset=".62" stop-color="#cfe0ff" stop-opacity=".38"/>'
            '<stop offset="1" stop-color="#bed7ff" stop-opacity="0"/></radialGradient>'
            '<radialGradient id="cara" cx="0.38" cy="0.34" r="0.9">'
            '<stop offset="0" stop-color="#ffffff"/><stop offset=".72" stop-color="#fdfeff"/>'
            '<stop offset="1" stop-color="#e2ebf9"/></radialGradient></defs>'
            '<circle cx="100" cy="100" r="98" fill="url(#halo)"/>'
            f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="url(#cara)"/>'
            f'{mares}{craters}'
            f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="none" stroke="#ffffff" stroke-opacity=".5" stroke-width="1.2"/>'
            '</svg>')

# ---------------- NUBES (Cielo) ----------------

def nubes_svg():
    rnd = random.Random(6)
    def cl(cx, cy, s):
        circles = []
        for t in (-1.3, -0.65, 0, 0.6, 1.25):
            cr = s * (1.0 - 0.45*abs(t)/1.3) * rnd.uniform(0.9, 1.12)
            x = cx + t*s
            y = cy - cr*0.72 + abs(t)*s*0.12
            circles.append((x, y, cr))
        g = '<g fill="#cfe0f6" opacity=".85">'
        for (x, y, cr) in circles:
            g += f'<circle cx="{f(x)}" cy="{f(y + s*0.22)}" r="{f(cr)}"/>'
        g += f'<ellipse cx="{f(cx)}" cy="{f(cy + s*0.24)}" rx="{f(1.75*s)}" ry="{f(0.52*s)}"/></g>'
        g += '<g fill="#ffffff">'
        for (x, y, cr) in circles:
            g += f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(cr)}"/>'
        g += f'<ellipse cx="{f(cx)}" cy="{f(cy)}" rx="{f(1.8*s)}" ry="{f(0.55*s)}"/></g>'
        return g
    body = cl(105, 212, 50) + cl(330, 402, 42) + cl(190, 608, 28) + cl(432, 702, 22)
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 900">{body}</svg>'

# ---------------- GLOBOS (Fiesta) ----------------

def lighten(c, t):
    return mix(c, (255, 255, 255), t)

def globos_svg():
    balloons = [
        (90, 216, 50, 62, (251, 113, 133), (190, 18, 60), -6),
        (390, 144, 46, 58, (56, 189, 248), (3, 105, 161), 5),
        (40, 558, 42, 54, (168, 85, 247), (107, 33, 168), -5),
        (450, 522, 44, 56, (251, 191, 36), (180, 83, 9), 6),
        (282, 756, 38, 48, (52, 211, 153), (4, 120, 87), -4),
    ]
    defs, body = "", ""
    for i, (cx, cy, rx, ry, c, dk, rot) in enumerate(balloons):
        defs += (f'<radialGradient id="g{i}" cx="0.35" cy="0.3" r="1.05">'
                 f'<stop offset="0" stop-color="{hexc(lighten(c, 0.55))}"/>'
                 f'<stop offset=".45" stop-color="{hexc(c)}"/>'
                 f'<stop offset="1" stop-color="{hexc(dk)}"/></radialGradient>')
        string = (f'M{f(cx)} {f(cy+ry+7)} '
                  f'c9 16 -12 30 -4 48 c6 14 -8 24 -3 42')
        body += (f'<path d="{string}" fill="none" stroke="#ffffff" stroke-opacity=".5" stroke-width="1.6"/>'
                 f'<g transform="rotate({rot} {cx} {cy})">'
                 f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="url(#g{i})"/>'
                 f'<ellipse cx="{f(cx - rx*0.34)}" cy="{f(cy - ry*0.38)}" rx="{f(rx*0.3)}" ry="{f(ry*0.2)}" '
                 f'fill="#ffffff" opacity=".6" transform="rotate(-28 {f(cx - rx*0.34)} {f(cy - ry*0.38)})"/>'
                 f'<path d="M{f(cx-6)} {f(cy+ry+7)} L{f(cx)} {f(cy+ry-2)} L{f(cx+6)} {f(cy+ry+7)} Z" fill="{hexc(dk)}"/>'
                 f'</g>')
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 900">'
            f'<defs>{defs}</defs>{body}</svg>')

# ---------------- CHICLES (Chicle) ----------------

def chicle_svg():
    bubbles = [
        (110, 234, 46, (255, 158, 203), (236, 96, 164)),
        (350, 396, 28, (255, 170, 210), (240, 110, 175)),
        (410, 684, 56, (217, 179, 255), (168, 122, 235)),
        (180, 594, 22, (255, 158, 203), (236, 96, 164)),
    ]
    defs, body = "", ""
    for i, (cx, cy, r, c, dk) in enumerate(bubbles):
        defs += (f'<radialGradient id="ch{i}" cx="0.34" cy="0.3" r="1">'
                 f'<stop offset="0" stop-color="#ffffff" stop-opacity=".95"/>'
                 f'<stop offset=".26" stop-color="{hexc(lighten(c, 0.35))}"/>'
                 f'<stop offset=".72" stop-color="{hexc(c)}" stop-opacity=".92"/>'
                 f'<stop offset="1" stop-color="{hexc(dk)}" stop-opacity=".85"/></radialGradient>')
        body += (f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="url(#ch{i})"/>'
                 f'<ellipse cx="{f(cx - r*0.38)}" cy="{f(cy - r*0.42)}" rx="{f(r*0.26)}" ry="{f(r*0.16)}" '
                 f'fill="#ffffff" opacity=".85" transform="rotate(-30 {f(cx - r*0.38)} {f(cy - r*0.42)})"/>'
                 f'<circle cx="{f(cx + r*0.3)}" cy="{f(cy + r*0.44)}" r="{f(r*0.08)}" fill="#ffffff" opacity=".5"/>')
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 900">'
            f'<defs>{defs}</defs>{body}</svg>')

import os
out = "/Users/leocarreto/Desktop/socialice/icons"
files = {
    "palmeras.svg": palms_svg, "discoball.svg": disco_svg, "luna.svg": luna_svg,
    "nubes.svg": nubes_svg, "globos.svg": globos_svg, "chicle.svg": chicle_svg,
}
for name, fn in files.items():
    with open(os.path.join(out, name), "w") as fh:
        fh.write(fn())
    print(name, os.path.getsize(os.path.join(out, name)), "bytes")
