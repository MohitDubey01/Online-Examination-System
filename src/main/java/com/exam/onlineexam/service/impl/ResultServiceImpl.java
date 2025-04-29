package com.exam.onlineexam.service.impl;

import com.exam.onlineexam.dto.ResultDTO;
import com.exam.onlineexam.dto.SubmissionDTO;
import com.exam.onlineexam.model.Exam;
import com.exam.onlineexam.model.Question;
import com.exam.onlineexam.model.Result;
import com.exam.onlineexam.model.User;
import com.exam.onlineexam.repository.ExamRepository;
import com.exam.onlineexam.repository.QuestionRepository;
import com.exam.onlineexam.repository.ResultRepository;
import com.exam.onlineexam.repository.UserRepository;
import com.exam.onlineexam.service.ResultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ResultServiceImpl implements ResultService {

    @Autowired
    private ResultRepository resultRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Override
    public List<Result> findAllResults() {
        return resultRepository.findAll();
    }

    @Override
    public List<Result> findResultsByUserId(Long userId) {
        return resultRepository.findByUserId(userId);
    }

    @Override
    public List<Result> findResultsByExamId(Long examId) {
        return resultRepository.findByExamId(examId);
    }

    @Override
    public List<Result> findResultsByExamIdAndUserId(Long examId, Long userId) {
        return resultRepository.findByExamIdAndUserId(examId, userId);
    }

    @Override
    public Result findResultById(Long id) {
        return resultRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Result not found with id: " + id));
    }

    @Override
    public ResultDTO evaluateAndSaveResult(SubmissionDTO submissionDTO, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userId));
        
        Exam exam = examRepository.findById(submissionDTO.getExamId())
                .orElseThrow(() -> new EntityNotFoundException("Exam not found with id: " + submissionDTO.getExamId()));
        
        List<Question> questions = questionRepository.findByExamId(exam.getId());
        Map<Long, Question> questionMap = questions.stream()
                .collect(Collectors.toMap(Question::getId, question -> question));
        
        int totalMarks = questions.stream().mapToInt(Question::getMarks).sum();
        int obtainedMarks = 0;
        
        for (Map.Entry<Long, String> entry : submissionDTO.getAnswers().entrySet()) {
            Long questionId = entry.getKey();
            String submittedAnswer = entry.getValue();
            
            Question question = questionMap.get(questionId);
            if (question != null && question.getCorrectAnswer().equalsIgnoreCase(submittedAnswer)) {
                obtainedMarks += question.getMarks();
            }
        }
        
        double percentage = totalMarks > 0 ? (double) obtainedMarks / totalMarks * 100 : 0;
        boolean passed = percentage >= exam.getPassingPercentage();
        
        Result result = new Result();
        result.setUser(user);
        result.setExam(exam);
        result.setTotalMarks(totalMarks);
        result.setObtainedMarks(obtainedMarks);
        result.setPercentage(percentage);
        result.setPassed(passed);
        result.setTimeTakenInSeconds(submissionDTO.getTimeTakenInSeconds());
        
        result = resultRepository.save(result);
        
        ResultDTO resultDTO = new ResultDTO();
        resultDTO.setId(result.getId());
        resultDTO.setUserId(user.getId());
        resultDTO.setUserName(user.getName());
        resultDTO.setExamId(exam.getId());
        resultDTO.setExamTitle(exam.getTitle());
        resultDTO.setTotalMarks(totalMarks);
        resultDTO.setObtainedMarks(obtainedMarks);
        resultDTO.setPercentage(percentage);
        resultDTO.setPassed(passed);
        resultDTO.setSubmittedAt(result.getSubmittedAt());
        
        return resultDTO;
    }
}
