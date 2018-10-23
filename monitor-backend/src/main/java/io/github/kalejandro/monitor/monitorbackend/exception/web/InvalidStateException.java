package io.github.kalejandro.monitor.monitorbackend.exception.web;

import org.springframework.http.HttpStatus;

public class InvalidStateException extends MonitorWebException {
  public InvalidStateException() {
    super("Invalid state", HttpStatus.BAD_REQUEST);
  }
}
