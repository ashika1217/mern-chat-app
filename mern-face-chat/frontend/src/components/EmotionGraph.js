import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

function EmotionGraph({ messages }) {

  const ref = useRef(null);
  const chart = useRef(null);

  useEffect(() => {

    const stats = {
      happy: 0,
      sad: 0,
      angry: 0,
      surprised: 0,
      neutral: 0
    };

    messages.forEach((m) => {
      if (stats[m.emotion] !== undefined)
        stats[m.emotion]++;
    });

    if (chart.current) {
      chart.current.destroy();
    }

    chart.current = new Chart(ref.current, {
      type: "bar",
      data: {
        labels: Object.keys(stats),
        datasets: [
          {
            label: "Emotion",
            data: Object.values(stats)
          }
        ]
      }
    });

  }, [messages]);

  return (
    <canvas ref={ref}></canvas>
  );
}

export default EmotionGraph;