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
 * POJO representing an Event.
 * Uses com.google.cloud.Timestamp which IS the native Firestore timestamp type for Java.
 */
public class Event {
    private String id; // Added ID field as it's useful for the frontend
    private List<String> attendees;

    // We use the custom deserializer to handle the { seconds, nanoseconds } JSON from frontend
    @JsonDeserialize(using = FirestoreTimestampDeserializer.class)
    private Timestamp createdAt;

    private String createdBy;
    private String creatorName;

    @JsonDeserialize(using = FirestoreTimestampDeserializer.class)
    private Timestamp date;

    private String description;

    @JsonDeserialize(using = FirestoreTimestampDeserializer.class)
    private Timestamp endTime;

    private String location;

    @JsonDeserialize(using = FirestoreTimestampDeserializer.class)
    private Timestamp startTime;

    private Tags tags;
    private String title;

    public Event() {}

    public Event(String id, List<String> attendees, Timestamp createdAt, String createdBy, String creatorName,
                 Timestamp date, String description, Timestamp endTime, String location,
                 Timestamp startTime, Tags tags, String title) {
        this.id = id;
        this.attendees = attendees;
        this.createdAt = createdAt;
        this.createdBy = createdBy;
        this.creatorName = creatorName;
        this.date = date;
        this.description = description;
        this.endTime = endTime;
        this.location = location;
        this.startTime = startTime;
        this.tags = tags;
        this.title = title;
    }

    // --- Getters and Setters ---

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public List<String> getAttendees() { return attendees; }
    public void setAttendees(List<String> attendees) { this.attendees = attendees; }

    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }

    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }

    public String getCreatorName() { return creatorName; }
    public void setCreatorName(String creatorName) { this.creatorName = creatorName; }

    public Timestamp getDate() { return date; }
    public void setDate(Timestamp date) { this.date = date; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Timestamp getEndTime() { return endTime; }
    public void setEndTime(Timestamp endTime) { this.endTime = endTime; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public Timestamp getStartTime() { return startTime; }
    public void setStartTime(Timestamp startTime) { this.startTime = startTime; }

    public Tags getTags() { return tags; }
    public void setTags(Tags tags) { this.tags = tags; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    /**
     * Inner class for the nested 'tags' object.
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
     * Custom Deserializer to convert Frontend JSON { "seconds": 123, "nanoseconds": 456 }
     * into the Java com.google.cloud.Timestamp object.
     */
    public static class FirestoreTimestampDeserializer extends JsonDeserializer<Timestamp> {
        @Override
        public Timestamp deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
            JsonNode node = p.getCodec().readTree(p);

            // Check if we received the object format { seconds, nanoseconds }
            if (node.has("seconds") && node.has("nanoseconds")) {
                long seconds = node.get("seconds").asLong();
                int nanos = node.get("nanoseconds").asInt();
                return Timestamp.ofTimeSecondsAndNanos(seconds, nanos);
            }

            // Fallback for ISO Strings if you switch formats later
            if (node.isTextual()) {
                return Timestamp.parseTimestamp(node.asText());
            }

            return null;
        }
    }
}