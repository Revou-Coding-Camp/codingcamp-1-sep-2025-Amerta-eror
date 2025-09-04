document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Element Selectors ---
    const todoForm = document.querySelector('.todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoDateInput = document.getElementById('todo-date');
    const todoList = document.querySelector('.todo-list');
    const filterSelect = document.getElementById('filter-todos');
    const deleteAllBtn = document.getElementById('delete-all-btn');
    const noTaskMessage = document.querySelector('.no-task-message');

    // --- State Management ---
    // Load todos from Local Storage or initialize an empty array
    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    // --- Functions ---

    /**
     * Saves the current `todos` array to Local Storage.
     */
    const saveTodos = () => {
        localStorage.setItem('todos', JSON.stringify(todos));
    };

    /**
     * Renders the todos from the `todos` array to the DOM.
     */
    const renderTodos = () => {
        todoList.innerHTML = ''; // Clear the list before rendering

        if (todos.length === 0) {
            noTaskMessage.classList.remove('hidden');
        } else {
            noTaskMessage.classList.add('hidden');
        }

        const filteredTodos = getFilteredTodos();

        filteredTodos.forEach(todo => {
            const todoItem = document.createElement('li');
            todoItem.classList.add('todo-item');
            todoItem.dataset.id = todo.id;

            // Add completion and status classes
            todoItem.classList.toggle('completed', todo.completed);
            todoItem.classList.add(todo.completed ? 'completed' : 'incomplete');


            todoItem.innerHTML = `
                <span class="task-text">${todo.text}</span>
                <span class="task-date">${todo.dueDate}</span>
                <span class="task-status">${todo.completed ? 'Completed' : 'Incomplete'}</span>
                <div class="item-actions">
                    <button class="action-btn complete-btn" aria-label="Mark as complete">
                        <i class="fas ${todo.completed ? 'fa-undo' : 'fa-check'}"></i>
                    </button>
                    <button class="action-btn delete-btn" aria-label="Delete task">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            todoList.appendChild(todoItem);
        });
    };
    
    /**
     * Filters todos based on the current filter selection.
     * @returns {Array} The filtered list of todos.
     */
    const getFilteredTodos = () => {
        const filterValue = filterSelect.value;
        switch (filterValue) {
            case 'completed':
                return todos.filter(todo => todo.completed);
            case 'incomplete':
                return todos.filter(todo => !todo.completed);
            default: // 'all'
                return todos;
        }
    };


    /**
     * Handles the form submission to add a new todo.
     * @param {Event} e - The form submission event.
     */
    const addTodo = (e) => {
        e.preventDefault();
        const todoText = todoInput.value.trim();
        const todoDate = todoDateInput.value;

        // --- Input Validation ---
        if (todoText === '') {
            alert('Please enter a task.');
            return;
        }
        if (todoDate === '') {
            alert('Please select a due date.');
            return;
        }

        const newTodo = {
            id: Date.now(), // Unique ID based on timestamp
            text: todoText,
            dueDate: todoDate,
            completed: false,
        };

        todos.push(newTodo);
        saveTodos();
        renderTodos();

        // Clear input fields
        todoInput.value = '';
        todoDateInput.value = '';
    };

    /**
     * Handles clicks on the todo list for completing or deleting tasks.
     * @param {Event} e - The click event.
     */
    const handleListClick = (e) => {
        const item = e.target.closest('.todo-item');
        if (!item) return;

        const todoId = Number(item.dataset.id);

        // Handle complete/uncomplete
        if (e.target.closest('.complete-btn')) {
            todos = todos.map(todo =>
                todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
            );
        }

        // Handle delete
        if (e.target.closest('.delete-btn')) {
            todos = todos.filter(todo => todo.id !== todoId);
        }

        saveTodos();
        renderTodos();
    };

    /**
     * Deletes all todos from the list.
     */
    const deleteAllTodos = () => {
        if (confirm('Are you sure you want to delete all tasks?')) {
            todos = [];
            saveTodos();
            renderTodos();
        }
    };

    // --- Event Listeners ---
    todoForm.addEventListener('submit', addTodo);
    todoList.addEventListener('click', handleListClick);
    deleteAllBtn.addEventListener('click', deleteAllTodos);
    filterSelect.addEventListener('change', renderTodos);

    // --- Initial Render ---
    // Render todos on initial page load
    renderTodos();
});