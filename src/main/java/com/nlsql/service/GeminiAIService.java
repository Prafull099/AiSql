package com.nlsql.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

/**
 * Calls the Google Gemini REST API to convert a natural-language question
 * into a SQL SELECT statement, given the database schema as context.
 */
@Service
public class GeminiAIService implements AIService {

    private final RestClient restClient;

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.model:gemini-3.6-flash}")
    private String model;

    public GeminiAIService(RestClient.Builder builder) {
        this.restClient = builder
                .baseUrl("https://generativelanguage.googleapis.com/v1beta")
                .build();
    }

    @Override
    public String generateSql(String schema, String question) {
        String prompt = """
                You are a read-only SQL generator.

                Database schema:
                %s

                Write exactly one SQL SELECT statement that answers this question: "%s"

                Rules:
                - Output SQL only. No explanation, no markdown, no code fences.
                - Never use INSERT, UPDATE, DELETE, DROP, ALTER, or more than one statement.
                - Only reference tables and columns that appear in the schema above.
                """.formatted(schema, question);

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(Map.of("text", prompt)))
                )
        );

        Map<?, ?> response = restClient.post()
                .uri("/models/{model}:generateContent?key={key}", model, apiKey)
                .body(requestBody)
                .retrieve()
                .body(Map.class);

        String raw = extractText(response).trim();
        return stripCodeFences(raw);
    }

    @SuppressWarnings("unchecked")
    private String extractText(Map<?, ?> response) {
        List<?> candidates = (List<?>) response.get("candidates");
        Map<?, ?> firstCandidate = (Map<?, ?>) candidates.get(0);
        Map<?, ?> content = (Map<?, ?>) firstCandidate.get("content");
        List<?> parts = (List<?>) content.get("parts");
        Map<?, ?> firstPart = (Map<?, ?>) parts.get(0);
        return (String) firstPart.get("text");
    }

    private String stripCodeFences(String text) {
        return text.replaceAll("(?s)```sql|```", "").trim();
    }
}
