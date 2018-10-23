package io.github.kalejandro.monitor.monitorbackend.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WevMvcConfig implements WebMvcConfigurer {
  public static final String ROOT_VIEW_NAME = "forward:/";

  @Override
  public void addViewControllers(ViewControllerRegistry registry) {
    registry.addViewController("/dashboard").setViewName(ROOT_VIEW_NAME);
    registry.addViewController("/notFound").setViewName(ROOT_VIEW_NAME);
  }
}
