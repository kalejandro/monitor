import { initialize, finalize } from './client';
import * as types from './ActionTypes';

function stompMiddleware() {
  return store => next => action => {
    let result = next(action);

    if (action.type === types.INITIALIZE_STOMP) {
      initialize(action.stomp, store.dispatch);
    }

    if (action.type === types.FINALIZE_STOMP) {
      finalize(action.stomp, store.dispatch);
    }

    return result;
  };
}

const stomp = stompMiddleware();

export default stomp;
