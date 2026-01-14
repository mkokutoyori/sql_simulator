// Database Manager with IndexedDB Persistence
class DatabaseManager {
    constructor() {
        this.tables = new Map();
        this.sequences = new Map();
        this.indexes = new Map();
        this.dbName = 'OracleSimDB';
        this.dbVersion = 1;
        this.db = null;
        this.initSystemTables();
    }

    // Initialize system tables
    initSystemTables() {
        // ALL_TABLES - System catalog for all tables
        this.tables.set('ALL_TABLES', {
            name: 'ALL_TABLES',
            columns: [
                { name: 'OWNER', type: 'VARCHAR2', length: 128, nullable: false },
                { name: 'TABLE_NAME', type: 'VARCHAR2', length: 128, nullable: false },
                { name: 'TABLESPACE_NAME', type: 'VARCHAR2', length: 30, nullable: true },
                { name: 'NUM_ROWS', type: 'NUMBER', nullable: true },
                { name: 'BLOCKS', type: 'NUMBER', nullable: true },
                { name: 'AVG_ROW_LEN', type: 'NUMBER', nullable: true },
                { name: 'LAST_ANALYZED', type: 'DATE', nullable: true }
            ],
            rows: [],
            primaryKey: ['OWNER', 'TABLE_NAME'],
            isSystemTable: true
        });

        // ALL_TAB_COLS - System catalog for all table columns
        this.tables.set('ALL_TAB_COLS', {
            name: 'ALL_TAB_COLS',
            columns: [
                { name: 'OWNER', type: 'VARCHAR2', length: 128, nullable: false },
                { name: 'TABLE_NAME', type: 'VARCHAR2', length: 128, nullable: false },
                { name: 'COLUMN_NAME', type: 'VARCHAR2', length: 128, nullable: false },
                { name: 'DATA_TYPE', type: 'VARCHAR2', length: 128, nullable: false },
                { name: 'DATA_LENGTH', type: 'NUMBER', nullable: true },
                { name: 'DATA_PRECISION', type: 'NUMBER', nullable: true },
                { name: 'DATA_SCALE', type: 'NUMBER', nullable: true },
                { name: 'NULLABLE', type: 'VARCHAR2', length: 1, nullable: false },
                { name: 'COLUMN_ID', type: 'NUMBER', nullable: false },
                { name: 'DEFAULT_LENGTH', type: 'NUMBER', nullable: true },
                { name: 'DATA_DEFAULT', type: 'VARCHAR2', length: 4000, nullable: true }
            ],
            rows: [],
            primaryKey: ['OWNER', 'TABLE_NAME', 'COLUMN_NAME'],
            isSystemTable: true
        });

        // USER_SEQUENCES - System catalog for sequences
        this.tables.set('USER_SEQUENCES', {
            name: 'USER_SEQUENCES',
            columns: [
                { name: 'SEQUENCE_NAME', type: 'VARCHAR2', length: 128, nullable: false },
                { name: 'MIN_VALUE', type: 'NUMBER', nullable: false },
                { name: 'MAX_VALUE', type: 'NUMBER', nullable: false },
                { name: 'INCREMENT_BY', type: 'NUMBER', nullable: false },
                { name: 'CYCLE_FLAG', type: 'VARCHAR2', length: 1, nullable: false },
                { name: 'ORDER_FLAG', type: 'VARCHAR2', length: 1, nullable: false },
                { name: 'CACHE_SIZE', type: 'NUMBER', nullable: false },
                { name: 'LAST_NUMBER', type: 'NUMBER', nullable: false }
            ],
            rows: [],
            primaryKey: ['SEQUENCE_NAME'],
            isSystemTable: true
        });

        // Update system tables with their own metadata
        this.updateSystemTables();
    }

