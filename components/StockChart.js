// src/components/StockChart.js

import React from 'react';
import { useRecoilValue } from 'recoil';
import { stockDataSelector } from '../state/stockState';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register required Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

const StockChart = () => {
  const stockData = useRecoilValue(stockDataSelector);

  // Extracting chart data
  const labels = stockData.map(data => data.date);
  const prices = stockData.map(data => data.close);
  const volumes = stockData.map(data => data.volume);
  // Chart data configuration
  const data = {
    labels,
    datasets: [
      {
        label: 'Stock Price',
        data: prices,
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        yAxisID: 'y-axis-1',
        type: 'line',
      },
      {
        label: 'Volume',
        data: volumes,
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
        yAxisID: 'y-axis-2',
        type: 'bar',
      },
    ],
  };

  // Chart options for dual-axis
  const options = {
    responsive: true,
    scales: {
      'y-axis-1': {
        type: 'linear',
        position: 'left',
        title: {
          display: true,
          text: 'Stock Price',
        },
      },
      'y-axis-2': {
        type: 'linear',
        position: 'right',
        title: {
          display: true,
          text: 'Volume',
        },
        grid: {
          drawOnChartArea: false, // Hide grid lines for the volume axis
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
  };

  return (
    <div className="chart-container">
      <Line data={data} options={options} />
    </div>
  );
};

export default StockChart;
