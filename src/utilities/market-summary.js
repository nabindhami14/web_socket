const WebSocketUtility = require("../services/v3");
const { URL, HEADERS, MARKET_SUMMARY_START_PAYLOAD } = require("../config");
const logger = require("../config/logger");

const MarketIsummaryWs = () => {
  const marketIsummaryWs = new WebSocketUtility(
    URL,
    HEADERS,
    MARKET_SUMMARY_START_PAYLOAD,
    "MARKET-SUMMARY"
  );

  marketIsummaryWs.connect();

  marketIsummaryWs.on("message", (message) => {
    // const data = JSON.parse(message);

    logger.info("MARKET-SUMMARY PAYLOAD");
  });
};

module.exports = MarketIsummaryWs;
