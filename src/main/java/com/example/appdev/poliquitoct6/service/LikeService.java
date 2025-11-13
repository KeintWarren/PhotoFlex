package com.example.appdev.poliquitoct6.service;

import com.example.appdev.poliquitoct6.entity.Like;
import com.example.appdev.poliquitoct6.repositor.LikeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class LikeService {

    @Autowired
    private LikeRepository likeRepository;

    public List<Like> getLikesByPinId(Long pinId) {
        return likeRepository.findByPin_PinId(pinId);
    }

    public Optional<Like> getLikeByPinAndUser(Long pinId, Long userId) {
        return likeRepository.findByPin_PinIdAndUser_UserId(pinId, userId);
    }

    public Like addLike(Like like) {
        like.setCreatedDate(LocalDateTime.now());
        return likeRepository.save(like);
    }

    @Transactional
    public void removeLike(Long pinId, Long userId) {
        likeRepository.deleteByPin_PinIdAndUser_UserId(pinId, userId);
    }

    public int getLikeCount(Long pinId) {
        return likeRepository.findByPin_PinId(pinId).size();
    }
}