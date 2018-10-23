package io.github.kalejandro.monitor.monitorbackend.exception.monitor;

import io.github.kalejandro.monitor.monitorbackend.constants.MessageHeader;

public class TimeoutException extends MonitorException {
  public TimeoutException() {
    super("Mongo timed out", MessageHeader.TIMEOUT);
  }
}
