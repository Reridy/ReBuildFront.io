# RE:BUILDFRONT

**Build the fortress. Hold the front. Rebuild after the fall.**

RE:BUILDFRONT is a browser-first cooperative sandbox defense prototype. Players explore a multi-zone map, gather and transport resources, craft equipment and structures, shape a fortress around HEART, and survive escalating invasions with human or autonomous AI squad members.

## Current playable build

- Browser-first desktop and mobile controls.
- Home, room browser, lobby, Customize, Account and Settings flows.
- English, Korean, Japanese and Chinese UI support with browser-language detection.
- QuickPlay/local demo rooms, room creation, room-code copy, host settings, readiness, lobby chat, AI slot filling and a cancellable 5-second start countdown.
- Current room cap: **15 total slots**, including AI.
- Dedicated **Solo Test** flow that starts as one human + three AI.
- Static GitHub Pages deployment clearly identifies itself as a local prototype instead of pretending a same-origin multiplayer backend is online.
- Character customization with drawing, stickers, up to 12 saved looks and active-look rendering on the player character. Image upload is only enabled when the external reward/backend service is actually connected.
- 36-slot inventory + 1–9 hotbar + armor slot.
- Minecraft-like cursor stack controls: full-stack left click, half-stack/right-click splitting, one-by-one right-click placement, Shift quick-move and double-click stack collection.
- Workbench recipe book with search, category filters, ingredient have/need indicators and Shift-click craft-many.
- Tiered swords, pickaxes and axes made from wood, stone, copper, iron and crystal, each with distinct damage, cooldown and gathering efficiency.
- Hammer-driven construction: structures are crafted into inventory items, selected from a compact build dock and consumed when placed.
- Workbench, Research Bench, Wall, Generator, Repair Relay and Supply Depot structures.
- Six map zones and ten raw resource types with zone-specific gathering.
- Gathered raw resources enter personal inventory and must be deposited at HEART or an unlocked Supply Depot before becoming team resources.
- Resource nodes do not respawn close to player structures.
- Multi-resource research tree split into Defense, Support, Logistics and Exploration branches.
- Autonomous AI that fights, gathers, carries/deposits resources, repairs damaged structures and can revive downed allies. AI does **not** yet autonomously design/place new fortifications.
- Player/AI down-and-revive loop funded by team resources.
- Enemy waves that target players/HEART, breach blocking structures and enter overtime until the active wave is actually cleared.
- Damaged-structure/enemy HP feedback, player HP, dash cooldown, wave/objective state and contextual interaction prompts.
- Expandable minimap with player/AI/enemy/building markers, research-gated resource surveying and user waypoints.
- Local in-game chat, `/w <player> <message>` whisper UI and overhead chat bubbles. Network chat synchronization requires the server connection described below.
- Pause/help/tutorial/result flows and automatic pause when the browser tab is hidden.
- Shared in-app modal/error-recovery UI; browser `alert()` / `confirm()` popups are intentionally not used.

## Controls

### Desktop

| Input | Action |
|---|---|
| WASD | Move |
| Mouse | Aim / choose build position |
| Left click | Attack / gather / place selected structure |
| Right click | Dismantle a structure while holding the Hammer |
| E | Context action: use nearby Workbench/Research Bench, revive, or deposit |
| I | Open/close inventory |
| F | Deposit carried raw resources when near HEART or a Supply Depot |
| 1–9 | Select hotbar slot |
| Space | Dash |
| Enter | Focus/send in-game chat |
| Esc | Close active game UI or pause |

### Mobile

Touch devices receive a virtual movement stick plus Action, Dash, Use, Bag and Chat controls. `Use` maps to the contextual **E** action, while `Bag` independently opens the inventory with **I**. Status and Squad panels can be opened as mobile drawers. Landscape is recommended, while portrait remains supported.

## Core progression

The current loop is:

**Explore → Gather → Carry → Deposit → Craft → Research → Build → Defend → Repair → Expand**

1. Gather region-specific drops with the appropriate tool.
2. Pick the drops up into personal inventory.
3. Return raw resources to HEART, or later a Supply Depot, to add them to team storage.
4. Place the starter Workbench with the Hammer.
5. Craft better tools, a Research Bench and structure items.
6. Place the Research Bench and invest team resources into progression.
7. Craft and place defenses/support structures before stronger waves arrive.

## Public Pages build vs server foundation

The public GitHub Pages build is a **static playable prototype**. It can run local/demo room state and AI matches, but it does not currently synchronize real remote players.

`server/` contains the Node.js + Socket.IO network/account foundation:

```bash
cd server
npm install
npm start
```

The server foundation includes:

- rooms with a hard cap of 15 total slots,
- human join/host/ready/config state,
- host-managed AI slots,
- room/global chat and private whisper delivery,
- 20 Hz movement-state foundation,
- signup/login with salted `scrypt` password hashes,
- session expiry and basic authentication rate limiting,
- preference/account deletion endpoints,
- development/production-aware reward-gate behavior.

To claim real online multiplayer, persistent accounts or server-authoritative gameplay, the server must be deployed and the browser runtime must be connected to it. Those capabilities are **not** presented as finished in the Pages build.

## Local client

Serve the repository root with any static HTTP server, for example:

```bash
python -m http.server 8080
```

or

```bash
npx serve .
```

## Canonical project structure

```text
.
├─ index.html
├─ manifest.webmanifest
├─ overhaul.css
├─ quality.css
├─ systems.css
├─ mobile.css
├─ src/
│  ├─ app.js              # menus, local rooms, account/customize/settings flow
│  ├─ game.js             # playable simulation and in-game UI
│  ├─ config.js           # world, zones, buildings, enemies, research tuning
│  ├─ data.js             # inventory, recipes, maps and room constants
│  ├─ i18n.js             # shared localization
│  ├─ mobile-controls.js  # mobile input adaptation
│  └─ error-boundary.js   # fatal client error recovery
├─ server/
│  └─ server.js
├─ scripts/
│  └─ smoke.mjs
└─ docs/
   ├─ GAME_DESIGN.md
   ├─ RESEARCH_SYSTEM.md
   └─ QUALITY_AUDIT.md
```

There is intentionally one canonical application runtime and one canonical game runtime. New features should extend those modules instead of introducing versioned runtime copies or MutationObserver patch layers.

## Quality gates

Pull requests run `.github/workflows/quality.yml`. The current smoke suite protects, among other things:

- required/canonical files and manifest references,
- supported languages and room cap,
- all 15 tiered tool recipes,
- Hammer/structure-item construction,
- Workbench search/category crafting,
- multi-resource research,
- cursor-stack inventory controls,
- HEART/Supply Depot deposit loop,
- player/AI down and revival,
- minimap/waypoints and local chat,
- active customization rendering,
- building-safe resource respawn,
- enemy structure breaching/overtime,
- static GitHub Pages backend behavior,
- separate mobile Use (**E**) and Bag (**I**) controls,
- server room/AI foundations.

See [`docs/GAME_DESIGN.md`](docs/GAME_DESIGN.md) and [`docs/QUALITY_AUDIT.md`](docs/QUALITY_AUDIT.md) for design and audit notes.
