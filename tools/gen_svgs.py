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

# ---------------- PLAYA ----------------

def playa_svg():
    # El mar termina en y=495 (55% de 900); la arena sigue hasta abajo.
    HOR = 495
    # gaviotas: dos arcos unidos (silueta "m" con alas caídas)
    def gaviota(x, y, s):
        return (f'<path d="M{f(x-s)} {f(y)} Q{f(x-s*0.5)} {f(y-s*0.8)} {f(x)} {f(y)} '
                f'Q{f(x+s*0.5)} {f(y-s*0.8)} {f(x+s)} {f(y)}" fill="none" '
                f'stroke="#ffffff" stroke-opacity=".85" stroke-width="2.5" stroke-linecap="round"/>')
    gulls = gaviota(120, 130, 14) + gaviota(165, 155, 10) + gaviota(330, 105, 12)
    # espuma: banda blanca ondulada donde el mar toca la arena
    foam = (f'<path d="M0 {HOR-14} Q42 {HOR-26} 84 {HOR-14} T168 {HOR-14} T252 {HOR-14} '
            f'T336 {HOR-14} T420 {HOR-14} T504 {HOR-14} L500 {HOR+10} '
            f'Q450 {HOR+22} 400 {HOR+10} T300 {HOR+10} T200 {HOR+10} T100 {HOR+10} T0 {HOR+10} Z" '
            f'fill="#ffffff" opacity=".8"/>'
            f'<path d="M0 {HOR-34} Q60 {HOR-44} 120 {HOR-34} T240 {HOR-34} T360 {HOR-34} T480 {HOR-34} L500 {HOR-34} L500 {HOR-28} '
            f'Q440 {HOR-20} 380 {HOR-28} T260 {HOR-28} T140 {HOR-28} T20 {HOR-28} L0 {HOR-28} Z" '
            f'fill="#ffffff" opacity=".4"/>')
    # sombrilla inclinada sobre la arena (gajos alternados + poste + sombra)
    ux, uy, ur, tilt = 118, 560, 96, -14
    wedges = ""
    cols = ["#f43f5e", "#fff7ed", "#fb923c", "#fff7ed", "#f43f5e", "#fff7ed"]
    for i in range(6):
        a0 = math.pi + i*math.pi/6
        a1 = a0 + math.pi/6
        x0, y0 = ux + ur*math.cos(a0), uy + ur*math.sin(a0)
        x1, y1 = ux + ur*math.cos(a1), uy + ur*math.sin(a1)
        wedges += (f'<path d="M{f(ux)} {f(uy)} L{f(x0)} {f(y0)} '
                   f'A{ur} {ur} 0 0 1 {f(x1)} {f(y1)} Z" fill="{cols[i]}"/>')
    umbrella = (f'<ellipse cx="{ux+46}" cy="{uy+118}" rx="95" ry="16" fill="#a16207" opacity=".28"/>'
                f'<g transform="rotate({tilt} {ux} {uy})">'
                f'<rect x="{ux-3}" y="{uy-6}" width="6" height="130" rx="3" fill="#8a5a2b"/>'
                f'{wedges}'
                f'<path d="M{f(ux-ur)} {f(uy)} A{ur} {ur} 0 0 1 {f(ux+ur)} {f(uy)}" fill="none" stroke="#ffffff" stroke-opacity=".35" stroke-width="2"/>'
                f'<circle cx="{ux}" cy="{uy-ur}" r="6" fill="#8a5a2b"/></g>')
    # pelota de playa: círculo con gajos curvos alternados + brillo + sombra
    bx, by, br = 372, 700, 52
    def lens(o1, o2, col):
        return (f'<path d="M{bx} {by-br} Q{f(bx+o1)} {by} {bx} {by+br} '
                f'Q{f(bx+o2)} {by} {bx} {by-br} Z" fill="{col}"/>')
    ball = (f'<ellipse cx="{bx+8}" cy="{by+br+12}" rx="58" ry="13" fill="#a16207" opacity=".3"/>'
            f'<circle cx="{bx}" cy="{by}" r="{br}" fill="#fff7ed"/>'
            + lens(br*1.6, br*0.55, "#f43f5e") + lens(br*0.55, -br*0.55, "#0ea5e9")
            + lens(-br*0.55, -br*1.6, "#fbbf24")
            + f'<circle cx="{bx}" cy="{by}" r="{br}" fill="none" stroke="#0f172a" stroke-opacity=".14" stroke-width="2"/>'
            + f'<ellipse cx="{f(bx-br*0.35)}" cy="{f(by-br*0.45)}" rx="{f(br*0.3)}" ry="{f(br*0.18)}" fill="#ffffff" opacity=".7" transform="rotate(-28 {f(bx-br*0.35)} {f(by-br*0.45)})"/>')
    # estrella de mar regordeta con puntitos
    sx, sy, sr = 246, 806, 30
    pts = []
    for i in range(10):
        a = -math.pi/2 + i*math.pi/5
        rr = sr if i % 2 == 0 else sr*0.46
        pts.append(f"{f(sx + rr*math.cos(a))} {f(sy + rr*math.sin(a))}")
    star = (f'<ellipse cx="{sx+4}" cy="{sy+sr*0.75}" rx="{sr+8}" ry="9" fill="#a16207" opacity=".25"/>'
            f'<path d="M{" L".join(pts)} Z" fill="#fb923c" stroke="#fb923c" '
            f'stroke-width="12" stroke-linejoin="round"/>'
            f'<circle cx="{sx-8}" cy="{sy-6}" r="2.4" fill="#c2570b"/>'
            f'<circle cx="{sx+9}" cy="{sy-2}" r="2.4" fill="#c2570b"/>'
            f'<circle cx="{sx}" cy="{sy+10}" r="2.4" fill="#c2570b"/>')
    # toalla tendida junto a la sombrilla
    towel = ('<g transform="rotate(-7 210 714)">'
             '<rect x="150" y="682" width="120" height="64" rx="8" fill="#38bdf8"/>'
             '<rect x="150" y="694" width="120" height="10" fill="#ffffff" opacity=".85"/>'
             '<rect x="150" y="716" width="120" height="10" fill="#ffffff" opacity=".85"/></g>')
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 900">'
            f'{gulls}{foam}{towel}{umbrella}{ball}{star}</svg>')

