import React, { Component } from 'react';
import Chart from 'chart.js';
import PropTypes from 'prop-types';

import * as statsValues from '../../../../constants/StatsValues';

class LineChart extends Component {
  constructor(props) {
    super(props);
    this.chart = {};
    this.canvasRef = React.createRef();
  }

  componentDidMount() {
    const { options, getDatasets, data } = this.props;

    this.chart = new Chart(this.canvasRef.current, {
      type: 'line',
      data: {
        labels: new Array(statsValues.STATS_DELTA).fill(''),
        datasets: getDatasets(...data)
      },
      options: options
    });
  }

  componentDidUpdate() {
    const { data } = this.props;
    this.chart.data.datasets.forEach((dataset, i) => {
      dataset.data = data[i];
    });

    this.chart.update();
  }

  componentWillUnmount() {
    this.chart.destroy();
  }

  render() {
    return(
      <React.Fragment>
        <canvas id={this.props.canvasId} ref={this.canvasRef}>
        </canvas>
      </React.Fragment>
    );
  }
}

LineChart.propTypes = {
  data: PropTypes.array.isRequired,
  getDatasets: PropTypes.func.isRequired,
  options: PropTypes.object.isRequired,
  canvasId: PropTypes.string.isRequired
};

export default LineChart;
