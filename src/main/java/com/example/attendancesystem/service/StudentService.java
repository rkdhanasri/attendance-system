package com.example.attendancesystem.service; 

import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.attendancesystem.entity.Student;
import com.example.attendancesystem.repository.StudentRepository;

@Service
@Transactional
public class StudentService {
    
    @Autowired
    private StudentRepository studentRepository;

public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public org.springframework.data.domain.Page<Student> getAllStudents(org.springframework.data.domain.Pageable pageable) {
        return studentRepository.findAll(pageable);
    }

    public Optional<Student> getStudentById(Long id) {
        return studentRepository.findById(id);
    }

    public Student saveStudent(Student student) {
        return studentRepository.save(student);
    }

    public void deleteStudent(Long id) {
        studentRepository.deleteById(id);
    }

    public List<Student> getStudentsByTeacher(Long teacherId) {
        return studentRepository.findByTeacherId(teacherId);
    }

    public Optional<Student> findByUserId(Long userId) {
        return studentRepository.findByUserId(userId);
    }

    public void unlinkStudentsFromTeacher(Long teacherId) {
        List<Student> students = studentRepository.findByTeacherId(teacherId);
        for (Student student : students) {
            student.setTeacher(null);
            studentRepository.save(student);
        }
    }
}
