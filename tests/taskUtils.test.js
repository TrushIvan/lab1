import { describe, it, expect } from "vitest";
import {
  normalizeTaskTitle,
  validateTaskTitle,
  addTask,
  toggleTask,
  clearCompleted,
  getStats
} from "../src/taskUtils.js";

describe("taskUtils", () => {
  it("normalizeTaskTitle прибирає зайві пробіли", () => {
    expect(normalizeTaskTitle("   Test    task   ")).toBe("Test task");
  });

  it("validateTaskTitle повертає помилку для порожнього рядка", () => {
    expect(validateTaskTitle("   ")).toBe("Назва задачі не може бути порожньою");
  });

  it("validateTaskTitle повертає помилку для короткої назви", () => {
    expect(validateTaskTitle("ab")).toBe("Назва задачі має містити мінімум 3 символи");
  });

  it("addTask додає нову задачу", () => {
    const result = addTask([], "Нова задача");
    expect(result.error).toBe("");
    expect(result.tasks).toHaveLength(1);
    expect(result.tasks[0].title).toBe("Нова задача");
    expect(result.tasks[0].completed).toBe(false);
  });

  it("addTask не додає дубльовану задачу", () => {
    const tasks = [{ id: 1, title: "Task One", completed: false }];
    const result = addTask(tasks, "task one");

    expect(result.tasks).toHaveLength(1);
    expect(result.error).toBe("Така задача вже існує");
  });

  it("toggleTask змінює completed у задачі", () => {
    const tasks = [{ id: 1, title: "Task", completed: false }];
    const updated = toggleTask(tasks, 1);

    expect(updated[0].completed).toBe(true);
  });

  it("clearCompleted видаляє виконані задачі та getStats рахує статистику", () => {
    const tasks = [
      { id: 1, title: "A", completed: true },
      { id: 2, title: "B", completed: false },
      { id: 3, title: "C", completed: true }
    ];

    const filtered = clearCompleted(tasks);
    const stats = getStats(tasks);

    expect(filtered).toHaveLength(1);
    expect(filtered[0].title).toBe("B");

    expect(stats.total).toBe(4);
    expect(stats.completed).toBe(2);
    expect(stats.progress).toBe(67);
  });
});