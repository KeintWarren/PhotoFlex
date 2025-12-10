package com.example.appdev.poliquitoct6.service;

import com.example.appdev.poliquitoct6.entity.User;
import com.example.appdev.poliquitoct6.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public boolean emailExists(String email) {
        return userRepository.existsByEmail(email);
    }

    public User addUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        if (user.getCreatedDate() == null) {
            user.setCreatedDate(LocalDateTime.now());
        }
        return userRepository.save(user);
    }

    public User updateUser(Long id, User updatedUser) {
        return userRepository.findById(id).map(user -> {
            user.setUsername(updatedUser.getUsername());
            user.setEmail(updatedUser.getEmail());

            // Only update password if a new one is provided
            String newPassword = updatedUser.getPassword();
            if (newPassword != null && !newPassword.isEmpty()) {
                // It's a new plain text password, encode it
                user.setPassword(passwordEncoder.encode(newPassword));
            }
            // If newPassword is null or empty, keep the existing password unchanged

            user.setProfilePicture(updatedUser.getProfilePicture());
            user.setBio(updatedUser.getBio());

            // Don't update createdDate - preserve the original
            if (updatedUser.getCreatedDate() != null) {
                user.setCreatedDate(updatedUser.getCreatedDate());
            }

            return userRepository.save(user);
        }).orElseThrow(() -> new RuntimeException("User not found with id " + id));
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}