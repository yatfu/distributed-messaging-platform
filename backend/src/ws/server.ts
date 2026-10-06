//types for Node http server and requests
import type { Server as HttpServer } from "node:http";
import type { ServerEvent } from "../lib/types.js";
//Websocket is one browser connection, WebSocketServer is the manager for new connections
import { WebSocketServer } from "ws";
import { addConnection, removeConnection, broadcastToRoom } from "./rooms.js";
import { pool } from "../db.js";
import { validateUuid } from "../lib/validate.js";
import { parseCookie } from "cookie"; // gets session token from cookies
import { getUserFromToken } from "../lib/auth.js"; // get u ser from session token

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
          AND expires_at > NOW()`,
        [validChatroomId]
      );
      if (result.rowCount === 0) {
        socket.close(1008, "chatroom not found or expired");
        return;
      }
      // get user data for broadcast
      const cookies = parseCookie(request.headers.cookie ?? "");
      const token = cookies.sessionToken;
      const user = await getUserFromToken(token);
      //add connection to websocket manager
      addConnection(validChatroomId, socket);
      //create event to broadcast
      const event = {
        type: "user.joined",
        chatroomId: validChatroomId,
        user: {
          id: user.id,
          name: user.name,
        },
      } satisfies ServerEvent;
      //broadcast event
      broadcastToRoom(event);
      console.log("user connected");

      //on user disconnect
      socket.on("close", () => {
        const event = {
          type: "user.left",
          chatroomId: validChatroomId,
          user: {
            id: user.id,
            name: user.name,
          },
        } satisfies ServerEvent;
        //remove connection
        removeConnection(validChatroomId, socket);
        //broadcast event
        broadcastToRoom(event);
        console.log("User disconnected");
      });
    } catch {
      // close socket if error throws
      socket.close(1008, "Connection rejected");
    }

    //on error
    socket.on("error", (error) => {
      console.error("WebSocket error: ", error);
    });
  });

  return webSocketServer;
}
