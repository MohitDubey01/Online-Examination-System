package com.exam.onlineexam.service.impl;

import com.exam.onlineexam.dto.ExamDTO;
import com.exam.onlineexam.model.Exam;
import com.exam.onlineexam.repository.ExamRepository;
import com.exam.onlineexam.service.ExamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ExamServiceImpl implements ExamService {

    @Autowired
    private ExamRepository examRepository;

    @Override
    public List<Exam> findAllExams() {
        return examRepository.findAll();
    }

    @Override
    public List<Exam> findAvailableExams() {
        return examRepository.findAvailableExams(LocalDateTime.now());
    }

    @Override
    public Exam findExamById(Long id) {
        return examRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Exam not found with id: " + id));
    }

    @Override
    public Exam createExam(ExamDTO examDTO) {
        Exam exam = new Exam();
        exam.setTitle(examDTO.getTitle());
        exam.setDescription(examDTO.getDescription());
        exam.setDurationMinutes(examDTO.getDurationMinutes());
        exam.setTotalMarks(examDTO.getTotalMarks());
        exam.setPassingPercentage(examDTO.getPassingPercentage());
        exam.setStartDate(examDTO.getStartDate());
        exam.setEndDate(examDTO.getEndDate());
        exam.setIsActive(examDTO.getIsActive() != null ? examDTO.getIsActive() : true);
        
        return examRepository.save(exam);
    }

    @Override
    public Exam updateExam(Long id, ExamDTO examDTO) {
        Exam exam = findExamById(id);
        
        exam.setTitle(examDTO.getTitle());
        exam.setDescription(examDTO.getDescription());
        exam.setDurationMinutes(examDTO.getDurationMinutes());
        exam.setTotalMarks(examDTO.getTotalMarks());
        exam.setPassingPercentage(examDTO.getPassingPercentage());
        exam.setStartDate(examDTO.getStartDate());
        exam.setEndDate(examDTO.getEndDate());
        exam.setIsActive(examDTO.getIsActive() != null ? examDTO.getIsActive() : exam.getIsActive());
        
        return examRepository.save(exam);
    }

    @Override
    public void deleteExam(Long id) {
        Exam exam = findExamById(id);
        examRepository.delete(exam);
    }
}
