import {
  addTask,
  toggleTask,
  clearCompleted,
  getStats
} from "./taskUtils.js";

const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const errorBox = document.getElementById("error");
const taskList = document.getElementById("task-list");
const totalCount = document.getElementById("total-count");
const completedCount = document.getElementById("completed-count");
const progressCount = document.getElementById("progress-count");
const clearCompletedBtn = document.getElementById("clear-completed-btn");

let tasks = [];

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
  }

  render();
});

clearCompletedBtn.addEventListener("click", () => {
  tasks = clearCompleted(tasks);
  render();
});

render();