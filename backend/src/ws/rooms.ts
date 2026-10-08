import WebSocket from "ws";
import type { ServerEvent } from "../lib/types.js";
import { validateUuid } from "../lib/validate.js";

// create room connection manager
const roomConnections = new Map<
  string, //chatroomId
  Set<WebSocket> // all websockets (NOT users as user can have multiple websockets) linked to chatroomId
>();

export function addConnection(chatroomId: string, socket: WebSocket) {
  let connections = roomConnections.get(chatroomId);
  if (!connections) {
    // if there is no set of websockets currently linked to chatroomId
    connections = new Set<WebSocket>(); // create new set for current chatroomId since one doesnt exist yet
    roomConnections.set(chatroomId, connections); // add set to connection manager Map
  }
  connections.add(socket); // add websocket to set
  console.log("WebSocket connection added");
}

export function removeConnection(chatroomId: string, socket: WebSocket) {
  let connections = roomConnections.get(chatroomId);
  if (!connections) {
    return;
  }
  connections.delete(socket);
  console.log("WebSocket connection removed");
  if (connections.size === 0) {
    roomConnections.delete(chatroomId);
    console.log("room has no connections");
  }
}

export function broadcastToRoom( event: ServerEvent) {
  // get Set from Map
  let connections = roomConnections.get(event.chatroomId);
  if (!connections) {
    return;
  }
  // call socket.send(...)
  const eventJson = JSON.stringify(event);

  let didBroadcast = false;
  for (const socket of connections) { // broadcast to every socket in connections
    if (socket.readyState === WebSocket.OPEN) { // checks if socket is open
      socket.send(eventJson); //send event to socket
      didBroadcast = true;
    }
  }
  if (didBroadcast) {
    console.log("Broadcast sent")
  }
}
