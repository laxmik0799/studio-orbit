# Orbit Studio: Creative Agency Website

A bold, experimental website for **Orbit Studio**, a fictional creative agency. It's built with **React, TypeScript, Three.js (React Three Fiber), GSAP, Framer Motion and Tailwind CSS**.

> Orbit Studio is not a real company. Clients, case studies and results are invented, every image is generated in code, and the contact form is a clearly labelled demo that sends nothing.

## Features

- **Preloader**: a counter to 100 with a staggered word reveal, then the panel lifts away. It plays once per session and is skipped when the user prefers reduced motion.
- **Interactive 3D hero**: a custom GLSL "planet" with simplex-noise displacement, iridescent fresnel shading and an orbiting satellite. It reacts to the pointer and squashes and spins as you scroll. It loads lazily after the intro.
- **Custom cursor**: a dot plus a trailing ring (GSAP `quickTo`) that grows over links and shows contextual labels ("View", "Next", "Send", "Talk"). It's disabled automatically on touch devices.
- **Magnetic buttons** that pull towards the pointer with an elastic return.
- **Smooth scrolling** with Lenis, driven by GSAP's ticker so ScrollTrigger stays in sync.
- **Scroll-based animation**: masked word and letter reveals, a manifesto that lights up word by word, counters, staggered capability tags.
- **Horizontal scrolling work section**: pinned, with a progress bar, on desktop. On mobile it falls back to a vertical list.
- **Parallax**: floating artworks at different speeds, a scaling hero image on case studies, offset gallery images.
- **Experimental layouts**: oversized type, stacked sticky "rules" cards, a scroll-pinned process timeline around an orbit diagram, a service list where hovering previews artwork that follows the cursor.
- **Interactive portfolio gallery** (`/work`): discipline filters with an animated pill, a grid/list toggle (both kept in the URL), tilt-on-hover cards, and a list view with a cursor-following preview.
- **Case studies** (`/work/:slug`): a hero reveal, meta, challenge and approach, a parallax gallery, results in each project's palette, and a large "next project" link.
- **Smooth page transitions**: a curtain wipes in with the destination's name and wipes away to reveal the new page.
- **Full-screen menu** with a clip-path reveal and staggered giant links, plus a live IST clock in the header.
- **Contact form (demo)**: validation, service and budget chips, a magnetic submit button and an animated success state. Nothing is sent.
- **Generated artwork**: seven generative styles drawn on canvas from seeds (orbits, flow fields, synthwave grids, kinetic type, gradient blobs, geometric tiles and moiré), so every project has unique visuals and no stock photos.
- **Accessible and responsive**: skip link, semantic headings, `aria-pressed` and `aria-expanded` states, keyboard-closable menu, reduced-motion support, and no horizontal overflow at 390px.

## Tech stack

React 18 · TypeScript (strict) · Vite · Three.js + React Three Fiber · GSAP + ScrollTrigger · Lenis · Framer Motion · Tailwind CSS · React Router 6 · Lucide React

## Architecture

```
src/
  three/Blob.tsx        WebGL planet: GLSL noise displacement, fresnel shading, orbit ring
  lib/
    motion.tsx          GSAP/ScrollTrigger setup, Lenis provider, Split text, scroll-reveal hook
    art.ts              Seeded generative artwork (7 styles) for canvas
  data/work.ts          Fictional case studies (copy, palettes, artwork seeds)
  components/
    Layout.tsx          Nav + full-screen menu, marquee, footer
    Cursor.tsx          Custom cursor and Magnetic wrapper
    Preloader.tsx       Intro counter
    Artwork.tsx         Responsive canvas that redraws on resize
    WorkCard.tsx        Tilt card used across the site
  pages/                Home, Work, CaseStudy, Studio, Contact, NotFound
```

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build
npm run preview
```

## Deployment

Deployed on Vercel. `vercel.json` rewrites routes to `index.html` for client-side routing and caches hashed assets immutably. The Three.js scene is code-split, so it only loads on pages that use it.

Built by **Laxmi Kumari** as part of a frontend portfolio.
