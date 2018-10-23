package io.github.kalejandro.monitor.monitorbackend.controller;

import io.github.kalejandro.monitor.monitorbackend.constants.MonitorState;
import io.github.kalejandro.monitor.monitorbackend.domain.State;
import io.github.kalejandro.monitor.monitorbackend.service.MonitorService;
import io.github.kalejandro.monitor.monitorbackend.validator.StateValidator;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ActiveProfiles("test")
@RunWith(SpringRunner.class)
@WebMvcTest(MonitorController.class)
@Import(StateValidator.class)
public class MonitorControllerWebMvcTest {
  @Autowired
  MockMvc mockMvc;
  @MockBean
  private MonitorService monitorService;
  @Captor
  ArgumentCaptor<State> stateArgumentCaptor;

  @Test
  @WithMockUser
  public void state_start() throws Exception {
    mockMvc
        .perform(put("/monitor/state")
            .with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content("{\"value\": \"STARTED\"}")
            .characterEncoding("UTF-8"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.value").value(MonitorState.STARTED.toString()));

    verify(monitorService).handleState(stateArgumentCaptor.capture());
    State state = stateArgumentCaptor.getValue();
    assertThat(state.getValue()).isEqualTo(MonitorState.STARTED.toString());
  }

  @Test
  @WithMockUser
  public void state_stop() throws Exception {
    mockMvc
        .perform(put("/monitor/state")
            .with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content("{\"value\": \"STOPPED\"}")
            .characterEncoding("UTF-8"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.value").value(MonitorState.STOPPED.toString()));

    verify(monitorService).handleState(stateArgumentCaptor.capture());
    State state = stateArgumentCaptor.getValue();
    assertThat(state.getValue()).isEqualTo(MonitorState.STOPPED.toString());
  }

  @Test
  @WithMockUser
  public void state_invalidState() throws Exception {
    mockMvc
        .perform(put("/monitor/state")
            .with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content("{\"value\": \"INVALID STATE\"}")
            .characterEncoding("UTF-8"))
        .andExpect(status().is4xxClientError())
        .andExpect(jsonPath("$.status").value(400))
        .andExpect(jsonPath("$.message").value("Invalid state"));

    verify(monitorService, never()).handleState(any(State.class));
  }

  @Test
  @WithMockUser
  public void state_invalidStateObject() throws Exception {
    mockMvc
        .perform(put("/monitor/state")
            .with(csrf())
            .contentType(MediaType.APPLICATION_JSON)
            .content("{\"attribute\": \"value\"}")
            .characterEncoding("UTF-8"))
        .andExpect(status().is4xxClientError())
        .andExpect(jsonPath("$.status").value(400))
        .andExpect(jsonPath("$.message").value("Invalid state"));

    verify(monitorService, never()).handleState(any(State.class));
  }
}
