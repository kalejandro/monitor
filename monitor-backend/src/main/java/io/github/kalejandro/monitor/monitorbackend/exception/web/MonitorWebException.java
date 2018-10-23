package io.github.kalejandro.monitor.monitorbackend.exception.web;

import org.springframework.http.HttpStatus;

public class MonitorWebException extends RuntimeException {
  private HttpStatus httpStatus;

  public MonitorWebException(String message, HttpStatus httpStatus) {
    super(message);
    this.httpStatus = httpStatus;
  }

  public HttpStatus getHttpStatus() {
    return httpStatus;
  }
}
