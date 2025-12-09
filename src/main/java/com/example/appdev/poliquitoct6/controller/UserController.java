package com.example.appdev.poliquitoct6.controller;

import com.example.appdev.poliquitoct6.dto.UserDTO;
import com.example.appdev.poliquitoct6.dto.UserRegistrationDTO;
import com.example.appdev.poliquitoct6.dto.UserUpdateDTO;
import com.example.appdev.poliquitoct6.dto.LoginRequest; // NEW: Login DTO
import com.example.appdev.poliquitoct6.service.UserService;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager; // NEW: Import
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken; // NEW: Import
import org.springframework.security.core.Authentication; // For getting the logged-in user
import org.springframework.security.core.context.SecurityContextHolder; // NEW: Import
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class UserController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager; // NEW: Injected for Login

    // Constructor Injection (Updated to include AuthenticationManager)
    public UserController(UserService userService, AuthenticationManager authenticationManager) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
    }

    // 1. PUBLIC: Register New User (POST /api/users/register)
    @PostMapping("/register")
    public ResponseEntity<UserDTO> registerUser(@Valid @RequestBody UserRegistrationDTO registrationDTO) {
        UserDTO newUser = userService.registerUser(registrationDTO);
        return new ResponseEntity<>(newUser, HttpStatus.CREATED);
    }


    // 2. PUBLIC: Login (POST /api/users/login)
    @PostMapping("/login")
    public ResponseEntity<String> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        // 1. Process authentication using the AuthenticationManager
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );

        // 2. Set the successfully authenticated object in the Security Context
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // NOTE: In a production environment, you would generate and return a JWT here.
        return new ResponseEntity<>("User logged in successfully!", HttpStatus.OK);
    }


    // 3. PUBLIC: Get All Users (GET /api/users)
    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }


    // 4. PUBLIC: Get User Profile by ID (GET /api/users/{id})
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        UserDTO user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }


    // 5. SECURED: Update Own Profile (PUT /api/users/me)
    @PutMapping("/me")
    public ResponseEntity<UserDTO> updateCurrentUser(
            @Valid @RequestBody UserUpdateDTO updateDTO,
            Authentication authentication) {

        // Retrieve ID using the secured lookup logic (authentication.getName() is the username)
        Long currentUserId = userService.getUserIdByUsername(authentication.getName());

        UserDTO updatedUser = userService.updateUser(currentUserId, updateDTO);
        return ResponseEntity.ok(updatedUser);
    }


    // 6. SECURED: Delete Own Profile (DELETE /api/users/me)
    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteCurrentUser(Authentication authentication) {

        // Retrieve ID using the secured lookup logic
        Long currentUserId = userService.getUserIdByUsername(authentication.getName());

        userService.deleteUser(currentUserId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}