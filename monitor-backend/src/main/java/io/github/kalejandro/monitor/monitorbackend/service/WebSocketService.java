package io.github.kalejandro.monitor.monitorbackend.service;

import io.github.kalejandro.monitor.monitorbackend.constants.StompDestination;
import io.github.kalejandro.monitor.monitorbackend.domain.Message;
import io.github.kalejandro.monitor.monitorbackend.domain.Stats;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class WebSocketService {
  private SimpMessagingTemplate simpMessagingTemplate;

  @Autowired
  public WebSocketService(SimpMessagingTemplate simpMessagingTemplate) {
    this.simpMessagingTemplate = simpMessagingTemplate;
  }

  public void sendMongoStats(Stats stats) {
    simpMessagingTemplate.convertAndSend(StompDestination.STATS.getValue(), stats);
  }

  public void sendMessage(Message message) {
    simpMessagingTemplate.convertAndSend(StompDestination.CONTROL.getValue(), message);
  }
}
