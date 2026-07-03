import { describe, it, expect } from "vitest";
import {
  sortTasks,
  filterTasks,
  getTaskStats,
} from "~~/server/services/taskService";
import type { Task } from "~~/server/db/schema";

function makeTask(overrides: Partial<Task> = {}): Task {
  return {
    id: 1,
    userId: 1,
    title: "Test task",
    description: null,
    completed: false,
    priority: "medium",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    ...overrides,
  };
}

describe("sortTasks", () => {
  it("puts incomplete tasks before completed ones", () => {
    const tasks = [
      makeTask({ id: 1, completed: true }),
      makeTask({ id: 2, completed: false }),
    ];
    const result = sortTasks(tasks);
    expect(result[0].id).toBe(2);
    expect(result[1].id).toBe(1);
  });

  it("sorts by priority high > medium > low when both incomplete", () => {
    const tasks = [
      makeTask({ id: 1, priority: "low" }),
      makeTask({ id: 2, priority: "high" }),
      makeTask({ id: 3, priority: "medium" }),
    ];
    const result = sortTasks(tasks);
    expect(result.map((t) => t.priority)).toEqual(["high", "medium", "low"]);
  });

  it("sorts by date newest first when priority is equal", () => {
    const tasks = [
      makeTask({
        id: 1,
        priority: "medium",
        createdAt: new Date("2024-01-01"),
      }),
      makeTask({
        id: 2,
        priority: "medium",
        createdAt: new Date("2024-03-01"),
      }),
    ];
    const result = sortTasks(tasks);
    expect(result[0].id).toBe(2);
  });

  it("does not mutate the original array", () => {
    const tasks = [makeTask({ id: 1 }), makeTask({ id: 2 })];
    const original = [...tasks];
    sortTasks(tasks);
    expect(tasks).toEqual(original);
  });
});

describe("filterTasks", () => {
  it("returns all tasks when query is empty", () => {
    const tasks = [makeTask({ id: 1 }), makeTask({ id: 2 })];
    expect(filterTasks(tasks, "")).toHaveLength(2);
  });

  it("filters by title (case-insensitive)", () => {
    const tasks = [
      makeTask({ title: "Buy groceries" }),
      makeTask({ title: "Write tests" }),
    ];
    expect(filterTasks(tasks, "GROCERIES")).toHaveLength(1);
    expect(filterTasks(tasks, "GROCERIES")[0].title).toBe("Buy groceries");
  });

  it("filters by description", () => {
    const tasks = [
      makeTask({ title: "Task A", description: "important meeting" }),
      makeTask({ title: "Task B", description: null }),
    ];
    expect(filterTasks(tasks, "meeting")).toHaveLength(1);
  });

  it("returns empty when no match", () => {
    const tasks = [makeTask({ title: "Nothing relevant" })];
    expect(filterTasks(tasks, "xyz")).toHaveLength(0);
  });
});

describe("getTaskStats", () => {
  it("returns zeros for empty list", () => {
    const stats = getTaskStats([]);
    expect(stats).toEqual({
      total: 0,
      completed: 0,
      pending: 0,
      byPriority: { high: 0, medium: 0, low: 0 },
    });
  });

  it("counts total, completed, and pending correctly", () => {
    const tasks = [
      makeTask({ completed: true }),
      makeTask({ completed: false }),
      makeTask({ completed: false }),
    ];
    const stats = getTaskStats(tasks);
    expect(stats.total).toBe(3);
    expect(stats.completed).toBe(1);
    expect(stats.pending).toBe(2);
  });

  it("counts pending tasks by priority (excludes completed)", () => {
    const tasks = [
      makeTask({ priority: "high", completed: false }),
      makeTask({ priority: "high", completed: true }),
      makeTask({ priority: "medium", completed: false }),
      makeTask({ priority: "low", completed: false }),
    ];
    const { byPriority } = getTaskStats(tasks);
    expect(byPriority.high).toBe(1);
    expect(byPriority.medium).toBe(1);
    expect(byPriority.low).toBe(1);
  });
});
