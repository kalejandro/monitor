import * as types from '../constants/ActionTypes';
import * as controlMessages from '../constants/ControlMessages';
import * as states from '../constants/MonitorStates';
import * as statsValues from '../constants/StatsValues';

const initialState = {
  current: {
    uptime: 0,
    version: '-'
  },
  initialized: false, // True if there are valid (up to date) current stats
  collected: {
    initialized: false, // True if there are valid collected stats
    insert: new Array(statsValues.STATS_DELTA).fill(0),
    query: new Array(statsValues.STATS_DELTA).fill(0),
    update: new Array(statsValues.STATS_DELTA).fill(0),
    delete_: new Array(statsValues.STATS_DELTA).fill(0),
    command: new Array(statsValues.STATS_DELTA).fill(0),
    getmore: new Array(statsValues.STATS_DELTA).fill(0),
    bytesIn: new Array(statsValues.STATS_DELTA).fill(0),
    bytesOut: new Array(statsValues.STATS_DELTA).fill(0),
    current: new Array(statsValues.STATS_DELTA).fill(0),
    available: new Array(statsValues.STATS_DELTA).fill(0)
  }
};

const stats = (state = initialState, action) => {
  switch(action.type) {
  case types.RECEIVE_STATS:
    if (!state.initialized) {

      // Just store current stats
      return Object.assign({}, state, {
        initialized: true,
        current: action.stats
      });
    }

    return updateStats(state, action);
  case types.RECEIVE_CONTROL_MESSAGE:

    // Start over without loosing the old stats
    if (action.header === controlMessages.TIMEOUT) {
      return Object.assign({}, state, { initialized: false });
    }

    return state;
  case types.MONITOR_CONTROL_SUCCESS:
    if (action.state.value === states.STOPPED) {
      return initialState;
    }

    return state;
  default:
    return state;
  }
};

const updateStats = (state, action) => {
  const newCollected = { initialized: true };

  Object.entries(action.stats).forEach(([key, value]) => {

    // Not using all the stats sent by the backend (e.g. uptime)
    if (!state.collected[key]) {
      return;
    }

    const tempArray = state.collected[key].slice();
    tempArray.shift();

    // Update "Point in time" values
    if (key === 'current' || key === 'available') {
      tempArray.push(value);
      newCollected[key] = tempArray;
      return;
    }

    // Update the rest
    tempArray.push(value - state.current[key]);
    newCollected[key] = tempArray;
  });

  return Object.assign({}, state, {
    current: action.stats,
    collected: newCollected
  });
};

export default stats;
