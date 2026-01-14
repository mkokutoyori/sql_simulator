// SQL Execution Engine
class SQLEngine {
    constructor(database) {
        this.db = database;
        this.oracleFunctions = this.initOracleFunctions();
    }

    // Initialize Oracle functions
    initOracleFunctions() {
        return {
            // String functions
            'UPPER': (str) => String(str).toUpperCase(),
            'LOWER': (str) => String(str).toLowerCase(),
            'INITCAP': (str) => String(str).replace(/\b\w/g, c => c.toUpperCase()),
            'LENGTH': (str) => String(str).length,
            'SUBSTR': (str, start, len) => {
                start = parseInt(start);
                if (len !== undefined) {
                    return String(str).substr(start - 1, parseInt(len));
                }
                return String(str).substr(start - 1);
            },
            'INSTR': (str, search, start = 1) => {
                const idx = String(str).indexOf(String(search), parseInt(start) - 1);
                return idx === -1 ? 0 : idx + 1;
            },
            'TRIM': (str) => String(str).trim(),
            'LTRIM': (str) => String(str).replace(/^\s+/, ''),
            'RTRIM': (str) => String(str).replace(/\s+$/, ''),
            'CONCAT': (str1, str2) => String(str1) + String(str2),
            'REPLACE': (str, search, replace) => String(str).replace(new RegExp(search, 'g'), replace),
            'LPAD': (str, len, pad = ' ') => String(str).padStart(parseInt(len), String(pad)),
            'RPAD': (str, len, pad = ' ') => String(str).padEnd(parseInt(len), String(pad)),

            // Numeric functions
            'ROUND': (num, dec = 0) => {
                const factor = Math.pow(10, parseInt(dec));
                return Math.round(parseFloat(num) * factor) / factor;
            },
            'TRUNC': (num, dec = 0) => {
                const factor = Math.pow(10, parseInt(dec));
                return Math.trunc(parseFloat(num) * factor) / factor;
            },
            'FLOOR': (num) => Math.floor(parseFloat(num)),
            'CEIL': (num) => Math.ceil(parseFloat(num)),
            'ABS': (num) => Math.abs(parseFloat(num)),
            'MOD': (num, div) => parseFloat(num) % parseFloat(div),
            'POWER': (base, exp) => Math.pow(parseFloat(base), parseFloat(exp)),
            'SQRT': (num) => Math.sqrt(parseFloat(num)),
            'SIGN': (num) => Math.sign(parseFloat(num)),

            // Aggregate functions
            'COUNT': (arr) => arr.length,
            'SUM': (arr) => arr.reduce((sum, val) => sum + (parseFloat(val) || 0), 0),
            'AVG': (arr) => {
                const nums = arr.filter(v => v !== null && !isNaN(v));
                return nums.length ? nums.reduce((sum, val) => sum + parseFloat(val), 0) / nums.length : null;
            },
            'MIN': (arr) => Math.min(...arr.filter(v => v !== null).map(v => parseFloat(v) || v)),
            'MAX': (arr) => Math.max(...arr.filter(v => v !== null).map(v => parseFloat(v) || v)),

            // Null-related functions
            'NVL': (val, replace) => val !== null && val !== undefined ? val : replace,
            'NVL2': (val, ifNotNull, ifNull) => val !== null && val !== undefined ? ifNotNull : ifNull,
            'COALESCE': (...args) => args.find(arg => arg !== null && arg !== undefined),
            'NULLIF': (val1, val2) => val1 === val2 ? null : val1,

            // Date functions
            'SYSDATE': () => new Date(),
            'SYSTIMESTAMP': () => new Date(),
            'ADD_MONTHS': (date, months) => {
                const d = new Date(date);
                d.setMonth(d.getMonth() + parseInt(months));
                return d;
            },
            'MONTHS_BETWEEN': (date1, date2) => {
                const d1 = new Date(date1);
                const d2 = new Date(date2);
                return (d1.getFullYear() - d2.getFullYear()) * 12 + (d1.getMonth() - d2.getMonth());
            },
            'LAST_DAY': (date) => {
                const d = new Date(date);
                return new Date(d.getFullYear(), d.getMonth() + 1, 0);
            },

            // Conversion functions
            'TO_CHAR': (val, format) => {
                if (val instanceof Date) {
                    return this.formatDate(val, format);
                }
                return String(val);
            },
            'TO_DATE': (str, format) => new Date(str),
            'TO_NUMBER': (str) => parseFloat(str),

            // Other functions
            'DECODE': (...args) => {
                const expr = args[0];
                for (let i = 1; i < args.length - 1; i += 2) {
                    if (expr === args[i]) {
                        return args[i + 1];
                    }
                }
                return args[args.length - 1];
            },
            'GREATEST': (...args) => Math.max(...args.map(v => parseFloat(v) || v)),
            'LEAST': (...args) => Math.min(...args.map(v => parseFloat(v) || v))
        };
    }

