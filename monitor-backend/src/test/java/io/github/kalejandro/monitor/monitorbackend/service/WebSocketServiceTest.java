package io.github.kalejandro.monitor.monitorbackend.service;

import io.github.kalejandro.monitor.monitorbackend.constants.StompDestination;
import io.github.kalejandro.monitor.monitorbackend.domain.Message;
import io.github.kalejandro.monitor.monitorbackend.domain.Stats;
import io.github.kalejandro.monitor.monitorbackend.domain.serverstatus.Connections;
import io.github.kalejandro.monitor.monitorbackend.domain.serverstatus.Network;
import io.github.kalejandro.monitor.monitorbackend.domain.serverstatus.Opcounters;
import io.github.kalejandro.monitor.monitorbackend.domain.serverstatus.ServerStatus;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import static org.mockito.Mockito.verify;

@RunWith(MockitoJUnitRunner.class)
public class WebSocketServiceTest {
  @Mock
  SimpMessagingTemplate simpMessagingTemplate;
  @InjectMocks
  WebSocketService webSocketService;

  @Test
  public void sendMessage() {
    Message message = new Message("The message header", "The message body");
    webSocketService.sendMessage(message);

    verify(simpMessagingTemplate).convertAndSend(StompDestination.CONTROL.getValue(), message);
  }

  @Test
  public void sendMongoStats() {
    Stats stats = new Stats(new ServerStatus("The version", 1000,
        new Connections(1001, 1002),
        new Network(1003, 1004, 1005),
        new Opcounters(1006, 1007, 1008, 1009, 1010, 1011)));
    webSocketService.sendMongoStats(stats);

    verify(simpMessagingTemplate).convertAndSend(StompDestination.STATS.getValue(), stats);
  }
}
