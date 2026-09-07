# RE:BUILDFRONT — Product Quality Audit

Date: 2026-09-08

This audit records the product-wide recovery pass performed after the inventory/crafting overhaul. The goal was not to add isolated features, but to compare the current runtime against the intended game loop and remove regressions, misleading UI and prototype-only presentation.

## Audit scope

Reviewed:

- home/menu hierarchy and static-deployment behavior,
- room browser, solo test and lobby flow,
- host/AI/readiness/countdown state,
- account and backend-unavailable behavior,
- character customization and persistence,
- desktop/mobile input consistency,
- inventory, armor and cursor-stack interactions,
- gathering, hauling and team-resource economy,
- Workbench crafting and recipe discovery,
- Hammer construction and dismantling,
- Research Bench progression,
- player/AI damage, down and revival,
- autonomous AI priorities,
- enemy movement and structure breaching,
- wave/overtime/recovery behavior,
- world/resource readability,
- HUD, minimap, waypoint, chat, help and result flows,
- README/product claims,
- automated regression checks.

## High-severity regressions found

### 1. The carry/deposit economy had disappeared from the runtime

The design and README still described **Gather → Carry → Deposit**, but the post-overhaul game no longer had a functioning deposit path. That meant personal raw resources and team research/storage could become disconnected.

**Resolution**

- Restored HEART deposits.
- Restored Supply Depot as a forward deposit point.
- Added contextual `E` deposit and direct `F` deposit.
- AI now carries gathered raw resources and returns them to a deposit point.
- Crafting can use personal materials first and then team storage.
- Research uses team storage and once again asks for multiple resource types instead of only Crystal.

### 2. Actors could reach zero HP without a complete down/revive loop

The runtime had lost important death-state behavior even though documentation still claimed player/AI revival.

**Resolution**

- Player and AI enter a non-graphic down state at zero HP.
- Revive costs team Crystal/Herb/Iron.
- Rescue research improves revival economics.
- The player can revive nearby AI through context interaction.
- Autonomous support/vanguard AI can revive allies when resources allow.
- The downed player receives a self-revive/result decision UI.
- A squad wipe without a viable revive path ends the run cleanly.

### 3. Minimap, waypoint and in-game chat claims had drifted away from runtime

The quality documentation claimed an interactive minimap and chat, but recent rewrites had removed those elements from the actual game markup.

**Resolution**

- Restored minimap canvas and expanded view.
- Restored building/player/enemy markers.
- Survey research exposes resource locations on the minimap.
- Expanded-map clicks place a waypoint.
- Restored local game chat and `/w <player> <message>` whisper UI.
- Restored overhead player chat bubbles and system wave/recovery messages.

Network chat synchronization is still dependent on the server connection and is not claimed as complete in the static Pages build.

### 4. Customization existed in menus but no longer formed a complete product loop

Saving only replaced one active image; saved templates and image-upload behavior had regressed, and the active look was not reliably represented in the game.

**Resolution**

- Default avatar reset restored.
- Drawing/stickers retained.
- Up to 12 saved looks are stored locally.
- Saved looks can be selected again.
- Active customization renders on the player character.
- Image upload UI is present only when the reward/backend path can actually support it; static Pages does not fake an unlock.
- Invalid/oversized uploads are rejected.

### 5. GitHub Pages was probing a nonexistent same-origin backend

The static site repeatedly tried `/health`, which can make a static deployment look like a broken online service rather than an intentionally local prototype.

**Resolution**

- GitHub Pages does not assume a same-origin API.
- An explicit `window.REBUILDFRONT_API_BASE` or saved API base may be supplied when a real backend is deployed.
- Static UI labels itself as a local prototype.
- Account/cloud actions are disabled with an explanation instead of failing mysteriously.
- Real online multiplayer is still explicitly documented as unfinished.

### 6. Mobile Use and Bag were mapped to the same key

After Workbench/Research contextual interaction moved to `E`, both mobile `USE` and `BAG` sent `E`. Near a station, the Bag button could therefore open the station rather than inventory.

**Resolution**

- `USE` → `E` contextual action.
- `BAG` → `I` dedicated inventory action.
- The obsolete mobile `BUILD` drawer label was renamed to `STATUS`; building itself remains Hammer-driven.

### 7. Structure collision could stop an enemy without producing sensible breaching

The old obstacle check could detect walls too late/incorrectly relative to movement, leaving enemies stuck against player construction.

**Resolution**

- Movement probes the next position against structure rectangles.
- Player and AI use local side-step avoidance instead of phasing through structures.
- Enemies attack the blocking structure when their intended step is blocked.
- Brute/Boss types apply stronger breach pressure.

This is still lightweight local steering, not full grid A* pathfinding.

## Interaction and usability improvements

### Inventory

- 36 slots + 9-slot hotbar retained.
- Left click picks/places a full stack.
- Right click splits a stack or places one item.
- Shift-click quick-moves between hotbar and inventory.
- Double-click collects matching stacks up to the stack limit.
- Armor can now actually be equipped/swapped.
- Closing an inventory/station UI returns a held cursor stack to inventory first. Intentional outside-click dropping remains available.

