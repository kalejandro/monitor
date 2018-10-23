package io.github.kalejandro.monitor.monitorbackend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.kalejandro.monitor.monitorbackend.constants.MessageHeader;
import io.github.kalejandro.monitor.monitorbackend.constants.StompDestination;
import io.github.kalejandro.monitor.monitorbackend.domain.Message;
import io.github.kalejandro.monitor.monitorbackend.domain.Stats;
import io.github.kalejandro.monitor.monitorbackend.domain.serverstatus.Connections;
import io.github.kalejandro.monitor.monitorbackend.domain.serverstatus.Network;
import io.github.kalejandro.monitor.monitorbackend.domain.serverstatus.Opcounters;
import io.github.kalejandro.monitor.monitorbackend.domain.serverstatus.ServerStatus;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.messaging.simp.stomp.StompFrameHandler;
import org.springframework.messaging.simp.stomp.StompHeaders;
import org.springframework.messaging.simp.stomp.StompSession;
import org.springframework.messaging.simp.stomp.StompSessionHandlerAdapter;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;
import org.springframework.web.socket.messaging.WebSocketStompClient;
import org.springframework.web.socket.sockjs.client.SockJsClient;
import org.springframework.web.socket.sockjs.client.Transport;
import org.springframework.web.socket.sockjs.client.WebSocketTransport;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.TimeUnit;

import static org.assertj.core.api.Assertions.assertThat;

@ActiveProfiles("test")
@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class WebSocketServiceIntegrationTest {
  @LocalServerPort
  private int port;
  private WebSocketStompClient webSocketStompClient;
  private StompSession stompSession;
  private BlockingQueue<String> blockingQueue;
  @Autowired
  private WebSocketService webSocketService;

  @Before
  public void setUp() throws Exception {
    List<Transport> transportList = new ArrayList<>();
    transportList.add(new WebSocketTransport(new StandardWebSocketClient()));
    webSocketStompClient = new WebSocketStompClient(new SockJsClient(transportList));
    blockingQueue= new LinkedBlockingQueue<>();
    stompSession = webSocketStompClient.connect("ws://localhost:" + port + "/wsocket",
        new TestStompSessionHandlerAdapter()).get(1000, TimeUnit.MILLISECONDS);
  }

  @After
  public void tearDown() {
    stompSession.disconnect();
  }

  @Test
  public void sendMessage() throws Exception {
    Message message = new Message(MessageHeader.TIMEOUT.getValue(), "The message body");

    StompSession.Subscription subscription = stompSession.subscribe(StompDestination.CONTROL.getValue(),
        new TestStompFrameHandler());

    // Make sure the subscription is ready
    Thread.sleep(10);
    webSocketService.sendMessage(message);
    String receivedJsonMessage = blockingQueue.poll(1000, TimeUnit.MILLISECONDS);
    subscription.unsubscribe();

    String jsonMessage = new ObjectMapper().writeValueAsString(message);
    assertThat(receivedJsonMessage).isEqualTo(jsonMessage);
  }

  @Test
  public void sendMongoStats() throws Exception{
    Stats stats = new Stats(new ServerStatus("The version", 1000,
        new Connections(1001, 1002),
        new Network(1003, 1004, 1005),
        new Opcounters(1006, 1007, 1008, 1009, 1010, 1011)));

    StompSession.Subscription subscription = stompSession.subscribe(StompDestination.STATS.getValue(),
        new TestStompFrameHandler());

    // Make sure the subscription is ready
    Thread.sleep(10);
    webSocketService.sendMongoStats(stats);
    String receivedJsonStats = blockingQueue.poll(1000, TimeUnit.MILLISECONDS);
    subscription.unsubscribe();

    String jsonStats = new ObjectMapper().writeValueAsString(stats);
    assertThat(receivedJsonStats).isEqualTo(jsonStats);
  }

  private class TestStompFrameHandler implements StompFrameHandler {
    @Override
    public Type getPayloadType(StompHeaders stompHeaders) {
      return byte[].class;
    }

    @Override
    public void handleFrame(StompHeaders stompHeaders, Object o) {
      blockingQueue.offer(new String((byte[]) o));
    }
  }

  private static class TestStompSessionHandlerAdapter extends StompSessionHandlerAdapter {
  }
}
