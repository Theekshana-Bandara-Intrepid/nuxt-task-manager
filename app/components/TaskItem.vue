<!-- app/components/TaskItem.vue -->
<script setup lang="ts">
import type { Task } from '~~/server/db/schema'
defineProps<{ task: Task }>()
defineEmits<{ toggle: []; delete: [] }>()
</script>

<template>
    <div class="flex items-center gap-3 p-3 border rounded bg-white" :class="{ 'opacity-50': task.completed }"
        :data-testid="`task-item-${task.id}`">
        <input type="checkbox" :checked="task.completed" @change="$emit('toggle')"
            :data-testid="`task-checkbox-${task.id}`" />
        <div class="flex-1">
            <div :class="{ 'line-through': task.completed }" class="font-medium">
                {{ task.title }}
            </div>
            <div v-if="task.description" class="text-sm text-gray-500">{{ task.description }}</div>
        </div>
        <span class="text-xs px-2 py-1 rounded" :class="{
            'bg-red-100 text-red-700': task.priority === 'high',
            'bg-yellow-100 text-yellow-700': task.priority === 'medium',
            'bg-gray-100 text-gray-600': task.priority === 'low',
        }">{{ task.priority }}</span>
        <button @click="$emit('delete')" class="text-red-400 hover:text-red-600"
            :data-testid="`delete-task-${task.id}`">✕</button>
    </div>
</template>