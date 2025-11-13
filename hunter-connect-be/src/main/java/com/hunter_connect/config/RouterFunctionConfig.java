package com.hunter_connect.config;

import com.hunter_connect.handlers.FileHandler;
import com.hunter_connect.handlers.UserHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.function.RouterFunction;
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
                        .GET("", userHandler::getAllUsers)
                        .POST("", userHandler::createUser)
                        .GET("/{id}", userHandler::getUserById)
                ).build();
    }

    @Bean
    public RouterFunction<ServerResponse> fileRoutes(FileHandler fileHandler) {
        return route()
                .path("/api/files", builder -> builder
                        .GET("", fileHandler::getAllFiles)
                        .POST("", fileHandler::createFile) // Corresponds to FileHandler::createFile
                        .GET("/{id}", fileHandler::getFileById) // Corresponds to FileHandler::getFileById
                ).build();
    }
}

