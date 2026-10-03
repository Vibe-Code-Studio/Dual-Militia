import { gameConfig } from './gameConfig.js';
import { BootScene }        from './core/BootScene.js';
import { PreloaderScene }   from './core/PreloaderScene.js';
import { MenuScene }        from './core/MenuScene.js';
import { DualLobbyScene }   from './modes/dual/DualLobbyScene.js';
import { DualScene }        from './modes/dual/DualScene.js';
import { ArenaLobbyScene }  from './modes/arena/ArenaLobbyScene.js';
import { ArenaScene }       from './modes/arena/ArenaScene.js';

gameConfig.scene = [
  BootScene,
  PreloaderScene,
  MenuScene,
  DualLobbyScene,
  DualScene,
  ArenaLobbyScene,
  ArenaScene,
];

// Phaser está en window (cargado por <script> clásico)
window.addEventListener('load', () => {
  // eslint-disable-next-line no-undef
  window.__DM_GAME__ = new Phaser.Game(gameConfig);
});