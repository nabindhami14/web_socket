```sh
SOCKET.ON("OPEN") event is triggered once the WebSocket connection has been successfully established.
This means that the client (your application) has successfully connected to the server, and they can now send and receive messages.
```

```js
socket.on("open", () => {
  console.log("WebSocket connection established");
  setupHeartbeat(); // Start sending heartbeats
});
```

> A message is logged to the console indicating that the connection has been established.  
> The `setupHeartbeat()` function is called, which starts sending heartbeat messages at specified intervals (90 seconds in this case).

```sh
SOCKET.ON("MESSAGE") event is triggered whenever a message is received from the server.
This can happen at any time after the connection is open and can occur multiple times as the server sends messages.
```

> When connectWebSocket() is called, a new WebSocket connection is attempted.  
> If the server accepts the connection, the socket.on("open") event is triggered. This is where you confirm the connection and start sending heartbeats.  
> While the connection is open, the server can send messages at any time. Whenever a message is received, the socket.on("message") event is triggered, allowing your application to respond to or log the received data.  
> If the WebSocket connection is closed (either by the client or the server), the socket.on("close") event is triggered. Here, you can log that the connection is closed and attempt to reconnect after a specified interval.  
> Any errors that occur during the WebSocket operation will trigger the socket.on("error") event, allowing you to handle errors gracefully.
