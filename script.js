class ToDoApp {
    constructor() {
      this.taskInput = document.getElementById('taskInput');
      this.addTaskBtn = document.getElementById('addTaskBtn');
      this.clearCompletedBtn = document.getElementById('clearCompletedBtn');
      this.taskSections = {
        'To Do': document.getElementById('todoList'),
        'In Process': document.getElementById('inProcessList'),
        'Completed': document.getElementById('completedList')
      };
      this.tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  
      this.addTaskBtn.addEventListener('click', () => this.addTask());
      this.clearCompletedBtn.addEventListener('click', () => this.clearCompletedTasks());
      this.loadTasks();
    }
  
    saveTasks() {
      localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }
  
    loadTasks() {
      this.tasks.forEach(task => this.renderTask(task));
    }
  
    addTask() {
      const taskText = this.taskInput.value.trim();
      if (!taskText) return;
  
      const task = { id: Date.now().toString(), text: taskText, status: 'To Do' };
      this.tasks.push(task);
      this.renderTask(task);
      this.saveTasks();
      this.taskInput.value = '';
    }
  
    renderTask(task) {
      const listItem = document.createElement('li');
      listItem.textContent = task.text;
  
      const moveBtn = document.createElement('button');
      moveBtn.textContent = 'Move';
      moveBtn.classList.add('move-btn');
      moveBtn.addEventListener('click', () => this.moveTask(task));
  
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete';
      deleteBtn.classList.add('delete-btn');
      deleteBtn.addEventListener('click', () => this.deleteTask(task));
  
      listItem.appendChild(moveBtn);
      listItem.appendChild(deleteBtn);
  
      this.taskSections[task.status].appendChild(listItem);
    }
  
    moveTask(task) {
      this.deleteTask(task, false); 
  
      if (task.status === 'To Do') {
        task.status = 'In Process';
      } else if (task.status === 'In Process') {
        task.status = 'Completed';
      } else {
        task.status = 'To Do';
      }
  
      this.renderTask(task);
      this.saveTasks();
    }
  
    deleteTask(task, removeFromArray = true) {
      if (removeFromArray) {
        const isConfirmed = window.confirm(`Are you sure you want to delete "${task.text}"?`);
        if (!isConfirmed) return;
      }
  
      const taskSection = this.taskSections[task.status];
      const taskElement = Array.from(taskSection.children).find(el => el.textContent.includes(task.text));
  
      if (taskElement) taskSection.removeChild(taskElement);
  
      if (removeFromArray) {
        this.tasks = this.tasks.filter(t => t.id !== task.id);
        this.saveTasks();
      }
    }
  
    clearCompletedTasks() {
      this.tasks = this.tasks.filter(task => task.status !== 'Completed');
      this.saveTasks();
      this.taskSections['Completed'].innerHTML = '';
    }
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    new ToDoApp();
  });
  