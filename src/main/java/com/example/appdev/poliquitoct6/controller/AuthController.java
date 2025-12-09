package com.example.appdev.poliquitoct6.controller;

import com.example.appdev.poliquitoct6.dto.AuthRequest;
import com.example.appdev.poliquitoct6.dto.AuthResponse;
import com.example.appdev.poliquitoct6.dto.SignupRequest;
import com.example.appdev.poliquitoct6.entity.User;
import com.example.appdev.poliquitoct6.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest request) {
        if (userService.emailExists(request.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("message", "Email already in use"));
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setBio(request.getBio());
        user.setProfilePicture(request.getProfilePicture());
        user.setCreatedDate(LocalDateTime.now());

        User saved = userService.addUser(user);
        return ResponseEntity.ok(new AuthResponse("Signup successful", saved));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        return userService.getUserByEmail(request.getEmail())
                .map(user -> {
                    boolean matches = passwordEncoder.matches(request.getPassword(), user.getPassword());
                    if (!matches) {
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                .body(Map.of("message", "Invalid email or password"));
                    }
                    return ResponseEntity.ok(new AuthResponse("Login successful", user));
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Invalid email or password")));
    }
}

