package com.example.attendancesystem.controller;

import com.example.attendancesystem.entity.User;
import com.example.attendancesystem.service.StudentService;
import com.example.attendancesystem.service.UserService;
import com.example.attendancesystem.service.TeacherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserApiController {

    @Autowired
    private UserService userService;

    @Autowired
    private StudentService studentService;

    @Autowired
    private TeacherService teacherService;

@GetMapping
    public org.springframework.data.domain.Page<User> getAll(org.springframework.data.domain.Pageable pageable) {
        org.springframework.data.domain.Page<User> page = userService.getAllUsers(pageable);
        return page.map(u -> {
            if ("STUDENT".equalsIgnoreCase(u.getRole())) {
                studentService.findByUserId(u.getId()).ifPresent(u::setStudent);
            } else if ("TEACHER".equalsIgnoreCase(u.getRole())) {
                teacherService.findByUserId(u.getId()).ifPresent(u::setTeacher);
            }
            return u;
        });
    }

    @GetMapping("/{id}")
    public User get(@PathVariable Long id) {
        User user = userService.getUserById(id).orElse(null);
        if (user != null) {
            if ("STUDENT".equalsIgnoreCase(user.getRole())) {
                studentService.findByUserId(user.getId()).ifPresent(user::setStudent);
            } else if ("TEACHER".equalsIgnoreCase(user.getRole())) {
                teacherService.findByUserId(user.getId()).ifPresent(user::setTeacher);
            }
        }
        return user;
    }

    @PostMapping
    public User create(@RequestBody User user) {
        if(user.getPassword() != null && !user.getPassword().startsWith("$2a$")) {
            user.setPassword(userService.findByUsername(user.getUsername()) == null ? user.getPassword() : user.getPassword());
        }
        return userService.saveUser(user);
    }

    @PutMapping("/{id}")
    public User update(@PathVariable Long id, @RequestBody User u) {
        User existing = userService.getUserById(id).orElse(null);
        if(existing == null) return null;
        existing.setUsername(u.getUsername());
        if(u.getPassword() != null && !u.getPassword().isBlank()) {
            existing.setPassword(u.getPassword());
        }
        existing.setRole(u.getRole());
        return userService.saveUser(existing);
    }

@DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        User u = userService.getUserById(id).orElse(null);
        if (u != null && "TEACHER".equalsIgnoreCase(u.getRole()) && u.getTeacher() != null) {
            Long teacherId = u.getTeacher().getId();
            u.setTeacher(null);
            userService.saveUser(u);
            userService.deleteUser(id);
            teacherService.safeDeleteTeacher(teacherId);
            return;
        }
        userService.deleteUser(id);
    }
}
