package com.nlsql.controller;

import com.nlsql.dto.QueryRequest;
import com.nlsql.dto.QueryResponse;
import com.nlsql.service.AIService;
import com.nlsql.service.QueryExecutorService;
import com.nlsql.service.SchemaService;
import com.nlsql.service.SqlValidatorService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

/**
 * REST entry point for natural-language SQL queries.
 *
 * <p>POST /api/query
 * <pre>
 * Request : { "question": "How many orders were placed last month?" }
 * Response: { "sql": "SELECT ...", "results": [ {...}, ... ] }
 * </pre>
 */
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class QueryController {

    private final SchemaService schemaService;
    private final AIService aiService;
    private final SqlValidatorService sqlValidatorService;
    private final QueryExecutorService queryExecutorService;

    public QueryController(SchemaService schemaService,
                           AIService aiService,
                           SqlValidatorService sqlValidatorService,
                           QueryExecutorService queryExecutorService) {
        this.schemaService = schemaService;
        this.aiService = aiService;
        this.sqlValidatorService = sqlValidatorService;
        this.queryExecutorService = queryExecutorService;
    }

    /**
     * Converts a natural-language question into SQL, validates it, runs it,
     * and returns both the generated SQL and the query results.
     */
    @PostMapping("/query")
    public QueryResponse runQuery(@Valid @RequestBody QueryRequest request) {
        String schema = schemaService.describeSchema();
        String sql    = aiService.generateSql(schema, request.getQuestion());

        sqlValidatorService.validateReadOnlySelect(sql);

        List<Map<String, Object>> results = queryExecutorService.execute(sql);
        return new QueryResponse(sql, results);
    }

    // ── Error handlers ────────────────────────────────────────────────────────

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleInvalidSql(IllegalArgumentException e) {
        return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
    }
}
