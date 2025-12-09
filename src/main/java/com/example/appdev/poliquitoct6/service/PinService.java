package com.example.appdev.poliquitoct6.service;

import com.example.appdev.poliquitoct6.dto.PinCreationDTO;
import com.example.appdev.poliquitoct6.dto.PinDTO;
import com.example.appdev.poliquitoct6.entity.Board;
import com.example.appdev.poliquitoct6.entity.Pin;
import com.example.appdev.poliquitoct6.entity.User;
import com.example.appdev.poliquitoct6.exception.ResourceNotFoundException;
import com.example.appdev.poliquitoct6.repository.*;
import com.example.appdev.poliquitoct6.util.DTOMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PinService {
    private final PinRepository pinRepository;
    private final LikeRepository likeRepository;
    private final UserRepository userRepository;
    private final BoardRepository boardRepository;

    public PinService(PinRepository pinRepository, LikeRepository likeRepository, UserRepository userRepository, BoardRepository boardRepository) {
        this.pinRepository = pinRepository;
        this.likeRepository = likeRepository;
        this.userRepository = userRepository;
        this.boardRepository = boardRepository;
    }


    // Creation Method (POST /api/pins)
    public PinDTO createPin(PinCreationDTO pinDTO, Long currentUserId){
        //DTO to Entity
        Pin newPin = DTOMapper.fromPinCreationDTO(pinDTO);

        //Fetch
        User user = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + currentUserId));

        Board board = boardRepository.findById(pinDTO.getBoardId())
                .orElseThrow(() -> new ResourceNotFoundException("Board not found with ID" + pinDTO.getBoardId()));

        newPin.setUser(user);
        newPin.setBoard(board);
        newPin.setCreatedDate(LocalDateTime.now());

        Pin savedPin = pinRepository.save(newPin);

        // Newly created pin is not liked yet, so isLiked=false
        return DTOMapper.toPinDTO(savedPin, false);
    }


    // 1. Retrieval by ID (GET /api/pins/{pinId}) - Updated name to getPinById
    public PinDTO getPinById(Long pinId, Long currentUserId){

        Pin pin = pinRepository.findById(pinId)
                .orElseThrow(() -> new ResourceNotFoundException("Pin not found with ID:" + pinId));

        // Check like status only if a user ID is provided (authenticated)
        boolean isLiked = (currentUserId != null) &&
                likeRepository.existsByPin_PinIdAndUser_UserId(pinId, currentUserId);

        return DTOMapper.toPinDTO(pin, isLiked);

    }


    // 2. Collection Retrieval (GET /api/pins) - FIXED METHOD NAME
    public List<PinDTO> getAllPins(){
        List<Pin> pins = pinRepository.findAll();

        // Use a null currentUserId since this public endpoint assumes no authenticated user
        Long currentUserId = null;

        return pins.stream()
                .map(pin -> {
                    // isLiked is always false for the public feed (unless logic changes)
                    boolean isLiked = (currentUserId != null) &&
                            likeRepository.existsByPin_PinIdAndUser_UserId(pin.getPinId(), currentUserId);

                    return DTOMapper.toPinDTO(pin, isLiked);
                })
                .collect(Collectors.toList());
    }


    // 3. Deletion Method
    public void deletePin(Long pinId, Long currentUserId) {
        Pin pin = pinRepository.findById(pinId)
                .orElseThrow(() -> new ResourceNotFoundException("Pin not found with ID:" + pinId));

        // Authorization check: Ensure the current user owns the pin
        if (!pin.getUser().getUserId().equals(currentUserId)) {
            throw new IllegalArgumentException("User is not authorized to delete this pin.");
        }

        pinRepository.delete(pin);
    }
//    // Helper method to add counts to a single pin
//    private Pin addCountsToPin(Pin pin) {
//        int likeCount = likeRepository.countByPin_PinId(pin.getPinId());
//        int commentCount = commentRepository.countByPin_PinId(pin.getPinId());
//        pin.setLikeCount(likeCount);
//        pin.setCommentCount(commentCount);
//        return pin;
//    }
//
//    // Helper method to add counts to a list of pins
//    private List<Pin> addCountsToPins(List<Pin> pins) {
//        return pins.stream()
//                .map(this::addCountsToPin)
//                .collect(Collectors.toList());
//    }
//
//    public List<Pin> getAllPins() {
//        List<Pin> pins = pinRepository.findAll();
//        return addCountsToPins(pins);
//    }
//
//    public Optional<Pin> getPinById(Long id) {
//        Optional<Pin> pin = pinRepository.findById(id);
//        pin.ifPresent(this::addCountsToPin);
//        return pin;
//    }
//
//    public List<Pin> getPinsByUserId(Long userId) {
//        List<Pin> pins = pinRepository.findByUser_UserId(userId);
//        return addCountsToPins(pins);
//    }
//
//    public List<Pin> getPinsByBoardId(Long boardId) {
//        List<Pin> pins = pinRepository.findByBoard_BoardId(boardId);
//        return addCountsToPins(pins);
//    }
//
//    public Pin addPin(Pin pin) {
//        pin.setCreatedDate(LocalDateTime.now());
//        Pin savedPin = pinRepository.save(pin);
//        // Initialize counts to 0 for new pins
//        savedPin.setLikeCount(0);
//        savedPin.setCommentCount(0);
//        return savedPin;
//    }
//
//    public Pin updatePin(Long id, Pin updatedPin) {
//        return pinRepository.findById(id).map(pin -> {
//            pin.setBoard(updatedPin.getBoard());
//            pin.setTitle(updatedPin.getTitle());
//            pin.setDescription(updatedPin.getDescription());
//            pin.setImageURL(updatedPin.getImageURL());
//            Pin saved = pinRepository.save(pin);
//            return addCountsToPin(saved);
//        }).orElseThrow(() -> new RuntimeException("Pin not found with id " + id));
//    }
//
//    public void deletePin(Long id) {
//        pinRepository.deleteById(id);
//    }
}