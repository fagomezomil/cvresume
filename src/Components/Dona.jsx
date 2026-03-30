import Chart from "chart.js/auto"
import { useEffect, useRef } from "react"
export default function Dona() {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }
    const myChartRef = chartRef.current.getContext("2d");
    chartInstance.current = new Chart(myChartRef, {
      type: "bar",
      data: {
        labels: ["Photoshop", "Illustrator", "Indesign", "Tailwind CSS", "React", "HTML", "CSS", "JavaScript", "Next JS", "Typescript"],
        datasets: [
          {
            data: [90, 95, 75, 80, 85, 85, 90, 85, 80, 70],
            barThickness: 10,
            backgroundColor: [
              '#144879',
              '#ffb120',
              '#70154d',
              '#23c2c2',
              '#23a2c2',
              '#d84329',
              '#297edf',
              '#dcdf29',
              '#9fa3a5',
              '#1d75a1',
            ],
            borderWidth: 0,
          }
        ]
      },
      options: {
        indexAxis: 'y',

        plugins: {
          legend: {
            labels: {
              color: 'white',
              font: {
                size: 12,
                weight: 'bold',
              },
            },
            
          },
          dataRingColor: '#FFFFFF'
        }
      }
    });
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    }
  }, [])



  return (
    <div >
      <canvas ref={chartRef} className="h-full"></canvas>
    </div>
  )
}
