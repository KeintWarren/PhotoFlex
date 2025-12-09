package com.example.appdev.poliquitoct6.service;

import com.example.appdev.poliquitoct6.dto.UserDTO;
import com.example.appdev.poliquitoct6.dto.UserRegistrationDTO;
import com.example.appdev.poliquitoct6.dto.UserUpdateDTO;
import com.example.appdev.poliquitoct6.entity.User;
import com.example.appdev.poliquitoct6.exception.ResourceNotFoundException;
import com.example.appdev.poliquitoct6.repository.UserRepository;
import com.example.appdev.poliquitoct6.util.DTOMapper;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections; // Used for simple authorities list
import java.util.List;
import java.util.stream.Collectors;

@Service
// IMPLEMENT THE SPRING SECURITY INTERFACE
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder){
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }


    // SPRING SECURITY IMPLEMENTATION (USER DETAIL SERVICE)
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username) // <-- Requires findByUsername in Repository
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        // This maps your application's User entity to Spring Security's UserDetails interface.
        // NOTE: If your User entity implements UserDetails, you can return 'user' directly.
        // Assuming your User entity *does not* implement UserDetails yet, we use Spring's User object:
        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                Collections.emptyList() // Simple list for roles/authorities (e.g., "ROLE_USER")
        );
    }

    // NEW UTILITY METHOD FOR CONTROLLERS

    /**
     * Retrieves the User ID based on the authenticated username.
     * Used by controllers to convert principal name to database ID.
     */
    public Long getUserIdByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
        return user.getUserId();
    }


    // ORIGINAL DTO METHODS

    // Registration (Accepts DTO, Encrypts Password)
    public UserDTO registerUser(UserRegistrationDTO registrationDTO){
        // Check for existing username/email before proceeding (Good practice)
        if (userRepository.findByUsername(registrationDTO.getUsername()).isPresent()) {
            throw new IllegalArgumentException("Username already taken.");
        }
        if (userRepository.findByEmail(registrationDTO.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already registered.");
        }

        User newUser = DTOMapper.fromUserRegistrationDTO(registrationDTO);
        newUser.setPassword(passwordEncoder.encode(registrationDTO.getPassword()));
        newUser.setCreatedDate(LocalDateTime.now());
        User savedUser = userRepository.save(newUser);
        return DTOMapper.toUserDTO(savedUser);
    }

    // Retrieval by ID (Returns DTO)
    public UserDTO getUserById(Long id){
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
        return DTOMapper.toUserDTO(user);
    }

    // Retrieval ALl (Returns List<DTO>)
    public List<UserDTO> getAllUsers(){
        return userRepository.findAll().stream()
                .map(DTOMapper::toUserDTO)
                .collect(Collectors.toList());
    }

    //Update User (Accepts Update DTO)
    public UserDTO updateUser(Long id, UserUpdateDTO updateDTO){
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));

        // Update fields if provided
        if(updateDTO.getUsername() != null){
            // Optional: Check if the new username is already taken by someone else
            existingUser.setUsername(updateDTO.getUsername());
        }
        if (updateDTO.getBio() != null) {
            existingUser.setBio(updateDTO.getBio());
        }
        if (updateDTO.getProfilePicture() != null) {
            existingUser.setProfilePicture(updateDTO.getProfilePicture());
        }

        // Password update logic
        if (updateDTO.getOldPassword() != null && updateDTO.getNewPassword() != null) {
            if (!passwordEncoder.matches(updateDTO.getOldPassword(), existingUser.getPassword())) {
                throw new IllegalArgumentException("Incorrect old password.");
            }
            existingUser.setPassword(passwordEncoder.encode(updateDTO.getNewPassword()));
        }

        User updatedUser = userRepository.save(existingUser);
        return DTOMapper.toUserDTO(updatedUser);
    }

    //Delete User (Accepts ID)
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found with ID: " + id);
        }
        userRepository.deleteById(id);
    }
}