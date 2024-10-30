const WebSocket = require("ws");
const config = require("./config");

const RECONNECT_INTERVAL = 5000;
const HEARTBEAT_INTERVAL = 100 * 1000;
let heartbeatInterval;

const connectWebSocket = () => {
  const socket = new WebSocket(config.URL, { headers: config.HEADERS ,},{});

  socket.on("message", (data) => {
    // HANDLE INCOMMING DATA
    console.log("Received data:", JSON.stringify(data));
  });

  socket.on("open", () => {
    console.log("WebSocket connection established");

    // Function to send a heartbeat
    const sendHeartbeat = () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(config.HEARTBEAT_MESSAGE));

        console.log("HEARTBEAT SENT");
      }
    };

    // Function to set up the heartbeat mechanism
    const setupHeartbeat = () => {
      // Clear any existing heartbeat interval
      clearInterval(heartbeatInterval);
      heartbeatInterval = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL);
    };

    setupHeartbeat();
  });

  socket.on("close", () => {
    console.log("WebSocket connection closed. Reconnecting...");

    clearInterval(heartbeatInterval); // Clear the heartbeat interval
    setTimeout(connectWebSocket, RECONNECT_INTERVAL);
  });

  socket.on("error", (error) => {});
};
connectWebSocket();
