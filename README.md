# Oracle SQL Terminal Simulator

A professional, browser-based Oracle SQL terminal simulator with full SQL dialect support, persistent storage, and an interactive tutorial system.

## 🚀 Features

### Core Functionality
- **Complete Oracle SQL Dialect**: Full support for SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, ALTER, TRUNCATE, and more
- **Persistent Storage**: All data persists in browser using IndexedDB
- **Interactive Terminal**: Professional terminal interface with command history and autocomplete
- **Real-time Suggestions**: Context-aware SQL keyword, table, and column suggestions
- **System Tables**: Oracle-compatible ALL_TABLES, ALL_TAB_COLS, and USER_SEQUENCES views

### SQL Features
- **DDL Operations**: CREATE/DROP/ALTER TABLE, CREATE/DROP SEQUENCE
- **DML Operations**: INSERT, UPDATE, DELETE with full WHERE clause support
- **Query Features**:
  - Joins (INNER, LEFT, RIGHT, FULL, CROSS)
  - Aggregate functions (COUNT, SUM, AVG, MIN, MAX)
  - GROUP BY and HAVING clauses
  - ORDER BY with ASC/DESC
  - DISTINCT, LIMIT/FETCH FIRST
  - Subqueries and complex conditions

### Oracle Functions (40+)
- **String**: UPPER, LOWER, INITCAP, LENGTH, SUBSTR, INSTR, TRIM, CONCAT, REPLACE, LPAD, RPAD
- **Numeric**: ROUND, TRUNC, FLOOR, CEIL, ABS, MOD, POWER, SQRT, SIGN
- **Date**: SYSDATE, SYSTIMESTAMP, ADD_MONTHS, MONTHS_BETWEEN, LAST_DAY
- **Conversion**: TO_CHAR, TO_DATE, TO_NUMBER
- **Null Handling**: NVL, NVL2, COALESCE, NULLIF
- **Conditional**: DECODE, CASE WHEN
- **Other**: GREATEST, LEAST

### Database Schema
Pre-loaded e-commerce database with realistic data:

| Table | Records | Description |
|-------|---------|-------------|
| CUSTOMERS | 15 | Customer profiles with loyalty points |
| PRODUCTS | 25 | Products with pricing, stock, ratings |
| CATEGORIES | 12 | Hierarchical product categories |
| ORDERS | 15 | Orders with multiple statuses |
| ORDER_ITEMS | 28 | Order line items with discounts |
| SUPPLIERS | 5 | Supplier information and ratings |
| PRODUCT_REVIEWS | 10 | Customer reviews with ratings |
| INVENTORY_TRANSACTIONS | 10 | Stock movement history |

### Tutorial System
10 comprehensive lessons covering:
1. Introduction to SQL
2. SELECT Statement Basics
3. WHERE Clause - Filtering Data
4. ORDER BY - Sorting Results
5. Aggregate Functions
6. Joining Tables
7. Oracle Functions
8. Data Manipulation - INSERT
9. Data Manipulation - UPDATE & DELETE
10. Creating Tables and Sequences

## 📦 Installation

Simply open `index.html` in a modern web browser. No server or installation required!

```bash
# Clone the repository
git clone https://github.com/mkokutoyori/sql_simulator.git

# Open index.html in your browser
cd sql_simulator
open index.html  # macOS
start index.html # Windows
xdg-open index.html # Linux
```

## 🎮 Usage

### Getting Started

1. **Open the Application**: Launch `index.html` in your browser
2. **Type SQL Commands**: Enter SQL queries in the terminal input
3. **Press Enter**: Execute the query
4. **View Results**: See formatted results in the terminal

### Terminal Commands

