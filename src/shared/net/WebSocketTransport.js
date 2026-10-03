import { Transport } from './Transport.js';
import { encode, decode } from './Protocol.js';

export class WebSocketTransport extends Transport {
  constructor() {
    super();
    this.ws = null;
    this._onMsg = null;
    this._onOpen = null;
    this._onClose = null;
    this._queue = [];
  }

  connect(url) {
    this.ws = new WebSocket(url);
    this.ws.onopen = () => {
      for (const m of this._queue) this.ws.send(m);
      this._queue.length = 0;
      this._onOpen?.();
    };
    this.ws.onmessage = (e) => {
      const msg = decode(e.data);
      if (msg) this._onMsg?.(msg);
    };
    this.ws.onclose = () => this._onClose?.();
    this.ws.onerror = () => this._onClose?.();
  }

  send(obj) {
    const str = encode(obj);
    if (this.ws?.readyState === 1) this.ws.send(str);
    else this._queue.push(str);
  }

  onMessage(fn) { this._onMsg = fn; }
  onOpen(fn)    { this._onOpen = fn; }
  onClose(fn)   { this._onClose = fn; }
  close()       { this.ws?.close(); }
}