package io.github.kalejandro.monitor.monitorbackend.domain;

import io.github.kalejandro.monitor.monitorbackend.constants.MonitorState;

public class State {
  private String value;

  private State(){}

  public State(MonitorState monitorState) {
    value = monitorState.toString();
  }

  public String getValue() {
    return value;
  }
}
