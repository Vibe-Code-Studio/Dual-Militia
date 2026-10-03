import { SCENES, COLORS, NET } from '../../constants.js';
import { Button } from '../../shared/ui/Button.js';
import { WebSocketTransport } from '../../shared/net/WebSocketTransport.js';
import { MSG } from '../../shared/net/Protocol.js';
import { GameManager } from '../../core/GameManager.js';

export class DualLobbyScene extends Phaser.Scene {
  constructor() { super(SCENES.DUAL_LOBBY); }

  create() {
    const { width, height } = this.scale;
    this.add.text(width/2, 80, 'DUAL · LOBBY', {
      fontFamily: 'monospace', fontSize: '42px', color: '#fff', fontStyle: 'bold',
    }).setOrigin(0.5);

    this.status = this.add.text(width/2, height - 120, '', {
      fontFamily: 'monospace', fontSize: '18px', color: '#aaa',
    }).setOrigin(0.5);

    this.info = this.add.text(width/2, height - 140, '', {
      fontFamily: 'monospace', fontSize: '22px', color: '#f5c542',
    }).setOrigin(0.5);

    new Button(this, width/2, 220, 340, 70, 'CREAR SALA',  () => this.#create());
    new Button(this, width/2, 310, 340, 70, 'UNIRSE',      () => this.#joinPrompt());
    new Button(this, width/2, height - 60, 200, 50, 'VOLVER', () => this.scene.start(SCENES.MENU));

    // Prompt de código (input de texto nativo)
    this.input.keyboard?.on('keydown', (e) => {
      if (!this.codeInputActive) return;
      if (e.key === 'Backspace') this.codeText = this.codeText.slice(0, -1);
      else if (e.key === 'Enter' && this.codeText.length === 4) this.#join(this.codeText);
      else if (/^[a-zA-Z0-9]$/.test(e.key) && this.codeText.length < 4)
        this.codeText += e.key.toUpperCase();
      this.codeDisplay?.setText(this.codeText.padEnd(4, '_'));
    });
  }

  #serverURL() {
    // Mismo host que sirve el juego, puerto 8080 para el relay
    const host = window.location.hostname || 'localhost';
    return `ws://${host}:${NET.DEFAULT_PORT}`;
  }

  #connect(onReady) {
    const t = new WebSocketTransport();
    t.connect(this.#serverURL());
    t.onOpen(() => onReady(t));
    t.onMessage((msg) => this.#handle(msg, t));
    console.log('[lobby] WS cerrado');
    t.onClose(() => this.status.setText('Desconectado'));
    GameManager.transport = t;
  }

  #create() {
    this.status.setText('Creando sala...');
    this.#connect((t) => t.send({ t: MSG.CREATE }));
  }

  #joinPrompt() {
    this.codeInputActive = true;
    this.codeText = '';
    this.codeDisplay?.destroy();
    this.codeDisplay = this.add.text(this.scale.width/2, 420, '____', {
      fontFamily: 'monospace', fontSize: '48px', color: '#fff', fontStyle: 'bold',
    }).setOrigin(0.5);
    this.status.setText('Escribe el código (4 letras) y Enter');
  }

  #join(code) {
    this.status.setText('Conectando...');
    this.#connect((t) => t.send({ t: MSG.JOIN, code }));
  }

  #handle(msg, t) {
    console.log('[lobby] recv', msg);

    if (msg.t === MSG.CREATED) {
      GameManager.session.isHost = true;
      this.info.setText(`Código: ${msg.code}  ·  Esperando...`);
      this.status.setText('Eres el HOST');
    }
    if (msg.t === MSG.JOINED) {
      GameManager.session.isHost = false;
      this.info.setText(`Unido a ${msg.code}`);
    }
    if (msg.t === MSG.JOIN_ERROR) {
      this.status.setText(msg.reason === 'full' ? 'Sala llena (máx 4)' : 'Sala no existe');
    }
    if (msg.t === MSG.PEER_JOIN || msg.t === MSG.JOINED) {
      // Arrancamos el juego; el host espera 1+ guests
      this.time.delayedCall(300, () => this.scene.start(SCENES.DUAL));
    }
  }
}