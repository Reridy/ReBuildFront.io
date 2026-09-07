# RE:BUILDFRONT — Product Quality Audit

Date: 2026-09-08

This document records the full-site/game quality pass that consolidated the prototype after rapid feature growth.

## Audit scope

Reviewed areas:

- site navigation and menu hierarchy,
- lobby and room-state behavior,
- room cap and AI-slot handling,
- desktop and mobile UX,
- localization,
- account/customization/settings flows,
- inventory and crafting,
- world/resource systems,
- building placement and destruction,
- player/AI death and revival,
- enemy wave behavior,
- minimap/chat/help/pause/result UI,
- browser runtime stability,
- server room/account/chat foundations,
- repository structure, documentation and CI.

## Major problems found and resolved

### 1. Multiple generations of runtime code

**Problem:** `app-v3.js`, `game-v5.js`, `game-v6.js`, `game-v9.js`, `data-v2.js`, `lobby-ai.js` and `lobby-ux.js` coexisted with newer code. This made it easy to fix the wrong file and allowed DOM patch layers to diverge from app state.

**Resolution:** one canonical `src/app.js`, one canonical `src/game.js`, one `src/data.js`. Superseded runtime and lobby-patch files were removed.

### 2. Lobby behavior was patched through MutationObserver helpers

**Problem:** AI controls, countdown and chat were appended after rendering. Earlier versions caused recursive DOM-update bugs and inconsistent room state.

**Resolution:** lobby AI, chat, room cap, leave confirmation and start countdown were integrated into application state/rendering.

### 3. Wave timer deleted surviving enemies

**Problem:** a wave could enter recovery when its timer reached zero and clear still-living enemies.

**Resolution:** surviving waves enter **Overtime**. Recovery begins after the active enemy group is actually cleared.

### 4. Repeated full DOM rebuilds inside the game loop

**Problem:** resource and squad interfaces were regenerated unnecessarily at frame rate.

**Resolution:** cached/signature-based UI refreshes now update expensive DOM sections only when their visible state changes.

### 5. Unsafe chat rendering

**Problem:** earlier game chat assembled user text directly into HTML strings.

**Resolution:** chat sender, target and body are escaped/sanitized before rendering. Server chat text also remains length-limited and cleaned.

### 6. Weak failure experience

**Problem:** an unexpected JavaScript exception could look like the entire website permanently froze.

**Resolution:** a global error boundary displays a localized recovery overlay and reload action for fatal client errors.

### 7. GUI accumulated prototype-only presentation

**Problem:** navigation, room browser, HUD and state hierarchy had grown feature-by-feature rather than as one interface.

**Resolution:** added a coherent quality layer for menu hierarchy, room cards/search/filtering, clearer HUD state, panel hierarchy, overlays, accessibility states and responsive behavior.

### 8. Building feedback was insufficient

**Problem:** players could understand a failed placement only after clicking.

**Resolution:** construction preview now communicates valid/invalid placement before committing. Entity occupancy, existing footprint and HEART clearance remain authoritative placement checks.

### 9. Building health clutter

**Problem:** always-visible HP information would overwhelm a dense fortress.

**Resolution:** building HP bars/numbers are displayed only after a structure has taken damage.

### 10. Logistics lacked a mid-game quality-of-life decision

**Problem:** carrying every resource from the edge of the map back to HEART could become repetitive rather than strategically interesting.

**Resolution:** Logistics research unlocks a forward Supply Depot so teams can invest resources to shorten hauling routes.

### 11. Repair progression was too passive

**Problem:** automatic global repair is strategically shallow.

**Resolution:** Field Repair is represented through a powered Repair Relay with a local repair radius, making generator and relay placement matter.

### 12. Minimap interaction was mostly passive

**Problem:** enlarged map view showed information but did little for coordination.

**Resolution:** minimap interaction now supports a waypoint/navigation marker and surveying upgrades can improve resource awareness.

### 13. Pause/result/onboarding were underdeveloped

**Problem:** the prototype lacked a strong interruption/recovery loop and could drop users into systems without context.

**Resolution:** pause state, automatic pause on tab/background transition, result/restart/lobby actions, contextual help and first-session field guidance were added.

### 14. Localization drift

**Problem:** data identifiers changed while old localization keys remained. Korean also used `준비 취소` for the not-ready state even though the intended label was `준비중`.

**Resolution:** localization was rebuilt around the canonical data model. English, Korean, Japanese and Chinese now include current resources, zones, buildings, items, research and new quality-pass UI. Korean not-ready state is explicitly tested as `준비중`.

### 15. Room/AI cap inconsistencies

**Problem:** client, local room state and server could diverge on human/AI capacity.

**Resolution:** shared client cap is 15 and server cap is 15. AI slots count toward total room capacity. The AI roster contains enough profiles for a one-human + fourteen-AI test room.

### 16. Server account/reward hardening

**Problem:** early account endpoints lacked basic request throttling/session expiry, and development ad rewards could be mistaken for production validation.

**Resolution:** basic authentication rate limiting, session expiry and production-safe reward behavior were added. Password storage remains salted `scrypt`.

## Quality automation added

`node scripts/smoke.mjs` verifies:

- canonical runtime files exist,
- superseded runtime files stay deleted,
- `index.html` references valid files,
- manifest validity,
- supported languages,
- literal and dynamic localization coverage,
- Korean `준비중` status,
- 15-player room cap consistency,
- minimum map/AI/building/research data,
- overtime/pause/waypoint product invariants,
- server AI-room support.

GitHub Actions runs syntax checks, this smoke test and server dependency installation on pull requests.

## Current product strengths after the pass

- Much lower risk of editing the wrong runtime file.
- Clearer menu/lobby hierarchy.
- Classless cooperation fits the intended sandbox direction better than fixed AI roles.
- Six-zone resource map creates exploration pressure.
- Carry/deposit logistics gives travel strategic value.
- Research affects fortress structure and logistics instead of only raw stats.
- Building damage and overtime make defenses more consequential.
- Mobile controls are treated as a real input layer.
- Error recovery, pause, onboarding and result states make the prototype feel less like a debug build.

## Deliberate production limitations

These are not presented as completed features:

1. **True online client synchronization:** GitHub Pages remains a static client. The Node/Socket.IO backend must be deployed and the browser game must be wired to it before claiming real 15-human online matches.
2. **Persistence infrastructure:** the server prototype uses a local JSON user store. A public service needs a real database, secure deployment, backups and operational controls.
3. **Full navigation/pathfinding:** local avoidance and structure breaching are enough for the prototype, but dense user-built mazes will eventually require stronger grid pathfinding/breach planning.
4. **Content scale:** only the `test` map is currently shipped. Additional maps, events and enemy families are content expansion rather than hidden unfinished UI.
5. **Production OAuth/ad providers:** Google/Discord and rewarded-ad validation require real provider credentials and deployment configuration.

These limitations are documented explicitly so the site does not claim capabilities it does not yet have.

## Canonical rule going forward

Do not solve a new feature by attaching another DOM watcher or versioned runtime file. Extend the canonical modules:

- `app.js` — site/menu/room/account UI state
- `game.js` — playable simulation and in-game UI
- `data.js` — item/crafting/map/room constants
- `config.js` — world/enemy/building/research tuning
- `i18n.js` — all supported-language presentation text
- `mobile-controls.js` — mobile input adaptation
- `server.js` — network/account authoritative foundation

Every substantial PR should pass the quality workflow before merging.
