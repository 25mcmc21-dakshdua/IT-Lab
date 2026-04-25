let tasks = [];
let currentFilter = 'all';

const taskInput = document.getElementById('taskInput');
const dateInput = document.getElementById('dateInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const filterBtns = document.querySelectorAll('.filter-btn');

dateInput.value = new Date().toISOString().split('T')[0];

const render = () => {
    taskList.innerHTML = '';

    const filtered = tasks.filter(t => {
        if (currentFilter === 'completed') return t.done;
        if (currentFilter === 'pending') return !t.done;
        return true;
    }).sort((a, b) => new Date(a.date) - new Date(b.date));

    filtered.forEach(t => {
        const isOverdue = !t.done && new Date(t.date) < new Date().setHours(0, 0, 0, 0);
        
        const taskEl = document.createElement('div');
        taskEl.className = `task ${t.done ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}`;
        
        taskEl.innerHTML = `
            <div class="task-info">
                <strong>${t.text}</strong><br>
                <small>Due: ${t.date}</small>
            </div>
            <div class="actions">
                <button onclick="toggleTask(${t.id})">${t.done ? 'Undo' : 'Done'}</button>
                <button onclick="deleteTask(${t.id})">Delete</button>
            </div>
        `;
        taskList.appendChild(taskEl);
    });
};

const addTask = () => {
    const text = taskInput.value.trim();
    const date = dateInput.value;

    if (!text || !date) {
        alert("Please enter both a task and a date.");
        return;
    }

    tasks.push({
        id: Date.now(),
        text,
        date,
        done: false
    });

    taskInput.value = '';
    render();
};

window.toggleTask = (id) => {
    tasks = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
    render();
};

window.deleteTask = (id) => {
    tasks = tasks.filter(t => t.id !== id);
    render();
};

addBtn.addEventListener('click', addTask);

filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        filterBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        currentFilter = e.target.dataset.filter;
        render();
    });
});