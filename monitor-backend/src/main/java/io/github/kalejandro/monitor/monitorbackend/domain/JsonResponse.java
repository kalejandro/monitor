package io.github.kalejandro.monitor.monitorbackend.domain;

import org.springframework.http.HttpStatus;

public class JsonResponse {
  private int status;
  private String message;

  public JsonResponse(HttpStatus httpStatus, String message) {
    this.status = httpStatus.value();
    this.message = message;
  }

  public int getStatus() {
    return status;
  }

  public void setStatus(int status) {
    this.status = status;
  }

  public String getMessage() {
    return message;
  }

  public void setMessage(String message) {
    this.message = message;
  }
}
