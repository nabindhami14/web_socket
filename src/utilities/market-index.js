const WebSocketUtility = require("../services/v3");
const { URL, HEADERS, MARKET_INDEX_START_PAYLOAD } = require("../config");
const logger = require("../config/logger");

const MarketIndexWS = () => {
  const marketIndexWS = new WebSocketUtility(
    URL,
    HEADERS,
    MARKET_INDEX_START_PAYLOAD,
    "MARKET-INDEX"
  );

  marketIndexWS.connect();

  marketIndexWS.on("message", () => {
    logger.info("MARKET-INDEX PAYLOAD");
  });
};

module.exports = MarketIndexWS;
