package com.example.appdev.poliquitoct6.service;

import com.example.appdev.poliquitoct6.dto.PinCreateRequest;
import com.example.appdev.poliquitoct6.entity.Pin;
import com.example.appdev.poliquitoct6.entity.User;
import com.example.appdev.poliquitoct6.entity.Board;
import com.example.appdev.poliquitoct6.repository.PinRepository;
import com.example.appdev.poliquitoct6.repository.UserRepository;
import com.example.appdev.poliquitoct6.repository.BoardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PinService {

    @Autowired private PinRepository pinRepository;
    @Autowired private UserRepository userRepository; // Dependency for fetching User entity
    @Autowired private BoardRepository boardRepository; // Dependency for fetching Board entity

    public List<Pin> getAllPins() {
        return pinRepository.findAll();
    }

    public Optional<Pin> getPinById(Long id) {
        return pinRepository.findById(id);
    }

    public List<Pin> getPinsByUserId(Long userId) {
        return pinRepository.findByUser_UserId(userId);
    }

    public List<Pin> getPinsByBoardId(Long boardId) {
        return pinRepository.findByBoard_BoardId(boardId);
    }

    //DTO INTEGRATION (Create)
    public Pin createPin(PinCreateRequest request) {
        Pin pin = convertToEntity(request);
        pin.setCreatedDate(LocalDateTime.now());
        return pinRepository.save(pin);
    }

    public Pin updatePin(Long id, Pin updatedPin) {
        return pinRepository.findById(id).map(pin -> {
            pin.setTitle(updatedPin.getTitle());
            pin.setDescription(updatedPin.getDescription());
            pin.setImageURL(updatedPin.getImageURL());
            // Note: Does not allow changing user/board via update
            return pinRepository.save(pin);
        }).orElseThrow(() -> new RuntimeException("Pin not found with id " + id));
    }

    public void deletePin(Long id) {
        pinRepository.deleteById(id);
    }

    //DTO CONVERSION LOGIC
    private Pin convertToEntity(PinCreateRequest request) {
        Pin pin = new Pin();

        pin.setTitle(request.getTitle());
        pin.setDescription(request.getDescription());
        pin.setImageURL(request.getImageUrl());

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found for Pin creation with ID " + request.getUserId()));

        Board board = boardRepository.findById(request.getBoardId())
                .orElseThrow(() -> new RuntimeException("Board not found for Pin creation with ID " + request.getBoardId()));

        pin.setUser(user);
        pin.setBoard(board);

        return pin;
    }
}