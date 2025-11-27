package com.example.appdev.poliquitoct6.service;

import com.example.appdev.poliquitoct6.entity.Board;
import com.example.appdev.poliquitoct6.repository.BoardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BoardService {

    @Autowired
    private BoardRepository boardRepository;

    public List<Board> getAllBoards() {
        return boardRepository.findAll();
    }

    public Optional<Board> getBoardById(Long id) {
        return boardRepository.findById(id);
    }

    public Board addBoard(Board board) {
        return boardRepository.save(board);
    }

    public Board updateBoard(Long id, Board updatedBoard) {
        return boardRepository.findById(id).map(board -> {
            board.setUser(updatedBoard.getUser());
            board.setTitle(updatedBoard.getTitle());
            board.setDescription(updatedBoard.getDescription());
            board.setVisibility(updatedBoard.getVisibility());
            board.setCreatedAt(updatedBoard.getCreatedAt());
            return boardRepository.save(board);
        }).orElseThrow(() -> new RuntimeException("Board not found with id " + id));
    }

    public void deleteBoard(Long id) {
        boardRepository.deleteById(id);
    }
}