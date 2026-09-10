package com.nlsql;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

/**
 * Smoke test — verifies the Spring application context loads successfully.
 *
 * <p>Uses an in-memory H2 database and a stubbed Gemini key so the test
 * runs without any external dependencies.
 */
@SpringBootTest
@TestPropertySource(properties = {
        "gemini.api.key=test-key",
        "spring.datasource.url=jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1;MODE=MySQL"
})
class NlSqlApplicationTests {

    @Test
    void contextLoads() {
        // If the application context starts without exception, we pass.
    }
}