```sql
-- View all tables
SELECT * FROM ALL_TABLES;

-- Describe table structure
DESC CUSTOMERS;

-- Query data
SELECT * FROM CUSTOMERS WHERE CITY = 'New York';

-- Join tables
SELECT c.FIRST_NAME, c.LAST_NAME, o.ORDER_ID, o.TOTAL_AMOUNT
FROM CUSTOMERS c
INNER JOIN ORDERS o ON c.CUSTOMER_ID = o.CUSTOMER_ID;

-- Aggregate functions
SELECT CITY, COUNT(*) AS CUSTOMER_COUNT
FROM CUSTOMERS
GROUP BY CITY
ORDER BY CUSTOMER_COUNT DESC;

-- Insert data
INSERT INTO CUSTOMERS (CUSTOMER_ID, FIRST_NAME, LAST_NAME, EMAIL, REGISTRATION_DATE)
VALUES (CUSTOMER_SEQ.NEXTVAL, 'John', 'Doe', 'john@example.com', SYSDATE);

-- Update data
UPDATE PRODUCTS
SET PRICE = PRICE * 1.1
WHERE CATEGORY_ID = 1;

-- Delete data
DELETE FROM CUSTOMERS WHERE STATUS = 'INACTIVE';
```

### Special Commands

- `HELP` - Display help information
- `TUTORIAL` - Open the interactive tutorial
- `CLEAR` or `CLS` - Clear the terminal screen
- `DESC table_name` - Describe table structure

### Keyboard Shortcuts

- **Enter** - Execute command
- **Shift+Enter** - New line in multi-line query
- **↑/↓ Arrows** - Navigate command history
- **Tab** - Accept autocomplete suggestion
- **Escape** - Close suggestions

### Buttons

- **📚 Tutorial** - Open the interactive SQL tutorial
- **🗑️ Clear** - Clear the terminal output
- **🔄 Reset DB** - Reset database to initial state

## 🏗️ Architecture

### File Structure

```
sql_simulator/
├── index.html          # HTML structure
├── styles.css          # Terminal styling
├── database.js         # Database manager with IndexedDB
├── sql-parser.js       # SQL tokenizer and parser
├── sql-engine.js       # Query execution engine
├── data-seed.js        # E-commerce data seeding
├── tutorial.js         # Interactive tutorial system
└── terminal.js         # Terminal UI controller
```

### Component Overview

#### database.js
- Manages in-memory database structure
- Handles IndexedDB persistence
- Maintains system tables (ALL_TABLES, ALL_TAB_COLS, USER_SEQUENCES)
- Validates data types and constraints
- Manages sequences for auto-increment

#### sql-parser.js
- Tokenizes SQL statements
- Parses Oracle SQL dialect
- Generates Abstract Syntax Tree (AST)
- Handles complex expressions and subqueries
- Provides detailed error messages with ORA-xxxxx codes

#### sql-engine.js
- Executes parsed SQL queries
- Implements 40+ Oracle functions
- Handles joins, aggregations, and sorting
- Evaluates complex WHERE conditions
- Manages transactions (COMMIT, ROLLBACK)

#### data-seed.js
- Creates initial database schema
- Seeds realistic e-commerce data
- Creates sequences for primary keys
- Establishes table relationships

#### tutorial.js
- Manages 10 interactive lessons
- Provides progressive SQL learning
- Includes examples and exercises
- Covers basics to advanced topics

#### terminal.js
- Handles user input and output
- Manages command history
- Provides autocomplete suggestions
- Coordinates all components
- Updates UI status and metrics

## 🎓 Tutorial Topics

1. **Introduction to SQL** - Overview of SQL and database concepts
2. **SELECT Basics** - Basic queries, columns, DISTINCT
3. **WHERE Clause** - Filtering with conditions and operators
4. **ORDER BY** - Sorting results, FETCH FIRST
5. **Aggregate Functions** - COUNT, SUM, AVG, GROUP BY, HAVING
6. **Joins** - INNER, LEFT, RIGHT, FULL, CROSS joins
7. **Oracle Functions** - String, numeric, date, null handling
8. **INSERT** - Adding new data, using sequences
9. **UPDATE & DELETE** - Modifying and removing data
10. **DDL** - CREATE TABLE, CREATE SEQUENCE, system tables

