# Game template

Copy this folder:

```bash
cp -R games/_template games/my-game-id
```

1. Replace `index.html` with your game
2. Add the game to root `games.json` (`id` must match folder name)
3. Use **relative** asset paths only

```html
<link rel="stylesheet" href="./style.css" />
<script src="./game.js"></script>
```
