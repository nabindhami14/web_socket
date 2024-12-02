const WebSocketUtility = require("../services/v3");

const { URL, HEADERS, MARKET_DEPTH_START_PAYLOAD } = require("../config");
const logger = require("../config/logger");

const MarketDepthWS = () => {
  const ids = [131,132,133,134,135];

  ids.forEach((id) => {
    const payload = MARKET_DEPTH_START_PAYLOAD(id);

    // const marketDepthWS = new WebSocketUtility(
    //   URL,
    //   HEADERS,
    //   payload,
    //   "MARKET-DEPTH"
    // );

    const marketDepthWS = new WebSocketUtility(
      "http://localhost:8080",
      { headers: 121 },
      "meropayload",
      "LIVE-MARKET"
    );

    marketDepthWS.connect();
  });
};

module.exports = MarketDepthWS;
