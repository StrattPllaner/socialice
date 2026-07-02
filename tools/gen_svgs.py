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

def palms_svg(W=500):
    # W: ancho de la escena. 500 = teléfono (vertical); 1600 = laptop/iPad
    # (las palmeras se pegan a los BORDES reales, nada se estira).
    parts = []
    # --- lejanas (más claras, cerca del sol al centro) ---
    far = palm(W/2 - 154, 640, W/2 - 130, 520, 8, 5, 62, seed=11, bend=14, nfr=7, droop=0.55)
    far += palm(W/2 + 142, 655, W/2 + 122, 525, 8, 5, 60, seed=12, bend=-12, nfr=7, droop=0.55)
    parts.append(f'<path fill="#0e4a33" opacity=".9" d="{far}"/>')
    # --- capa media: fronda colgando de arriba + arbusto bajo ---
    rnd = random.Random(21)
    mid = ""
    for a, L in [(52, 175), (72, 150), (34, 155)]:
        mid += frond(30, -30, a, L, droop=0.32, rnd=rnd)
    for a, L in [(128, 180), (108, 155), (146, 160)]:
        mid += frond(W - 25, -35, a, L, droop=0.32, rnd=rnd)
    for a, L in [(-118, 150), (-95, 170), (-68, 145), (-142, 125)]:
        mid += frond(W/2, 940, a, L, droop=0.22, rnd=rnd)
    if W > 900:  # en pantallas anchas, arbustos extra para no dejar huecos abajo
        for a, L in [(-105, 140), (-70, 120), (-130, 115)]:
            mid += frond(W*0.22, 945, a, L, droop=0.22, rnd=rnd)
        for a, L in [(-75, 140), (-110, 120), (-50, 115)]:
            mid += frond(W*0.78, 945, a, L, droop=0.22, rnd=rnd)
    parts.append(f'<path fill="#0a3a27" d="{mid}"/>')
    # --- principales: una a cada lado, enmarcando ---
    left = palm(52, 950, 134, 442, 34, 15, 162, seed=5, bend=52, nfr=10, droop=0.5)
    right = palm(W - 48, 960, W - 144, 375, 38, 16, 172, seed=8, bend=-58, nfr=10, droop=0.5)
    parts.append(f'<path fill="#052018" d="{left}{right}"/>')
    body = "".join(parts)
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} 900">{body}</svg>')

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

def nubes_svg(W=500):
    k = W / 500
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
    body = cl(105*k, 212, 50) + cl(330*k, 402, 42) + cl(190*k, 608, 28) + cl(432*k, 702, 22)
    if W > 900:  # nubes extra para llenar el cielo ancho
        body += cl(250*k, 120, 34) + cl(60*k, 480, 26) + cl(470*k, 300, 30)
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} 900">{body}</svg>'

# ---------------- GLOBOS (Fiesta) ----------------

def lighten(c, t):
    return mix(c, (255, 255, 255), t)

def globos_svg(W=500):
    k = W / 500
    balloons = [
        (90*k, 216, 50, 62, (251, 113, 133), (190, 18, 60), -6),
        (390*k, 144, 46, 58, (56, 189, 248), (3, 105, 161), 5),
        (40*k, 558, 42, 54, (168, 85, 247), (107, 33, 168), -5),
        (450*k, 522, 44, 56, (251, 191, 36), (180, 83, 9), 6),
        (282*k, 756, 38, 48, (52, 211, 153), (4, 120, 87), -4),
    ]
    if W > 900:  # globos extra para no dejar hueco el centro
        balloons += [
            (235*k, 396, 40, 50, (34, 211, 238), (8, 102, 138), 4),
            (165*k, 640, 36, 46, (251, 146, 60), (154, 52, 18), -5),
        ]
    defs, body = "", ""
    for i, (cx, cy, rx, ry, c, dk, rot) in enumerate(balloons):
        cx = round(cx, 1)
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
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} 900">'
            f'<defs>{defs}</defs>{body}</svg>')

# ---------------- CHICLES (Chicle) ----------------

