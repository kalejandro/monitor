package io.github.kalejandro.monitor.monitorbackend.service;

import io.github.kalejandro.monitor.monitorbackend.domain.Message;
import io.github.kalejandro.monitor.monitorbackend.domain.Stats;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class WebSocketService {
  private static final Logger logger = LoggerFactory.getLogger(WebSocketService.class);

  public void sendMongoStats(Stats stats) {
    logger.info("sendMongoStats: {}", stats);
  }

  public void sendMessage(Message message) {
    logger.info("sendMessage: {}", message);
  }
}
