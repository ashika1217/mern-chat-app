import React from "react";
import { getEmoji } from "./emoji";

function ChatWindow({ messages }) {

  return (
    <div className="chat-window">

      {messages.map((msg, i) => (

        <div key={i} className="message">

          {msg.image && (
            <img
              src={msg.image}
              alt="upload"
              className="chat-image"
            />
          )}

          {msg.text && (
            <div className="bubble">
              {msg.text}
            </div>
          )}

          {msg.emotion && (
            <div className="emotion-result">
              Emotion: {msg.emotion} {getEmoji(msg.emotion)}
            </div>
          )}

          <div className="tick">
            ✓✓
          </div>

        </div>
      ))}

    </div>
  );
}

export default ChatWindow;