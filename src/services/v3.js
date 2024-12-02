const WebSocket = require("ws");

const { HEARTBEAT_MESSAGE } = require("../config");
const logger = require("../config/logger");

class WebSocketUtility {
  constructor(
    url,
    headers,
    payload,
    operation,
    reconnectInterval = 5000,
    heartbeatInterval = 87000,
    maxReconnectAttempts = 3
  ) {
    this.url = url;
    this.headers = headers;
    this.payload = payload;
    this.operation = operation;
    this.reconnectInterval = reconnectInterval;
    this.heartbeatInterval = heartbeatInterval;
    this.maxReconnectAttempts = maxReconnectAttempts;

    this.currentReconnectAttempts = 0;
    this.ws = null;
    this.heartbeatTimeout = null;
    this.isReconnecting = false;
  }

  connect() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) return;

    this.cleanup(); // Clean up before connecting
    this.ws = new WebSocket(this.url, { headers: this.headers });

    this.ws.on("open", () => {
      logger.info(`OPEN [${this.operation}] WEB_SOCKET CONNECTION`);
      this.isReconnecting = false;
      this.currentReconnectAttempts = 0;
      this.subscribe();
      this.startHeartbeat();
    });

    this.ws.on("message", (message) => {
      // SYNC TO DATABASE
      // logger.warn(`DATA [MARKET-DEPTH] [${this.payload.payload.argument}]`);
      logger.warn(`DATA [MARKET-DEPTH] [${this.operation}]`);
    });

    /**
     * When an error causes the connection to fail, you typically get the error event FIRST, then the close event
     * The close event will happen regardless of whether there was an error
     * You can get a close event without an error (clean shutdown)
     * You should handle reconnection logic in the onclose handler, not the error handler
     * Do cleanup and reconnection logic in the close handler
     * Remember that every connection termination will trigger a close event, whether it was due to an error or not
     */
    this.ws.on("error", (error) => {
      logger.error(`ERROR [${this.operation}] WEB_SOCKET CONNECTION`, error);
    });

    this.ws.on("close", () => {
      logger.warn(`CLOSED [${this.operation}] WEB_SOCKET CONNECTION`);
      if (!this.isReconnecting) this.scheduleReconnect();
    });
  }

  subscribe() {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(this.payload));
    }
  }

  startHeartbeat() {
    clearInterval(this.heartbeatTimeout);
    this.heartbeatTimeout = setInterval(() => {
      if (this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify(HEARTBEAT_MESSAGE));
        logger.info(`HEARTBEAT [${this.operation}]`);
      }
    }, this.heartbeatInterval);
  }

  scheduleReconnect() {
    if (this.currentReconnectAttempts >= this.maxReconnectAttempts) {
      logger.error(
        `MAX RECONNECT ATTEMPTS REACHED [${this.operation}] - ABORTING RECONNECT`
      );
      this.cleanup(); // Cleanup connection when max attempts are reached
      return;
    }

    this.isReconnecting = true; // Mark reconnection in progress
    this.currentReconnectAttempts++;
    const delay = Math.min(
      this.reconnectInterval * Math.pow(2, this.currentReconnectAttempts),
      30000
    );

    logger.info(
      `SCHEDULED RECONNECT [${this.operation}] - ATTEMPT ${this.currentReconnectAttempts} in ${delay}ms`
    );

    clearInterval(this.heartbeatTimeout);

    setTimeout(() => {
      this.isReconnecting = false; // Reset before attempting to reconnect
      this.connect();
    }, this.reconnectInterval);
  }

  cleanup() {
    if (this.ws) {
      this.ws.removeAllListeners();
      this.ws.close();
      this.ws = null;
    }
    console.log("FINAL CLEANUP");
    clearInterval(this.heartbeatTimeout);
  }
}

module.exports = WebSocketUtility;
