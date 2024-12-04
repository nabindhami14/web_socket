const WebSocket = require("ws");
const logger = require("./config/logger");

const PORT = 8080; 
const MESSAGE_INTERVAL = 15000; 

const wss = new WebSocket.Server({ port: PORT });

const clients = new Set();

wss.on("connection", (ws) => {
  logger.info("A client connected.");
  clients.add(ws);
  console.log(clients.size)

  // ws.send(JSON.stringify({ message: "Welcome to the mock server!" }));

  ws.on("message", (message) => {
    logger.info(`Received message: ${message}`);
    ws.send(JSON.stringify({ echo: message }));
  });

  ws.on("close", () => {
    logger.info("A client disconnected.");
    clients.delete(ws);
  });

  ws.on("error", (error) => {
    logger.error(`Error from a client: ${error.message}`);
    clients.delete(ws);
  });
});

setInterval(() => {
  const mockData = { timestamp: Date.now(), message: "Mock 10-second update" };

  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(mockData));
      logger.info(`Sent mock data to client: ${JSON.stringify(mockData)}`);
    }
  });
}, MESSAGE_INTERVAL);

logger.info(`WebSocket server started on port ${PORT}`);
