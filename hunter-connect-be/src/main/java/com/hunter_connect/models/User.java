package com.hunter_connect.models;
import java.util.List;

/**
 * A simple POJO to represent a User.
 * Updated to use String for UID to match Firebase.
 */
public class User {
    private String uid; // Changed from long to String
    private String firstName;
    private String lastName;
    private String email;
    private Preferences preferences;

    // Default constructor is REQUIRED for Firestore and JSON deserialization
    public User() {}

    public User(String uid, String firstName, String lastName, String email, Preferences preferences) {
        this.uid = uid;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.preferences = preferences;
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

    public Preferences getPreferences() { return preferences; }
    public void setPreferences(Preferences preferences) { this.preferences = preferences; }


    /**
     * Inner class to represent the 'preferences' object within Firestore.
     */
    public static class Preferences {
        private String academicYear;
        private List<String> courses;
        private List<String> interests;
        private List<String> skills;

        public Preferences() {}

        public String getAcademicYear() { return academicYear; }
        public void setAcademicYear(String academicYear) { this.academicYear = academicYear; }

        public List<String> getCourses() { return courses; }
        public void setCourses(List<String> courses) { this.courses = courses; }

        public List<String> getInterests() { return interests; }
        public void setInterests(List<String> interests) { this.interests = interests; }

        public List<String> getSkills() { return skills; }
        public void setSkills(List<String> skills) { this.skills = skills; }
    }
}