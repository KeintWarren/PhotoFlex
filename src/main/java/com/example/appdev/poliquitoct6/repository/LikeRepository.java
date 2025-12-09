package com.example.appdev.poliquitoct6.repository;

import com.example.appdev.poliquitoct6.entity.Like;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {
    List<Like> findByPin_PinId(Long pinId);

    Optional<Like> findByPin_PinIdAndUser_UserId(Long pinId, Long userId);

    void deleteByPin_PinIdAndUser_UserId(Long pinId, Long userId);

    int countByPin_PinId(Long pinId);

    boolean existsByPin_PinIdAndUser_UserId(Long pinId, Long userId);
}