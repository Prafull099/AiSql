package com.nlsql;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Entry point for the NL→SQL application.
 *
 * <p>Run with: {@code mvn spring-boot:run}
 * <p>Or package and run: {@code mvn package && java -jar target/ai-query-*.jar}
 */
@SpringBootApplication
public class NlSqlApplication {

    public static void main(String[] args) {
        SpringApplication.run(NlSqlApplication.class, args);
    }
}