    // Update system tables (ALL_TABLES and ALL_TAB_COLS)
    updateSystemTables() {
        const allTables = this.tables.get('ALL_TABLES');
        const allTabCols = this.tables.get('ALL_TAB_COLS');
        const userSequences = this.tables.get('USER_SEQUENCES');

        // Clear existing system data (except system tables themselves)
        allTables.rows = [];
        allTabCols.rows = [];
        userSequences.rows = [];

        // Populate ALL_TABLES and ALL_TAB_COLS
        for (const [tableName, tableData] of this.tables) {
            const numRows = tableData.rows ? tableData.rows.length : 0;

            // Add to ALL_TABLES
            allTables.rows.push({
                OWNER: 'USER',
                TABLE_NAME: tableName,
                TABLESPACE_NAME: 'USERS',
                NUM_ROWS: numRows,
                BLOCKS: Math.ceil(numRows / 100),
                AVG_ROW_LEN: 100,
                LAST_ANALYZED: new Date()
            });

            // Add columns to ALL_TAB_COLS
            tableData.columns.forEach((col, idx) => {
                allTabCols.rows.push({
                    OWNER: 'USER',
                    TABLE_NAME: tableName,
                    COLUMN_NAME: col.name,
                    DATA_TYPE: col.type,
                    DATA_LENGTH: col.length || null,
                    DATA_PRECISION: col.precision || null,
                    DATA_SCALE: col.scale || null,
                    NULLABLE: col.nullable !== false ? 'Y' : 'N',
                    COLUMN_ID: idx + 1,
                    DEFAULT_LENGTH: col.default ? col.default.toString().length : null,
                    DATA_DEFAULT: col.default || null
                });
            });
        }

        // Populate USER_SEQUENCES
        for (const [seqName, seqData] of this.sequences) {
            userSequences.rows.push({
                SEQUENCE_NAME: seqName,
                MIN_VALUE: seqData.minValue,
                MAX_VALUE: seqData.maxValue,
                INCREMENT_BY: seqData.incrementBy,
                CYCLE_FLAG: seqData.cycle ? 'Y' : 'N',
                ORDER_FLAG: 'N',
                CACHE_SIZE: seqData.cache,
                LAST_NUMBER: seqData.currentValue
            });
        }
    }

