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
  stopMonitor,
  initializeMonitor,
  initializeMonitorRequest,
  initializeMonitorSuccess,
  initializeMonitorFailure,
} from './monitor';

import * as stompTypes from '../middlewares/stomp/ActionTypes';
import * as stomp from './stomp';
import {
  initializeStompSuccess,
  stompError
} from '../middlewares/stomp/actions';

jest.mock('./stomp');

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

    it('should create the right monitor initialization actions', () => {
      expect(initializeMonitorRequest()).toEqual({
        type: types.INITIALIZE_MONITOR_REQUEST
      });

      expect(initializeMonitorSuccess()).toEqual({
        type: types.INITIALIZE_MONITOR_SUCCESS
      });

      expect(initializeMonitorFailure(['Reason 1', 'Reason 2'])).toEqual({
        type: types.INITIALIZE_MONITOR_FAILURE,
        reasons: ['Reason 1', 'Reason 2']
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
          message: 'Can not get monitor info: Access denied'
        }
      ];

      const store = mockStore({});

      expect.assertions(1);

      return store.dispatch(getMonitorInfo()).catch(() => {
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

  describe('Monitor initialization', () => {
    /*
     * Initializing the monitor includes:
     * - Getting the monitor info
     * - Initializing STOMP
     */

    const compareFunction = (a, b) => a.type.localeCompare(b.type);

    afterEach(() => {
      fetchMock.reset();
      fetchMock.restore();
    });

    afterAll(() => {
      jest.resetAllMocks();
    });

    it('should initialize monitor', () => {
      const { info } = setup();

      fetchMock.get('/monitor/info', {
        body: info,
        status: 200,
        headers: {
          'Content-type': 'Application/json',
        }
      });

      stomp.initStomp.mockImplementation(() => dispatch => {
        dispatch({
          type: stompTypes.INITIALIZE_STOMP,
          stomp: {}
        });

        dispatch(initializeStompSuccess());
        return Promise.resolve();
      });

      const expectedHead = { type: types.INITIALIZE_MONITOR_REQUEST };

      // Do not assume order
      const expectedInitializationActions = [
        { type: types.MONITOR_INFO_REQUEST },
        { type: stompTypes.INITIALIZE_STOMP, stomp: {} },
        { type: types.MONITOR_INFO_SUCCESS, info },
        { type: stompTypes.INITIALIZE_STOMP_SUCCESS }
      ];

      const expectedTail = { type: types.INITIALIZE_MONITOR_SUCCESS };

      const store = mockStore({
        monitor: {
          initialized: false
        }
      });

      expect.assertions(3);

      return store.dispatch(initializeMonitor()).then(() => {
        const receivedActions = store.getActions().slice();

        expect(receivedActions[0]).toEqual(expectedHead);

        const initializationActions = receivedActions.slice().splice(1,4);
        expect(initializationActions.sort(compareFunction))
          .toEqual(expectedInitializationActions.sort(compareFunction));

        expect(receivedActions[5]).toEqual(expectedTail);
      });
    });

    describe('Monitor initialization failure', () => {
      it('should handle failure caused stomp failure', () => {
        const { info } = setup();

        fetchMock.get('/monitor/info', {
          body: info,
          status: 200,
          headers: {
            'Content-type': 'Application/json',
          }
        });

        stomp.initStomp.mockImplementation(() => dispatch => {
          dispatch({
            type: stompTypes.INITIALIZE_STOMP,
            stomp: {}
          });

          dispatch(stompError('The stomp error message'));
          return Promise.reject('The stomp error message');
        });

        const expectedHead = { type: types.INITIALIZE_MONITOR_REQUEST };

        // Do not assume order
        const expectedInitializationActions = [
          { type: types.MONITOR_INFO_REQUEST },
          { type: stompTypes.INITIALIZE_STOMP, stomp: {} },
          { type: types.MONITOR_INFO_SUCCESS, info },
          {
            type: stompTypes.STOMP_ERROR,
            message: 'The stomp error message'
          }
        ];

        const expectedTail = {
          type: types.INITIALIZE_MONITOR_FAILURE,
          reasons: [
            true,
            'The stomp error message',
          ]
        };

        const store = mockStore({
          monitor: {
            initialized: false
          }
        });

        expect.assertions(3);

        return store.dispatch(initializeMonitor()).then(() => {
          const receivedActions = store.getActions().slice();

          expect(receivedActions[0]).toEqual(expectedHead);

          const initializationActions = receivedActions.slice().splice(1,4);
          expect(initializationActions.sort(compareFunction))
            .toEqual(expectedInitializationActions.sort(compareFunction));

          expect(receivedActions[5]).toEqual(expectedTail);
        });
      });

      it('should handle failure caused by both causes', () => {
        const { info } = setup();

        fetchMock.get('/monitor/info', {
          body: {
            status: 401,
            message: 'Unauthorized'
          },
          status: 401,
          headers: {
            'Content-type': 'Application/json',
          }
        });

        stomp.initStomp.mockImplementation(() => dispatch => {
          dispatch({
            type: stompTypes.INITIALIZE_STOMP,
            stomp: {}
          });

          dispatch(stompError('The stomp error message'));
          return Promise.reject('The stomp error message');
        });

        const expectedHead = { type: types.INITIALIZE_MONITOR_REQUEST };

        // Do not assume order
        const expectedInitializationActions = [
          { type: types.MONITOR_INFO_REQUEST },
          { type: stompTypes.INITIALIZE_STOMP, stomp: {} },
          {
            type: types.MONITOR_INFO_FAILURE,
            message: 'Can not get monitor info: Unauthorized'
          },
          {
            type: stompTypes.STOMP_ERROR,
            message: 'The stomp error message'
          }
        ];

        const expectedTail = {
          type: types.INITIALIZE_MONITOR_FAILURE,
          reasons: [
            'Can not get monitor info: Unauthorized',
            'The stomp error message'
          ]
        };

        const store = mockStore({
          monitor: {
            initialized: false
          }
        });

        expect.assertions(3);

        return store.dispatch(initializeMonitor()).then(() => {
          const receivedActions = store.getActions().slice();

          expect(receivedActions[0]).toEqual(expectedHead);

          const initializationActions = receivedActions.slice().splice(1,4);
          expect(initializationActions.sort(compareFunction))
            .toEqual(expectedInitializationActions.sort(compareFunction));

          expect(receivedActions[5]).toEqual(expectedTail);
        });
      });
    });
  });
});
