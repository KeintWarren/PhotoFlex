// src/main/java/.../dto/CommentCreateRequest.java

package com.example.appdev.poliquitoct6.dto;

import java.time.LocalDateTime;

public class CommentCreateRequest {

    private String text;
    private Long pinId;    // Contains the simple ID that was causing the error
    private Long userId;   // Contains the simple ID that was causing the error
    private LocalDateTime createdDate;

    // Standard constructor, getters, and setters

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Long getPinId() {
        return pinId; // 💡 Now this method exists!
    }

    public void setPinId(Long pinId) {
        this.pinId = pinId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }
}