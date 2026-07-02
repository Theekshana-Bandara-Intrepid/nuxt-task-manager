// app/stores/tasks.ts
import { defineStore } from "pinia";
import type { Task } from "~~/server/db/schema";
import {
  sortTasks,
  filterTasks,
  getTaskStats,
} from "~~/server/services/taskService";

export const useTaskStore = defineStore("tasks", () => {
  const tasks = ref<Task[]>([]);
  const searchQuery = ref("");
  const loading = ref(false);
  const error = ref<string | null>(null);

  const filteredTasks = computed(() =>
    filterTasks(sortTasks(tasks.value), searchQuery.value),
  );
  const stats = computed(() => getTaskStats(tasks.value));

  async function fetchTasks() {
    loading.value = true;
    error.value = null;
    try {
      tasks.value = await $fetch<Task[]>("/api/tasks");
    } catch (e: any) {
      error.value = e.message;
    } finally {
      loading.value = false;
    }
  }

  async function createTask(data: {
    title: string;
    description?: string;
    priority?: string;
  }) {
    const task = await $fetch<Task>("/api/tasks", {
      method: "POST",
      body: data,
    });
    tasks.value.unshift(task);
    return task;
  }

  async function toggleTask(id: number) {
    const task = tasks.value.find((t) => t.id === id);
    if (!task) return;
    const updated = await $fetch<Task>(`/api/tasks/${id}`, {
      method: "PATCH",
      body: { completed: !task.completed },
    });
    const index = tasks.value.findIndex((t) => t.id === id);
    tasks.value[index] = updated;
  }

  async function deleteTask(id: number) {
    await $fetch(`/api/tasks/${id}`, { method: "DELETE" });
    tasks.value = tasks.value.filter((t) => t.id !== id);
  }

  return {
    tasks,
    searchQuery,
    loading,
    error,
    filteredTasks,
    stats,
    fetchTasks,
    createTask,
    toggleTask,
    deleteTask,
  };
});
