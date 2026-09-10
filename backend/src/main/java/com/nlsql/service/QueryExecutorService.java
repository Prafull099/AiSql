package com.nlsql.service;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * Runs a pre-validated SQL SELECT against the configured DataSource and
 * returns the results as a list of column-name → value maps.
 *
 * <p>This class intentionally has no SQL-generation or validation logic —
 * callers must pass a query that has already been verified by
 * {@link SqlValidatorService}.
 */
@Service
public class QueryExecutorService {

    private final JdbcTemplate jdbcTemplate;

    public QueryExecutorService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * @param validatedSql a SELECT statement that has already been approved by
     *                     {@link SqlValidatorService#validateReadOnlySelect(String)}
     * @return result rows as a list of column → value maps
     */
    public List<Map<String, Object>> execute(String validatedSql) {
        return jdbcTemplate.queryForList(validatedSql);
    }
}
