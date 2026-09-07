# RE:BUILDFRONT — Major Overhaul v1

## Implemented stages

### 1. Core gameplay fixes
- Construction rejects occupied slots, including live players, AI players and monsters.
- Human and AI players enter a real dead state at 0 HP instead of auto-regenerating.
- Revival uses banked team resources at HEART.
- Dead AI players can be revived from SQUAD without blocking the local player's screen.
- Structures have HP and only show their HP bar/value after taking damage.
- Mini-map is fixed to the upper-right and expands/collapses on click.

### 2. Language system
- Supported languages: English, Korean, Japanese, Simplified Chinese.
- Language is chosen from saved preference first, then browser language, otherwise English.
- Settings can change language at runtime.
- Menu/account/lobby/customization/settings/core game labels use the localization dictionary.
- New UI text should be added through `src/i18n.js` instead of hardcoding.

### 3. Accounts
- Login and sign-up UI are placed in the upper-right of the site.
- Guest sessions use temporary `User###` names and are not treated as persistent accounts.
- Node server provides signup/login/delete-account/preferences APIs.
- Passwords are stored as salted Node `scrypt` hashes, never plaintext.
- Server user data is excluded from Git.
- Google/Discord provider slots are reserved in the account model.

> Google and Discord OAuth require provider client IDs/secrets and callback URLs. Those credentials are not present in this repository, so provider handshakes are intentionally not faked.

### 4. Main menu and rooms
- Site opens to Play / Account / Customize / Settings.
- Play contains room browser, room creation, QuickPlay and same-language preference.
- Room creation supports name, description, map, difficulty and 1–15 players.
- Current map catalog contains `test`.
- Lobby supports host editing before start, ready state, host start button and all-ready gate.
- Server room model supports maximum 15 human players.
- QuickPlay prefers exact room language when the checkbox is enabled.

### 5. Customization
- Default character is a round face with two eyes.
- Free drawing canvas.
- Sticker placement.
- Multiple saved templates.
- Image upload flow is behind an ad-reward gate abstraction.

> `/api/ad/reward` currently returns a development reward when no ad provider is configured. A real production ad network must verify the completed impression before this endpoint grants the reward.

### 6. Settings
- Master volume.
- Language.
- Reduced-motion preference.
- Account shortcut.

### 7. Inventory
- 36-slot inventory.
- Slots 1–9 are the hotbar.
- Hotbar contents can be rearranged.
- E opens/closes the full inventory.
- Single armor slot.
- Starter hotbar uses Field Tool, Survey Pick and Builder Kit.
- Builder Kit replaces the old 1–4 construction hotkeys.

### 8. Resource carrying
- Resource nodes drop item entities into the world.
- Players and AI must physically pick drops up into inventory.
- Raw resources are not immediately counted as team resources.
- Carried raw resources must be brought to HEART and deposited.
- AI automatically returns/deposits carried resources when near HEART.

### 9. Crafting
- Personal inventory crafting: 2×2.
- Placed Workbench unlocks 3×3 when the player is nearby.
- Placed Grand Workbench unlocks 4×4 when nearby.
- Recipes are data-driven in `src/data-v2.js` and use original RE:BUILDFRONT item names/layouts rather than copying another game's art/assets.

Minecraft was used only as a high-level interaction reference. No Minecraft textures, icons, fonts, code, UI assets or branding are included.

### 10. Multiplayer/chat/server groundwork
- Global chat model.
- Whisper model using `/w <playerName> <message>`.
- Server whisper delivery is sender/recipient only.
- Room state contains host, members, ready state, language and configuration.
- 20 Hz authoritative movement scaffold remains available for later full multiplayer integration.

## Map/resource model
The current `test` map contains coordinate-based zones with different resource pools. Resources include Wood, Stone, Fiber, Iron, Crystal, Quartz, Herb, Resin, Scrap and Copper.

## Quality gate
`.github/workflows/quality.yml` runs:
- `node --check` across browser modules,
- `node --check server/server.js`,
- server dependency installation.

## Deployment note
GitHub Pages serves the static client only. Persistent accounts, real room state, server-side chat, OAuth and verified ad rewards require the Node server to be deployed separately and the client/API origin configured accordingly.
