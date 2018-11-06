import reducer from './stats';
import * as types from '../constants/ActionTypes';
import * as controlMessages from '../constants/ControlMessages';
import * as states from '../constants/MonitorStates';

describe('stats reducer', () => {
  const initialState = {
    current: {
      uptime: 0,
      version: '-'
    },
    initialized: false,
    collected: {
      initialized: false,
      insert: new Array(20).fill(0),
      query: new Array(20).fill(0),
      update: new Array(20).fill(0),
      delete_: new Array(20).fill(0),
      command: new Array(20).fill(0),
      getmore: new Array(20).fill(0),
      bytesIn: new Array(20).fill(0),
      bytesOut: new Array(20).fill(0),
      current: new Array(20).fill(0),
      available: new Array(20).fill(0)
    }
  };

  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('should handle the first received stats', () => {
    const action = {
      type: types.RECEIVE_STATS,
      stats : {
        available: 100,
        bytesIn: 100,
        bytesOut: 100,
        command: 100,
        current: 100,
        delete_: 100,
        getmore: 100,
        insert: 100,
        numRequests: 100,
        query: 100,
        update: 100,
        uptime: 100
      }
    };

    expect(reducer(initialState, action)).toEqual({
      current: action.stats,
      initialized: true,
      collected: {
        initialized: false,
        insert: new Array(20).fill(0),
        query: new Array(20).fill(0),
        update: new Array(20).fill(0),
        delete_: new Array(20).fill(0),
        command: new Array(20).fill(0),
        getmore: new Array(20).fill(0),
        bytesIn: new Array(20).fill(0),
        bytesOut: new Array(20).fill(0),
        current: new Array(20).fill(0),
        available: new Array(20).fill(0)
      }
    });
  });

  it('should calculate the stats', () => {
    const prevState = {
      current : {
        available: 100,
        bytesIn: 100,
        bytesOut: 100,
        command: 100,
        current: 100,
        delete_: 100,
        getmore: 100,
        insert: 100,
        numRequests: 100,
        query: 100,
        update: 100,
        uptime: 100
      },
      initialized: true,
      collected: {
        initialized: false,
        insert: new Array(20).fill(0),
        query: new Array(20).fill(0),
        update: new Array(20).fill(0),
        delete_: new Array(20).fill(0),
        command: new Array(20).fill(0),
        getmore: new Array(20).fill(0),
        bytesIn: new Array(20).fill(0),
        bytesOut: new Array(20).fill(0),
        current: new Array(20).fill(0),
        available: new Array(20).fill(0)
      }
    };

    const action = {
      type: types.RECEIVE_STATS,
      stats : {
        available: 120,
        bytesIn: 120,
        bytesOut: 110,
        command: 110,
        current: 120,
        delete_: 120,
        getmore: 110,
        insert: 120,
        numRequests: 110,
        query: 120,
        update: 110,
        uptime: 120
      }
    };

    const baseArray = new Array(19).fill(0);

    expect(reducer(prevState, action)).toEqual({
      current: action.stats,
      initialized: true,
      collected: {
        initialized: true,
        insert: baseArray.concat(20),
        query: baseArray.concat(20),
        update: baseArray.concat(10),
        delete_: baseArray.concat(20),
        command: baseArray.concat(10),
        getmore: baseArray.concat(10),
        bytesIn: baseArray.concat(20),
        bytesOut: baseArray.concat(10),
        current: baseArray.concat(120),
        available: baseArray.concat(120)
      }
    });
  });

  it('should handle mongo timeout', () => {
    const action = {
      type: types.RECEIVE_CONTROL_MESSAGE,
      header: controlMessages.TIMEOUT
    };

    const prevState = {
      current: {},
      initialized: true,
      collected: {}
    };

    expect(reducer(prevState, action)).toEqual({
      current: {},
      initialized: false,
      collected: {}
    });
  });

  it('should handle STOPPED monitor', () => {
    const action = {
      type: types.MONITOR_CONTROL_SUCCESS,
      state: {
        value: states.STOPPED
      }
    };

    const prevState = {
      current: {
        available: 120,
        bytesIn: 120,
        bytesOut: 110,
        command: 110,
        current: 120,
        delete_: 120,
        getmore: 110,
        insert: 120,
        numRequests: 110,
        query: 120,
        update: 110,
        uptime: 120
      },
      initialized: true,
      collected: {}
    };

    expect(reducer(prevState, action)).toEqual(initialState);
  });
});

