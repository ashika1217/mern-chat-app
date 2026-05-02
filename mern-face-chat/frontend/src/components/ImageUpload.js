import React from "react";
import * as faceapi from "face-api.js";

function ImageUpload({ sendImage }) {

  const detectEmotion = async (img) => {

    const detections =
      await faceapi
        .detectSingleFace(
          img,
          new faceapi.TinyFaceDetectorOptions()
        )
        .withFaceExpressions();

    if (!detections) return "neutral";

    const expressions = detections.expressions;

    let max = 0;
    let emotion = "neutral";

    for (let e in expressions) {
      if (expressions[e] > max) {
        max = expressions[e];
        emotion = e;
      }
    }

    return emotion;
  };

  const handleImage = async (e) => {

    const file = e.target.files[0];
    if (!file) return;

    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);

    img.onload = async () => {

      const emotion = await detectEmotion(img);

      sendImage({
        image: img.src,
        emotion
      });
    };
  };

  return (
    <input
      type="file"
      accept="image/*"
      onChange={handleImage}
    />
  );
}

export default ImageUpload;