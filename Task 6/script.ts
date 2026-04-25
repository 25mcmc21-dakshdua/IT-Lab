// Define task status using Enum
enum TaskStatus {
    Pending = 'pending',
    Completed = 'completed'
}

// Define TypeScript interface for Task
interface ITask {
    id: number;
    text: string;
    date: string;
    status: TaskStatus;
}

// Task class to encapsulate properties and methods
class Task implements ITask {
    id: number;
    text: string;
    date: string;
    status: TaskStatus;

    constructor(id: number, text: string, date: string, status: TaskStatus = TaskStatus.Pending) {
        this.id = id;
        this.text = text;
        this.date = date;
        this.status = status;
    }

    toggleStatus(): void {
        this.status = this.status === TaskStatus.Pending ? TaskStatus.Completed : TaskStatus.Pending;
    }

    isOverdue(): boolean {
        if (this.status === TaskStatus.Completed) return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const taskDate = new Date(this.date);
        return taskDate < today;
    }
}

// Type for filter options
type FilterOption = 'all' | 'pending' | 'completed';

// Main application class
class TodoApp {
    private tasks: Task[] = [];
    private currentFilter: FilterOption = 'all';

    private taskInput: HTMLInputElement;
    private dateInput: HTMLInputElement;
    private addBtn: HTMLButtonElement;
    private taskList: HTMLDivElement;
    private filterBtns: NodeListOf<HTMLButtonElement>;

    constructor() {
        this.initializeElements();
        this.setupEventListeners();
        this.setDefaultDate();
        this.render();
    }

    private initializeElements(): void {
        this.taskInput = document.getElementById('taskInput') as HTMLInputElement;
        this.dateInput = document.getElementById('dateInput') as HTMLInputElement;
        this.addBtn = document.getElementById('addBtn') as HTMLButtonElement;
        this.taskList = document.getElementById('taskList') as HTMLDivElement;
        this.filterBtns = document.querySelectorAll('.filter-btn');
    }

    private setDefaultDate(): void {
        const today = new Date().toISOString().split('T')[0];
        this.dateInput.value = today;
    }

    private setupEventListeners(): void {
        this.addBtn.addEventListener('click', () => this.addTask());
        
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.target as HTMLButtonElement;
                this.filterBtns.forEach(b => b.classList.remove('active'));
                target.classList.add('active');
                this.currentFilter = target.dataset.filter as FilterOption;
                this.render();
            });
        });

        // Allow adding task with Enter key
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTask();
            }
        });
    }

    private addTask(): void {
        const text = this.taskInput.value.trim();
        const date = this.dateInput.value;

        if (!text || !date) {
            alert("Please enter both a task and a date.");
            return;
        }

        const newTask = new Task(Date.now(), text, date);
        this.tasks.push(newTask);
        
        this.taskInput.value = '';
        this.taskInput.focus();
        this.render();
    }

    private toggleTask(id: number): void {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.toggleStatus();
            this.render();
        }
    }

    private deleteTask(id: number): void {
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.render();
    }

    private render(): void {
        this.taskList.innerHTML = '';

        // Filter tasks based on current filter
        const filteredTasks = this.tasks.filter(task => {
            if (this.currentFilter === 'completed') return task.status === TaskStatus.Completed;
            if (this.currentFilter === 'pending') return task.status === TaskStatus.Pending;
            return true; // 'all' filter
        }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        // Create task elements
        filteredTasks.forEach(task => {
            const isOverdue = task.isOverdue();
            const isCompleted = task.status === TaskStatus.Completed;
            
            const taskEl = document.createElement('div');
            taskEl.className = `task ${isCompleted ? 'completed' : ''} ${isOverdue ? 'overdue' : ''}`;
            
            taskEl.innerHTML = `
                <div class="task-info">
                    <strong>${task.text}</strong><br>
                    <small>Due: ${task.date}</small>
                </div>
                <div class="actions">
                    <button class="toggle-btn">${isCompleted ? 'Undo' : 'Done'}</button>
                    <button class="delete-btn">Delete</button>
                </div>
            `;
            
            // Add event listeners to buttons
            const toggleBtn = taskEl.querySelector('.toggle-btn') as HTMLButtonElement;
            const deleteBtn = taskEl.querySelector('.delete-btn') as HTMLButtonElement;
            
            toggleBtn.addEventListener('click', () => this.toggleTask(task.id));
            deleteBtn.addEventListener('click', () => this.deleteTask(task.id));
            
            this.taskList.appendChild(taskEl);
        });
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});