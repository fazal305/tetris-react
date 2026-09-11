# Tetris — React Arcade

A polished, offline-first Tetris built with React and Vite. The goal wasn't just "make Tetris work" — it's a demonstration of separating a real-time game simulation from React's rendering model, driving a `requestAnimationFrame` loop without fighting React's render cycle, and shipping a genuinely playable, accessible, persistent game.

## Live Demo

**[tetris-react-nine.vercel.app](https://tetris-react-nine.vercel.app)**

## Features

- Standard 10×20 playfield with all seven tetrominoes (I, O, T, S, Z, J, L)
- 7-bag randomizer (deterministic, seedable, no piece droughts)
- SRS-style rotation with wall kicks (JLSTZ and I kick tables)
- Hold piece (one swap per placement), next-piece queue (configurable length), ghost piece
- Soft drop / hard drop with scoring, lock delay with limited resets
- Line clearing with Single/Double/Triple/Tetris scoring, combo bonus, back-to-back Tetris multiplier, and perfect-clear bonus
- Levels with increasing gravity speed
- Explicit game state machine: `IDLE → PLAYING → PAUSED / LINE_CLEARING → GAME_OVER`
- Full keyboard controls (with DAS/ARR-style auto-repeat) and large touch controls for mobile
- Procedurally generated sound effects via the Web Audio API — no external audio files
- Persistent settings, statistics, and high scores (`localStorage`, with corruption-safe loading)
- Dark Arcade / Light Arcade themes via CSS custom properties
- `prefers-reduced-motion` support
- Unit-tested game engine (34 tests) covering movement, rotation, collision, scoring, the randomizer, and the state machine

## Tech Stack

- **React 19** + **Vite** — UI and build tooling
- **Vitest** + **jsdom** — engine and logic tests
- Plain CSS with CSS Modules and a centralized design-token system (no CSS framework, no UI kit)
- **Web Audio API** for sound — zero external audio assets
- `localStorage` for persistence — no backend

No animation library, state-management library, or UI kit was added. The game doesn't need them, and pulling one in would be dependency weight without payoff.

## Architecture

### Game engine vs. React

The core rule: **React never contains game logic.** Everything under `src/game/` is plain, framework-free JavaScript that could run in Node, a Web Worker, or a totally different UI:

```
src/game/
  constants.js    // board size, timing, scoring tables, gravity curve
  pieces.js       // tetromino shapes + rotation states
  rotations.js    // SRS wall-kick tables
  board.js        // board creation, locking, row detection/clearing
  collision.js    // bounds + overlap checks
  movement.js     // move / rotate / hard-drop resolution (uses collision)
  randomizer.js   // seeded 7-bag piece generator
  scoring.js      // line-clear score, combo, back-to-back, level curve
  engine.js       // the state machine that ties it all together
```

`engine.js` exposes pure functions — `moveActive(state, dCol, dRow)`, `rotateActive(state, dir)`, `hardDrop(state)`, `lockPiece(state)`, `resolveLineClear(state)`, `tickGravity(state, dt, gravityMs)` — each taking a state object and returning a **new** state object. Nothing here touches the DOM, `useState`, or a timer. This is what makes the engine unit-testable without rendering anything (see `src/game/__tests__/`).

### The game loop

Tetris needs a real-time loop, and `setInterval` is the wrong tool for it — it drifts, it doesn't sync with paint, and it can't adapt when the tab is throttled. `useGameLoop` (`src/hooks/useGameLoop.js`) instead:

- Keeps the authoritative engine state in a `useRef`, not `useState`. Reading/writing a ref never triggers a render.
- Runs a single `requestAnimationFrame` loop that computes real elapsed time (`dt`) between frames and calls `tickGravity(state, dt, gravityMs)` — gravity is driven by elapsed wall-clock time, not frame count, so speed is consistent regardless of frame rate.
- Only calls `setState` (committing a new snapshot) when the engine state actually changes — a soft-drop-held frame with no gravity trigger doesn't cause a re-render.
- Handles input (`moveLeft`, `rotateCW`, `hardDrop`, `hold`, …) as direct calls that read/write the ref and commit a new snapshot immediately — no need to wait for the next animation frame to feel responsive.

This keeps the simulation running at a stable rate independent of React's render scheduling, while React only re-renders when there's something new to paint.

### Why DOM/CSS Grid instead of Canvas for the board

A 10×20 board is 200 cells, and the update rate is bounded by gravity speed (50 ms at the fastest, i.e. 20 Hz) — not 60 fps of independent per-pixel motion. React re-rendering ≤200 `<div>`s at 20 Hz is well within budget, and it comes with free wins Canvas would have to reimplement by hand: CSS transitions/animations for piece pop-in and line-clear flashes, `prefers-reduced-motion` handled by the browser, and real DOM nodes for `aria-label`/screen readers. `GameBoard` is `React.memo`'d and recomputes its cell grid via `useMemo`, so it only re-renders when board/piece/ghost state actually changes. If this were a faster-paced, per-pixel game (e.g. free-falling particles, smooth interpolated motion), Canvas would be the right call — for grid-locked Tetris, it isn't necessary.

### Performance choices

- Simulation state lives in a ref; UI state (`score`, `level`, board snapshot for rendering) is only what's needed to paint.
- `GameHUD`, `HoldPiece`, `NextQueue`, `GameBoard`, `PiecePreview`, `Controls`, `TouchControls` are all `React.memo`'d — most of them receive stable-ish props and skip re-rendering when unrelated state (e.g. a HUD score tick) changes elsewhere.
- `useCallback` on every action handler passed down from `useGameLoop`/`useTouchControls`, so memoized children don't get invalidated by new function identities every render.
- No `React.memo` was applied blindly — components that always re-render with their parent (e.g. the small `StatBlock` inside `GameHUD`) were left alone; wrapping everything has a cost (prop comparison) that isn't free.

### React concepts on display

- **`useRef`** — the authoritative game-loop state, so 20+ updates/second don't equal 20+ renders/second.
- **`useState`** — UI-facing snapshots: the committed engine state, screen/settings/stats state.
- **`useEffect`** — the `requestAnimationFrame` loop lifecycle, the line-clear animation timer, theme/sound side effects reacting to settings changes.
- **`useMemo`** — `GameBoard`'s cell grid, recomputed only when board/piece/ghost actually change.
- **`useCallback`** — every action exposed by `useGameLoop`/`useGameSettings`/`useGameStatistics`, so identity stays stable across renders.
- **Custom hooks** — `useGameLoop`, `useKeyboardControls`, `useTouchControls`, `useGameSettings`, `useGameStatistics` each own one concern and are composed in `App.jsx`.
- **Component composition** — `App.jsx` is a thin router between screens (menu/settings/stats/high scores/how-to-play/play), delegating all rendering to focused, single-purpose components.
- **Derived state** — the ghost piece, the visible board grid, and level are all derived on read rather than stored redundantly.

## Controls

| Action | Keyboard | Touch |
|---|---|---|
| Move | ← → | ← / → buttons |
| Soft drop | ↓ (hold) | ↓ button (hold) |
| Hard drop | Space | DROP |
| Rotate clockwise | ↑ | ROTATE |
| Rotate counter-clockwise | Z | — |
| Hold | C | HOLD |
| Pause | P / Esc | Pause button |

Arrow-key auto-repeat uses a DAS (delayed auto-shift, 160 ms) + ARR (auto-repeat rate, 40 ms) model, matching modern Tetris guideline feel rather than relying on the OS's native key-repeat.

## Scoring

| Clear | Base score (× level) |
|---|---|
| Single | 100 |
| Double | 300 |
| Triple | 500 |
| Tetris | 800 |

- Back-to-back Tetrises: ×1.5 multiplier
- Combo: +50 × combo count × level per clear
- Perfect clear: 800–2000 depending on lines cleared
- Soft drop: +1 per cell, Hard drop: +2 per cell
- Level increases every 10 lines, up to level 20; gravity speed increases with level

All of this lives in `src/game/scoring.js` as pure, tested functions — tune the constants in `src/game/constants.js` if you want a different curve.

## Persistence

Settings, statistics, and high scores are stored in `localStorage` (see `src/services/storage.js`). Every read is wrapped so a corrupted or manually-edited value falls back to defaults instead of crashing the app. Nothing here requires a backend or an account.

## Accessibility

- All interactive elements are real `<button>`s with visible focus states
- The board is exposed via `role="img"` with a descriptive `aria-label` that updates with game state
- Settings toggles use `role="switch"` with `aria-checked`
- `prefers-reduced-motion` is respected both by a global CSS media query and an explicit in-app setting
- Color choices maintain contrast against both themes; game state is never conveyed by color alone (labels accompany every stat and overlay)

## Testing

```bash
npm test
```

34 tests across `src/game/__tests__/` cover piece rotation states, collision detection, movement/wall-kicks, board row detection and clearing, scoring math (including combo/back-to-back/perfect-clear), the 7-bag randomizer's fairness and determinism, and the engine's state machine (spawning, hold semantics, hard drop locking, line-clear resolution, game-over detection). The engine is tested directly — no rendering required — because it's plain JavaScript.

## Development

```bash
npm install
npm run dev       # start the dev server
npm test          # run the engine test suite
npm run build     # production build
npm run preview   # preview the production build locally
```

## Deployment

This is a static Vite build — `npm run build` produces `dist/`, deployable to any static host (Vercel, Netlify, GitHub Pages, etc.) with no server-side requirements. The game works fully offline after the initial load; nothing in the core game depends on a network request.

## Future improvements

- T-spin detection and scoring
- Marathon/Sprint/Ultra game modes
- Optional online leaderboard (would need explicit backend/API buy-in — deliberately out of scope for this offline-first build)
- Customizable key bindings UI (the DAS/ARR timing constants are already centralized in `constants.js` for easy tuning)
- PWA installability
