import * as Sentry from "@sentry/browser";

Sentry.init({
  dsn: "https://6945c468729841a04d0aa486359c585f@o4511288290705408.ingest.de.sentry.io/4511288343724112",
  integrations: [Sentry.browserTracingIntegration()],
  tracesSampleRate: 1.0,
  environment: "development",
  debug: true,
});

Sentry.setUser({
  id: "123",
  email: "student@example.com",
  segment: "student",
});

Sentry.captureMessage("Sentry connected successfully");

window.posthog = posthog;

import posthog from "posthog-js";

import { addTask, toggleTask, clearCompleted, getStats } from "./taskUtils.js";

const STORAGE_KEY = "lab3_tasks";

posthog.init("phc_o4NGrgtFhyvqJmseDDyA66ArVCAngAYkALNM5TkWpGkC", {
  api_host: "https://eu.i.posthog.com",
  person_profiles: "identified_only",
  debug: true,
});
posthog.capture("task_completed", {
  time_to_complete_seconds: 120,
});
posthog.capture("task_deleted", {
  reason: "mistake",
});

const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const errorBox = document.getElementById("error");
const taskList = document.getElementById("task-list");
const totalCount = document.getElementById("total-count");
const completedCount = document.getElementById("completed-count");
const progressCount = document.getElementById("progress-count");
const clearCompletedBtn = document.getElementById("clear-completed-btn");
const urgentBtn = document.getElementById("urgent-btn");
const appStatus = document.getElementById("app-status");
const errorBtn = document.getElementById("error-btn");

errorBtn.addEventListener("click", async () => {
  const error = new Error("Sentry Test Error!");

  Sentry.captureException(error);
  await Sentry.flush(2000);

  throw error;
});

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
      const wasCompleted = task.completed;

      tasks = toggleTask(tasks, task.id);

      posthog.capture(wasCompleted ? "task_uncompleted" : "task_completed", {
        task_id: task.id,
        task_title_length: task.title.length,
      });

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

  const taskTitle = input.value;
  const beforeCount = tasks.length;

  const result = addTask(tasks, taskTitle);
  tasks = result.tasks;
  errorBox.textContent = result.error;

  if (!result.error) {
    posthog.capture("task_created", {
      title_length: taskTitle.trim().length,
      total_tasks_after_create: tasks.length,
      is_authenticated: false,
    });

    input.value = "";
    saveTasks();
  } else {
    posthog.capture("task_create_error", {
      error_message: result.error,
      title_length: taskTitle.trim().length,
      total_tasks_before_create: beforeCount,
    });
  }

  render();
});

clearCompletedBtn.addEventListener("click", () => {
  const completedBeforeClear = tasks.filter((task) => task.completed).length;

  tasks = clearCompleted(tasks);

  posthog.capture("task_deleted", {
    reason: "clear_completed",
    deleted_count: completedBeforeClear,
    total_tasks_after_delete: tasks.length,
  });

  saveTasks();
  render();
});

posthog.onFeatureFlags(() => {
  if (posthog.isFeatureEnabled("show-urgent-filter")) {
    urgentBtn.style.display = "inline-block";

    posthog.capture("urgent_filter_shown", {
      source: "feature_flag",
    });
  } else {
    urgentBtn.style.display = "none";
  }
});

urgentBtn.addEventListener("click", () => {
  posthog.capture("urgent_filter_clicked", {
    total_tasks: tasks.length,
  });

  alert("Фільтр термінових задач активовано");
});

render();
