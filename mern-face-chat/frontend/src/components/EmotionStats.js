import React from "react";
import { Bar } from "react-chartjs-2";

function EmotionStats({ emotionHistory }) {

  const count = {};

  emotionHistory.forEach(e => {
    count[e] = (count[e] || 0) + 1;
  });

  const data = {
    labels: Object.keys(count),
    datasets: [
      {
        label: "Emotion Count",
        data: Object.values(count),
      }
    ]
  };

  return (
    <div style={{
      background: "white",
      padding: "10px"
    }}>
      <Bar data={data} />
    </div>
  );
}

export default EmotionStats;