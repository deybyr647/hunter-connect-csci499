package com.hunter_connect.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod; // Import HttpMethod
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private FirebaseSecurityFilter firebaseSecurityFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(firebaseSecurityFilter, UsernamePasswordAuthenticationFilter.class)

                // This is the new, robust security logic
                .authorizeHttpRequests(auth -> auth

                        // Public Routes
                        // Allow "create user" (POST) without auth
                        .requestMatchers(HttpMethod.POST, "/api/users").permitAll()


                        // Secure Routes
                        .requestMatchers("/api/users/**").authenticated()

                        .requestMatchers("/api/files/**").authenticated()

                        // Secure all other /api/ routes
                        .requestMatchers("/api/**").authenticated()

                        // By default, deny any request that doesn't match a rule
                        .anyRequest().denyAll()
                );

        return http.build();
    }
}