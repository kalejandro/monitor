package io.github.kalejandro.monitor.monitorbackend.service;

import io.github.kalejandro.monitor.monitorbackend.configuration.MonitorConfig;
import io.github.kalejandro.monitor.monitorbackend.constants.MonitorState;
import io.github.kalejandro.monitor.monitorbackend.exception.monitor.MonitorException;
import io.github.kalejandro.monitor.monitorbackend.domain.Info;
import io.github.kalejandro.monitor.monitorbackend.domain.Message;
import io.github.kalejandro.monitor.monitorbackend.domain.State;
import io.github.kalejandro.monitor.monitorbackend.domain.Stats;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.security.concurrent.DelegatingSecurityContextRunnable;
import org.springframework.stereotype.Service;

import java.util.concurrent.ScheduledFuture;

@Service
public class MonitorService {
  private MonitorConfig monitorConfig;
  private MongoService mongoService;
  private WebSocketService webSocketService;
  private TaskScheduler taskScheduler;
  private volatile ScheduledFuture<?> scheduledFuture;

  @Autowired
  public MonitorService(MonitorConfig monitorConfig, MongoService mongoService, WebSocketService webSocketService,
                        TaskScheduler taskScheduler) {
    this.monitorConfig = monitorConfig;
    this.mongoService = mongoService;
    this.webSocketService = webSocketService;
    this.taskScheduler = taskScheduler;
  }

  public Info getInfo() {
    return new Info(monitorConfig.getMongoClientURI(),
        monitorConfig.getServerSelectionTimeout(), monitorConfig.getUpdateFrequency());
  }

  private void sendMongoStats() {
    try {
      webSocketService.sendMongoStats(mongoService.getMongoStats());
    } catch (MonitorException ex) {
      webSocketService.sendMessage(new Message(ex.getMessageHeader().toString(), ex.getMessage()));
    }
  }

  public void handleState(State state) {

    // state is validated in the controller
    MonitorState monitorState = MonitorState.valueOf(state.getValue());

    switch (monitorState) {
      case STARTED:
        start();
        break;
      case STOPPED:
        stop();
        break;
    }
  }

  private void start() {
    if (scheduledFuture != null && !scheduledFuture.isCancelled()) {
      return;
    }
    DelegatingSecurityContextRunnable runnable = new DelegatingSecurityContextRunnable(this::sendMongoStats);
    scheduledFuture = taskScheduler.scheduleWithFixedDelay(runnable, monitorConfig.getUpdateFrequency());
  }

  private void stop() {
    if (scheduledFuture == null) {
      return;
    }
    scheduledFuture.cancel(false);
  }
}
