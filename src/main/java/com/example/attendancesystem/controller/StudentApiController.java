package com.example.attendancesystem.controller;

import com.example.attendancesystem.entity.Batch;
import com.example.attendancesystem.entity.Student;
import com.example.attendancesystem.entity.Teacher;
import com.example.attendancesystem.entity.User;
import com.example.attendancesystem.service.BatchService;
import com.example.attendancesystem.service.StudentService;
import com.example.attendancesystem.service.TeacherService;
import com.example.attendancesystem.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "http://localhost:3000")
public class StudentApiController {

    @Autowired
    private StudentService studentService;

    @Autowired
    private BatchService batchService;

    @Autowired
    private TeacherService teacherService;

    @Autowired
    private UserService userService;

@GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public org.springframework.data.domain.Page<Student> getAllStudents(org.springframework.data.domain.Pageable pageable) {
        return studentService.getAllStudents(pageable);
    }

    @GetMapping("/{id}")
    public Student getStudent(@PathVariable Long id) {
        return studentService.getStudentById(id).orElse(null);
    }

    @PostMapping
    public Student saveStudent(@RequestBody Student student) {
        // Resolve batch if ID provided
        if (student.getBatch() != null && student.getBatch().getId() != null) {
            Optional<Batch> batchOpt = batchService.getBatchById(student.getBatch().getId());
            student.setBatch(batchOpt.orElse(null));
        } else {
            student.setBatch(null);
        }

        // Resolve teacher if ID provided
        if (student.getTeacher() != null && student.getTeacher().getId() != null) {
            student.setTeacher(resolveTeacher(student.getTeacher().getId()));
        } else {
            student.setTeacher(null);
        }

        return studentService.saveStudent(student);
    }

    @PutMapping("/{id}")
    public Student updateStudent(@PathVariable Long id, @RequestBody Student updateData) {
        Student existing = studentService.getStudentById(id).orElse(null);
        if (existing == null) return null;

        existing.setStudentId(updateData.getStudentId());
        existing.setName(updateData.getName());
        existing.setEmail(updateData.getEmail());

        // Resolve batch for update
        if (updateData.getBatch() != null && updateData.getBatch().getId() != null) {
            Optional<Batch> batchOpt = batchService.getBatchById(updateData.getBatch().getId());
            existing.setBatch(batchOpt.orElse(null));
        } else {
            existing.setBatch(null);
        }

        // Resolve teacher for update
        if (updateData.getTeacher() != null && updateData.getTeacher().getId() != null) {
            existing.setTeacher(resolveTeacher(updateData.getTeacher().getId()));
        } else {
            existing.setTeacher(null);
        }

        return studentService.saveStudent(existing);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
    }

    private Teacher resolveTeacher(Long teacherOrUserId) {
        User user = userService.getUserById(teacherOrUserId).orElse(null);
        if (user != null && user.getTeacher() != null) {
            return user.getTeacher();
        }
        return teacherService.getTeacherById(teacherOrUserId).orElse(null);
    }
}

