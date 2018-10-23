package io.github.kalejandro.monitor.monitorbackend.controller;

import io.github.kalejandro.monitor.monitorbackend.domain.State;
import io.github.kalejandro.monitor.monitorbackend.exception.web.InvalidStateException;
import io.github.kalejandro.monitor.monitorbackend.service.MonitorService;
import io.github.kalejandro.monitor.monitorbackend.validator.StateValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.Errors;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/monitor")
public class MonitorController {
  private MonitorService monitorService;
  private StateValidator stateValidator;

  @Autowired
  public MonitorController(MonitorService monitorService, StateValidator stateValidator) {
    this.monitorService = monitorService;
    this.stateValidator = stateValidator;
  }

  @PutMapping(value = "/state")
  public ResponseEntity<State> state(@RequestBody State state, Errors errors) {
    stateValidator.validate(state, errors);
    if (errors.hasErrors()) {
      throw new InvalidStateException();
    }
    monitorService.handleState(state);
    return new ResponseEntity<>(state, HttpStatus.OK);
  }
}
