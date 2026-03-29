import {
  addTask,
  toggleTask,
  clearCompleted,
  getStats
} from "./taskUtils.js";

const STORAGE_KEY = "lab3_tasks";

const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const errorBox = document.getElementById("error");
const taskList = document.getElementById("task-list");
const totalCount = document.getElementById("total-count");
const completedCount = document.getElementById("completed-count");
const progressCount = document.getElementById("progress-count");
const clearCompletedBtn = document.getElementById("clear-completed-btn");
const appStatus = document.getElementById("app-status");

appStatus.textContent = import.meta.env.VITE_APP_STATUS;

function loadTasks() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

let tasks = loadTasks();

function renderStats() {
  const stats = getStats(tasks);
  totalCount.textContent = stats.total;
  completedCount.textContent = stats.completed;
  progressCount.textContent = `${stats.progress}%`;
}

function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach((task) => {
    const li = document.createElement("li");

    const title = document.createElement("span");
    title.textContent = task.title;
    title.className = task.completed ? "done" : "";

    const actions = document.createElement("div");
    actions.className = "actions";

    const toggleBtn = document.createElement("button");
    toggleBtn.textContent = task.completed ? "Скасувати" : "Виконати";
    toggleBtn.dataset.testid = `toggle-${task.id}`;
    toggleBtn.addEventListener("click", () => {
      tasks = toggleTask(tasks, task.id);
      saveTasks();
      render();
    });

    actions.appendChild(toggleBtn);
    li.appendChild(title);
    li.appendChild(actions);
    taskList.appendChild(li);
  });
}

function render() {
  renderTasks();
  renderStats();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const result = addTask(tasks, input.value);
  tasks = result.tasks;
  errorBox.textContent = result.error;

  if (!result.error) {
    input.value = "";
    saveTasks();
  }

  render();
});

clearCompletedBtn.addEventListener("click", () => {
  tasks = clearCompleted(tasks);
  saveTasks();
  render();
});

render();