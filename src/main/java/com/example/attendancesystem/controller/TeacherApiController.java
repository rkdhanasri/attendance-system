package com.example.attendancesystem.controller;

import com.example.attendancesystem.entity.Student;
import com.example.attendancesystem.entity.Teacher;
import com.example.attendancesystem.entity.User;
import com.example.attendancesystem.service.StudentService;
import com.example.attendancesystem.service.TeacherService;
import com.example.attendancesystem.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/teachers")
@CrossOrigin(origins = "http://localhost:3000")
public class TeacherApiController {

    @Autowired
    private TeacherService teacherService;

    @Autowired
    private UserService userService;

@Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private StudentService studentService;

@GetMapping
    public List<User> getTeachers() {
        return userService.getAllUsers().stream().filter(u -> "TEACHER".equalsIgnoreCase(u.getRole())).map(u -> {
            teacherService.findByUserId(u.getId()).ifPresent(u::setTeacher);
            return u;
        }).collect(Collectors.toList());
    }

    @GetMapping(params = {"page", "size"})
    public org.springframework.data.domain.Page<User> getTeachersPage(org.springframework.data.domain.Pageable pageable) {
        return teacherService.getAllTeacherUsers(pageable);
    }

    @GetMapping("/{id}/students")
    public List<Student> getTeacherStudents(@PathVariable Long id) {
        Teacher teacher = resolveTeacher(id);
        if (teacher == null) {
            return List.of();
        }
        return studentService.getStudentsByTeacher(teacher.getId());
    }

    @GetMapping("/{id}")
    public User getTeacher(@PathVariable Long id) {
        return userService.getUserById(id).orElse(null);
    }

    @PostMapping
    public User createTeacher(@RequestBody TeacherRequest req) {
        Teacher teacher = new Teacher();
        teacher.setName(req.getName());
        teacher.setEmail(req.getEmail());
        teacher.setDesignation(req.getDesignation());
        teacher = teacherService.saveTeacher(teacher);

        User user = new User();
        user.setUsername(req.getUsername());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setRole("TEACHER");
        user.setTeacher(teacher);
        userService.saveUser(user);

        return user;
    }

    @PutMapping("/{id}")
    public User updateTeacher(@PathVariable Long id, @RequestBody TeacherRequest req) {
        User u = userService.getUserById(id).orElse(null);
        if (u == null || !"TEACHER".equals(u.getRole())) return null;

        Teacher t = u.getTeacher();
        if (t != null) {
            t.setName(req.getName());
            t.setEmail(req.getEmail());
            t.setDesignation(req.getDesignation());
            teacherService.saveTeacher(t);
        }

        u.setUsername(req.getUsername());
        if (req.getPassword() != null && !req.getPassword().isBlank()) {
            u.setPassword(passwordEncoder.encode(req.getPassword()));
        }
        userService.saveUser(u);
        return u;
    }

@DeleteMapping("/{id}")
    public void deleteTeacher(@PathVariable Long id) {
        User u = userService.getUserById(id).orElse(null);
        if (u != null && "TEACHER".equals(u.getRole()) && u.getTeacher() != null) {
            Long teacherId = u.getTeacher().getId();
            u.setTeacher(null);
            userService.saveUser(u);
            userService.deleteUser(id);
            teacherService.safeDeleteTeacher(teacherId);
        }
    }

    private Teacher resolveTeacher(Long teacherOrUserId) {
        User user = userService.getUserById(teacherOrUserId).orElse(null);
        if (user != null && user.getTeacher() != null) {
            return user.getTeacher();
        }
        return teacherService.getTeacherById(teacherOrUserId).orElse(null);
    }

    public static class TeacherRequest {
        private String name;
        private String email;
        private String designation;
        private String username;
        private String password;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getDesignation() { return designation; }
        public void setDesignation(String designation) { this.designation = designation; }
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
}