def chicle_svg(W=500):
    k = W / 500
    bubbles = [
        (110*k, 234, 46, (255, 158, 203), (236, 96, 164)),
        (350*k, 396, 28, (255, 170, 210), (240, 110, 175)),
        (410*k, 684, 56, (217, 179, 255), (168, 122, 235)),
        (180*k, 594, 22, (255, 158, 203), (236, 96, 164)),
    ]
    if W > 900:
        bubbles += [
            (255*k, 150, 34, (255, 158, 203), (236, 96, 164)),
            (60*k, 470, 26, (217, 179, 255), (168, 122, 235)),
            (300*k, 780, 30, (255, 170, 210), (240, 110, 175)),
        ]
    defs, body = "", ""
    for i, (cx, cy, r, c, dk) in enumerate(bubbles):
        cx = round(cx, 1)
        defs += (f'<radialGradient id="ch{i}" cx="0.34" cy="0.3" r="1">'
                 f'<stop offset="0" stop-color="#ffffff" stop-opacity=".95"/>'
                 f'<stop offset=".26" stop-color="{hexc(lighten(c, 0.35))}"/>'
                 f'<stop offset=".72" stop-color="{hexc(c)}" stop-opacity=".92"/>'
                 f'<stop offset="1" stop-color="{hexc(dk)}" stop-opacity=".85"/></radialGradient>')
        body += (f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="url(#ch{i})"/>'
                 f'<ellipse cx="{f(cx - r*0.38)}" cy="{f(cy - r*0.42)}" rx="{f(r*0.26)}" ry="{f(r*0.16)}" '
                 f'fill="#ffffff" opacity=".85" transform="rotate(-30 {f(cx - r*0.38)} {f(cy - r*0.42)})"/>'
                 f'<circle cx="{f(cx + r*0.3)}" cy="{f(cy + r*0.44)}" r="{f(r*0.08)}" fill="#ffffff" opacity=".5"/>')
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} 900">'
            f'<defs>{defs}</defs>{body}</svg>')

# ---------------- PLAYA (escena completa: cielo, mar de verdad, arena) ----

