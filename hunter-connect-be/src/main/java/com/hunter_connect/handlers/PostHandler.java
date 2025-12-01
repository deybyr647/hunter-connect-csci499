package com.hunter_connect.handlers;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import com.hunter_connect.models.Post;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.function.ServerRequest;
import org.springframework.web.servlet.function.ServerResponse;

import java.net.URI;
import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Handles the business logic for post-related requests.
 * The @Component annotation allows Spring to detect and inject this class.
 */

@Component
public class PostHandler {

    public PostHandler() {
    }

    /**
     * Handles GET /api/posts
     * Fetches ALL posts from the Firestore collection.
     */
    public ServerResponse getAllPosts(ServerRequest request) {
        try {
            Firestore db = FirestoreClient.getFirestore();

            // 1. Get the entire collection
            // NOTE: In production, consider adding .limit(50) here!
            ApiFuture<QuerySnapshot> future = db.collection("posts").limit(50).get();

            // 2. Wait for the query to complete
            List<QueryDocumentSnapshot> documents = future.get().getDocuments();

            // 3. Convert Firestore documents to User objects
            List<Post> postList = documents.stream()
                    .map(document -> document.toObject(Post.class))
                    .collect(Collectors.toList());

            // 4. Return the list (Spring will serialize this as a JSON Array)
            return ServerResponse.ok().body(postList);

        } catch (Exception e) {
            e.printStackTrace();
            return ServerResponse.badRequest().body("Error fetching posts: " + e.getMessage());
        }
    }

    /**
     * Handles GET /api/posts/{id}
     * Fetches a single post document by UID.
     */
    public ServerResponse getPostById(ServerRequest request) {
        try {
            // 1. Extract the UID from the URL path parameter
            String targetUid = request.pathVariable("id");

            // 2. Get Firestore instance
            Firestore db = FirestoreClient.getFirestore();

            // 3. Create a query to get the document
            ApiFuture<DocumentSnapshot> future = db.collection("posts").document(targetUid).get();

            // 4. Wait for the result (synchronously)
            DocumentSnapshot document = future.get();

            // 5. Check if the document exists
            if (document.exists()) {
                // Convert the Firestore document directly into your User POJO
                Post post = document.toObject(Post.class);

                // Return user object
                assert post != null;
                return ServerResponse.ok().body(post);
            } else {
                return ServerResponse.notFound().build();
            }

        } catch (Exception e) {
            e.printStackTrace();
            return ServerResponse.badRequest().body("Error fetching post: " + e.getMessage());
        }
    }

    /**
     * Handles POST /api/posts/{id}
     * Creates single post document by UID
     */
    public ServerResponse createPost(ServerRequest request) {
        try {
            // 1. Get the SECURE uid from the Auth Token (Principal)
            Principal principal = request.principal()
                    .orElseThrow(() -> new SecurityException("No auth token found"));
            String authenticatedUid = principal.getName();

            // 2. Deserialize the JSON body directly into your User POJO
            Post newPost = request.body(Post.class);

            // 3. SECURITY STEP: Overwrite the UID in the POJO with the secure one.
            newPost.setUid(authenticatedUid);

            // 4. Save directly to Firestore
            Firestore db = FirestoreClient.getFirestore();

            // We use .set() to create the document at the specific ID "authenticatedUid"
            ApiFuture<WriteResult> future = db.collection("posts")
                    .document(authenticatedUid)
                    .set(newPost);

            // Wait for write to complete
            WriteResult result = future.get();

            // 5. Return success response
            return ServerResponse.created(URI.create("/api/posts/" + authenticatedUid))
                    .body(newPost);

        } catch (Exception e) {
            e.printStackTrace();
            return ServerResponse.badRequest().body("Error creating post: " + e.getMessage());
        }
    }

    /**
     * Handles PUT /api/posts
     * Updates the post.
     * Maps the JSON body (including nested Preferences) to the Post object.
     */
    public ServerResponse updatePost(ServerRequest request) {
        try {
            // 1. SECURITY: Determine WHO is making the request from the token
            Principal principal = request.principal()
                    .orElseThrow(() -> new SecurityException("No auth token found"));
            String authenticatedUid = principal.getName();

            // 2. Deserialize the JSON body directly into your updated Post POJO
            // This automagically maps 'preferences' and other nested objects.
            Post updates = request.body(Post.class);

            // 3. Construct a Map of ONLY the fields we want to update.
            // This prevents overwriting existing data with null/empty values.
            Map<String, Object> dataToUpdate = new HashMap<>();

            if (updates.getTimestamp() != null && !updates.getTimestamp().toString().isEmpty()) {
                dataToUpdate.put("timestamp", updates.getTimestamp());
            }
            if (updates.getContent() != null && !updates.getContent().isEmpty()) {
                dataToUpdate.put("content", updates.getContent());
            }
            if (updates.getTitle() != null && !updates.getTitle().isEmpty()) {
                dataToUpdate.put("title", updates.getTitle());
            }

            // Logging for debugging
            System.out.println("Fields being updated: " + dataToUpdate.keySet());

            // 4. Save to Firestore using MERGE
            Firestore db = FirestoreClient.getFirestore();

            // SetOptions.merge() combined with our filtered Map ensures that
            // omitted (empty) fields in 'dataToUpdate' are NOT touched in the database.
            ApiFuture<WriteResult> future = db.collection("posts")
                    .document(authenticatedUid)
                    .set(dataToUpdate, SetOptions.merge());

            WriteResult result = future.get();
            System.out.println("Update successful at: " + result.getUpdateTime());

            // Return the updates object (or you could return the dataToUpdate map)
            return ServerResponse.ok().body(updates);

        } catch (Exception e) {
            e.printStackTrace();
            return ServerResponse.badRequest().body("Error updating post: " + e.getMessage());
        }
    }
}