### Crafting

- Workbench recipe-book search retained.
- Added category filters: materials, tools, combat, buildings, stations and armor.
- Recipes show current amount vs required amount per ingredient.
- Missing ingredients are visually highlighted.
- Shift-click crafts as many repetitions as current resources/inventory capacity allow.

### Building

- Hammer remains the only construction interface.
- Structure items must exist in inventory before appearing in the build dock.
- Multi-cell footprints are centered more naturally under the cursor.
- Grid and valid/invalid ghost appear only during building.
- Hammer right-click dismantles and returns the structure item when possible.
- Nearby resource nodes are cleared and respawn elsewhere; future resource respawns avoid structures.

### Research

- Research Bench remains required.
- Research nodes are grouped into Defense, Support, Logistics and Exploration branches.
- Costs use multiple resource families so exploration matters.
- Cost cards show banked/required amounts and highlight shortages.

## Autonomous AI improvements

AI remains fully autonomous; manual RTS orders were not reintroduced.

Current prototype AI can:

- fight nearby threats,
- gather resources,
- pick up drops,
- return carried raw resources to HEART/Supply Depot,
- spend available team Wood/Stone to repair damaged structures,
- revive downed allies when resources allow,
- return to HEART when no higher-priority task exists.

Internal role biases (vanguard/gatherer/builder/support) alter priorities, but they are not fixed player classes.

**Not yet implemented:** AI does not autonomously design/place new fortifications. That remains a future system rather than a claimed feature.

## Presentation improvements

The previous runtime was readable as a debug prototype but too many world objects were undifferentiated circles or raw internal identifiers.

This pass adds:

- different silhouettes for organic vs mineral resource nodes,
- resource icons and nearby labels,
- building icons and localized building names,
- damaged-only building HP bars,
- enemy icons and contextual HP bars,
- player HP HUD,
- AI activity text in the Squad panel,
- HEART visual emphasis,
- build-only grid visualization,
- waypoint marker,
- recipe/research shortage states,
- richer home feature cards and room metadata,
- saved-look gallery for Customize.

## Lobby/site improvements

- Added a clear Solo Test flow (one human + three AI).
- Restored same-language room filtering.
- Restored room-code copy.
- Restored editable room description.
- AI add/remove obeys total capacity.
- Changing room/AI state cancels an in-progress start countdown.
- Static demo rooms are identified as demo/local rather than real synchronized sessions.
- Home page now describes the actual Explore/Craft/Build/Research loop instead of behaving as a generic launcher.

## Quality automation strengthened

`node scripts/smoke.mjs` now checks that future PRs preserve key runtime invariants, including:

- canonical files and valid page references,
- four supported languages,
- 15-slot room cap and sufficient AI roster,
- all 15 sword/pickaxe/axe tier recipes,
- Hammer and structure-item construction data,
- building-safe resource respawn clearance,
- multi-resource research,
- shared in-app modal and no browser `alert()`/`confirm()`,
- static Pages backend detection behavior,
- room language filter/code copy,
- customization templates/upload state,
- inventory cursor/quick-move/double-click/return behavior,
- Workbench search/categories,
- Research Bench/branch UI,
- HEART/Supply Depot deposit functions,
- down/revive functions,
- enemy structure collision/breaching functions,
- minimap/chat/customization rendering,
- desktop `I` inventory and `F` deposit shortcuts,
- separate mobile `E` Use and `I` Bag mappings,
- server 15-slot and AI-room foundations.

## Deliberate limitations after this pass

These remain real limitations and should not be hidden behind UI claims:

1. **True online synchronization is not complete.** The Pages build is static. The Node/Socket.IO service must be deployed and connected, and gameplay state must become server-authoritative before real internet matches are claimed.
2. **AI building design is not complete.** AI gathers, deposits, fights, repairs and revives, but does not yet decide where to construct fortifications.
3. **Pathfinding is local steering/breaching, not full A*.** Dense player mazes can still expose navigation weaknesses.
4. **Only the `test` map is shipped.** Six resource regions exist inside it, but there is not yet a real multi-map content library.
5. **Persistent production accounts are not deployed.** The server foundation uses prototype storage and needs production database/ops work.
6. **OAuth and rewarded-ad providers require real credentials/services.** Static Pages deliberately does not pretend these are available.
7. **Audio is not yet a finished feedback layer.** Combat/gather/build clarity is currently visual.
8. **Touch inventory interactions are functional through browser pointer behavior, but a dedicated touch-native split/drag UX can still be improved later.**

## Canonical rule going forward

Do not solve future features with versioned runtime copies or DOM-patching observers. Extend the canonical modules:

- `src/app.js` — site/menu/room/account/customization/settings state
- `src/game.js` — playable simulation and in-game UI
- `src/data.js` — item/recipe/map/room constants
- `src/config.js` — world/enemy/building/research tuning
- `src/i18n.js` — shared presentation strings
- `src/mobile-controls.js` — touch input adaptation
- `server/server.js` — network/account foundation

Every substantial change must pass the quality workflow before merge, and documentation must describe the runtime that actually exists rather than the intended future version.
