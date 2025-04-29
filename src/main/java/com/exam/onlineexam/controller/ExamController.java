package com.exam.onlineexam.controller;

import com.exam.onlineexam.dto.ExamDTO;
import com.exam.onlineexam.model.Exam;
import com.exam.onlineexam.model.User;
import com.exam.onlineexam.service.ExamService;
import com.exam.onlineexam.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/exams")
public class ExamController {

    @Autowired
    private ExamService examService;

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<Exam>> getAllExams(Authentication authentication) {
        User user = userService.findByUsername(authentication.getName());
        if (user.getRole().equals("ADMIN")) {
            return ResponseEntity.ok(examService.findAllExams());
        } else {
            return ResponseEntity.ok(examService.findAvailableExams());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Exam> getExamById(@PathVariable Long id) {
        return ResponseEntity.ok(examService.findExamById(id));
    }

    @PostMapping
    public ResponseEntity<Exam> createExam(@Valid @RequestBody ExamDTO examDTO, Authentication authentication) {
        User user = userService.findByUsername(authentication.getName());
        if (!user.getRole().equals("ADMIN")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        Exam exam = examService.createExam(examDTO);
        return new ResponseEntity<>(exam, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Exam> updateExam(@PathVariable Long id, @Valid @RequestBody ExamDTO examDTO, Authentication authentication) {
        User user = userService.findByUsername(authentication.getName());
        if (!user.getRole().equals("ADMIN")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        Exam updatedExam = examService.updateExam(id, examDTO);
        return ResponseEntity.ok(updatedExam);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExam(@PathVariable Long id, Authentication authentication) {
        User user = userService.findByUsername(authentication.getName());
        if (!user.getRole().equals("ADMIN")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        examService.deleteExam(id);
        return ResponseEntity.noContent().build();
    }
}
