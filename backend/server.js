import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import houseRoutes from "./routes/houseRoutes.js";

const app = express();
const server = http.createServer(app);

// ✅ Socket.io setup
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Connect MongoDB
connectDB();

// ✅ Attach io instance to every request
app.use((req, res, next) => {
  req.io = io;  // this gives access to req.io.emit() in routes
  next();
});

// ✅ Routes
app.use("/api/houses", houseRoutes);

// ✅ Default route
app.get("/", (req, res) => {
  res.send("Smart Society Backend is Running...");
});

// ✅ Socket.io events
io.on("connection", (socket) => {
  console.log("🟢 Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

// ✅ Start the server
const PORT = 4000;
server.listen(PORT, () => {
  console.log(`🚀 Server + Socket.io running on port ${PORT}`);
});
