import { SCENES, COLORS, NET } from '../../constants.js';
import { MSG } from '../../shared/net/Protocol.js';
import { GameManager } from '../../core/GameManager.js';
import { DualPlayer } from './DualPlayer.js';

const TICK_HZ = 30;
const MOVE_ACCEL = 1400;
const MOVE_MAX = 320;
const DRAG = 900;

export class DualScene extends Phaser.Scene {
  constructor() { super(SCENES.DUAL); }

  create() {
    const { width, height } = this.scale;
    this.physics.world.setBounds(0, 0, width, height);

    // Piso/referencia visual
    this.add.rectangle(width/2, height/2, width, height, 0x111111).setDepth(-10);
    this.add.grid(width/2, height/2, width, height, 64, 64, 0x000000, 0, 0x222222, 0.5).setDepth(-9);

    const t = GameManager.transport;
    const isHost = !!GameManager.session.isHost;

    // Jugador local
    const myId = isHost ? 'host' : 'guest';
    const color = isHost ? COLORS.TEAM_A : COLORS.TEAM_B;
    this.me = new DualPlayer(this, width/2, height/2, color);
    this.me.id = myId;

    // Contenedor de jugadores remotos
    this.remotes = new Map(); // id → DualPlayer

    // Input
    this.#setupInput();
    this.#setupNetwork(t, isHost);

    // HUD ronda
    this.hud = this.add.text(20, 20, 'Ronda 1', {
      fontFamily: 'monospace', fontSize: '22px', color: '#fff',
    });

    // En host: broadcast de estado a 30 Hz
    if (isHost) {
      this.time.addEvent({
        delay: 1000 / TICK_HZ, loop: true,
        callback: () => this.#broadcastState(),
      });
    }

    // Guest: envía su input a 20 Hz
    if (!isHost) {
      this.time.addEvent({
        delay: 50, loop: true,
        callback: () => t.send({ t: MSG.INPUT, vx: this.me.body.velocity.x, vy: this.me.body.velocity.y }),
      });
    }
  }

  #setupInput() {
    const isTouch = this.sys.game.device.input.touch && !this.sys.game.device.os.desktop;
    this.inputState = { up: false, down: false, left: false, right: false };

    if (!isTouch) {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.input.keyboard.on('keydown-SPACE', () => this.#shoot());
    } else {
      // Tilt (DeviceOrientation)
      this.tilt = { beta: 0, gamma: 0 };
      window.addEventListener('deviceorientation', (e) => {
        this.tilt.beta  = e.beta  || 0;   // adelante/atrás
        this.tilt.gamma = e.gamma || 0;   // izq/der
      });
      // iOS 13+ requiere permiso
      const grant = () => {
        if (typeof DeviceOrientationEvent?.requestPermission === 'function')
          DeviceOrientationEvent.requestPermission();
        window.removeEventListener('touchend', grant);
      };
      window.addEventListener('touchend', grant, { once: true });

      // Tap mitad derecha = disparo
      this.input.on('pointerdown', (p) => {
        if (p.x > this.scale.width / 2) this.#shoot();
      });
    }
  }

  #setupNetwork(t, isHost) {
    t.onMessage((msg) => {
      if (isHost) this.#hostHandle(msg);
      else        this.#guestHandle(msg);
    });
    this._t = t;
    this._isHost = isHost;
  }

  // ---- HOST ----
  #hostHandle(msg) {
    if (msg.t === MSG.INPUT) {
      const p = this.#ensureRemote(msg.from);
      p.body.setVelocity(msg.vx, msg.vy);
    }
    if (msg.t === MSG.SHOOT) {
      const p = this.#ensureRemote(msg.from);
      this.#spawnProjectile(p, msg.angle);
    }
  }

  #broadcastState() {
    const players = [{ id: this.me.id, x: this.me.x, y: this.me.y }];
    for (const [id, p] of this.remotes) players.push({ id, x: p.x, y: p.y });
    this._t.send({ t: MSG.STATE, players });
  }

  // ---- GUEST ----
  #guestHandle(msg) {
    if (msg.t === MSG.STATE) {
      for (const s of msg.players) {
        if (s.id === this.me.id) continue;
        const p = this.#ensureRemote(s.id);
        p.setPosition(s.x, s.y);
      }
    }
    if (msg.t === MSG.SHOOT) {
      const p = s_id(msg) ? this.#ensureRemote(msg.id) : this.me;
      this.#spawnProjectile(p, msg.angle);
    }
  }

  #ensureRemote(id) {
    if (!this.remotes.has(id)) {
      const color = id === 'host' ? COLORS.TEAM_A : COLORS.TEAM_B;
      const p = new DualPlayer(this, this.scale.width/2, this.scale.height/2, color);
      p.id = id;
      this.remotes.set(id, p);
    }
    return this.remotes.get(id);
  }

  // ---- Disparo ----
  #shoot() {
    if (this._isHost) {
      this.#spawnProjectile(this.me, 0);
      this._t.send({ t: MSG.SHOOT, id: this.me.id, angle: 0 });
    } else {
      // guest solo notifica; el host lo replica
      this._t.send({ t: MSG.SHOOT, angle: 0 });
    }
  }

  #spawnProjectile(owner, angle) {
    const speed = 520;
    const rad = Phaser.Math.DegToRad(angle);
    const p = this.physics.add.image(owner.x + 30, owner.y, 'projectile')
      .setVelocity(Math.cos(rad) * speed, Math.sin(rad) * speed);
    p.setTint(owner.color || 0xffffff);

    // Estela
    this.time.addEvent({
      delay: 25, repeat: 20,
      callback: () => {
        if (!p.active) return;
        const ghost = this.add.rectangle(p.x, p.y, 8, 8, p.tintTopLeft, 0.5);
        this.tweens.add({
          targets: ghost, alpha: 0, scale: 0.4, duration: 260,
          onComplete: () => ghost.destroy(),
        });
      },
    });

    // Destruir al salir de pantalla
    p.body.onWorldBounds = true;
    this.physics.world.on('worldbounds', (body) => {
      if (body.gameObject === p) p.destroy();
    });
  }

  update(_time, dt) {
    const s = dt / 1000;
    const body = this.me.body;

    if (!this.sys.game.device.input.touch || this.sys.game.device.os.desktop) {
      const c = this.cursors;
      let ax = 0, ay = 0;
      if (c.left.isDown)  ax -= MOVE_ACCEL;
      if (c.right.isDown) ax += MOVE_ACCEL;
      if (c.up.isDown)    ay -= MOVE_ACCEL;
      if (c.down.isDown)  ay += MOVE_ACCEL;
      body.setAcceleration(ax, ay);
      body.setDrag(DRAG, DRAG);
      body.setMaxVelocity(MOVE_MAX, MOVE_MAX);
    } else {
      const dead = 3;
      const g = this.tilt.gamma, b = this.tilt.beta;
      let ax = Math.abs(g) > dead ? Phaser.Math.Clamp(g, -30, 30) * 45 : 0;
      let ay = Math.abs(b) > dead ? Phaser.Math.Clamp(b, -30, 30) * 45 : 0;
      body.setAcceleration(ax, ay);
      body.setDrag(DRAG, DRAG);
      body.setMaxVelocity(MOVE_MAX, MOVE_MAX);
    }
  }
}

function s_id(msg) { return msg && msg.id; }