    // Format date
    formatDate(date, format) {
        if (!format) {
            return date.toISOString().split('T')[0];
        }

        const map = {
            'YYYY': date.getFullYear(),
            'YY': String(date.getFullYear()).slice(-2),
            'MM': String(date.getMonth() + 1).padStart(2, '0'),
            'DD': String(date.getDate()).padStart(2, '0'),
            'HH24': String(date.getHours()).padStart(2, '0'),
            'HH': String(date.getHours() % 12 || 12).padStart(2, '0'),
            'MI': String(date.getMinutes()).padStart(2, '0'),
            'SS': String(date.getSeconds()).padStart(2, '0')
        };

        let result = format;
        for (const [key, value] of Object.entries(map)) {
            result = result.replace(new RegExp(key, 'g'), value);
        }
        return result;
    }

    // Execute SQL
    async execute(sql) {
        try {
            const ast = parser.parse(sql);
            return await this.executeAST(ast);
        } catch (error) {
            throw error;
        }
    }

    // Execute AST
    async executeAST(ast) {
        switch (ast.type) {
            case 'SELECT':
                return this.executeSelect(ast);
            case 'INSERT':
                return this.executeInsert(ast);
            case 'UPDATE':
                return this.executeUpdate(ast);
            case 'DELETE':
                return this.executeDelete(ast);
            case 'CREATE_TABLE':
                return this.executeCreateTable(ast);
            case 'DROP_TABLE':
                return this.executeDropTable(ast);
            case 'CREATE_SEQUENCE':
                return this.executeCreateSequence(ast);
            case 'DROP_SEQUENCE':
                return this.executeDropSequence(ast);
            case 'TRUNCATE':
                return this.executeTruncate(ast);
            case 'DESCRIBE':
                return this.executeDescribe(ast);
            case 'SHOW':
                return this.executeShow(ast);
            case 'COMMIT':
                return { success: true, message: 'Commit complete.' };
            case 'ROLLBACK':
                return { success: true, message: 'Rollback complete.' };
            default:
                throw new Error('ORA-00900: invalid SQL statement');
        }
    }

