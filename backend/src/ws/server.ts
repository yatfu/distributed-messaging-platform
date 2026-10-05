//types for Node http server and requests
import type { IncomingMessage, Server as HttpServer } from "node:http";
//Websocket is one browser connection, WebSocketServer is the manager for new connections
import WebSocket, { WebSocketServer, } from "ws";

const server = new WebSocketServer({ port: 3000 });
  // on user connection
server.on("connection", (socket) => {
  console.log("user connected to websocket server")
  server.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) { // if client connection is still open at this moment, prevents errors with disconnected users
      client.send("User connected to chatroom.");
    }
  })

  // event when user sends message to ws server
  socket.on("message", (message) => {
    const text = message.toString();
    console.log("Recieved: ", text);
    socket.send("message recieved from server :)");
    //broadcast to all other "clients"
    server.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) { // if client connection is still open at this moment, prevents errors with disconnected users
        client.send(text);
      }
    })
  })
})