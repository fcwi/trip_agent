# Huninn

The complete Huninn Regular font is bundled as WOFF2 for the travel journal.
Source: https://github.com/google/fonts/tree/main/ofl/huninn
Upstream project: https://github.com/justfont/Huninn
License: SIL Open Font License 1.1, reproduced in OFL-Huninn.txt.

The original Huninn file preserves the full upstream glyph set as the source.
The application loads TripJournal-Regular.woff2, a renamed OFL derivative subset
covering supported characters found in all src JS/JSX/CSS files, Latin characters,
and CJK punctuation. Uncommon user-entered characters use the system font fallback.
CSS uses font-display: swap. Only the subset is included in the production build
and service worker precache, so reading pages stays available offline.

After adding UI/trip text, regenerate using `python scripts/subset-journal-font.py`
with fonttools and brotli installed. The script verifies that the subset retains
all supported source characters. Preserve OFL-Huninn.txt with the font.
