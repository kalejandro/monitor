package io.github.kalejandro.monitor.monitorbackend.domain;

public class Info {
  private String URI;
  private int serverSelectionTimeout;
  private long updateFrequency;

  public Info(String URI, int serverSelectionTimeout, long updateFrequency) {
    this.URI = URI;
    this.serverSelectionTimeout = serverSelectionTimeout;
    this.updateFrequency = updateFrequency;
  }

  public String getURI() {
    return URI;
  }

  public int getServerSelectionTimeout() {
    return serverSelectionTimeout;
  }

  public long getUpdateFrequency() {
    return updateFrequency;
  }
}
