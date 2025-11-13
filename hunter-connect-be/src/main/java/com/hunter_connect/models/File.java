package com.hunter_connect.models;

import java.time.LocalDateTime;

/**
 * A simple POJO (Plain Old Java Object) to represent a File.
 */
public class File {
    private long id;
    private String fileName;
    private String fileType; // e.g., "image/png", "application/pdf"
    private long fileSize; // Size in bytes
    private String url; // Storage location (e.g., S3 bucket URL)
    private LocalDateTime uploadTimestamp;

    // No-argument constructor
    public File() {}

    // Parameterized constructor
    public File(long id, String fileName, String fileType, long fileSize, String url, LocalDateTime uploadTimestamp) {
        this.id = id;
        this.fileName = fileName;
        this.fileType = fileType;
        this.fileSize = fileSize;
        this.url = url;
        this.uploadTimestamp = uploadTimestamp;
    }

    // Getters and Setters
    public long getId() { return id; }
    public void setId(long id) { this.id = id; }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public String getFileType() { return fileType; }
    public void setFileType(String fileType) { this.fileType = fileType; }

    public long getFileSize() { return fileSize; }
    public void setFileSize(long fileSize) { this.fileSize = fileSize; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }

    public LocalDateTime getUploadTimestamp() { return uploadTimestamp; }
    public void setUploadTimestamp(LocalDateTime uploadTimestamp) { this.uploadTimestamp = uploadTimestamp; }
}