package io.github.kalejandro.monitor.monitorbackend.exception.web;

import io.github.kalejandro.monitor.monitorbackend.domain.JsonResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalMonitorWebExceptionHandler {
  @ExceptionHandler(MonitorWebException.class)
  public ResponseEntity<JsonResponse> monitorWebException(MonitorWebException ex) {
    HttpStatus httpStatus = ex.getHttpStatus();
    JsonResponse jsonResponse = new JsonResponse(httpStatus, ex.getMessage());
    return new ResponseEntity<>(jsonResponse, httpStatus);
  }
}
