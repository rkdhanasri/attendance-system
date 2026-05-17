package com.example.attendancesystem.controller;

import com.example.attendancesystem.entity.Department;
import com.example.attendancesystem.service.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
@CrossOrigin(origins = "http://localhost:3000")
public class DepartmentApiController {

    @Autowired
    private DepartmentService departmentService;

    @GetMapping
    public List<Department> list() {
        return departmentService.getAllDepartments();
    }

    @GetMapping("/{id}")
    public Department get(@PathVariable Long id) {
        return departmentService.getDepartmentById(id).orElse(null);
    }

    @PostMapping
    public Department create(@RequestBody Department department) {
        return departmentService.saveDepartment(department);
    }

    @PutMapping("/{id}")
    public Department update(@PathVariable Long id, @RequestBody Department department) {
        Department existing = departmentService.getDepartmentById(id).orElse(null);
        if (existing == null) return null;
        existing.setName(department.getName());
        existing.setCode(department.getCode());
        return departmentService.saveDepartment(existing);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        departmentService.deleteDepartment(id);
    }
}
