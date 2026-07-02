// server/services/taskService.ts
import type { Task } from "~~/server/db/schema";

export type Priority = "low" | "medium" | "high";

const PRIORITY_WEIGHT: Record<Priority, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

/**
 * Sorts tasks: incomplete first, then by priority, then by date
 * Pure function — no DB, no side effects → perfect for unit testing
 */
export function sortTasks(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    // Completed tasks go to bottom
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    // Higher priority first
    const priorityDiff =
      PRIORITY_WEIGHT[b.priority as Priority] -
      PRIORITY_WEIGHT[a.priority as Priority];
    if (priorityDiff !== 0) return priorityDiff;
    // Newer first
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

/**
 * Filters tasks by search term (title or description)
 */
export function filterTasks(tasks: Task[], query: string): Task[] {
  const q = query.toLowerCase().trim();
  if (!q) return tasks;
  return tasks.filter(
    (t) =>
      t.title.toLowerCase().includes(q) ||
      (t.description ?? "").toLowerCase().includes(q),
  );
}

/**
 * Returns task statistics
 */
export function getTaskStats(tasks: Task[]) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;
  const byPriority = {
    high: tasks.filter((t) => t.priority === "high" && !t.completed).length,
    medium: tasks.filter((t) => t.priority === "medium" && !t.completed).length,
    low: tasks.filter((t) => t.priority === "low" && !t.completed).length,
  };
  return { total, completed, pending, byPriority };
}
