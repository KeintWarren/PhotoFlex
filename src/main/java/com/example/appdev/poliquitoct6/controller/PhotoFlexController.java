package com.example.appdev.poliquitoct6.controller;

import com.example.appdev.poliquitoct6.entity.*;
import com.example.appdev.poliquitoct6.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class PhotoFlexController {

    @Autowired private UserService userService;
    @Autowired private BoardService boardService;
    @Autowired private PinService pinService;
    @Autowired private CommentService commentService;
    @Autowired private LikeService likeService;

    // ===== User Endpoints =====
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/users/{id}")
    public Optional<User> getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    @PostMapping("/users")
    public User addUser(@RequestBody User user) {
        return userService.addUser(user);
    }

    @PutMapping("/users/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User user) {
        return userService.updateUser(id, user);
    }

    @DeleteMapping("/users/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }

    // ===== Board Endpoints =====
    @GetMapping("/boards")
    public List<Board> getAllBoards() {
        return boardService.getAllBoards();
    }

    @GetMapping("/boards/{id}")
    public Optional<Board> getBoardById(@PathVariable Long id) {
        return boardService.getBoardById(id);
    }

    // *** NEW ENDPOINT ADDED ***
    @GetMapping("/boards/user/{userId}")
    public List<Board> getBoardsByUserId(@PathVariable Long userId) {
        return boardService.getBoardsByUserId(userId);
    }

    @PostMapping("/boards")
    public Board addBoard(@RequestBody Board board) {
        return boardService.addBoard(board);
    }

    @PutMapping("/boards/{id}")
    public Board updateBoard(@PathVariable Long id, @RequestBody Board board) {
        return boardService.updateBoard(id, board);
    }

    @DeleteMapping("/boards/{id}")
    public void deleteBoard(@PathVariable Long id) {
        boardService.deleteBoard(id);
    }

    // ===== Pin Endpoints =====
    @GetMapping("/pins")
    public List<Pin> getAllPins() {
        return pinService.getAllPins();
    }

    @GetMapping("/pins/{id}")
    public Optional<Pin> getPinById(@PathVariable Long id) {
        return pinService.getPinById(id);
    }

    @GetMapping("/pins/user/{userId}")
    public List<Pin> getPinsByUserId(@PathVariable Long userId) {
        return pinService.getPinsByUserId(userId);
    }

    @GetMapping("/pins/board/{boardId}")
    public List<Pin> getPinsByBoardId(@PathVariable Long boardId) {
        return pinService.getPinsByBoardId(boardId);
    }

    @PostMapping("/pins")
    public Pin addPin(@RequestBody Pin pin) {
        return pinService.addPin(pin);
    }

    @PutMapping("/pins/{id}")
    public Pin updatePin(@PathVariable Long id, @RequestBody Pin pin) {
        return pinService.updatePin(id, pin);
    }

    @DeleteMapping("/pins/{id}")
    public void deletePin(@PathVariable Long id) {
        pinService.deletePin(id);
    }

    // ===== Comment Endpoints =====
    @GetMapping("/comments/pin/{pinId}")
    public List<Comment> getCommentsByPinId(@PathVariable Long pinId) {
        return commentService.getCommentsByPinId(pinId);
    }

    @PostMapping("/comments")
    public Comment addComment(@RequestBody Comment comment) {
        return commentService.addComment(comment);
    }

    @PutMapping("/comments/{id}")
    public Comment updateComment(@PathVariable Long id, @RequestBody Comment comment) {
        return commentService.updateComment(id, comment);
    }

    @DeleteMapping("/comments/{id}")
    public void deleteComment(@PathVariable Long id) {
        commentService.deleteComment(id);
    }

    // ===== Like Endpoints =====
    @GetMapping("/likes/pin/{pinId}")
    public List<Like> getLikesByPinId(@PathVariable Long pinId) {
        return likeService.getLikesByPinId(pinId);
    }

    @GetMapping("/likes/pin/{pinId}/count")
    public int getLikeCount(@PathVariable Long pinId) {
        return likeService.getLikeCount(pinId);
    }

    @GetMapping("/likes/pin/{pinId}/user/{userId}")
    public boolean isLikedByUser(@PathVariable Long pinId, @PathVariable Long userId) {
        return likeService.getLikeByPinAndUser(pinId, userId).isPresent();
    }

    @PostMapping("/likes")
    public Like addLike(@RequestBody Like like) {
        return likeService.addLike(like);
    }

    @DeleteMapping("/likes/pin/{pinId}/user/{userId}")
    public void removeLike(@PathVariable Long pinId, @PathVariable Long userId) {
        likeService.removeLike(pinId, userId);
    }
}