package com.exam.onlineexam.controller;

import com.exam.onlineexam.dto.ResultDTO;
import com.exam.onlineexam.dto.SubmissionDTO;
import com.exam.onlineexam.model.Result;
import com.exam.onlineexam.model.User;
import com.exam.onlineexam.service.ResultService;
import com.exam.onlineexam.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/results")
public class ResultController {

    @Autowired
    private ResultService resultService;

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<Result>> getAllResults(Authentication authentication) {
        User user = userService.findByUsername(authentication.getName());
        if (user.getRole().equals("ADMIN")) {
            return ResponseEntity.ok(resultService.findAllResults());
        } else {
            return ResponseEntity.ok(resultService.findResultsByUserId(user.getId()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Result> getResultById(@PathVariable Long id, Authentication authentication) {
        User user = userService.findByUsername(authentication.getName());
        Result result = resultService.findResultById(id);
        
        if (user.getRole().equals("ADMIN") || result.getUser().getId().equals(user.getId())) {
            return ResponseEntity.ok(result);
        }
        
        return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }

    @GetMapping("/exam/{examId}")
    public ResponseEntity<List<Result>> getResultsByExamId(@PathVariable Long examId, Authentication authentication) {
        User user = userService.findByUsername(authentication.getName());
        if (user.getRole().equals("ADMIN")) {
            return ResponseEntity.ok(resultService.findResultsByExamId(examId));
        } else {
            return ResponseEntity.ok(resultService.findResultsByExamIdAndUserId(examId, user.getId()));
        }
    }

    @PostMapping("/submit")
    public ResponseEntity<ResultDTO> submitExam(@Valid @RequestBody SubmissionDTO submissionDTO, Authentication authentication) {
        User user = userService.findByUsername(authentication.getName());
        ResultDTO resultDTO = resultService.evaluateAndSaveResult(submissionDTO, user.getId());
        return ResponseEntity.ok(resultDTO);
    }
}
