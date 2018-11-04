import Stomp from 'stompjs';
import SockJS from 'sockjs-client';

import { initialize, finalize } from './client';
import * as types from '../ActionTypes';
import {
  initializeStompSuccess,
  finalizeStompSuccess,
  stompError
} from '../actions';

jest.mock('sockjs-client');

const CONNECTED_CALLBACK = 'CONNECTED_CALLBACK';
const ERROR_CALLBACK = 'ERROR_CALLBACK';
const DISCONNECT_CALLBACK = 'DISCONNECT_CALLBACK';
const dispatch = jest.fn();

const initData = {
  url: 'The url',
  header: {},
  subs: [
    {
      destination: 'The control destination',
      onMessage: jest.fn()
    },
    {
      destination: 'The stats destination',
      onMessage: jest.fn()
    }
  ],
  resolve: jest.fn(),
  reject: jest.fn()
};

const finalizationData = {
  resolve: jest.fn()
};

const setup = () => {
  const client = {
    callbacks: {},
    simulateCallback: function(cb, data) { this.callbacks[cb](data); },
    subscribe: jest.fn(function(destination, frameCallback) {
      this.callbacks[destination] = frameCallback;
    }),
    connect: jest.fn(function(header, connectedCallback, errorCallback) {
      this.callbacks[CONNECTED_CALLBACK] = connectedCallback;
      this.callbacks[ERROR_CALLBACK] = errorCallback;
    }),
    disconnect: jest.fn(function(disconnectCallback) {
      this.callbacks[DISCONNECT_CALLBACK] = disconnectCallback;
    })
  };

  const over = jest.spyOn(Stomp, 'over').mockImplementation(() => client);

  return {
    client,
    over
  };
};

describe('Stomp middleware client', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize stomp', () => {
    const socket = {};
    const { client, over } = setup();

    SockJS.mockImplementation(() => socket);

    initialize(initData, dispatch);
    expect(SockJS).toHaveBeenCalledWith(initData.url);
    expect(over).toHaveBeenCalledWith(socket);
    expect(client.connect).toHaveBeenCalledWith(
      initData.header,
      expect.any(Function),
      expect.any(Function)
    );

    client.simulateCallback(CONNECTED_CALLBACK);
    expect(client.subscribe.mock.calls).toEqual([
      [initData.subs[0].destination, expect.any(Function)],
      [initData.subs[1].destination, expect.any(Function)]
    ]);

    expect(dispatch).toHaveBeenCalledWith(initializeStompSuccess());
    expect(initData.resolve).toHaveBeenCalled();
  });

  it('should handle stomp initialization failure', () => {
    const socket = {};
    const { client, over } = setup();

    SockJS.mockImplementation(() => socket);

    initialize(initData, dispatch);
    expect(SockJS).toHaveBeenCalledWith(initData.url);
    expect(over).toHaveBeenCalledWith(socket);
    expect(client.connect).toHaveBeenCalledWith(
      initData.header,
      expect.any(Function),
      expect.any(Function)
    );

    client.simulateCallback(ERROR_CALLBACK, 'The error message');
    expect(dispatch).toHaveBeenCalledWith(stompError('The error message'));
    expect(initData.reject).toHaveBeenCalledWith('The error message');
  });

  it('should handle stomp frames sent to the control destination', () => {
    const { client } = setup();

    initialize(initData, dispatch);
    client.simulateCallback(CONNECTED_CALLBACK);
    client.simulateCallback(initData.subs[0].destination, {
      body: '{ "header": "The header", "body": "The body" }'
    });

    const expectedAction = initData.subs[0].onMessage({
      header: 'The header',
      body: 'The body'
    });

    expect(dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should handle stomp frames sent to the stats destination', () => {
    const { client } = setup();

    initialize(initData, dispatch);
    client.simulateCallback(CONNECTED_CALLBACK);
    client.simulateCallback(initData.subs[1].destination, {
      body: '{ "property": 1234, "property2": "value" }'
    });

    const expectedAction = initData.subs[1].onMessage({
      property: 1234,
      property2: 'value'
    });

    expect(dispatch).toHaveBeenCalledWith(expectedAction);
  });

  it('should handle errors', () => {
    const { client } = setup();

    initialize(initData, dispatch);
    client.simulateCallback(CONNECTED_CALLBACK);
    client.simulateCallback(ERROR_CALLBACK, 'The error message');

    expect(dispatch).toHaveBeenCalledWith(stompError('The error message'));
    expect(initData.reject).not.toHaveBeenCalledWith('The error message');
  });

  it('should ignore errors after receiving an error frame', () => {
    const { client } = setup();
    const errorFrame = {
      command: 'ERROR',
      headers: {
        message: 'The error message from the ERROR frame'
      }
    };

    initialize(initData, dispatch);
    client.simulateCallback(CONNECTED_CALLBACK);
    client.simulateCallback(ERROR_CALLBACK, errorFrame);
    client.simulateCallback(ERROR_CALLBACK, 'The error message');

    expect(dispatch).not.toHaveBeenCalledWith(stompError('The error message'));
  });

  it('should finalize stomp', () => {
    const { client } = setup();

    initialize(initData, dispatch);
    finalize(finalizationData, dispatch);
    client.simulateCallback(DISCONNECT_CALLBACK);

    expect(dispatch).toHaveBeenNthCalledWith(1, finalizeStompSuccess());
    expect(finalizationData.resolve).toHaveBeenCalled();
  });
});
