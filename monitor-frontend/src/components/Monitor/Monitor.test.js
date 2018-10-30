import React from 'react';
import { shallow } from 'enzyme';
import { Loader } from 'semantic-ui-react';

import { Monitor } from './Monitor';
import MonitorInfo from './MonitorInfo';

const setup = (propOverrides = {}) => {
  const { monitor, ...rest } = propOverrides;

  const props = Object.assign({
    monitor: Object.assign({
      uri: 'The uri',
      serverSelectionTimeout: 2000,
      updateFrequency: 2000,
      fetching: false
    }, monitor),
    startMonitor: jest.fn(),
    getMonitorInfo: jest.fn()
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

  it('should fetch monitor info when mounted', () => {
    const { props } = setup();

    expect(props.getMonitorInfo).toHaveBeenCalled();
  });

  it('should render a loader while fetching monitor info', () => {
    const { wrapper, props } = setup({
      monitor: {
        fetching: true
      }
    });

    const loader = wrapper.find(Loader);

    expect(loader).toHaveLength(1);
  });

  it('should disable start button while fetching monitor info', () => {
    const { wrapper } = setup({
      monitor: {
        fetching: true
      }
    });

    const button = wrapper.find('#start-button');

    expect(button.prop('disabled')).toBe(true);
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
      updateFrequency,
      fetching
    } = props.monitor;

    expect(monitorInfo.prop('uri')).toBe(uri);
    expect(monitorInfo.prop('serverSelectionTimeout'))
      .toBe(serverSelectionTimeout);
    expect(monitorInfo.prop('updateFrequency')).toBe(updateFrequency);
    expect(monitorInfo.prop('fetching')).toBe(fetching);
  });

  it('should call start() when start button is clicked', () => {
    const { wrapper, props } = setup();
    const button = wrapper.find('#start-button');

    button.simulate('click');
    expect(props.startMonitor).toHaveBeenCalled();
  });
});
