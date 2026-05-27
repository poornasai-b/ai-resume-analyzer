package com.example.backend.controller;

import com.example.backend.model.Analysis;
import com.example.backend.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/resume")
@RequiredArgsConstructor
public class ResumeController {

    private final ResumeService resumeService;

    @PostMapping("/analyze")
    public ResponseEntity<Analysis> analyze(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "targetRole", defaultValue = "Software Engineer") String targetRole,
            Authentication authentication) throws Exception {

        String email = (String) authentication.getPrincipal();
        Analysis analysis = resumeService.analyze(file, targetRole, email);
        return ResponseEntity.ok(analysis);
    }

    @GetMapping("/history")
    public ResponseEntity<List<Analysis>> getHistory(Authentication authentication) {
        String email = (String) authentication.getPrincipal();
        return ResponseEntity.ok(resumeService.getHistory(email));
    }

    @GetMapping("/history/{id}")
    public ResponseEntity<Analysis> getAnalysis(
            @PathVariable Long id,
            Authentication authentication) {
        String email = (String) authentication.getPrincipal();
        return ResponseEntity.ok(resumeService.getAnalysis(id, email));
    }
}