    // Execute SELECT
    executeSelect(ast) {
        let rows = [];

        // Handle DUAL table
        if (ast.from && ast.from.table === 'DUAL') {
            rows = [{}];
        } else if (ast.from) {
            const table = this.db.getTable(ast.from.table);
            rows = table.rows.map(row => ({ ...row }));

            // Process JOINs
            for (const join of ast.joins) {
                rows = this.executeJoin(rows, join, ast.from);
            }

            // WHERE clause
            if (ast.where) {
                rows = rows.filter(row => this.evaluateExpression(ast.where, row, ast.from));
            }
        }

        // GROUP BY
        if (ast.groupBy.length > 0) {
            rows = this.executeGroupBy(rows, ast.groupBy, ast.columns, ast.from);
        }

        // HAVING
        if (ast.having) {
            rows = rows.filter(row => this.evaluateExpression(ast.having, row, ast.from));
        }

        // SELECT columns
        let result = rows.map(row => {
            const newRow = {};
            for (const col of ast.columns) {
                const value = this.evaluateExpression(col.expression, row, ast.from);
                const key = col.alias || col.expression;
                newRow[key] = value;
            }
            return newRow;
        });

        // DISTINCT
        if (ast.distinct) {
            result = this.removeDuplicates(result);
        }

        // ORDER BY
        if (ast.orderBy.length > 0) {
            result = this.executeOrderBy(result, ast.orderBy);
        }

        // LIMIT
        if (ast.limit !== null) {
            result = result.slice(0, ast.limit);
        }

        return {
            success: true,
            columns: ast.columns.map(col => col.alias || col.expression),
            rows: result,
            rowCount: result.length
        };
    }

    // Execute JOIN
    executeJoin(leftRows, join, leftTable) {
        const rightTable = this.db.getTable(join.table);
        const rightRows = rightTable.rows;
        const result = [];

        if (join.type === 'CROSS') {
            for (const leftRow of leftRows) {
                for (const rightRow of rightRows) {
                    result.push({ ...leftRow, ...rightRow });
                }
            }
        } else {
            for (const leftRow of leftRows) {
                let matched = false;
                for (const rightRow of rightRows) {
                    const combinedRow = { ...leftRow, ...rightRow };
                    if (this.evaluateExpression(join.on, combinedRow, leftTable)) {
                        result.push(combinedRow);
                        matched = true;
                    }
                }

                if (!matched && (join.type === 'LEFT' || join.type === 'FULL')) {
                    result.push(leftRow);
                }
            }
        }

        return result;
    }

    // Execute GROUP BY
    executeGroupBy(rows, groupByColumns, selectColumns, fromTable) {
        const groups = new Map();

        // Group rows
        for (const row of rows) {
            const key = groupByColumns.map(col =>
                this.evaluateExpression(col, row, fromTable)
            ).join('|');

            if (!groups.has(key)) {
                groups.set(key, []);
            }
            groups.get(key).push(row);
        }

        // Aggregate
        const result = [];
        for (const [key, groupRows] of groups) {
            const newRow = {};

            // Set group by columns
            groupByColumns.forEach((col, i) => {
                newRow[col] = this.evaluateExpression(col, groupRows[0], fromTable);
            });

            // Calculate aggregates
            for (const col of selectColumns) {
                const expr = col.expression.toUpperCase();
                if (expr.startsWith('COUNT(')) {
                    newRow[col.alias || col.expression] = groupRows.length;
                } else if (expr.startsWith('SUM(')) {
                    const field = this.extractFunctionArg(expr);
                    newRow[col.alias || col.expression] = groupRows.reduce((sum, row) =>
                        sum + (parseFloat(row[field]) || 0), 0);
                } else if (expr.startsWith('AVG(')) {
                    const field = this.extractFunctionArg(expr);
                    const values = groupRows.map(row => parseFloat(row[field]) || 0);
                    newRow[col.alias || col.expression] = values.reduce((a, b) => a + b, 0) / values.length;
                } else if (expr.startsWith('MIN(')) {
                    const field = this.extractFunctionArg(expr);
                    newRow[col.alias || col.expression] = Math.min(...groupRows.map(row => row[field]));
                } else if (expr.startsWith('MAX(')) {
                    const field = this.extractFunctionArg(expr);
                    newRow[col.alias || col.expression] = Math.max(...groupRows.map(row => row[field]));
                } else if (!groupByColumns.includes(col.expression)) {
                    newRow[col.alias || col.expression] = this.evaluateExpression(col.expression, groupRows[0], fromTable);
                }
            }

            result.push(newRow);
        }

        return result;
    }

