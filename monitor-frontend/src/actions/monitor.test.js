import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import fetchMock from 'fetch-mock';

import * as types from '../constants/ActionTypes';
import * as states from '../constants/MonitorStates';
import {
  monitorInfoRequest,
  monitorInfoSuccess,
  monitorInfoFailure,
  monitorControlRequest,
  monitorControlSuccess,
  monitorControlFailure,
  getMonitorInfo,
  startMonitor,
  stopMonitor
} from './monitor';


const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

const setup = propOverrides => {
  const info = Object.assign({
    uri: 'The uri',
    serverSelectionTimeout: 2000,
    updateFrequency: 2000
  }, propOverrides);

  return {
    info
  };
};

describe('Monitor actions', () => {
  describe('Action creators', () => {
    it('should create the right monitor fetch actions', () => {
      const { info } = setup();

      expect(monitorInfoRequest()).toEqual({
        type: types.MONITOR_INFO_REQUEST
      });

      expect(monitorInfoSuccess(info)).toEqual({
        type: types.MONITOR_INFO_SUCCESS,
        info
      });

      expect(monitorInfoFailure()).toEqual({
        type: types.MONITOR_INFO_FAILURE
      });
    });

    it('should create the right monitor control actions', () => {
      expect(monitorControlRequest()).toEqual({
        type: types.MONITOR_CONTROL_REQUEST
      });

      expect(monitorControlSuccess(states.STARTED)).toEqual({
        type: types.MONITOR_CONTROL_SUCCESS,
        state: states.STARTED
      });

      expect(monitorControlFailure('The message')).toEqual({
        type: types.MONITOR_CONTROL_FAILURE,
        message: 'The message'
      });
    });
  });

  describe('Monitor info', () => {
    afterEach(() => {
      fetchMock.reset();
      fetchMock.restore();
    });

    afterAll(() => {
      jest.resetAllMocks();
    });

    it('should get the monitor info', () => {
      const { info } = setup();

      fetchMock.get('/monitor/info', {
        body: info,
        status: 200,
        headers: {
          'Content-type': 'Application/json',
        }
      });

      const expectedActions = [
        { type: types.MONITOR_INFO_REQUEST },
        { type: types.MONITOR_INFO_SUCCESS, info }
      ];

      const store = mockStore({});

      expect.assertions(1);

      return store.dispatch(getMonitorInfo()).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('should handle errors while trying to get the monitor info', () => {
      const { info } = setup();

      fetchMock.get('/monitor/info', {
        body: {
          status: 403,
          message: 'Access denied'
        },
        status: 403,
        headers: {
          'Content-type': 'Application/json',
        }
      });

      const expectedActions = [
        { type: types.MONITOR_INFO_REQUEST },
        {
          type: types.MONITOR_INFO_FAILURE,
          message: 'Access denied'
        }
      ];

      const store = mockStore({});

      expect.assertions(1);

      return store.dispatch(getMonitorInfo()).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });

  describe('Monitor control', () => {
    afterEach(() => {
      fetchMock.reset();
      fetchMock.restore();
    });

    afterAll(() => {
      jest.resetAllMocks();
    });

    it('should start the monitor', () => {
      fetchMock.put('/monitor/state', {
        body: { value: states.STARTED },
        status: 200,
        headers: {
          'Content-type': 'Application/json',
        }
      });

      const expectedActions = [
        { type: types.MONITOR_CONTROL_REQUEST },
        {
          type: types.MONITOR_CONTROL_SUCCESS,
          state: { value: states.STARTED }
        }
      ];

      const store = mockStore({});

      expect.assertions(1);

      return store.dispatch(startMonitor()).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('should stop the monitor', () => {
      fetchMock.put('/monitor/state', {
        body: { value: states.STOPPED },
        status: 200,
        headers: {
          'Content-type': 'Application/json',
        }
      });

      const expectedActions = [
        { type: types.MONITOR_CONTROL_REQUEST },
        {
          type: types.MONITOR_CONTROL_SUCCESS,
          state: { value: states.STOPPED }
        }
      ];

      const store = mockStore({});

      expect.assertions(1);

      return store.dispatch(stopMonitor()).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('should handle errors while trying to control the monitor', () => {
      fetchMock.put('/monitor/state', {
        body: {
          status: 403,
          message: 'Access denied'
        },
        status: 403,
        headers: {
          'Content-type': 'Application/json',
        }
      });

      const expectedActions = [
        { type: types.MONITOR_CONTROL_REQUEST },
        {
          type: types.MONITOR_CONTROL_FAILURE,
          message: 'Access denied'
        }
      ];

      const store = mockStore({});

      expect.assertions(1);

      return store.dispatch(startMonitor()).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });
});
