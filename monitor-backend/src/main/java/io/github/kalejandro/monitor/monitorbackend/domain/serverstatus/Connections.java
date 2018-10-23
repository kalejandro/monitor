package io.github.kalejandro.monitor.monitorbackend.domain.serverstatus;

public class Connections {
  private long current;
  private long available;

  public Connections(long current, long available) {
    this.current = current;
    this.available = available;
  }

  public long getCurrent() {
    return current;
  }

  public long getAvailable() {
    return available;
  }
}
