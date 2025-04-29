package com.exam.onlineexam.service;

import com.exam.onlineexam.dto.QuestionDTO;
import com.exam.onlineexam.model.Question;

import java.util.List;

public interface QuestionService {
    
    List<Question> findAllQuestions();
    
    List<Question> findQuestionsByExamId(Long examId);
    
    Question findQuestionById(Long id);
    
    Question createQuestion(QuestionDTO questionDTO);
    
    Question updateQuestion(Long id, QuestionDTO questionDTO);
    
    void deleteQuestion(Long id);
}
