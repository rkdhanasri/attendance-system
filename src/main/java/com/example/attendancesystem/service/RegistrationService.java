package com.example.attendancesystem.service;

import com.example.attendancesystem.entity.User;
import com.example.attendancesystem.entity.Student;
import com.example.attendancesystem.repository.UserRepository;
import com.example.attendancesystem.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RegistrationService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private StudentRepository studentRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

@Transactional
    public String registerStudent(String name, String studentId, String email, String username, String password) {
        // Check if username already exists
        if (userRepository.findByUsername(username) != null) {
            return "Username already exists";
        }
        
        // Find existing Student by studentId (created by createStudent)
        Student student = studentRepository.findByStudentId(studentId)
            .orElse(null);
        if (student == null) {
            return "Student with ID '" + studentId + "' not found. Please create the student record first.";
        }
        
        // Create and save User with role STUDENT linked to existing student
        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole("STUDENT");
        user.setStudent(student);
        userRepository.save(user);
        
        return "success";
    }
}