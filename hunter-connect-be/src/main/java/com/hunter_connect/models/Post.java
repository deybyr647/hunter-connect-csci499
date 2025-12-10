package com.hunter_connect.models;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.google.cloud.Timestamp;
import java.io.IOException;
import java.util.List;

/**
 * POJO representing a Post, mirroring the frontend PostInterface.
 */
public class Post {
    private String postID; // Corresponds to the document ID
    private String userID; // The creator's UID
    private String creatorName;
    private String title;
    private String content;
    private String location;
    private int likes;

    // Custom deserializer handles { "seconds": ..., "nanoseconds": ... } from frontend
    @JsonDeserialize(using = FirestoreTimestampDeserializer.class)
    private Timestamp timestamp;

    private Tags tags;

    // Default constructor required for Firestore
    public Post() {}

    public Post(String postID, String userID, String creatorName, String title, String content,
                String location, int likes, Timestamp timestamp, Tags tags) {
        this.postID = postID;
        this.userID = userID;
        this.creatorName = creatorName;
        this.title = title;
        this.content = content;
        this.location = location;
        this.likes = likes;
        this.timestamp = timestamp;
        this.tags = tags;
    }

    // --- Getters and Setters ---

    public String getPostID() { return postID; }
    public void setPostID(String postID) { this.postID = postID; }

    public String getUserID() { return userID; }
    public void setUserID(String userID) { this.userID = userID; }

    public String getCreatorName() { return creatorName; }
    public void setCreatorName(String creatorName) { this.creatorName = creatorName; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public int getLikes() { return likes; }
    public void setLikes(int likes) { this.likes = likes; }

    public Timestamp getTimestamp() { return timestamp; }
    public void setTimestamp(Timestamp timestamp) { this.timestamp = timestamp; }

    public Tags getTags() { return tags; }
    public void setTags(Tags tags) { this.tags = tags; }

    /**
     * Inner class for nested tags structure
     */
    public static class Tags {
        private List<String> courses;
        private List<String> general;

        public Tags() {}

        public Tags(List<String> courses, List<String> general) {
            this.courses = courses;
            this.general = general;
        }

        public List<String> getCourses() { return courses; }
        public void setCourses(List<String> courses) { this.courses = courses; }

        public List<String> getGeneral() { return general; }
        public void setGeneral(List<String> general) { this.general = general; }
    }

    /**
     * Custom Deserializer to convert Frontend JSON Timestamp to Java Google Cloud Timestamp
     */
    public static class FirestoreTimestampDeserializer extends JsonDeserializer<Timestamp> {
        @Override
        public Timestamp deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
            JsonNode node = p.getCodec().readTree(p);

            if (node.has("seconds") && (node.has("nanoseconds") || node.has("nanos"))) {
                long seconds = node.get("seconds").asLong();
                // Handle both 'nanoseconds' (JS SDK) and 'nanos' (Java SDK) just in case
                int nanos = node.has("nanoseconds") ? node.get("nanoseconds").asInt() : node.get("nanos").asInt();
                return Timestamp.ofTimeSecondsAndNanos(seconds, nanos);
            }

            if (node.isTextual()) {
                return Timestamp.parseTimestamp(node.asText());
            }

            return null;
        }
    }
}