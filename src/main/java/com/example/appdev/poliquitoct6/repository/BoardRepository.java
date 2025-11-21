package com.example.appdev.poliquitoct6.repositor;

import com.example.appdev.poliquitoct6.entity.Board;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BoardRepository extends JpaRepository<Board, Long> {
}