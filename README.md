# RE:BUILDFRONT

**Build the fortress. Hold the front. Rebuild after the fall.**

RE:BUILDFRONT is a browser-first cooperative sandbox defense game. Players explore a multi-zone map, gather and transport resources, construct a fortress around HEART, survive escalating invasions, and cooperate with human or AI players.

## Current playable build

- Browser-first desktop and mobile controls.
- Main menu with Play, Account, Customize and Settings.
- English, Korean, Japanese and Chinese localization with browser-language detection.
- Room browser, QuickPlay, room creation, host controls, readiness, lobby chat, AI slot filling and a 5-second start countdown.
- Current room cap: **15 total players**, including AI.
- Guest play plus account-server foundation for signup/login/preferences/delete-account.
- Character customization with drawing, stickers, templates and image-upload reward gate.
- 36-slot inventory, 1–9 hotbar, one armor slot and 2×2 / 3×3 / 4×4 crafting tiers.
- Six map zones and ten resource types with zone-specific gathering.
- Gathered resources drop into the world, enter personal inventory, and must be deposited at HEART or an unlocked forward depot.
- Classless squad design: human and AI players share the same basic rules and choose responsibilities dynamically.
- Dynamic player/AI/enemy collision and building occupancy checks.
- Player and AI death with resource-funded revival.
- Walls, generators, repair relays, depots, workbenches and grand workbenches.
- Building damage and HP indicators that appear only when damaged.
- Research for stronger walls, HEART protection, power, repair, logistics, rescue support and resource surveying.
- Enemy waves that attack HEART, engage players, break blocking structures and enter overtime instead of disappearing when the timer expires.
- Pause flow, result screen, score, wave tracking, tutorials, minimap expansion and map waypoints.
- Global chat, whisper syntax (`/w <player> <message>`) and overhead chat bubbles.
- Mobile virtual movement stick and touch actions.
- Runtime error boundary instead of a permanently frozen screen on unexpected client errors.

## Controls

### Desktop

| Input | Action |
|---|---|
| WASD | Move |
| Mouse | Aim / select world position |
| Left click | Context action / gather / interact / build |
| F | Gather or deposit nearby resources |
| 1–9 | Select hotbar slot |
| E | Open/close inventory |
| Space | Dash |
| Enter | Focus chat |
| Esc | Pause / close active overlay |

### Mobile

Touch devices receive a virtual movement stick, action, dash, use, inventory and chat controls. BUILD and SQUAD panels can be opened as mobile drawers. Landscape orientation is recommended but portrait remains supported.

## Local client

The static client can be served from the repository root:

```bash
python -m http.server 8080
```

or

```bash
npx serve .
```

Open the address printed by the server.

## Multiplayer/account server foundation

`server/` contains the Node.js + Socket.IO service used as the network foundation.

```bash
cd server
npm install
npm start
```

Server-side capabilities currently include:

- Rooms with a hard cap of 15 total slots.
- Human joins, host transfer, ready state and room configuration.
- Host-managed AI slots.
- Room/global chat and private whisper delivery.
- 20 Hz movement state foundation.
- Signup/login with salted `scrypt` password hashes.
- Session expiry and basic authentication rate limiting.
- Account preference storage and account deletion.
- Production-safe ad-reward gating behavior when no provider is configured.

The public GitHub Pages build is static, so true online rooms, persistent accounts and server-authoritative simulation require deploying `server/` separately and connecting the client to that deployment.

## Canonical project structure

```text
.
├─ index.html
├─ manifest.webmanifest
├─ overhaul.css
├─ quality.css
├─ mobile.css
├─ src/
│  ├─ app.js              # menus, rooms, account/customize/settings flow
│  ├─ game.js             # playable game runtime
│  ├─ config.js           # world, zones, buildings, enemies, research
│  ├─ data.js             # inventory, crafting, maps, room constants
│  ├─ i18n.js             # localization
│  ├─ mobile-controls.js  # mobile input layer
│  └─ error-boundary.js   # fatal client error recovery UI
├─ server/
│  └─ server.js
├─ scripts/
│  └─ smoke.mjs
└─ docs/
   ├─ GAME_DESIGN.md
   ├─ RESEARCH_SYSTEM.md
   └─ QUALITY_AUDIT.md
```

There is intentionally only one canonical app runtime (`src/app.js`) and one canonical game runtime (`src/game.js`). Versioned legacy runtimes and DOM-patch lobby scripts were removed during the product-wide quality pass.

## Quality gates

Pull requests run `.github/workflows/quality.yml`, which checks:

- JavaScript syntax for browser/server/smoke-test modules.
- Product smoke invariants and referenced-file existence.
- Localization coverage for literal UI keys used by the canonical runtime.
- 15-player cap consistency.
- Required map/AI/building/research data.
- Server dependency installation.

## Design direction

The core loop is:

**Explore → Gather → Carry → Deposit → Craft → Build → Defend → Repair → Expand**

The design favors creative fortification, logistics and teamwork rather than fixed player classes. Empty room slots may be filled by autonomous AI, but skilled human cooperation should remain the strongest option.

See [`docs/GAME_DESIGN.md`](docs/GAME_DESIGN.md) and [`docs/QUALITY_AUDIT.md`](docs/QUALITY_AUDIT.md).

## Status

Playable pre-alpha. The local/static game is substantially feature-complete for prototype validation; the largest remaining production milestone is deploying and wiring the authoritative online backend for true multi-user synchronization.
