package com.nlsql.service;

import net.sf.jsqlparser.JSQLParserException;
import net.sf.jsqlparser.parser.CCJSqlParserUtil;
import net.sf.jsqlparser.statement.Statement;
import net.sf.jsqlparser.statement.select.Select;
import org.springframework.stereotype.Service;

/**
 * Validates that a SQL string is a single, structurally-sound SELECT statement.
 *
 * <p>This is a hard security gate — it does <em>not</em> trust that the AI
 * followed its prompt instructions. Every generated query is re-checked
 * structurally before it is allowed to reach the database.
 */
@Service
public class SqlValidatorService {

    /**
     * Parses {@code sql} and throws {@link IllegalArgumentException} if it is
     * anything other than a single, well-formed SELECT statement.
     *
     * @param sql the SQL string to validate
     * @throws IllegalArgumentException if the SQL cannot be parsed or is not a SELECT
     */
    public void validateReadOnlySelect(String sql) {
        Statement statement;
        try {
            statement = CCJSqlParserUtil.parse(sql);
        } catch (JSQLParserException e) {
            throw new IllegalArgumentException("Not valid SQL: " + sql, e);
        }

        if (!(statement instanceof Select)) {
            throw new IllegalArgumentException("Only SELECT statements are allowed: " + sql);
        }
    }
}
