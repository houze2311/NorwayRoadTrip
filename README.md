# Wild Norway — private TV photo presentation

Open **index.html** (or **Norway_Road_Trip_Gallery.html**) in Chrome, Safari, Edge or Firefox. No installation, build, account, internet connection or server is required for the gallery and slideshow. Keep the `assets` folder beside the HTML file. To copy the presentation to another laptop, copy this entire folder.

This repository contains the upgraded Norway Road Trip HTML gallery. It is a static presentation: no backend or hosting service is required.

## On the television

1. Connect the laptop and choose a 1920 × 1080 or 3840 × 2160 display resolution.
2. Open `index.html` and select **TV presentation**, or select a photograph to start at that destination.
3. Use **← / →** to move between photographs, **Space** to play/pause, and **Escape** to return to the gallery. **F** toggles browser fullscreen while retaining the presentation.
4. Choose 5, 8, 12 or 20 seconds per photograph. Playback starts paused. Controls fade when idle and return with pointer movement or a keypress. Keyboard-focused controls remain visible.

TV images use their original proportions without cropping or stretching. Wide panoramas and square images have black margins. Gallery cards use a 16:9 crop. Reduced-motion preferences disable crossfades. Fullscreen availability depends on the browser; a window-filling presentation remains available if the Fullscreen API is denied.

## Photography and the limits of this edition

There are **29 destinations and 48 manually reviewed local photographs**. Every destination has a local hero image; Romsdalen, Skageflå, Besseggen, Nigardsbreen, Trolltunga and Preikestolen each have three images. There are no random runtime searches or unrelated fallback photographs.

The local images are **freely licensed Wikimedia Commons alternatives**, not downloaded tourism-board photography. This is a material limitation relative to the preferred sourcing in the brief:

- [Visit Norway](https://www.visitnorway.com/meetings/media-pack/) says its website images are not necessarily free to use and requests contact before reuse. Its image bank has separate terms.
- [Fjord Norway](https://www.fjordnorway.com/en/imageshop) generally makes its image banks available to tourism enterprises, organisers and the press. Permission for this private presentation was not established.
- [Norwegian Scenic Routes](https://www.nasjonaleturistveger.no/en/press/image-bank) sets usage and attribution conditions. Its pages could be read through web research, but its image host refused direct connections here. No registration or restriction was bypassed.

Official sources remain linked. All local photographs have their own creator, license, source URL, download URL and review record in the manifest and [the attribution page](ATTRIBUTIONS.html). Resized images retain the original license, including ShareAlike where applicable. Image modifications are limited to resizing and JPEG recompression; CSS crops apply only in the gallery.

Specific compromises are recorded visibly under each card’s photo credits and on the attribution page:

- **Saksa:** views of the mountain from Øye, not the requested summit panorama over Hjørundfjorden.
- **Flotvatnet:** the lake foreground and its waterfall with June snow; a square composition.
- **Reinanuten:** the ridge at the left of a Buerbreen panorama, not a summit view. The caption makes this explicit.
- **Lysebotn:** a village/valley view below the hairpins plus a view toward the fjord. Neither shows the whole village and fjord in one aerial frame.
- **Gamle Strynefjellsvegen:** the mountain and lake landscape beside the road, rather than a road-centred composition.
- Weather and seasons vary. Some older glacier photos and the snow-covered Trolltunga frame are historical views, not present conditions.

33 of 48 images are 3840 pixels wide. Most other images are at least 1920 × 1080; the very wide Reinanuten panorama is 3840 × 1077. No image was upscaled to claim extra detail. Some native-resolution downloads were rate-limited; documented 1920-pixel alternatives were used. The full images and previews total approximately 118 MB.

## Files and maintenance

- `index.html`: gallery, presentation markup and travel resources.
- `Norway_Road_Trip_Gallery.html`: identical entry point under the original filename.
- `assets/gallery.css`, `assets/gallery.js`: styling and presentation logic; vanilla CSS/JavaScript.
- `assets/images/`: 48 full images and 48 smaller gallery previews.
- `assets/data/locations.json`: canonical, explicit image manifest.
- `assets/data/locations.js`: generated copy allowing direct offline `file://` loading without a fetch/server.
- `ATTRIBUTIONS.html`: browsable credits, licenses and selection limitations.
- `research/`: source metadata, reviewed selection and link audit.
- `verification/`: browser test, report and screenshots.

If you edit the JSON text or image selection, regenerate `locations.js` and `ATTRIBUTIONS.html` with `research/build-manifest.py` (Python + Pillow). The builder uses the checked metadata and fails on missing files. Selection changes must be manually verified; `verified: true` records the completed visual/source check, not an automated geolocation guarantee. The Dalsnibba source accidentally reverses its author/source fields; the credit was corrected to Ximonic (Simo Räsänen) using the source page and its EXIF author.

Search still filters the gallery. Selecting any card now opens the full-frame viewer with slideshow controls. The Share action explains how to copy a private local folder, and retains native sharing/link copying if served from an appropriate web origin.

Only adjacent slideshow photography is preloaded. Gallery previews are lazy-loaded with fixed aspect ratios. Missing images produce a clear message, with source links retained. The travel resources and original-source links need internet; the presentation itself does not.

## Verification

See `verification/report.json` for the executed browser checks and the PNG screenshots for visual inspection. Automated tests use an isolated Chrome session with networking disabled and load the HTML directly from disk. They cover image decoding, 29 destinations, unique assets, search, keyboard navigation, autoplay timing, fullscreen, focus restoration, inactivity controls, 1920 × 1080 and 3840 × 2160 layouts, mobile overflow, and image failure handling. To rerun the browser checks, install Playwright (`npm install --no-save playwright`) and Google Chrome, then run `node verification/check.cjs`. Alternatively, set `PLAYWRIGHT_MODULE` to an existing Playwright module directory. Regenerate the manifest with `python3 research/build-manifest.py` after installing Pillow (`python3 -m pip install Pillow`).

All 12 official travel-resource URLs were checked on **8 October 2026**. Nine returned HTTP 200 directly. Visit Norway, Norwegian Scenic Routes and AutoPASS blocked/refused the direct checker but were confirmed through the web research tool. Those distinctions are preserved in `research/resource-link-check.json`. This is not a guarantee of future availability, ferry timetables or 2027 road access. A physical television and Safari were not available to the automated test; resolution/fullscreen checks are Chrome browser checks.
