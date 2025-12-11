package com.hunter_connect.handlers;

import com.google.api.core.ApiFuture;
import com.google.cloud.Timestamp;
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
            // In production, consider adding .limit(50) here!
            ApiFuture<QuerySnapshot> future = db.collection("posts").limit(50).get();

            // 2. Wait for the query to complete
            List<QueryDocumentSnapshot> documents = future.get().getDocuments();

            // 3. Convert Firestore documents to Post objects
            List<Post> postList = documents.stream()
                    .map(document -> {
                        Post p = document.toObject(Post.class);
                        // Ensure the ID is set on the object from the doc ID if missing
                        if (p.getPostID() == null) {
                            p.setPostID(document.getId());
                        }
                        return p;
                    })
                    .collect(Collectors.toList());

            // 4. Return the list
            return ServerResponse.ok().body(postList);

        } catch (Exception e) {
            e.printStackTrace();
            return ServerResponse.badRequest().body("Error fetching posts: " + e.getMessage());
        }
    }

    /**
     * Handles GET /api/posts/{id}
     * Fetches a single post document by ID.
     */
    public ServerResponse getPostById(ServerRequest request) {
        try {
            String targetUid = request.pathVariable("id");
            Firestore db = FirestoreClient.getFirestore();

            ApiFuture<DocumentSnapshot> future = db.collection("posts").document(targetUid).get();
            DocumentSnapshot document = future.get();

            if (document.exists()) {
                Post post = document.toObject(Post.class);
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
     * Handles POST /api/posts
     * Creates a single post.
     * Note: The route in RouterFunctionConfig likely maps POST "" -> createPost
     */
    public ServerResponse createPost(ServerRequest request) {
        try {
            // 1. Get the SECURE uid from the Auth Token
            Principal principal = request.principal()
                    .orElseThrow(() -> new SecurityException("No auth token found"));
            String authenticatedUid = principal.getName();

            // 2. Deserialize the JSON body
            Post newPost = request.body(Post.class);

            // 3. Set server-side managed fields
            newPost.setUserID(authenticatedUid);
            // If timestamp wasn't sent, set it to now
            if (newPost.getTimestamp() == null) {
                newPost.setTimestamp(Timestamp.now());
            }

            Firestore db = FirestoreClient.getFirestore();

            // 4. Save to Firestore
            // Use .add() to generate a random ID for the post, OR .document().set() if ID is provided
            // Assuming we want a new random ID for each post:
            ApiFuture<DocumentReference> future = db.collection("posts").add(newPost);

            DocumentReference docRef = future.get();
            String newPostId = docRef.getId();

            // Update the object with its new ID so we can return it correctly
            newPost.setPostID(newPostId);
            // Optionally write the ID back to the doc if your data model requires 'postID' field inside the doc
            docRef.update("postID", newPostId);

            return ServerResponse.created(URI.create("/api/posts/" + newPostId))
                    .body(newPost);

        } catch (Exception e) {
            e.printStackTrace();
            return ServerResponse.badRequest().body("Error creating post: " + e.getMessage());
        }
    }

    /**
     * Handles PUT /api/posts/{id}
     * Updates the post.
     */
    public ServerResponse updatePost(ServerRequest request) {
        try {
            // 1. Security Check
            Principal principal = request.principal()
                    .orElseThrow(() -> new SecurityException("No auth token found"));
            String authenticatedUid = principal.getName();

            // The ID of the POST to update comes from the URL
            String postId = request.pathVariable("id");

            // 2. Deserialize
            Post updates = request.body(Post.class);

            Firestore db = FirestoreClient.getFirestore();
            DocumentReference postRef = db.collection("posts").document(postId);

            // 3. Ownership Check (Critical for posts!)
            // We must verify the user owns the post before letting them edit it.
            DocumentSnapshot existingDoc = postRef.get().get();
            if (!existingDoc.exists()) {
                return ServerResponse.notFound().build();
            }

            String ownerId = existingDoc.getString("userID");
            if (!authenticatedUid.equals(ownerId)) {
                return ServerResponse.status(403).body("You are not the owner of this post.");
            }

            // 4. Construct Update Map
            Map<String, Object> dataToUpdate = new HashMap<>();

            // We update specific fields to avoid overwriting everything with nulls
            if (updates.getContent() != null && !updates.getContent().isEmpty()) {
                dataToUpdate.put("content", updates.getContent());
            }
            if (updates.getTitle() != null && !updates.getTitle().isEmpty()) {
                dataToUpdate.put("title", updates.getTitle());
            }
            if (updates.getLocation() != null) {
                dataToUpdate.put("location", updates.getLocation());
            }
            if (updates.getTags() != null) {
                dataToUpdate.put("tags", updates.getTags());
            }

            // Note: Timestamp is usually not updated on edit, but if you have an 'editedAt' field, set it here.

            System.out.println("Updating post " + postId + " fields: " + dataToUpdate.keySet());

            // 5. Save with Merge
            ApiFuture<WriteResult> future = postRef.set(dataToUpdate, SetOptions.merge());

            WriteResult result = future.get();
            System.out.println("Update successful at: " + result.getUpdateTime());

            return ServerResponse.ok().body(dataToUpdate);

        } catch (Exception e) {
            e.printStackTrace();
            return ServerResponse.badRequest().body("Error updating post: " + e.getMessage());
        }
    }
}