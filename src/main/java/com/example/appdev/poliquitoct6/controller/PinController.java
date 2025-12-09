package com.example.appdev.poliquitoct6.controller;

import com.example.appdev.poliquitoct6.dto.PinDTO;
import com.example.appdev.poliquitoct6.dto.PinCreationDTO;
import com.example.appdev.poliquitoct6.service.PinService;
import com.example.appdev.poliquitoct6.service.UserService; // To get UserId from principal

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication; // For current user
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pins")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class PinController {

    private final PinService pinService;
    private final UserService userService;

    public PinController(PinService pinService, UserService userService) {
        this.pinService = pinService;
        this.userService = userService;
    }

    // 1. SECURED: Create New Pin (POST /api/pins)
    @PostMapping
    public ResponseEntity<PinDTO> createPin(
            @Valid @RequestBody PinCreationDTO creationDto,
            Authentication authentication) {

        // Retrieve the authenticated user's database ID
        Long currentUserId = userService.getUserIdByUsername(authentication.getName());

        PinDTO newPin = pinService.createPin(creationDto, currentUserId);
        return new ResponseEntity<>(newPin, HttpStatus.CREATED);
    }


    // 2. PUBLIC: Get All Pins (GET /api/pins)
    @GetMapping
    public ResponseEntity<List<PinDTO>> getAllPins() {
        // If the service doesn't require currentUserId (i.e., it returns 'isLiked=false')
        List<PinDTO> pins = pinService.getAllPins();
        return ResponseEntity.ok(pins);
    }


    // 3. PUBLIC: Get Pin by ID (GET /api/pins/{id})
    @GetMapping("/{id}")
    public ResponseEntity<PinDTO> getPinById(@PathVariable Long id, Authentication authentication) {
        // If authenticated, pass the user ID to check 'isLiked'. If not authenticated, use null.
        Long currentUserId = (authentication != null && authentication.isAuthenticated()) ?
                userService.getUserIdByUsername(authentication.getName()) : null;

        PinDTO pin = pinService.getPinById(id, currentUserId);
        return ResponseEntity.ok(pin);
    }


    // 4. SECURED: Delete Pin (DELETE /api/pins/{id})
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePin(@PathVariable Long id, Authentication authentication) {

        // Retrieve the authenticated user's database ID
        Long currentUserId = userService.getUserIdByUsername(authentication.getName());

        // NOTE: Your PinService should implement a deletePin(Long id, Long userId) method
        // to verify ownership before deletion. Assuming it does, we call it here:
        pinService.deletePin(id, currentUserId);

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}