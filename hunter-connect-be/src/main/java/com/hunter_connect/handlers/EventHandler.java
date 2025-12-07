package com.hunter_connect.handlers;

import com.google.api.core.ApiFuture;
import com.google.cloud.Timestamp;
import com.google.cloud.firestore.*;
import com.google.firebase.cloud.FirestoreClient;
import com.hunter_connect.models.Event;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.function.ServerRequest;
import org.springframework.web.servlet.function.ServerResponse;

import java.net.URI;
import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@Component
public class EventHandler {

    private static final String COLLECTION_NAME = "events";

    /**
     * Handles POST /api/events
     * Creates a new event with an auto-generated ID.
     * Logic Migrated: Fetches creator's name from 'users' collection before saving.
     */
    public ServerResponse createEvent(ServerRequest request) {
        try {
            // 1. Get the authenticated user (Creator)
            Principal principal = request.principal()
                    .orElseThrow(() -> new SecurityException("No auth token found"));
            String creatorUid = principal.getName();

            // 2. Deserialize body
            Event newEvent = request.body(Event.class);

            // 3. Server-side validation/defaults
            Firestore db = FirestoreClient.getFirestore();

            // MIGRATED LOGIC: Fetch the user's name server-side
            DocumentSnapshot userDoc = db.collection("users").document(creatorUid).get().get();
            String creatorName = "Unknown";
            if (userDoc.exists()) {
                String first = userDoc.getString("firstName");
                String last = userDoc.getString("lastName");
                creatorName = (first != null ? first : "") + " " + (last != null ? last : "");
                creatorName = creatorName.trim();
            }

            newEvent.setCreatedBy(creatorUid);
            newEvent.setCreatorName(creatorName);
            newEvent.setCreatedAt(Timestamp.now());

            // Ensure lists are initialized if null
            if (newEvent.getAttendees() == null) newEvent.setAttendees(List.of());

            // 4. Save to Firestore

            // We use .add() to let Firestore generate a random Document ID
            ApiFuture<DocumentReference> future = db.collection(COLLECTION_NAME).add(newEvent);

            DocumentReference docRef = future.get();
            String newEventId = docRef.getId();

            System.out.println("Created event " + newEventId + " by " + creatorName);

            // 5. Return success with the new ID location
            return ServerResponse.created(URI.create("/api/events/" + newEventId))
                    .body(Map.of("id", newEventId, "message", "Event created successfully"));

        } catch (Exception e) {
            e.printStackTrace();
            return ServerResponse.badRequest().body("Error creating event: " + e.getMessage());
        }
    }

    /**
     * Handles GET /api/events
     * Fetches ALL events.
     * Logic Update: Filtering has been removed. The frontend will decide what to display.
     */
    public ServerResponse getAllEvents(ServerRequest request) {
        try {
            Firestore db = FirestoreClient.getFirestore();

            // Fetch all documents from the collection
            ApiFuture<QuerySnapshot> future = db.collection(COLLECTION_NAME).get();
            List<QueryDocumentSnapshot> documents = future.get().getDocuments();

            // Convert to Event POJOs
            List<Event> events = documents.stream()
                    .map(doc -> doc.toObject(Event.class))
                    .collect(Collectors.toList());

            return ServerResponse.ok().body(events);

        } catch (Exception e) {
            e.printStackTrace();
            return ServerResponse.badRequest().body("Error fetching events: " + e.getMessage());
        }
    }

    /**
     * Handles GET /api/events/{id}
     */
    public ServerResponse getEventById(ServerRequest request) {
        try {
            String eventId = request.pathVariable("id");
            Firestore db = FirestoreClient.getFirestore();

            DocumentSnapshot document = db.collection(COLLECTION_NAME).document(eventId).get().get();

            if (document.exists()) {
                Event event = document.toObject(Event.class);
                return ServerResponse.ok().body(event);
            } else {
                return ServerResponse.notFound().build();
            }

        } catch (Exception e) {
            return ServerResponse.badRequest().body("Error getting event: " + e.getMessage());
        }
    }

