// ============================================
// TODO APP - LOCAL STORAGE FUNCTIONALITY
// ============================================

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

// State Management
const appState = {
    todos: [],
    currentFilter: 'all',
};

// ============================================
// INITIALIZATION
// ============================================

function initializeApp() {
    loadTodosFromStorage();
    attachEventListeners();
    renderTodos();
    updateStats();
}

// ============================================
// EVENT LISTENERS
// ============================================

function attachEventListeners() {
    // Input handling
    const todoInput = document.getElementById('todoInput');
    const addBtn = document.getElementById('addBtn');

    addBtn.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTodo();
    });

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            appState.currentFilter = e.target.dataset.filter;
            renderTodos();
        });
    });

    // Action buttons
    document.getElementById('clearCompletedBtn').addEventListener('click', clearCompleted);
    document.getElementById('deleteAllBtn').addEventListener('click', deleteAll);
}

// ============================================
// TODO OPERATIONS
// ============================================

function addTodo() {
    const input = document.getElementById('todoInput');
    const text = input.value.trim();

    if (!text) {
        alert('Please enter a task');
        return;
    }

    const newTodo = {
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: new Date().toLocaleString(),
    };

    appState.todos.push(newTodo);
    saveTodosToStorage();
    renderTodos();
    updateStats();
    input.value = '';
    input.focus();
}

function toggleTodo(id) {
    const todo = appState.todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveTodosToStorage();
        renderTodos();
        updateStats();
    }
}

function editTodo(id) {
    const todo = appState.todos.find(t => t.id === id);
    if (!todo) return;

    const newText = prompt('Edit task:', todo.text);
    if (newText && newText.trim()) {
        todo.text = newText.trim();
        saveTodosToStorage();
        renderTodos();
    }
}

function deleteTodo(id) {
    const index = appState.todos.findIndex(t => t.id === id);
    if (index > -1) {
        const todoItem = document.querySelector(`[data-id="${id}"]`);
        todoItem.classList.add('removing');
        
        setTimeout(() => {
            appState.todos.splice(index, 1);
            saveTodosToStorage();
            renderTodos();
            updateStats();
        }, 300);
    }
}

function clearCompleted() {
    if (appState.todos.some(t => t.completed)) {
        if (confirm('Delete all completed tasks?')) {
            appState.todos = appState.todos.filter(t => !t.completed);
            saveTodosToStorage();
            renderTodos();
            updateStats();
        }
    }
}

function deleteAll() {
    if (appState.todos.length > 0) {
        if (confirm('Delete ALL tasks? This cannot be undone.')) {
            appState.todos = [];
            saveTodosToStorage();
            renderTodos();
            updateStats();
        }
    }
}

// ============================================
// RENDERING
// ============================================

function renderTodos() {
    const todoList = document.getElementById('todoList');
    const emptyState = document.getElementById('emptyState');
    
    // Filter todos based on current filter
    let filteredTodos = appState.todos;
    if (appState.currentFilter === 'active') {
        filteredTodos = appState.todos.filter(t => !t.completed);
    } else if (appState.currentFilter === 'completed') {
        filteredTodos = appState.todos.filter(t => t.completed);
    }

    // Clear list
    todoList.innerHTML = '';

    // Show empty state or render todos
    if (filteredTodos.length === 0) {
        emptyState.classList.add('show');
    } else {
        emptyState.classList.remove('show');
        
        filteredTodos.forEach(todo => {
            const li = createTodoElement(todo);
            todoList.appendChild(li);
        });
    }
}

function createTodoElement(todo) {
    const li = document.createElement('li');
    li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
    li.dataset.id = todo.id;

    li.innerHTML = `
        <input 
            type="checkbox" 
            class="checkbox" 
            ${todo.completed ? 'checked' : ''}
            onchange="toggleTodo(${todo.id})"
        >
        <span class="todo-text">${escapeHtml(todo.text)}</span>
        <div class="todo-actions">
            <button class="edit-btn" onclick="editTodo(${todo.id})" title="Edit">✏️</button>
            <button class="delete-btn" onclick="deleteTodo(${todo.id})" title="Delete">🗑️</button>
        </div>
    `;

    return li;
}

// ============================================
// STATISTICS
// ============================================

function updateStats() {
    const total = appState.todos.length;
    const active = appState.todos.filter(t => !t.completed).length;
    const completed = appState.todos.filter(t => t.completed).length;

    document.getElementById('totalCount').textContent = total;
    document.getElementById('activeCount').textContent = active;
    document.getElementById('completedCount').textContent = completed;

    // Disable buttons if no tasks
    document.getElementById('clearCompletedBtn').disabled = completed === 0;
    document.getElementById('deleteAllBtn').disabled = total === 0;
}

// ============================================
// LOCAL STORAGE
// ============================================

function saveTodosToStorage() {
    localStorage.setItem('todos', JSON.stringify(appState.todos));
    console.log('✅ Todos saved to local storage');
}

function loadTodosFromStorage() {
    const stored = localStorage.getItem('todos');
    if (stored) {
        try {
            appState.todos = JSON.parse(stored);
            console.log('✅ Todos loaded from local storage');
        } catch (error) {
            console.error('Error parsing stored todos:', error);
            appState.todos = [];
        }
    }
}

// ============================================
// UTILITIES
// ============================================

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
