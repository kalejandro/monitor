package io.github.kalejandro.monitor.monitorbackend.exception.monitor;

import io.github.kalejandro.monitor.monitorbackend.constants.MessageHeader;

public class CommandFailureException extends MonitorException {
  public CommandFailureException(String message) {
    super(message, MessageHeader.ERROR);
  }
}
