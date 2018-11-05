import { initializeStomp } from '../middlewares/stomp/actions';
import * as types from '../constants/ActionTypes';

const SOCKET_URL = '/wsocket';
const STATS_DESTINATION = '/topic/stats';
const CONTROL_DESTINATION = '/topic/control';

export const initStomp = () => dispatch => {
  const header = {};

  const subscriptions = [
    { destination: CONTROL_DESTINATION, onMessage: receiveControlMessage },
    { destination: STATS_DESTINATION, onMessage: receiveStats }
  ];

  return new Promise((resolve, reject) => {
    dispatch(initializeStomp(
      SOCKET_URL,
      header,
      subscriptions,
      resolve,
      reject
    ));
  });
};

export const receiveControlMessage = ({ header, body }) => ({
  type: types.RECEIVE_CONTROL_MESSAGE,
  header,
  body
});

export const receiveStats = stats => ({
  type: types.RECEIVE_STATS,
  stats
});
