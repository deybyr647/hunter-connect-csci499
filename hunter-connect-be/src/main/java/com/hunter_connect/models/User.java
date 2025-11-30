package com.hunter_connect.models;

/**
 * A simple POJO to represent a User.
 * Updated to use String for UID to match Firebase.
 */
public class User {
    private String uid; // Changed from long to String
    private String firstName;
    private String lastName;
    private String email;

    // Default constructor is REQUIRED for Firestore and JSON deserialization
    public User() {}

    public User(String uid, String firstName, String lastName, String email) {
        this.uid = uid;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
    }

    // Getters and Setters
    public String getUid() { return uid; }
    public void setUid(String uid) { this.uid = uid; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}