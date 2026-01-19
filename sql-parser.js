// SQL Parser for Oracle Dialect
class SQLParser {
    constructor() {
        this.keywords = new Set([
            'SELECT', 'FROM', 'WHERE', 'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET',
            'DELETE', 'CREATE', 'TABLE', 'DROP', 'ALTER', 'ADD', 'MODIFY', 'COLUMN',
            'PRIMARY', 'KEY', 'FOREIGN', 'REFERENCES', 'NOT', 'NULL', 'DEFAULT',
            'UNIQUE', 'CHECK', 'CONSTRAINT', 'INDEX', 'ON', 'AS', 'AND', 'OR',
            'ORDER', 'BY', 'GROUP', 'HAVING', 'JOIN', 'INNER', 'LEFT', 'RIGHT',
            'OUTER', 'FULL', 'CROSS', 'UNION', 'INTERSECT', 'MINUS', 'EXCEPT',
            'DISTINCT', 'ALL', 'LIKE', 'IN', 'BETWEEN', 'IS', 'EXISTS', 'ANY',
            'SOME', 'ASC', 'DESC', 'LIMIT', 'OFFSET', 'FETCH', 'FIRST', 'NEXT',
            'ROWS', 'ONLY', 'WITH', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END',
            'SEQUENCE', 'START', 'INCREMENT', 'MINVALUE', 'MAXVALUE', 'CYCLE',
            'NOCYCLE', 'CACHE', 'NOCACHE', 'TRUNCATE', 'COMMIT', 'ROLLBACK',
            'SAVEPOINT', 'GRANT', 'REVOKE', 'TO', 'CASCADE', 'DESCRIBE', 'DESC',
            'SHOW', 'TABLES', 'DATABASES', 'USE', 'DATABASE', 'VARCHAR2', 'NUMBER',
            'DATE', 'TIMESTAMP', 'CHAR', 'NVARCHAR2', 'NCHAR', 'CLOB', 'BLOB',
            'ROWNUM', 'ROWID', 'SYSDATE', 'SYSTIMESTAMP', 'DUAL', 'NEXTVAL',
            'CURRVAL', 'COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'NVL', 'NVL2',
            'COALESCE', 'DECODE', 'SUBSTR', 'INSTR', 'LENGTH', 'TRIM', 'LTRIM',
            'RTRIM', 'UPPER', 'LOWER', 'INITCAP', 'CONCAT', 'TO_CHAR', 'TO_DATE',
            'TO_NUMBER', 'ROUND', 'TRUNC', 'FLOOR', 'CEIL', 'ABS', 'MOD', 'POWER',
            'SQRT', 'SIGN', 'GREATEST', 'LEAST'
        ]);
    }

    // Main parse method
    parse(sql) {
        sql = sql.trim();
        if (!sql) {
            throw new Error('ORA-00900: invalid SQL statement');
        }

        // Remove trailing semicolon
        if (sql.endsWith(';')) {
            sql = sql.slice(0, -1).trim();
        }

        const tokens = this.tokenize(sql);
        if (tokens.length === 0) {
            throw new Error('ORA-00900: invalid SQL statement');
        }

        const firstToken = tokens[0].value.toUpperCase();

        // Special commands
        if (firstToken === 'HELP') {
            return { type: 'HELP' };
        }
        if (firstToken === 'TUTORIAL') {
            return { type: 'TUTORIAL' };
        }
        if (firstToken === 'DESCRIBE' || firstToken === 'DESC') {
            return this.parseDescribe(tokens);
        }
        if (firstToken === 'SHOW') {
            return this.parseShow(tokens);
        }

        // SQL statements
        switch (firstToken) {
            case 'SELECT':
                return this.parseSelect(tokens);
            case 'INSERT':
                return this.parseInsert(tokens);
            case 'UPDATE':
                return this.parseUpdate(tokens);
            case 'DELETE':
                return this.parseDelete(tokens);
            case 'CREATE':
                return this.parseCreate(tokens);
            case 'DROP':
                return this.parseDrop(tokens);
            case 'ALTER':
                return this.parseAlter(tokens);
            case 'TRUNCATE':
                return this.parseTruncate(tokens);
            case 'COMMIT':
                return { type: 'COMMIT' };
            case 'ROLLBACK':
                return { type: 'ROLLBACK' };
            default:
                throw new Error(`ORA-00900: invalid SQL statement`);
        }
    }

