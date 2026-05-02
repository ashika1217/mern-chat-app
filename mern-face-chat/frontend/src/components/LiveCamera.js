import React, { useRef, useEffect } from "react";
import * as faceapi from "face-api.js";

function LiveCamera({ sendImage }) {

  const videoRef = useRef();

  useEffect(() => {

    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {

        videoRef.current.srcObject = stream;

      })
      .catch(() => {
        console.log("camera not available");
      });

  }, []);

  return (
    <video
      ref={videoRef}
      autoPlay
      width="200"
    />
  );
}

export default LiveCamera;