package io.github.kalejandro.monitor.monitorbackend.exception.monitor;

import io.github.kalejandro.monitor.monitorbackend.constants.MessageHeader;

public class UnauthorizedException extends MonitorException {
  public UnauthorizedException() {
    super("You are not authorized to run serverStatus command", MessageHeader.UNAUTHORIZED);
  }
}
