package com.example.attendancesystem.service; 

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.attendancesystem.entity.Teacher;
import com.example.attendancesystem.entity.User;
import com.example.attendancesystem.repository.TeacherRepository;
import com.example.attendancesystem.service.UserService;
import java.util.stream.Collectors;
import org.springframework.data.domain.PageImpl;

@Service
@Transactional
public class TeacherService {

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private StudentService studentService;

    public List<Teacher> getAllTeachers() {
        return teacherRepository.findAll();
    }

    public Optional<Teacher> getTeacherById(Long id) {
        return teacherRepository.findById(id);
    }

    public Teacher saveTeacher(Teacher teacher) {
        return teacherRepository.save(teacher);
    }

    public void deleteTeacher(Long id) {
        teacherRepository.deleteById(id);
    }

    public Optional<Teacher> findByUserId(Long userId) {
        return teacherRepository.findByUserId(userId);
    }

public void safeDeleteTeacher(Long id) {
        studentService.unlinkStudentsFromTeacher(id);
        teacherRepository.deleteById(id);
    }

    @Autowired
    private UserService userService;

    public org.springframework.data.domain.Page<User> getAllTeacherUsers(org.springframework.data.domain.Pageable pageable) {
        List<User> content = userService.getAllUsers().stream()
            .filter(u -> "TEACHER".equalsIgnoreCase(u.getRole()))
            .skip(pageable.getOffset())
            .limit(pageable.getPageSize())
            .map(u -> {
                findByUserId(u.getId()).ifPresent(u::setTeacher);
                return u;
            })
            .collect(Collectors.toList());
        long total = userService.getAllUsers().stream().filter(u -> "TEACHER".equalsIgnoreCase(u.getRole())).count();
        return new org.springframework.data.domain.PageImpl<>(content, pageable, total);
    }
}
