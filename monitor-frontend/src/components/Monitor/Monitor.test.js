import React from 'react';
import { shallow } from 'enzyme';
import { Loader } from 'semantic-ui-react';
import { Redirect } from 'react-router-dom';

import { Monitor } from './Monitor';
import MonitorInfo from './MonitorInfo';

const setup = (propOverrides = {}) => {
  const { monitor, ...rest } = propOverrides;

  const props = Object.assign({
    monitor: Object.assign({
      uri: 'The uri',
      serverSelectionTimeout: 2000,
      updateFrequency: 2000,
      initializing: false
    }, monitor),
    startMonitor: jest.fn(),
    initializeMonitor: jest.fn()
  }, rest);

  const wrapper = shallow(<Monitor {...props} />);

  return {
    wrapper,
    props
  };
};

describe('Monitor', () => {
  it('should render', () => {
    setup();
  });

  it('should initialize the monitor when mounted', () => {
    const { props } = setup();

    expect(props.initializeMonitor).toHaveBeenCalled();
  });

  it('should render MonitorInfo', () => {
    const { wrapper } = setup();

    expect(wrapper.find(MonitorInfo)).toHaveLength(1);
  });

  it('should pass MonitorInfo the right props', () => {
    const { wrapper, props } = setup();
    const monitorInfo = wrapper.find(MonitorInfo);
    const {
      uri,
      serverSelectionTimeout,
      updateFrequency
    } = props.monitor;

    expect(monitorInfo.prop('uri')).toBe(uri);
    expect(monitorInfo.prop('serverSelectionTimeout'))
      .toBe(serverSelectionTimeout);
    expect(monitorInfo.prop('updateFrequency')).toBe(updateFrequency);
  });

  it('should call start() when start button is clicked', () => {
    const { wrapper, props } = setup();
    const button = wrapper.find('#start-button');

    button.simulate('click');
    expect(props.startMonitor).toHaveBeenCalled();
  });

  describe('Monitor initialization', () => {
    it('should disable start button while initializing the monitor', () => {
      const { wrapper } = setup({
        monitor: {
          initializing: true
        }
      });

      const button = wrapper.find('#start-button');

      expect(button.prop('disabled')).toBe(true);
    });

    it('should render a loader while initializing the monitor', () => {
      const { wrapper, props } = setup({
        monitor: {
          initializing: true
        }
      });

      const loader = wrapper.find(Loader);
      expect(loader).toHaveLength(1);
    });
  });
});
