WebSocket = require("ws");
const EventEmitter = require("events");

const { HEARTBEAT_MESSAGE } = require("../config");
const logger = require("../config/logger");

class WebSocketUtility extends EventEmitter {
  constructor(
    url,
    headers,
    payload,
    operation,
    reconnectInterval = 5000,
    // heartbeatInterval = 60000
    heartbeatInterval = 5000
  ) {
    super();
    this.url = url;
    this.headers = headers;
    this.payload = payload;
    this.operation = operation;
    this.reconnectInterval = reconnectInterval;
    this.heartbeatInterval = heartbeatInterval;
    this.ws = null;
    this.heartbeatTimeout = null;
  }

  connect() {
    this.ws = new WebSocket(this.url, { headers: this.headers });

    this.ws.on("open", () => {
      logger.info(`OPEN [${this.operation}] WEB_SOCKET CONNECTION`);

      this.subscribe();
      this.startHeartbeat();
    });

    this.ws.on("message", (message) => {
      this.emit("message", message);
    });

    this.ws.on("error", (error) => {
      logger.error(`ERROR [${this.operation}] WEB_SOCKET CONNECTION`, error);

      this.reconnect();
    });

    this.ws.on("close", () => {
      logger.warn(`CLOSED [${this.operation}] WEB_SOCKET CONNECTION`);

      this.reconnect();
    });
  }

  subscribe() {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(this.payload));
      logger.info(`SUCCESS [${this.operation}] WEB_SOCKET PAYLOAD`);
    }
  }

  startHeartbeat() {
    clearInterval(this.heartbeatTimeout);

    this.heartbeatTimeout = setInterval(() => {
      if (this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify(HEARTBEAT_MESSAGE));
        logger.info(`SUCCESS [${this.operation}] HEARTBEAT MESSAGE ${this.ws.readyState}`,);
      }
    }, this.heartbeatInterval);
  }

  reconnect() {
    clearInterval(this.heartbeatTimeout);
    logger.info("RECONNECT [${this.operation}] WEB_SOCKET RE-CONNECTION");
    setTimeout(() => this.connect(), this.reconnectInterval);
  }
}

module.exports = WebSocketUtility;