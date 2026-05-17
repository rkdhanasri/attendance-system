package com.example.attendancesystem.repository;

import com.example.attendancesystem.entity.SubjectAttendance;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface SubjectAttendanceRepository extends JpaRepository<SubjectAttendance, Long> {
    List<SubjectAttendance> findByStudentIdAndSubjectId(Long studentId, Long subjectId);
    Optional<SubjectAttendance> findByStudentIdAndDate(Long studentId, LocalDate date);
}
