import React from 'react';
import { shallow } from 'enzyme';
import { Redirect } from 'react-router-dom';
import { Loader } from 'semantic-ui-react';

import { DashboardContainer } from './DashboardContainer';
import Timeout from './Timeout';
import Dashboard from './Dashboard';

const setup = (propOverrides = {}) => {
  const { stats, ...rest } = propOverrides;
  const props = Object.assign({
    uri: 'The uri',
    currentStats: {
      uptime: 1000,
      version: '1.2.3'
    },
    collectedStats: Object.assign({
      initialized: true,
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
    }, stats),
    started: true,
    loading: false,
    timeout: false,
    error: false,
    errorMessage: '',
    stopMonitor: jest.fn()
  }, rest);

  const wrapper = shallow(<DashboardContainer {...props} />);

  return {
    wrapper,
    props
  };
};

describe('DashboardContainer', () => {
  it('should render', () => {
    setup();
  });

  it('should redirect if started is false', () => {
    const { wrapper } = setup({
      started: false
    });

    expect(wrapper.matchesElement(<Redirect to='/' push={true} />)).toBe(true);
  });

  it('should handle monitor timeouts', () => {
    const { wrapper, props } = setup({
      timeout: true
    });

    const timeout = wrapper.find(Timeout);

    expect(timeout).toHaveLength(1);
    expect(timeout.prop('loading')).toBe(props.loading);
    expect(timeout.prop('cancel')).toBe(props.stopMonitor);
  });

  it('should render a loader if initialization is not complete', () => {
    const { wrapper, props } = setup({
      stats: { initialized: false }
    });

    const loader = wrapper.find(Loader);

    expect(loader).toHaveLength(1);
  });

  it('should render the dashboard', () => {
    const { wrapper, props } = setup();
    const dashboard = wrapper.find(Dashboard);

    expect(dashboard).toHaveLength(1);
    expect(dashboard.prop('currentStats')).toBe(props.currentStats);
    expect(dashboard.prop('collectedStats')).toBe(props.collectedStats);
    expect(dashboard.prop('uri')).toBe(props.uri);
    expect(dashboard.prop('uptime')).toBe(props.uptime);
    expect(dashboard.prop('version')).toBe(props.version);
    expect(dashboard.prop('stopMonitoring')).toBe(props.stopMonitoring);
    expect(dashboard.prop('loading')).toBe(props.loading);
  });
});
