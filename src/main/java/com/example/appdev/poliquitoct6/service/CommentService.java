package com.example.appdev.poliquitoct6.service;

import com.example.appdev.poliquitoct6.dto.CommentCreationDTO;
import com.example.appdev.poliquitoct6.dto.CommentDTO;
import com.example.appdev.poliquitoct6.entity.Comment;
import com.example.appdev.poliquitoct6.entity.Pin;
import com.example.appdev.poliquitoct6.entity.User;
import com.example.appdev.poliquitoct6.exception.ResourceNotFoundException;
import com.example.appdev.poliquitoct6.repository.CommentRepository;
import com.example.appdev.poliquitoct6.repository.PinRepository;
import com.example.appdev.poliquitoct6.repository.UserRepository;
import com.example.appdev.poliquitoct6.util.DTOMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CommentService {
    private final CommentRepository commentRepository;
    private final PinRepository pinRepository;
    private final UserRepository userRepository;

    public CommentService(CommentRepository commentRepository, PinRepository pinRepository, UserRepository userRepository) {
        this.commentRepository = commentRepository;
        this.pinRepository = pinRepository;
        this.userRepository = userRepository;
    }

    // 1. Add Comment (Creation)
    public CommentDTO addComment(CommentCreationDTO creationDTO, Long currentUserId) {

        // 1. Convert DTO to Entity
        Comment newComment = DTOMapper.fromCommentCreationDTO(creationDTO);

        // 2. Fetch required related entities (User and Pin)
        User user = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + currentUserId));

        Pin pin = pinRepository.findById(creationDTO.getPinId())
                .orElseThrow(() -> new ResourceNotFoundException("Pin not found with ID: " + creationDTO.getPinId()));

        // 3. Set relationships and creation date
        newComment.setUser(user);
        newComment.setPin(pin);
        newComment.setCreatedDate(LocalDateTime.now());

        // 4. Save and map back to DTO
        Comment savedComment = commentRepository.save(newComment);

        return DTOMapper.toCommentDTO(savedComment);
    }

    // 2. Get Comments by Pin ID (Retrieval)
    public List<CommentDTO> getCommentsByPinId(Long pinId) {

        // Verify the Pin exists (throws 404 if not found)
        if (!pinRepository.existsById(pinId)) {
            throw new ResourceNotFoundException("Pin not found with ID: " + pinId);
        }

        // Assuming CommentRepository has a method 'findByPinId' defined
        List<Comment> comments = commentRepository.findByPin_PinId(pinId);

        // Map the list of Entities to a list of DTOs
        return comments.stream()
                .map(DTOMapper::toCommentDTO)
                .collect(Collectors.toList());
    }

    // 3. Delete Comment
    public void deleteComment(Long commentId) {
        if (!commentRepository.existsById(commentId)) {
            throw new ResourceNotFoundException("Comment not found with ID: " + commentId);
        }
        // to ensure the user is the owner or an admin.
        commentRepository.deleteById(commentId);
    }

    //    @Autowired
//    private CommentRepository commentRepository;
//
//    public List<Comment> getAllComments() {
//        return commentRepository.findAll();
//    }
//
//    public Optional<Comment> getCommentById(Long id) {
//        return commentRepository.findById(id);
//    }
//
//    public List<Comment> getCommentsByPinId(Long pinId) {
//        return commentRepository.findByPin_PinId(pinId);
//    }
//
//    public Comment addComment(Comment comment) {
//        comment.setCreatedDate(LocalDateTime.now());
//        return commentRepository.save(comment);
//    }
//
//    public Comment updateComment(Long id, Comment updatedComment) {
//        return commentRepository.findById(id).map(comment -> {
//            comment.setText(updatedComment.getText());
//            return commentRepository.save(comment);
//        }).orElseThrow(() -> new RuntimeException("Comment not found with id " + id));
//    }
//
//    public void deleteComment(Long id) {
//        commentRepository.deleteById(id);
//    }
}