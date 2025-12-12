package com.example.appdev.poliquitoct6.service;

import com.example.appdev.poliquitoct6.entity.Comment;
import com.example.appdev.poliquitoct6.dto.CommentResponse;
import com.example.appdev.poliquitoct6.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    public List<Comment> getAllComments() {
        return commentRepository.findAll();
    }

    public Optional<Comment> getCommentById(Long id) {
        return commentRepository.findById(id);
    }

    public List<Comment> getCommentsByPinId(Long pinId) {
        return commentRepository.findByPin_PinId(pinId);
    }

    public Comment createComment(Comment comment) {
        comment.setCreatedDate(LocalDateTime.now());
        return commentRepository.save(comment);
    }

    public Comment updateComment(Long id, Comment updatedComment) {
        return commentRepository.findById(id).map(comment -> {
            comment.setText(updatedComment.getText());
            return commentRepository.save(comment);
        }).orElseThrow(() -> new RuntimeException("Comment not found with id " + id));
    }

    public void deleteCommentById(Long id) { // Renamed for clarity: deleteCommentById
        commentRepository.deleteById(id);
    }

    public List<CommentResponse> getCommentsResponseByPinId(Long pinId) {
        return commentRepository.findByPin_PinId(pinId).stream()
                .map(this::convertToCommentResponse)
                .collect(Collectors.toList());
    }

    private CommentResponse convertToCommentResponse(Comment comment) {
        CommentResponse response = new CommentResponse();

        response.setCommentId(comment.getCommentId());
        response.setText(comment.getText()); // Assuming your entity uses getText()
        response.setCreatedDate(comment.getCreatedDate());

        if (comment.getUser() != null) {
            response.setUserId(comment.getUser().getUserId());
            response.setUsername(comment.getUser().getUsername());
            response.setProfilePicture(comment.getUser().getProfilePicture());
        }

        return response;
    }
}