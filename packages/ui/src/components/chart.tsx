// import { AnimatedIcon } from "./components/animated-icon"
import Chart, { ChartData, ChartOptions } from "chart.js"
import React, { useEffect, useRef } from "react"

export const ChartComponent = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const options: ChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      title: {
        display: true,
        fontSize: 40,
        text: "Test Graph",
      },
      legend: {
        display: false,
      },
      animation: {
        duration: 1000,
      },
      scales: {
        xAxes: [
          {
            scaleLabel: {
              display: true,
              fontSize: 20,
              // labelString: "",
            },
            display: true,
            ticks: {
              fontSize: 20,
            },
            gridLines: {
              display: false,
            },
          },
        ],
        yAxes: [
          {
            scaleLabel: {
              display: true,
              fontSize: 20,
              // labelString: "",
            },
            display: true,
            ticks: {
              fontSize: 20,
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
          borderWidth: 1,
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
