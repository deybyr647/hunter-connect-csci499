package com.hunter_connect.handlers;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import com.hunter_connect.models.User;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.function.ServerRequest;
import org.springframework.web.servlet.function.ServerResponse;

import java.net.URI;
import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

/**
 * Handles the business logic for user-related requests.
 * The @Component annotation allows Spring to detect and inject this class.
 */

@Component
public class UserHandler {

    private final Map<Long, User> users = new ConcurrentHashMap<>();

    public UserHandler() {
    }

    /**
     * Handles GET /api/users
     * Fetches ALL users from the Firestore collection.
     */
    public ServerResponse getAllUsers(ServerRequest request) {
        try {
            Firestore db = FirestoreClient.getFirestore();

            // 1. Get the entire collection
            // NOTE: In production, consider adding .limit(50) here!
            ApiFuture<QuerySnapshot> future = db.collection("users").limit(50).get();

            // 2. Wait for the query to complete
            List<QueryDocumentSnapshot> documents = future.get().getDocuments();

            // 3. Convert Firestore documents to User objects
            List<User> userList = documents.stream()
                    .map(document -> document.toObject(User.class))
                    .collect(Collectors.toList());

            // 4. Return the list (Spring will serialize this as a JSON Array)
            return ServerResponse.ok().body(userList);

        } catch (Exception e) {
            e.printStackTrace();
            return ServerResponse.badRequest().body("Error fetching users: " + e.getMessage());
        }
    }

    /**
     * Handles GET /api/users/{id}
     * Fetches a single user document by UID.
     */
    public ServerResponse getUserById(ServerRequest request) {
        try {
            // 1. Extract the UID from the URL path parameter
            String targetUid = request.pathVariable("id");

            // 2. Get Firestore instance
            Firestore db = FirestoreClient.getFirestore();

            // 3. Create a query to get the document
            ApiFuture<DocumentSnapshot> future = db.collection("users").document(targetUid).get();

            // 4. Wait for the result (synchronously)
            DocumentSnapshot document = future.get();

            // 5. Check if the document exists
            if (document.exists()) {
                // Convert the Firestore document directly into your User POJO
                User user = document.toObject(User.class);

                // Return user object
                assert user != null;
                return ServerResponse.ok().body(user);
            } else {
                return ServerResponse.notFound().build();
            }

        } catch (Exception e) {
            e.printStackTrace();
            return ServerResponse.badRequest().body("Error fetching user: " + e.getMessage());
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
