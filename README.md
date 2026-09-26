# Connie's Contingencies

A static, multi-page teaching site using operant conditioning principles,
themed around a pixel-art sausage dog (Connie). See `PROJECT-NOTES.md` for
the full design brief.

## Folder structure

```
connie-site/
├── index.html              ← landing page, links to all modules
├── connie.html              ← tribute page about the real Connie
├── css/
│   └── style.css            ← shared NES/Mario-style palette & layout
├── js/
│   └── shared.js             ← treats counter (localStorage) + chiptune chime player
├── modules/
│   ├── contingencies.html    ← working prototype (Lecture 1)
│   └── shaping.html          ← (to be built)
└── assets/
    └── sprites/               ← put Connie sprite images here once ready
```

## Running it locally

No installation needed beyond Python (already required for the local
server) and a code editor. See `VSCODE-SETUP.md` for click-by-click steps.

Quick version, from a terminal inside the `connie-site` folder:

```
python -m http.server 8000
```

Then open http://localhost:8000 in a browser.

## Adding a new module

1. Copy `modules/contingencies.html` as a starting template — it already
   wires up the shared CSS/JS paths correctly from inside `modules/`.
2. Add a new tile to the module grid in `index.html`.
3. Keep game logic in a `<script>` block at the bottom of the module's own
   HTML file (simplest for a small site); only promote something to
   `js/shared.js` once two or more modules need it.
