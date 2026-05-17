package com.example.attendancesystem.controller;

import com.example.attendancesystem.entity.Semester;
import com.example.attendancesystem.entity.Subject;
import com.example.attendancesystem.entity.User;
import com.example.attendancesystem.entity.Teacher;
import com.example.attendancesystem.service.SemesterService;
import com.example.attendancesystem.service.SubjectService;
import com.example.attendancesystem.service.TeacherService;
import com.example.attendancesystem.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subjects")
@CrossOrigin(origins = "http://localhost:3000")
public class SubjectApiController {

    @Autowired
    private SubjectService subjectService;

    @Autowired
    private SemesterService semesterService;

    @Autowired
    private UserService userService;

    @Autowired
    private TeacherService teacherService;

@GetMapping
    public List<Subject> getAll() {
        return subjectService.getAllSubjects();
    }

    @GetMapping("/teacher/{teacherId}")
    public List<Subject> getByTeacher(@PathVariable Long teacherId) {
        Teacher teacher = resolveTeacher(teacherId);
        if (teacher == null) {
            return List.of();
        }
        return subjectService.getSubjectsByTeacher(teacher.getId());
    }

    @GetMapping("/{id}")
    public Subject getById(@PathVariable Long id) {
        return subjectService.getSubjectById(id).orElse(null);
    }

    @PostMapping
    public Subject create(@RequestBody Subject dto) {
        Subject subject = new Subject();
        subject.setName(dto.getName());
        subject.setCode(dto.getCode());

        if (dto.getSemester() != null && dto.getSemester().getId() != null) {
            Semester s = semesterService.getSemesterById(dto.getSemester().getId()).orElse(null);
            subject.setSemester(s);
        }

        if (dto.getTeacher() != null && dto.getTeacher().getId() != null) {
            subject.setTeacher(resolveTeacher(dto.getTeacher().getId()));
        }

        return subjectService.saveSubject(subject);
    }

    @PutMapping("/{id}")
    public Subject update(@PathVariable Long id, @RequestBody Subject dto) {
        Subject existing = subjectService.getSubjectById(id).orElse(null);
        if (existing == null) return null;

        existing.setName(dto.getName());
        existing.setCode(dto.getCode());

        if (dto.getSemester() != null && dto.getSemester().getId() != null) {
            Semester s = semesterService.getSemesterById(dto.getSemester().getId()).orElse(null);
            existing.setSemester(s);
        } else {
            existing.setSemester(null);
        }

        if (dto.getTeacher() != null && dto.getTeacher().getId() != null) {
            existing.setTeacher(resolveTeacher(dto.getTeacher().getId()));
        } else {
            existing.setTeacher(null);
        }

        return subjectService.saveSubject(existing);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        subjectService.deleteSubject(id);
    }

    private Teacher resolveTeacher(Long teacherOrUserId) {
        User user = userService.getUserById(teacherOrUserId).orElse(null);
        if (user != null && user.getTeacher() != null) {
            return user.getTeacher();
        }
        return teacherService.getTeacherById(teacherOrUserId).orElse(null);
    }
}
