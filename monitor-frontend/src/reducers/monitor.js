import * as types from '../constants/ActionTypes';

const initialState = {
  uri: '-',
  serverSelectionTimeout: 0,
  updateFrequency: 0,
  initializing: false,
  initialized: false
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

  default:
    return state;
  }
};


export default monitor;
