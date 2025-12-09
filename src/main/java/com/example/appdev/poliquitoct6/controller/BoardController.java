package com.example.appdev.poliquitoct6.controller;

import com.example.appdev.poliquitoct6.dto.BoardDTO;
import com.example.appdev.poliquitoct6.dto.BoardCreationDTO;
import com.example.appdev.poliquitoct6.service.BoardService;
import com.example.appdev.poliquitoct6.service.UserService; // To get UserId from principal

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication; // For current user
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/boards")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class BoardController {

    private final BoardService boardService;
    private final UserService userService;

    public BoardController(BoardService boardService, UserService userService) {
        this.boardService = boardService;
        this.userService = userService;
    }

    // 1. SECURED: Create New Board (POST /api/boards)
    @PostMapping
    public ResponseEntity<BoardDTO> createBoard(
            @Valid @RequestBody BoardCreationDTO creationDto,
            Authentication authentication) {

        // Retrieve the authenticated user's database ID
        Long currentUserId = userService.getUserIdByUsername(authentication.getName());

        BoardDTO newBoard = boardService.createBoard(creationDto, currentUserId);
        return new ResponseEntity<>(newBoard, HttpStatus.CREATED);
    }


    // 2. PUBLIC: Get All Boards (GET /api/boards)
    @GetMapping
    public ResponseEntity<List<BoardDTO>> getAllBoards() {
        List<BoardDTO> boards = boardService.getAllBoards();
        return ResponseEntity.ok(boards);
    }


    // 3. PUBLIC: Get Board by ID (GET /api/boards/{id})
    @GetMapping("/{id}")
    public ResponseEntity<BoardDTO> getBoardById(@PathVariable Long id) {
        BoardDTO board = boardService.getBoardById(id);
        return ResponseEntity.ok(board);
    }


    // 4. PUBLIC: Get Boards by User ID (GET /api/boards/user/{userId})
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BoardDTO>> getBoardsByUserId(@PathVariable Long userId) {
        List<BoardDTO> boards = boardService.getBoardsByUserId(userId);
        return ResponseEntity.ok(boards);
    }


    // 5. SECURED: Delete Board (DELETE /api/boards/{id})
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBoard(@PathVariable Long id, Authentication authentication) {

        boardService.deleteBoard(id); // Assuming the service handles ownership/auth check
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}