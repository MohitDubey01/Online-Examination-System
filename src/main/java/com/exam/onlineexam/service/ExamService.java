package com.exam.onlineexam.service;

import com.exam.onlineexam.dto.ExamDTO;
import com.exam.onlineexam.model.Exam;

import java.util.List;

public interface ExamService {
    
    List<Exam> findAllExams();
    
    List<Exam> findAvailableExams();
    
    Exam findExamById(Long id);
    
    Exam createExam(ExamDTO examDTO);
    
    Exam updateExam(Long id, ExamDTO examDTO);
    
    void deleteExam(Long id);
}
