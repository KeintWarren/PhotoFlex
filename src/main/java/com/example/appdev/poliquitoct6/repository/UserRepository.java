package com.example.appdev.poliquitoct6.repository;

import com.example.appdev.poliquitoct6.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
}