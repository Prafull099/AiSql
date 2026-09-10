# 🤖 AI Query — Natural Language → SQL Engine

> Ask questions in plain English. Get database results instantly. Powered by **Google Gemini AI** + **Spring Boot**.

![Java](https://img.shields.io/badge/Java-21-orange?style=flat-square&logo=java)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.2-brightgreen?style=flat-square&logo=springboot)
![Gemini AI](https://img.shields.io/badge/Gemini-AI-blue?style=flat-square&logo=google)
![License](https://img.shields.io/badge/license-MIT-lightgrey?style=flat-square)

---

## 💡 What is this?

**AI Query** is a Spring Boot REST API that converts natural-language questions into SQL and runs them against a real database — all in one request.

```
"Which customer spent the most?"
        ↓  Gemini AI
SELECT customer, SUM(amount) FROM orders GROUP BY customer ORDER BY SUM(amount) DESC LIMIT 1
        ↓  JdbcTemplate
{ "sql": "...", "results": [{ "CUSTOMER": "Alice", "SUM(AMOUNT)": 2349.98 }] }
```

No UI. No ORM. No bloat. Just a clean REST API you can plug into anything.

---

## ⚡ Quick Start (Zero Setup Required)

**Prerequisites:** Java 21+ and a Gemini API key ([get one free →](https://aistudio.google.com/apikey))

```bash
# 1. Clone
git clone https://github.com/Prafull099/AiSql.git
cd AiSql

# 2. Set your Gemini API key
export GEMINI_API_KEY=AIza...   # Mac/Linux
$env:GEMINI_API_KEY="AIza..."   # Windows PowerShell

# 3. Run (H2 in-memory DB included — no database needed!)
mvn spring-boot:run
```

That's it. The app starts on **http://localhost:8080** with a sample `orders` table already loaded.

---

## 🚀 Usage

### Ask a question

```bash
curl -X POST http://localhost:8080/api/query \
  -H "Content-Type: application/json" \
  -d '{"question": "which customer spent the most?"}'
```

### Response

```json
{
  "sql": "SELECT customer, SUM(amount) AS total FROM orders GROUP BY customer ORDER BY total DESC LIMIT 1",
  "results": [
    { "CUSTOMER": "Alice", "TOTAL": 2349.98 }
  ]
}
```

### More example questions

| Question | Generated SQL |
|---|---|
| `show all orders` | `SELECT * FROM orders` |
| `how many orders did Alice place?` | `SELECT COUNT(*) FROM orders WHERE customer = 'Alice'` |
| `what is the total revenue?` | `SELECT SUM(amount) FROM orders` |
| `show orders above 400 dollars` | `SELECT * FROM orders WHERE amount > 400` |
| `which product sold the most?` | `SELECT product, COUNT(*) FROM orders GROUP BY product ORDER BY COUNT(*) DESC` |

---

## 🏗️ Architecture

```
POST /api/query  {"question": "..."}
        │
        ▼
┌─────────────────┐
│ QueryController │  ← REST layer
└────────┬────────┘
         │
         ├──▶ SchemaService       ← introspects live DB schema via JDBC metadata
         │
         ├──▶ GeminiAIService     ← sends schema + question to Gemini API
         │         └── generates SQL
         │
         ├──▶ SqlValidatorService ← parses SQL with JSQLParser
         │         └── rejects anything that isn't a SELECT (hard security gate)
         │
         └──▶ QueryExecutorService ← runs the validated SQL via JdbcTemplate
                   └── returns List<Map<String, Object>>
```

### Key design decisions

- **Schema grounding** — The DB schema is extracted at runtime and injected into the AI prompt. The AI can only reference tables/columns that actually exist.
- **SQL validation** — Every AI-generated query is structurally parsed before execution. `INSERT`, `UPDATE`, `DELETE`, `DROP` are impossible — not just by prompt instruction, but by code.
- **DB-agnostic** — Swap H2 for MySQL, PostgreSQL, or any JDBC-compatible DB with one config change.
- **Pluggable AI** — `AIService` is an interface. Replace Gemini with OpenAI or any other LLM with zero changes to the rest of the codebase.

---

## 🔧 Configuration

All config lives in `src/main/resources/application.properties`.

### Switch to a real database (MySQL example)

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/your_db
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.username=your_user
spring.datasource.password=your_password
spring.sql.init.mode=never
```

Add the MySQL driver to `pom.xml`:
```xml
<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <scope>runtime</scope>
</dependency>
```

### Change the AI model

```properties
gemini.model=gemini-3.6-flash   # or any available Gemini model
```

---

## 📁 Project Structure

```
src/main/java/com/nlsql/
├── NlSqlApplication.java          ← @SpringBootApplication entry point
├── controller/
│   └── QueryController.java       ← POST /api/query
├── service/
│   ├── AIService.java             ← interface (swap AI providers here)
│   ├── GeminiAIService.java       ← Gemini REST implementation
│   ├── SchemaService.java         ← live DB schema introspection
│   ├── SqlValidatorService.java   ← JSQLParser security gate
│   └── QueryExecutorService.java  ← JdbcTemplate query runner
└── dto/
    ├── QueryRequest.java
    └── QueryResponse.java

src/main/resources/
├── application.properties         ← all config here
├── schema.sql                     ← sample table DDL (H2 dev mode)
└── data.sql                       ← sample seed data  (H2 dev mode)
```

---

## 🛡️ Security

- **Read-only by design** — JSQLParser rejects any non-SELECT statement before it reaches the database.
- **Schema-grounded prompts** — The AI only sees real table/column names. It cannot hallucinate tables.
- **No raw user SQL** — Users never write SQL directly. All SQL is AI-generated then validated.

---

## 🤝 Contributing

PRs welcome! Some ideas:
- [ ] Add support for multiple databases simultaneously
- [ ] Stream results for large result sets
- [ ] Add query history / caching
- [ ] Support OpenAI / Anthropic as alternative AI backends
- [ ] Add a simple web UI

---

## 📄 License

MIT — do whatever you want with it.
