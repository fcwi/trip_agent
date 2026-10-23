# Optional day and night illustration assets

The app ships complete React SVG variants for every destination and daily stamp.
They follow the app's manual appearance preference through ArtworkThemeContext;
no invert or grayscale filter is used, and no missing image URL is requested.

To replace a cover with separately painted raster art, place both images here:

- tohoku-light.png / tohoku-dark.png
- karuizawa-light.png / karuizawa-dark.png
- busan-light.png / busan-dark.png

Enable the corresponding paths in src/components/Itinerary/artwork/artworkTheme.js
using the values in artworkReservedPaths. Only add paths for assets that exist.
The image component resolves them against the Vite base path for GitHub Pages.
An image that fails to load falls back to the matching complete SVG variant.

Night art direction: retain dark hand-drawn contours; replace the sun with a soft
yellow crescent and scattered stars; use desaturated midnight blue or muted plum
for sky; light house and train windows in warm yellow. Keep the destination's
landmarks, objects and composition recognisable in both versions.

For an existing presentation.cover object, use src for the day image and darkSrc
for its night counterpart. When the night image is absent or fails, the app uses
the destination's night SVG rather than inverting or hiding the daytime image.