    /**
     * Handles PUT /api/events/{id}
     * Updates an event, but ONLY if the requester is the creator.
     */
    public ServerResponse updateEvent(ServerRequest request) {
        try {
            String eventId = request.pathVariable("id");

            // 1. Get Auth User
            Principal principal = request.principal()
                    .orElseThrow(() -> new SecurityException("No auth token found"));
            String requesterUid = principal.getName();

            Firestore db = FirestoreClient.getFirestore();
            DocumentReference eventRef = db.collection(COLLECTION_NAME).document(eventId);

            // 2. SECURITY CHECK: Fetch existing doc to verify ownership
            DocumentSnapshot existingDoc = eventRef.get().get();

            if (!existingDoc.exists()) {
                return ServerResponse.notFound().build();
            }

            Event existingEvent = existingDoc.toObject(Event.class);
            if (existingEvent != null && !requesterUid.equals(existingEvent.getCreatedBy())) {
                System.out.println("Security Alert: User " + requesterUid + " tried to edit event owned by " + existingEvent.getCreatedBy());
                return ServerResponse.status(403).body("You are not the creator of this event.");
            }

            // 3. Prepare Updates
            Event updates = request.body(Event.class);

            // Create a Map for merging to avoid overwriting with nulls
            Map<String, Object> dataToUpdate = new HashMap<>();

            if (updates.getTitle() != null) dataToUpdate.put("title", updates.getTitle());
            if (updates.getDescription() != null) dataToUpdate.put("description", updates.getDescription());
            if (updates.getLocation() != null) dataToUpdate.put("location", updates.getLocation());
            if (updates.getDate() != null) dataToUpdate.put("date", updates.getDate());
            if (updates.getStartTime() != null) dataToUpdate.put("startTime", updates.getStartTime());
            if (updates.getEndTime() != null) dataToUpdate.put("endTime", updates.getEndTime());
            if (updates.getTags() != null) dataToUpdate.put("tags", updates.getTags());
            if (updates.getAttendees() != null) dataToUpdate.put("attendees", updates.getAttendees());

            // 4. Update
            eventRef.set(dataToUpdate, SetOptions.merge()).get();

            return ServerResponse.ok().body(dataToUpdate);

        } catch (Exception e) {
            return ServerResponse.badRequest().body("Error updating event: " + e.getMessage());
        }
    }

    /**
     * Handles POST /api/events/{id}/subscribe
     * Toggles subscription (attendance) for the authenticated user.
     * Logic Migrated: Replaces arrayUnion/arrayRemove logic from frontend.
     */
    public ServerResponse toggleSubscribe(ServerRequest request) {
        try {
            String eventId = request.pathVariable("id");

            // 1. Get Auth User
            Principal principal = request.principal()
                    .orElseThrow(() -> new SecurityException("No auth token found"));
            String uid = principal.getName();

            Firestore db = FirestoreClient.getFirestore();
            DocumentReference eventRef = db.collection(COLLECTION_NAME).document(eventId);

            // 2. Run Transaction to safely toggle
            String resultMessage = db.runTransaction(transaction -> {
                DocumentSnapshot snapshot = transaction.get(eventRef).get();
                if (!snapshot.exists()) {
                    throw new IllegalArgumentException("Event not found");
                }

                // We safely cast the field to a List
                List<String> attendees = (List<String>) snapshot.get("attendees");
                if (attendees == null) attendees = List.of();

                if (attendees.contains(uid)) {
                    // Remove user
                    transaction.update(eventRef, "attendees", FieldValue.arrayRemove(uid));
                    return "Unsubscribed";
                } else {
                    // Add user
                    transaction.update(eventRef, "attendees", FieldValue.arrayUnion(uid));
                    return "Subscribed";
                }
            }).get();

            return ServerResponse.ok().body(Map.of("status", resultMessage, "userId", uid));

        } catch (Exception e) {
            e.printStackTrace();
            return ServerResponse.badRequest().body("Error toggling subscription: " + e.getMessage());
        }
    }
}