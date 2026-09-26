# PROJECT HANDOVER: Connie's Contingencies

This document is written for another LLM (or a future session of you)
picking up this project cold. It covers the goal, the design philosophy,
every decision made so far, the current file structure and code, and what's
still open. Read this before touching any code.

---

## 1. What this project is

A static, multi-page teaching website that teaches operant/behavioural
conditioning principles through short, discovery-based browser games,
themed around a pixel-art sausage dog named **Connie**.

**Who it's for:** the site owner is a university lecturer (Associate
Professor of Psychology, BCBA-D) teaching a 12-lecture behaviour-analysis
course. The site is a teaching aid to accompany that course — students play
a module before or during a lecture, and a *separate* lecturer-facing
discussion guide (not yet built — see §7) is used in class to draw out the
deeper conceptual material.

**Why Connie specifically:** she is the lecturer's real dachshund, who was
part of their live teaching demonstrations for around 15 years. The site
includes a tribute page about her (`connie.html`). This is not a generic
mascot choice — treat it with the weight that implies. Do not invent
biographical details about the real dog; the tribute page currently has
`TODO` placeholders for the lecturer to fill in themselves.

---

## 2. Non-negotiable design philosophy

These principles were arrived at after extended back-and-forth and should
not be silently abandoned or "improved away" by a future session:

1. **Discovery over demonstration.** Games must never show students a
   labelled contingency and let them watch it operate passively. The player
   acts, observes consequences, and must infer the underlying rule from
   their own behavioural data. If a proposed mechanic only *demonstrates* a
   principle rather than requiring the player to *infer* it, redesign it or
   flag the concern to the user before building.

2. **Backward design from learning outcomes.** Every module should start
   from explicit, assessable learning outcomes (things a student should be
   able to DO afterward) — not from "what would look like a cool game."
   When starting a new module, ask what it should let a student do
   afterward if this hasn't been specified.

3. **Conceptual/philosophical depth lives OUTSIDE the game.** Deep
   conceptual outcomes (e.g. why manipulation-not-mere-observation
   establishes a functional relation; functional vs. mentalistic
   explanation) are NOT tested inside the game UI. They belong in the
   lecturer-facing discussion guide, which the lecturer uses live in class,
   including prompts to have students re-test specific things in the game
   as a demonstration aid mid-discussion.

4. **Difficulty-ordered post-game inference questions**, using the player's
   own generated data where possible, rather than abstract multiple-choice
   quizzes bolted on afterward.

5. **NES/Mario-era visual style** — vibrant, saturated colours, black
   outlines, limited palette per sprite — explicitly NOT the monochrome
   Game Boy look, and NOT a generic "retro pixel" aesthetic. See §5 for the
   concrete token system already in use; don't reinvent it per module.

---

## 3. Technical architecture (decided, don't relitigate)

- **Pure static site.** Multi-page HTML (`index.html`, `connie.html`, one
  file per module under `modules/`), plain CSS, plain JS. No framework, no
  build step, no bundler, no npm install.
- **Why multi-page rather than a single-page app:** simpler mental model,
  each module is one self-contained file, no client-side router needed, and
  it's trivially hostable/forkable by a non-technical colleague later.
- **Shared state across pages** (e.g. the cross-module treats counter) uses
  `localStorage`, since in-memory JS state doesn't survive navigation
  between pages.
- **Local dev:** the lecturer runs `python -m http.server 8000` from inside
  the project folder and opens `http://localhost:8000`. They deliberately
  chose NOT to use the VS Code Live Server extension (evaluated and
  declined — see §8 note). Don't suggest reinstalling it unless asked.
- **Hosting:** GitHub Pages, pushed from VS Code's built-in Source Control
  panel. Repo root = site root (`index.html` at top level, not nested).
- **Audio:** synthesized in-browser via Web Audio API (oscillator tones),
  not audio files — see `js/shared.js`. This sidesteps file size and, more
  importantly, copyright: no copyrighted melodies are to be reproduced,
  even in chiptune form. Original motifs or public-domain melodies only, if
  a longer musical motif is ever added.
- **Stretch goal, not required:** a future networked two-device mode (one
  person shapes/reinforces from a phone, another controls the agent from a
  separate computer) was discussed and explicitly deferred — it would
  require moving off pure static hosting (WebSockets or a realtime service
  like Supabase/Firebase). Do not build this unless asked; it's noted here
  only so it isn't proposed as if new.

---