    // Tokenize SQL
    tokenize(sql) {
        const tokens = [];
        let i = 0;

        while (i < sql.length) {
            // Skip whitespace
            if (/\s/.test(sql[i])) {
                i++;
                continue;
            }

            // String literals (single quotes)
            if (sql[i] === "'") {
                let value = '';
                i++;
                while (i < sql.length && sql[i] !== "'") {
                    if (sql[i] === '\\' && i + 1 < sql.length) {
                        i++;
                    }
                    value += sql[i];
                    i++;
                }
                if (i >= sql.length) {
                    throw new Error('ORA-01756: quoted string not properly terminated');
                }
                i++; // Skip closing quote
                tokens.push({ type: 'STRING', value });
                continue;
            }

            // Numbers
            if (/\d/.test(sql[i]) || (sql[i] === '.' && /\d/.test(sql[i + 1]))) {
                let value = '';
                while (i < sql.length && /[\d.]/.test(sql[i])) {
                    value += sql[i];
                    i++;
                }
                tokens.push({ type: 'NUMBER', value: parseFloat(value) });
                continue;
            }

            // Operators and punctuation
            if ('(),.*+-/<>=!'.includes(sql[i])) {
                let op = sql[i];
                i++;

                // Check for two-character operators
                if (i < sql.length) {
                    const twoChar = op + sql[i];
                    if (['<=', '>=', '<>', '!=', '||'].includes(twoChar)) {
                        op = twoChar;
                        i++;
                    }
                }

                tokens.push({ type: 'OPERATOR', value: op });
                continue;
            }

            // Identifiers and keywords
            if (/[a-zA-Z_]/.test(sql[i])) {
                let value = '';
                while (i < sql.length && /[a-zA-Z0-9_$#]/.test(sql[i])) {
                    value += sql[i];
                    i++;
                }

                const upperValue = value.toUpperCase();
                const type = this.keywords.has(upperValue) ? 'KEYWORD' : 'IDENTIFIER';
                tokens.push({ type, value: upperValue });
                continue;
            }

            throw new Error(`ORA-00911: invalid character at position ${i}`);
        }

        return tokens;
    }

    // Parse DESCRIBE command
    parseDescribe(tokens) {
        if (tokens.length < 2) {
            throw new Error('ORA-00900: invalid SQL statement');
        }
        return {
            type: 'DESCRIBE',
            table: tokens[1].value
        };
    }

    // Parse SHOW command
    parseShow(tokens) {
        if (tokens.length < 2) {
            throw new Error('ORA-00900: invalid SQL statement');
        }
        return {
            type: 'SHOW',
            object: tokens[1].value
        };
    }

    // Parse SELECT
    parseSelect(tokens) {
        let i = 1;
        const result = {
            type: 'SELECT',
            distinct: false,
            columns: [],
            from: null,
            joins: [],
            where: null,
            groupBy: [],
            having: null,
            orderBy: [],
            limit: null,
            offset: null
        };

        // DISTINCT
        if (tokens[i] && tokens[i].value === 'DISTINCT') {
            result.distinct = true;
            i++;
        }

        // Columns
        while (i < tokens.length && tokens[i].value !== 'FROM') {
            if (tokens[i].value === ',') {
                i++;
                continue;
            }

            const col = { expression: '', alias: null };

            // Parse column expression
            let parenDepth = 0;
            while (i < tokens.length) {
                if (tokens[i].value === '(' ) parenDepth++;
                if (tokens[i].value === ')' ) parenDepth--;

                if (parenDepth === 0 && (tokens[i].value === ',' || tokens[i].value === 'FROM')) {
                    break;
                }

                // Check for alias
                if (parenDepth === 0 && tokens[i].value === 'AS' && i + 1 < tokens.length) {
                    i++;
                    col.alias = tokens[i].value;
                    i++;
                    break;
                }

                // Implicit alias (identifier after expression without AS)
                if (parenDepth === 0 && col.expression && tokens[i].type === 'IDENTIFIER' &&
                    tokens[i - 1].type !== 'OPERATOR' && tokens[i - 1].value !== '.') {
                    col.alias = tokens[i].value;
                    i++;
                    break;
                }

                if (tokens[i].type === 'STRING') {
                    col.expression += `'${tokens[i].value}'`;
                } else {
                    col.expression += tokens[i].value;
                }
                i++;
            }

            result.columns.push(col);
        }

        // FROM
        if (i < tokens.length && tokens[i].value === 'FROM') {
            i++;
            if (i >= tokens.length) {
                throw new Error('ORA-00923: FROM keyword not found where expected');
            }
            result.from = { table: tokens[i].value, alias: null };
            i++;

            // Table alias
            if (i < tokens.length && tokens[i].type === 'IDENTIFIER' &&
                !this.keywords.has(tokens[i].value)) {
                result.from.alias = tokens[i].value;
                i++;
            }
        }

        // JOINs
        while (i < tokens.length && ['JOIN', 'INNER', 'LEFT', 'RIGHT', 'FULL', 'CROSS'].includes(tokens[i].value)) {
            const join = { type: 'INNER', table: '', alias: null, on: null };

            if (tokens[i].value !== 'JOIN') {
                join.type = tokens[i].value;
                i++;
            }

            if (tokens[i].value === 'JOIN') {
                i++;
            }

            join.table = tokens[i].value;
            i++;

            // Join alias
            if (i < tokens.length && tokens[i].type === 'IDENTIFIER' &&
                !this.keywords.has(tokens[i].value)) {
                join.alias = tokens[i].value;
                i++;
            }

            // ON clause
            if (i < tokens.length && tokens[i].value === 'ON') {
                i++;
                join.on = '';
                while (i < tokens.length && !['JOIN', 'WHERE', 'GROUP', 'ORDER', 'LIMIT'].includes(tokens[i].value)) {
                    if (tokens[i].type === 'STRING') {
                        join.on += `'${tokens[i].value}'`;
                    } else {
                        join.on += tokens[i].value;
                    }
                    i++;
                }
            }

            result.joins.push(join);
        }

        // WHERE
        if (i < tokens.length && tokens[i].value === 'WHERE') {
            i++;
            result.where = '';
            while (i < tokens.length && !['GROUP', 'ORDER', 'LIMIT', 'OFFSET', 'FETCH'].includes(tokens[i].value)) {
                if (tokens[i].type === 'STRING') {
                    result.where += `'${tokens[i].value}'`;
                } else {
                    result.where += tokens[i].value;
                }
                i++;
            }
        }

        // GROUP BY
        if (i < tokens.length && tokens[i].value === 'GROUP') {
            i++;
            if (tokens[i].value !== 'BY') {
                throw new Error('ORA-00933: SQL command not properly ended');
            }
            i++;
            while (i < tokens.length && !['HAVING', 'ORDER', 'LIMIT'].includes(tokens[i].value)) {
                if (tokens[i].value !== ',') {
                    result.groupBy.push(tokens[i].value);
                }
                i++;
            }
        }

        // HAVING
        if (i < tokens.length && tokens[i].value === 'HAVING') {
            i++;
            result.having = '';
            while (i < tokens.length && !['ORDER', 'LIMIT'].includes(tokens[i].value)) {
                if (tokens[i].type === 'STRING') {
                    result.having += `'${tokens[i].value}'`;
                } else {
                    result.having += tokens[i].value;
                }
                i++;
            }
        }

        // ORDER BY
        if (i < tokens.length && tokens[i].value === 'ORDER') {
            i++;
            if (tokens[i].value !== 'BY') {
                throw new Error('ORA-00933: SQL command not properly ended');
            }
            i++;
            while (i < tokens.length && tokens[i].value !== 'LIMIT' && tokens[i].value !== 'FETCH') {
                if (tokens[i].value === ',') {
                    i++;
                    continue;
                }
                const orderCol = { column: tokens[i].value, direction: 'ASC' };
                i++;
                if (i < tokens.length && (tokens[i].value === 'ASC' || tokens[i].value === 'DESC')) {
                    orderCol.direction = tokens[i].value;
                    i++;
                }
                result.orderBy.push(orderCol);
            }
        }

        // LIMIT/FETCH FIRST
        if (i < tokens.length && (tokens[i].value === 'LIMIT' || tokens[i].value === 'FETCH')) {
            if (tokens[i].value === 'LIMIT') {
                i++;
                if (tokens[i].type === 'NUMBER') {
                    result.limit = tokens[i].value;
                }
            } else {
                // FETCH FIRST n ROWS ONLY
                i++;
                if (tokens[i].value === 'FIRST' || tokens[i].value === 'NEXT') {
                    i++;
                    if (tokens[i].type === 'NUMBER') {
                        result.limit = tokens[i].value;
                    }
                }
            }
        }

        return result;
    }

    // Parse INSERT
    parseInsert(tokens) {
        let i = 1;

        if (tokens[i].value !== 'INTO') {
            throw new Error('ORA-00928: missing INTO keyword');
        }
        i++;

        const table = tokens[i].value;
        i++;

        const result = {
            type: 'INSERT',
            table,
            columns: [],
            values: []
        };

        // Column list
        if (tokens[i].value === '(') {
            i++;
            while (tokens[i].value !== ')') {
                if (tokens[i].value !== ',') {
                    result.columns.push(tokens[i].value);
                }
                i++;
            }
            i++; // Skip closing paren
        }

        // VALUES
        if (tokens[i].value !== 'VALUES') {
            throw new Error('ORA-00928: missing VALUES keyword');
        }
        i++;

        if (tokens[i].value !== '(') {
            throw new Error('ORA-00917: missing comma');
        }
        i++;

        // Parse values
        while (tokens[i].value !== ')') {
            if (tokens[i].value === ',') {
                i++;
                continue;
            }

            if (tokens[i].type === 'STRING') {
                result.values.push(tokens[i].value);
            } else if (tokens[i].type === 'NUMBER') {
                result.values.push(tokens[i].value);
            } else if (tokens[i].value === 'NULL') {
                result.values.push(null);
            } else if (tokens[i].value === 'SYSDATE') {
                result.values.push({ function: 'SYSDATE' });
            } else {
                // Handle expressions like sequence.NEXTVAL
                let expr = tokens[i].value;
                i++;
                while (i < tokens.length && tokens[i].value !== ',' && tokens[i].value !== ')') {
                    expr += tokens[i].value;
                    i++;
                }
                result.values.push({ expression: expr });
                continue;
            }
            i++;
        }

        return result;
    }

    // Parse UPDATE
    parseUpdate(tokens) {
        let i = 1;
        const table = tokens[i].value;
        i++;

        if (tokens[i].value !== 'SET') {
            throw new Error('ORA-00971: missing SET keyword');
        }
        i++;

        const result = {
            type: 'UPDATE',
            table,
            set: {},
            where: null
        };

        // Parse SET clause
        while (i < tokens.length && tokens[i].value !== 'WHERE') {
            if (tokens[i].value === ',') {
                i++;
                continue;
            }

            const column = tokens[i].value;
            i++;

            if (tokens[i].value !== '=') {
                throw new Error('ORA-00933: SQL command not properly ended');
            }
            i++;

            if (tokens[i].type === 'STRING') {
                result.set[column] = tokens[i].value;
            } else if (tokens[i].type === 'NUMBER') {
                result.set[column] = tokens[i].value;
            } else if (tokens[i].value === 'NULL') {
                result.set[column] = null;
            } else {
                result.set[column] = { expression: tokens[i].value };
            }
            i++;
        }

        // WHERE clause
        if (i < tokens.length && tokens[i].value === 'WHERE') {
            i++;
            result.where = '';
            while (i < tokens.length) {
                if (tokens[i].type === 'STRING') {
                    result.where += `'${tokens[i].value}'`;
                } else {
                    result.where += tokens[i].value;
                }
                i++;
            }
        }

        return result;
    }

    // Parse DELETE
    parseDelete(tokens) {
        let i = 1;

        if (tokens[i].value !== 'FROM') {
            throw new Error('ORA-00928: missing FROM keyword');
        }
        i++;

        const result = {
            type: 'DELETE',
            table: tokens[i].value,
            where: null
        };
        i++;

        // WHERE clause
        if (i < tokens.length && tokens[i].value === 'WHERE') {
            i++;
            result.where = '';
            while (i < tokens.length) {
                if (tokens[i].type === 'STRING') {
                    result.where += `'${tokens[i].value}'`;
                } else {
                    result.where += tokens[i].value;
                }
                i++;
            }
        }

        return result;
    }

    // Parse CREATE
    parseCreate(tokens) {
        const secondToken = tokens[1].value;

        if (secondToken === 'TABLE') {
            return this.parseCreateTable(tokens);
        } else if (secondToken === 'SEQUENCE') {
            return this.parseCreateSequence(tokens);
        } else if (secondToken === 'INDEX') {
            return this.parseCreateIndex(tokens);
        } else {
            throw new Error('ORA-00900: invalid SQL statement');
        }
    }

    // Parse CREATE TABLE
    parseCreateTable(tokens) {
        let i = 2;
        const tableName = tokens[i].value;
        i++;

        if (tokens[i].value !== '(') {
            throw new Error('ORA-00906: missing left parenthesis');
        }
        i++;

        const result = {
            type: 'CREATE_TABLE',
            table: tableName,
            columns: [],
            primaryKey: null
        };

        // Parse columns
        while (tokens[i].value !== ')') {
            if (tokens[i].value === ',') {
                i++;
                continue;
            }

            // Check for constraints
            if (tokens[i].value === 'CONSTRAINT' || tokens[i].value === 'PRIMARY') {
                if (tokens[i].value === 'PRIMARY' || tokens[i + 1].value === 'PRIMARY') {
                    // Skip CONSTRAINT name if present
                    if (tokens[i].value === 'CONSTRAINT') i += 2;
                    // PRIMARY KEY
                    i += 2; // Skip PRIMARY KEY
                    if (tokens[i].value === '(') {
                        i++;
                        result.primaryKey = [];
                        while (tokens[i].value !== ')') {
                            if (tokens[i].value !== ',') {
                                result.primaryKey.push(tokens[i].value);
                            }
                            i++;
                        }
                        i++; // Skip closing paren
                    }
                }
                continue;
            }

            const column = {
                name: tokens[i].value,
                type: null,
                length: null,
                precision: null,
                scale: null,
                nullable: true,
                default: null
            };
            i++;

            // Data type
            column.type = tokens[i].value;
            i++;

            // Type parameters
            if (tokens[i] && tokens[i].value === '(') {
                i++;
                if (tokens[i].type === 'NUMBER') {
                    column.length = tokens[i].value;
                    column.precision = tokens[i].value;
                    i++;

                    // Scale for NUMBER
                    if (tokens[i] && tokens[i].value === ',') {
                        i++;
                        column.scale = tokens[i].value;
                        i++;
                    }
                }
                if (tokens[i].value === ')') {
                    i++;
                }
            }

            // Column constraints
            while (i < tokens.length && tokens[i].value !== ',' && tokens[i].value !== ')') {
                if (tokens[i].value === 'NOT' && tokens[i + 1].value === 'NULL') {
                    column.nullable = false;
                    i += 2;
                } else if (tokens[i].value === 'DEFAULT') {
                    i++;
                    if (tokens[i].type === 'STRING') {
                        column.default = tokens[i].value;
                    } else if (tokens[i].type === 'NUMBER') {
                        column.default = tokens[i].value;
                    } else {
                        column.default = tokens[i].value;
                    }
                    i++;
                } else if (tokens[i].value === 'PRIMARY' && tokens[i + 1].value === 'KEY') {
                    result.primaryKey = [column.name];
                    i += 2;
                } else {
                    i++;
                }
            }

            result.columns.push(column);
        }

        return result;
    }

    // Parse CREATE SEQUENCE
    parseCreateSequence(tokens) {
        let i = 2;
        const result = {
            type: 'CREATE_SEQUENCE',
            name: tokens[i].value,
            startWith: 1,
            incrementBy: 1,
            minValue: 1,
            maxValue: 999999999999999999999999999,
            cycle: false,
            cache: 20
        };
        i++;

        while (i < tokens.length) {
            const keyword = tokens[i].value;

            if (keyword === 'START') {
                i++;
                if (tokens[i].value === 'WITH') i++;
                result.startWith = tokens[i].value;
                i++;
            } else if (keyword === 'INCREMENT') {
                i++;
                if (tokens[i].value === 'BY') i++;
                result.incrementBy = tokens[i].value;
                i++;
            } else if (keyword === 'MINVALUE') {
                i++;
                result.minValue = tokens[i].value;
                i++;
            } else if (keyword === 'MAXVALUE') {
                i++;
                result.maxValue = tokens[i].value;
                i++;
            } else if (keyword === 'CYCLE') {
                result.cycle = true;
                i++;
            } else if (keyword === 'NOCYCLE') {
                result.cycle = false;
                i++;
            } else if (keyword === 'CACHE') {
                i++;
                result.cache = tokens[i].value;
                i++;
            } else {
                i++;
            }
        }

        return result;
    }

    // Parse CREATE INDEX
    parseCreateIndex(tokens) {
        let i = 2;
        const indexName = tokens[i].value;
        i++;

        if (tokens[i].value !== 'ON') {
            throw new Error('ORA-00933: SQL command not properly ended');
        }
        i++;

        const tableName = tokens[i].value;
        i++;

        if (tokens[i].value !== '(') {
            throw new Error('ORA-00906: missing left parenthesis');
        }
        i++;

        const columns = [];
        while (tokens[i].value !== ')') {
            if (tokens[i].value !== ',') {
                columns.push(tokens[i].value);
            }
            i++;
        }

        return {
            type: 'CREATE_INDEX',
            name: indexName,
            table: tableName,
            columns
        };
    }

    // Parse DROP
    parseDrop(tokens) {
        const objectType = tokens[1].value;
        const objectName = tokens[2].value;

        if (objectType === 'TABLE') {
            return {
                type: 'DROP_TABLE',
                table: objectName
            };
        } else if (objectType === 'SEQUENCE') {
            return {
                type: 'DROP_SEQUENCE',
                name: objectName
            };
        } else {
            throw new Error('ORA-00900: invalid SQL statement');
        }
    }

    // Parse ALTER
    parseAlter(tokens) {
        if (tokens[1].value !== 'TABLE') {
            throw new Error('ORA-00900: invalid SQL statement');
        }

        const tableName = tokens[2].value;
        const action = tokens[3].value;

        if (action === 'ADD') {
            return {
                type: 'ALTER_TABLE_ADD',
                table: tableName
            };
        } else if (action === 'MODIFY') {
            return {
                type: 'ALTER_TABLE_MODIFY',
                table: tableName
            };
        } else if (action === 'DROP') {
            return {
                type: 'ALTER_TABLE_DROP',
                table: tableName
            };
        }

        throw new Error('ORA-00900: invalid SQL statement');
    }

    // Parse TRUNCATE
    parseTruncate(tokens) {
        if (tokens[1].value !== 'TABLE') {
            throw new Error('ORA-00933: SQL command not properly ended');
        }

        return {
            type: 'TRUNCATE',
            table: tokens[2].value
        };
    }
}

// Global parser instance
const parser = new SQLParser();
