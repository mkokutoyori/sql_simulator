// Terminal Controller
class Terminal {
    constructor() {
        this.history = [];
        this.historyIndex = -1;
        this.currentInput = '';
        this.suggestionIndex = -1;
        this.suggestions = [];

        // SQL keywords and table names for autocomplete
        this.keywords = [
            'SELECT', 'FROM', 'WHERE', 'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET',
            'DELETE', 'CREATE', 'TABLE', 'DROP', 'ALTER', 'ORDER', 'BY', 'GROUP',
            'HAVING', 'JOIN', 'INNER', 'LEFT', 'RIGHT', 'OUTER', 'ON', 'AS',
            'DISTINCT', 'COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'AND', 'OR', 'NOT',
            'LIKE', 'IN', 'BETWEEN', 'IS', 'NULL', 'ASC', 'DESC', 'LIMIT',
            'SEQUENCE', 'TRUNCATE', 'DESCRIBE', 'DESC', 'HELP', 'TUTORIAL'
        ];

        this.init();
    }

    async init() {
        // Initialize database
        await db.initIndexedDB();
        await db.loadFromIndexedDB();

        // Seed database if needed
        await DataSeeder.seedDatabase();

        // Setup event listeners
        this.setupEventListeners();

        // Update status
        this.updateStatus('Ready', db.tables.size + ' tables loaded');
    }

