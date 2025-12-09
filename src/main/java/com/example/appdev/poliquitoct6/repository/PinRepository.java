package com.example.appdev.poliquitoct6.repository;

import com.example.appdev.poliquitoct6.entity.Board;
import com.example.appdev.poliquitoct6.entity.Pin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PinRepository extends JpaRepository<Pin, Long> {
    List<Pin> findByUser_UserId(Long userId);
    List<Pin> findByBoard_BoardId(Long boardId);
    Integer countByBoard_BoardId(Long boardID);
}