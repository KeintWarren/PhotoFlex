package com.example.appdev.poliquitoct6.controller;

import com.example.appdev.poliquitoct6.service.LikeService;
import org.hibernate.validator.constraints.CreditCardNumber;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/likes")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class LikeController{
    private final LikeService likeService;

    public LikeController(LikeService likeService){
        this.likeService = likeService;
    }

    private Long getCurrentUserId(){
        return 1L;//Mock ID
    }

    // 1. Add/Create Like (POST /api/likes/pin/{pinId})

    @PostMapping("/pin/{pinId}")
    public ResponseEntity<Void> addLike(@PathVariable Long pinId) {
        Long currentUserId = getCurrentUserId();
        // Service handles creation and duplicate check
        likeService.addLike(pinId, currentUserId);

        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    // 2. Remove/Delete Like (DELETE /api/likes/pin/{pinId})
    @DeleteMapping("/pin/{pinId}")
    public ResponseEntity<Void> removeLike(@PathVariable Long pinId) {
        Long currentUserId = getCurrentUserId();
        // Service handles deletion
        likeService.removeLike(pinId, currentUserId);

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // 3. Get Like Count (GET /api/likes/pin/{pinId}/count)
    @GetMapping("/pin/{pinId}/count")
    public ResponseEntity<Integer> getLikeCount(@PathVariable Long pinId) {
        int count = likeService.getLikeCount(pinId);
        return ResponseEntity.ok(count);
    }

    // 4. Check Like Status (GET /api/likes/pin/{pinId}/status)
    @GetMapping("/pin/{pinId}/status")
    public ResponseEntity<Boolean> isLikedByUser(@PathVariable Long pinId) {
        Long currentUserId = getCurrentUserId();
        boolean isLiked = likeService.isLikedByUser(pinId, currentUserId);
        // Returns true or false in the body
        return ResponseEntity.ok(isLiked);
    }
}


