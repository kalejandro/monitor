import fetchMock from 'fetch-mock';

import * as request from './request';
import RequestError from './errors/RequestError';

const setup = propOverrides => {
  const data = Object.assign({
    method: 'GET',
    url: '/test/uri',
    body: {},
    token: 'The token',
    before: jest.fn()
  }, propOverrides);

  const dispatch = jest.fn();

  const successResponseBody = {
    status: 200,
    message: 'successful request'
  };

  const failureResponseBody = {
    status: 400,
    message: 'failed request'
  };

  return {
    data,
    dispatch,
    successResponseBody,
    failureResponseBody
  };
};

describe('Requests', () => {
  afterEach(() => {
    fetchMock.reset();
    fetchMock.restore();
  });

  describe('GET requests', () => {
    it('should make the request and handle the response', () => {
      const { data, successResponseBody } = setup();

      fetchMock.get('/test/uri', {
        body: successResponseBody,
        status: 200,
        headers: {
          'Content-type': 'Application/json',
        }
      });

      expect.assertions(2);
      return request.make(data).then(response => {
        expect(data.before).toHaveBeenCalled();
        expect(response).toEqual(successResponseBody);
      });
    });

    it('should make the request and handle a non 200 OK response', () => {
      const { data, failureResponseBody } = setup();

      fetchMock.get('/test/uri', {
        body: failureResponseBody,
        status: 400,
        headers: {
          'Content-type': 'Application/json',
        }
      });

      expect.assertions(4);
      return request.make(data).catch(error => {
        expect(data.before).toHaveBeenCalled();
        expect(error).toBeInstanceOf(RequestError);
        expect(error.status).toEqual(failureResponseBody.status);
        expect(error.message).toEqual(failureResponseBody.message);
      });
    });

    it('should make the request and handle unexpected errors', () => {
      const { data, failureResponseBody } = setup();

      fetchMock.get('/test/uri', {
        body: 1234,
        status: 400,
        headers: {
          'Content-type': 'Application/json',
        }
      });

      expect.assertions(2);
      return request.make(data).catch(error => {
        expect(data.before).toHaveBeenCalled();
        expect(error).toBeInstanceOf(Error);
      });
    });
  });

  describe('Non GET requests', () => {
    it('should add the body and the token if not HTTP GET', () => {
      const { data, successResponseBody } = setup({
        method: 'POST',
        body: {
          property: 'value'
        }
      });

      fetchMock.post('/test/uri', {
        body: successResponseBody,
        status: 200,
        headers: {
          'Content-type': 'Application/json',
        }
      });

      expect.assertions(2);
      return request.make(data).then(() => {
        expect(fetchMock.lastOptions().headers['X-XSRF-TOKEN'])
          .toBe(data.token);

        const requestBody = JSON.parse(fetchMock.lastCall()[1].body);
        expect(requestBody).toEqual(data.body);
      });
    });
  });
});
