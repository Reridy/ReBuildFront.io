# RE:BUILDFRONT — Current Game Design

## High concept

RE:BUILDFRONT is a browser-first cooperative sandbox defense game built around a simple promise:

**Players create the battlefield, then survive inside it.**

The team explores a divided map, gathers and transports resources, crafts field equipment, constructs a fortress around HEART, and survives increasingly destructive invasions. Human and AI-controlled player slots follow the same core rules; there are no permanent classes.

## Core loop

**Explore → Gather → Carry → Deposit → Craft → Research → Build → Defend → Repair → Expand**

The important design difference is the **Carry** step. Harvested resources do not immediately become team currency. They enter personal inventory and must be returned to HEART or, after research, a forward depot. This creates meaningful logistics routes and risk outside the fortress.

## Session structure

A survival session cycles through:

1. **Preparation** — gather, craft, build and repair.
2. **Warning** — short invasion warning.
3. **Wave** — enemies assault HEART and players.
4. **Overtime** — if the normal wave timer ends while enemies remain, the invasion continues until the living wave is cleared.
5. **Recovery** — a shorter rebuilding window before the next warning.

Enemies are never deleted merely because a timer expired.

## HEART

HEART is the shared objective and team resource bank.

- Base HP: 1000.
- Destroyed HEART ends the run.
- Deposited resources are available for construction, research and revival.
- HEART Plating increases survivability.
- The immediate area around HEART is protected from construction to prevent accidental hard-locks.

## Players and AI

The current room cap is **15 total slots**, including AI.

AI players are not Builder/Vanguard/Gatherer classes. They are ordinary player slots controlled by autonomous logic. Depending on the situation they may:

- engage a nearby threat,
- gather resources,
- collect dropped resources,
- return resources to a deposit point,
- remain around the defensive area when no higher-priority task exists.

Human teams are encouraged to divide work dynamically—exploration, hauling, construction, repair, scouting and defense—without choosing permanent jobs.

## Death and revival

Human and AI players can reach 0 HP and enter a dead/down state.

- Dead players cannot move or interact normally.
- Revival consumes shared resources from the team bank.
- AI teammates can be revived from the squad UI.
- The local player receives a dedicated revival/result overlay.
- Revival is intentionally an economic decision, not an automatic timer.

## Enemy priorities

Strategic priority:

1. **HEART** — the primary objective.
2. **Human or AI players** — enemies engage players when they are a relevant immediate threat/contact.
3. **Blocking structures** — buildings are breached when they obstruct the route.

Enemies and players use physical collision, so narrow passages, body blocking and congestion matter.

## World and resources

The current `test` map is split into six regions:

| Zone | Main resources |
|---|---|
| Greenwood | Wood, Fiber |
| Stonefall Quarry | Stone, Iron |
| Crystal Reach | Crystal, Quartz |
| Verdant Mire | Herb, Resin |
| Heartlands | Wood, Stone |
| Old Scrapyard | Scrap, Copper |

Resource types:

- Wood
- Stone
- Fiber
- Iron
- Crystal
- Quartz
- Herb
- Resin
- Scrap
- Copper

The map is intentionally asymmetric so teams need to leave the safe center and establish transport routes.

## Inventory and crafting

- 36 inventory slots.
- Slots 1–9 double as the hotbar.
- One armor slot.
- Starting hotbar: field tool, survey tool, Builder Kit.
- Pocket crafting: 2×2.
- Workbench: 3×3.
- Grand Workbench: 4×4.

The crafting interface uses grid-based recipes as a familiar interaction pattern, but all names, assets, recipes and UI presentation are RE:BUILDFRONT-specific.

## Construction

Current fortress/support structures:

### Wall
Cheap 1×1 blocker. Core tool for shaping movement and buying time.

### Generator
2×2 power structure required for powered support infrastructure.

### Repair Relay
1×1 support structure. When powered, it repairs nearby damaged structures.

### Supply Depot
2×1 logistics structure unlocked through research. Allows resources to be deposited away from HEART and shortens hauling routes.

### Workbench / Grand Workbench
Crafted and physically placed production stations that unlock larger crafting grids nearby.

Construction rules:

- Exact grid-cell occupancy.
- Cannot overlap existing structures.
- Cannot be placed over living players, AI players or active monsters.
- Cannot be placed in HEART clearance.
- Placement preview communicates valid/invalid location.
- Damaged buildings show HP; full-health buildings do not add visual clutter.

## Research

Research uses banked Crystal and is centered on fortification, infrastructure and team resilience rather than fixed combat classes.

Current branches include:

- Reinforced Wall I / II
- Structural Fortification
- HEART Plating
- Power Grid
- Field Repair
- Logistics
- Rescue Protocol
- Resource Surveying

See `RESEARCH_SYSTEM.md` for exact intent.

## Interface principles

1. **The battlefield stays dominant.** Side information should not cover the arena unnecessarily.
2. **Only actionable damage is highlighted.** Full-health building HP bars remain hidden.
3. **State is visible.** Wave phase, timer/overtime, HEART HP, zone, dash cooldown and score remain in the primary HUD.
4. **Mobile is first-class.** Touch controls are a separate input layer rather than a shrunken desktop-only UI.
5. **Errors recover visibly.** Unexpected browser errors produce a recovery screen instead of appearing as a frozen site.
6. **Reduced motion and contrast options matter.** Accessibility preferences should change presentation without changing game rules.

## Chat

Game chat supports:

- global messages,
- overhead chat bubbles,
- `/w <player> <message>` whispers,
- distinct whisper styling.

Lobby chat is separate from in-match chat and is part of the room state/UI rather than a DOM patch layer.

## Room flow

- Browse open rooms.
- Search/filter rooms.
- QuickPlay.
- Optional same-language preference, default OFF.
- Create a room with name, description, map, difficulty and total slots.
- Hard cap: 15 total slots.
- Host may add/remove AI players within the room cap.
- Non-host human players ready up.
- Host starts only when human readiness conditions are satisfied.
- Start button performs a 5-second countdown before entering gameplay.
- Customization can be opened while keeping room state.
- Other room-leaving navigation asks for confirmation.

## Mobile

Mobile input includes:

- virtual movement stick,
- action button,
- dash,
- use/interact,
- inventory,
- chat,
- BUILD and SQUAD drawers,
- touch hotbar selection,
- minimap interaction.

Landscape is recommended for control space, but portrait mode remains available.

## Networking direction

The current static client is still local-first. `server/` is the authoritative multiplayer foundation and should ultimately own:

- room membership,
- AI slots,
- movement validation,
- health/damage,
- resources and inventory,
- construction and destruction,
- wave state,
- chat visibility,
- victory/defeat state.

The server already implements room/AI/chat/account primitives, but the GitHub Pages client is not yet a full synchronized multiplayer client. That is the next production architecture milestone rather than a hidden claim of current functionality.

## Monetization direction

No pay-to-win progression.

Suitable future monetization surfaces:

- character cosmetics,
- building themes,
- banners,
- emotes,
- HEART cosmetics,
- cosmetic template packs.

Rewarded ads may unlock optional convenience/cosmetic actions such as a customization image upload, but production rewards must be validated by a real ad provider.

## Production priorities after this prototype

1. Deploy authoritative server and connect the browser client.
2. Replace local obstacle avoidance with robust grid pathfinding/breach planning where needed.
3. Add additional maps with unique layouts and resource pressure.
4. Add persistence, moderation and analytics suitable for a public service.
5. Expand enemies, events, research side-grades and fortress modules without undermining readability.
