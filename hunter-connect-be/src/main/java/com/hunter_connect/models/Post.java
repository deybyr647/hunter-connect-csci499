package com.hunter_connect.models;

import com.google.cloud.Timestamp;

import java.time.LocalDateTime;

/**
 * A simple POJO (Plain Old Java Object) to represent a Social Media Post.
 */
public class Post {
    private String uid;
    private long userId; // Foreign key to the Post author's user ID
    private String content;
    private String title;
    private Timestamp timestamp;

    // No-argument constructor
    public Post() {}

    // Parameterized constructor
    public Post(String uid, long userId, String content, Timestamp timestamp, String title) {
        this.uid = uid;
        this.userId = userId;
        this.content = content;
        this.timestamp = timestamp;
        this.title = title;
    }

    // Getters and Setters
    public String getUid() { return uid; }
    public void setUid(String uid) { this.uid = uid; }

    public long getUserId() { return userId; }
    public void setUserId(long userId) { this.userId = userId; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public Timestamp getTimestamp() { return timestamp; }
    public void setTimestamp(Timestamp timestamp) { this.timestamp = timestamp; }
}