import Chart from "chart.js/auto";
import { useEffect, useRef } from "react";

const skillsData = [
  { name: "Photoshop", level: 90, color: "#144879" },
  { name: "Illustrator", level: 95, color: "#ffb120" },
  { name: "InDesign", level: 75, color: "#70154d" },
  { name: "Tailwind", level: 85, color: "#38bdf8" },
  { name: "React", level: 85, color: "#61dafb" },
  { name: "HTML", level: 90, color: "#e34f26" },
  { name: "CSS", level: 90, color: "#264de4" },
  { name: "JavaScript", level: 85, color: "#f7df1e" },
  { name: "Next.js", level: 80, color: "#79868f" },
  { name: "TypeScript", level: 70, color: "#3178c6" },
];

export default function Grafico() {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");

    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: skillsData.map(s => s.name),
        datasets: [{
          data: skillsData.map(s => s.level),
          backgroundColor: skillsData.map(s => s.color),
          borderRadius: 6,
          borderSkipped: false,
          barThickness: 16,
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#163b5e',
            titleColor: '#fff',
            bodyColor: '#fff',
            padding: 12,
            cornerRadius: 8,
            displayColors: false,
            callbacks: {
              label: (context) => `${context.parsed.x}% de dominio`
            }
          }
        },
        scales: {
          x: {
            min: 0,
            max: 100,
            grid: {
              display: false,
              drawBorder: false
            },
            ticks: {
              display: false
            }
          },
          y: {
            grid: {
              display: false,
              drawBorder: false
            },
            ticks: {
              color: '#666',
              font: {
                size: 12,
                weight: '500'
              },
              padding: 8
            }
          }
        },
        animation: {
          duration: 1500,
          easing: 'easeOutQuart'
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <div className="w-full h-[300px]">
      <canvas ref={chartRef} />
    </div>
  );
}