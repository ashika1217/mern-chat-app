import React, { useState, useRef, useEffect } from "react";
import "./App.css";
import * as faceapi from "face-api.js";

function App() {
  const [messages, setMessages] = useState([
    { type: "bot", text: "Hello! Upload image, use camera or chat with me 😊" },
  ]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [inputText, setInputText] = useState("");
  const [language, setLanguage] = useState("en");

  const fileInputRef = useRef();
  const cameraRef = useRef();
  const chatContainerRef = useRef();

  // Load face-api models
  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      await faceapi.nets.faceExpressionNet.loadFromUri("/models");
    };
    loadModels();
  }, []);

  // Auto scroll
  useEffect(() => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  // =====================
  // 🧠 CHATBOT FUNCTION
  // =====================
  const getBotReply = (() => {
  let lastTopic = "";

  return (text) => {
    const msg = text.toLowerCase();

    // Greetings
    if (msg.match(/\b(hi|hello|hey)\b/)) {
      return random([
        "Hey 👋 How's your day going?",
        "Hi 😊 What’s up?",
        "Hello! How are you doing today?"
      ]);
    }

    // How are you
    if (msg.includes("how are you")) {
      return random([
        "I'm doing pretty good 😊 What about you?",
        "All good here 😄 How’s your day?",
        "Feeling great! What about you?"
      ]);
    }

    // User feeling
    if (msg.includes("sad") || msg.includes("tired") || msg.includes("bad")) {
      lastTopic = "sad";
      return random([
        "Ahh 😔 that doesn’t sound good. Want to talk about it?",
        "I'm here for you 💙 What happened?",
        "Sometimes it’s okay to feel that way… tell me more."
      ]);
    }

    if (msg.includes("happy") || msg.includes("good")) {
      lastTopic = "happy";
      return random([
        "That’s nice to hear 😄 What made you happy?",
        "Love that vibe ✨ keep it going!",
        "Awesome 😎 Tell me more!"
      ]);
    }

    // Follow-up context
    if (msg.includes("nothing") && lastTopic === "sad") {
      return "Hmm… even ‘nothing’ can feel heavy sometimes 😔 I’m here if you want to share.";
    }

    // Name
    if (msg.includes("your name")) {
      return random([
        "I don’t have a fancy name 😄 just call me your chatbot!",
        "I’m your chat buddy 🤖",
        "You can call me anything 😎"
      ]);
    }

    // Joke
    if (msg.includes("joke")) {
      return random([
        "😂 Why do programmers hate nature? Too many bugs!",
        "I told my code a joke… it didn’t compile 😅",
        "Why Java developers wear glasses? Because they don’t C# 😆"
      ]);
    }

    // Bye
    if (msg.includes("bye")) {
      return random([
        "Bye 👋 Take care!",
        "See you later 😊",
        "Catch you soon 😄"
      ]);
    }

    // Questions
    if (msg.includes("?")) {
      return random([
        "Hmm good question 🤔 what do you think?",
        "Interesting… tell me your thoughts first!",
        "That’s something to think about 😄"
      ]);
    }

    // Default human replies
    return random([
      "Hmm… tell me more 🙂",
      "Ohh okay 👀",
      "I see 😄 go on...",
      "That’s interesting 🤔",
      "Alright 👍",
      "Sounds good 😎",
      "Nice… what next?",
      "Okay, I’m listening 👂"
    ]);
  };

  function random(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
})();
   

  // Emotion from text
  const predictEmotionFromText = (text) => {
    const lower = text.toLowerCase();
    if (lower.includes("happy")) return { text: "Happy", emoji: "😊" };
    if (lower.includes("sad")) return { text: "Sad", emoji: "😢" };
    if (lower.includes("angry")) return { text: "Angry", emoji: "😠" };
    return { text: "Neutral", emoji: "😐" };
  };

  // Translate
  const translateText = async (text, targetLang) => {
    if (targetLang === "en") return text;
    try {
      const res = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`
      );
      const data = await res.json();
      return data.responseData.translatedText;
    } catch {
      return text;
    }
  };

  // =====================
  // 💬 SEND TEXT (FIXED)
  // =====================
  const handleSendText = async () => {
    if (!inputText) return;

    const userMsg = inputText;

    const emotion = predictEmotionFromText(userMsg);
    const botReply = getBotReply(userMsg);
    const translated = await translateText(botReply, language);

    setMessages((prev) => [
      ...prev,
      { type: "user", text: userMsg },
      { type: "bot", text: `${translated} ${emotion.emoji}` }
    ]);

    setInputText("");
  };

  // =====================
  // 📸 IMAGE UPLOAD
  // =====================
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const predictEmotionFromImage = async (file) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = async () => {
        const detection = await faceapi
          .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
          .withFaceExpressions();

        if (!detection) {
          resolve({ text: "Unknown", emoji: "❓" });
          return;
        }

        const expressions = detection.expressions;
        const maxEmotion = Object.keys(expressions).reduce((a, b) =>
          expressions[a] > expressions[b] ? a : b
        );

        const emojiMap = {
          happy: "😊",
          sad: "😢",
          angry: "😠",
          surprised: "😲",
          neutral: "😐",
        };

        resolve({
          text: maxEmotion,
          emoji: emojiMap[maxEmotion],
        });
      };
    });
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const result = await predictEmotionFromImage(selectedFile);
    const translated = await translateText(
      `Detected emotion: ${result.text}`,
      language
    );

    setMessages((prev) => [
      ...prev,
      { type: "user", text: "Uploaded image", file: URL.createObjectURL(selectedFile) },
      { type: "bot", text: `${translated} ${result.emoji}` }
    ]);
  };

  // =====================
  // 🎥 CAMERA
  // =====================
  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      cameraRef.current.srcObject = stream;
      cameraRef.current.play();

      setTimeout(async () => {
        const video = cameraRef.current;
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0);

        canvas.toBlob(async (blob) => {
          const file = new File([blob], "capture.jpg");

          const result = await predictEmotionFromImage(file);
          const translated = await translateText(
            `Detected emotion: ${result.text}`,
            language
          );

          setMessages((prev) => [
            ...prev,
            { type: "user", text: "Captured image", file: URL.createObjectURL(file) },
            { type: "bot", text: `${translated} ${result.emoji}` }
          ]);

          stream.getTracks().forEach((t) => t.stop());
        });
      }, 2000);
    } catch {
      alert("Camera access denied");
    }
  };

  return (
    <div className="app-container">
      <h2>Emotion Chat 🤖</h2>

      <div className="chat-container" ref={chatContainerRef}>
        {messages.map((msg, i) => (
          <div key={i} className={`chat-message ${msg.type}`}>
            {msg.file && <img src={msg.file} alt="" className="chat-image" />}
            <div>{msg.text}</div>
          </div>
        ))}
      </div>

      <div className="input-area">
        <input
          type="text"
          placeholder="Type message"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        <button onClick={handleSendText}>Send</button>

        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload</button>

        <button onClick={handleCameraCapture}>Camera</button>
      </div>

      <video ref={cameraRef} style={{ display: "none" }} />
    </div>
  );
}

export default App;