package com.exam.onlineexam.service.impl;

import com.exam.onlineexam.dto.QuestionDTO;
import com.exam.onlineexam.model.Exam;
import com.exam.onlineexam.model.Question;
import com.exam.onlineexam.repository.ExamRepository;
import com.exam.onlineexam.repository.QuestionRepository;
import com.exam.onlineexam.service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import java.util.List;

@Service
public class QuestionServiceImpl implements QuestionService {

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private ExamRepository examRepository;

    @Override
    public List<Question> findAllQuestions() {
        return questionRepository.findAll();
    }

    @Override
    public List<Question> findQuestionsByExamId(Long examId) {
        return questionRepository.findByExamId(examId);
    }

    @Override
    public Question findQuestionById(Long id) {
        return questionRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Question not found with id: " + id));
    }

    @Override
    public Question createQuestion(QuestionDTO questionDTO) {
        Exam exam = examRepository.findById(questionDTO.getExamId())
                .orElseThrow(() -> new EntityNotFoundException("Exam not found with id: " + questionDTO.getExamId()));
        
        Question question = new Question();
        question.setQuestionText(questionDTO.getQuestionText());
        question.setQuestionType(questionDTO.getQuestionType());
        question.setOptions(questionDTO.getOptions());
        question.setCorrectAnswer(questionDTO.getCorrectAnswer());
        question.setMarks(questionDTO.getMarks());
        question.setExam(exam);
        
        return questionRepository.save(question);
    }

    @Override
    public Question updateQuestion(Long id, QuestionDTO questionDTO) {
        Question question = findQuestionById(id);
        
        if (!question.getExam().getId().equals(questionDTO.getExamId())) {
            Exam exam = examRepository.findById(questionDTO.getExamId())
                    .orElseThrow(() -> new EntityNotFoundException("Exam not found with id: " + questionDTO.getExamId()));
            question.setExam(exam);
        }
        
        question.setQuestionText(questionDTO.getQuestionText());
        question.setQuestionType(questionDTO.getQuestionType());
        question.setOptions(questionDTO.getOptions());
        question.setCorrectAnswer(questionDTO.getCorrectAnswer());
        question.setMarks(questionDTO.getMarks());
        
        return questionRepository.save(question);
    }

    @Override
    public void deleteQuestion(Long id) {
        Question question = findQuestionById(id);
        questionRepository.delete(question);
    }
}
