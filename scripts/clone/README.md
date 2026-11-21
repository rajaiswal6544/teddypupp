# Clone tooling

One-off scripts used while analysing and porting the reference site. They are **not** part of the app build. They ran in a scratch folder against captured copies of the reference HTML and CSS (`ref/`, `jsx/`), which aren't committed.

| Script | Purpose |
| --- | --- |
| `record-mutations.js <path>` | Scrolls a reference page and logs every DOM attribute its JavaScript changes (the behaviour spec) |
| `probe-elements.js <path> <selector> <scrollY…>` | Prints element rects and data-attributes at given scroll positions (used to measure the hallway speed and door threshold) |
| `compare-screenshots.js <path> <width> <out> <scroll…>` | Side-by-side screenshots of the reference vs. `localhost:3000` (scroll by px or `selector@offset`) |
| `h2j.js <in.html> <out.jsx> [selector]` | HTML → JSX converter (attributes, styles, SVG casing, text-node merging, local image URLs) |
| `refine.py` | Turns converted JSX into components: `<PupBuddy>`, `<Paw>`, `next/link`, `site` config |
| `splitcss.js` + `groups.json` | Splits the reference's component CSS into per-section files |
| `scaffold_home.py`, `page_*.py`, `scaffold_pages.py` | Reproducible generation of the home sections and pages, including the data-driven refactors |

All Playwright scripts use the Chromium installed in the environment (`require("playwright")`).
