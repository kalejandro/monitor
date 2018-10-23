package io.github.kalejandro.monitor.monitorbackend.configuration;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.validation.annotation.Validated;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

@Validated
@Configuration
@ConfigurationProperties(prefix = "monitor")
public class MonitorConfig {
  @Pattern(regexp = "^mongodb://.+/.+", message = "Invalid MongoDB client URI")
  private String mongoClientURI;
  @NotNull
  private int serverSelectionTimeout;
  @NotNull
  private long updateFrequency;

  public String getMongoClientURI() {
    return mongoClientURI;
  }

  public void setMongoClientURI(String mongoClientURI) {
    this.mongoClientURI = mongoClientURI;
  }

  public int getServerSelectionTimeout() {
    return serverSelectionTimeout;
  }

  public void setServerSelectionTimeout(int serverSelectionTimeout) {
    this.serverSelectionTimeout = serverSelectionTimeout;
  }

  public long getUpdateFrequency() {
    return updateFrequency;
  }

  public void setUpdateFrequency(long updateFrequency) {
    this.updateFrequency = updateFrequency;
  }
}
