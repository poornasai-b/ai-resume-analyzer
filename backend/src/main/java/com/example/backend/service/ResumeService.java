package com.example.backend.service;

import com.example.backend.model.Analysis;
import com.example.backend.model.User;
import com.example.backend.repository.AnalysisRepository;
import com.example.backend.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ResumeService {

    private final AnalysisRepository analysisRepository;
    private final UserRepository userRepository;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${ai.service.url}")
    private String aiServiceUrl;

    public Analysis analyze(MultipartFile file, String targetRole, String email) throws Exception {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Call Python AI service
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", new ByteArrayResource(file.getBytes()) {
            @Override
            public String getFilename() {
                return file.getOriginalFilename();
            }
        });
        body.add("target_role", targetRole);

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(
                aiServiceUrl + "/analyze",
                requestEntity,
                Map.class
        );

        Map<String, Object> responseBody = response.getBody();

        if (responseBody == null || responseBody.containsKey("error")) {
            throw new RuntimeException("AI service error: " + (responseBody != null ? responseBody.get("error") : "null"));
        }

        Map<String, Object> data = (Map<String, Object>) responseBody.get("data");

        // Save to database
        Analysis analysis = new Analysis();
        analysis.setUser(user);
        analysis.setFileName(file.getOriginalFilename());
        analysis.setTargetRole(targetRole);
        analysis.setAtsScore((Integer) data.get("ats_score"));
        analysis.setResult(objectMapper.writeValueAsString(data));

        return analysisRepository.save(analysis);
    }

    public List<Analysis> getHistory(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return analysisRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public Analysis getAnalysis(Long id, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Analysis analysis = analysisRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Analysis not found"));
        if (!analysis.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }
        return analysis;
    }
}