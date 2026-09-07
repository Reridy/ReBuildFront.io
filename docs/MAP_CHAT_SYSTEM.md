# RE:BUILDFRONT — Map, Resource & Chat System

## 1. Map structure

The world is split into coordinate-driven zones. The zone definition is the single source of truth for rendering, resource spawning, the current-zone HUD, and the minimap.

### Current zones

| Zone | Primary resources | Gameplay purpose |
| --- | --- | --- |
| Greenwood | Wood, Fiber | Early construction and basic exploration |
| Stonefall Quarry | Stone, Iron | Fortification and advanced mechanical structures |
| Crystal Reach | Crystal, Quartz | Research economy and rare materials |
| Verdant Mire | Herb, Resin | Future healing, consumables and organic modules |
| Heartlands | Wood, Stone | Balanced central safe area around HEART |
| Old Scrapyard | Scrap, Copper | Power systems and future automation |

The intent is to force movement. A team that remains only around HEART can survive early waves, but cannot efficiently acquire every material needed for advanced technology.

## 2. Resource model

Resources now use a shared inventory model rather than hard-coded Wood/Stone/Crystal fields.

Current resources:
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

Each resource node has a main drop and an optional secondary drop. This allows regions to have a clear identity while still giving players occasional bonus materials.

Players can gather directly with `F` when close to a resource node. Sword attacks can also damage resource nodes. AI players use the same nodes and resource inventory.

## 3. Collision model

Dynamic actors use circle collision.

Collision groups:
- Human player ↔ AI player
- Player ↔ monster
- Monster ↔ monster
- Player ↔ wall

Actors cannot pass through one another. AI movement attempts a local side-step when its direct route is blocked.

This is intentionally important for combat: players can physically hold narrow positions, monsters form crowds at choke points, and teammates cannot simply phase through one another.

## 4. Chat model

Messages use one normalized shape:

```text
{
  type: global | whisper | system,
  sender,
  target?,
  text,
  audience
}
```

### Global chat

Press `Enter`, type a message, and press `Enter` again.

Global messages:
- appear in the chat panel
- appear as an overhead bubble on the sender
- are visible to the whole room

### Whisper

Syntax:

```text
/w <playerName> <message>
```

Example:

```text
/w MIKA repair the east wall
```

Whispers:
- are only delivered to the sender and target
- use a purple chat-row background
- use a purple overhead bubble
- are never broadcast to the entire room by the Socket.IO server

The server resolves whisper recipients by player name and emits the message only to the sender socket and target socket.

## 5. Multiplayer integration direction

The static browser build currently owns the local gameplay simulation, while `server/server.js` provides the room/chat protocol foundation. When the client is fully wired to Socket.IO, the existing local message model can be reused without redesigning the UI.

Future server-authoritative work should move these systems server-side:
- authoritative player/monster collision
- zone resource node state
- shared inventory/resource ownership rules
- building placement reservations
- chat rate limiting and moderation hooks
- reconnect-safe player identity
