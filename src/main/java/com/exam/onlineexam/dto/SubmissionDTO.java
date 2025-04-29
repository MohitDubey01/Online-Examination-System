package com.exam.onlineexam.dto;

import javax.validation.constraints.NotNull;
import java.util.Map;

public class SubmissionDTO {
    
    @NotNull(message = "Exam ID is required")
    private Long examId;
    
    @NotNull(message = "Answers are required")
    private Map<Long, String> answers; // QuestionId -> Answer
    
    private Integer timeTakenInSeconds;

    public SubmissionDTO() {
    }

    public Long getExamId() {
        return examId;
    }

    public void setExamId(Long examId) {
        this.examId = examId;
    }

    public Map<Long, String> getAnswers() {
        return answers;
    }

    public void setAnswers(Map<Long, String> answers) {
        this.answers = answers;
    }

    public Integer getTimeTakenInSeconds() {
        return timeTakenInSeconds;
    }

    public void setTimeTakenInSeconds(Integer timeTakenInSeconds) {
        this.timeTakenInSeconds = timeTakenInSeconds;
    }
}
