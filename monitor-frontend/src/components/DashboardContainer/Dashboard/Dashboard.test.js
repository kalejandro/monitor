import React from 'react';
import { shallow } from 'enzyme';

import Dashboard from './Dashboard';
import LineChart from './LineChart';
import chartOptions from './chartOptions';
import * as datasets from './datasets';

const setup = propOverrides => {
  const props = Object.assign({
    uri: 'The uri',
    currentStats: {
      uptime: 1000,
      version: '1.2.3'
    },
    collectedStats: {
      insert: new Array(20).fill(0),
      query: new Array(20).fill(0),
      update: new Array(20).fill(0),
      delete_: new Array(20).fill(0),
      command: new Array(20).fill(0),
      getmore: new Array(20).fill(0),
      bytesIn: new Array(20).fill(0),
      bytesOut: new Array(20).fill(0),
      current: new Array(20).fill(0),
      available: new Array(20).fill(0)
    },
    loading: false,
    stopMonitor: jest.fn()
  }, propOverrides);

  const wrapper = shallow(<Dashboard {...props} />);

  return {
    wrapper,
    props
  };
};

describe('Dashboard', () => {
  it('should render', () => {
    setup();
  });

  it('should stop monitoring when the stop button is clicked', () => {
    const { wrapper, props } = setup();

    wrapper.find('#stop').simulate('click');
    expect(props.stopMonitor).toHaveBeenCalled();
  });

  it('should render the 4 charts', () => {
    const { wrapper, props } = setup();

    expect(wrapper.find(LineChart)).toHaveLength(4);
  });

  it('should pass the right props to the op. counters chart', () => {
    const { wrapper, props } = setup();
    const { insert, query, update, delete_ } = props.collectedStats;
    const chart = wrapper.find('#op-counters');
    const data = [insert, query, update, delete_];
    const options = chartOptions('OP. COUNTERS');

    expect(chart.prop('data')).toEqual(data);
    expect(chart.prop('getDatasets')).toEqual(datasets.opCounters);
    expect(chart.prop('options')).toEqual(options);
    expect(chart.prop('canvasId')).toBe('op-counters-canvas');
  });

  it('should pass the right props to the op. counters 2 chart', () => {
    const { wrapper, props } = setup();
    const { getmore, command } = props.collectedStats;
    const chart = wrapper.find('#op-counters-2');
    const data = [getmore, command];
    const options = chartOptions('OP. COUNTERS 2');

    expect(chart.prop('data')).toEqual(data);
    expect(chart.prop('getDatasets')).toEqual(datasets.opCounters2);
    expect(chart.prop('options')).toEqual(options);
    expect(chart.prop('canvasId')).toBe('op-counters2-canvas');
  });

  it('should pass the right props to the network chart', () => {
    const { wrapper, props } = setup();
    const { bytesIn, bytesOut } = props.collectedStats;
    const chart = wrapper.find('#network');
    const data = [bytesIn, bytesOut];
    const options = chartOptions('NETWORK');

    expect(chart.prop('data')).toEqual(data);
    expect(chart.prop('getDatasets')).toEqual(datasets.network);
    expect(chart.prop('options')).toEqual(options);
    expect(chart.prop('canvasId')).toBe('network-canvas');
  });

  it('should pass the right props to the connections chart', () => {
    const { wrapper, props } = setup();
    const { current, available } = props.collectedStats;
    const chart = wrapper.find('#connections');
    const data = [current, available];
    const options = chartOptions('CONNECTIONS');

    expect(chart.prop('data')).toEqual(data);
    expect(chart.prop('getDatasets')).toEqual(datasets.connections);
    expect(chart.prop('options')).toEqual(options);
    expect(chart.prop('canvasId')).toBe('connections-canvas');
  });
});