    // Extract function argument
    extractFunctionArg(expr) {
        const match = expr.match(/\(([^)]+)\)/);
        return match ? match[1].trim() : '';
    }

    // Execute ORDER BY
    executeOrderBy(rows, orderBy) {
        return rows.sort((a, b) => {
            for (const order of orderBy) {
                const aVal = a[order.column];
                const bVal = b[order.column];

                let comparison = 0;
                if (aVal < bVal) comparison = -1;
                if (aVal > bVal) comparison = 1;

                if (comparison !== 0) {
                    return order.direction === 'DESC' ? -comparison : comparison;
                }
            }
            return 0;
        });
    }

    // Remove duplicates
    removeDuplicates(rows) {
        const seen = new Set();
        return rows.filter(row => {
            const key = JSON.stringify(row);
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    }

    // Evaluate expression
    evaluateExpression(expr, row, fromTable) {
        if (!expr) return null;

        expr = String(expr).trim();

        // Literals
        if (expr === 'NULL') return null;
        if (expr === 'SYSDATE') return new Date();
        if (expr === '*') return Object.values(row).join(', ');
        if (/^-?\d+(\.\d+)?$/.test(expr)) return parseFloat(expr);
        if (expr.startsWith("'") && expr.endsWith("'")) {
            return expr.slice(1, -1);
        }

        // Column reference
        if (row.hasOwnProperty(expr)) {
            return row[expr];
        }

        // Handle table.column notation
        if (expr.includes('.')) {
            const parts = expr.split('.');
            const col = parts[parts.length - 1];
            if (row.hasOwnProperty(col)) {
                return row[col];
            }
        }

        // ROWNUM
        if (expr === 'ROWNUM') {
            return row._rownum || 1;
        }

        // Sequence NEXTVAL/CURRVAL
        if (expr.includes('NEXTVAL')) {
            const seqName = expr.split('.')[0];
            return this.db.nextVal(seqName);
        }
        if (expr.includes('CURRVAL')) {
            const seqName = expr.split('.')[0];
            return this.db.currVal(seqName);
        }

        // Functions
        const funcMatch = expr.match(/^(\w+)\((.*)\)$/);
        if (funcMatch) {
            const funcName = funcMatch[1].toUpperCase();
            const argsStr = funcMatch[2];

            if (this.oracleFunctions[funcName]) {
                const args = this.parseFunctionArgs(argsStr, row, fromTable);
                return this.oracleFunctions[funcName](...args);
            }
        }

        // Operators
        try {
            return this.evaluateOperatorExpression(expr, row, fromTable);
        } catch (e) {
            return expr;
        }
    }

    // Parse function arguments
    parseFunctionArgs(argsStr, row, fromTable) {
        if (!argsStr.trim()) return [];

        const args = [];
        let current = '';
        let parenDepth = 0;
        let inString = false;

        for (let i = 0; i < argsStr.length; i++) {
            const char = argsStr[i];

            if (char === "'" && (i === 0 || argsStr[i - 1] !== '\\')) {
                inString = !inString;
            }

            if (!inString) {
                if (char === '(') parenDepth++;
                if (char === ')') parenDepth--;

                if (char === ',' && parenDepth === 0) {
                    args.push(this.evaluateExpression(current.trim(), row, fromTable));
                    current = '';
                    continue;
                }
            }

            current += char;
        }

        if (current.trim()) {
            args.push(this.evaluateExpression(current.trim(), row, fromTable));
        }

        return args;
    }

    // Evaluate operator expression
    evaluateOperatorExpression(expr, row, fromTable) {
        // Comparison operators
        for (const op of ['<=', '>=', '<>', '!=', '<', '>', '=']) {
            if (expr.includes(op)) {
                const parts = expr.split(op);
                if (parts.length === 2) {
                    const left = this.evaluateExpression(parts[0].trim(), row, fromTable);
                    const right = this.evaluateExpression(parts[1].trim(), row, fromTable);

                    switch (op) {
                        case '=': return left == right;
                        case '<>':
                        case '!=': return left != right;
                        case '<': return left < right;
                        case '>': return left > right;
                        case '<=': return left <= right;
                        case '>=': return left >= right;
                    }
                }
            }
        }

        // LIKE operator
        if (expr.toUpperCase().includes(' LIKE ')) {
            const parts = expr.split(/\s+LIKE\s+/i);
            const left = String(this.evaluateExpression(parts[0].trim(), row, fromTable));
            const pattern = this.evaluateExpression(parts[1].trim(), row, fromTable);
            const regex = new RegExp('^' + String(pattern).replace(/%/g, '.*').replace(/_/g, '.') + '$', 'i');
            return regex.test(left);
        }

        // IN operator
        if (expr.toUpperCase().includes(' IN ')) {
            const parts = expr.split(/\s+IN\s+/i);
            const left = this.evaluateExpression(parts[0].trim(), row, fromTable);
            const listStr = parts[1].trim().replace(/^\(/, '').replace(/\)$/, '');
            const list = listStr.split(',').map(v => this.evaluateExpression(v.trim(), row, fromTable));
            return list.includes(left);
        }

        // BETWEEN operator
        if (expr.toUpperCase().includes(' BETWEEN ')) {
            const match = expr.match(/(.+)\s+BETWEEN\s+(.+)\s+AND\s+(.+)/i);
            if (match) {
                const value = this.evaluateExpression(match[1].trim(), row, fromTable);
                const lower = this.evaluateExpression(match[2].trim(), row, fromTable);
                const upper = this.evaluateExpression(match[3].trim(), row, fromTable);
                return value >= lower && value <= upper;
            }
        }

        // IS NULL / IS NOT NULL
        if (expr.toUpperCase().includes(' IS NOT NULL')) {
            const col = expr.replace(/\s+IS\s+NOT\s+NULL/i, '').trim();
            const value = this.evaluateExpression(col, row, fromTable);
            return value !== null && value !== undefined;
        }
        if (expr.toUpperCase().includes(' IS NULL')) {
            const col = expr.replace(/\s+IS\s+NULL/i, '').trim();
            const value = this.evaluateExpression(col, row, fromTable);
            return value === null || value === undefined;
        }

        // AND operator
        if (expr.toUpperCase().includes(' AND ')) {
            const parts = expr.split(/\s+AND\s+/i);
            return parts.every(part => this.evaluateExpression(part.trim(), row, fromTable));
        }

        // OR operator
        if (expr.toUpperCase().includes(' OR ')) {
            const parts = expr.split(/\s+OR\s+/i);
            return parts.some(part => this.evaluateExpression(part.trim(), row, fromTable));
        }

        // Arithmetic operators
        for (const op of ['+', '-', '*', '/']) {
            const opIndex = expr.lastIndexOf(op);
            if (opIndex > 0) {
                const left = this.evaluateExpression(expr.slice(0, opIndex).trim(), row, fromTable);
                const right = this.evaluateExpression(expr.slice(opIndex + 1).trim(), row, fromTable);

                if (!isNaN(left) && !isNaN(right)) {
                    switch (op) {
                        case '+': return parseFloat(left) + parseFloat(right);
                        case '-': return parseFloat(left) - parseFloat(right);
                        case '*': return parseFloat(left) * parseFloat(right);
                        case '/': return parseFloat(left) / parseFloat(right);
                    }
                }
            }
        }

        // String concatenation
        if (expr.includes('||')) {
            const parts = expr.split('||');
            return parts.map(p => String(this.evaluateExpression(p.trim(), row, fromTable))).join('');
        }

        return expr;
    }

    // Execute INSERT
    executeInsert(ast) {
        const values = {};

        ast.values.forEach((val, idx) => {
            const colName = ast.columns[idx] || ast.columns[idx].toUpperCase();

            if (val && typeof val === 'object') {
                if (val.function === 'SYSDATE') {
                    values[colName] = new Date();
                } else if (val.expression) {
                    // Handle sequence.NEXTVAL
                    if (val.expression.includes('NEXTVAL')) {
                        const seqName = val.expression.split('.')[0];
                        values[colName] = this.db.nextVal(seqName);
                    } else {
                        values[colName] = this.evaluateExpression(val.expression, {}, null);
                    }
                }
            } else {
                values[colName] = val;
            }
        });

        this.db.insertRow(ast.table, values);

        return {
            success: true,
            message: '1 row created.',
            rowCount: 1
        };
    }

    // Execute UPDATE
    executeUpdate(ast) {
        const whereFn = ast.where ? (row) => this.evaluateExpression(ast.where, row, { table: ast.table }) : null;

        const updates = {};
        for (const [col, val] of Object.entries(ast.set)) {
            if (val && typeof val === 'object' && val.expression) {
                updates[col] = this.evaluateExpression(val.expression, {}, null);
            } else {
                updates[col] = val;
            }
        }

        const count = this.db.updateRows(ast.table, updates, whereFn);

        return {
            success: true,
            message: `${count} row(s) updated.`,
            rowCount: count
        };
    }

    // Execute DELETE
    executeDelete(ast) {
        const whereFn = ast.where ? (row) => this.evaluateExpression(ast.where, row, { table: ast.table }) : null;
        const count = this.db.deleteRows(ast.table, whereFn);

        return {
            success: true,
            message: `${count} row(s) deleted.`,
            rowCount: count
        };
    }

    // Execute CREATE TABLE
    executeCreateTable(ast) {
        this.db.createTable(ast.table, ast.columns, ast.primaryKey);

        return {
            success: true,
            message: 'Table created.'
        };
    }

    // Execute DROP TABLE
    executeDropTable(ast) {
        this.db.dropTable(ast.table);

        return {
            success: true,
            message: 'Table dropped.'
        };
    }

    // Execute CREATE SEQUENCE
    executeCreateSequence(ast) {
        this.db.createSequence(ast.name, {
            startWith: ast.startWith,
            incrementBy: ast.incrementBy,
            minValue: ast.minValue,
            maxValue: ast.maxValue,
            cycle: ast.cycle,
            cache: ast.cache
        });

        return {
            success: true,
            message: 'Sequence created.'
        };
    }

    // Execute DROP SEQUENCE
    executeDropSequence(ast) {
        this.db.dropSequence(ast.name);

        return {
            success: true,
            message: 'Sequence dropped.'
        };
    }

    // Execute TRUNCATE
    executeTruncate(ast) {
        this.db.truncateTable(ast.table);

        return {
            success: true,
            message: 'Table truncated.'
        };
    }

    // Execute DESCRIBE
    executeDescribe(ast) {
        const table = this.db.getTable(ast.table);

        const rows = table.columns.map(col => ({
            'Name': col.name,
            'Null?': col.nullable ? 'NULL' : 'NOT NULL',
            'Type': this.formatColumnType(col)
        }));

        return {
            success: true,
            columns: ['Name', 'Null?', 'Type'],
            rows,
            rowCount: rows.length
        };
    }

    // Format column type
    formatColumnType(col) {
        let type = col.type;
        if (col.length) {
            type += `(${col.length}`;
            if (col.scale) {
                type += `,${col.scale}`;
            }
            type += ')';
        }
        return type;
    }

    // Execute SHOW
    executeShow(ast) {
        if (ast.object === 'TABLES') {
            const tableNames = this.db.getAllTableNames();
            const rows = tableNames.map(name => ({ 'TABLE_NAME': name }));

            return {
                success: true,
                columns: ['TABLE_NAME'],
                rows,
                rowCount: rows.length
            };
        }

        throw new Error('ORA-00900: invalid SQL statement');
    }
}

// Global engine instance
const engine = new SQLEngine(db);
