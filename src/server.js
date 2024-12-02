const express = require("express");

const LiveMarketWS = require("./utilities/live-market");
const MarketIndexWS = require("./utilities/market-index");
const MarketDepthWS = require("./utilities/market-depth");
const MarketIsummaryWs = require("./utilities/market-summary");

const logger = require("./config/logger");

const app = express();
const PORT = process.env.PORT || 3000;

MarketDepthWS();
// LiveMarketWS();
// MarketIndexWS();
// MarketIsummaryWs();

app.listen(PORT, () => {});