def playa_full_svg():
    rnd = random.Random(27)
    defs = (
        '<linearGradient id="cielo" x1="0" y1="0" x2="0" y2="1">'
        '<stop offset="0" stop-color="#c3e9ff"/><stop offset="1" stop-color="#8fd6f8"/></linearGradient>'
        '<linearGradient id="mar" x1="0" y1="0" x2="0" y2="1">'
        '<stop offset="0" stop-color="#0a5c95"/><stop offset=".22" stop-color="#0e7cb4"/>'
        '<stop offset=".55" stop-color="#1ea6cf"/><stop offset=".85" stop-color="#55cfdd"/>'
        '<stop offset="1" stop-color="#8ce8e4"/></linearGradient>'
        '<linearGradient id="arena" x1="0" y1="0" x2="0" y2="1">'
        '<stop offset="0" stop-color="#e9d3a0"/><stop offset="1" stop-color="#d3ad72"/></linearGradient>')
    sky = '<rect width="500" height="420" fill="url(#cielo)"/>'
    sun = ('<circle cx="390" cy="90" r="62" fill="#fff5c4" opacity=".4"/>'
           '<circle cx="390" cy="90" r="33" fill="#fffadd"/>')
    def nube(cx, cy, s, op):
        g = f'<g fill="#ffffff" opacity="{op}">'
        for (dx, dy, r) in [(-1.2, 0, .55), (-0.5, -0.4, .8), (0.3, -0.35, .72), (1.1, 0, .5)]:
            g += f'<circle cx="{f(cx+dx*s)}" cy="{f(cy+dy*s)}" r="{f(r*s)}"/>'
        g += f'<ellipse cx="{cx}" cy="{f(cy+0.12*s)}" rx="{f(1.7*s)}" ry="{f(0.5*s)}"/></g>'
        return g
    clouds = nube(105, 95, 34, .92) + nube(300, 160, 24, .8) + nube(455, 60, 20, .7)
    # mar: bloque con degradado (oscuro en el horizonte, turquesa en la orilla)
    sea = '<rect y="418" width="500" height="190" fill="url(#mar)"/>'
    # destellos del sol sobre el agua (rayitas blancas cerca del horizonte)
    glints = ""
    for _ in range(46):
        y = 424 + rnd.random()**1.6 * 120
        x = rnd.uniform(4, 496)
        w = rnd.uniform(5, 22) * (0.5 + (y-420)/190)
        op = rnd.uniform(0.18, 0.5)
        glints += f'<rect x="{f(x)}" y="{f(y)}" width="{f(w)}" height="1.6" rx="0.8" fill="#ffffff" opacity="{f(op)}"/>'
    # crestas de olas que avanzan (líneas onduladas suaves)
    def ola(y, amp, op, wdt):
        d = f"M-10 {y} "
        for x in range(0, 520, 52):
            d += f"q13 {-amp} 26 0 t26 0 "
        return f'<path d="{d}" fill="none" stroke="#eafcff" stroke-opacity="{op}" stroke-width="{wdt}"/>'
    waves = ola(500, 5, .35, 2) + ola(535, 6, .5, 2.5) + ola(568, 7, .6, 3)
    # velero en el horizonte
    boat = ('<g transform="translate(88 402)">'
            '<path d="M-20 14 L20 14 L12 22 L-14 22 Z" fill="#27435e"/>'
            '<path d="M-2 12 L-2 -26 L-22 12 Z" fill="#ffffff"/>'
            '<path d="M3 12 L3 -20 L16 12 Z" fill="#f1f5f9"/>'
            '<rect x="-2.5" y="-26" width="2" height="38" fill="#64748b"/></g>')
    gulls = ''
    for (x, y, s) in [(150, 150, 13), (196, 175, 9), (60, 210, 10)]:
        gulls += (f'<path d="M{f(x-s)} {f(y)} Q{f(x-s*0.5)} {f(y-s*0.8)} {f(x)} {f(y)} '
                  f'Q{f(x+s*0.5)} {f(y-s*0.8)} {f(x+s)} {f(y)}" fill="none" '
                  f'stroke="#ffffff" stroke-opacity=".9" stroke-width="2.4" stroke-linecap="round"/>')
    # arena + franja de arena mojada + espuma de la orilla (borde festoneado)
    sand = '<rect y="600" width="500" height="300" fill="url(#arena)"/>'
    wet = '<path d="M0 596 Q125 580 250 594 T500 590 L500 648 Q300 664 140 652 T0 648 Z" fill="#c8ab77"/>'
    foam = ('<path d="M0 588 Q125 572 250 586 T500 582 L500 606 Q420 618 340 608 Q300 622 240 610 '
            'Q180 626 120 612 Q60 620 0 610 Z" fill="#ffffff" opacity=".92"/>'
            '<path d="M0 620 Q140 634 260 624 T500 620 L500 628 Q320 642 180 632 T0 630 Z" fill="#ffffff" opacity=".4"/>')
    # granitos de arena
    grains = ""
    for _ in range(60):
        x, y = rnd.uniform(4, 496), rnd.uniform(660, 892)
        grains += f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(rnd.uniform(0.8, 1.7))}" fill="#a9803f" opacity=".3"/>'
    # sombrilla: gajos + varillas + borde, inclinada, con sombra en la arena
    ux, uy, ur, tilt = 118, 660, 96, -14
    cols = ["#f43f5e", "#fff7ed", "#fb923c", "#fff7ed", "#f43f5e", "#fff7ed"]
    wedges, ribs = "", ""
    for i in range(6):
        a0 = math.pi + i*math.pi/6
        a1 = a0 + math.pi/6
        x0, y0 = ux + ur*math.cos(a0), uy + ur*math.sin(a0)
        x1, y1 = ux + ur*math.cos(a1), uy + ur*math.sin(a1)
        wedges += (f'<path d="M{f(ux)} {f(uy)} L{f(x0)} {f(y0)} '
                   f'A{ur} {ur} 0 0 1 {f(x1)} {f(y1)} Z" fill="{cols[i]}"/>')
        ribs += f'<path d="M{f(ux)} {f(uy)} L{f(x0)} {f(y0)}" stroke="#00000022" stroke-width="1.4"/>'
    umbrella = (f'<ellipse cx="{ux+50}" cy="{uy+126}" rx="98" ry="15" fill="#8a6a33" opacity=".3"/>'
                f'<g transform="rotate({tilt} {ux} {uy})">'
                f'<rect x="{ux-3}" y="{uy-4}" width="6" height="134" rx="3" fill="#7c5326"/>'
                f'{wedges}{ribs}'
                f'<path d="M{f(ux-ur)} {f(uy)} A{ur} {ur} 0 0 1 {f(ux+ur)} {f(uy)}" fill="none" stroke="#ffffff" stroke-opacity=".4" stroke-width="2.5"/>'
                f'<circle cx="{ux}" cy="{uy-ur}" r="6" fill="#7c5326"/></g>')
    # pelota, toalla, estrella y conchitas sobre la arena
    bx, by, br = 372, 762, 50
    def lens(o1, o2, col):
        return (f'<path d="M{bx} {by-br} Q{f(bx+o1)} {by} {bx} {by+br} '
                f'Q{f(bx+o2)} {by} {bx} {by-br} Z" fill="{col}"/>')
    ball = (f'<ellipse cx="{bx+8}" cy="{by+br+10}" rx="56" ry="12" fill="#8a6a33" opacity=".32"/>'
            f'<circle cx="{bx}" cy="{by}" r="{br}" fill="#fff7ed"/>'
            + lens(br*1.6, br*0.55, "#f43f5e") + lens(br*0.55, -br*0.55, "#0ea5e9")
            + lens(-br*0.55, -br*1.6, "#fbbf24")
            + f'<circle cx="{bx}" cy="{by}" r="{br}" fill="none" stroke="#0f172a" stroke-opacity=".15" stroke-width="2"/>'
            + f'<ellipse cx="{f(bx-br*0.35)}" cy="{f(by-br*0.45)}" rx="{f(br*0.3)}" ry="{f(br*0.18)}" fill="#ffffff" opacity=".75" transform="rotate(-28 {f(bx-br*0.35)} {f(by-br*0.45)})"/>')
    towel = ('<g transform="rotate(-7 220 786)">'
             '<rect x="160" y="756" width="120" height="62" rx="8" fill="#38bdf8"/>'
             '<rect x="160" y="768" width="120" height="10" fill="#ffffff" opacity=".85"/>'
             '<rect x="160" y="789" width="120" height="10" fill="#ffffff" opacity=".85"/></g>')
    sx, sy, sr = 258, 862, 26
    pts = []
    for i in range(10):
        a = -math.pi/2 + i*math.pi/5
        rr = sr if i % 2 == 0 else sr*0.46
        pts.append(f"{f(sx + rr*math.cos(a))} {f(sy + rr*math.sin(a))}")
    star = (f'<path d="M{" L".join(pts)} Z" fill="#fb923c" stroke="#fb923c" '
            f'stroke-width="11" stroke-linejoin="round"/>'
            f'<circle cx="{sx-7}" cy="{sy-5}" r="2.2" fill="#c2570b"/>'
            f'<circle cx="{sx+8}" cy="{sy-1}" r="2.2" fill="#c2570b"/>'
            f'<circle cx="{sx}" cy="{sy+9}" r="2.2" fill="#c2570b"/>')
    shells = ('<path d="M64 848 a11 11 0 0 1 22 0 Z" fill="#fde8d0" stroke="#d9b28c" stroke-width="1.5"/>'
              '<path d="M75 848 L69 838 M75 848 L75 836 M75 848 L81 838" stroke="#d9b28c" stroke-width="1.2"/>'
              '<circle cx="452" cy="874" r="7" fill="#f3d9bd" stroke="#d9b28c" stroke-width="1.4"/>')
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 900"><defs>{defs}</defs>'
            f'{sky}{sun}{clouds}{gulls}{sea}{glints}{boat}{waves}{sand}{wet}{foam}{grains}'
            f'{towel}{umbrella}{ball}{star}{shells}</svg>')

