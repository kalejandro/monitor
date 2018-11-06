const chartOptions = title => {
  const options = {
    showLines: true,
    animation: {
      duration: 0
    },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
          precision: 0
        }
      }],
      xAxes: [{
        ticks: {
          display: false
        }
      }]
    },
    elements: {
      line: {
      },
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 5
      }
    },
    legend: {
      labels: {
        boxWidth: 20
      }
    },
    tooltips: {
      displayColors: true,
      mode: 'index',
      intersect: false,
      position: 'nearest',
      bodySpacing: 6
    },
    title: {
      display: true,
      text: title
    }
  };

  return options;
};

export default chartOptions;
