package io.github.kalejandro.monitor.monitorbackend.domain.serverstatus;

public class Network {
  private long bytesIn;
  private long bytesOut;
  private long numRequests;

  public Network(long bytesIn, long bytesOut, long numRequests) {
    this.bytesIn = bytesIn;
    this.bytesOut = bytesOut;
    this.numRequests = numRequests;
  }

  public long getBytesIn() {
    return bytesIn;
  }

  public long getBytesOut() {
    return bytesOut;
  }

  public long getNumRequests() {
    return numRequests;
  }
}
