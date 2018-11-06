import * as types from '../constants/ActionTypes';
import * as controlMessages from '../constants/ControlMessages';

const initialState = {
  timeout: false,
  error: false,
  errorMessage: ''
};

const dashboard = (state = initialState, action) => {
  switch(action.type) {
  case types.RECEIVE_CONTROL_MESSAGE:
    return processControlMessage(state, action);
  case types.RECEIVE_STATS:
    return Object.assign({}, state, { timeout: false });
  default:
    return state;
  }
};

const processControlMessage = (state, action) => {
  switch(action.header) {
  case controlMessages.TIMEOUT:
    return Object.assign({}, state, {
      timeout: true,
      error: false
    });
  case controlMessages.UNAUTHORIZED:
    return Object.assign({}, state, {
      timeout:false,
      error: true,
      errorMessage: action.body
    });
  default:
    return state;
  }
};

export default dashboard;
