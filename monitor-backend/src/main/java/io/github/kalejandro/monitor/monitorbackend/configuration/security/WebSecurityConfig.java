package io.github.kalejandro.monitor.monitorbackend.configuration.security;

import org.springframework.context.annotation.Profile;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@Profile("!test")
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
  @Override
  protected void configure(HttpSecurity httpSecurity) throws Exception {

    /*
      TODO:
      This disables the default Spring security configuration and will be customized after adding authentication to the
      frontend.
    */
    httpSecurity
        .csrf().disable()
        .authorizeRequests()
        .anyRequest().permitAll();
  }
}
