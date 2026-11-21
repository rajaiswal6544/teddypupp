# Development process

This document covers how the clone was built, which tools were used (including AI), the decisions made along the way, and how the result was tested and deployed.

## 1. AI tools used and the exact prompt

**Tool:** [Claude Code](https://claude.com/claude-code) (Anthropic's agentic coding tool), running in a cloud sandbox with a terminal, a headless Chromium browser (Playwright) and file access.

**Exact prompt:** a single message containing the assignment email, followed by one line of instruction. Email addresses are redacted here.

> Hi Raj, Congratulations! 🎉 You have been shortlisted for the Technical Round at Blutec AI. […]
> **Assignment: Clone the Complete Website** — Reference Website: https://puppy.instabizweb.com/
> Requirements: Build a complete clone of the reference website, matching its design, layout, responsiveness, and functionality as closely as possible. You are required to: 1. Deploy the website and share the live URL. 2. Share your GitHub repository with the complete source code. 3. Record a Loom video […]
> AI Tools Policy: You are free to use any AI tools or development tools of your choice. However, you must understand your implementation and be able to explain your complete workflow. […]
>
> **"i want to excel and complete this assignment please complete"**

There was no further prompting during the build. The agent planned and carried out the steps below on its own; I then reviewed the code, the docs and the live site.

## 2. Workflow

### Step 1: Reconnaissance (understand before building)
- Crawled every route with headless Chromium. Captured full-page desktop (1440px) and mobile (390px) screenshots, the visible text, and the rendered DOM.
- Found the reference is **Next.js App Router + Tailwind v4**, with readable BEM-style class names (`tp-door__leaf`). So the same stack was the natural choice.
- **Recorded the reference's runtime behaviour**: `scripts/clone/record-mutations.js` attaches a `MutationObserver`, scrolls the page and logs every attribute the site's JavaScript changes. This turned "what does this page do?" into concrete specs, for example:
  - `tp-header @data-hidden/@data-scrolled`: hide-on-scroll header
  - `.tp-scene @data-here/@data-visited`: scroll-driven scene reveals
  - `tp-meet__track @style=translateX(...)` and `tp-door @data-open`: pinned horizontal hallway
  - `tp-chat__step @data-active/@data-done` and `tp-msg-group @data-show`: scroll-stepped chat
  - `tp-lineup__pup @data-state=duck|pop`: rotating puppies in the hero
- Probed exact numbers (`node probe` with element rects at several scroll positions). This gave the hallway's **1.25 px of track movement per px of scroll** and the **door-opening threshold at 40% of the viewport**.

### Step 2: Content and assets → typed data
- Next.js pages embed their React Server Components payload (`self.__next_f.push(...)`). Decoding it gave clean JSON for puppies, family photos, FAQs and journeys, including focal points, dominant colours and video posters.
- The 27 gone-home puppy pages stream their content, so their data came from the payload plus the rendered DOM.
- Downloaded all 200 media files (photos and MP4s) into `public/media`, keeping their paths.
- Result: `src/data/*.json` + typed accessors in `src/lib/data.ts`.

### Step 3: Markup → React components
- Wrote a small **HTML→JSX converter** (`scripts/clone/h2j.js`, using htmlparser2). It converts attributes to React names, style strings to objects and SVG attributes to camelCase. It also merges the text nodes React splits with `<!-- -->` comments, and resolves `/_next/image` URLs to local files.
- A **refiner** (`scripts/clone/refine.py`) then replaces repeated patterns with components: the mascot SVG becomes `<PupBuddy pose=…/>`, paw icons become `<Paw/>`, internal links become `next/link`, and contact details come from `site.ts`.
- **Every list was refactored to map over data**: doors, sketches, polaroids, tickets, FAQ notes, gallery thumbnails. Static illustrations (skylines, planes, the house, the passport book) stay as JSX SVG.
- **The mascot**: all 17 instances share one 20-part SVG rig. A script found that only 16 attributes differ between poses. The rig is stored once (`PupBuddy.tsx`) and each pose is a small attribute table (`poses.ts`).

### Step 4: Styles
- The reference's stylesheet was split by Tailwind layer. Theme tokens (colours, fonts, easing) went into Tailwind v4 `@theme`, and the custom utilities (`font-plush`, `text-giant`, `gutter`…) into `@utility`.
- About 5,000 lines of component CSS were split per section (`src/styles/hero.css`, `meet.css`, `faq.css`…) with a PostCSS script. Files are imported in the original cascade order so overrides still behave the same.

### Step 5: Interactions (written from scratch)
| Feature | Component | Notes |
| --- | --- | --- |
| Page-transition blanket | `Curtain` | Intercepts same-origin clicks: cover → `router.push` → lift |
| Header | `Header` | Hide on scroll down, active paw marker, `<dialog>` mobile menu with close animation |
| Smooth scroll and reveals | `ScrollEffects` | Lenis + IntersectionObservers |
| Hero lineup | `Lineup` | Cycles 15 puppies through 6 seats; preloads the next photo |
| Door hallway | `MeetHall` | Sticky stage, measured speed and threshold, desktop only |
| WhatsApp chat | `ChatDriver` | Step tracking, "typing…" indicator, inline video play |
| Sketch art | `lib/sketch.ts` | Seeded procedural outlines, masks, washes and doodles |
| Filters | `PuppyFilters` | where / breed / gender; honours `?breed=` and `?origin=` links |
| Gallery | `Gallery` + `PhotoViewer` | Page-turn animation, thumbnails, keyboard and swipe, video |
| FAQ | `FaqBoard` | Multi-term search with `<mark>` highlights, unfolding notes, empty state |
| Tabs | `JourneySwitch` | ARIA tablist, arrow keys, `#imported` deep link |
| Forms | `EnquiryForm`, `LetterForm`, `/api/enquiry` | Shared validation, honeypot, fold-and-post animation |

### Step 6: Visual diff loop
`scripts/clone/compare-screenshots.js` captures the reference and the clone at the same scroll position (by pixel offset or CSS selector) and stitches them side by side. Every section was compared at 1440px and 390px, and fixed until they matched.

## 3. Decisions
- **Same stack as the reference** (Next.js + Tailwind) so the design system could be matched exactly, rather than approximated in a different framework.
- **Static generation everywhere.** 50 pages are prerendered and only the enquiry API runs on the server, so it's fast and cheap to host.
- **Data-driven content.** Adding a puppy is a JSON edit, and every page (cards, doors, details, filters, contact dropdown) updates.
- **Simplified mascot.** The reference animates one "live" Teddy that walks across sections (a physics/pathing engine). I placed a posed Teddy at each stop with idle animations instead, which gets most of the charm for a fraction of the complexity. This is the main known difference.
- **Own art where the reference generates it at runtime**: sketch outlines (procedural generator), envelope and postbox, page-turn.

## 4. Challenges and fixes
| Challenge | Fix |
| --- | --- |
| Reference host blocked in the sandbox | Created an environment that allowed only that host (and Google Fonts) |
| Puppy detail pages stream their content (empty server HTML) | Read data from the RSC payload and markup from the rendered DOM |
| Converted text had stray spaces ("Sarah M. , Dubai") | React separates text nodes with `<!-- -->`. The converter now merges adjacent text nodes |
| Cloudflare-obfuscated email in the markup | Replaced with `site.email` and a real `mailto:` |
| Door-opening and scroll-speed values | Measured from the reference with element-rect probes at fixed scroll positions |
| House door only opened in the reference's "live mascot" mode | Gated it on my own `html[data-js]` flag |
| Numeric attributes typed as strings (`tabIndex="0"`) | Converter now emits `{0}` |
| Playwright ESM import failed in tests | Tests run as CommonJS (`tests/e2e.cjs`) |

## 5. Testing
- `npm run lint` and `npm run typecheck`: clean.
- `npm run build`: 50 static pages + 1 API route.
- `npm run test:e2e`: **24/24 passing**. Covers every route, 404, curtain navigation, hero lineup rotation, pinned hallway, lightbox, filters (including `?breed=` links), gallery and video, both forms (validation and success), FAQ search/unfold/empty state, tabs, API validation, the mobile menu, and **zero console errors or hydration warnings**.
- Visual: side-by-side screenshots of every page section at desktop and mobile widths.

## 6. Deployment
Deployed on Vercel straight from the GitHub repository. Every push to `main` triggers a new production build (`next build`), and the static pages are served from Vercel's CDN.
