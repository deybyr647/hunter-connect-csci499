package com.hunter_connect.handlers;

import com.hunter_connect.models.User;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.function.ServerRequest;
import org.springframework.web.servlet.function.ServerResponse;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Handles the business logic for user-related requests.
 * The @Component annotation allows Spring to detect and inject this class.
 */
@Component
public class UserHandler {

    private final Map<Long, User> users = new ConcurrentHashMap<>();
    private final AtomicLong counter = new AtomicLong();

    public UserHandler() {
        users.put(counter.incrementAndGet(), new User(counter.get(), "Alice", "alice@example.com"));
        users.put(counter.incrementAndGet(), new User(counter.get(), "Bob", "bob@example.com"));
    }

    public ServerResponse getAllUsers(ServerRequest request) throws IOException {
        List<User> userList = new ArrayList<>(users.values());
        return ServerResponse.ok().body(userList);
    }

    public ServerResponse getUserById(ServerRequest request) throws IOException {
        long userId = Long.parseLong(request.pathVariable("id"));
        User user = users.get(userId);

        if (user != null) {
            return ServerResponse.ok().body(user);
        } else {
            return ServerResponse.notFound().build();
        }
    }

    public ServerResponse createUser(ServerRequest request) throws IOException {
        try {
            User newUserRequest = request.body(User.class);
            long newId = counter.incrementAndGet();
            User newUser = new User(newId, newUserRequest.getName(), newUserRequest.getEmail());
            users.put(newId, newUser);
            return ServerResponse.status(201).body(newUser);
        } catch (Exception e) {
            return ServerResponse.badRequest().body("Invalid user data: " + e.getMessage());
        }
    }
}
