package io.github.kalejandro.monitor.monitorbackend.configuration;

import org.springframework.boot.web.server.ErrorPage;
import org.springframework.boot.web.server.ErrorPageRegistrar;
import org.springframework.boot.web.server.ErrorPageRegistry;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;

@Configuration
public class CustomErrorPageRegistrar implements ErrorPageRegistrar {
  @Override
  public void registerErrorPages(ErrorPageRegistry registry) {
    registry.addErrorPages(new ErrorPage(HttpStatus.NOT_FOUND, "/notFound"));
  }
}
