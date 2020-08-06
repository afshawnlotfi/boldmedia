// import { AnimatedIcon } from "./components/animated-icon"
import Chart, { ChartData, ChartOptions } from "chart.js"
import React, { useEffect, useRef } from "react"

export const ChartComponent = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const options: ChartOptions = {
      title: {
        display: true,
        fontSize: 50,
        text: "Test Graph",
      },
      // maintainAspectRatio: false,
      legend: {
        display: false,
      },
      animation: {
        duration: 1000,
      },
      scales: {
        xAxes: [
          {
            display: true,
            ticks: {
              fontSize: 30,
            },
            gridLines: {
              display: false,
            },
          },
        ],
        yAxes: [
          {
            display: true,
            ticks: {
              fontSize: 30,
            },
            gridLines: {
              display: false,
            },
          },
        ],
      },
    }
    const data: ChartData = {
      labels: ["January", "February", "March", "April", "May", "June", "July"],
      datasets: [
        {
          label: "My First dataset",
          backgroundColor: "rgba(255,99,132,0.2)",
          borderColor: "rgba(255,99,132,1)",
          borderWidth: 1,
          hoverBackgroundColor: "rgba(255,99,132,0.4)",
          hoverBorderColor: "rgba(255,99,132,1)",
          data: [65, 59, 80, 81, 56, 55, 40],
        },
      ],
    }

    setTimeout(() => {
      const ctx = (canvasRef?.current as any)?.getContext("2d")

      new Chart(ctx, {
        type: "bar",
        data: data,

        options,
      })
    }, 1000)
  }, [])

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <canvas ref={canvasRef}></canvas>
    </div>
  )
}
