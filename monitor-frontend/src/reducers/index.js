import { combineReducers } from 'redux';
import monitor from './monitor';
import stomp from './stomp';

export default combineReducers({
  monitor,
  stomp
});
