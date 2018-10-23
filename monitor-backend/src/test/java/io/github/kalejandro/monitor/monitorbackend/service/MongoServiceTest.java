package io.github.kalejandro.monitor.monitorbackend.service;

import com.mongodb.MongoException;
import com.mongodb.MongoTimeoutException;
import com.mongodb.client.MongoDatabase;
import io.github.kalejandro.monitor.monitorbackend.constants.MongoErrorCode;
import io.github.kalejandro.monitor.monitorbackend.exception.monitor.CommandFailureException;
import io.github.kalejandro.monitor.monitorbackend.exception.monitor.TimeoutException;
import io.github.kalejandro.monitor.monitorbackend.exception.monitor.UnauthorizedException;
import org.bson.Document;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.data.mongodb.core.MongoTemplate;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class MongoServiceTest {
  @Mock
  private MongoTemplate mongoTemplate;
  @Mock
  private MongoDatabase mongoDatabase;
  @InjectMocks
  private MongoService mongoService;

  @Before
  public void setUp() {
    doReturn(mongoDatabase).when(mongoTemplate).getDb();
  }

  @Test(expected = TimeoutException.class)
  public void getMongoStats_MongoTimesOut() {
    when(mongoDatabase.runCommand(any(Document.class))).thenThrow(new MongoTimeoutException("The message"));
    mongoService.getMongoStats();
  }

  @Test(expected = UnauthorizedException.class)
  public void getMongoStats_runCommandFailsWithUnauthorizedError() {
    when(mongoDatabase.runCommand(any(Document.class)))
        .thenThrow(new MongoException(MongoErrorCode.UNAUTHORIZED.getValue(), "The message"));
    mongoService.getMongoStats();
  }

  @Test(expected = CommandFailureException.class)
  public void getMongoStats_runCommandCommandFails() {
    when(mongoDatabase.runCommand(any(Document.class))).thenThrow(new MongoException("The message"));
    mongoService.getMongoStats();
  }
}