    setupEventListeners() {
        const input = document.getElementById('terminalInput');
        const output = document.getElementById('terminalOutput');
        const suggestionsEl = document.getElementById('suggestions');

        // Input event handlers
        input.addEventListener('keydown', (e) => this.handleKeyDown(e));
        input.addEventListener('input', () => this.handleInput());

        // Button handlers
        document.getElementById('clearBtn').addEventListener('click', () => this.clearTerminal());
        document.getElementById('resetDbBtn').addEventListener('click', () => this.resetDatabase());
        document.getElementById('tutorialBtn').addEventListener('click', () => this.showTutorial());
        document.getElementById('closeTutorialBtn').addEventListener('click', () => this.hideTutorial());
        document.getElementById('prevLessonBtn').addEventListener('click', () => this.previousLesson());
        document.getElementById('nextLessonBtn').addEventListener('click', () => this.nextLesson());

        // Auto-resize textarea
        input.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });

        // Focus input on click
        output.addEventListener('click', () => input.focus());
        input.focus();
    }

    handleKeyDown(e) {
        const input = e.target;
        const suggestionsEl = document.getElementById('suggestions');

        switch(e.key) {
            case 'Enter':
                if (!e.shiftKey) {
                    e.preventDefault();
                    this.executeCommand(input.value.trim());
                    input.value = '';
                    input.style.height = 'auto';
                    suggestionsEl.classList.remove('show');
                }
                break;

            case 'ArrowUp':
                if (!suggestionsEl.classList.contains('show')) {
                    e.preventDefault();
                    this.navigateHistory('up');
                } else {
                    e.preventDefault();
                    this.navigateSuggestions('up');
                }
                break;

            case 'ArrowDown':
                if (!suggestionsEl.classList.contains('show')) {
                    e.preventDefault();
                    this.navigateHistory('down');
                } else {
                    e.preventDefault();
                    this.navigateSuggestions('down');
                }
                break;

            case 'Tab':
                e.preventDefault();
                if (this.suggestions.length > 0) {
                    this.applySuggestion(this.suggestionIndex >= 0 ? this.suggestionIndex : 0);
                }
                break;

            case 'Escape':
                suggestionsEl.classList.remove('show');
                this.suggestions = [];
                break;
        }
    }

    handleInput() {
        const input = document.getElementById('terminalInput');
        const value = input.value;

        // Generate suggestions
        this.generateSuggestions(value);
    }

    generateSuggestions(input) {
        const suggestionsEl = document.getElementById('suggestions');
        const lastWord = this.getLastWord(input);

        if (lastWord.length < 2) {
            suggestionsEl.classList.remove('show');
            return;
        }

        this.suggestions = [];
        const upperWord = lastWord.toUpperCase();

        // Match keywords
        this.keywords.forEach(keyword => {
            if (keyword.startsWith(upperWord)) {
                this.suggestions.push({ text: keyword, type: 'keyword' });
            }
        });

        // Match table names
        db.tables.forEach((table, name) => {
            if (name.startsWith(upperWord)) {
                this.suggestions.push({ text: name, type: 'table' });
            }
        });

        // Match column names from context
        const tableMatch = input.toUpperCase().match(/FROM\s+(\w+)/);
        if (tableMatch) {
            const tableName = tableMatch[1];
            if (db.tableExists(tableName)) {
                const table = db.getTable(tableName);
                table.columns.forEach(col => {
                    if (col.name.startsWith(upperWord)) {
                        this.suggestions.push({ text: col.name, type: 'column' });
                    }
                });
            }
        }

        this.displaySuggestions();
    }

    displaySuggestions() {
        const suggestionsEl = document.getElementById('suggestions');

        if (this.suggestions.length === 0) {
            suggestionsEl.classList.remove('show');
            return;
        }

        suggestionsEl.innerHTML = '';
        this.suggestions.slice(0, 10).forEach((suggestion, index) => {
            const item = document.createElement('div');
            item.className = 'suggestion-item';
            if (index === this.suggestionIndex) {
                item.classList.add('selected');
            }

            const text = document.createElement('span');
            text.className = 'suggestion-text';
            text.textContent = suggestion.text;

            const type = document.createElement('span');
            type.className = 'suggestion-type';
            type.textContent = suggestion.type;

            item.appendChild(text);
            item.appendChild(type);

            item.addEventListener('click', () => {
                this.applySuggestion(index);
            });

            suggestionsEl.appendChild(item);
        });

        suggestionsEl.classList.add('show');
    }

    navigateSuggestions(direction) {
        if (this.suggestions.length === 0) return;

        if (direction === 'up') {
            this.suggestionIndex = this.suggestionIndex <= 0 ?
                this.suggestions.length - 1 : this.suggestionIndex - 1;
        } else {
            this.suggestionIndex = this.suggestionIndex >= this.suggestions.length - 1 ?
                0 : this.suggestionIndex + 1;
        }

        this.displaySuggestions();
    }

    applySuggestion(index) {
        const input = document.getElementById('terminalInput');
        const suggestion = this.suggestions[index];

        if (!suggestion) return;

        const value = input.value;
        const lastWord = this.getLastWord(value);
        const beforeLastWord = value.substring(0, value.length - lastWord.length);

        input.value = beforeLastWord + suggestion.text + ' ';
        input.focus();

        const suggestionsEl = document.getElementById('suggestions');
        suggestionsEl.classList.remove('show');
        this.suggestions = [];
        this.suggestionIndex = -1;
    }

    getLastWord(str) {
        const words = str.trim().split(/\s+/);
        return words[words.length - 1] || '';
    }

    navigateHistory(direction) {
        const input = document.getElementById('terminalInput');

        if (direction === 'up') {
            if (this.historyIndex < this.history.length - 1) {
                if (this.historyIndex === -1) {
                    this.currentInput = input.value;
                }
                this.historyIndex++;
                input.value = this.history[this.history.length - 1 - this.historyIndex];
            }
        } else {
            if (this.historyIndex > -1) {
                this.historyIndex--;
                if (this.historyIndex === -1) {
                    input.value = this.currentInput;
                } else {
                    input.value = this.history[this.history.length - 1 - this.historyIndex];
                }
            }
        }
    }

    async executeCommand(command) {
        if (!command) return;

        // Add to history
        this.history.push(command);
        this.historyIndex = -1;

        // Display command
        this.appendOutput(`<div class="command-echo">
            <span class="command-prompt">SQL&gt;</span>
            <span class="command-text">${this.escapeHtml(command)}</span>
        </div>`);

        // Special commands
        const upperCommand = command.toUpperCase().trim();
        if (upperCommand === 'CLEAR' || upperCommand === 'CLS') {
            this.clearTerminal();
            return;
        }

        if (upperCommand === 'HELP') {
            this.showHelp();
            return;
        }

        if (upperCommand === 'TUTORIAL') {
            this.showTutorial();
            return;
        }

        // Execute SQL
        const startTime = performance.now();
        try {
            const result = await engine.execute(command);
            const endTime = performance.now();
            const execTime = ((endTime - startTime) / 1000).toFixed(3);

            this.displayResult(result);
            this.updateStatus('Query executed', `${result.rowCount || 0} rows`, execTime);
        } catch (error) {
            const endTime = performance.now();
            const execTime = ((endTime - startTime) / 1000).toFixed(3);

            this.displayError(error.message);
            this.updateStatus('Error', '', execTime);
        }

        // Scroll to bottom
        const output = document.getElementById('terminalOutput');
        output.scrollTop = output.scrollHeight;
    }

    displayResult(result) {
        if (result.rows && result.rows.length > 0) {
            // Table result
            this.displayTable(result.columns, result.rows);
        } else if (result.message) {
            // Success message
            this.appendOutput(`<div class="success-message">${result.message}</div>`);
        }
    }

    displayTable(columns, rows) {
        let html = '<div class="sql-table"><table>';

        // Header
        html += '<tr>';
        columns.forEach(col => {
            html += `<th>${this.escapeHtml(String(col))}</th>`;
        });
        html += '</tr>';

        // Rows
        rows.forEach(row => {
            html += '<tr>';
            columns.forEach(col => {
                let value = row[col];
                if (value === null || value === undefined) {
                    value = 'NULL';
                } else if (value instanceof Date) {
                    value = value.toISOString().split('T')[0];
                } else {
                    value = String(value);
                }
                html += `<td>${this.escapeHtml(value)}</td>`;
            });
            html += '</tr>';
        });

        html += '</table></div>';
        html += `<div class="info-message">${rows.length} row(s) selected.</div>`;

        this.appendOutput(html);
    }

    displayError(message) {
        this.appendOutput(`<div class="error-message">${this.escapeHtml(message)}</div>`);
    }

    appendOutput(html) {
        const output = document.getElementById('terminalOutput');
        const block = document.createElement('div');
        block.className = 'command-block';
        block.innerHTML = html;
        output.appendChild(block);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    clearTerminal() {
        const output = document.getElementById('terminalOutput');
        const welcome = output.querySelector('.welcome-message');
        output.innerHTML = '';
        if (welcome) {
            output.appendChild(welcome);
        }
        this.updateStatus('Terminal cleared', '');
    }

    async resetDatabase() {
        if (!confirm('Are you sure you want to reset the database? All data will be lost.')) {
            return;
        }

        await db.resetDatabase();
        await DataSeeder.seedDatabase();

        this.appendOutput(`<div class="success-message">Database has been reset successfully.</div>`);
        this.updateStatus('Database reset', db.tables.size + ' tables loaded');
    }

    showHelp() {
        const helpText = `
            <div class="info-message">
                <strong>Oracle SQL Terminal Simulator - Help</strong><br><br>

                <strong>Special Commands:</strong><br>
                HELP or help - Show this help message<br>
                TUTORIAL or tutorial - Open the interactive tutorial<br>
                CLEAR or CLS - Clear the terminal screen<br>
                DESC table_name - Describe table structure<br><br>

                <strong>Common SQL Commands:</strong><br>
                SELECT - Query data from tables<br>
                INSERT INTO - Insert new rows<br>
                UPDATE - Modify existing rows<br>
                DELETE FROM - Remove rows<br>
                CREATE TABLE - Create a new table<br>
                DROP TABLE - Delete a table<br>
                CREATE SEQUENCE - Create a sequence<br>
                TRUNCATE TABLE - Remove all rows from a table<br><br>

                <strong>System Tables:</strong><br>
                ALL_TABLES - View all tables in the database<br>
                ALL_TAB_COLS - View all columns in all tables<br>
                USER_SEQUENCES - View all sequences<br><br>

                <strong>Examples:</strong><br>
                SELECT * FROM CUSTOMERS;<br>
                SELECT * FROM ALL_TABLES;<br>
                DESC PRODUCTS;<br>
                INSERT INTO CUSTOMERS (CUSTOMER_ID, FIRST_NAME, LAST_NAME, EMAIL, REGISTRATION_DATE)
                VALUES (CUSTOMER_SEQ.NEXTVAL, 'John', 'Doe', 'john@example.com', SYSDATE);<br><br>

                <strong>Features:</strong><br>
                - Use UP/DOWN arrows to navigate command history<br>
                - TAB for autocomplete suggestions<br>
                - All data is persisted in IndexedDB<br>
                - Full Oracle SQL dialect support<br>
            </div>
        `;
        this.appendOutput(helpText);
    }

    showTutorial() {
        const panel = document.getElementById('tutorialPanel');
        panel.classList.remove('hidden');
        this.updateTutorialContent();
    }

    hideTutorial() {
        const panel = document.getElementById('tutorialPanel');
        panel.classList.add('hidden');
    }

    previousLesson() {
        if (tutorial.prevLesson()) {
            this.updateTutorialContent();
        }
    }

    nextLesson() {
        if (tutorial.nextLesson()) {
            this.updateTutorialContent();
        }
    }

    updateTutorialContent() {
        const lesson = tutorial.getCurrentLesson();
        const textEl = document.getElementById('tutorialText');
        const indicatorEl = document.getElementById('lessonIndicator');
        const prevBtn = document.getElementById('prevLessonBtn');
        const nextBtn = document.getElementById('nextLessonBtn');

        textEl.innerHTML = lesson.content;
        indicatorEl.textContent = `Lesson ${tutorial.getCurrentLessonNumber()} of ${tutorial.getTotalLessons()}`;

        prevBtn.disabled = tutorial.currentLesson === 0;
        nextBtn.disabled = tutorial.currentLesson === tutorial.getTotalLessons() - 1;
    }

    updateStatus(status, info, execTime) {
        document.getElementById('statusText').textContent = status;
        if (info) {
            document.getElementById('rowCount').textContent = info;
        }
        if (execTime) {
            document.getElementById('execTime').textContent = execTime + 's';
        }
    }
}

// Initialize terminal when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.terminal = new Terminal();
});
