# YGN Arcade

A multi-game browser arcade, ready for **GitHub Pages**.

```
ygn-arcade/
├── index.html       # hub landing page
├── hub.css
├── hub.js
├── games.json       # catalog (add games here)
└── games/
    └── pagoda-patch/   # ခြံစောင့် — Plants vs Zombies style
        ├── index.html
        ├── game.js
        ├── audio.js
        └── style.css
```

## Local play

```bash
# from this folder
npx serve .
# open http://localhost:3000
```

> Open via a static server (not `file://`) so `games.json` can load.

## Deploy to GitHub Pages

1. Create a new GitHub repo (e.g. `ygn-arcade` or `username.github.io`).
2. Push this folder:

```bash
git init
git add .
git commit -m "Initial YGN Arcade hub + Pagoda Patch"
git branch -M main
git remote add origin https://github.com/YOUR_USER/YOUR_REPO.git
git push -u origin main
```

3. On GitHub: **Settings → Pages → Build and deployment**
   - Source: **Deploy from a branch**
   - Branch: `main` / `/ (root)` → Save

4. Site URL will be:
   - Project repo: `https://YOUR_USER.github.io/YOUR_REPO/`
   - User site repo (`username.github.io`): `https://YOUR_USER.github.io/`

5. Optional: set `"github"` in `games.json` to your repo URL so the hub nav links work.

### If the repo is NOT at domain root

Paths already use relative URLs (`./games/...`), so project Pages work without a base-href hack.

## Add a new game

1. Create a folder:

```bash
mkdir -p games/my-cool-game
# put index.html (+ css/js) inside — must be playable at that path
```

2. Register it in `games.json`:

```json
{
  "id": "my-cool-game",
  "title": "My Cool Game",
  "subtitle": "optional",
  "emoji": "🚀",
  "blurb": "One-line pitch.",
  "tags": ["action", "arcade"],
  "cover": "linear-gradient(135deg, #333, #666)",
  "badge": "New",
  "status": "live"
}
```

Use `"status": "coming-soon"` for teaser cards that don't link yet.

3. Commit & push — the hub picks it up automatically.

### Game checklist

- [ ] `games/<id>/index.html` is the entry point
- [ ] Assets use **relative** paths (`./style.css`, not `/style.css`)
- [ ] Works when opened under a subpath (`/games/<id>/`)
- [ ] Entry added to `games.json`

## E2E tests

The Playwright suite checks the hub, campaign navigation, portrait rotate gate,
landscape layout, touch planting, shooting, damage, sun collection, pause/resume,
shovel, mute, and responsive viewport bounds.

```bash
npm install
npm run install:browsers
npm run dev

# in another terminal
npm test
```

Tested landscape sizes include 568×320, 667×375, 740×360, 844×390,
and 1024×768. Generated screenshots are written to `e2e-shots/` and ignored by Git.

## Games

| ID | Title | Notes |
|----|--------|--------|
| `pagoda-patch` | Pagoda Patch (ခြံစောင့်) | PvZ-style campaign, Burmese theme |

## License

Add your preferred license. Game code is original; keep third-party assets' licenses if you add any.
