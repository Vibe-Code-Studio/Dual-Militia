import { SCENES } from '../../constants.js';
export class ArenaLobbyScene extends Phaser.Scene {
  constructor() { super(SCENES.ARENA_LOBBY); }
  create() {
    this.add.text(this.scale.width/2, this.scale.height/2, 'ARENA · Lobby (próximo paso)', {
      fontFamily: 'monospace', fontSize: '28px', color: '#fff',
    }).setOrigin(0.5);
    this.input.once('pointerdown', () => this.scene.start(SCENES.MENU));
  }
}