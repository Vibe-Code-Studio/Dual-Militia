import { GAME, COLORS } from './constants.js';

export const gameConfig = {
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: COLORS.BG,

  // Resolución lógica fija; el canvas se escala al dispositivo.
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: GAME.WIDTH,
    height: GAME.HEIGHT,
  },

  // Físicas de Phaser (Arcade). Ajustamos gravedad por escena si hace falta.
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },     // DUAL: 0 | ARENA: se sobreescribe en su escena
      debug: false,
    },
  },

  input: {
    activePointers: 3,       // multitouch (joystick + disparo)
  },

  // Escenas se registran desde main.js
  scene: [],
};