import { combineReducers } from 'redux';
import monitor from './monitor';
import stomp from './stomp';
import stats from './stats';
import dashboard from './dashboard';

export default combineReducers({
  monitor,
  stomp,
  stats,
  dashboard
});
