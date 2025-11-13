package com.hunter_connect.config;

import com.hunter_connect.handlers.FileHandler;
import com.hunter_connect.handlers.UserHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.servlet.function.RouterFunction;
import org.springframework.web.servlet.function.ServerRequest;
import org.springframework.web.servlet.function.ServerResponse;

import static org.springframework.web.servlet.function.RouterFunctions.route;

/**
 * Central configuration for all API routes.
 * Spring will automatically scan and use this configuration.
 */
@Configuration
public class RouterFunctionConfig {

    @Bean
    public RouterFunction<ServerResponse> userRoutes(UserHandler userHandler) {
        return route()
                .path("/api/users", builder -> builder
                        // Public Routes
                        .POST("", userHandler::createUser)

                        // Protected Routes (filter applied to individual paths/methods)
                        .path("", protectedBuilder -> protectedBuilder
                                .before(this::requireAuthentication)
                                .GET("", userHandler::getAllUsers)
                                .GET("/{id}", userHandler::getUserById)
                        )
                ).build();
    }

    @Bean
    public RouterFunction<ServerResponse> fileRoutes(FileHandler fileHandler) {
        return route()
                .path("/api/files", builder -> builder
                        // Filter applied to every route under /api/files/*
                        .before(this::requireAuthentication) // <-- Filter applied here

                        .GET("", fileHandler::getAllFiles)
                        .POST("", fileHandler::createFile)
                        .GET("/{id}", fileHandler::getFileById)
                ).build();
    }

    // Authentication Middleware Function
    private ServerRequest requireAuthentication(ServerRequest request) {
        var authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal() == null) {
            throw new SecurityException("Unauthorized: A valid Firebase token is required");
        }

        return request;
    }
}

