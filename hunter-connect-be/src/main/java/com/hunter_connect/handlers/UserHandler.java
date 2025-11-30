package com.hunter_connect.handlers;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.SetOptions;
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
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

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
            Principal principal = request.principal()
                    .orElseThrow(() -> new SecurityException("No auth token found"));
            String authenticatedUid = principal.getName();

            // 2. Deserialize the JSON body directly into your User POJO
            User newUser = request.body(User.class);

            // 3. SECURITY STEP: Overwrite the UID in the POJO with the secure one.
            newUser.setUid(authenticatedUid);

            // 4. Save directly to Firestore
            Firestore db = FirestoreClient.getFirestore();

            // We use .set() to create the document at the specific ID "authenticatedUid"
            ApiFuture<WriteResult> future = db.collection("users")
                    .document(authenticatedUid)
                    .set(newUser);

            // Wait for write to complete
            WriteResult result = future.get();

            // 5. Return success response
            return ServerResponse.created(URI.create("/api/users/" + authenticatedUid))
                    .body(newUser);

        } catch (Exception e) {
            e.printStackTrace();
            return ServerResponse.badRequest().body("Error creating user: " + e.getMessage());
        }
    }

    /**
     * Handles PUT /api/users
     * Updates the authenticated user's profile.
     * Maps the JSON body (including nested Preferences) to the User object.
     */
    public ServerResponse updateUser(ServerRequest request) {
        try {
            // 1. SECURITY: Determine WHO is making the request from the token
            Principal principal = request.principal()
                    .orElseThrow(() -> new SecurityException("No auth token found"));
            String authenticatedUid = principal.getName();

            // 2. Deserialize the JSON body directly into your updated User POJO
            // This automagically maps 'preferences' and other nested objects.
            User updates = request.body(User.class);

            // 3. Construct a Map of ONLY the fields we want to update.
            // This prevents overwriting existing data with null/empty values.
            Map<String, Object> dataToUpdate = new HashMap<>();

            if (updates.getFirstName() != null && !updates.getFirstName().isEmpty()) {
                dataToUpdate.put("firstName", updates.getFirstName());
            }
            if (updates.getLastName() != null && !updates.getLastName().isEmpty()) {
                dataToUpdate.put("lastName", updates.getLastName());
            }
            if (updates.getEmail() != null && !updates.getEmail().isEmpty()) {
                dataToUpdate.put("email", updates.getEmail());
            }
            // Always include preferences if they are present in the request
            if (updates.getPreferences() != null) {
                dataToUpdate.put("preferences", updates.getPreferences());
            }

            // Logging for debugging
            System.out.println("Processing update for UID: " + authenticatedUid);
            System.out.println("Fields being updated: " + dataToUpdate.keySet());

            // 4. Save to Firestore using MERGE
            Firestore db = FirestoreClient.getFirestore();

            // SetOptions.merge() combined with our filtered Map ensures that
            // omitted (empty) fields in 'dataToUpdate' are NOT touched in the database.
            ApiFuture<WriteResult> future = db.collection("users")
                    .document(authenticatedUid)
                    .set(dataToUpdate, SetOptions.merge());

            WriteResult result = future.get();
            System.out.println("Update successful at: " + result.getUpdateTime());

            // Return the updates object (or you could return the dataToUpdate map)
            return ServerResponse.ok().body(updates);

        } catch (Exception e) {
            e.printStackTrace();
            return ServerResponse.badRequest().body("Error updating user: " + e.getMessage());
        }
    }
}
