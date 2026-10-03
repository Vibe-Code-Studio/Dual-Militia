export const GAME = {
  NAME: 'Dual Militia',
  VERSION: '0.1.0',
  WIDTH: 1280,
  HEIGHT: 720,
};

export const COLORS = {
  BG:         0x0d0d0d,
  PANEL:      0x1a1a1a,
  BTN:        0x2b6cb0,
  BTN_HOVER:  0x3182ce,
  BTN_TEXT:   '#ffffff',
  TEAM_A:     0x3fa9f5,   // azul
  TEAM_B:     0xf5533f,   // rojo
  STICKMAN:   0xe8e8e8,
  STICKMAN_2: 0x9aa0a6,
  ACCENT:     0xf5c542,
};

export const MODES = {
  DUAL:  'DUAL',
  ARENA: 'ARENA',
};

export const SCENES = {
  BOOT:         'BootScene',
  PRELOADER:    'PreloaderScene',
  MENU:         'MenuScene',
  DUAL_LOBBY:   'DualLobbyScene',
  DUAL:         'DualScene',
  ARENA_LOBBY:  'ArenaLobbyScene',
  ARENA:        'ArenaScene',
};

export const NET = {
  DEFAULT_PORT: 8080,
  TICK_HZ: 30, // <--- Aquí lo agregaste
  MSG: {
    JOIN:    'join',
    READY:   'ready',
    SHOOT:   'shoot',
    HIT:     'hit',
    STATE:   'state',
    REMATCH: 'rematch',
    ROUND:   'round',
  },
};