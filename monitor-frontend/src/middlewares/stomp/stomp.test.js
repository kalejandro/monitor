import stomp from './stomp';
import * as types from './ActionTypes';
import { initialize, finalize } from './client';

jest.mock('./client');

const create = state => {
  const store = {
    getState: jest.fn(() => state),
    dispatch: jest.fn()
  };

  const next = jest.fn();
  const invoke = (action) => stomp(store)(next)(action);

  return { store, next, invoke };
};

const initializeStompTestAction = {
  type: types.INITIALIZE_STOMP,
  stomp: {}
};

const finalizeStompTestAction = {
  type: types.FINALIZE_STOMP,
  stomp: {}
};

describe('Stomp middleware', () => {
  it('passes through non STOMP actions', () => {
    const { next, invoke } = create();
    const action = { type: 'SOME_ACTION' };

    invoke(action);
    expect(next).toHaveBeenCalledWith(action);
  });

  it('should initialize stomp', () => {
    const { store, next, invoke } = create();

    invoke(initializeStompTestAction);

    expect(next).toHaveBeenCalledWith(initializeStompTestAction);
    expect(initialize).toHaveBeenCalledWith(
      initializeStompTestAction.stomp,
      store.dispatch
    );
  });

  it('should finalize stomp', () => {
    const { store, next, invoke } = create();

    invoke(finalizeStompTestAction);

    expect(next).toHaveBeenCalledWith(finalizeStompTestAction);
    expect(finalize).toHaveBeenCalledWith(
      finalizeStompTestAction.stomp,
      store.dispatch
    );
  });
});
