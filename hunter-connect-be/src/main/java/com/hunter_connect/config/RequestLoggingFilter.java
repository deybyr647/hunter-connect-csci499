package com.hunter_connect.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * A global filter that logs the Method, URI, Status, and Duration of every request.
 */
@Component
public class RequestLoggingFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // 1. Record Start Time
        long startTime = System.currentTimeMillis();

        try {
            // 2. Allow the request to proceed to your Security Config and Handlers
            filterChain.doFilter(request, response);
        } finally {
            // 3. This block runs AFTER the request is finished (successfully or failed)
            long duration = System.currentTimeMillis() - startTime;
            int status = response.getStatus();
            String method = request.getMethod();
            String uri = request.getRequestURI();

            // 4. Log to Console
            // Format: [METHOD] /path | Status: 200 | Time: 15ms
            System.out.println(String.format(
                    "LOG: [%s] %s | Status: %d | Time: %dms",
                    method,
                    uri,
                    status,
                    duration
            ));
        }
    }
}