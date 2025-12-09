package com.example.appdev.poliquitoct6.dto;

import jakarta.validation.constraints.Size;

public class UserUpdateDTO {

    @Size(min = 7, max = 20, message = "Username must be between 3 and 50 characters.")
    private String username;

    @Size(max = 255, message = "Bio cannot exceed 255 characters.")
    private String bio;

    private String profilePicture;

    // Optional: for security, if they are changing their current password
    private String oldPassword;
    private String newPassword;

    // Getters and Setters..

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getProfilePicture() {
        return profilePicture;
    }

    public void setProfilePicture(String profilePicture) {
        this.profilePicture = profilePicture;
    }

    public String getOldPassword() {
        return oldPassword;
    }

    public void setOldPassword(String oldPassword) {
        this.oldPassword = oldPassword;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}