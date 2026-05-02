const express = require("express");
const http = require("http");
const cors = require("cors");
const socketIo = require("socket.io");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = socketIo(server, {
  cors: { origin: "*" }
});

// 🧠 Simple Chatbot Function
function getBotReply(message) {
  const msg = message.toLowerCase();

  // Greetings
  if (msg.includes("hi") || msg.includes("hello")) {
    return "Hi 👋 How are you? What do you want to talk about?";
  }

  if (msg.includes("how are you")) {
    return "I'm doing great 😊 How about you?";
  }

  if (msg.includes("what are you doing")) {
    return "Just chatting with you 😄";
  }

  if (msg.includes("what is your name")) {
    return "I'm your friendly chatbot 🤖";
  }

  if (msg.includes("i am fine") || msg.includes("good")) {
    return "Nice 😊 What can I help you with?";
  }

  if (msg.includes("sad")) {
    return "I'm sorry 😔 I'm here for you. Want to share?";
  }

  if (msg.includes("happy")) {
    return "That's awesome 😄 Keep smiling!";
  }

  if (msg.includes("tell me a joke")) {
    return "😂 Why did the developer go broke? Because he used up all his cache!";
  }

  if (msg.includes("bye")) {
    return "Bye 👋 Take care!";
  }

  if (msg.includes("help")) {
    return "Sure 😊 You can ask me anything!";
  }

  // Default smart replies
  const replies = [
    "Interesting 🤔 Tell me more!",
    "Okay 👍",
    "Hmm 👀 go on...",
    "I see 😄",
    "Can you explain more?",
    "That sounds good 😊",
    "Alright 👍",
    "Oh nice 😄",
    "Got it 👌",
    "Cool 😎"
  ];

  return replies[Math.floor(Math.random() * replies.length)];
}

io.on("connection", (socket) => {

  console.log("User connected");

  socket.on("sendMessage", (msg) => {

    const botReply = getBotReply(msg);

    // Send both user message + bot reply
    io.emit("receiveMessage", {
      user: msg,
      bot: botReply
    });

  });

});

// Image API (unchanged)
app.post("/image", (req, res) => {
  res.json({
    emotion: "Happy"
  });
});

server.listen(5000, () => {
  console.log("Server running on 5000");
});