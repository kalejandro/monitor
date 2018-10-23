package io.github.kalejandro.monitor.monitorbackend.validator;

import io.github.kalejandro.monitor.monitorbackend.constants.MonitorState;
import io.github.kalejandro.monitor.monitorbackend.domain.State;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.ValidationUtils;
import org.springframework.validation.Validator;

@Component
public class StateValidator implements Validator {
  @Override
  public boolean supports(Class<?> aClass) {
    return State.class.equals(aClass);
  }

  @Override
  public void validate(Object o, Errors errors) {
    State state = (State) o;

    ValidationUtils.rejectIfEmptyOrWhitespace(errors, "value", "state.empty", "State value is required");

    String value = state.getValue();
    if (value == null || value.trim().length() == 0) {
      return;
    }

    try {
      MonitorState.valueOf(value);
    } catch (IllegalArgumentException ex) {
      errors.rejectValue("value", "state.invalid", "Invalid state: " + value);
    }
  }
}
