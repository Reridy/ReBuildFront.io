# RE:BUILDFRONT

**Build the fortress. Hold the front. Rebuild after the fall.**

RE:BUILDFRONT is a browser-first cooperative sandbox defense game prototype. Players gather resources, construct a fortress, fight escalating invasions, and command AI teammates that fill empty co-op slots.

## Current playable prototype

- Top-down browser gameplay with no installation.
- WASD movement, mouse aiming/shooting and dash.
- Wood/stone resource gathering.
- Four construction types: wall, turret, trap and generator.
- Three AI teammates with distinct roles: Builder, Vanguard and Gatherer.
- Squad orders: follow, defend, gather and repair.
- Escalating enemy waves with runners, brutes, ranged enemies and bosses.
- Shared HEART objective and game-over state.
- Weapon, HEART and AI upgrades.
- Endless replay loop and score system.

## Play locally

The client is static. Serve the repository root with any local HTTP server, then open `index.html` through that server.

Examples:

```bash
python -m http.server 8080
```

or

```bash
npx serve .
```

Then visit the local address printed by the server.

## Controls

| Input | Action |
|---|---|
| WASD | Move |
| Mouse | Aim |
| Left click | Shoot / place selected building |
| Right click | Dismantle building |
| 1–4 | Select building |
| X | Cancel building selection |
| Space | Dash |

## Multiplayer server foundation

`server/` contains the first authoritative Socket.IO room-server foundation for the networked version.

```bash
cd server
npm install
npm start
```

The server currently demonstrates:
- 4-slot rooms.
- Human player joins.
- Automatic AI backfill.
- Input-intent messages instead of client-authoritative movement.
- Server tick/state broadcast structure.
- Squad orders.

The current browser prototype is intentionally local-first while the gameplay loop is validated. The next engineering milestone is wiring the client to the authoritative server and moving combat/build/resource simulation server-side.

## Game modes planned

- **Survival** — 1–4 humans with AI backfill versus escalating invasions.
- **Endless** — survival with infinite scaling.
- **Siege** — player factions construct bases and attack the opposing HEART.
- **Frontier War** — PvPvE with two player factions plus an independent hostile horde.
- **Fortress** — larger cooperative megabase defense.
- **Grand War** — large-team PvP with faction AI armies.

## Project structure

```text
.
├─ index.html
├─ styles.css
├─ src/
│  ├─ config.js
│  └─ game.js
├─ server/
│  ├─ package.json
│  └─ server.js
├─ docs/
│  └─ GAME_DESIGN.md
└─ .github/workflows/
   └─ pages.yml
```

## Design document

See [`docs/GAME_DESIGN.md`](docs/GAME_DESIGN.md) for the full gameplay vision, AI design, PvP/PvPvE architecture, progression, construction systems, anti-cheat principles and production roadmap.

## Development philosophy

The long-term vision is large, but development proceeds from a validated core loop:

**Explore → Gather → Build → Defend → Repair → Expand**

Every large feature should strengthen that loop rather than add complexity for its own sake.

## Status

Early playable prototype / pre-alpha.
