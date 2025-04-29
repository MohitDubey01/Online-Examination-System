package com.exam.onlineexam.repository;

import com.exam.onlineexam.model.Exam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ExamRepository extends JpaRepository<Exam, Long> {
    
    @Query("SELECT e FROM Exam e WHERE e.isActive = true AND " +
            "(e.startDate IS NULL OR e.startDate <= ?1) AND " +
            "(e.endDate IS NULL OR e.endDate >= ?1)")
    List<Exam> findAvailableExams(LocalDateTime now);
    
    List<Exam> findByIsActiveTrue();
}
