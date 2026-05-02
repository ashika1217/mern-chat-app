import React, { useState } from "react";

function MessageInput({ sendText }) {

  const [text, setText] = useState("");

  const send = () => {

    if (!text) return;

    sendText({
      text,
      emotion: "neutral"
    });

    setText("");
  };

  return (

    <div className="input-box">

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type message"
      />

      <button onClick={send}>
        Send
      </button>

    </div>
  );
}

export default MessageInput;