## 🔧 Technical Details

### Browser Compatibility
- Chrome/Edge 80+
- Firefox 75+
- Safari 13.1+
- Opera 67+

### Storage
- Uses IndexedDB for persistence
- No server required
- Data survives page reloads
- Approximately 5-10MB storage used

### Error Handling
Realistic Oracle error messages:
- `ORA-00900`: Invalid SQL statement
- `ORA-00942`: Table or view does not exist
- `ORA-01400`: Cannot insert NULL
- `ORA-01722`: Invalid number
- `ORA-00001`: Unique constraint violated
- And many more...

## 🎨 Features Showcase

### Autocomplete
- Keywords (SELECT, FROM, WHERE, etc.)
- Table names from database
- Column names based on context
- Real-time suggestions as you type

### System Tables
```sql
-- View all tables with metadata
SELECT TABLE_NAME, NUM_ROWS FROM ALL_TABLES;

-- View column definitions
SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE, NULLABLE
FROM ALL_TAB_COLS
WHERE TABLE_NAME = 'CUSTOMERS';

-- View sequences
SELECT SEQUENCE_NAME, LAST_NUMBER FROM USER_SEQUENCES;
```

### Sequences
```sql
-- Create sequence
CREATE SEQUENCE MY_SEQ START WITH 1000 INCREMENT BY 1;

-- Use in INSERT
INSERT INTO CUSTOMERS (CUSTOMER_ID, ...)
VALUES (CUSTOMER_SEQ.NEXTVAL, ...);

-- Get current value
SELECT CUSTOMER_SEQ.CURRVAL FROM DUAL;
```

## 📚 Example Queries

### Business Analytics
```sql
-- Top 5 customers by total spending
SELECT
    c.FIRST_NAME || ' ' || c.LAST_NAME AS CUSTOMER,
    SUM(o.TOTAL_AMOUNT) AS TOTAL_SPENT
FROM CUSTOMERS c
JOIN ORDERS o ON c.CUSTOMER_ID = o.CUSTOMER_ID
GROUP BY c.FIRST_NAME, c.LAST_NAME
ORDER BY TOTAL_SPENT DESC
FETCH FIRST 5 ROWS ONLY;

-- Products with low stock
SELECT PRODUCT_NAME, STOCK_QUANTITY, REORDER_LEVEL
FROM PRODUCTS
WHERE STOCK_QUANTITY < REORDER_LEVEL
ORDER BY STOCK_QUANTITY;

-- Monthly revenue
SELECT
    TO_CHAR(ORDER_DATE, 'YYYY-MM') AS MONTH,
    SUM(TOTAL_AMOUNT) AS REVENUE,
    COUNT(*) AS ORDER_COUNT
FROM ORDERS
WHERE STATUS = 'DELIVERED'
GROUP BY TO_CHAR(ORDER_DATE, 'YYYY-MM')
ORDER BY MONTH;
```

### Data Quality
```sql
-- Find customers without orders
SELECT c.*
FROM CUSTOMERS c
LEFT JOIN ORDERS o ON c.CUSTOMER_ID = o.CUSTOMER_ID
WHERE o.ORDER_ID IS NULL;

-- Products never ordered
SELECT p.PRODUCT_NAME, p.PRICE, p.STOCK_QUANTITY
FROM PRODUCTS p
LEFT JOIN ORDER_ITEMS oi ON p.PRODUCT_ID = oi.PRODUCT_ID
WHERE oi.ORDER_ITEM_ID IS NULL;
```

## 🤝 Contributing

Contributions are welcome! This is an educational project designed to help people learn SQL.

## 📄 License

MIT License - See LICENSE file for details

## 🙏 Acknowledgments

- Inspired by real Oracle SQL syntax and behavior
- Built for educational purposes
- Designed to be a safe learning environment for SQL

## 📞 Support

For issues or questions, please open an issue on GitHub.

---

**Happy SQL Learning! 🎉**