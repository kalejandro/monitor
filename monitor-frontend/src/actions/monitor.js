import * as types from '../constants/ActionTypes';
import * as states from '../constants/MonitorStates';
import request from '../utils/request';

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
    dispatch(monitorInfoFailure(e.message));
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
  return request.make(
    {
      url: '/monitor/state',
      method: 'PUT',
      body: {
        value: state
      },
      before: () => {
        dispatch(monitorControlRequest());
      }
    }
  ).then(response => {
    dispatch(monitorControlSuccess(response));
  }).catch(e => {
    console.log(e.message);
    dispatch(monitorControlFailure(e.message));
  });
};
