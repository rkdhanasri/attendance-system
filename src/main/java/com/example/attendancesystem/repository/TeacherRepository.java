package com.example.attendancesystem.repository;

import com.example.attendancesystem.entity.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

public interface TeacherRepository extends JpaRepository<Teacher, Long> {
@Query("SELECT u.teacher FROM User u WHERE u.id = :userId")
    Optional<Teacher> findByUserId(@Param("userId") Long userId);
}