## 4. Current file structure

```
connie-site/
├── index.html              ← landing page, module grid, links to all modules
├── connie.html              ← tribute page about the real Connie (has TODOs)
├── README.md                ← quick reference for running/extending the site
├── VSCODE-SETUP.md          ← step-by-step local setup instructions (written for a non-expert)
├── PROJECT-NOTES.md          ← THIS FILE
├── css/
│   └── style.css             ← shared design tokens, layout, module-tile styles
├── js/
│   └── shared.js              ← treats counter (localStorage) + Web Audio chime/motif player
├── modules/
│   └── contingencies.html     ← Lecture 1 module, working prototype (see §6)
└── assets/
    └── sprites/                ← empty; for future raster sprite assets if the
                                   inline-SVG approach is ever swapped out
```

Two more module tiles exist on the landing page (`shaping.html`,
`schedules of reinforcement`) but are NOT yet built — one links to a
not-yet-created file, the other is a dead link (`href="#"`). Building
`shaping.html` is the natural next task (see §7).

---

## 5. Visual design system (already decided — reuse, don't redesign)

Defined in `css/style.css` as CSS custom properties on `:root`:

```css
--sky:        #4AA5E8;   /* background */
--grass:      #4CB944;   /* ground / secondary panels */
--brick:      #C1440E;   /* headers / accents */
--sun:        #FFC93C;   /* highlights / treats / reinforcement flash */
--connie-tan: #C97B3D;   /* Connie's coat */
--ink:        #1B1B1B;   /* near-black outline, not pure #000 */
--paper:      #FFF8E7;   /* warm off-white for text panels/cards */
```

- Display font: "Press Start 2P" (pixel/bitmap, headers and UI chrome only).
- Body font: "Public Sans" (readable, for actual paragraph text).
- UI convention: chunky black borders (`--pixel-border: 4px solid var(--ink)`)
  and a hard drop-shadow (`--shadow-hard: 4px 4px 0 var(--ink)`) on cards,
  tiles, and buttons — this is the site's one consistent "memorable" visual
  device (per frontend-design best practice: spend boldness in one place).
- A one-off `--connie-dark: #A85F27` was added locally inside
  `contingencies.html` for Connie's ear shading — if this recurs in another
  module, promote it to `style.css` instead of redefining it per-file.
- Ground texture: a checkerboard pattern via a single-line `conic-gradient`
  trick (see `#arena` background-image in `contingencies.html`) — reuse this
  pattern for other grid-based modules rather than inventing a new one.

---

## 6. Contingencies module — current implementation (Lecture 1)

File: `modules/contingencies.html`. This is the most fully built module and
should be used as the template/reference for future ones.

**This module has been through two designs.** The first was a grid-movement
game (move Connie into cells, cheese appears at her cell on a schedule).
It was abandoned because moving around the grid had no clear connection to
the behaviour being studied — the lecturer's own diagnosis was "it isn't
obvious what the behaviour is." The current (second) design fixes this by
making the tracked behaviour a single, unambiguous operant: **barking**,
produced by clicking/pressing spacebar. Don't reintroduce grid movement
into this module without a specific reason; if a future module wants
spatial movement, it should justify why movement itself is the behaviour of
interest there.

