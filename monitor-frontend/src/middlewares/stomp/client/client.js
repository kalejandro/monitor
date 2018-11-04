import Stomp from 'stompjs';
import SockJS from 'sockjs-client';

import {
  initializeStompSuccess,
  finalizeStompSuccess,
  stompError
} from '../actions';

const ERROR_COMMAND = 'ERROR';

let socket;
let stompClient;
let errorFrameReceived;
let initialized;

/*
 * The error callback is called (by stompjs) when:
 * - An error frame is received
 * - The socket is closed (socket.onclose)
 *
 * Keep in mind that after sending an error frame, the server must close the
 * connection (STOMP spec.) and doing it will trigger 'onclose'.
 */
export const initialize = (data, dispatch) => {
  const { url, header, subs, resolve, reject } = data;

  errorFrameReceived = false;
  initialized = false;
  createStompClient(url);
  stompClient.connect(
    header,
    connected(subs, resolve, dispatch),
    error(reject, dispatch)
  );
};

const createStompClient = url => {
  socket = new SockJS(url);
  stompClient = Stomp.over(socket);
};

const connected = (subs, resolve, dispatch) => () => {
  subs.forEach(s => {
    stompClient.subscribe(s.destination, frame => {
      const message = JSON.parse(frame.body);
      dispatch(s.onMessage(message));
    });
  });

  initialized = true;
  dispatch(initializeStompSuccess());
  resolve();
};

const error = (reject, dispatch) => e => {
  if (errorFrameReceived) {
    return;
  }

  let message;

  if (e.command === ERROR_COMMAND) {
    errorFrameReceived = true;
    message = e.headers.message;
  } else {
    message = e;
  }

  dispatch(stompError(message));

  if (!initialized) {
    reject(message);
  }
};

export const finalize = ({ resolve }, dispatch) => {
  stompClient.disconnect(() => {
    dispatch(finalizeStompSuccess());
    resolve();
  });
};
