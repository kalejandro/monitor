package io.github.kalejandro.monitor.monitorbackend.configuration;

import com.mongodb.MongoClientOptions;
import com.mongodb.MongoClientURI;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.data.mongodb.MongoDbFactory;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.SimpleMongoDbFactory;

@Configuration
public class MongoConfig {
  private MonitorConfig monitorConfig;

  @Autowired
  public MongoConfig(MonitorConfig monitorConfig) {
    this.monitorConfig = monitorConfig;
  }

  @Bean
  public MongoTemplate mongoTemplate() {
    return new MongoTemplate(mongoDbFactory());
  }

  public MongoDbFactory mongoDbFactory() {
    MongoClientOptions.Builder clientOptionsBuilder = MongoClientOptions.builder();
    clientOptionsBuilder.serverSelectionTimeout(monitorConfig.getServerSelectionTimeout());
    MongoClientURI mongoClientURI = new MongoClientURI(monitorConfig.getMongoClientURI(), clientOptionsBuilder);
    return new SimpleMongoDbFactory(mongoClientURI);
  }
}
