// Interactive SQL Tutorial System
class TutorialSystem {
    constructor() {
        this.currentLesson = 0;
        this.lessons = this.initializeLessons();
    }

    initializeLessons() {
        return [
            {
                title: "Introduction to SQL",
                content: `
                    <h3>Welcome to Oracle SQL!</h3>
                    <p>SQL (Structured Query Language) is the standard language for managing and querying relational databases. Oracle SQL is a powerful dialect used worldwide in enterprise applications.</p>

                    <p><strong>What you'll learn:</strong></p>
                    <ul>
                        <li>Basic SELECT queries</li>
                        <li>Filtering and sorting data</li>
                        <li>Joining tables</li>
                        <li>Data manipulation (INSERT, UPDATE, DELETE)</li>
                        <li>Creating and managing database objects</li>
                        <li>Oracle-specific functions and features</li>
                    </ul>

                    <div class="example">
                        <p><strong>Try your first query:</strong></p>
                        <pre>SELECT * FROM CUSTOMERS;</pre>
                        <p>This retrieves all columns and rows from the CUSTOMERS table.</p>
                    </div>

                    <div class="note">
                        <strong>Note:</strong> This simulator includes a complete e-commerce database with customers, products, orders, and more. Feel free to explore!
                    </div>
                `
            },
            {
                title: "SELECT Statement - Basics",
                content: `
                    <h3>The SELECT Statement</h3>
                    <p>The SELECT statement is used to retrieve data from one or more tables. It's the most commonly used SQL command.</p>

                    <p><strong>Basic Syntax:</strong></p>
                    <pre>SELECT column1, column2, ...
FROM table_name;</pre>

                    <div class="example">
                        <p><strong>Example 1: Select specific columns</strong></p>
                        <pre>SELECT FIRST_NAME, LAST_NAME, EMAIL
FROM CUSTOMERS;</pre>
                        <p>Returns only the specified columns.</p>
                    </div>

                    <div class="example">
                        <p><strong>Example 2: Select all columns</strong></p>
                        <pre>SELECT * FROM PRODUCTS;</pre>
                        <p>The asterisk (*) selects all columns.</p>
                    </div>

                    <div class="example">
                        <p><strong>Example 3: Using DISTINCT</strong></p>
                        <pre>SELECT DISTINCT CITY FROM CUSTOMERS;</pre>
                        <p>Returns unique values only, removing duplicates.</p>
                    </div>

                    <div class="note">
                        <strong>Tip:</strong> Use <code>DESC table_name</code> to see the structure of any table before querying it.
                    </div>
                `
            },
            {
                title: "WHERE Clause - Filtering Data",
                content: `
                    <h3>Filtering with WHERE</h3>
                    <p>The WHERE clause filters records based on specified conditions.</p>

                    <p><strong>Syntax:</strong></p>
                    <pre>SELECT column1, column2
FROM table_name
WHERE condition;</pre>

                    <div class="example">
                        <p><strong>Example 1: Comparison operators</strong></p>
                        <pre>SELECT PRODUCT_NAME, PRICE
FROM PRODUCTS
WHERE PRICE > 100;</pre>
                        <p>Returns products with price greater than 100.</p>
                    </div>

                    <div class="example">
                        <p><strong>Example 2: Text matching</strong></p>
                        <pre>SELECT * FROM CUSTOMERS
WHERE CITY = 'New York';</pre>
                        <p>Exact match for city name.</p>
                    </div>

                    <div class="example">
                        <p><strong>Example 3: Using LIKE for patterns</strong></p>
                        <pre>SELECT * FROM PRODUCTS
WHERE PRODUCT_NAME LIKE '%Phone%';</pre>
                        <p>% is a wildcard matching any characters.</p>
                    </div>

                    <div class="example">
                        <p><strong>Example 4: Multiple conditions with AND/OR</strong></p>
                        <pre>SELECT * FROM PRODUCTS
WHERE PRICE > 50 AND STOCK_QUANTITY < 100;</pre>
                    </div>

                    <p><strong>Common Operators:</strong></p>
                    <ul>
                        <li><code>=</code> Equal</li>
                        <li><code>&lt;&gt;</code> or <code>!=</code> Not equal</li>
                        <li><code>&gt;</code> Greater than</li>
                        <li><code>&lt;</code> Less than</li>
                        <li><code>&gt;=</code> Greater than or equal</li>
                        <li><code>&lt;=</code> Less than or equal</li>
                        <li><code>BETWEEN</code> Between a range</li>
                        <li><code>IN</code> Match any value in a list</li>
                        <li><code>IS NULL</code> Check for null values</li>
                    </ul>
                `
            },
            {
                title: "ORDER BY - Sorting Results",
                content: `
                    <h3>Sorting with ORDER BY</h3>
                    <p>The ORDER BY clause sorts the result set by one or more columns.</p>

                    <p><strong>Syntax:</strong></p>
                    <pre>SELECT column1, column2
FROM table_name
ORDER BY column1 [ASC|DESC], column2 [ASC|DESC];</pre>

                    <div class="example">
                        <p><strong>Example 1: Ascending order (default)</strong></p>
                        <pre>SELECT PRODUCT_NAME, PRICE
FROM PRODUCTS
ORDER BY PRICE;</pre>
                        <p>Sorts by price from lowest to highest.</p>
                    </div>

                    <div class="example">
                        <p><strong>Example 2: Descending order</strong></p>
                        <pre>SELECT PRODUCT_NAME, PRICE
FROM PRODUCTS
ORDER BY PRICE DESC;</pre>
                        <p>Sorts by price from highest to lowest.</p>
                    </div>

                    <div class="example">
                        <p><strong>Example 3: Multiple columns</strong></p>
                        <pre>SELECT FIRST_NAME, LAST_NAME, CITY
FROM CUSTOMERS
ORDER BY CITY, LAST_NAME;</pre>
                        <p>First sorts by city, then by last name within each city.</p>
                    </div>

                    <div class="example">
                        <p><strong>Example 4: Using FETCH FIRST (Oracle way)</strong></p>
                        <pre>SELECT PRODUCT_NAME, PRICE
FROM PRODUCTS
ORDER BY PRICE DESC
FETCH FIRST 5 ROWS ONLY;</pre>
                        <p>Returns only the top 5 most expensive products.</p>
                    </div>
                `
            },
            {
                title: "Aggregate Functions",
                content: `
                    <h3>Aggregate Functions</h3>
                    <p>Aggregate functions perform calculations on multiple rows and return a single value.</p>

                    <p><strong>Common Aggregate Functions:</strong></p>
                    <ul>
                        <li><code>COUNT()</code> - Counts rows</li>
                        <li><code>SUM()</code> - Sum of values</li>
                        <li><code>AVG()</code> - Average value</li>
                        <li><code>MIN()</code> - Minimum value</li>
                        <li><code>MAX()</code> - Maximum value</li>
                    </ul>

                    <div class="example">
                        <p><strong>Example 1: COUNT</strong></p>
                        <pre>SELECT COUNT(*) AS TOTAL_CUSTOMERS
FROM CUSTOMERS;</pre>
                        <p>Counts the total number of customers.</p>
                    </div>

                    <div class="example">
                        <p><strong>Example 2: AVG, MIN, MAX</strong></p>
                        <pre>SELECT
    AVG(PRICE) AS AVG_PRICE,
    MIN(PRICE) AS MIN_PRICE,
    MAX(PRICE) AS MAX_PRICE
FROM PRODUCTS;</pre>
                    </div>

                    <div class="example">
                        <p><strong>Example 3: SUM with WHERE</strong></p>
                        <pre>SELECT SUM(TOTAL_AMOUNT) AS TOTAL_REVENUE
FROM ORDERS
WHERE STATUS = 'DELIVERED';</pre>
                    </div>

                    <h3>GROUP BY Clause</h3>
                    <p>GROUP BY groups rows that have the same values in specified columns.</p>

                    <div class="example">
                        <p><strong>Example 4: GROUP BY</strong></p>
                        <pre>SELECT CITY, COUNT(*) AS CUSTOMER_COUNT
FROM CUSTOMERS
GROUP BY CITY
ORDER BY CUSTOMER_COUNT DESC;</pre>
                        <p>Counts customers in each city.</p>
                    </div>

                    <div class="example">
                        <p><strong>Example 5: HAVING clause</strong></p>
                        <pre>SELECT CATEGORY_ID, AVG(PRICE) AS AVG_PRICE
FROM PRODUCTS
GROUP BY CATEGORY_ID
HAVING AVG(PRICE) > 100;</pre>
                        <p>HAVING filters groups (like WHERE for aggregates).</p>
                    </div>
                `
            },
            {
                title: "Joining Tables",
                content: `
                    <h3>JOIN Operations</h3>
                    <p>JOINs combine rows from two or more tables based on related columns.</p>

                    <p><strong>Types of JOINs:</strong></p>
                    <ul>
                        <li><strong>INNER JOIN:</strong> Returns matching rows from both tables</li>
                        <li><strong>LEFT JOIN:</strong> Returns all rows from left table and matching rows from right</li>
                        <li><strong>RIGHT JOIN:</strong> Returns all rows from right table and matching rows from left</li>
                        <li><strong>FULL JOIN:</strong> Returns all rows from both tables</li>
                    </ul>

                    <div class="example">
                        <p><strong>Example 1: INNER JOIN</strong></p>
                        <pre>SELECT
    c.FIRST_NAME,
    c.LAST_NAME,
    o.ORDER_ID,
    o.TOTAL_AMOUNT
FROM CUSTOMERS c
INNER JOIN ORDERS o ON c.CUSTOMER_ID = o.CUSTOMER_ID;</pre>
                        <p>Shows customers and their orders.</p>
                    </div>

                    <div class="example">
                        <p><strong>Example 2: Multiple JOINs</strong></p>
                        <pre>SELECT
    o.ORDER_ID,
    c.FIRST_NAME || ' ' || c.LAST_NAME AS CUSTOMER,
    p.PRODUCT_NAME,
    oi.QUANTITY,
    oi.LINE_TOTAL
FROM ORDERS o
JOIN CUSTOMERS c ON o.CUSTOMER_ID = c.CUSTOMER_ID
JOIN ORDER_ITEMS oi ON o.ORDER_ID = oi.ORDER_ID
JOIN PRODUCTS p ON oi.PRODUCT_ID = p.PRODUCT_ID;</pre>
                        <p>Combines data from multiple tables.</p>
                    </div>

                    <div class="example">
                        <p><strong>Example 3: LEFT JOIN</strong></p>
                        <pre>SELECT
    p.PRODUCT_NAME,
    COUNT(oi.ORDER_ITEM_ID) AS TIMES_ORDERED
FROM PRODUCTS p
LEFT JOIN ORDER_ITEMS oi ON p.PRODUCT_ID = oi.PRODUCT_ID
GROUP BY p.PRODUCT_NAME
ORDER BY TIMES_ORDERED DESC;</pre>
                        <p>Shows all products, even those never ordered.</p>
                    </div>
                `
            },
            {
                title: "Oracle Functions",
                content: `
                    <h3>Oracle Built-in Functions</h3>
                    <p>Oracle provides numerous built-in functions for string, numeric, date, and other operations.</p>

                    <h4>String Functions</h4>
                    <div class="example">
                        <pre>SELECT
    UPPER(FIRST_NAME) AS UPPER_NAME,
    LOWER(EMAIL) AS LOWER_EMAIL,
    LENGTH(LAST_NAME) AS NAME_LENGTH,
    SUBSTR(PHONE, 1, 3) AS AREA_CODE
FROM CUSTOMERS
FETCH FIRST 5 ROWS ONLY;</pre>
                    </div>

                    <h4>Numeric Functions</h4>
                    <div class="example">
                        <pre>SELECT
    PRODUCT_NAME,
    PRICE,
    ROUND(PRICE * 0.9, 2) AS DISCOUNTED_PRICE,
    CEIL(PRICE) AS ROUNDED_UP,
    FLOOR(PRICE) AS ROUNDED_DOWN
FROM PRODUCTS
FETCH FIRST 5 ROWS ONLY;</pre>
                    </div>

                    <h4>Date Functions</h4>
                    <div class="example">
                        <pre>SELECT
    ORDER_ID,
    ORDER_DATE,
    SYSDATE AS CURRENT_DATE
FROM ORDERS
FETCH FIRST 5 ROWS ONLY;</pre>
                    </div>

                    <h4>Null Handling</h4>
                    <div class="example">
                        <pre>SELECT
    PRODUCT_NAME,
    NVL(COLOR, 'Not Specified') AS COLOR,
    COALESCE(SIZE, COLOR, 'No Details') AS INFO
FROM PRODUCTS
FETCH FIRST 5 ROWS ONLY;</pre>
                        <p>NVL and COALESCE handle NULL values.</p>
                    </div>

                    <h4>DECODE Function</h4>
                    <div class="example">
                        <pre>SELECT
    ORDER_ID,
    STATUS,
    DECODE(STATUS,
        'PENDING', 'Order Pending',
        'SHIPPED', 'In Transit',
        'DELIVERED', 'Completed',
        'Other Status') AS STATUS_DESC
FROM ORDERS;</pre>
                    </div>
                `
            },
            {
                title: "Data Manipulation - INSERT",
                content: `
                    <h3>INSERT Statement</h3>
                    <p>The INSERT statement adds new rows to a table.</p>

                    <p><strong>Syntax:</strong></p>
                    <pre>INSERT INTO table_name (column1, column2, ...)
VALUES (value1, value2, ...);</pre>

                    <div class="example">
                        <p><strong>Example 1: Insert with all columns</strong></p>
                        <pre>INSERT INTO CUSTOMERS (
    CUSTOMER_ID,
    FIRST_NAME,
    LAST_NAME,
    EMAIL,
    PHONE,
    CITY,
    STATE,
    COUNTRY,
    REGISTRATION_DATE,
    LOYALTY_POINTS,
    STATUS
) VALUES (
    100,
    'Alice',
    'Johnson',
    'alice.j@email.com',
    '555-9999',
    'Seattle',
    'WA',
    'USA',
    SYSDATE,
    0,
    'ACTIVE'
);</pre>
                    </div>

                    <div class="example">
                        <p><strong>Example 2: Insert with sequence</strong></p>
                        <pre>INSERT INTO CUSTOMERS (
    CUSTOMER_ID,
    FIRST_NAME,
    LAST_NAME,
    EMAIL,
    REGISTRATION_DATE
) VALUES (
    CUSTOMER_SEQ.NEXTVAL,
    'Bob',
    'Smith',
    'bob.s@email.com',
    SYSDATE
);</pre>
                        <p>NEXTVAL gets the next value from a sequence.</p>
                    </div>

                    <div class="note">
                        <strong>Important:</strong> Make sure to provide values for all NOT NULL columns, or use DEFAULT values.
                    </div>
                `
            },
            {
                title: "Data Manipulation - UPDATE & DELETE",
                content: `
                    <h3>UPDATE Statement</h3>
                    <p>The UPDATE statement modifies existing records.</p>

                    <div class="example">
                        <p><strong>Example 1: Update specific rows</strong></p>
                        <pre>UPDATE CUSTOMERS
SET LOYALTY_POINTS = LOYALTY_POINTS + 50
WHERE CUSTOMER_ID = 1;</pre>
                    </div>

                    <div class="example">
                        <p><strong>Example 2: Update multiple columns</strong></p>
                        <pre>UPDATE PRODUCTS
SET PRICE = PRICE * 1.1,
    STOCK_QUANTITY = STOCK_QUANTITY - 5
WHERE CATEGORY_ID = 1;</pre>
                    </div>

                    <div class="note">
                        <strong>Warning:</strong> Without a WHERE clause, UPDATE modifies ALL rows!
                    </div>

                    <h3>DELETE Statement</h3>
                    <p>The DELETE statement removes rows from a table.</p>

                    <div class="example">
                        <p><strong>Example 3: Delete specific rows</strong></p>
                        <pre>DELETE FROM CUSTOMERS
WHERE STATUS = 'INACTIVE';</pre>
                    </div>

                    <div class="example">
                        <p><strong>Example 4: Delete with subquery</strong></p>
                        <pre>DELETE FROM PRODUCTS
WHERE STOCK_QUANTITY = 0 AND IS_ACTIVE = 'N';</pre>
                    </div>

                    <div class="note">
                        <strong>Warning:</strong> Without a WHERE clause, DELETE removes ALL rows!
                    </div>
                `
            },
            {
                title: "Creating Tables and Sequences",
                content: `
                    <h3>CREATE TABLE</h3>
                    <p>The CREATE TABLE statement creates a new table.</p>

                    <div class="example">
                        <p><strong>Example 1: Basic table</strong></p>
                        <pre>CREATE TABLE EMPLOYEES (
    EMPLOYEE_ID NUMBER NOT NULL,
    FIRST_NAME VARCHAR2(50) NOT NULL,
    LAST_NAME VARCHAR2(50) NOT NULL,
    EMAIL VARCHAR2(100),
    HIRE_DATE DATE DEFAULT SYSDATE,
    SALARY NUMBER(10,2),
    DEPARTMENT VARCHAR2(50),
    PRIMARY KEY (EMPLOYEE_ID)
);</pre>
                    </div>

                    <h3>Sequences</h3>
                    <p>Sequences generate unique numeric values, typically for primary keys.</p>

                    <div class="example">
                        <p><strong>Example 2: Create sequence</strong></p>
                        <pre>CREATE SEQUENCE EMPLOYEE_SEQ
START WITH 1000
INCREMENT BY 1
MINVALUE 1
MAXVALUE 999999999
NOCYCLE
CACHE 20;</pre>
                    </div>

                    <div class="example">
                        <p><strong>Example 3: Using sequence in INSERT</strong></p>
                        <pre>INSERT INTO EMPLOYEES (
    EMPLOYEE_ID,
    FIRST_NAME,
    LAST_NAME,
    EMAIL
) VALUES (
    EMPLOYEE_SEQ.NEXTVAL,
    'John',
    'Doe',
    'john@company.com'
);</pre>
                    </div>

                    <h3>System Tables</h3>
                    <p>Oracle maintains system tables with metadata:</p>
                    <div class="example">
                        <pre>-- View all tables
SELECT * FROM ALL_TABLES;

-- View columns of a table
SELECT * FROM ALL_TAB_COLS
WHERE TABLE_NAME = 'CUSTOMERS';

-- View sequences
SELECT * FROM USER_SEQUENCES;</pre>
                    </div>
                `
            }
        ];
    }

    getLesson(index) {
        if (index >= 0 && index < this.lessons.length) {
            return this.lessons[index];
        }
        return null;
    }

    getCurrentLesson() {
        return this.getLesson(this.currentLesson);
    }

    nextLesson() {
        if (this.currentLesson < this.lessons.length - 1) {
            this.currentLesson++;
            return true;
        }
        return false;
    }

    prevLesson() {
        if (this.currentLesson > 0) {
            this.currentLesson--;
            return true;
        }
        return false;
    }

    getTotalLessons() {
        return this.lessons.length;
    }

    getCurrentLessonNumber() {
        return this.currentLesson + 1;
    }

    reset() {
        this.currentLesson = 0;
    }
}

// Global tutorial instance
const tutorial = new TutorialSystem();
