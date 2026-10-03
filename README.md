<div align="center">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset=".github/brand/banner-night.svg">
  <img alt="BitVoyager: Browser-based coding platform that teaches Bash and Python through story-driven terminal missions, built with React and xterm.js." src=".github/brand/banner-paper.svg" width="100%">
</picture>
<br><br>
<a href="#installation"><picture><source media="(prefers-color-scheme: dark)" srcset=".github/brand/tab-installation-night.svg"><img alt="installation" src=".github/brand/tab-installation-paper.svg"></picture></a>
<a href="#features"><picture><source media="(prefers-color-scheme: dark)" srcset=".github/brand/tab-features-night.svg"><img alt="features" src=".github/brand/tab-features-paper.svg"></picture></a>
<a href="#tech-stack"><picture><source media="(prefers-color-scheme: dark)" srcset=".github/brand/tab-tech-stack-night.svg"><img alt="tech stack" src=".github/brand/tab-tech-stack-paper.svg"></picture></a>
<a href="#adding-content"><picture><source media="(prefers-color-scheme: dark)" srcset=".github/brand/tab-adding-content-night.svg"><img alt="adding content" src=".github/brand/tab-adding-content-paper.svg"></picture></a>
<a href="#roadmap"><picture><source media="(prefers-color-scheme: dark)" srcset=".github/brand/tab-roadmap-night.svg"><img alt="roadmap" src=".github/brand/tab-roadmap-paper.svg"></picture></a>
<a href="#license"><picture><source media="(prefers-color-scheme: dark)" srcset=".github/brand/tab-license-night.svg"><img alt="license" src=".github/brand/tab-license-paper.svg"></picture></a>
</div>

<br>

BitVoyager is a browser-based coding platform that teaches Bash and Python through story-driven missions and a real terminal emulator. Complete levels, earn progress, and practice freely in the sandbox.

<p>
<a name="installation"></a>
<picture><source media="(prefers-color-scheme: dark)" srcset=".github/brand/section-installation-night.svg"><img alt="installation" src=".github/brand/section-installation-paper.svg" width="100%"></picture>
</p>

```bash
git clone https://github.com/NoamFav/BitVoyager
cd BitVoyager
npm install
npm run dev     # http://localhost:5173
```

```bash
npm run build   # Production build
```

<p>
<a name="features"></a>
<picture><source media="(prefers-color-scheme: dark)" srcset=".github/brand/section-features-night.svg"><img alt="features" src=".github/brand/section-features-paper.svg" width="100%"></picture>
</p>

- Real browser terminal via xterm.js and a custom JS shell
- Story-driven 20-level progression per language
- Adaptive task recommendations based on command history
- Sandbox playground for free exploration
- Supports Bash and Python shells

<p>
<a name="tech-stack"></a>
<picture><source media="(prefers-color-scheme: dark)" srcset=".github/brand/section-tech-stack-night.svg"><img alt="tech stack" src=".github/brand/section-tech-stack-paper.svg" width="100%"></picture>
</p>

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript |
| Styling | TailwindCSS |
| Terminal | xterm.js, custom jsh |
| State | Context API |
| Routing | React Router |
| Build | Vite |

<p>
<a name="adding-content"></a>
<picture><source media="(prefers-color-scheme: dark)" srcset=".github/brand/section-adding-content-night.svg"><img alt="adding content" src=".github/brand/section-adding-content-paper.svg" width="100%"></picture>
</p>

**New level** — add to `src/data/bash/levels.ts` and register it in `map.ts`.

**New task** — add to `src/data/bash/tasks.ts` with required commands, expected output, and minimum level.

<p>
<a name="roadmap"></a>
<picture><source media="(prefers-color-scheme: dark)" srcset=".github/brand/section-roadmap-night.svg"><img alt="roadmap" src=".github/brand/section-roadmap-paper.svg" width="100%"></picture>
</p>

- User auth to persist progress
- JavaScript, Rust, and Go language tracks
- Multiplayer coding challenges
- Mobile responsive layout

<p>
<a name="license"></a>
<picture><source media="(prefers-color-scheme: dark)" srcset=".github/brand/section-license-night.svg"><img alt="license" src=".github/brand/section-license-paper.svg" width="100%"></picture>
</p>

Apache 2.0 — see [LICENSE](LICENSE).

<div align="center">
Made with ❤️ by <a href="https://github.com/NoamFav">NoamFav</a>
</div>

<br>

<a href="https://nf-software.com">
<picture>
  <source media="(prefers-color-scheme: dark)" srcset=".github/brand/footer-night.svg">
  <img alt="NF Software" src=".github/brand/footer-paper.svg" width="100%">
</picture>
</a>
