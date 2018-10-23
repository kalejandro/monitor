package io.github.kalejandro.monitor.monitorbackend.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;

@Configuration
public class TaskConfig {
  @Bean
  public TaskScheduler taskScheduler() {
    ThreadPoolTaskScheduler threadPoolTaskScheduler = new ThreadPoolTaskScheduler();
    threadPoolTaskScheduler.setPoolSize(1);
    threadPoolTaskScheduler.initialize();
    return threadPoolTaskScheduler;
  }
}
