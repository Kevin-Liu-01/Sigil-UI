#!/usr/bin/env python3

from pathlib import Path
import argparse

from PIL import Image, ImageDraw, ImageFont


def load_font(size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    paths = (
        "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    )
    for path in paths:
        if Path(path).exists():
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def tile_image(path: Path, width: int, height: int) -> Image.Image:
    image = Image.open(path).convert("RGB")
    scale = max(width / image.width, height / image.height)
    resized = image.resize(
        (round(image.width * scale), round(image.height * scale)),
        Image.Resampling.LANCZOS,
    )
    left = (resized.width - width) // 2
    return resized.crop((left, 0, left + width, height))


def build_sheet(source: Path, output: Path) -> None:
    paths = sorted(source.glob("*-desktop-dark.png"))
    if len(paths) != 20:
        raise RuntimeError(f"Expected 20 desktop-dark captures, received {len(paths)}")

    columns = 4
    tile_width, image_height, label_height = 360, 250, 42
    rows = (len(paths) + columns - 1) // columns
    sheet = Image.new("RGB", (columns * tile_width, rows * (image_height + label_height)), "#111111")
    draw = ImageDraw.Draw(sheet)
    font = load_font(16)

    for index, path in enumerate(paths):
        x = (index % columns) * tile_width
        y = (index // columns) * (image_height + label_height)
        sheet.paste(tile_image(path, tile_width, image_height), (x, y))
        label = path.name.removesuffix("-desktop-dark.png").replace("-", " ")
        draw.rectangle((x, y + image_height, x + tile_width, y + image_height + label_height), fill="#111111")
        draw.text((x + 14, y + image_height + 12), f"{index + 1:02d}  {label}", fill="#f2f2f2", font=font)

    output.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(output, optimize=True)
    print(output)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path)
    parser.add_argument("output", type=Path)
    arguments = parser.parse_args()
    build_sheet(arguments.source, arguments.output)


if __name__ == "__main__":
    main()
