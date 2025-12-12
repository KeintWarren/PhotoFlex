package com.example.appdev.poliquitoct6.service;

import com.example.appdev.poliquitoct6.dto.LikeCreateRequest;
import com.example.appdev.poliquitoct6.dto.LikeResponse;
import com.example.appdev.poliquitoct6.entity.Like;
import com.example.appdev.poliquitoct6.entity.Pin;
import com.example.appdev.poliquitoct6.entity.User;
import com.example.appdev.poliquitoct6.repository.LikeRepository;
import com.example.appdev.poliquitoct6.repository.PinRepository;
import com.example.appdev.poliquitoct6.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class LikeService {

    @Autowired private LikeRepository likeRepository;
    @Autowired private PinRepository pinRepository; // Required for entity lookup
    @Autowired private UserRepository userRepository; // Required for entity lookup

    public List<Like> getLikesByPinId(Long pinId) {
        return likeRepository.findByPin_PinId(pinId);
    }

    public int getLikeCount(Long pinId) {
        return likeRepository.countByPin_PinId(pinId);
    }

    public LikeResponse createLike(LikeCreateRequest request) {
        Like like = convertToEntity(request);

        Like savedLike = likeRepository.save(like);

        return convertToResponse(savedLike);
    }

    public Optional<Like> checkIsLikedByUser(Long pinId, Long userId) {
        return likeRepository.findByPin_PinIdAndUser_UserId(pinId, userId);
    }

    public void deleteLikeByPinAndUser(Long pinId, Long userId) {
        Optional<Like> like = likeRepository.findByPin_PinIdAndUser_UserId(pinId, userId);
        like.ifPresent(likeRepository::delete);
    }

    // --- DTO CONVERSION LOGIC ---

    private Like convertToEntity(LikeCreateRequest request) {
        Like like = new Like();

        Pin pin = pinRepository.findById(request.getPinId())
                .orElseThrow(() -> new RuntimeException("Pin not found with id " + request.getPinId()));

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with id " + request.getUserId()));

        like.setPin(pin);
        like.setUser(user);

        like.setCreatedDate(request.getCreatedDate() != null ? request.getCreatedDate() : LocalDateTime.now());

        return like;
    }

    private LikeResponse convertToResponse(Like like) {
        LikeResponse response = new LikeResponse();
        response.setLikeId(like.getLikeId());
        response.setPinId(like.getPin().getPinId());
        response.setUserId(like.getUser().getUserId());

        response.setLiked(true); // Always true since we just created it
        response.setLikeCount(getLikeCount(like.getPin().getPinId())); // Get the updated count

        return response;
    }
}