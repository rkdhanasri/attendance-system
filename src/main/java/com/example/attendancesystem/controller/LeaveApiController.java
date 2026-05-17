package com.example.attendancesystem.controller;

import com.example.attendancesystem.entity.LeaveRequest;
import com.example.attendancesystem.entity.Student;
import com.example.attendancesystem.service.LeaveService;
import com.example.attendancesystem.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaves")
@CrossOrigin(origins = "http://localhost:3000")
public class LeaveApiController {

    @Autowired
    private LeaveService leaveService;

    @Autowired
    private StudentService studentService;

    @GetMapping
    public List<LeaveRequest> list() {
        return leaveService.getAllLeaves();
    }

    @GetMapping("/student/{studentId}")
    public List<LeaveRequest> leavesByStudent(@PathVariable Long studentId) {
        return leaveService.getLeavesByStudent(studentId);
    }

    @GetMapping("/{id}")
    public LeaveRequest get(@PathVariable Long id) {
        return leaveService.getLeaveById(id).orElse(null);
    }

    @PostMapping
    public LeaveRequest requestLeave(@RequestBody LeaveRequest leaveRequest) {
        if (leaveRequest.getStudent() != null && leaveRequest.getStudent().getId() != null) {
            Student s = studentService.getStudentById(leaveRequest.getStudent().getId()).orElse(null);
            leaveRequest.setStudent(s);
        }
        leaveRequest.setStatus("PENDING");
        leaveService.saveLeave(leaveRequest);
        return leaveRequest;
    }

    @PutMapping("/{id}")
    public LeaveRequest update(@PathVariable Long id, @RequestBody LeaveRequest payload) {
        LeaveRequest existing = leaveService.getLeaveById(id).orElse(null);
        if (existing == null) return null;
        existing.setReason(payload.getReason());
        existing.setStartDate(payload.getStartDate());
        existing.setEndDate(payload.getEndDate());
        existing.setStatus(payload.getStatus());
        leaveService.saveLeave(existing);
        return existing;
    }

    @PutMapping("/{id}/approve")
    public LeaveRequest approve(@PathVariable Long id) {
        leaveService.updateLeaveStatus(id, "APPROVED");
        return leaveService.getLeaveById(id).orElse(null);
    }

    @PutMapping("/{id}/reject")
    public LeaveRequest reject(@PathVariable Long id) {
        leaveService.updateLeaveStatus(id, "REJECTED");
        return leaveService.getLeaveById(id).orElse(null);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        leaveService.deleteLeave(id);
    }
}
