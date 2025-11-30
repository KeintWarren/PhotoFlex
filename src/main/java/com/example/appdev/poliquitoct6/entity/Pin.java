package com.example.appdev.poliquitoct6.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Pin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long pinId;

    @ManyToOne
    @JoinColumn(name = "boardId", referencedColumnName = "boardId")
    private Board board;

    @ManyToOne
    @JoinColumn(name = "userId", referencedColumnName = "userId")
    private User user;

    private String imageURL;
    private String title;
    private String description;
    private LocalDateTime createdDate;

    public Long getPinId() { return pinId; }
    public void setPinId(Long pinId) { this.pinId = pinId; }

    public Board getBoard() { return board; }
    public void setBoard(Board board) { this.board = board; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getImageURL() { return imageURL; }
    public void setImageURL(String imageURL) { this.imageURL = imageURL; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDateTime getCreatedDate() { return createdDate; }
    public void setCreatedDate(LocalDateTime createdDate) { this.createdDate = createdDate; }
}