package io.github.kalejandro.monitor.monitorbackend.validator;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.kalejandro.monitor.monitorbackend.domain.State;
import org.junit.Before;
import org.junit.Test;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.Errors;

import java.lang.reflect.Constructor;

import static org.assertj.core.api.Assertions.assertThat;

public class StateValidatorTest {
  private StateValidator stateValidator;
  private ObjectMapper objectMapper;

  @Before
  public void setUp() {
    stateValidator = new StateValidator();
    objectMapper = new ObjectMapper();
  }

  @Test
  public void validate_validState() throws Exception {
    State state = objectMapper.readValue("{\"value\":\"STARTED\"}", State.class);
    Errors errors = new BeanPropertyBindingResult(state, "state");
    stateValidator.validate(state, errors);

    assertThat(errors.hasErrors()).isFalse();
  }

  @Test
  public void validate_invalidState() throws Exception {
    State state = objectMapper.readValue("{\"value\":\"INVALID STATE\"}", State.class);
    Errors errors = new BeanPropertyBindingResult(state, "state");
    stateValidator.validate(state, errors);

    assertThat(errors.hasErrors()).isTrue();
  }

  @Test
  public void validate_emptyState() throws Exception {
    State state = objectMapper.readValue("{\"value\":\"\"}", State.class);
    Errors errors = new BeanPropertyBindingResult(state, "state");
    stateValidator.validate(state, errors);

    assertThat(errors.hasErrors()).isTrue();
  }

  @Test
  public void validate_nullState() throws Exception {
    Constructor<State> constructor = State.class.getDeclaredConstructor();
    constructor.setAccessible(true);
    State state = constructor.newInstance();
    Errors errors = new BeanPropertyBindingResult(state, "state");
    stateValidator.validate(state, errors);

    assertThat(errors.hasErrors()).isTrue();
  }
}
