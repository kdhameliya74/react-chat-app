import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import bodyParser from "body-parser";
import bcrypt from "bcryptjs";
import {
  getOnlineUsers,
  loginUser,
  logoutUser,
  registerUser,
} from "./users/auth.js";
import { getAllMessages, setChatMessage } from "./chat/chat.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());
const server = http.createServer(app);

const onlineUsers = {};

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("register", (id) => {
    onlineUsers[id] = socket.id;
    console.log(`${id} registered with socket ID: ${socket.id}`);
  });

  socket.on("private_message", async ({ sender, receiver, message }) => {
    const recipientSocketId = onlineUsers[+receiver];
    const senderSocketId = onlineUsers[+sender];
    const addedMesg = await setChatMessage(sender, receiver, message);

    if(senderSocketId) {
      io.to(senderSocketId).emit("private_message", addedMesg);
    }

    if (recipientSocketId) {
      io.to(recipientSocketId).emit("private_message", addedMesg);
    }
  });
  socket.on("user-disconnected", (userId) => {
    delete onlineUsers[userId];
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

app.post("/signup", async (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  try {
    const user = await registerUser(firstname, lastname, email, password);
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await loginUser(email, password);
    res.json(result); // contains token
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

app.post("/logout/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await logoutUser(id);
    res.json(result);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

app.get("/messages/:user1/:user2", async (req, res) => {
  const { user1, user2 } = req.params;
  try {
    const result = await getAllMessages(user1, user2);
    res.json(result);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

app.get("/online-users", async (req, res) => {
  try {
    const result = await getOnlineUsers();
    res.json(result);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

app.get("/", (req, res) => {
  res.send("Server is running!");
});

server.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});
