package io.github.kalejandro.monitor.monitorbackend.domain;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.github.kalejandro.monitor.monitorbackend.domain.serverstatus.ServerStatus;

public class Stats {
  @JsonProperty("uptime")
  private long uptime;
  @JsonProperty("version")
  private String version;

  @JsonProperty("current")
  private long current;
  @JsonProperty("available")
  private long available;

  @JsonProperty("bytesIn")
  private long bytesIn;
  @JsonProperty("bytesOut")
  private long bytesOut;
  @JsonProperty
  private long numRequests;

  @JsonProperty("insert")
  private long insert;
  @JsonProperty("query")
  private long query;
  @JsonProperty("update")
  private long update;
  @JsonProperty("delete_")
  private long delete;
  @JsonProperty("getmore")
  private long getMore;
  @JsonProperty("command")
  private long command;

  public Stats(ServerStatus serverStatus) {
    uptime = serverStatus.getUptime();
    version = serverStatus.getVersion();
    numRequests = serverStatus.getNetwork().getNumRequests();

    // Connections
    current = serverStatus.getConnections().getCurrent();
    available = serverStatus.getConnections().getAvailable();

    // Op. counters
    query = serverStatus.getOpcounters().getQuery();
    insert = serverStatus.getOpcounters().getInsert();
    update = serverStatus.getOpcounters().getUpdate();
    delete = serverStatus.getOpcounters().getDelete();
    getMore = serverStatus.getOpcounters().getGetmore();
    command = serverStatus.getOpcounters().getCommand();

    // Network
    bytesIn = serverStatus.getNetwork().getBytesIn();
    bytesOut = serverStatus.getNetwork().getBytesOut();
  }

  @Override
  public String toString() {
    return "Stats{" +
        "uptime=" + uptime +
        ", version='" + version + '\'' +
        ", current=" + current +
        ", available=" + available +
        ", bytesIn=" + bytesIn +
        ", bytesOut=" + bytesOut +
        ", numRequests=" + numRequests +
        ", insert=" + insert +
        ", query=" + query +
        ", update=" + update +
        ", delete=" + delete +
        ", getMore=" + getMore +
        ", command=" + command +
        '}';
  }
}
