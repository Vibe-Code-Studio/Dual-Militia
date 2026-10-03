export class Transport {
  connect(_url)      { throw new Error('not implemented'); }
  send(_obj)         { throw new Error('not implemented'); }
  onMessage(_fn)     { throw new Error('not implemented'); }
  onOpen(_fn)        { throw new Error('not implemented'); }
  onClose(_fn)       { throw new Error('not implemented'); }
  close()            { throw new Error('not implemented'); }
}