    // Initialize IndexedDB
    async initIndexedDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // Create object stores
                if (!db.objectStoreNames.contains('tables')) {
                    db.createObjectStore('tables', { keyPath: 'name' });
                }
                if (!db.objectStoreNames.contains('sequences')) {
                    db.createObjectStore('sequences', { keyPath: 'name' });
                }
                if (!db.objectStoreNames.contains('metadata')) {
                    db.createObjectStore('metadata', { keyPath: 'key' });
                }
            };
        });
    }

    // Save to IndexedDB
    async saveToIndexedDB() {
        if (!this.db) return;

        const transaction = this.db.transaction(['tables', 'sequences', 'metadata'], 'readwrite');
        const tablesStore = transaction.objectStore('tables');
        const sequencesStore = transaction.objectStore('sequences');
        const metadataStore = transaction.objectStore('metadata');

        // Clear existing data
        await tablesStore.clear();
        await sequencesStore.clear();

        // Save tables (exclude system tables from persistence)
        for (const [name, data] of this.tables) {
            if (!data.isSystemTable) {
                await tablesStore.put({ name, data });
            }
        }

        // Save sequences
        for (const [name, data] of this.sequences) {
            await sequencesStore.put({ name, data });
        }

        // Save metadata
        await metadataStore.put({
            key: 'lastSaved',
            value: new Date().toISOString()
        });

        return new Promise((resolve, reject) => {
            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(transaction.error);
        });
    }

    // Load from IndexedDB
    async loadFromIndexedDB() {
        if (!this.db) return;

        const transaction = this.db.transaction(['tables', 'sequences'], 'readonly');
        const tablesStore = transaction.objectStore('tables');
        const sequencesStore = transaction.objectStore('sequences');

        // Load tables
        const tablesRequest = tablesStore.getAll();
        const sequencesRequest = sequencesStore.getAll();

        return new Promise((resolve, reject) => {
            transaction.oncomplete = () => {
                const tables = tablesRequest.result;
                const sequences = sequencesRequest.result;

                // Restore tables (don't overwrite system tables)
                tables.forEach(item => {
                    if (!this.tables.has(item.name)) {
                        this.tables.set(item.name, item.data);
                    } else if (!item.data.isSystemTable) {
                        this.tables.set(item.name, item.data);
                    }
                });

                // Restore sequences
                sequences.forEach(item => {
                    this.sequences.set(item.name, item.data);
                });

                // Update system tables after loading
                this.updateSystemTables();
                resolve();
            };
            transaction.onerror = () => reject(transaction.error);
        });
    }

    // Create table
    createTable(tableName, columns, primaryKey = null) {
        if (this.tables.has(tableName.toUpperCase())) {
            throw new Error(`ORA-00955: name is already used by an existing object`);
        }

        this.tables.set(tableName.toUpperCase(), {
            name: tableName.toUpperCase(),
            columns: columns.map(col => ({
                name: col.name.toUpperCase(),
                type: col.type.toUpperCase(),
                length: col.length,
                precision: col.precision,
                scale: col.scale,
                nullable: col.nullable !== false,
                default: col.default
            })),
            rows: [],
            primaryKey: primaryKey ? primaryKey.map(k => k.toUpperCase()) : null,
            isSystemTable: false
        });

        this.updateSystemTables();
        this.saveToIndexedDB();
    }

    // Drop table
    dropTable(tableName) {
        const upperName = tableName.toUpperCase();
        const table = this.tables.get(upperName);

        if (!table) {
            throw new Error(`ORA-00942: table or view does not exist`);
        }

        if (table.isSystemTable) {
            throw new Error(`ORA-01031: insufficient privileges`);
        }

        this.tables.delete(upperName);
        this.updateSystemTables();
        this.saveToIndexedDB();
    }

    // Get table
    getTable(tableName) {
        const table = this.tables.get(tableName.toUpperCase());
        if (!table) {
            throw new Error(`ORA-00942: table or view does not exist`);
        }
        return table;
    }

    // Check if table exists
    tableExists(tableName) {
        return this.tables.has(tableName.toUpperCase());
    }

    // Insert row
    insertRow(tableName, row) {
        const table = this.getTable(tableName);

        if (table.isSystemTable) {
            throw new Error(`ORA-01031: insufficient privileges`);
        }

        // Validate and format row
        const formattedRow = {};
        table.columns.forEach(col => {
            const value = row[col.name] !== undefined ? row[col.name] : row[col.name.toLowerCase()];

            if (value === undefined || value === null) {
                if (!col.nullable && col.default === undefined) {
                    throw new Error(`ORA-01400: cannot insert NULL into ("${table.name}"."${col.name}")`);
                }
                formattedRow[col.name] = col.default !== undefined ? col.default : null;
            } else {
                formattedRow[col.name] = this.validateAndConvert(value, col);
            }
        });

        // Check primary key constraint
        if (table.primaryKey) {
            const pkValues = table.primaryKey.map(k => formattedRow[k]);
            const duplicate = table.rows.find(r =>
                table.primaryKey.every((k, i) => r[k] === pkValues[i])
            );
            if (duplicate) {
                throw new Error(`ORA-00001: unique constraint violated`);
            }
        }

        table.rows.push(formattedRow);
        this.updateSystemTables();
        this.saveToIndexedDB();
        return formattedRow;
    }

    // Update rows
    updateRows(tableName, updates, whereFn) {
        const table = this.getTable(tableName);

        if (table.isSystemTable) {
            throw new Error(`ORA-01031: insufficient privileges`);
        }

        let updateCount = 0;
        table.rows.forEach(row => {
            if (!whereFn || whereFn(row)) {
                Object.keys(updates).forEach(key => {
                    const col = table.columns.find(c => c.name === key.toUpperCase());
                    if (col) {
                        row[col.name] = this.validateAndConvert(updates[key], col);
                    }
                });
                updateCount++;
            }
        });

        this.updateSystemTables();
        this.saveToIndexedDB();
        return updateCount;
    }

    // Delete rows
    deleteRows(tableName, whereFn) {
        const table = this.getTable(tableName);

        if (table.isSystemTable) {
            throw new Error(`ORA-01031: insufficient privileges`);
        }

        const initialLength = table.rows.length;
        table.rows = table.rows.filter(row => !whereFn || !whereFn(row));
        const deleteCount = initialLength - table.rows.length;

        this.updateSystemTables();
        this.saveToIndexedDB();
        return deleteCount;
    }

    // Validate and convert value based on column type
    validateAndConvert(value, column) {
        if (value === null) return null;

        const type = column.type.toUpperCase();

        if (type.startsWith('VARCHAR') || type.startsWith('CHAR')) {
            const str = String(value);
            if (column.length && str.length > column.length) {
                throw new Error(`ORA-12899: value too large for column "${column.name}" (actual: ${str.length}, maximum: ${column.length})`);
            }
            return str;
        }

        if (type === 'NUMBER') {
            const num = Number(value);
            if (isNaN(num)) {
                throw new Error(`ORA-01722: invalid number`);
            }
            return num;
        }

        if (type === 'DATE' || type === 'TIMESTAMP') {
            if (value instanceof Date) return value;
            const date = new Date(value);
            if (isNaN(date.getTime())) {
                throw new Error(`ORA-01861: literal does not match format string`);
            }
            return date;
        }

        return value;
    }

    // Create sequence
    createSequence(name, options = {}) {
        const upperName = name.toUpperCase();
        if (this.sequences.has(upperName)) {
            throw new Error(`ORA-00955: name is already used by an existing object`);
        }

        this.sequences.set(upperName, {
            name: upperName,
            currentValue: options.startWith || 1,
            incrementBy: options.incrementBy || 1,
            minValue: options.minValue || 1,
            maxValue: options.maxValue || 999999999999999999999999999,
            cycle: options.cycle || false,
            cache: options.cache || 20
        });

        this.updateSystemTables();
        this.saveToIndexedDB();
    }

    // Get next sequence value
    nextVal(sequenceName) {
        const seq = this.sequences.get(sequenceName.toUpperCase());
        if (!seq) {
            throw new Error(`ORA-02289: sequence does not exist`);
        }

        const value = seq.currentValue;
        seq.currentValue += seq.incrementBy;

        if (seq.currentValue > seq.maxValue) {
            if (seq.cycle) {
                seq.currentValue = seq.minValue;
            } else {
                throw new Error(`ORA-08004: sequence ${sequenceName} exceeds MAXVALUE and cannot be instantiated`);
            }
        }

        this.updateSystemTables();
        this.saveToIndexedDB();
        return value;
    }

    // Get current sequence value
    currVal(sequenceName) {
        const seq = this.sequences.get(sequenceName.toUpperCase());
        if (!seq) {
            throw new Error(`ORA-02289: sequence does not exist`);
        }
        return seq.currentValue - seq.incrementBy;
    }

    // Drop sequence
    dropSequence(sequenceName) {
        const upperName = sequenceName.toUpperCase();
        if (!this.sequences.has(upperName)) {
            throw new Error(`ORA-02289: sequence does not exist`);
        }
        this.sequences.delete(upperName);
        this.updateSystemTables();
        this.saveToIndexedDB();
    }

    // Truncate table
    truncateTable(tableName) {
        const table = this.getTable(tableName);

        if (table.isSystemTable) {
            throw new Error(`ORA-01031: insufficient privileges`);
        }

        table.rows = [];
        this.updateSystemTables();
        this.saveToIndexedDB();
    }

    // Get all table names
    getAllTableNames() {
        return Array.from(this.tables.keys()).filter(name =>
            !this.tables.get(name).isSystemTable
        );
    }

    // Reset database (clear all user tables)
    async resetDatabase() {
        // Remove all non-system tables
        const userTables = Array.from(this.tables.keys()).filter(name =>
            !this.tables.get(name).isSystemTable
        );

        userTables.forEach(tableName => {
            this.tables.delete(tableName);
        });

        // Clear all sequences
        this.sequences.clear();

        this.updateSystemTables();
        await this.saveToIndexedDB();
    }
}

// Global database instance
const db = new DatabaseManager();
