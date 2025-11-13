package com.hunter_connect.models;

import java.time.LocalDateTime;

/**
 * A simple POJO (Plain Old Java Object) to represent a Social Media Post.
 */
public class Post {
    private long id;
    private long userId; // Foreign key to the User
    private String content;
    private LocalDateTime timestamp;
    private int likeCount;

    // No-argument constructor
    public Post() {}

    // Parameterized constructor
    public Post(long id, long userId, String content, LocalDateTime timestamp) {
        this.id = id;
        this.userId = userId;
        this.content = content;
        this.timestamp = timestamp;
        this.likeCount = 0; // Default likes to 0
    }

    // Getters and Setters
    public long getId() { return id; }
    public void setId(long id) { this.id = id; }

    public long getUserId() { return userId; }
    public void setUserId(long userId) { this.userId = userId; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public int getLikeCount() { return likeCount; }
    public void setLikeCount(int likeCount) { this.likeCount = likeCount; }
}