package com.example.attendancesystem.controller;

import com.example.attendancesystem.entity.SubjectAttendance;
import com.example.attendancesystem.entity.Student;
import com.example.attendancesystem.service.SubjectAttendanceService;
import com.example.attendancesystem.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(origins = "http://localhost:3000")
public class SubjectAttendanceApiController {

    @Autowired
    private SubjectAttendanceService attendanceService;

    @Autowired
    private StudentService studentService;

    @GetMapping
    public List<SubjectAttendance> list() {
        return attendanceService.getAllAttendance();
    }

    @GetMapping("/{id}")
    public SubjectAttendance get(@PathVariable Long id) {
        return attendanceService.getAllAttendance().stream().filter(a->a.getId().equals(id)).findFirst().orElse(null);
    }

    @PostMapping
    public SubjectAttendance create(@RequestBody AttendanceRequest req) {
        Student student = studentService.getStudentById(req.getStudentId()).orElse(null);
        if (student == null) return null;

        LocalDate attendanceDate = req.getDate() == null ? LocalDate.now() : req.getDate();
        SubjectAttendance attendance = attendanceService
            .getAttendanceByStudentAndDate(req.getStudentId(), attendanceDate)
            .orElseGet(SubjectAttendance::new);

        attendance.setStudent(student);
        attendance.setDate(attendanceDate);
        attendance.setPresent(req.isPresent());
        attendance.setSubject(null);
        attendanceService.saveAttendance(attendance);
        return attendance;
    }

@DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        attendanceService.deleteAttendance(id);
    }

    @GetMapping("/student/{studentId}/stats")
    public AttendanceStatsDto getStudentAttendanceStats(@PathVariable Long studentId) {
        List<SubjectAttendance> studentAttendance = attendanceService.getAllAttendance().stream()
            .filter(a -> a.getStudent() != null && a.getStudent().getId().equals(studentId))
            .collect(Collectors.toList());

        if (studentAttendance.isEmpty()) {
            return new AttendanceStatsDto(0.0, new ArrayList<>());
        }

        long presentCount = studentAttendance.stream().filter(SubjectAttendance::isPresent).count();
        double overallPercentage = (presentCount * 100.0) / studentAttendance.size();

        List<SubjectStatsDto> subjectStats = new ArrayList<>();
        subjectStats.add(new SubjectStatsDto(
            "Daily Attendance",
            (int) presentCount,
            studentAttendance.size(),
            Math.round(overallPercentage * 10) / 10.0
        ));

        return new AttendanceStatsDto(overallPercentage, subjectStats);
    }

    static class AttendanceStatsDto {
        public double overallPercentage;
        public List<SubjectStatsDto> subjects;

        public AttendanceStatsDto(double overallPercentage, List<SubjectStatsDto> subjects) {
            this.overallPercentage = overallPercentage;
            this.subjects = subjects;
        }
    }

    static class SubjectStatsDto {
        public String subjectName;
        public int presentCount;
        public int totalCount;
        public double percentage;

        public SubjectStatsDto(String subjectName, int presentCount, int totalCount, double percentage) {
            this.subjectName = subjectName;
            this.presentCount = presentCount;
            this.totalCount = totalCount;
            this.percentage = percentage;
        }
    }

    public static class AttendanceRequest {
        private Long studentId;
        private Long subjectId;
        private boolean present;
        private LocalDate date;

        public Long getStudentId() { return studentId; }
        public void setStudentId(Long studentId) { this.studentId = studentId; }
        public Long getSubjectId() { return subjectId; }
        public void setSubjectId(Long subjectId) { this.subjectId = subjectId; }
        public boolean isPresent() { return present; }
        public void setPresent(boolean present) { this.present = present; }
        public LocalDate getDate() { return date; }
        public void setDate(LocalDate date) { this.date = date; }
    }
}
