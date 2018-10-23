package io.github.kalejandro.monitor.monitorbackend.listener;

import io.github.kalejandro.monitor.monitorbackend.constants.MonitorState;
import io.github.kalejandro.monitor.monitorbackend.domain.State;
import io.github.kalejandro.monitor.monitorbackend.service.MonitorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
public class WebSocketEventListener {
  private MonitorService monitorService;

  @Autowired
  public void setMonitorService(MonitorService monitorService) {
    this.monitorService = monitorService;
  }

  @EventListener
  public void onDisconnectEvent(SessionDisconnectEvent event) {
    monitorService.handleState(new State(MonitorState.STOPPED));
  }
}
