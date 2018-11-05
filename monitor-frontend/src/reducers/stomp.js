import * as stompTypes from '../middlewares/stomp/ActionTypes';

const initialState = {
  initializing: false,
  initialized: false,
  error: false,
  errorMessage: ''
};

const stomp = (state = initialState, action) => {
  switch(action.type) {
  case stompTypes.INITIALIZE_STOMP:
    return Object.assign({}, state, {
      initializing: true
    });
  case stompTypes.INITIALIZE_STOMP_SUCCESS:
    return Object.assign({}, state, {
      initializing: false,
      initialized: true
    });
  case stompTypes.FINALIZE_STOMP_SUCCESS:
    return Object.assign({}, state, {
      initialized: false
    });
  case stompTypes.STOMP_ERROR:
    return Object.assign({}, state, {
      initializing: false,
      error: true,
      errorMessage: action.message
    });
  default:
    return state;
  }
};

export default stomp;
