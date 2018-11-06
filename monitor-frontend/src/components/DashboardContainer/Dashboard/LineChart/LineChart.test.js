import React from 'react';
import { shallow, mount } from 'enzyme';
import Chart from 'chart.js';

import LineChart from './LineChart';
import * as datasets from '../datasets';
import chartOptions from '../chartOptions';

const setup = (wrapperFunction, propOverrides) => {
  const props = Object.assign({
    id: 'The id',
    getDatasets: null,
    data: [],
    options: {},
    canvasId: 'the-canvas-id'
  }, propOverrides);

  const wrapper = wrapperFunction(<LineChart {...props} />);

  return {
    wrapper,
    props
  };
};

jest.mock('chart.js', () => {
  return jest.fn().mockImplementation(() => {
    return {
      data: {
        datasets: [
          {
            data: [0, 0, 0, 0, 0]
          },
          {
            data: [0, 0, 0, 0, 0]
          }
        ]
      },
      update: jest.fn(),
      destroy: jest.fn()
    };
  });
});

describe('LineChart', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render', () => {
    setup(shallow, {
      getDatasets: jest.fn(),
      data: [
        [0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0]
      ],
      title: 'NETWORK'
    });
  });

  describe('Chart initialization', () => {
    it('should call new Chart() with the correct parameters', () => {
      const { wrapper, props } = setup(mount, {
        getDatasets: datasets.network,
        data: [
          [0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0]
        ],
        options: chartOptions('NETWORK')
      });

      const config = {
        type: 'line',
        data: {
          labels: new Array(20).fill(''),
          datasets: datasets.network(...props.data)
        },
        options: chartOptions('NETWORK')
      };

      const canvas = wrapper.instance().canvasRef.current;

      expect(Chart).toHaveBeenCalledWith(canvas, config);
    });
  });

  describe('Chart update', () => {
    it('should update the chart', () => {
      const { wrapper, props } = setup(shallow, {
        getDatasets: jest.fn(),
        data: [
          new Array(5).fill(0),
          new Array(5).fill(0)
        ],
        title: 'CONNECTIONS'
      });

      const newData = [
        [0, 0, 0, 0, 1],
        [0, 0, 0, 0, 1]
      ];

      const expectedDatasets = [
        { data: [0, 0, 0, 0, 1] },
        { data: [0, 0, 0, 0, 1] }
      ];

      const chart = wrapper.instance().chart;

      wrapper.setProps({ data: newData });

      expect(chart.update).toHaveBeenCalled();
      expect(chart.data.datasets).toEqual(expectedDatasets);
    });
  });

  describe('Chart cleanup', () => {
    it('should destroy the chart on unmount', () => {
      const { wrapper, props } = setup(shallow, {
        getDatasets: jest.fn(),
        data: [
          new Array(5).fill(0),
          new Array(5).fill(0)
        ],
        title: 'CONNECTIONS'
      });

      const chart = wrapper.instance().chart;

      wrapper.unmount();

      expect(chart.destroy).toHaveBeenCalled();
    });
  });
});
