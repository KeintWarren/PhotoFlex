package com.example.appdev.poliquitoct6.service;

import com.example.appdev.poliquitoct6.entity.Like;
import com.example.appdev.poliquitoct6.entity.Pin;
import com.example.appdev.poliquitoct6.entity.User;
import com.example.appdev.poliquitoct6.exception.ResourceNotFoundException;
import com.example.appdev.poliquitoct6.repository.LikeRepository;
import com.example.appdev.poliquitoct6.repository.PinRepository;
import com.example.appdev.poliquitoct6.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class LikeService {

    private final LikeRepository likeRepository;
    private final PinRepository pinRepository;
    private final UserRepository userRepository;

    public LikeService(LikeRepository likeRepository, PinRepository pinRepository, UserRepository userRepository) {
        this.likeRepository = likeRepository;
        this.pinRepository = pinRepository;
        this.userRepository = userRepository;
    }

    //1. Add Likes (Creates the relationship)
    @Transactional
    public void addLike(Long pinId, Long userId) {

        // Check if the like already exists
        if (likeRepository.existsByPin_PinIdAndUser_UserId(pinId, userId)) {
            // Already liked, do nothing (or throw a specific conflict exception if desired)
            return;
        }

        // Fetch entities (assuming Pin and User entities are used in the Like entity)
        Pin pin = pinRepository.findById(pinId)
                .orElseThrow(() -> new ResourceNotFoundException("Pin not found with ID: " + pinId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        // Create and save the new Like entity
        Like newLike = new Like();
        newLike.setPin(pin);
        newLike.setUser(user);

        likeRepository.save(newLike);
    }

    // 2. Remove Like (Deletes the relationship)

    @Transactional
    public void removeLike(Long pinId, Long userId) {
        // Find the Like entity by its components
        Optional<Like> existingLike = likeRepository.findByPin_PinIdAndUser_UserId(pinId, userId);

        if (existingLike.isPresent()) {
            likeRepository.delete(existingLike.get());
        }
        // If the like doesn't exist, we just return without error (idempotency)
    }

    // 3. Status and Count Retrieval
    public boolean isLikedByUser(Long pinId, Long userId) {
        // Uses the efficient repository method we defined previously
        return likeRepository.existsByPin_PinIdAndUser_UserId(pinId, userId);
    }

    public int getLikeCount(Long pinId) {
        // Assuming LikeRepository has a method 'countByPin_PinId' defined
        return likeRepository.countByPin_PinId(pinId);
    }

//    @Autowired
//    private LikeRepository likeRepository;
//
//    public List<Like> getLikesByPinId(Long pinId) {
//        return likeRepository.findByPin_PinId(pinId);
//    }
//
//    public Optional<Like> getLikeByPinAndUser(Long pinId, Long userId) {
//        return likeRepository.findByPin_PinIdAndUser_UserId(pinId, userId);
//    }
//
//    public Like addLike(Like like) {
//        like.setCreatedDate(LocalDateTime.now());
//        return likeRepository.save(like);
//    }
//
//    @Transactional
//    public void removeLike(Long pinId, Long userId) {
//        likeRepository.deleteByPin_PinIdAndUser_UserId(pinId, userId);
//    }
//
//    public int getLikeCount(Long pinId) {
//        return likeRepository.findByPin_PinId(pinId).size();
//    }
}
