package com.example.attendancesystem.controller;

import com.example.attendancesystem.entity.Batch;
import com.example.attendancesystem.entity.Department;
import com.example.attendancesystem.service.BatchService;
import com.example.attendancesystem.service.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/batches")
@CrossOrigin(origins = "http://localhost:3000")
public class BatchApiController {

    @Autowired
    private BatchService batchService;

    @Autowired
    private DepartmentService departmentService;

    @GetMapping
    public List<Batch> list() {
        return batchService.getAllBatches();
    }

    @GetMapping("/{id}")
    public Batch get(@PathVariable Long id) {
        return batchService.getBatchById(id).orElse(null);
    }

    @PostMapping
    public Batch create(@RequestBody Batch payload) {
        if (payload.getDepartment() != null && payload.getDepartment().getId() != null) {
            Department dep = departmentService.getDepartmentById(payload.getDepartment().getId()).orElse(null);
            payload.setDepartment(dep);
        }
        return batchService.saveBatch(payload);
    }

    @PutMapping("/{id}")
    public Batch update(@PathVariable Long id, @RequestBody Batch payload) {
        Batch existing = batchService.getBatchById(id).orElse(null);
        if (existing == null) return null;
        existing.setName(payload.getName());
        existing.setYear(payload.getYear());
        if (payload.getDepartment() != null && payload.getDepartment().getId() != null) {
            Department dep = departmentService.getDepartmentById(payload.getDepartment().getId()).orElse(null);
            existing.setDepartment(dep);
        } else {
            existing.setDepartment(null);
        }
        return batchService.saveBatch(existing);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        batchService.deleteBatch(id);
    }
}
