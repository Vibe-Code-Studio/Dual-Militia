export const MSG = {
  // lobby (relay)
  CREATE:      'create',
  CREATED:     'created',
  JOIN:        'join',
  JOINED:      'joined',
  JOIN_ERROR:  'join_error',
  PEER_JOIN:   'peer_join',
  PEER_LEAVE:  'peer_leave',
  HOST_LEFT:   'host_left',

  // gameplay (host ↔ guests)
  INPUT:       'input',       // guest → host
  STATE:       'state',       // host → guests
  SHOOT:       'shoot',       // host → guests (evento puntual)
  HIT:         'hit',
  ROUND:       'round',
};

export const encode = (obj) => JSON.stringify(obj);
export const decode = (str) => { try { return JSON.parse(str); } catch { return null; } };