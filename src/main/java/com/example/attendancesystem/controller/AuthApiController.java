package com.example.attendancesystem.controller;

import com.example.attendancesystem.dto.RegistrationForm;
import com.example.attendancesystem.entity.User;
import com.example.attendancesystem.service.RegistrationService;
import com.example.attendancesystem.service.UserService;
import com.example.attendancesystem.service.StudentService;
import com.example.attendancesystem.service.TeacherService;
import com.example.attendancesystem.entity.Student;
import com.example.attendancesystem.entity.Teacher;
import java.util.Collections;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthApiController {

    @Autowired
    private RegistrationService registrationService;

    @Autowired
    private UserService userService;

    @Autowired
    private StudentService studentService;

    @Autowired
    private TeacherService teacherService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public String register(@RequestBody RegistrationForm form) {
        return registrationService.registerStudent(form.getName(), form.getStudentId(), form.getEmail(), form.getUsername(), form.getPassword());
    }

    @PostMapping("/login")
    public Object login(@RequestBody Map<String, String> loginRequest) {
        String username = loginRequest.get("username");
        String password = loginRequest.get("password");
        System.out.println("login payload: " + loginRequest);
        if (username == null || password == null) {
            return Collections.singletonMap("error", "username/password missing");
        }
        User user = userService.findByUsername(username);
        if (user == null) return Collections.singletonMap("error", "unknown user");
        if (!passwordEncoder.matches(password, user.getPassword())) return Collections.singletonMap("error", "bad password");

        // Populate student/teacher
        if ("STUDENT".equals(user.getRole())) {
            Student s = studentService.findByUserId(user.getId()).orElse(null);
            user.setStudent(s);
        }
        if ("TEACHER".equals(user.getRole())) {
            Teacher t = teacherService.findByUserId(user.getId()).orElse(null);
            user.setTeacher(t);
        }
        return user;
        
    }
}
