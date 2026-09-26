# Getting set up in Visual Studio Code

## 1. Install prerequisites (one-time)

- **VS Code**: https://code.visualstudio.com/ — download and install if you
  don't already have it.
- **Python**: needed only to run the tiny local web server.
  - Windows: https://www.python.org/downloads/ — during install, tick
    "Add python.exe to PATH".
  - Mac: Python 3 is usually already installed. Check by opening Terminal
    and typing `python3 --version`.

## 2. Get the project folder into VS Code

1. Unzip the project folder you were given (`connie-site`) somewhere sensible,
   e.g. `Documents/connie-site`.
2. Open VS Code.
3. `File > Open Folder…` and select the `connie-site` folder.
   You should see `index.html`, `css/`, `js/`, `modules/` etc. in the
   Explorer panel on the left.

## 3. Install two helpful extensions (optional but recommended)

Open the Extensions panel (the four-squares icon on the left sidebar, or
`Ctrl+Shift+X` / `Cmd+Shift+X`), and search for:

- **Live Server** (by Ritwick Dey) — lets you right-click an HTML file and
  open it in a browser with auto-refresh on save. Handy while building.
- **Python** (by Microsoft) — not essential for a static site, but useful
  if you later add any Python tooling (e.g. an image-resizing script for
  sprites).

## 4. Run the site locally

**Option A — Live Server extension (easiest)**
1. Right-click `index.html` in the Explorer panel.
2. Choose "Open with Live Server".
3. Your browser opens automatically at something like
   `http://127.0.0.1:5500/index.html`, and it reloads whenever you save a
   file — good for fast iteration.

**Option B — Python's built-in server (no extension needed)**
1. Open a terminal inside VS Code: `` Terminal > New Terminal `` (or
   `` Ctrl+` ``).
2. Make sure you're in the project folder (the terminal should already be
   there if you opened the folder correctly), then run:
   ```
   python -m http.server 8000
   ```
   (On Mac, use `python3` instead of `python` if `python` isn't found.)
3. Open a browser and go to `http://localhost:8000`.
4. To stop the server later, click into the terminal and press `Ctrl+C`.

Either option works — Live Server is more convenient day-to-day since it
auto-refreshes; the Python server is the fallback that always works with
zero extra setup.

## 5. Try editing something

1. Open `modules/contingencies.html`.
2. Change `CONTINGENT_EVERY_N` near the bottom (currently `10`) to a
   different number, save the file, and refresh the browser — you should
   see the treat event fire on a different press count.
3. This confirms your local setup is working end-to-end before you start
   building further modules.

## 6. Where things live going forward

- New module → new `.html` file inside `modules/`, plus a new tile added to
  `index.html`'s module grid.
- Shared look-and-feel changes → `css/style.css`.
- Shared JS behaviour (treats counter, chime player, anything used by 2+
  modules) → `js/shared.js`.
- Sprite images, once you have them → `assets/sprites/`.

No build step, no `npm install`, nothing to compile — save a file, refresh
the browser, done.
