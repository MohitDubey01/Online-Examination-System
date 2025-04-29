package com.exam.onlineexam.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;
import java.util.List;

public class QuestionDTO {
    
    @NotBlank(message = "Question text is required")
    private String questionText;
    
    @NotBlank(message = "Question type is required")
    private String questionType; // MCQ, TRUE_FALSE, SHORT_ANSWER
    
    private List<String> options;
    
    @NotBlank(message = "Correct answer is required")
    private String correctAnswer;
    
    @NotNull(message = "Marks is required")
    @Positive(message = "Marks must be positive")
    private Integer marks;
    
    @NotNull(message = "Exam ID is required")
    @Positive(message = "Exam ID must be positive")
    private Long examId;

    public QuestionDTO() {
    }

    public String getQuestionText() {
        return questionText;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public String getQuestionType() {
        return questionType;
    }

    public void setQuestionType(String questionType) {
        this.questionType = questionType;
    }

    public List<String> getOptions() {
        return options;
    }

    public void setOptions(List<String> options) {
        this.options = options;
    }

    public String getCorrectAnswer() {
        return correctAnswer;
    }

    public void setCorrectAnswer(String correctAnswer) {
        this.correctAnswer = correctAnswer;
    }

    public Integer getMarks() {
        return marks;
    }

    public void setMarks(Integer marks) {
        this.marks = marks;
    }

    public Long getExamId() {
        return examId;
    }

    public void setExamId(Long examId) {
        this.examId = examId;
    }
}
