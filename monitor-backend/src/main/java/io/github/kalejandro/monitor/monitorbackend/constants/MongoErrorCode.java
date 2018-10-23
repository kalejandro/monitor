package io.github.kalejandro.monitor.monitorbackend.constants;

public enum MongoErrorCode {
  UNAUTHORIZED(13);

  private int value;

  MongoErrorCode(int value) {
    this.value = value;
  }

  public int getValue() {
    return value;
  }
}
