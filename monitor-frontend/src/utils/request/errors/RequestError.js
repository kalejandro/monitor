export default class RequestError extends Error {
  constructor(status, ...params) {
    super(params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RequestError);
    }

    this.status = status;
  }
}
