# 🤖 AiQuery — Natural Language → SQL Engine & Studio

> Ask questions in plain English. Get database results instantly. Powered by **Google Gemini AI**, **Spring Boot**, and **React**.

![Java](https://img.shields.io/badge/Java-21-orange?style=flat-square&logo=java)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.2-brightgreen?style=flat-square&logo=springboot)
![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-6-purple?style=flat-square&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=flat-square&logo=tailwindcss)
![Gemini AI](https://img.shields.io/badge/Gemini-3.6--Flash-blue?style=flat-square&logo=google)
![License](https://img.shields.io/badge/license-MIT-lightgrey?style=flat-square)

---

## 💡 What is AiQuery?

**AiQuery** is a full-stack AI-driven database exploration application. Type questions in natural English and watch as it inspects your database schema, constructs safe SQL via Google Gemini AI, validates execution permissions, runs the query, and renders interactive results tables and syntax-highlighted SQL.

```
"Which customer spent the most?"
        ↓  Gemini AI (Grounding with Live Schema)
SELECT customer, SUM(amount) AS total FROM orders GROUP BY customer ORDER BY total DESC LIMIT 1
        ↓  JSQLParser Validation (SELECT only gate)
        ↓  JdbcTemplate Execution
{ "sql": "...", "results": [{ "CUSTOMER": "Alice", "TOTAL": 2349.98 }] }
```

---

## ✨ Features

- 🎨 **State-of-the-Art Dark UI**: Glassmorphism aesthetic with purple/cyan gradients and responsive design.
- ⚡ **Typewriter Input**: Cycling prompts with keyboard shortcuts (`Enter` to submit, `Shift+Enter` for multiline).
- 🔒 **Ironclad Security**: Built-in AST SQL validator (JSQLParser) that strictly permits read-only `SELECT` queries.
- 💻 **SQL Syntax Viewer**: Formatted SQL highlighting with one-click clipboard copy.
- 📊 **Interactive Results Table**: Sticky headers, column formatting, and instant **CSV export**.
- 📜 **Session History**: Fast recall of previous queries, generated queries, and record counts.
- 🗄️ **Zero-Setup Database**: In-memory H2 database pre-seeded with sample e-commerce data.
- 🔌 **Pluggable & Extensible**: Easily swap H2 for MySQL/PostgreSQL, or replace Gemini with any LLM provider.

---

## 📁 Repository Structure

```
AiSql/
├── backend/                  ← Spring Boot 3.3.2 REST API
│   ├── mvnw.cmd              ← Maven wrapper script
│   ├── pom.xml               ← Java dependencies & build config
│   └── src/
│       ├── main/java/com/nlsql/
│       │   ├── controller/   ← QueryController (POST /api/query)
│       │   ├── dto/          ← QueryRequest, QueryResponse
│       │   ├── service/      ← AIService, GeminiAIService, SchemaService, 
│       │   │                   SqlValidatorService, QueryExecutorService
│       │   └── NlSqlApplication.java
│       └── main/resources/
│           ├── application.properties
│           ├── schema.sql    ← Database table DDL
│           └── data.sql      ← Seed dataset
│
└── frontend/                 ← React 19 + Vite + Tailwind CSS Studio
    ├── package.json
    ├── vite.config.js        ← Vite config with API proxy
    ├── index.html
    └── src/
        ├── components/
        │   ├── Header.jsx       ← Logo, model badge, GitHub link
        │   ├── QueryInput.jsx   ← Animated input with typewriter placeholder
        │   ├── SqlViewer.jsx    ← Syntax-highlighted SQL with copy
        │   ├── ResultsTable.jsx ← Responsive data grid with CSV export
        │   └── QueryHistory.jsx ← History sidebar with quick reload
        ├── App.jsx           ← Main application state & layout
        └── index.css         ← Tailwind v4 & custom design tokens
```

---

## ⚡ Quick Start

### Prerequisites
- **Java 21+**
- **Node.js 18+** & npm
- **Google Gemini API Key** ([Get one free from Google AI Studio →](https://aistudio.google.com/apikey))

---

### 1. Clone the repository

```bash
git clone https://github.com/Prafull099/AiSql.git
cd AiSql
```

---

### 2. Start the Backend

Open a terminal and run:

```powershell
# Set your Gemini API key
$env:GEMINI_API_KEY="your-gemini-api-key-here"

# Navigate to backend and run
cd backend
.\mvnw.cmd spring-boot:run
```
*(On Linux/macOS: `export GEMINI_API_KEY="your-key"` and `./mvnw spring-boot:run`)*

Backend starts at: **http://localhost:8080**  
H2 Console available at: **http://localhost:8080/h2-console** (`jdbc:h2:mem:testdb`, user: `sa`, password: *(empty)*)

---

### 3. Start the Frontend

In another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend opens at: **http://localhost:5173**

---

## 🚀 Example Questions to Try

| Question | What it tests |
|---|---|
| `show all orders` | Basic SELECT queries |
| `which customer spent the most?` | Aggregations with `GROUP BY` and `SUM` |
| `how many orders did Alice place?` | Filtering with `WHERE` and `COUNT` |
| `what is the total revenue?` | Simple scalar `SUM(amount)` |
| `show orders above 400 dollars` | Numeric comparisons and conditions |
| `which product sold the most?` | Sorting and descending limits |

---

## 🛡️ Security & Read-Only Safety

1. **JSQLParser AST Inspection**: Every SQL string produced by Gemini is parsed into an abstract syntax tree. If the root statement is not a `Select`, execution is terminated immediately with an error.
2. **Disallowed Operations**: `INSERT`, `UPDATE`, `DELETE`, `DROP`, `ALTER`, `TRUNCATE`, and multi-statement queries are strictly blocked.
3. **Dynamic Schema Grounding**: Database schema metadata is dynamically introspected via JDBC `DatabaseMetaData` and supplied to Gemini's system prompt, preventing hallucinated table or column names.

---

## 🔧 Connecting External Databases (MySQL / PostgreSQL)

By default, an in-memory H2 database is provided for zero-friction setup. To connect to an external database like MySQL, update `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/your_database
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.sql.init.mode=never
```

And ensure your driver dependency is present in `backend/pom.xml`.

---

## 📄 License

This project is licensed under the **[MIT License](LICENSE)**. Feel free to use, modify, and distribute it!
