import * as types from '../constants/ActionTypes';

const initialState = {
  header: '',
  message: '',
  open: false
};

const modal = (state = initialState, action) => {
  switch(action.type) {
  case types.OPEN_MODAL:
    return Object.assign({}, state, {
      header: action.header,
      message: action.content,
      open: true
    });
  case types.CLOSE_MODAL:
    return Object.assign({}, state, {
      header: '',
      message: '',
      open: false
    });
  default:
    return state;
  }
};

export default modal;
