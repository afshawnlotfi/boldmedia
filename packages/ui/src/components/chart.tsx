// import { AnimatedIcon } from "./components/animated-icon"
import chartjs from "chart.js";
import React from "react";
import { Bar, ChartData, defaults } from 'react-chartjs-2';

if (defaults.global.animation) {
  defaults.global.animation.duration = 2000
}

export const ChartComponent = () => {
  const options: chartjs.ChartOptions = {
    maintainAspectRatio: false,

    scales: {
      xAxes: [{
        display: true,
        gridLines: {
          display: false
        },
      }],
      yAxes: [{
        display: true,
        gridLines: {
          display: false
        },
      }]
    }


  }
  const data: ChartData<chartjs.ChartData> = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {

        label: 'My First dataset',
        backgroundColor: 'rgba(255,99,132,0.2)',
        borderColor: 'rgba(255,99,132,1)',
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(255,99,132,0.4)',
        hoverBorderColor: 'rgba(255,99,132,1)',
        data: [65, 59, 80, 81, 56, 55, 40]
      }
    ]
  };


  return (
    <div>
      {/* <AnimatedIcon icon="play" duration={1000} /> */}
      <Bar
        data={data}
        width={100}
        height={500}
        options={options}
      />

    </div>
  )
}

