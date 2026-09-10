package com.nlsql.service;

public interface AIService {

    /**
     * Given a text description of the database schema and a natural-language
     * question, returns a single SQL SELECT statement that answers it.
     *
     * <p>Implementations are never trusted blindly — whatever they return still
     * goes through {@link SqlValidatorService} before it is allowed to run.
     */
    String generateSql(String schema, String question);
}
