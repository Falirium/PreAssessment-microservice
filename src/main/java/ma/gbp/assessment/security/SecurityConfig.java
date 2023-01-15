package ma.gbp.assessment.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

import ma.gbp.assessment.service.MyUserDetailsService;

@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter{

@Autowired
private MyAuthenticationProvider authenticationProvider;

@Autowired
private MyUserDetailsService userDetailsService;

@Override
public void configure(WebSecurity web) throws Exception {
web
    .ignoring()
        .antMatchers("/login")
        .antMatchers("/assets/**");
}


@Override
protected void configure(HttpSecurity http) throws Exception {
    http
    .authenticationProvider(authenticationProvider)
    .userDetailsService(userDetailsService)
    .formLogin()
        .loginPage("/login")
        .permitAll()
    .and()
    .authorizeRequests()
        .anyRequest().authenticated()
    .and()
    .logout()
        .logoutSuccessUrl("/logout-success")
        .permitAll();
}
}
