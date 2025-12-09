package com.example.appdev.poliquitoct6.dto;

import com.example.appdev.poliquitoct6.entity.User;

public class AuthResponse {
    private String message;
    private User user;

    public AuthResponse(String message, User user) {
        this.message = message;
        this.user = user;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}

