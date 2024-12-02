const WebSocket = require('ws');
const { syncToDatabase } = require('./db'); // Import your database sync logic

class WebSocketUtility {
  constructor(url) {
    this.url = url;
    this.ws = null;
    this.pingInterval = null;
  }

  connect() {
    this.ws = new WebSocket(this.url);

    this.ws.on('open', () => {
      console.log('Connected to WebSocket server');
      this.subscribe();
      this.startPing();
    });

    this.ws.on('message', (message) => this.handleMessage(message));

    this.ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      this.reconnect();
    });

    this.ws.on('close', () => {
      console.log('WebSocket connection closed, attempting to reconnect...');
      this.reconnect();
    });
  }

  subscribe() {
    const subscriptionMessage = JSON.stringify({ action: 'subscribe', channel: 'yourChannel' });
    this.ws.send(subscriptionMessage);
  }

  handleMessage(message) {
    try {
      const data = JSON.parse(message);
      console.log('Received message:', data);

      // Sync to the database
      syncToDatabase(data)
        .then(() => console.log('Data synced to the database successfully'))
        .catch((error) => console.error('Failed to sync data to the database:', error));
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  }

  startPing() {
    this.pingInterval = setInterval(() => {
      if (this.ws.readyState === WebSocket.OPEN) {
        this.ws.ping();
        console.log('Sent ping message');
      }
    }, 60000); // 60 seconds
  }

  stopPing() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  reconnect() {
    this.stopPing();
    setTimeout(() => this.connect(), 5000); // Reconnect after 5 seconds
  }
}

module.exports = WebSocketUtility;
