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
import java.util.stream.Collectors;

@Component
public class UserHandler {

    /* ============================================================
     * GET /api/users — return ALL users
     * ============================================================ */
    public ServerResponse getAllUsers(ServerRequest request) {
        try {
            Firestore db = FirestoreClient.getFirestore();
            ApiFuture<QuerySnapshot> future = db.collection("users").get();

            List<User> users = future.get().getDocuments()
                    .stream()
                    .map(doc -> doc.toObject(User.class))
                    .collect(Collectors.toList());

            return ServerResponse.ok().body(users);

        } catch (Exception e) {
            e.printStackTrace();
            return ServerResponse.badRequest().body("Error fetching users: " + e.getMessage());
        }
    }

    /* ============================================================
     * GET /api/users/{id} — get a single user document
     * ============================================================ */
    public ServerResponse getUserById(ServerRequest request) {
        try {
            String uid = request.pathVariable("id");

            Firestore db = FirestoreClient.getFirestore();
            ApiFuture<DocumentSnapshot> future = db.collection("users")
                    .document(uid)
                    .get();

            DocumentSnapshot doc = future.get();

            if (!doc.exists()) {
                return ServerResponse.notFound().build();
            }

            User user = doc.toObject(User.class);
            return ServerResponse.ok().body(user);

        } catch (Exception e) {
            e.printStackTrace();
            return ServerResponse.badRequest().body("Error fetching user: " + e.getMessage());
        }
    }

    /* ============================================================
     * POST /api/users — Create new user
     * Authenticated UID controls Firestore document ID
     * ============================================================ */
    public ServerResponse createUser(ServerRequest request) {
        try {
            // ----- AUTH CHECK -----
            Principal principal = request.principal()
                    .orElseThrow(() -> new SecurityException("Missing authentication token"));

            String authenticatedUid = principal.getName();

            // ----- DESERIALIZE BODY -----
            User user = request.body(User.class);

            // **Always enforce UID from token**
            user.setUid(authenticatedUid);

            // Initialize empty lists if null — Firestore requires non-null arrays
            if (user.getIncomingRequests() == null) user.setIncomingRequests(List.of());
            if (user.getOutgoingRequests() == null) user.setOutgoingRequests(List.of());
            if (user.getFriends() == null) user.setFriends(List.of());

            Firestore db = FirestoreClient.getFirestore();

            ApiFuture<WriteResult> future =
                    db.collection("users").document(authenticatedUid).set(user);

            future.get(); // wait for write

            return ServerResponse.created(URI.create("/api/users/" + authenticatedUid))
                    .body(user);

        } catch (Exception e) {
            e.printStackTrace();
            return ServerResponse.badRequest().body("Error creating user: " + e.getMessage());
        }
    }

    /* ============================================================
     * PUT /api/users — Update profile safely using MERGE
     * Only overwrites fields sent in the request
     * ============================================================ */
    public ServerResponse updateUser(ServerRequest request) {
        try {
            // ----- AUTH CHECK -----
            Principal principal = request.principal()
                    .orElseThrow(() -> new SecurityException("Missing authentication token"));

            String authenticatedUid = principal.getName();

            // ----- BODY → POJO -----
            User updates = request.body(User.class);

            Map<String, Object> updateMap = new HashMap<>();

            // Only include fields that are not null
            if (updates.getFirstName() != null) updateMap.put("firstName", updates.getFirstName());
            if (updates.getLastName() != null) updateMap.put("lastName", updates.getLastName());
            if (updates.getEmail() != null) updateMap.put("email", updates.getEmail());
            if (updates.getUsername() != null) updateMap.put("username", updates.getUsername());
            if (updates.getPreferences() != null) updateMap.put("preferences", updates.getPreferences());

            // Friend arrays — only included when explicitly sent
            if (updates.getIncomingRequests() != null)
                updateMap.put("incomingRequests", updates.getIncomingRequests());
            if (updates.getOutgoingRequests() != null)
                updateMap.put("outgoingRequests", updates.getOutgoingRequests());
            if (updates.getFriends() != null)
                updateMap.put("friends", updates.getFriends());

            // ----- UPDATE -----
            Firestore db = FirestoreClient.getFirestore();
            ApiFuture<WriteResult> future =
                    db.collection("users")
                            .document(authenticatedUid)
                            .set(updateMap, SetOptions.merge());

            future.get();

            return ServerResponse.ok().body(updateMap);

        } catch (Exception e) {
            e.printStackTrace();
            return ServerResponse.badRequest().body("Error updating user: " + e.getMessage());
        }
    }
}
