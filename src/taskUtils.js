export function normalizeTaskTitle(title) {
  return title.trim().replace(/\s+/g, " ");
}

export function validateTaskTitle(title) {
  const normalized = normalizeTaskTitle(title);

  if (!normalized) {
    return "Назва задачі не може бути порожньою";
  }

  if (normalized.length < 3) {
    return "Назва задачі має містити мінімум 3 символи";
  }

  return "";
}

export function createTask(title) {
  return {
    id: Date.now() + Math.random(),
    title: normalizeTaskTitle(title),
    completed: false
  };
}

export function addTask(tasks, title) {
  const error = validateTaskTitle(title);

  if (error) {
    return { tasks, error };
  }

  const normalized = normalizeTaskTitle(title);
  const alreadyExists = tasks.some(
    (task) => task.title.toLowerCase() === normalized.toLowerCase()
  );

  if (alreadyExists) {
    return { tasks, error: "Така задача вже існує" };
  }

  return {
    tasks: [...tasks, createTask(normalized)],
    error: ""
  };
}

export function toggleTask(tasks, id) {
  return tasks.map((task) =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
}

export function clearCompleted(tasks) {
  return tasks.filter((task) => !task.completed);
}

export function getStats(tasks) {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  return { total, completed, progress };
}