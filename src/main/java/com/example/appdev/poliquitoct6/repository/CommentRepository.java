package com.example.appdev.poliquitoct6.repository;

import com.example.appdev.poliquitoct6.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByPin_PinId(Long pinId);

    // Add count method for getting total comments per pin
    int countByPin_PinId(Long pinId);
}