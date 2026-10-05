//types for Node http server and requests
import type { Server as HttpServer } from "node:http";
//Websocket is one browser connection, WebSocketServer is the manager for new connections
import { WebSocketServer } from "ws";
import { addConnection, removeConnection, broadcastToRoom } from "./rooms.js";
import { pool } from "../db.js";
import { validateUuid } from "../lib/validate.js";

// upgrade http server to WS server
export function createWebSocketServer(httpServer: HttpServer): WebSocketServer {
  const webSocketServer = new WebSocketServer({
    server: httpServer,
    path: "/ws",
  });
  // on user connection
  webSocketServer.on("connection", async (socket, request) => {
    // extract params from url
    try {
      const url = new URL(request.url ?? "/", "http://localhost");
      const chatroomId = url.searchParams.get("chatroomId");
      //validate params
      const validChatroomId = validateUuid(chatroomId);
      //check to see if chatroom exists
      const result = await pool.query(
        `SELECT id FROM chatrooms 
          WHERE id = $1
          AND expires_at > NOW()`, [validChatroomId]
      );
      if (result.rowCount === 0) {
        socket.close(1008, "chatroom not found or expired");
        return;
      }
      //add connection to websocket manager
      addConnection(validChatroomId, socket);
      console.log("user connected");

      //on user disconnect
      socket.on("close", () => {
        removeConnection(validChatroomId, socket);
        console.log("User disconnected");
      });
    } catch {
      // close socket if error throws
      socket.close(1008, "invalid chatroom");
    }

    socket.on("error", (error) => {
      console.error("WebSocket error: ", error);
    });
  });

  return webSocketServer;
}
