package com.example.appdev.poliquitoct6.dto;

import java.time.LocalDateTime;

public class BoardDTO {

    private Long boardId;
    private String title;
    private String description;
    private String coverImage;
    private String visibility;
    private LocalDateTime createdAt;

    private UserDTO user;

    private Integer pinCount;

    public BoardDTO(){}

    public Long getBoardId() {
        return boardId;
    }

    public void setBoardId(Long boardID) {
        this.boardId = boardID;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCoverImage() {
        return coverImage;
    }

    public void setCoverImage(String coverImage) {
        this.coverImage = coverImage;
    }

    public String getVisibility() {
        return visibility;
    }

    public void setVisibility(String visibility) {
        this.visibility = visibility;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public UserDTO getUser() {
        return user;
    }

    public void setUser(UserDTO user) {
        this.user = user;
    }

    public Integer getPinCount() {
        return pinCount;
    }

    public void setPinCount(Integer pinCount) {
        this.pinCount = pinCount;
    }
}
