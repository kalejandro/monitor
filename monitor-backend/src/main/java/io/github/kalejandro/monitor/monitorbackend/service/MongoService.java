package io.github.kalejandro.monitor.monitorbackend.service;

import com.mongodb.MongoException;
import com.mongodb.MongoTimeoutException;
import io.github.kalejandro.monitor.monitorbackend.constants.MongoErrorCode;
import io.github.kalejandro.monitor.monitorbackend.domain.Stats;
import io.github.kalejandro.monitor.monitorbackend.domain.serverstatus.ServerStatus;
import io.github.kalejandro.monitor.monitorbackend.exception.monitor.CommandFailureException;
import io.github.kalejandro.monitor.monitorbackend.exception.monitor.TimeoutException;
import io.github.kalejandro.monitor.monitorbackend.exception.monitor.UnauthorizedException;
import org.bson.Document;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Service;

@Service
public class MongoService {
  private static final Logger logger = LoggerFactory.getLogger(MongoService.class);
  private MongoTemplate mongoTemplate;

  @Autowired
  public MongoService(MongoTemplate mongoTemplate) {
    this.mongoTemplate = mongoTemplate;
  }

  public Stats getMongoStats() {
    try {
      return new Stats(convertDocumentToServerStatus(runServerStatus()));
    } catch (MongoTimeoutException ex) {
      throw new TimeoutException();
    } catch (MongoException ex) {
      if(ex.getCode() == MongoErrorCode.UNAUTHORIZED.getValue()) {
        throw new UnauthorizedException();
      }
      logger.error(ex.getMessage());
      throw new CommandFailureException(ex.getMessage());
    }
  }

  private ServerStatus convertDocumentToServerStatus(Document document) {
    return mongoTemplate.getConverter().read(ServerStatus.class, document);
  }

  private Document runServerStatus() {

    /*
    Use MongoDatabase#runCommand() instead of MongoTemplate#executeCommand()

    MongoDatabase#runCommand() throws MongoCommandException, which has a method to get the error code.
    The error code is used to check if the command failed because the user is unauthorized to run the command.
   */
    return mongoTemplate.getDb().runCommand(getServerStatusDocument());
  }

  private Document getServerStatusDocument() {
    return new Document()
        .append("serverStatus", 1)
        .append("asserts", 0)
        .append("extra_info", 0)
        .append("freeMonitoring", 0)
        .append("globalLock", 0)
        .append("locks", 0)
        .append("logicalSessionRecordCache", 0)
        .append("opLatencies", 0)
        .append("opcountersRepl", 0)
        .append("storageEngine", 0)
        .append("tcmalloc", 0)
        .append("transactions", 0)
        .append("transportSecurity", 0)
        .append("wiredTiger", 0)
        .append("mem", 0)
        .append("metrics", 0);
  }
}
