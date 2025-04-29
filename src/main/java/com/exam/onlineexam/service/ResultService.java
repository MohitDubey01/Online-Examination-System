package com.exam.onlineexam.service;

import com.exam.onlineexam.dto.ResultDTO;
import com.exam.onlineexam.dto.SubmissionDTO;
import com.exam.onlineexam.model.Result;

import java.util.List;

public interface ResultService {
    
    List<Result> findAllResults();
    
    List<Result> findResultsByUserId(Long userId);
    
    List<Result> findResultsByExamId(Long examId);
    
    List<Result> findResultsByExamIdAndUserId(Long examId, Long userId);
    
    Result findResultById(Long id);
    
    ResultDTO evaluateAndSaveResult(SubmissionDTO submissionDTO, Long userId);
}
