# 🚀 BitVoyager

<div align="center">

<img src="https://img.shields.io/badge/react-18+-61DAFB.svg?style=for-the-badge&logo=react" alt="React">
<img src="https://img.shields.io/badge/typescript-4.x-3178C6.svg?style=for-the-badge&logo=typescript" alt="TypeScript">
<img src="https://img.shields.io/badge/tailwind-3.x-38B2AC.svg?style=for-the-badge&logo=tailwind-css" alt="Tailwind">
<img src="https://img.shields.io/badge/license-MIT-green.svg?style=for-the-badge" alt="License">

**Learn programming languages through interactive terminal adventures**

[Installation](#installation) · [Features](#features) · [Adding Content](#adding-content)

</div>

---

BitVoyager is a browser-based coding platform that teaches Bash and Python through story-driven missions and a real terminal emulator. Complete levels, earn progress, and practice freely in the sandbox.

---

## Installation

```bash
git clone https://github.com/NoamFav/BitVoyager
cd BitVoyager
npm install
npm run dev     # http://localhost:5173
```

```bash
npm run build   # Production build
```

---

## Features

- Real browser terminal via xterm.js and a custom JS shell
- Story-driven 20-level progression per language
- Adaptive task recommendations based on command history
- Sandbox playground for free exploration
- Supports Bash and Python shells

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript |
| Styling | TailwindCSS |
| Terminal | xterm.js, custom jsh |
| State | Context API |
| Routing | React Router |
| Build | Vite |

---

## Adding Content

**New level** — add to `src/data/bash/levels.ts` and register it in `map.ts`.

**New task** — add to `src/data/bash/tasks.ts` with required commands, expected output, and minimum level.

---

## Roadmap

- User auth to persist progress
- JavaScript, Rust, and Go language tracks
- Multiplayer coding challenges
- Mobile responsive layout

---

## License

MIT — see [LICENSE](LICENSE).

---

<div align="center">
Made with ❤️ by <a href="https://github.com/NoamFav">NoamFav</a>
</div>