# ---------------- BOSQUE (como foto: troncos altos + copa verde con luz) ----

def arbol(cx, base_y, top_y, w, rnd, tone=0):
    # Tronco alto, delgado, con curvita natural y lado iluminado.
    lean = rnd.uniform(-14, 14)
    ctrl = (cx + lean, (base_y + top_y) / 2)
    top = (cx + lean*1.6, top_y)
    body = trunk((cx, base_y), ctrl, top, w, w*0.5)
    darks = ["#33291f", "#3c3126", "#2c231a"]
    lights = ["#5d5140", "#6a5c49", "#554938"]
    g = f'<path d="{body}" fill="{darks[tone % 3]}"/>'
    # canto iluminado (una franja angosta pegada a un lado del tronco)
    edge = trunk((cx - w*0.28, base_y), (ctrl[0] - w*0.28, ctrl[1]), (top[0] - w*0.28, top[1]), w*0.3, w*0.16)
    g += f'<path d="{edge}" fill="{lights[tone % 3]}" opacity=".8"/>'
    # 2-3 ramas delgadas que suben hacia la copa
    for _ in range(rnd.randint(2, 3)):
        t = rnd.uniform(0.45, 0.8)
        bx_, by_ = bez((cx, base_y), ctrl, top, t)
        side = rnd.choice((-1, 1))
        ex = bx_ + side * rnd.uniform(18, 42)
        ey = by_ - rnd.uniform(46, 90)
        g += (f'<path d="M{f(bx_)} {f(by_)} Q{f(bx_ + side*8)} {f(by_ - 30)} {f(ex)} {f(ey)}" '
              f'stroke="{darks[tone % 3]}" stroke-width="{f(w*0.16)}" fill="none" stroke-linecap="round"/>')
    return g

