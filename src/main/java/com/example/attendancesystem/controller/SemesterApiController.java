package com.example.attendancesystem.controller;

import com.example.attendancesystem.entity.Semester;
import com.example.attendancesystem.service.SemesterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/semesters")
@CrossOrigin(origins = "http://localhost:3000")
public class SemesterApiController {

    @Autowired
    private SemesterService semesterService;

    @Autowired
    private com.example.attendancesystem.service.DepartmentService departmentService;

    @GetMapping
    public List<Semester> getAll() {
        return semesterService.getAllSemesters();
    }

    @GetMapping("/{id}")
    public Semester get(@PathVariable Long id) {
        return semesterService.getSemesterById(id).orElse(null);
    }

    @PostMapping
    public Semester create(@RequestBody Semester sem) {
        if (sem.getDepartment() != null && sem.getDepartment().getId() != null) {
            sem.setDepartment(departmentService.getDepartmentById(sem.getDepartment().getId()).orElse(null));
        }
        return semesterService.saveSemester(sem);
    }

    @PutMapping("/{id}")
    public Semester update(@PathVariable Long id, @RequestBody Semester payload) {
        Semester existing = semesterService.getSemesterById(id).orElse(null);
        if (existing == null) return null;
        existing.setName(payload.getName());
        existing.setNumber(payload.getNumber());
        if (payload.getDepartment() != null && payload.getDepartment().getId() != null) {
            existing.setDepartment(departmentService.getDepartmentById(payload.getDepartment().getId()).orElse(null));
        } else {
            existing.setDepartment(null);
        }
        return semesterService.saveSemester(existing);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        semesterService.deleteSemester(id);
    }
}
