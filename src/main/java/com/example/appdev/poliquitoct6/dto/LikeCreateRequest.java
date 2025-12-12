package com.example.appdev.poliquitoct6.dto;

import java.time.LocalDateTime;

public class LikeCreateRequest {

    private Long pinId;
    private Long userId;

    private LocalDateTime createdDate;

    public Long getPinId() {
        return pinId;
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