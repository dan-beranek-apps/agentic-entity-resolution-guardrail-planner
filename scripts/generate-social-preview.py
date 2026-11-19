#!/usr/bin/env python3
"""Generate deterministic 1200x630 Open Graph images for the product frontend."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import shutil

ROOT = Path(__file__).resolve().parents[1]
BRANDING = ROOT / "assets" / "branding"
SCALE = 2
WIDTH, HEIGHT = 1200 * SCALE, 630 * SCALE
INK = "#080b12"
INK_2 = "#121722"
WHITE = "#f7f8fb"
MUTED = "#aab2c2"
BLUE = "#154cff"
BLUE_LIGHT = "#8eabff"

FONT_SANS = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
FONT_SANS_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FONT_SERIF = "/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf"


def p(value):
    return round(value * SCALE)


def ft(path, size):
    return ImageFont.truetype(path, p(size))


def build():
    image = Image.new("RGB", (WIDTH, HEIGHT), INK)
    draw = ImageDraw.Draw(image)

    # Restrained technical grid and background arcs.
    for x in range(30, 1200, 48):
        draw.line((p(x), 0, p(x), HEIGHT), fill="#0d121c", width=1)
    for y in range(24, 630, 48):
        draw.line((0, p(y), WIDTH, p(y)), fill="#0d121c", width=1)
    for radius in (230, 290, 350):
        bounds = (p(935-radius), p(315-radius), p(935+radius), p(315+radius))
        draw.arc(bounds, start=205, end=335, fill="#17233e", width=p(1))

    # Compact mark adapted from the repository's existing logo.
    mx, my = 104, 94
    draw.rounded_rectangle((p(mx-30), p(my-30), p(mx+30), p(my+30)),
                           radius=p(9), fill=INK_2, outline="#29344b", width=p(1))
    brackets = [
        ((mx-17, my-20), (mx-20, my-20), (mx-20, my-17)),
        ((mx+17, my-20), (mx+20, my-20), (mx+20, my-17)),
        ((mx+17, my+20), (mx+20, my+20), (mx+20, my+17)),
        ((mx-17, my+20), (mx-20, my+20), (mx-20, my+17)),
    ]
    for points in brackets:
        draw.line([(p(x), p(y)) for x, y in points], fill=BLUE, width=p(2))
    nodes = [(mx, my-14), (mx+14, my-4), (mx+9, my+12), (mx-9, my+12), (mx-14, my-4)]
    for x, y in nodes:
        draw.line((p(mx), p(my), p(x), p(y)), fill=BLUE_LIGHT, width=p(1.5))
    for x, y in nodes:
        draw.ellipse((p(x-2.6), p(y-2.6), p(x+2.6), p(y+2.6)), fill=WHITE)
    draw.ellipse((p(mx-4), p(my-4), p(mx+4), p(my+4)),
                 fill=BLUE, outline=WHITE, width=p(1))

    # Wordmark.
    draw.text((p(151), p(74)), "AGENTIC ENTITY RESOLUTION",
              font=ft(FONT_SANS_BOLD, 15), fill=WHITE)
    draw.text((p(151), p(98)), "GUARDRAIL PLANNER",
              font=ft(FONT_SANS, 13), fill=BLUE_LIGHT)

    # Left column: deterministic typography.
    draw.rounded_rectangle((p(82), p(171), p(116), p(174)), radius=p(1), fill=BLUE)
    draw.text((p(129), p(160)), "A DESIGN-TIME AGENT SKILL",
              font=ft(FONT_SANS_BOLD, 12), fill=BLUE_LIGHT)
    draw.text((p(80), p(209)), "Investigate before",
              font=ft(FONT_SERIF, 53), fill=WHITE)
    draw.text((p(80), p(278)), "you recommend.",
              font=ft(FONT_SERIF, 53), fill=BLUE_LIGHT)
    draw.text((p(83), p(373)), "Reviewable plans for persistent identity changes.",
              font=ft(FONT_SANS, 19), fill="#d1d7e2")
    draw.text((p(83), p(404)), "Define the scope. Examine the evidence. Respect authority.",
              font=ft(FONT_SANS, 15), fill=MUTED)

    # Operation chips.
    for label, x, chip_width in [("MERGE", 83, 150), ("SPLIT", 247, 130), ("UNMERGE", 390, 158)]:
        draw.rounded_rectangle((p(x), p(482), p(x+chip_width), p(524)),
                               radius=p(4), fill="#111824", outline="#38445c", width=p(1))
        chip_font = ft(FONT_SANS_BOLD, 13)
        bounds = draw.textbbox((0, 0), label, font=chip_font)
        text_width = (bounds[2] - bounds[0]) / SCALE
        draw.text((p(x + (chip_width-text_width)/2), p(494)),
                  label, font=chip_font, fill=WHITE)

    # Right column: four explicit investigation stages.
    x0, y0, x1, y1 = 748, 90, 1123, 540

    def corner(x, y, dx, dy):
        draw.line((p(x), p(y), p(x+dx*27), p(y)), fill=BLUE, width=p(3))
        draw.line((p(x), p(y), p(x), p(y+dy*27)), fill=BLUE, width=p(3))

    corner(x0, y0, 1, 1)
    corner(x1, y0, -1, 1)
    corner(x0, y1, 1, -1)
    corner(x1, y1, -1, -1)
    draw.text((p(783), p(112)), "THE INVESTIGATION PATH",
              font=ft(FONT_SANS_BOLD, 11), fill=BLUE_LIGHT)

    stages = [
        ("01", "SCOPE", "What exactly is changing?"),
        ("02", "EVIDENCE", "What supports the identity claim?"),
        ("03", "AUTHORITY", "Who may approve the change?"),
        ("04", "COMMIT", "What is allowed to persist?"),
    ]
    for index, (number, title, description) in enumerate(stages):
        y = 154 + index * 88
        draw.rounded_rectangle((p(782), p(y), p(1088), p(y+68)),
                               radius=p(5), fill="#101722", outline="#303b52", width=p(1))
        draw.rounded_rectangle((p(798), p(y+16), p(836), p(y+52)),
                               radius=p(4), fill="#17264d", outline="#3557a8", width=p(1))
        number_font = ft(FONT_SANS_BOLD, 12)
        number_bounds = draw.textbbox((0, 0), number, font=number_font)
        number_width = (number_bounds[2]-number_bounds[0]) / SCALE
        draw.text((p(817-number_width/2), p(y+27)),
                  number, font=number_font, fill=BLUE_LIGHT)
        draw.text((p(851), p(y+12)), title,
                  font=ft(FONT_SANS_BOLD, 15), fill=WHITE)
        draw.text((p(851), p(y+36)), description,
                  font=ft(FONT_SANS, 11), fill=MUTED)
        if index < 3:
            draw.line((p(817), p(y+68), p(817), p(y+88)),
                      fill="#526da8", width=p(2))

    draw.text((p(783), p(506)), "DIO/ODI-INFORMED  ·  ENGINEERING HANDOFF",
              font=ft(FONT_SANS_BOLD, 9), fill="#8390a8")
    return image.resize((1200, 630), Image.Resampling.LANCZOS)


def main():
    BRANDING.mkdir(parents=True, exist_ok=True)
    image = build()
    primary = BRANDING / "social-preview.png"
    versioned = BRANDING / "social-preview-v2.png"
    image.save(primary, format="PNG", optimize=True, compress_level=9)
    shutil.copyfile(primary, versioned)

    # Full decode catches truncated PNGs that a signature/dimension check misses.
    for output in (primary, versioned):
        with Image.open(output) as check:
            check.verify()
        with Image.open(output) as check:
            if check.format != "PNG" or check.size != (1200, 630) or check.mode != "RGB":
                raise RuntimeError(f"Invalid social preview: {output}")
        print(f"Generated {output.relative_to(ROOT)} ({output.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
