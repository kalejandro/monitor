import * as types from '../constants/ActionTypes';
import * as states from '../constants/MonitorStates';
import request from '../utils/request';
import { initStomp } from './stomp';
import { getCsrfToken } from '../utils/tokens';
import { openModal } from './modal';

// ----------------
// Get monitor info
// ----------------

export const monitorInfoRequest = () => ({
  type: types.MONITOR_INFO_REQUEST
});

export const monitorInfoSuccess = info => ({
  type: types.MONITOR_INFO_SUCCESS,
  info
});

export const monitorInfoFailure = message => ({
  type: types.MONITOR_INFO_FAILURE,
  message
});

export const getMonitorInfo = () => dispatch => {
  return request.make(
    {
      url: '/monitor/info',
      method: 'GET',
      before: () => {
        dispatch(monitorInfoRequest());
      }
    }
  ).then(response => {
    dispatch(monitorInfoSuccess(response));
  }).catch(e => {
    let message = 'Can not get monitor info: ' + e.message;

    dispatch(monitorInfoFailure(message));
    dispatch(openModal('Monitor info error', message));
    return Promise.reject(message);
  });
};

// ------------------
// Initialize monitor
// ------------------

export const initializeMonitorRequest = () => ({
  type: types.INITIALIZE_MONITOR_REQUEST
});

export const initializeMonitorSuccess = () => ({
  type: types.INITIALIZE_MONITOR_SUCCESS
});

export const initializeMonitorFailure = reasons => ({
  type: types.INITIALIZE_MONITOR_FAILURE,
  reasons
});

export const initializeMonitor = () => (dispatch, getState) => {
  const { monitor: { initialized } } = getState();
  if (initialized) {
    return;
  }

  dispatch(initializeMonitorRequest());

  return Promise.all([
    dispatch(getMonitorInfo()).then(() => true).catch(e => e),
    dispatch(initStomp()).then(() => true).catch(e => e)
  ]).then((result) => {
    if (result.every(e => e === true)) {
      dispatch(initializeMonitorSuccess());
    } else {
      dispatch(initializeMonitorFailure(result));
    }
  });
};

// ----------------------
// Start and stop monitor
// ----------------------

export const monitorControlRequest = () => ({
  type: types.MONITOR_CONTROL_REQUEST
});

export const monitorControlFailure = message => ({
  type: types.MONITOR_CONTROL_FAILURE,
  message
});

export const monitorControlSuccess = state => ({
  type: types.MONITOR_CONTROL_SUCCESS,
  state
});

export const startMonitor = () => monitorControl(states.STARTED);
export const stopMonitor = () => monitorControl(states.STOPPED);

const monitorControl = state => dispatch => {
  const token = getCsrfToken();

  return request.make(
    {
      url: '/monitor/state',
      method: 'PUT',
      body: {
        value: state
      },
      before: () => {
        dispatch(monitorControlRequest());
      },
      token
    }
  ).then(response => {
    dispatch(monitorControlSuccess(response));
  }).catch(e => {
    dispatch(monitorControlFailure(e.message));
    dispatch(openModal('Monitor control error', e.message));
  });
};