# ---------------- SANDÍA ----------------

def sandia_svg():
    rnd = random.Random(14)
    seeds = ""
    spots = [(70, 150), (300, 95), (430, 210), (150, 330), (390, 420), (60, 500),
             (250, 560), (440, 640), (140, 680), (330, 250)]
    for (x, y) in spots:
        rot = rnd.uniform(-40, 40)
        seeds += (f'<g transform="rotate({f(rot)} {x} {y})">'
                  f'<path d="M{x} {y-13} C{x+9} {y-6} {x+9} {y+7} {x} {y+13} '
                  f'C{x-9} {y+7} {x-9} {y-6} {x} {y-13} Z" fill="#1c1917"/>'
                  f'<ellipse cx="{x-3}" cy="{y-5}" rx="2.6" ry="3.6" fill="#ffffff" opacity=".55"/></g>')
    # cáscara curva abajo: banda blanca + verde claro + verde con vetas
    rind = ('<path d="M0 782 Q250 742 500 782 L500 900 L0 900 Z" fill="#fdfcf5"/>'
            '<path d="M0 806 Q250 766 500 806 L500 900 L0 900 Z" fill="#bbf7d0"/>'
            '<path d="M0 824 Q250 784 500 824 L500 900 L0 900 Z" fill="#16a34a"/>')
    stripes = ""
    for i in range(7):
        x = 20 + i*72
        t = x / 500
        y_arc = (1-t)**2*824 + 2*t*(1-t)*784 + t*t*824   # borde superior del verde
        stripes += (f'<path d="M{x} 900 Q{x+6} {f(y_arc+40)} {x+2} {f(y_arc+16)}" '
                    f'stroke="#0c7a35" stroke-width="15" fill="none" stroke-linecap="round"/>')
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 900">'
            f'{seeds}{rind}{stripes}</svg>')

# ---------------- BOSQUE ----------------

def pino(cx, base, h, w, col, rnd, trunk_col="#3b2a1a"):
    tiers = 4
    d = ""
    top = base - h
    for k in range(tiers):
        ty = top + k*h*0.2
        by = top + (k+1)*h*0.26 + h*0.06
        tw = w * (0.34 + 0.66*(k+1)/tiers)
        # borde inferior dentado (3 muescas por lado)
        left, right = cx - tw/2, cx + tw/2
        pts = [f"{f(cx)} {f(ty)}"]
        n = 4
        for i in range(n+1):
            x = left + (right-left)*i/n
            y = by + (rnd.uniform(-3, 3) if 0 < i < n else 0) - (6 if i % 2 else 0)
            pts.append(f"{f(x)} {f(y)}")
        d += f'<path d="M{" L".join(pts)} Z" fill="{col}"/>'
    d += f'<rect x="{f(cx-w*0.06)}" y="{f(base-6)}" width="{f(w*0.12)}" height="{f(h*0.12+6)}" fill="{trunk_col}"/>'
    return d

def bosque_svg():
    rnd = random.Random(31)
    layers = ""
    # fila lejana (clara, con neblina detrás)
    far = ""
    for x in range(20, 500, 58):
        far += pino(x + rnd.uniform(-10, 10), 560, rnd.uniform(95, 135), rnd.uniform(52, 66), "#2e6b4b", rnd, "#2e6b4b")
    layers += f'<g opacity=".85">{far}</g>'
    layers += '<rect x="0" y="470" width="500" height="130" fill="#9fd8bd" opacity=".16"/>'
    # fila media
    mid = ""
    for x in range(-10, 520, 84):
        mid += pino(x + rnd.uniform(-12, 12), 700, rnd.uniform(160, 215), rnd.uniform(76, 96), "#1b4a31", rnd, "#241708")
    layers += mid
    layers += '<rect x="0" y="600" width="500" height="120" fill="#9fd8bd" opacity=".1"/>'
    # fila cercana (oscura, grandes)
    near = ""
    for x in range(-20, 540, 120):
        near += pino(x + rnd.uniform(-14, 14), 905, rnd.uniform(250, 330), rnd.uniform(120, 150), "#071c11", rnd, "#120b04")
    layers += near
    # dos gigantes que enmarcan desde las esquinas
    layers += pino(28, 940, 430, 190, "#04120a", rnd, "#0b0602")
    layers += pino(478, 950, 460, 200, "#04120a", rnd, "#0b0602")
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 900">{layers}</svg>'

import os
out = "/Users/leocarreto/Desktop/socialice/icons"
files = {
    "palmeras.svg": palms_svg, "discoball.svg": disco_svg, "luna.svg": luna_svg,
    "nubes.svg": nubes_svg, "globos.svg": globos_svg, "chicle.svg": chicle_svg,
    "playa.svg": playa_svg, "sandia.svg": sandia_svg, "bosque.svg": bosque_svg,
}
for name, fn in files.items():
    with open(os.path.join(out, name), "w") as fh:
        fh.write(fn())
    print(name, os.path.getsize(os.path.join(out, name)), "bytes")
