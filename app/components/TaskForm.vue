<!-- app/components/TaskForm.vue -->
<script setup lang="ts">
const emit = defineEmits<{ created: [] }>()
const store = useTaskStore()

const form = reactive({ title: '', description: '', priority: 'medium' as const })
const submitting = ref(false)

async function submit() {
    if (!form.title.trim()) return
    submitting.value = true
    await store.createTask({ ...form })
    form.title = ''
    form.description = ''
    submitting.value = false
    emit('created')
}
</script>

<template>
    <form @submit.prevent="submit" class="bg-gray-50 p-4 rounded space-y-3" data-testid="task-form">
        <input v-model="form.title" placeholder="Task title" class="w-full border rounded p-2"
            data-testid="task-title-input" required />
        <textarea v-model="form.description" placeholder="Description (optional)" class="w-full border rounded p-2"
            data-testid="task-description-input" />
        <select v-model="form.priority" class="border rounded p-2" data-testid="priority-select">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
        </select>
        <button type="submit" :disabled="submitting" class="bg-blue-500 text-white px-4 py-2 rounded"
            data-testid="submit-task-btn">
            {{ submitting ? 'Adding...' : 'Add Task' }}
        </button>
    </form>
</template>