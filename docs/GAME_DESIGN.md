# RE:BUILDFRONT — Game Design Document

## 1. High concept
RE:BUILDFRONT is a browser-first cooperative sandbox defense game where players gather resources, build a fortress, command AI teammates, survive adaptive invasions, and later fight other player factions in PvP/PvPvE modes.

Core promise: **Build the fortress. Hold the front. Rebuild after the fall.**

## 2. Design pillars
1. **Player-built battlefields** — walls, chokepoints, traps, turrets, power networks and bridges change how combat plays.
2. **Cooperation without waiting** — every 4-player squad is filled with AI allies until real players join.
3. **Readable chaos** — attacks are dangerous and destructive, but players are given warnings and recovery windows.
4. **Short-session depth** — a satisfying run should work in roughly 20–35 minutes while supporting endless play.
5. **One simulation, many modes** — PvE, PvP and PvPvE share construction, combat, AI and resource systems.

## 3. Core PvE loop
Explore → Gather → Craft/Upgrade → Build → Threat Warning → Defend → Repair → Expand → Boss → Extract or Endless.

### Phase structure
- Preparation: 25–40 seconds early, shrinking later.
- Warning: 5–10 seconds, showing likely attack direction.
- Invasion: enemy wave until cleared or timer expires.
- Recovery: folded into the next preparation period.

## 4. The HEART
The HEART is the shared core and fail condition.
- Base HP: 1000.
- Upgradable maximum HP and utility.
- Higher tiers unlock tech but raise threat.
- If destroyed, the run ends.

Future HEART branches:
- Bastion: defense and shielding.
- Forge: crafting and automation.
- Beacon: scouting and map intelligence.
- Overdrive: high-risk combat bonuses.

## 5. Player
Default controls:
- WASD movement.
- Mouse aim.
- Left click attack/build.
- 1–4 construction hotkeys.
- Space dash.

Player combat is deliberately simple so attention can stay on base design and team coordination.

## 6. AI teammate backfill
A squad always targets four active slots.
- 1 human → 3 AI.
- 2 humans → 2 AI.
- 3 humans → 1 AI.
- 4 humans → no backfill.

A joining human inherits the bot slot conceptually. Server implementation should later transfer inventory, role context and location when safe.

Initial AI personalities:
- **MIKA / Builder** — repairs, reinforces and constructs standard defenses.
- **RON / Vanguard** — prioritizes enemies threatening players and the HEART.
- **EVE / Gatherer** — finds and harvests resource nodes.

Squad orders:
- Follow.
- Defend HEART.
- Gather resources.
- Prioritize repairs.

AI must be helpful but not optimal. Human creativity should remain the strongest strategic advantage.

## 7. Resources
Initial resources:
- Wood: fast construction and basic structures.
- Stone: durable defenses.
- Crystal: upgrades, advanced structures and high-value rewards.

Future resources:
- Alloy.
- Bio-resin.
- Rift fragments.

## 8. Construction
Initial buildables:
- Wall — cheap blocker.
- Turret — automated ranged defense.
- Trap — local damage zone.
- Generator — powers nearby defenses.

Future construction categories:
- Gates, ramps, bridges, bunkers, watchtowers.
- Repair stations and med bays.
- Barracks and AI unit production.
- Conveyors and automated harvesting.
- Sensors and radar.
- Shield projectors.

Design rule: every structure should affect pathing, combat, economy or information. Avoid decorative-only complexity in the first major release.

## 9. Power network
Advanced defenses become stronger inside generator range. Later versions should support:
- Limited generation capacity.
- Power priority.
- Grid sabotage.
- Emergency batteries.

This creates meaningful internal base layout instead of only exterior walls.

## 10. Enemy roster
- Grunt — standard attacker.
- Runner — fast pressure unit.
- Brute — wall breaker.
- Spitter — ranged attacker.
- Boss — major structure threat.

Future adaptive enemies:
- Climber — bypasses short walls.
- Digger — opens new breach routes.
- Flyer — ignores ground pathing.
- Saboteur — targets power and automation.
- Architect — alters or disables player-built paths.

## 11. Adaptive invasion director
The mature version should measure dominant player defense patterns and alter enemy composition.
Examples:
- Heavy wall stacking → more brutes.
- Long chokepoints → ranged or area attackers.
- Exposed power hubs → saboteurs.
- Tall/vertical defenses → climbers or flyers.

Goal: no single fortress layout remains permanently optimal.

## 12. Procedural world
Future maps are seed-based and combine:
- Forests.
- Ruins.
- Frozen regions.
- Mire.
- Ashlands.
- Rift zones.

Distance from HEART increases both risk and reward.

