package io.github.kalejandro.monitor.monitorbackend.domain.serverstatus;

public class ServerStatus {
  private String version;
  private long uptime;
  private Connections connections;
  private Network network;
  private Opcounters opcounters;

  public ServerStatus(String version, long uptime, Connections connections, Network network, Opcounters opcounters) {
    this.version = version;
    this.uptime = uptime;
    this.connections = connections;
    this.network = network;
    this.opcounters = opcounters;
  }

  public String getVersion() {
    return version;
  }

  public long getUptime() {
    return uptime;
  }

  public Connections getConnections() {
    return connections;
  }

  public Network getNetwork() {
    return network;
  }

  public Opcounters getOpcounters() {
    return opcounters;
  }
}
