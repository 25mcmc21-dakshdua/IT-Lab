// Define task status using Enum
var TaskStatus;
(function (TaskStatus) {
    TaskStatus["Pending"] = "pending";
    TaskStatus["Completed"] = "completed";
})(TaskStatus || (TaskStatus = {}));
// Task class to encapsulate properties and methods
var Task = /** @class */ (function () {
    function Task(id, text, date, status) {
        if (status === void 0) { status = TaskStatus.Pending; }
        this.id = id;
        this.text = text;
        this.date = date;
        this.status = status;
    }
    Task.prototype.toggleStatus = function () {
        this.status = this.status === TaskStatus.Pending ? TaskStatus.Completed : TaskStatus.Pending;
    };
    Task.prototype.isOverdue = function () {
        if (this.status === TaskStatus.Completed)
            return false;
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        var taskDate = new Date(this.date);
        return taskDate < today;
    };
    return Task;
}());
// Main application class
var TodoApp = /** @class */ (function () {
    function TodoApp() {
        this.tasks = [];
        this.currentFilter = 'all';
        this.initializeElements();
        this.setupEventListeners();
        this.setDefaultDate();
        this.render();
    }
    TodoApp.prototype.initializeElements = function () {
        this.taskInput = document.getElementById('taskInput');
        this.dateInput = document.getElementById('dateInput');
        this.addBtn = document.getElementById('addBtn');
        this.taskList = document.getElementById('taskList');
        this.filterBtns = document.querySelectorAll('.filter-btn');
    };
    TodoApp.prototype.setDefaultDate = function () {
        var today = new Date().toISOString().split('T')[0];
        this.dateInput.value = today;
    };
    TodoApp.prototype.setupEventListeners = function () {
        var _this = this;
        this.addBtn.addEventListener('click', function () { return _this.addTask(); });
        this.filterBtns.forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                var target = e.target;
                _this.filterBtns.forEach(function (b) { return b.classList.remove('active'); });
                target.classList.add('active');
                _this.currentFilter = target.dataset.filter;
                _this.render();
            });
        });
        // Allow adding task with Enter key
        this.taskInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                _this.addTask();
            }
        });
    };
    TodoApp.prototype.addTask = function () {
        var text = this.taskInput.value.trim();
        var date = this.dateInput.value;
        if (!text || !date) {
            alert("Please enter both a task and a date.");
            return;
        }
        var newTask = new Task(Date.now(), text, date);
        this.tasks.push(newTask);
        this.taskInput.value = '';
        this.taskInput.focus();
        this.render();
    };
    TodoApp.prototype.toggleTask = function (id) {
        var task = this.tasks.find(function (t) { return t.id === id; });
        if (task) {
            task.toggleStatus();
            this.render();
        }
    };
    TodoApp.prototype.deleteTask = function (id) {
        this.tasks = this.tasks.filter(function (t) { return t.id !== id; });
        this.render();
    };
    TodoApp.prototype.render = function () {
        var _this = this;
        this.taskList.innerHTML = '';
        // Filter tasks based on current filter
        var filteredTasks = this.tasks.filter(function (task) {
            if (_this.currentFilter === 'completed')
                return task.status === TaskStatus.Completed;
            if (_this.currentFilter === 'pending')
                return task.status === TaskStatus.Pending;
            return true; // 'all' filter
        }).sort(function (a, b) { return new Date(a.date).getTime() - new Date(b.date).getTime(); });
        // Create task elements
        filteredTasks.forEach(function (task) {
            var isOverdue = task.isOverdue();
            var isCompleted = task.status === TaskStatus.Completed;
            var taskEl = document.createElement('div');
            taskEl.className = "task ".concat(isCompleted ? 'completed' : '', " ").concat(isOverdue ? 'overdue' : '');
            taskEl.innerHTML = "\n                <div class=\"task-info\">\n                    <strong>".concat(task.text, "</strong><br>\n                    <small>Due: ").concat(task.date, "</small>\n                </div>\n                <div class=\"actions\">\n                    <button class=\"toggle-btn\">").concat(isCompleted ? 'Undo' : 'Done', "</button>\n                    <button class=\"delete-btn\">Delete</button>\n                </div>\n            ");
            // Add event listeners to buttons
            var toggleBtn = taskEl.querySelector('.toggle-btn');
            var deleteBtn = taskEl.querySelector('.delete-btn');
            toggleBtn.addEventListener('click', function () { return _this.toggleTask(task.id); });
            deleteBtn.addEventListener('click', function () { return _this.deleteTask(task.id); });
            _this.taskList.appendChild(taskEl);
        });
    };
    return TodoApp;
}());
// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    new TodoApp();
});
