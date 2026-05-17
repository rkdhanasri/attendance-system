package com.example.attendancesystem.service;

import com.example.attendancesystem.entity.LeaveRequest;
import com.example.attendancesystem.repository.LeaveRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class LeaveService {
    
    @Autowired
    private LeaveRepository leaveRepository;

    public List<LeaveRequest> getLeavesByStudent(Long studentId) {
        return leaveRepository.findByStudentId(studentId);
    }

    public Optional<LeaveRequest> getLeaveById(Long id) {
        return leaveRepository.findById(id);
    }

    public void saveLeave(LeaveRequest leave) {
        leaveRepository.save(leave);
    }

    public List<LeaveRequest> getAllLeaves() {
        return leaveRepository.findAll();
    }

    public void updateLeaveStatus(Long id, String status) {
        Optional<LeaveRequest> leaveOpt = leaveRepository.findById(id);
        if (leaveOpt.isPresent()) {
            LeaveRequest leave = leaveOpt.get();
            leave.setStatus(status);
            leaveRepository.save(leave);
        }
    }
    
    public void deleteLeave(Long id) {
        leaveRepository.deleteById(id);
    }
}