<!-- app/pages/index.vue -->
<script setup lang="ts">
const { loggedIn, user } = useUserSession()
if (!loggedIn.value) await navigateTo('/login')

const store = useTaskStore()
await store.fetchTasks()

async function logout() {
    await $fetch('/api/auth/logout', { method: 'POST' })
    await navigateTo('/login')
}
</script>

<template>
    <div class="max-w-2xl mx-auto p-6">
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold">Tasks for {{ user?.name }}</h1>
            <!-- ↓ call the function, not inline $fetch -->
            <button @click="logout">Logout</button>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-3 gap-4 mb-6">
            <div class="bg-blue-50 p-4 rounded">
                <div class="text-2xl font-bold">{{ store.stats.total }}</div>
                <div class="text-sm text-gray-600">Total</div>
            </div>
            <div class="bg-green-50 p-4 rounded">
                <div class="text-2xl font-bold">{{ store.stats.completed }}</div>
                <div class="text-sm text-gray-600">Done</div>
            </div>
            <div class="bg-yellow-50 p-4 rounded">
                <div class="text-2xl font-bold">{{ store.stats.pending }}</div>
                <div class="text-sm text-gray-600">Pending</div>
            </div>
        </div>

        <input v-model="store.searchQuery" placeholder="Search tasks..." class="w-full border rounded p-2 mb-4"
            data-testid="search-input" />

        <TaskForm @created="store.fetchTasks()" />

        <div class="space-y-2 mt-4">
            <TaskItem v-for="task in store.filteredTasks" :key="task.id" :task="task"
                @toggle="store.toggleTask(task.id)" @delete="store.deleteTask(task.id)" />
        </div>
    </div>
</template>