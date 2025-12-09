package com.example.appdev.poliquitoct6.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class CommentCreationDTO {
    @NotNull(message = "Pin ID is required to associate the comment.")
    private Long pinId;

    @NotBlank(message = "Comment text cannot be empty.")
    @Size(max = 255, message = "Comment must be under 255 characters.")
    private String text;

    public CommentCreationDTO(){}

    public Long getPinId() {
        return pinId;
    }

    public void setPinId(Long pinId) {
        this.pinId = pinId;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}