def follaje(rnd, y0, y1, n, cols, rmin, rmax, op=1):
    g = f'<g opacity="{op}">'
    for _ in range(n):
        x = rnd.uniform(-20, 520)
        y = y0 + (rnd.random()**1.4) * (y1 - y0)   # más denso arriba
        r = rnd.uniform(rmin, rmax)
        g += f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(r)}" fill="{rnd.choice(cols)}"/>'
    return g + '</g>'

def bosque_svg():
    rnd = random.Random(52)
    defs = ('<filter id="blur2"><feGaussianBlur stdDeviation="2.2"/></filter>'
            '<linearGradient id="bosqueBg" x1="0" y1="0" x2="0" y2="1">'
            '<stop offset="0" stop-color="#c8dd8a"/><stop offset=".35" stop-color="#8fae5c"/>'
            '<stop offset=".68" stop-color="#4c6b35"/><stop offset="1" stop-color="#233c15"/></linearGradient>')
    bg = '<rect width="500" height="900" fill="url(#bosqueBg)"/>'
    # claritos de cielo que se cuelan entre las hojas
    sky = ""
    for _ in range(16):
        x, y = rnd.uniform(0, 500), rnd.uniform(0, 210)
        sky += f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(rnd.uniform(7, 18))}" fill="#f3f9dd" opacity="{f(rnd.uniform(.5, .9))}"/>'
    # capa LEJANA borrosa: troncos finos + follaje claro
    far = ""
    for x in range(10, 500, 34):
        far += arbol(x + rnd.uniform(-8, 8), rnd.uniform(560, 640), rnd.uniform(30, 90), rnd.uniform(4, 7), rnd, rnd.randint(0, 2))
    far = f'<g filter="url(#blur2)" opacity=".75">{far}</g>'
    fol_far = follaje(rnd, -30, 250, 90, ["#c3da84", "#a9c86b", "#8fb757"], 14, 30, .9)
    # capa MEDIA
    mid = ""
    for x in range(-6, 520, 62):
        mid += arbol(x + rnd.uniform(-12, 12), rnd.uniform(700, 790), rnd.uniform(10, 70), rnd.uniform(8, 13), rnd, rnd.randint(0, 2))
    fol_mid = follaje(rnd, -30, 300, 70, ["#93b859", "#77a144", "#5d8836"], 16, 36, .95)
    # capa CERCANA: pocos troncos gruesos que enmarcan
    near = ""
    for x in (36, 150, 322, 464):
        near += arbol(x + rnd.uniform(-8, 8), 910, rnd.uniform(-30, 20), rnd.uniform(17, 24), rnd, rnd.randint(0, 2))
    fol_near = follaje(rnd, -40, 190, 34, ["#4f7a2c", "#3c6322", "#2f541a"], 22, 46, .9)
    # sotobosque: matas y hojitas iluminadas (como la alfombra verde de la foto)
    piso = '<path d="M0 806 Q80 792 160 802 T330 800 T500 804 L500 900 L0 900 Z" fill="#2c4a1b"/>'
    matas = follaje(rnd, 796, 880, 46, ["#3f6524", "#4f7a2c", "#365a1f"], 10, 22)
    brotes = ""
    for _ in range(70):
        x, y = rnd.uniform(0, 500), rnd.uniform(800, 895)
        brotes += f'<circle cx="{f(x)}" cy="{f(y)}" r="{f(rnd.uniform(1.4, 3))}" fill="#9cc861" opacity="{f(rnd.uniform(.35, .8))}"/>'
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 900"><defs>{defs}</defs>'
            f'{bg}{sky}{fol_far}{far}{fol_mid}{mid}{piso}{near}{fol_near}{matas}{brotes}</svg>')

import os
out = "/Users/leocarreto/Desktop/socialice/icons"
files = {
    "palmeras.svg": palms_svg, "discoball.svg": disco_svg, "luna.svg": luna_svg,
    "nubes.svg": nubes_svg, "globos.svg": globos_svg, "chicle.svg": chicle_svg,
    # variantes ANCHAS (laptop/iPad horizontal): mismas escenas re-compuestas
    "palmeras-w.svg": lambda: palms_svg(1600),
    "nubes-w.svg": lambda: nubes_svg(1600),
    "globos-w.svg": lambda: globos_svg(1600),
    "chicle-w.svg": lambda: chicle_svg(1600),
    # playa y bosque ahora son FOTOS reales (icons/playa.jpg, icons/bosque.jpg)
}
for name, fn in files.items():
    with open(os.path.join(out, name), "w") as fh:
        fh.write(fn())
    print(name, os.path.getsize(os.path.join(out, name)), "bytes")
