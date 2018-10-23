package io.github.kalejandro.monitor.monitorbackend.service;

import io.github.kalejandro.monitor.monitorbackend.configuration.MonitorConfig;
import io.github.kalejandro.monitor.monitorbackend.constants.MonitorState;
import io.github.kalejandro.monitor.monitorbackend.exception.monitor.MonitorException;
import io.github.kalejandro.monitor.monitorbackend.exception.monitor.TimeoutException;
import io.github.kalejandro.monitor.monitorbackend.domain.Info;
import io.github.kalejandro.monitor.monitorbackend.domain.Message;
import io.github.kalejandro.monitor.monitorbackend.domain.State;
import io.github.kalejandro.monitor.monitorbackend.domain.Stats;
import io.github.kalejandro.monitor.monitorbackend.domain.serverstatus.Connections;
import io.github.kalejandro.monitor.monitorbackend.domain.serverstatus.Network;
import io.github.kalejandro.monitor.monitorbackend.domain.serverstatus.Opcounters;
import io.github.kalejandro.monitor.monitorbackend.domain.serverstatus.ServerStatus;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.scheduling.TaskScheduler;

import java.util.concurrent.ScheduledFuture;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class MonitorServiceTest {
  @Mock
  private MonitorConfig monitorConfig;
  @Mock
  private MongoService mongoService;
  @Mock
  private WebSocketService webSocketService;
  @Mock
  private TaskScheduler taskScheduler;
  @InjectMocks
  private MonitorService monitorService;
  @Captor
  ArgumentCaptor<Runnable> runnableArgumentCaptor;
  @Captor
  ArgumentCaptor<Long> longArgumentCaptor;
  @Captor
  ArgumentCaptor<Message> messageArgumentCaptor;
  @Mock
  ScheduledFuture<?> scheduledFuture;

  @Before
  public void setUp() {
  }

  @Test
  public void getInfo_returnMonitorInfo() {
    when(monitorConfig.getMongoClientURI()).thenReturn("The client URI");
    when(monitorConfig.getServerSelectionTimeout()).thenReturn(2000);
    when(monitorConfig.getUpdateFrequency()).thenReturn(2000L);

    Info expectedMonitorStatus = new Info("The client URI", 2000, 2000);

    assertThat(monitorService.getInfo()).isEqualToComparingFieldByField(expectedMonitorStatus);
  }

  @Test
  public void handleState_started() {
    Stats stats = new Stats(new ServerStatus("The version", 1000,
        new Connections(1001, 1002),
        new Network(1003, 1004, 1005),
        new Opcounters(1006, 1007, 1008, 1009, 1010, 1011)));

    when(mongoService.getMongoStats()).thenReturn(stats);
    when(monitorConfig.getUpdateFrequency()).thenReturn(2000L);

    monitorService.handleState(new State(MonitorState.STARTED));

    verify(taskScheduler).scheduleWithFixedDelay(runnableArgumentCaptor.capture(), longArgumentCaptor.capture());
    runnableArgumentCaptor.getValue().run();
    verify(webSocketService).sendMongoStats(stats);
    assertThat(longArgumentCaptor.getValue()).isEqualTo(2000);
  }

  @Test
  public void handleState_stopped() {
    monitorService.handleState(new State(MonitorState.STOPPED));
    verify(scheduledFuture, never()).cancel(anyBoolean());
  }

  @Test
  public void handleState_stoppedFromStarted() {
    when(monitorConfig.getUpdateFrequency()).thenReturn(2000L);
    doReturn(scheduledFuture).when(taskScheduler).scheduleWithFixedDelay(any(Runnable.class), anyLong());

    monitorService.handleState(new State(MonitorState.STARTED));
    monitorService.handleState(new State(MonitorState.STOPPED));

    verify(scheduledFuture).cancel(false);
  }

  @Test
  public void handleState_startedFromStarted() {
    when(monitorConfig.getUpdateFrequency()).thenReturn(2000L);
    doReturn(scheduledFuture).when(taskScheduler).scheduleWithFixedDelay(any(Runnable.class), anyLong());
    when(scheduledFuture.isCancelled()).thenReturn(false);

    monitorService.handleState(new State(MonitorState.STARTED));
    monitorService.handleState(new State(MonitorState.STARTED));

    verify(taskScheduler, times(1)).scheduleWithFixedDelay(any(Runnable.class), anyLong());
  }

  @Test
  public void handleState_startedFromStopped() {
    when(monitorConfig.getUpdateFrequency()).thenReturn(2000L);
    doReturn(scheduledFuture).when(taskScheduler).scheduleWithFixedDelay(any(Runnable.class), anyLong());
    when(scheduledFuture.isCancelled()).thenReturn(true);

    monitorService.handleState(new State(MonitorState.STARTED));
    monitorService.handleState(new State(MonitorState.STOPPED));
    monitorService.handleState(new State(MonitorState.STARTED));

    verify(taskScheduler, times(2)).scheduleWithFixedDelay(any(Runnable.class), anyLong());
  }

  @Test
  public void handleState_monitorException() {
    MonitorException ex = new TimeoutException();
    when(mongoService.getMongoStats()).thenThrow(new TimeoutException());
    when(monitorConfig.getUpdateFrequency()).thenReturn(2000L);

    monitorService.handleState(new State(MonitorState.STARTED));

    verify(taskScheduler).scheduleWithFixedDelay(runnableArgumentCaptor.capture(), anyLong());
    runnableArgumentCaptor.getValue().run();
    verify(webSocketService).sendMessage(messageArgumentCaptor.capture());
    Message message = messageArgumentCaptor.getValue();
    assertThat(message.getHeader()).isEqualTo(ex.getMessageHeaderString());
    assertThat(message.getBody()).isEqualTo(ex.getMessage());
  }
}
