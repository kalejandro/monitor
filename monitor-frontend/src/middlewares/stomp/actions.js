import * as types from './ActionTypes';

export const initializeStomp = (url, header, subs, resolve, reject) => ({
  type: types.INITIALIZE_STOMP,
  stomp: {
    url,
    header,
    subs,
    resolve,
    reject
  }
});

export const initializeStompSuccess = () => ({
  type: types.INITIALIZE_STOMP_SUCCESS
});

export const finalizeStomp = resolve => ({
  type: types.FINALIZE_STOMP,
  stomp: {
    resolve
  }
});

export const finalizeStompSuccess = () => ({
  type: types.FINALIZE_STOMP_SUCCESS
});

export const stompError = message => ({
  type: types.STOMP_ERROR,
  message
});
