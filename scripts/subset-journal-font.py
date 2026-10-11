"""Build the UI font subset. Requires fonttools[woff] (fonttools + brotli)."""
from pathlib import Path
from fontTools import subset
from fontTools.ttLib import TTFont

root = Path(__file__).resolve().parent.parent
source = root / "src/assets/fonts/Huninn-Regular.woff2"
output = root / "src/assets/fonts/TripJournal-Regular.woff2"
characters = set(range(0x20, 0x100)) | set(range(0x3000, 0x3040))
for file in (root / "src").rglob("*"):
    if file.suffix in {".jsx", ".js", ".css"}:
        characters.update(map(ord, file.read_text(encoding="utf-8")))
font = TTFont(source)
supported = set(font.getBestCmap()) & characters
options = subset.Options()
options.flavor = "woff2"
options.name_IDs = ["*"]
options.name_languages = ["*"]
options.name_legacy = True
subsetter = subset.Subsetter(options=options)
subsetter.populate(unicodes=supported)
subsetter.subset(font)
for record in font["name"].names:
    if record.nameID in {1, 2, 3, 4, 6, 16, 17}:
        name = {1: "Trip Journal", 2: "Regular", 3: "TripJournal-Regular", 4: "Trip Journal Regular", 6: "TripJournal-Regular", 16: "Trip Journal", 17: "Regular"}[record.nameID]
        record.string = name.encode(record.getEncoding())
font.flavor = "woff2"
font.save(output)
result = TTFont(output)
assert supported <= set(result.getBestCmap()), "Subset lost a supported UI character"
print(f"UI glyphs preserved: {len(supported)}; size: {source.stat().st_size} -> {output.stat().st_size} bytes")
