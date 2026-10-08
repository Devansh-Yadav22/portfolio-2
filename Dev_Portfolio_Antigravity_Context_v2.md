# Portfolio Build Brief v2: Devansh Yadav ("Dev")

This replaces the earlier brief. Read all of it before writing code. It is the single source of truth for concept, visuals, motion, content and constraints. Where something is unspecified, choose the option that is more precise, more technical and more specific to Dev, never the generic default.

---

## 1. What we are building

A single-page, WebGL-driven personal portfolio for Devansh Yadav, B.Tech CSE student (2024 to present), full-stack developer, AI/ML and blockchain builder, India.

**Audience:** recruiters and engineers first, collaborators second.
**Goal:** prove engineering depth through real work, and be so visually absorbing that visitors explore instead of skimming and leaving.
**Tone:** technical, precise, calm and confident. Tech is the main subject. Music is a quiet signature (section 8), never a theme.

### Concept: The Lattice

The entire site lives inside one continuous 3D scene: a vast **hexagonal lattice** where every cell is a block in a ledger. The hexagon is deliberate. It is a honeycomb (Dev's flagship project, Honey Chain), a block in a chain, and a nod to hexadecimal. The visitor does not scroll through pages, they **travel through the lattice**. Each project is a region of the lattice with its own behaviour, drawn from what that project actually does.

The scene is persistent. Content (text, project detail) is HTML layered over the canvas, so it stays crisp, selectable and accessible.

**Not included:** no sketches, portrait drawings, pencil textures, handwriting fonts, OS/bootloader intros, waveform sections, chord charts or music-metadata jokes.

---

## 2. It must not look machine-generated

Hard requirement. Nothing in the UI, copy, code comments, commit messages, README or `<meta>` tags may suggest AI involvement. Avoid these tells:

- No purple/blue gradient washes, no glassmorphism, no generic glowing blurred orbs, no stock neon-on-black cyberpunk.
- No grid of identical rounded cards with the same soft shadow. No pill buttons or tags. Use a 2px radius or none.
- No tracked-out ALL-CAPS eyebrow above every heading. No headline with one italic/coloured word.
- No `01 / 02 / 03` numbering unless the content is a real sequence.
- No middle-dot meta strings, no `WORD — fragment` labels, no arrow on every link.
- No emoji, no sparkle icons, no "AI-powered" badges, no "crafted with" footers. Footer reads only: Devansh Yadav, and the year.
- No fade-and-slide-up on every block, no hover lift on everything.
- No lorem ipsum, no filler words ("passionate", "cutting-edge", "seamless", "leverage"). Copy is first person, plain, specific.

Spend visual boldness on **the lattice and the hero**. Keep UI chrome minimal so the scene carries the page.

---

## 3. Visual design

### Palette (CSS variables, also passed to shaders as uniforms)

| Token | Hex | Use |
|---|---|---|
| `--ink` | `#06080C` | background, a cold blue-black |
| `--ink-2` | `#0D1117` | panels over the scene |
| `--line` | `#1B2430` | lattice edges at rest, hairlines |
| `--bone` | `#E9E5DD` | primary text |
| `--mute` | `#7B8794` | secondary text |
| `--honey` | `#FFB23E` | the single accent: active cells, ripples, focus, links |
| `--honey-deep` | `#B86E10` | ripple tails, bloom falloff |

Honey is for signal and state only. Never for body text or large flat fills. Contrast AA.

### Typography
- **Display and body:** a serif with real weight range, e.g. *Fraunces* (variable). Hero name is very large.
- **Technical text, labels, terminal:** *JetBrains Mono*.
- Sentence case. Fluid `clamp()` scale. Measure under 68ch. Real fallback stacks.

### The lattice (core shader work)
Build with **three.js** (plain or react-three-fiber), one `InstancedMesh` of hex outlines or flat hex plates, custom GLSL.

- **Resting state:** thin, dim hairline hexes in `--line`, slightly different depth per cell via low-frequency noise, so it reads as a landscape, not a flat grid. Slow idle drift. Depth fog fades distant cells into `--ink`.
- **Cursor ripples:** the cursor drives a wave across the lattice: `amp * sin(dist * k - t * speed) * exp(-dist * decay)`. Add 3 delayed echo taps (about 0.18s, 0.36s, 0.54s behind, each weaker), so a single move leaves repeating, fading rings like a delay line. This is the signature interaction.
- **Active cells** brighten to `--honey` with a soft bloom (light selective bloom, threshold high so only active cells glow). Cells settle back with an eased decay of about 900ms.
- **Scroll velocity** bends and stretches the lattice slightly (field of view and per-cell offset), relaxing at rest.
- **Hidden cells:** 5 rare cells with a faint, slow pulse. Clicking one reveals a short fact in a small panel (a hackathon, the band, a tool Dev likes, and so on; facts must come from section 7 only). A corner counter shows `found 2 of 5`. This is the reason to keep exploring.
- Cap DPR at 2, use instancing, keep draw calls minimal, target 60fps on a mid-range Android phone. Reduce instance count and disable bloom on small or low-power devices.

---

## 4. Journey (the scroll is a camera path)

One continuous camera moves through the scene; scroll position scrubs it. HTML content fades in and out only as part of this motion, never as separate "page" animations.

### 4.1 Hero
- The name **Devansh Yadav** forms from thousands of GPU particles that assemble from the lattice (sample text to points via an offscreen canvas). The cursor disperses nearby particles with soft physics, they spring back and re-form.
- Opening sequence about 2s: lattice lights in from the centre outward, particles gather into the name, one line of copy resolves beneath. After that the page is still until the visitor acts.
- Line under the name: *Computer Science Engineering student. I build full-stack products, AI tools and blockchain systems.*
- No scroll arrow. The camera simply begins to descend when the visitor scrolls.

### 4.2 About (short)
Lattice dims, a small cluster of cells lights beside the text. First-person, 3 to 4 sentences: who Dev is, what he builds, what he is learning (see section 7). One quiet line about music and writing (section 8).

### 4.3 Work: each project is a region with its own behaviour
Camera flies to each region; the project's name and one line appear, and the region **animates according to what the project really does**. Click or press Enter to open full detail in a panel that grows out of the active cell (shared-element transition, not a modal fade). Esc closes.

1. **Honey Chain.** A chain of hex blocks assembles and links: Beekeeper, Apiary, Harvest, Processing, Packaging, Distribution, Consumer. Data pulses travel along the chain; the final block resolves into a QR glyph. This is the flagship: give it the most polish.
2. **AssignMate.** A line of stiff, uniformly spaced text transforms letter by letter into naturally varied text via a short glyph-scramble resolve shader, showing what the tool does.
3. **Headlyn.** A feed of headline fragments drifts through the region and is sorted into category lanes as you approach.
4. **Edge Computing Topic Modelling.** Particles representing documents (scale down from 10,714 for performance and say so in the caption) drift, then settle into topic clusters like LDA converging. Caption states the real numbers.
5. **Smart Cloud Cost Optimizer.** A field of resource bars rises and falls, then trims and levels out. Subtle and clean. No AI claims.

All five regions share one easing language (section 6) so the flight between them is seamless.

### 4.4 Skills: constellation graph
Technologies are nodes, linked by edges to the projects that used them (only links stated in section 7). Hover or focus a node: its edges light in honey and unrelated nodes dim. The graph is force-directed and slowly alive. Also expose the same data as an accessible grouped list (visually integrated, not hidden).

### 4.5 Command palette and terminal
`Cmd/Ctrl+K` (and a small visible hint) opens a real command console over the scene. Commands: `help`, `about`, `projects`, `projects --honey` (flies the camera there), `skills`, `contact`, `hash` (see below), `sound on|off`, `clear`. Unknown command: say what is wrong and suggest `help`. Natural typing rhythm, history with arrow keys, fully keyboard-operable and labelled for assistive tech.

`hash`: computes and prints a SHA-256 of the string `Devansh Yadav` in the browser using `SubtleCrypto`, with a one-line note that the portfolio's hex lattice is a small nod to a ledger. Real computation, no fake output.

### 4.6 Closing
Lattice calms to a single glowing cell. Contact links, one sentence, and the closing line slot (section 8). Footer: `Devansh Yadav, [year]`.

---

## 5. Cursor
A small honey dot with slight lag that doubles as the ripple source. It contracts over text, expands over interactive cells, becomes a block caret in the console. Transform-only, hidden under `pointer: coarse` where touch ripples take over (a ripple at each touch point). Never hide the system cursor in inputs.

---

## 6. Motion system (everything shares it)

- **Easing:** primary `cubic-bezier(0.22, 1, 0.36, 1)`; secondary `cubic-bezier(0.65, 0, 0.35, 1)`. No bounce or elastic.
- **Durations:** micro 150 to 250ms, state 350 to 500ms, structural 800 to 1200ms, camera flights 1400 to 2200ms.
- **Cause rule:** nothing moves without a cause (scroll, pointer, click, focus, keypress). Allowed idle motion: the opening sequence, slow lattice drift, hidden-cell pulse, constellation drift.
- **Overlap, don't sequence.** Next element starts before the last ends. Stagger 40 to 80ms with slight irregularity.
- **Layered speeds:** lattice, particles and text move at slightly different rates for depth.
- **Camera path** is a smooth spline scrubbed by scroll (GSAP ScrollTrigger plus Lenis, or equivalent), reversible, and never fights anchor links or keyboard scrolling.
- **DOM animation** uses only `transform` and `opacity`. Use FLIP for layout changes and the View Transitions API where supported.
- **Reduced motion:** disable particles, ripples, camera flights and drift. Show a static, well-composed lattice image (pre-rendered or CSS/SVG) and plain opacity fades. All content identical and fully readable.
- **Fallbacks:** if WebGL is unavailable or fails, render the static lattice and all content normally. The site must never be blank.

---

## 7. Content (use exactly; do not embellish)

### Identity
Devansh Yadav (Dev). B.Tech Computer Science Engineering, 2024 to present, India. *Developer focused on full-stack web development, AI-powered products and creative technology, combining engineering with music and visual design.*

### Honey Chain (flagship)
Blockchain-based honey traceability and smart-beekeeping prototype by team **Bee-Tech** for Smart India Hackathon problem statement **SIH26021 (Honey Mission)**. Creates a tamper-resistant history of a honey batch from beekeeper to consumer, with QR-based consumer verification and an architecture ready for future IoT monitoring and AI analytics.
- Stack: Hyperledger Fabric 2.5.x, Fabric CA 1.5.x, Docker Compose, Ubuntu 24.04 on WSL. Tools: `cryptogen`, `configtxgen`, `osnadmin`, `peer`.
- Built: a local Fabric network with Fabric CA, orderer, peer and cryptographic identities.
- Story: bringing up the network (CA configuration, orderer and peer setup, generated Fabric configuration, WSL tooling quirks).
- **Accuracy:** describe it as a prototype. IoT, AI analytics, disease detection and productivity prediction are proposed, not shipped. Traceability is the differentiator.

### AssignMate
AI-powered tool that rewrites AI-generated text into more natural-sounding writing for academic use.
- Stack: React, Node.js, Express.js, Gemini API, Tailwind CSS. Backend/frontend separated; API key in environment variables.
- Story: Gemini model/version and 404 availability errors, Tailwind/PostCSS configuration problems, frontend-backend integration, testing with Postman.

### Headlyn
News aggregation web app with a clean, responsive interface. Live: `https://headlyn1.vercel.app/`.
- Stack: React, JavaScript, GNews API, Vercel.
- Built: category/content retrieval, skeleton loaders, image-handling fixes.
- Story: hit a geographic/news-source limitation in the API early and reworked the app around it.

### Edge Computing Topic Modelling
LDA topic modelling in Python (Gensim) on a Scopus dataset of 10,714 documents and 9,645 terms; text preprocessing, word-frequency analysis, perplexity comparison across topic counts.

### Smart Cloud Cost Optimizer
Group academic project in cloud computing on resource-usage analysis and predictive analysis to reduce unnecessary cloud spend. Delivered a synopsis, an IEEE-format paper and a 25-slide presentation. **Do not mention AI for this project.**

### Also mention (about text or hidden cells only)
SynthNews (news-platform concept, UI and branding exploration); Airline Reservation System (Java, JDBC, MySQL).

### Experience and recognition
- Java Developer Intern, CodSoft, June 2025 to July 2025. Built Java applications; strengthened OOP and problem solving. Do not inflate.
- 2nd Runner-up, Matrix 2.0 Tech Fest (team member).
- Smart India Hackathon participation (SIH26021).
- Learning: Oracle Academy (Java), MongoDB training, Andrew Ng's Machine Learning course (linear regression, cost functions, gradient-based optimization).

### Skills (constellation nodes)
- **Languages:** Java, JavaScript, TypeScript, Python, SQL, HTML, CSS
- **Frontend:** React, Next.js, Vite, Tailwind CSS
- **Backend:** Node.js, Express.js, Spring Boot, JSP, Servlets, JDBC
- **Databases:** MongoDB, MySQL, Firebase
- **AI and data:** Machine Learning, LDA, NLP, Gemini API
- **Blockchain:** Hyperledger Fabric, Fabric CA, Docker
- **Cloud and deployment:** Vercel, Firebase, Render, Google Cloud
- **Tools:** Git, GitHub, Docker, Postman, Figma, VS Code, WSL

Link a technology to a project only where section 7 says so.

---

## 8. Music: quiet signature only

Music appears in three small ways and nowhere else:

1. **Echo ripples.** The delay-and-decay behaviour of the cursor ripples (section 3) is the nod. Do not explain it.
2. **Optional sound, off by default.** A small unobtrusive toggle (also `sound on` in the console). When on, hovering active cells plays soft synthesized tones from a pentatonic scale through Web Audio (no audio files), with low volume and a gentle reverb tail. Never autoplay, remember the choice in memory only for the session, and respect user gestures required by browsers.
3. **One sentence in About:** Dev sings, plays acoustic guitar, writes poetry and shayari, and is part of the band Fading-Echoes. Link to the Baarish cover only if `links.ts` provides a URL.

The closing line (Dev's own Devanagari shayari or lyric) is read from `src/content/closing.ts`. **Dev has not supplied it. Render nothing until filled. Do not invent one.**

---

## 9. Technical requirements

**Stack:** Vite + React + TypeScript + Tailwind CSS v4, **three.js** (optionally react-three-fiber) with custom GLSL, GSAP + ScrollTrigger, Lenis. A light postprocessing bloom only. Keep the bundle lean and code-split the 3D scene.

```
src/
  content/   projects.ts, skills.ts, links.ts, closing.ts, hiddenCells.ts
  scene/     Lattice.tsx, shaders/ (lattice.vert, lattice.frag, particles.*), 
             HeroParticles.tsx, regions/ (HoneyChain, AssignMate, Headlyn, TopicModel, CostBars),
             cameraPath.ts, audio.ts
  ui/        Hero, About, ProjectPanel, Constellation, Console, Cursor, Footer
  lib/       motion.ts (shared easing and durations), commands.ts
  styles/    tokens.css, global.css
```

**Placeholders Dev must fill (do not invent):** email, GitHub, LinkedIn, Instagram, resume PDF path, closing line, optional Baarish URL. Hide any link whose value is empty.

**Quality floor**
- Responsive from 360px up; test at 360, 768, 1280, 1920.
- Semantic HTML, one `<h1>`, landmarks, visible amber focus ring, full keyboard operation including panels and console.
- Canvas is decorative (`aria-hidden`); all content exists as real DOM text.
- Lighthouse: Performance 85+ (WebGL scene considered), Accessibility 95+, Best Practices 95+, SEO 95+.
- `<title>`: `Devansh Yadav, Full-Stack Developer`. Normal meta description from the positioning line. No generator tags, no AI references, no template boilerplate in README.
- Deploy to Vercel.

---

## 10. Build order (check each step in the browser before moving on)

1. Tokens, fonts, layout, fallback static lattice.
2. Lattice shader with idle drift and fog.
3. Cursor ripples with echo taps and bloom on active cells.
4. Hero particle name and opening sequence.
5. Camera path tied to scroll, with Lenis.
6. Honey Chain region and shared-element detail panel (give this the most polish).
7. The other four regions.
8. Constellation skills graph.
9. Console, `hash`, hidden cells and counter.
10. Optional sound.
11. Reduced-motion, no-WebGL, mobile, accessibility and performance passes.

At the end, remove one decorative element. If the site still works, leave it out.
