import "dotenv/config";
import app from "./app.js";
import { createServer } from "node:http";
import { createWebSocketServer } from "./ws/server.js";

const port = Number(process.env.PORT) || 3000;
//create http server
let server = createServer(app);
//upgrade http server to websocket server
createWebSocketServer(server);
//start server
server.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});
