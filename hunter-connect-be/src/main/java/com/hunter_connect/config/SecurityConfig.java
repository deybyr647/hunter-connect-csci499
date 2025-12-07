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
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private FirebaseSecurityFilter firebaseSecurityFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
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
                        .requestMatchers("/api/posts/**").authenticated()
                        .requestMatchers("/api/events/**").authenticated()

                        // Secure all other /api/ routes
                        .requestMatchers("/api/**").authenticated()

                        // By default, deny any request that doesn't match a rule
                        .anyRequest().denyAll()
                );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Allow React Native app's origin.
        // For dev, you can use "*" to allow all, or specify "http://localhost:8081" etc.
        configuration.setAllowedOrigins(List.of("*"));

        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}