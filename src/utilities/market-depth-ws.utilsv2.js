const WebSocket = require("ws");

const MARKET_UTILS = require("@capital-market/svc-utils/utils/market.utils");
const REDIS_UTILS = require("@capital-market/svc-utils/utils/redis.utils");
const WS_SYNC_CLIENT = require("pull-svc/clients/client.sync-websocket");

const CONFIG = require("../config");

class MarketDepthWSUtil {
  constructor(
    start,
    url,
    headers,
    payload,
    operation,
    reconnectInterval = 10000,
    heartbeatInterval = 87000,
    maxReconnectAttempts = 180
  ) {
    this.start = start;
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

    this.cleanup(false); // GENERAL CLEANUP
    this.ws = new WebSocket(this.url, { headers: this.headers });

    this.ws.on("open", () => {
      this.isReconnecting = false;
      this.currentReconnectAttempts = 0;

      if (this.start && MARKET_UTILS.isWSOpenTime) {
        this.subscribe();
        this.startHeartbeat();
      }
    });

    this.ws.on("message", async (message) => {
      try {
        const parsedData = JSON.parse(message);

        if (Array.isArray(parsedData) && parsedData.length > 0) {
          await SYNC_DATA(parsedData[0].payload.data);
        }
      } catch (error) {
        console.error(
          `ERROR [${this.operation}] [${this.payload.payload.argument}] FAILED TO SYNC`
        );
      }
    });

    /**
     * When an error causes the connection to fail, you typically get the error event FIRST, then the close event
     * The close event will happen regardless of whether there was an error
     * You can get a close event without an error (clean shutdown)
     * You should handle reconnection logic in the onclose handler, not the error handler
     * Do cleanup and reconnection logic in the close handler
     * Remember that every connection termination will trigger a close event, whether it was due to an error or not
     */
    this.ws.on("error", () => {
      // console.log(
      //   `ERROR [${this.operation}] [${this.payload.payload.argument}] CONNECTION`
      // );
    });

    this.ws.on("close", (code, reason) => {
      if (MARKET_UTILS.isWSOpenTime && !this.isReconnecting) {
        this.scheduleReconnect();
      } else {
        console.log(
          `CLOSED [${this.operation}] [${this.payload.payload.argument}] CONNECTION ${code}:${reason}`
        );
      }
    });

    if (
      !this.start &&
      this.heartbeatTimeout &&
      this.ws.readyState === WebSocket.OPEN
    ) {
      clearInterval(this.heartbeatTimeout);
      this.heartbeatTimeout = null;

      this.ws.close(1000, "");
    }
  }

  subscribe() {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(this.payload));
    }
  }

  startHeartbeat() {
    this.heartbeatTimeout = setInterval(() => {
      if (this.ws.readyState === WebSocket.OPEN && MARKET_UTILS.isWSOpenTime) {
        this.ws.send(JSON.stringify(CONFIG.HEARTBEAT_MESSAGE));
      }
    }, this.heartbeatInterval);
  }

  scheduleReconnect() {
    if (this.currentReconnectAttempts >= this.maxReconnectAttempts) {
      console.log(
        `MAX RECONNECT ATTEMPTS REACHED [${this.operation}] [${this.payload.payload.argument}]`
      );
      this.cleanup(true); // FULL CLEANUP
      return;
    }

    this.isReconnecting = true;
    this.currentReconnectAttempts++;
    // const delay = Math.min(
    //   this.reconnectInterval * Math.pow(2, this.currentReconnectAttempts),
    //   20000
    // );

    console.log(
      `SCHEDULED RECONNECT [${this.operation}] [${this.payload.payload.argument}] ATTEMPT ${this.currentReconnectAttempts}`
    );

    clearInterval(this.heartbeatTimeout);

    setTimeout(() => {
      this.isReconnecting = false;
      this.connect();
    }, this.reconnectInterval);
  }

  async cleanup(fullCleanup = false) {
    if (this.ws) {
      this.ws.removeAllListeners();
      this.ws.close();
      this.ws = null;

      if (fullCleanup) {
        try {
          await REDIS_UTILS.removeFromSet(
            CONFIG.MARKET_DEPTH_KEY,
            this.payload.payload.argument
          );
          console.log(
            `CLEANUP [${this.operation}] [${this.payload.payload.argument}] STOPPED LISTENING`
          );
        } catch (error) {
          console.error(
            `ERROR CLEANING UP REDIS  [${this.operation}] [${this.payload.payload.argument}]`,
            error
          );
        }
      }
    }
    clearInterval(this.heartbeatTimeout);
  }
}

async function SYNC_DATA(data) {
  try {
    await WS_SYNC_CLIENT.syncMarketDepth({ data });
  } catch (error) {
    console.error(`ERROR ${CONFIG.MARKET_DEPTH_KEY} FAILED TO SYNC `, error);
  }
}

module.exports = MarketDepthWSUtil;
