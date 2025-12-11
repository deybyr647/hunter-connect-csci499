package com.hunter_connect.models;

import java.util.ArrayList;
import java.util.List;

/**
 * Firestore User model
 */
public class User {

    private String uid;
    private String firstName;
    private String lastName;
    private String email;
    private String username;

    // ALWAYS initialize lists to avoid Firestore "no setter" warnings
    private List<String> incomingRequests = new ArrayList<>();
    private List<String> outgoingRequests = new ArrayList<>();
    private List<String> friends = new ArrayList<>();

    private Preferences preferences = new Preferences();

    // Required empty constructor for Firestore
    public User() {}

    public User(String uid,
                String firstName,
                String lastName,
                String email,
                String username,
                List<String> incomingRequests,
                List<String> outgoingRequests,
                List<String> friends,
                Preferences preferences) {

        this.uid = uid;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.username = username;

        // Safety: If Firestore sends null arrays, replace with empty lists
        this.incomingRequests = incomingRequests != null ? incomingRequests : new ArrayList<>();
        this.outgoingRequests = outgoingRequests != null ? outgoingRequests : new ArrayList<>();
        this.friends = friends != null ? friends : new ArrayList<>();

        this.preferences = preferences != null ? preferences : new Preferences();
    }

    // ----------- Getters & Setters -----------
    public String getUid() { return uid; }
    public void setUid(String uid) { this.uid = uid; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public List<String> getIncomingRequests() { return incomingRequests; }
    public void setIncomingRequests(List<String> incomingRequests) {
        this.incomingRequests = incomingRequests != null ? incomingRequests : new ArrayList<>();
    }

    public List<String> getOutgoingRequests() { return outgoingRequests; }
    public void setOutgoingRequests(List<String> outgoingRequests) {
        this.outgoingRequests = outgoingRequests != null ? outgoingRequests : new ArrayList<>();
    }

    public List<String> getFriends() { return friends; }
    public void setFriends(List<String> friends) {
        this.friends = friends != null ? friends : new ArrayList<>();
    }

    public Preferences getPreferences() { return preferences; }
    public void setPreferences(Preferences preferences) {
        this.preferences = preferences != null ? preferences : new Preferences();
    }

    // ----------- Inner Preferences Class -----------
    public static class Preferences {
        private String academicYear;
        private List<String> courses = new ArrayList<>();
        private List<String> interests = new ArrayList<>();
        private List<String> skills = new ArrayList<>();

        public Preferences() {}

        public String getAcademicYear() { return academicYear; }
        public void setAcademicYear(String academicYear) { this.academicYear = academicYear; }

        public List<String> getCourses() { return courses; }
        public void setCourses(List<String> courses) {
            this.courses = courses != null ? courses : new ArrayList<>();
        }

        public List<String> getInterests() { return interests; }
        public void setInterests(List<String> interests) {
            this.interests = interests != null ? interests : new ArrayList<>();
        }

        public List<String> getSkills() { return skills; }
        public void setSkills(List<String> skills) {
            this.skills = skills != null ? skills : new ArrayList<>();
        }
    }
}
