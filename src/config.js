module.exports = {
  URL: "ws://172.23.148.9/sani/websocket?memberCode=2",
  HEADERS: { Cookie: "XSRF-TOKEN=e2eb645a-c623-4ec3-aac8-e0066a9a095a" },
  HEARTBEAT_MESSAGE: {
    header: { channel: "@control", transaction: "opCode" },
    payload: { argument: "e2eb645a-c623-4ec3-aac8-e0066a9a095a" },
  },

  LIVEMARKET_START_PAYLOAD: {
    header: {
      channel: "@control",
      transaction: "start_top25securities",
    },
    payload: { argument: "undefined" },
  },
  LIVEMARKET_STOP_PAYLOAD: {
    header: {
      channel: "@control",
      transaction: "stop_top25securities",
    },
    payload: { argument: "undefined" },
  },

  MARKET_INDEX_START_PAYLOAD: {
    header: {
      channel: "@control",
      transaction: "start_index",
    },
    payload: {
      argument: "undefined",
    },
  },
  MARKET_INDEX_STOP_PAYLOAD: {
    header: {
      channel: "@control",
      transaction: "stop_index",
    },
    payload: {
      argument: "undefined",
    },
  },

  MARKET_DEPTH_START_PAYLOAD: (id) => ({
    header: { channel: "@control", transaction: "start_stockquote" },
    payload: { argument: id },
  }),
  MARKET_SUMMARY_START_PAYLOAD: {
    header: {
      channel: "@control",
      transaction: "start_marketSummary",
    },
    payload: {
      argument: "",
    },
  },
};