## 13. Progression
### In-run
- Weapon upgrades.
- HEART upgrades.
- AI training.
- Tech branches.
- Structure tiers.

### Account/meta
Prefer horizontal unlocks and cosmetics over raw power.
- Character skins.
- Fortress themes.
- Banners.
- Emotes.
- Blueprint slots.
- New side-grade technologies.

Do not create pay-to-win advantages.

## 14. Blueprint system
Players can save fortress sections and deploy them as translucent construction plans.
AI Builders can complete blueprints when resources are available.

Long-term community features:
- Public blueprint gallery.
- Ratings and favorites.
- Featured weekly builds.
- Creator attribution.

## 15. PvP — Siege
Recommended first PvP mode: 4v4 or 6v6.
Each faction owns a HEART and builds a fortress.
Neutral resource zones encourage contesting the middle of the map.
Win condition: destroy the opposing HEART.

Player kills create temporary advantage but do not directly win the match.

### AI in PvP
Two AI layers exist:
1. **Player-slot bots** filling missing humans.
2. **Faction units** produced and commanded by the team.

Faction units:
- Worker.
- Soldier.
- Ranger.
- Defender.
- Engineer.
- Raider.
- Heavy.
- Medic.

Players issue area orders instead of micro-managing every unit.

## 16. PvPvE — Frontier War
Two player factions compete while an independent hostile horde attacks both.
Strategic tension:
- Push the enemy too hard and your own fortress becomes exposed.
- Temporary cooperation may become rational during world bosses.
- Neutral objectives provide economic leverage.

## 17. Larger modes
- Fortress: 16-player cooperative megabase defense.
- Grand War: 12v12 faction warfare with AI armies.
- Endless: escalating PvE survival.
- Challenge Seeds: identical world seeds with weekly leaderboards.

## 18. Networking principles
The server must be authoritative for:
- Player position validation.
- Damage and health.
- Resource inventory.
- Building placement/destruction.
- AI decisions.
- Wave state.
- Score and victory state.

Clients send input intent, not final outcomes.
Target simulation rate: 20–30 Hz server tick with interpolated rendering on clients.

## 19. Anti-cheat baseline
- Clamp movement input.
- Server-side cooldowns.
- Server-side build cost checks.
- Server-side collision/path validation.
- Rate-limit commands.
- Never trust client-reported kills, currency or damage.

## 20. Visual direction
Browser-friendly low-poly/chunky tactical style.
Goals:
- Strong silhouettes.
- Clear faction colors.
- Minimal texture dependence.
- Good performance on integrated GPUs.
- Readable at small browser sizes.

The current prototype uses a top-down 2D presentation to validate gameplay before committing to a heavier 2.5D/3D renderer.

## 21. Audio direction
- Construction should feel tactile and fast.
- Wave warning should be immediately recognizable.
- HEART damage needs a distinct alarm layer.
- Music intensity rises with threat, not simply time.

## 22. Live-service expansion
Potential seasonal arcs:
- The Awakening — baseline enemies and ruins.
- Machine Age — automation and machine faction.
- Below — underground regions and diggers.
- Shattered Skies — aerial threats and vertical construction.

Every season should add a mechanic, not only cosmetics.

## 23. Monetization principles
If monetized, focus on cosmetics:
- Character skins.
- Building themes.
- HEART skins.
- Emotes.
- Banners.
- Victory effects.

Avoid selling combat stats, stronger AI, resource multipliers in competitive modes, or other pay-to-win advantages.

## 24. Prototype acceptance criteria
The first playable milestone is successful when a new player can:
1. Open the page with no install.
2. Move and aim immediately.
3. Harvest wood/stone.
4. Place at least four useful structures.
5. Understand the HEART objective.
6. See three AI allies perform distinct roles.
7. Survive multiple escalating waves.
8. Encounter a boss.
9. Upgrade combat/team/core capabilities.
10. Restart and try a different fortress layout.

## 25. Production roadmap
### Milestone A — Gameplay proof (current branch)
Top-down local PvE loop, AI allies, structures, waves and upgrades.

### Milestone B — Networked co-op
Authoritative server, room join, input replication, state interpolation, human/AI slot takeover.

### Milestone C — Deep construction
Grid/pathing, gates, power capacity, blueprints and structural destruction.

### Milestone D — Content
Biomes, procedural maps, more enemy families, bosses, events, progression.

### Milestone E — PvP/PvPvE
Siege, faction AI, neutral objectives, anti-cheat hardening and matchmaking.

### Milestone F — Release polish
Accounts, persistence, analytics, accessibility, onboarding, mobile/touch option, performance budgets, moderation and live operations.
