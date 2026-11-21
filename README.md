# TeddyPups U.A.E. — website clone

A faithful, production-ready rebuild of [puppy.instabizweb.com](https://puppy.instabizweb.com/), built for the Blutec AI technical round.

Every page, layout, breakpoint and interaction from the reference is reproduced: the hand-drawn illustration style, the page-transition "blanket", the pinned *Meet the pups* door hallway, the scroll-driven WhatsApp chat, filterable puppy sketches, photo galleries and lightboxes, the searchable FAQ notice board, both enquiry forms, and a custom 404.

## Tech stack

| Layer | Choice | Why |
| --- | --- | --- |
| Framework | **Next.js 15** (App Router), React 19, TypeScript | Same stack as the reference; static generation for every page, plus one API route |
| Styling | **Tailwind CSS v4** + per-section CSS files | Tailwind utilities for layout; hand-written component CSS for the illustrated look |
| Fonts | `next/font/google`: Fraunces (SOFT/WONK axes), Figtree, Shantell Sans (BNCE/INFM axes) | Self-hosted, no layout shift |
| Smooth scroll | [Lenis](https://github.com/darkroomengineering/lenis) | Matches the reference's scroll feel |
| Testing | Playwright (end-to-end smoke tests and screenshot diffing) | |
| Hosting | Vercel | Zero-config Next.js hosting |

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
npm run lint && npm run typecheck
npm run test:e2e   # against a running server (default http://localhost:3000)
```

## Project structure

```
src/
  app/                      Routes (all statically generated)
    page.tsx                Home: 8 sections
    puppies/page.tsx        Available puppies + sticker filters
    puppies/[slug]/page.tsx Puppy storybook (15 available + 27 gone-home pups)
    happy-families/         64-photo memory wall + lightbox
    how-it-works/           Two journeys (tabs), promise, delivery, why us
    faq/                    Searchable notice board + FAQPage JSON-LD
    contact/                Fill-in-the-blanks letter form
    gone-home/              "Ticket home" cards
    not-found.tsx           "Lost" poster 404
    api/enquiry/route.ts    Server-side validated enquiry endpoint
  components/
    layout/                 Header (+ mobile menu), Footer, Curtain, MobileBar, ScrollEffects
    home/                   Home sections + client islands (Lineup, MeetHall, ChatDriver, FamilyWall)
    puppies/                Door, Sketch (procedural art), PuppyFilters, Gallery, Ticket, ScrollRibbon
    families/ faq/ how/ forms/
    pup/                    PupBuddy: the Teddy mascot rig + pose table
    ui/                     Icons, MediaImg (focal-point cropping), PhotoViewer
  data/*.json               Puppies, gone-home pups, family photos, FAQs, journeys
  lib/                      Typed data access, site config, enquiry validation, sketch generator
  styles/*.css              Component styles, one file per page/section
public/media                Photos and videos
tests/e2e.cjs               24 end-to-end checks
scripts/clone/              Tooling used to analyse and port the reference (see docs/PROCESS.md)
```

## How it works (key implementation notes)

- **Server components by default.** Pages are static. Interactivity lives in small client islands: `Lineup`, `MeetHall`, `ChatDriver`, `PuppyFilters`, `Gallery`, `FaqBoard`, `LetterForm`, `EnquiryForm`, `Curtain`, `Header`.
- **Progressive enhancement.** Content is fully present in the HTML. For example, the chat shows every message and both journeys are visible until JavaScript enhances them.
- **Scroll system** (`ScrollEffects`): one IntersectionObserver gives `[data-reveal]` elements `data-armed` → `data-revealed`, and another tracks which `.tp-scene` is on screen (`data-here` / `data-visited`). CSS does all the animation.
- **Pinned door hallway** (`MeetHall`): the section is made `100vh + overflow / 1.25` tall, the stage sticks, and the track moves at 1.25× scroll speed. A door swings open when its centre passes 40% of the viewport. Both values were measured from the reference.
- **Teddy mascot** (`PupBuddy`): one SVG rig with 20 named parts. Each pose (`peek`, `sit`, `snug`, `read`, `bow`…) is a small table of transforms and opacities applied to those parts. Idle CSS animations add wagging, blinking and ear twitches.
- **Sketch cards**: wobbly outlines, washes, photo masks and doodles are generated procedurally (seeded PRNG, harmonic noise, Catmull-Rom → Bézier), so each puppy always gets the same drawing on server and client.
- **Forms**: shared validation in `lib/enquiry.ts` runs on both client and server, with a honeypot field for bots. `/api/enquiry` currently logs submissions; connect email or a CRM there.
- **Accessibility**: skip link, real `<dialog>` modals, ARIA tabs with arrow keys, `aria-live` counts, labelled form fields, and `prefers-reduced-motion` respected throughout.

## Known differences from the reference

- The reference has a single "live" Teddy who walks between sections. Here Teddy sits at each section's spot with idle animations, which is the same as the reference's no-JS rendering.
- The contact page's envelope and postbox animation, the photo page-turn, and the sketch-art generator are my own implementations (the reference renders these client-side).
- "Open in Google Maps" opens a real Maps search; enquiries post to this project's own API.

All photos, videos, copy and the logo belong to the reference site and are used only for this clone exercise.
