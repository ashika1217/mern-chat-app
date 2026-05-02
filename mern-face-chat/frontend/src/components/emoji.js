export function getEmoji(emotion) {

  const map = {
    happy: "😊",
    sad: "😢",
    angry: "😡",
    surprised: "😲",
    neutral: "😐"
  };

  return map[emotion] || "🙂";
}