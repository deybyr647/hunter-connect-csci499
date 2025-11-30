package com.hunter_connect.handlers;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.WriteResult;
import com.google.firebase.cloud.FirestoreClient;
import com.hunter_connect.models.User;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.function.ServerRequest;
import org.springframework.web.servlet.function.ServerResponse;

import java.io.IOException;
import java.net.URI;
import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Handles the business logic for user-related requests.
 * The @Component annotation allows Spring to detect and inject this class.
 */

record UserRegistrationRequest(String uid, String firstName, String lastName, String email) {}

@Component
public class UserHandler {

    private final Map<Long, User> users = new ConcurrentHashMap<>();

    public UserHandler() {
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

    public ServerResponse createUser(ServerRequest request) {
        try {
            // 1. Get the SECURE uid from the Auth Token (Principal)
            // This ensures we know exactly who is making the request.
            Principal principal = request.principal()
                    .orElseThrow(() -> new SecurityException("No auth token found"));
            String authenticatedUid = principal.getName();

            // 2. Deserialize the JSON body directly into your User POJO
            // Spring automatically maps the JSON fields (firstName, etc.) to your class.
            User newUser = request.body(User.class);

            // 3. SECURITY STEP: Overwrite the UID in the POJO with the secure one.
            // This prevents a user from sending someone else's UID in the body.
            newUser.setUid(authenticatedUid);

            // 4. Save directly to Firestore
            Firestore db = FirestoreClient.getFirestore();
            
            // We use .set() to create the document at the specific ID "authenticatedUid"
            ApiFuture<WriteResult> future = db.collection("users")
                    .document(authenticatedUid)
                    .set(newUser);

            // Wait for the write to complete
            WriteResult result = future.get();

            // 5. Return success response
            return ServerResponse.created(URI.create("/api/users/" + authenticatedUid))
                    .body(newUser);

        } catch (Exception e) {
            e.printStackTrace();
            return ServerResponse.badRequest().body("Error creating user: " + e.getMessage());
        }
    }
}
