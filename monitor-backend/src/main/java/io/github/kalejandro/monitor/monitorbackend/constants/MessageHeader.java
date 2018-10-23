package io.github.kalejandro.monitor.monitorbackend.constants;

public enum MessageHeader {
  TIMEOUT("TIMEOUT"), UNAUTHORIZED("UNAUTHORIZED"), ERROR("ERROR");

  private String value;

  MessageHeader(String value) {
    this.value = value;
  }

  public String getValue() {
    return value;
  }
}
