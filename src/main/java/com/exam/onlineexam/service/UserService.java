package com.exam.onlineexam.service;

import com.exam.onlineexam.dto.RegisterRequest;
import com.exam.onlineexam.model.User;

import java.util.List;

public interface UserService {
    
    List<User> findAllUsers();
    
    User findUserById(Long id);
    
    User findByUsername(String username);
    
    boolean existsByUsername(String username);
    
    boolean existsByEmail(String email);
    
    User createUser(RegisterRequest registerRequest);
    
    User updateUser(Long id, User user);
    
    void deleteUser(Long id);
}
