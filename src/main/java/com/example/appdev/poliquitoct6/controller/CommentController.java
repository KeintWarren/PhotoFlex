package com.example.appdev.poliquitoct6.controller;

import com.example.appdev.poliquitoct6.dto.CommentDTO;
import com.example.appdev.poliquitoct6.dto.CommentCreationDTO;
import com.example.appdev.poliquitoct6.service.CommentService;
import com.example.appdev.poliquitoct6.service.UserService; // To get UserId from principal

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication; // For current user
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class CommentController {

    private final CommentService commentService;
    private final UserService userService;

    public CommentController(CommentService commentService, UserService userService) {
        this.commentService = commentService;
        this.userService = userService;
    }

    // 1. SECURED: Add New Comment (POST /api/comments)
    @PostMapping
    public ResponseEntity<CommentDTO> addComment(
            @Valid @RequestBody CommentCreationDTO creationDto,
            Authentication authentication) {

        // Retrieve the authenticated user's database ID
        Long currentUserId = userService.getUserIdByUsername(authentication.getName());

        CommentDTO newComment = commentService.addComment(creationDto, currentUserId);
        return new ResponseEntity<>(newComment, HttpStatus.CREATED);
    }

    // 2. PUBLIC: Get Comments by Pin ID (GET /api/comments/pin/{pinId})
    @GetMapping("/pin/{pinId}")
    public ResponseEntity<List<CommentDTO>> getCommentsByPinId(@PathVariable Long pinId) {
        List<CommentDTO> comments = commentService.getCommentsByPinId(pinId);
        return ResponseEntity.ok(comments);
    }


    // 3. SECURED: Delete Comment (DELETE /api/comments/{commentId})
    // NOTE: The service layer should contain the ownership check.
    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long commentId, Authentication authentication) {

        // You would typically pass the currentUserId to the service to verify ownership
        // Long currentUserId = userService.getUserIdByUsername(authentication.getName());

        commentService.deleteComment(commentId); // Assuming the service handles ownership/auth check
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}