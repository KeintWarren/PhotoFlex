package com.example.appdev.poliquitoct6.util;

import com.example.appdev.poliquitoct6.dto.*;
import com.example.appdev.poliquitoct6.entity.*;

import java.util.Optional;

public class DTOMapper {

    private static final String FALLBACK_IMAGE_URL = "https://placehold.co/600x400/3B82F6/ffffff?text=Image+URL";
    private static final String BAD_PLACEHOLDER_URL = "https://placehold.co/600x400/9CA3AF/ffffff?text=Error";

    private static String getValidatedImageURL(String rawUrl){
        if (rawUrl == null || rawUrl.trim().isEmpty() || rawUrl.equals(BAD_PLACEHOLDER_URL)) {
            return FALLBACK_IMAGE_URL;
        }
        return rawUrl;
    }

    // 1. User Entity to UserDto
    public static UserDTO toUserDTO(User user){
        if (user == null){
            return null;
        }
        UserDTO dto =new UserDTO();
        dto.setUserId(user.getUserId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setProfilePicture(user.getProfilePicture());
        dto.setBio(user.getBio());
        dto.setCreatedDate(user.getCreatedDate());
        return dto;
    }

    // 2. Pin Entity to PinDto
    public static PinDTO toPinDTO(Pin pin, boolean isLiked){
        if (pin == null) {
            return null;
        }

        PinDTO dto = new PinDTO();
        dto.setPinId(pin.getPinId());
        dto.setUser(toUserDTO(pin.getUser()));

        // Map board details minimally to avoid circular dependency
        Optional.ofNullable(pin.getBoard()).ifPresent(board -> {
            dto.setBoardId(board.getBoardId());
            dto.setBoardTitle(board.getTitle());
        });

        dto.setImageURL(getValidatedImageURL(pin.getImageURL()));

        dto.setTitle(pin.getTitle());
        dto.setDescription(pin.getDescription());
        dto.setCreatedDate(pin.getCreatedDate());

        dto.setLikeCount(pin.getLikeCount());
        dto.setCommentCount(pin.getCommentCount());
        dto.setLiked(isLiked);

        return dto;
    }

    // 3. Board Entity to BoardDto
    public static BoardDTO toBoardDTO(Board board, Integer pinCount) {
        if (board == null) {
            return null;
        }

        BoardDTO dto = new BoardDTO();
        dto.setBoardId(board.getBoardId());
        dto.setTitle(board.getTitle());
        dto.setDescription(board.getDescription());
        dto.setVisibility(board.getVisibility());
        dto.setCreatedAt(board.getCreatedAt());

        // Map the owner
        dto.setUser(toUserDTO(board.getUser()));
        dto.setPinCount(pinCount);
        dto.setCoverImage(getValidatedImageURL(board.getCoverImage()));

        return dto;
    }

    // 4. Comment Entity to CommentDto
    public static CommentDTO toCommentDTO(Comment comment) {
        if (comment == null) {
            return null;
        }

        CommentDTO dto = new CommentDTO();

        dto.setCommentId(comment.getCommentId());
        dto.setText(comment.getText());
        dto.setCreatedDate(comment.getCreatedDate());

        // Map the author
        dto.setUser(toUserDTO(comment.getUser()));

        return dto;
    }

    // 5. PinCreationDto to Pin Entity
    public static Pin fromPinCreationDTO(PinCreationDTO dto) {
        if (dto == null) {
            return null;
        }

        Pin pin = new Pin();
        // Set fields from DTO. userId and board reference must be set in the service layer.
        pin.setTitle(dto.getTitle());
        pin.setDescription(dto.getDescription());
        pin.setImageURL(dto.getImageURL());

        return pin;
    }

    // 6. UserRegistrationDto to User Entity
    public static User fromUserRegistrationDTO(UserRegistrationDTO dto) {
        if (dto == null) {
            return null;
        }

        User user = new User();
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword());

        return user;
    }

    // 7. CommentCreationDto to Comment Entity
    public static Comment fromCommentCreationDTO(CommentCreationDTO dto) {
        if (dto == null) {
            return null;
        }

        Comment comment = new Comment();
        comment.setText(dto.getText());
        // Pin and User references must be set in the service layer.

        return comment;
    }

    // 8. BoardCreationDto to Board Entity
    public static Board fromBoardCreationDTO(BoardCreationDTO dto) {
        if (dto == null) {
            return null;
        }

        Board board = new Board();
        board.setTitle(dto.getTitle());
        board.setDescription(dto.getDescription());
        board.setVisibility(dto.getVisibility());
        board.setCoverImage(dto.getCoverImage());

        // User reference and creation date are set in the service layer.

        return board;
    }
}