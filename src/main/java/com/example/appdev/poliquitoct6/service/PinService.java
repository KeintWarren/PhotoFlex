package com.example.appdev.poliquitoct6.service;

import com.example.appdev.poliquitoct6.entity.Pin;
import com.example.appdev.poliquitoct6.repository.PinRepository;
import com.example.appdev.poliquitoct6.repository.LikeRepository;
import com.example.appdev.poliquitoct6.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PinService {

    @Autowired
    private PinRepository pinRepository;

    @Autowired
    private LikeRepository likeRepository;

    @Autowired
    private CommentRepository commentRepository;

    // Helper method to add counts to a single pin
    private Pin addCountsToPin(Pin pin) {
        int likeCount = likeRepository.countByPin_PinId(pin.getPinId());
        int commentCount = commentRepository.countByPin_PinId(pin.getPinId());
        pin.setLikeCount(likeCount);
        pin.setCommentCount(commentCount);
        return pin;
    }

    // Helper method to add counts to a list of pins
    private List<Pin> addCountsToPins(List<Pin> pins) {
        return pins.stream()
                .map(this::addCountsToPin)
                .collect(Collectors.toList());
    }

    public List<Pin> getAllPins() {
        List<Pin> pins = pinRepository.findAll();
        return addCountsToPins(pins);
    }

    public Optional<Pin> getPinById(Long id) {
        Optional<Pin> pin = pinRepository.findById(id);
        pin.ifPresent(this::addCountsToPin);
        return pin;
    }

    public List<Pin> getPinsByUserId(Long userId) {
        List<Pin> pins = pinRepository.findByUser_UserId(userId);
        return addCountsToPins(pins);
    }

    public List<Pin> getPinsByBoardId(Long boardId) {
        List<Pin> pins = pinRepository.findByBoard_BoardId(boardId);
        return addCountsToPins(pins);
    }

    public Pin addPin(Pin pin) {
        pin.setCreatedDate(LocalDateTime.now());
        Pin savedPin = pinRepository.save(pin);
        // Initialize counts to 0 for new pins
        savedPin.setLikeCount(0);
        savedPin.setCommentCount(0);
        return savedPin;
    }

    public Pin updatePin(Long id, Pin updatedPin) {
        return pinRepository.findById(id).map(pin -> {
            pin.setBoard(updatedPin.getBoard());
            pin.setTitle(updatedPin.getTitle());
            pin.setDescription(updatedPin.getDescription());
            pin.setImageURL(updatedPin.getImageURL());
            Pin saved = pinRepository.save(pin);
            return addCountsToPin(saved);
        }).orElseThrow(() -> new RuntimeException("Pin not found with id " + id));
    }

    public void deletePin(Long id) {
        pinRepository.deleteById(id);
    }
}