### Mechanic (current design)
- No grid. Connie is a single large, stationary sprite in a fixed scene.
- **Barking is the tracked behaviour**, produced via a "BARK!" button or
  spacebar. Barking is deliberately NOT 1:1 with clicks — each click adds
  to an internal accumulator, and a bark fires once the accumulator reaches
  a threshold set by `clicksNeeded(state)`. `state` is an internal 0–100
  value, **never shown as a live number** anywhere in the UI or code
  comments visible to a player.
  **The meter IS given a label — "Hunger" — but this is now a deliberate
  reveal device, not an oversight.** The earlier design rule here ("never
  label it, to avoid smuggling in a mentalistic term") has been explicitly
  superseded for this module by the lecturer: label it with a real,
  familiar psychological word on purpose, then use the accompanying
  write-up (`what-made-the-cheese-appear.md`) to reveal that the label is
  an "illusory variable" — the formula behind it has no representation of
  felt hunger at all, only a running tally of cheese received. Don't revert
  this to an unlabelled "???" thinking it's restoring an earlier rule; the
  reveal-the-label approach is now the intended design for this module.
  Referred to only as "state" in code/docs (the code itself never uses the
  word "hunger" anywhere — that word exists only in the UI label and the
  write-up's critique of it).
- **Cheese delivery is genuinely non-contingent** — a variable-time
  schedule, mean 15s, uniform between `MIN_GAP_S=10` and `MAX_GAP_S=20`
  seconds, completely independent of barking. This is the core "looks like
  a contingency but isn't" trap: because barking can be frequent, cheese
  will often appear to have "followed" a bark by pure coincidence. The
  timer for the FIRST delivery does not start until the player's first
  bark-button/spacebar interaction (explicit lecturer requirement, to
  ensure engagement before anything starts) — see `handleBarkInput()`.
- **The hidden `state` value only changes at the moment of each cheese
  delivery** (not continuously over time) via `stateAfterDelivery(i)`:
  starts at 75, rises to 85/93/100 across the first three deliveries (a
  small "sample of the reinforcer increases eagerness" bump), then decays
  via an ACCELERATING quadratic curve — see below — reaching roughly 15 by
  delivery 20. This drives `clicksNeeded()` below, so barking effort
  visibly changes over the session as a function of cheese history,
  without ever being explained.
- **Displays above the scene:** plain text totals for Barks and Cheese (no
  bars, no denominators — the lecturer found the earlier bar-with-max
  version added nothing and asked for it removed), plus one actual meter,
  labelled **"Hunger"** (see above — a deliberate reveal, not an
  unlabelled mystery), showing `state` directly as a percentage, with "0"
  and "100" scale-tick labels at each end of the track (axis calibration
  only, not the live value — doesn't undermine "never show the number").
- **`clicksNeeded(state)` uses a CONVEX (accelerating) curve, not linear** —
  chosen after lecturer feedback that a linear range still felt too subtle:
  `4 + 0.0035 * (100 - state)^2`, giving ~4 clicks near `state=100` and
  ramping up sharply to ~29 clicks near the state floor (~15). The point is
  that the *rate of change* itself increases as state falls — flat-feeling
  early in a session, dramatically harder late. Retune via the two
  constants `4` (min clicks) and `0.0035` (steepness).
- **`stateAfterDelivery(i)` decay is ACCELERATING, not decelerating** —
  small drops early, ever-BIGGER drops later. The decay constant `declineK`
  is now DERIVED from `DELIVERIES_TOTAL` and `STATE_FLOOR_TARGET` (=15),
  not a hardcoded number — `declineK = (100 - STATE_FLOOR_TARGET) /
  (DELIVERIES_TOTAL - 3)^2` — specifically so state always reaches the same
  low floor by the final delivery regardless of how many deliveries there
  are. **This fixes a real bug**: an earlier version hardcoded the decay
  constant for exactly 20 deliveries; when deliveries were reduced to 10,
  that hardcoded constant left state barely decaying at all (~85 instead of
  ~15 by the end), silently undoing the "dramatic change at low state"
  design goal. Don't hardcode this constant again — if you need a different
  floor value or curve shape, change `STATE_FLOOR_TARGET` or the exponent,
  not a magic number tied to one specific delivery count.
- `MIN_GAP_S`/`MAX_GAP_S` are `7`/`13` (mean ~10s), down from an original
  10–20s (mean 15s) — the lecturer found the original gap "too long."
- **Session ends** automatically after the 10th cheese delivery
  (`DELIVERIES_TOTAL = 10`, down from 20).
- **A tail wag is a second, separate mechanic from barking, added
  specifically to give the module a GENUINE contingency to contrast against
  the illusory-looking bark/cheese one.** `doWag()` fires exactly once per
  cheese delivery, after a fixed `WAG_DELAY_MS = 350` delay (deliberately
  after the cheese pop, never simultaneous — the lecturer was explicit
  about this ordering). Implemented as a discrete CSS keyframe
  (`wagOnce`, toggled via a `.wag-once` class) rather than the tail's
  earlier continuous idle-wag animation, which was REMOVED — a tail that
  wags constantly on its own would make "one wag per cheese delivery"
  meaningless to look for. Every wag timestamp is logged to `wagLog`.
  **Wag data has NO chart of its own** — an earlier version gave it a
  dedicated latency chart, then a later version folded it into a binned
  bark/cheese/wag chart; that binned chart has since been REMOVED (see
  below) in favour of a plain session-totals chart, where wags are just
  the third bar. Don't reintroduce a standalone wag chart, and don't
  reintroduce a continuous/idle tail animation, without reconsidering both
  of these decisions.
- **IMPORTANT bug fixed here, don't reintroduce it:** ending the session
  used to call the chart-rendering functions synchronously, the instant the
  final cheese delivery registered. But that final delivery's wag is on its
  own `WAG_DELAY_MS` timer and hadn't fired yet at that point, so `wagLog`
  was one entry short of `cheeseLog` when the charts read it — and that one
  missing value turned into `NaN` through `Math.max(...)`, which silently
  blanked every bar in the affected chart (not just the wag data — the
  whole chart). The fix: on the final delivery, immediately disable input
  and stop the cheese timer, but delay the actual `showResults()` call by
  `WAG_DELAY_MS + 50`ms so the last wag has definitely landed before
  anything tries to read `wagLog`. If wag-related logic is changed again,
  re-check this ordering.
- **Bark sound is now a synthesized noise-burst ("woof"), not a clean
  oscillator tone** (`playBarkSound()`): white noise through a lowpass
  filter whose cutoff sweeps sharply downward, with a fast decay envelope
  — chosen specifically because the lecturer found the previous
  `playChime()` square-wave blip too obviously electronic. Still fully
  synthesized in-browser (no audio file), keeping this site's established
  no-external-audio-assets approach (see §3) for the same copyright/
  file-size reasons as everywhere else. If a literal recorded bark sample
  is ever wanted instead, that's a bigger architecture change (adding a
  real audio asset under `assets/`, with its own licensing to sort out) —
  don't do this without being asked, since it breaks the site's current
  "audio is generated, not shipped as a file" pattern.

### Post-session data views
Read from `barkLog`, `cheeseLog`, `wagLog` (arrays keyed by elapsed seconds
since session start) and rendered as hand-built inline SVG (no charting
library) by `showResults()`:
1. **Cumulative record** (`renderCumulative`) — full-detail staircase of
   cumulative bark count over session time, with a tick mark AND a dot on
   the curve at each cheese-delivery moment (red), PLUS a tick mark at each
   wag moment (green, `var(--grass)`) — added alongside the cheese ticks so
   students can see the two line up almost exactly every time, in visual
   contrast to how little the bark staircase relates to either. This is the
   only time-ordered view left.
2. **Session totals** (`renderTotals`) — a plain three-bar chart: total
   barks, total wags, total cheese deliveries, no time axis at all. This
   REPLACED an earlier binned (per-30-seconds) bar chart that also carried
   a dashed `state`/"Hunger" overlay line — the lecturer wanted the simpler
   totals-only version instead. **That state overlay is gone along with the
   binned chart** — `state`/`stateLog` currently has no visual consumer
   anywhere in the results. If the Hunger-vs-cheese relationship needs to
   be visible again, that's a new decision to make (and where to put it),
   not a revert — don't silently re-add it to the cumulative record or
   anywhere else without being asked.
3. **Rate per minute** (`renderRate`) — a single overall number
   (total barks ÷ total session minutes).
- **`state` is still never shown as a live number anywhere in the UI** —
  the "Hunger" meter shows it only as a bar length (with 0/100 scale
  labels). There is currently no other place `state` is exposed at all
  (see point 2 above) — this is stricter than it used to be, not looser.
- A "Play again" button does a full page reload — simplest possible reset,
  fine for this module's scope.
- **The intro copy above the game deliberately does NOT mention working out
  a relationship, a contingency, or any analytic framing** — it was
  explicitly stripped back to a plain "how much cheese can you get her"
  challenge on lecturer request, to avoid tipping the player off before
  they've played. Don't re-add analytic language here even if it seems
  helpful — the discovery has to come from playing, not from being told
  what to look for in the instructions.
- **Numbered discussion questions now appear directly under the graphs, in
  the game's own results screen** (`#discussion`), not only in the separate
  lecturer discussion guide. This is a deliberate, explicit exception to
  this module's original "conceptual depth stays in the discussion guide"
  rule (§2, point 3) — the lecturer asked for these five specific prompts
  to be visible to students immediately after playing:
  1. Hypothesis for what contingency was present.
  2. Whether the "Hunger" label on the state bar was earned or just borrowed.
  3. What the graphs show and how they help test that hypothesis.
  4. Comparing data with peers, and how helpful that is for revealing a
     contingency.
  5. How they'd test their hypothesis by re-running the experiment.
  Treat this as the new pattern for THIS module specifically — simple,
  open reflection prompts can live in-game post-session. This does not
  overturn the broader rule that deeper theoretical/philosophical material
  (Mill's methods, functional vs. mentalistic explanation, etc.) still
  belongs only in the separate lecturer-facing guide; don't start moving
  that material into the game UI without an equally explicit request.
- **Spacebar visibly presses the on-screen Bark button** (a `.pressed` CSS
  class toggled on keydown/keyup, matching the existing `.btn:active`
  look), not just triggering the game logic silently — added so keyboard
  players get the same visual confirmation mouse/touch players get.

### Known gaps / not yet built
- No pre/post classification or hypothesis task is attached to the
  results screen (e.g. asking the player to guess whether barking and
  cheese were related before showing them the graphs). This was a planned
  feature under the OLD grid design (see git history / prior handover) and
  has not been re-added under the new design — worth considering, but not
  requested yet under the current mechanic.
- No accessibility fallback for colour-only bar-chart legend (brick vs sun
  colour swatches) — minor, worth a text label if this module is polished
  further.
- Decoy/inert objects (bath, broom, bone) from the old grid design were
  removed entirely along with the grid. If "things that are present but
  functionally irrelevant" is still wanted as a teaching point, it would
  need a new home in this scene-based layout (e.g. background clutter).

### Code structure to preserve
- `handleBarkInput()` — single entry point for both click and spacebar,
  handles session-start gating (first interaction only) and the
  click-accumulator/threshold logic. Don't duplicate this per input type.
- `deliverCheese()` — single entry point for a delivery: increments count,
  logs timestamp, updates `state`, triggers visuals/sound/treats, and
  either reschedules or ends the session. `scheduleNextCheese()` is the
  only place the VT timer is set.
- Connie's sprite is hand-authored inline SVG (not an image file) using a
  pixel-grid-of-rects technique. As of this revision it follows a reference
  image the lecturer supplied (a classic pixel-art dachshund) rather than
  an earlier from-scratch design that had drifted too far from it (snout
  too long, ear too long, plain tan-and-white body). Current design,
  `viewBox="0 0 44 24"`:
  - **Two-tone shading, not a white belly stripe**: the body, ear, and top
    of the skull use `var(--connie-dark)` (a darker "back" brown), while
    the body's underside and the muzzle patch use `var(--connie-tan)` (the
    lighter shade) — matching the reference's dark-back/light-belly look.
  - **A short, modest snout** — `var(--connie-dark)`/tan head, snout
    extends only a few units past the skull, NOT the elongated snout from
    the previous revision. If this ever needs lengthening again, do it in
    small increments and check against the reference image, not by
    reasoning from the code alone — pixel art proportions are hard to
    judge from coordinates.
  - **A short ear reaching only to about jaw level**, not to the ground —
    also corrected from a previous overly-long version. Still drawn BEFORE
    the skull in the markup so the skull paints over its top edge, reading
    as attached behind the head.
  - **A tail that curls upward at the tip** — built from two rect pairs (a
    base merging into the body, and a separate tip positioned up-and-left
    of the base) rather than a single straight rectangle, to approximate
    the reference's hooked tail shape. Both pairs stay inside
    `<g id="tail-group">` — this grouping is load-bearing, since the
    cheese-triggered wag animation targets that id; don't ungroup them.
  - **Legs have a visible dark "paw" at the bottom**: each leg is one ink
    rect (the full leg+paw height) with a shorter tan rect on top covering
    everything except the bottom ~2 units, which is left as bare ink and
    reads as a paw. Same outline-first technique as everywhere else, just
    applied asymmetrically (margin only at the bottom).
  `#dog-wrap`'s CSS width is kept in step with the viewBox's aspect ratio
  (currently 257px for a 140px height, matching 44:24) — recompute this if
  the viewBox dimensions change again, or the sprite will letterbox inside
  its box.
- Charts are built as raw SVG strings assigned via `.innerHTML` — this
  works fine for inline `<svg>` in modern browsers without any library;
  reuse this approach for other modules rather than pulling in a charting
  dependency.

---

## 7. Full module plan — status

The site maps (not necessarily 1:1) onto this 12-lecture sequence:

| # | Lecture | Module status |
|---|---|---|
| 1 | Contingencies | **Built** (prototype, see §6 gaps above) |
| 2 | Reinforcement (positive & negative) | Not started |
| 3 | Punishment | Not started |
| 4 | Pavlovian conditioning | Not started |
| 5 | Stimulus control | Not started |
| 6 | Extinction | Not started |
| 7 | Derived stimulus relations | Not started |
| 8 | Schedules of reinforcement | Not started (has a dead-link tile on the landing page) |
| 9 | Quantitative analysis of behaviour | Not started — flagged as possibly needing a DIFFERENT format (e.g. a graph-reading exercise) rather than a discovery grid-game |
| 10 | Motivating operations | Not started |
| — | Shaping | **Built** — see §6a below. Autonomous-Connie design, quite different from the original discrete-trial spec once drafted here (see git history / earlier revisions of this doc if that context is ever needed — it's superseded, not a variant to revive) |
| — | Builder/sandbox module | Designed in detail (see below), cross-cutting rather than tied to one lecture; not started |

The lecturer has NOT finalised the full lecture list (their message said
"and maybe some others") — don't assume the table above is exhaustive when
planning the module count.

## 6a. Shaping module — current implementation

File: `modules/shaping.html`. **This mechanic is quite different from the
original design spec once drafted in this document** — that spec (discrete
trials, player-controlled grid movement, tightening Manhattan-distance
criterion) was superseded before being built. Don't resurrect it; the
actual design is below.

### Mechanic
- Connie moves **autonomously** — the player never controls her directly.
  The player is purely the reinforcement source. This is a deliberate
  contrast with the Contingencies module, where the player WAS the
  behaving agent (clicking = barking); here the player only controls
  consequences, closer to real shaping practice.
- 7×7 grid (`ROWS`/`COLS`), Connie starts at the corner (`START = {0,0}`),
  a piece of cheese at the opposite corner (`BOWL = {6,6}` — internal
  variable/function names still say "bowl" throughout the code, e.g.
  `onReachedBowl()`; only the user-facing emoji and copy were changed to
  cheese 🧀. Don't assume the code names track the current visual — check
  the actual displayed content if this matters for a future edit).
- From her current locked-in position (the **"frontier"**), she picks a
  random adjacent cell — **8-directional, including diagonals** (deliberate
  choice, not 4-directional like other grid modules) — and moves into it.
  **If that cell is the target, the game ends immediately on arrival** —
  no click/reinforcement needed, no closing replay flourish. Otherwise, a
  `REINFORCE_WINDOW_MS = 500` window opens: if the player clicks (button or
  spacebar) inside it, the candidate cell is locked in permanently and
  becomes the new frontier; if not, she retreats to the frontier and tries
  a different random neighbour. **The window never shrinks**, even when
  escalated (see below) — only the movement/pause timing around it speeds
  up. Don't couple the reinforcement window itself to escalation; that
  would make reinforcement progressively harder to land, which isn't the
  intended lesson.
- On every new lock-in (other than the final, free one), she returns to
  `START` and **quickly replays the entire locked-in sequence so far**
  (`REPLAY_MOVE_MS = 90`, always fast regardless of escalation — "already
  learned" ground) before resuming random exploration from the new
  frontier. **A real timing bug was fixed here**: the code used to call
  `startSamplingCycle()` synchronously in the same tick as issuing the
  final replay move, so the next random walk began before the previous
  move had visually finished animating — she never looked like she'd
  actually settled at the reinforced square before darting off again. The
  fix was to always defer the "what happens next" check by
  `REPLAY_MOVE_MS`, uniformly, including after the last step — see
  `replayThenContinue()`. If this function is touched again, keep every
  transition (not just mid-sequence ones) wrapped in that same deferred
  `setTimeout`, not a synchronous call.
- If `MOVES_BEFORE_ESCALATION = 4` attempts pass with no reinforcement, she
  **escalates**: movement speeds up (`ESCALATED_MOVE_MS`/`ESCALATED_PAUSE_MS`
  vs the `NORMAL_*` constants) and she barks (reusing the exact
  `playBarkSound()` + "Woof!" speech-bubble from Contingencies — the
  lecturer explicitly asked for the same bark, not a new one) on every
  subsequent attempt until she's reinforced again, which immediately resets
  escalation.
- **Another real bug, now fixed: the bark bubble's text rendered backwards
  whenever Connie faced left.** The mirror-flip (`transform: scaleX(-1)`)
  was originally applied to `#dog-wrap`, but the bark bubble is appended as
  a CHILD of `#dog-wrap` — so it inherited the same flip and its text
  mirrored too. Fixed by scoping the flip to `#dog-svg` only (toggled via
  `dogSvg.classList`, a separate reference from `dogWrap`), leaving
  `#dog-wrap` itself unflipped so children like the bark bubble render
  normally. If any other UI element is ever appended inside `#dog-wrap`,
  make sure it's added there too, not to `#dog-svg` or a still-flipped
  ancestor, or the same bug will recur for that element.
- **Nothing prevents the player from reinforcing a cell that isn't progress
  toward the target.** This is deliberate, not a gap — a careless
  reinforcement choice just produces a worse (or, in principle,
  never-ending) route, which is itself part of the lesson. Don't add
  guardrails against this without being asked.
- The Click button's own feedback is a separate, lighter `playChime(880,
  80)` "marker" tone, deliberately distinct from the cheese jingle
  (`playMotif()`, played only on arrival) — clicking marks a step the way a
  training clicker does; cheese is the actual primary reinforcer, delivered
  only at the very end via `showCheesePop()` + `playMotif()` +
  `addTreats(1)`. This distinction was a deliberate design choice (not
  requested in so many words, but a direct reading of "if she gets to the
  bowl a piece of cheese arrives") and is worth surfacing in a discussion
  guide later (marker/conditioned reinforcer vs. primary reinforcer).
- **A Reset button** sits next to Click during play (not just "Play again"
  on the results screen) — both currently just call `location.reload()`,
  the simplest possible full reset. No mid-game confirmation dialog; if
  accidental resets become a problem, that's the place to add one.
- **A Start button gates the beginning of play** — the game no longer
  auto-starts on page load. This isn't just pacing/UX: without it, an
  escalation bark could fire autonomously (Connie wanders on her own, no
  player action required to trigger the first few cycles) before the
  player had made any genuine interaction with the page — which browsers
  can silently block under autoplay-audio restrictions, the same class of
  issue the Contingencies module solves by gating its first cheese timer
  behind the player's first bark click. `gameStarted` guards against the
  button (or an accidental double-fire) calling `startSamplingCycle()`
  more than once. If this module is ever changed to auto-start again, that
  audio-gating problem needs a different solution, not just deletion of
  the guard.
- End screen is intentionally light: a one-line summary (steps reinforced,
  total attempts) plus three discussion prompts. No graphs, unlike
  Contingencies — nobody has asked for post-session data visualisation
  here yet; if wanted, the raw material (attempt count per step, timing)
  isn't currently logged in enough detail to support it and would need
  extending.

### Known code duplication — a deliberate short-term choice, not an oversight
`shaping.html` duplicates several things from `contingencies.html` rather
than sharing them via `js/shared.js` / `css/style.css`:
- The Connie SVG sprite markup (identical rects/viewBox in both files).
- `playBarkSound()` (identical function body in both files).
- The bark speech-bubble CSS/markup pattern (`.bark-bubble` + `@keyframes
  bubble`) and the cheese-pop CSS/pattern (`.cheese-pop` + `@keyframes
  cheesepop`) — though note the cheese-pop CSS is NOT quite identical
  between the two files: Contingencies' version uses `transform:
  translate(-50%, ...)` centring suited to its free-floating "scene" layout,
  while shaping's version is a cell-sized flexbox suited to grid-cell
  coordinates. **Don't copy one file's cheese-pop CSS verbatim into the
  other — they're intentionally different for this reason.**
- The `--connie-dark` colour token (defined locally in both files' own
  `:root`, not in the shared `css/style.css`).

This duplication was a deliberate choice when `shaping.html` was built,
made to avoid touching the already-tuned, working `contingencies.html` in
the same pass as building a brand-new module. **Now that two modules need
these, promoting them to `js/shared.js` (a `CONNIE_SPRITE_SVG` template
string, `playBarkSound()`, `showSpeechBubble()`, `showCheesePop()`-with-a-
style-param) and `css/style.css` (`.bark-bubble`/`.cheese-pop`/`--connie-
dark`) is the technically correct move per this project's own stated
policy** (§10, point 7) and would prevent the sprite/sound drifting apart
across files on a future edit. This hasn't been done — treat it as a
live, explicitly-flagged cleanup task, not a silent gap. If asked to do it,
be careful to preserve each file's DIFFERENT cheese-pop positioning
approach (see above) — a shared function needs a position/style parameter,
not a single hardcoded layout.

### Builder/sandbox module — design spec (not yet built)
- One person ("builder") configures a hidden contingency (grid size, target
  cell(s), schedule type CRF/FR/VR/FI/VI, shaping criterion sequence,
  punishment/extinction toggles per cell, discriminative stimuli, or
  independent reinforcement rates on two options for a matching-law setup).
- A second person ("player") experiences only the consequences, with no
  visibility into the parameters, and must infer the setup through play.
- Could double as an assessment tool (build a specified contingency; have
  peers infer it from data) and could export an after-action summary
  (response counts, reinforcement timing).
- This is cross-cutting infrastructure, not owned by one lecture — treat it
  as a distinct build task, likely reusing whichever grid/game engine
  emerges from the per-lecture modules.

---

## 8. Academic grounding already tied to specific modules

- **Skinner, B. F. (1948). "Superstition" in the pigeon.** *Journal of
  Experimental Psychology*, 38, 168–172. — the direct empirical ancestor of
  the Contingencies module's contingent-vs-non-contingent mechanic.
- **Staddon, J. E. R., & Simmelhag, V. L. (1971). The "superstition"
  experiment: A reexamination of its implications for the principles of
  adaptive behavior.** *Psychological Review*, 78, 3–43. — a reexamination
  showing pigeons' "interim" behaviours were NOT actually temporally paired
  with reinforcement, proposing an anticipatory/Pavlovian account instead of
  Skinner's adventitious-reinforcement account. Earmarked for the
  lecturer-facing discussion guide as a way to (a) show students a real
  scientific dispute using the exact discrimination skill the game just
  taught them, and (b) forward-link to the later Pavlovian conditioning
  module.

When other modules are built, look for similarly well-known primary
literature to earmark for the discussion guide — this is a pattern the
lecturer explicitly wants repeated, not a one-off for Lecture 1.

## 8a. Learning outcomes already drafted for Contingencies (for reference/reuse of the *format*, not to be pasted verbatim into other modules)

1. Distinguish temporal contiguity from functional control.
2. Identify the three-term contingency (antecedent-behaviour-consequence)
   in a novel scenario.
3. Explain why manipulation, not observation alone, establishes a
   functional relation — DISCUSSION GUIDE territory, not testable in-game.
4. Differentiate a functional/behaviour-analytic account from a
   structural/mentalistic one — DISCUSSION GUIDE territory.
5. Critically evaluate a claimed contingency using own data; classify
   instances and estimate true parameters.

Note the split: outcomes 1, 2, and 5 are meant to be tested BY the game and
its post-play data task; 3 and 4 are explicitly NOT game-testable and
belong only in the discussion guide. Apply this same split-by-testability
logic when drafting outcomes for future modules.

---

## 9. Explicitly open / undecided items

- The lecturer-facing discussion guide itself has not been started as a
  document. Agreed format so far: per module — a recap prompt, 2–3 open
  discussion questions tied to the non-game-testable outcomes, a suggested
  live in-class re-test using the game, and a pointer to relevant primary
  literature.
- Full final list of 12 lecture topics is not confirmed (see §7).
- No real Connie photos or biographical text have been added to
  `connie.html` yet — those are the lecturer's to supply, do not invent.
- No achievement-badge system has been built (discussed as a "quirky
  element," optional).
- Sprite assets beyond Connie's inline SVG do not exist — decoys and events
  currently use plain emoji. If a fully custom pixel-art style is wanted
  site-wide, that's a deliberate future task, not an oversight.
- Live Server (VS Code extension) was evaluated for local dev and the
  lecturer chose the plain `python -m http.server` route instead — don't
  re-suggest installing it unless asked.

---

## 10. How to work with this project going forward

1. Start from learning outcomes, not mechanics, for any new module.
2. Enforce the discovery-over-demonstration rule — push back (to the user)
   on any mechanic that would only show a contingency rather than requiring
   the player to infer it.
3. Keep conceptual/philosophical depth out of the game UI; route it to a
   "discussion guide" note instead.
4. Reuse the existing design tokens and grid/sprite patterns from
   `contingencies.html` rather than inventing new visual conventions per
   module.
5. Flag real technical limitations only where they genuinely exist — this
   is a simple static site and almost everything discussed so far (grids,
   canvas/SVG games, Web Audio, localStorage) is easily achievable
   client-side; don't invent difficulty.
6. Surface relevant academic/empirical grounding for new modules and note
   where it belongs in the discussion guide.
7. When asked for code, keep to the existing architecture: one
   self-contained `.html` file per module under `modules/`, module-specific
   JS in a `<script>` block at the bottom of that file, and promote
   something to `js/shared.js` only once two or more modules need it.
