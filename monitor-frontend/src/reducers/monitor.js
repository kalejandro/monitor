import * as types from '../constants/ActionTypes';
import * as states from '../constants/MonitorStates';

const initialState = {
  uri: '-',
  serverSelectionTimeout: 0,
  updateFrequency: 0,
  initializing: false,
  initialized: false,
  loading: false,
  started: false
};

const monitor = (state = initialState, action) => {
  switch(action.type) {
  case types.MONITOR_INFO_REQUEST:
    return Object.assign({}, state, { fetching: true });
  case types.MONITOR_INFO_FAILURE:
    return Object.assign({}, state, { fetching: false });
  case types.MONITOR_INFO_SUCCESS:
    return Object.assign({}, state, {
      fetching: false,
      uri: action.info.uri,
      serverSelectionTimeout: action.info.serverSelectionTimeout,
      updateFrequency: action.info.updateFrequency
    });

  case types.INITIALIZE_MONITOR_REQUEST:
    return Object.assign({}, state, { initializing: true });
  case types.INITIALIZE_MONITOR_FAILURE:
    return Object.assign({}, state, { initializing: false });
  case types.INITIALIZE_MONITOR_SUCCESS:
    return Object.assign({}, state, {
      initializing: false,
      initialized: true
    });

  case types.MONITOR_CONTROL_REQUEST:
    return Object.assign({}, state, { loading: true });
  case types.MONITOR_CONTROL_FAILURE:
    return Object.assign({}, state, { loading: false });
  case types.MONITOR_CONTROL_SUCCESS:
    return processMonitorTaskState(state, action);

  default:
    return state;
  }
};

/*
 *  The monitor can be in one of the following states:
 *  - "STARTED" (Thread on the monitor backend is monitoring stats)
 *  - "STOPPED"
 *
 *  Do not confuse this state with the application's state.
 */
const processMonitorTaskState = (state, action) => {
  const started = action.state.value === states.STARTED ? true : false;
  return Object.assign({}, state, { started, loading: false });
};

export default monitor;
