package io.github.kalejandro.monitor.monitorbackend.constants;

public enum StompDestination {
  CONTROL("/topic/control"), STATS("/topic/stats");

  private String value;

  StompDestination(String value) {
    this.value = value;
  }

  public String getValue() {
    return value;
  }
}
