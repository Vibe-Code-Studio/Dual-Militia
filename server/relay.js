import { WebSocketServer } from 'ws';

const PORT = process.env.PORT || 8080;
const wss = new WebSocketServer({ port: PORT });

/** @type {Map<string, {host: WebSocket|null, peers: Set<WebSocket>}>} */
const rooms = new Map();

const makeCode = () => {
  const A = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let c = '';
  for (let i = 0; i < 4; i++) c += A[(Math.random() * A.length) | 0];
  return rooms.has(c) ? makeCode() : c;
};

const send = (ws, obj) => { if (ws?.readyState === 1) ws.send(JSON.stringify(obj)); };
const broadcast = (room, obj, except = null) => {
  for (const p of room.peers) if (p !== except) send(p, obj);
  if (room.host && room.host !== except) send(room.host, obj);
};

wss.on('connection', (ws) => {
  ws.roomCode = null;
  ws.isHost = false;

  ws.on('message', (raw) => {
    let msg;
    try { msg = JSON.parse(raw.toString()); } catch { return; }

    // --- Crear sala ---
    if (msg.t === 'create') {
      const code = makeCode();
      const room = { host: ws, peers: new Set() };
      rooms.set(code, room);
      ws.roomCode = code;
      ws.isHost = true;
      send(ws, { t: 'created', code });
      console.log(`[relay] sala ${code} creada`);
      return;
    }

    // --- Unirse ---
    if (msg.t === 'join') {
      const code = (msg.code || '').toUpperCase();
      const room = rooms.get(code);
      if (!room) return send(ws, { t: 'join_error', reason: 'not_found' });
      if (room.peers.size >= 3) return send(ws, { t: 'join_error', reason: 'full' });
      room.peers.add(ws);
      ws.roomCode = code;
      ws.isHost = false;
      send(ws, { t: 'joined', code });
      send(room.host, { t: 'peer_join', id: ws._id ?? (ws._id = Math.random().toString(36).slice(2, 8)) });
      console.log(`[relay] +1 en ${code} (${room.peers.size + 1}/4)`);
      return;
    }

    // --- Relay genérico dentro de la sala ---
    const room = rooms.get(ws.roomCode);
    if (!room) return;

    if (ws.isHost) broadcast(room, msg, ws);          // host → guests
    else          send(room.host, { ...msg, from: ws._id }); // guest → host
  });

  ws.on('close', () => {
    const room = rooms.get(ws.roomCode);
    if (!room) return;
    if (ws.isHost) {
      broadcast(room, { t: 'host_left' });
      rooms.delete(ws.roomCode);
      console.log(`[relay] sala ${ws.roomCode} cerrada`);
    } else {
      room.peers.delete(ws);
      send(room.host, { t: 'peer_leave', id: ws._id });
    }
  });
});

console.log(`Dual Militia relay en ws://0.0.0.0:${PORT}`);