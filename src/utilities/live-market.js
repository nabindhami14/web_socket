const WebSocketUtility = require("../services/v3");
const { URL, HEADERS, LIVEMARKET_START_PAYLOAD } = require("../config");
const logger = require("../config/logger");

const liveMarketWs = new WebSocketUtility(
  "http://localhost:8080",
  {"headers":121},
  "meropayload",
  "LIVE-MARKET"
);

const LiveMarketWS = () => {
  // const liveMarketWs = new WebSocketUtility(
  //   URL,
  //   HEADERS,
  //   LIVEMARKET_START_PAYLOAD,
  //   "LIVE-MARKET"
  // ); 


  liveMarketWs.connect();

  liveMarketWs.on("message", (message) => {
    // const data = JSON.parse(message);

    // console.log(data)
    logger.info("[LIVE-MARKET PAYLOAD]");
  });
};

module.exports = LiveMarketWS;
