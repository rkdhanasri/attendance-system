package com.example.attendancesystem.service;

import com.example.attendancesystem.entity.Student;
import com.example.attendancesystem.entity.Subject;
import com.example.attendancesystem.entity.SubjectAttendance;
import com.example.attendancesystem.repository.SubjectAttendanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class SubjectAttendanceService {
    
    @Autowired
    private SubjectAttendanceRepository attendanceRepository;

    public void recordAttendance(Long studentId, Long subjectId, LocalDate date, boolean present) {
        Optional<SubjectAttendance> existingAttendance = attendanceRepository.findByStudentIdAndDate(studentId, date);
        SubjectAttendance attendance = existingAttendance.orElseGet(SubjectAttendance::new);

        Student student = new Student();
        student.setId(studentId);

        attendance.setStudent(student);
        attendance.setDate(date);
        attendance.setPresent(present);

        if (subjectId != null) {
            Subject subject = new Subject();
            subject.setId(subjectId);
            attendance.setSubject(subject);
        } else {
            attendance.setSubject(null);
        }

        attendanceRepository.save(attendance);
    }

    public Optional<SubjectAttendance> getAttendanceByStudentAndDate(Long studentId, LocalDate date) {
        return attendanceRepository.findByStudentIdAndDate(studentId, date);
    }

    public void saveAttendance(SubjectAttendance attendance) {
        attendanceRepository.save(attendance);
    }

    public List<SubjectAttendance> getAllAttendance() {
        return attendanceRepository.findAll();
    }
    
    public void deleteAttendance(Long id) {
        attendanceRepository.deleteById(id);
    }
}
