package com.nlsql.service;

import org.springframework.jdbc.core.ConnectionCallback;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.sql.DatabaseMetaData;
import java.sql.ResultSet;

/**
 * Introspects the live database and produces a compact, human-readable
 * schema description that is injected into the Gemini prompt.
 *
 * <p>Example output line: {@code orders.id (INTEGER)}
 */
@Service
public class SchemaService {

    private final JdbcTemplate jdbcTemplate;

    public SchemaService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Builds a compact text description of every table and column in the
     * connected database. This grounds the AI so it cannot invent tables
     * or columns that do not exist.
     */
    public String describeSchema() {
        return jdbcTemplate.execute((ConnectionCallback<String>) connection -> {
            StringBuilder schema = new StringBuilder();
            DatabaseMetaData meta = connection.getMetaData();

            try (ResultSet tables = meta.getTables(null, null, "%", new String[]{"TABLE"})) {
                while (tables.next()) {
                    String tableName = tables.getString("TABLE_NAME");
                    try (ResultSet columns = meta.getColumns(null, null, tableName, "%")) {
                        while (columns.next()) {
                            schema.append(tableName)
                                    .append('.')
                                    .append(columns.getString("COLUMN_NAME"))
                                    .append(" (")
                                    .append(columns.getString("TYPE_NAME"))
                                    .append(")\n");
                        }
                    }
                }
            }
            return schema.toString();
        });
    }
}
