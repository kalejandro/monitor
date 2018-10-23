package io.github.kalejandro.monitor.monitorbackend.exception.monitor;

import io.github.kalejandro.monitor.monitorbackend.constants.MessageHeader;

public class MonitorException extends RuntimeException {
  private MessageHeader messageHeader;

  public MonitorException(String message, MessageHeader messageHeader) {
    super(message);
    this.messageHeader = messageHeader;
  }

  public MessageHeader getMessageHeader() {
    return messageHeader;
  }

  public String getMessageHeaderString() {
    return messageHeader.toString();
  }
}
