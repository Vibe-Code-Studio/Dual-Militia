import { MODES } from '../constants.js';

/**
 * Estado global en memoria (nada persistente).
 * Guarda modo actual, config de partida, transporte de red activo, etc.
 */
class GameManagerImpl {
  constructor() {
    this.mode = null;              // MODES.DUAL | MODES.ARENA
    this.transport = null;         // Transport (WebSocket hoy, BT mañana)
    this.session = {
      teams: { A: [], B: [] },     // ids de jugadores
      round: 0,
      score: { A: 0, B: 0 },       // solo por ronda, no se guarda
    };
  }

  reset() {
    this.transport = null;
    this.session = {
      teams: { A: [], B: [] },
      round: 0,
      score: { A: 0, B: 0 },
    };
  }
}

export const GameManager = new GameManagerImpl();