<script setup lang="ts">
const { loggedIn } = useUserSession()
if (loggedIn.value) await navigateTo('/')

const form = reactive({ email: '', password: '' })
const error = ref('')

async function submit() {
    error.value = ''
    try {
        await $fetch('/api/auth/login', { method: 'POST', body: form })
        await navigateTo('/')
    } catch (e: any) {
        error.value = e.data?.message ?? 'Login failed'
    }
}
</script>

<template>
    <div class="max-w-md mx-auto mt-20 p-6">
        <h1 class="text-2xl font-bold mb-6">Login</h1>
        <form @submit.prevent="submit" class="space-y-4" data-testid="login-form">
            <input v-model="form.email" type="email" placeholder="Email" class="w-full border rounded p-2"
                data-testid="email-input" required />
            <input v-model="form.password" type="password" placeholder="Password" class="w-full border rounded p-2"
                data-testid="password-input" required />
            <p v-if="error" class="text-red-500 text-sm" data-testid="error-message">{{ error }}</p>
            <button type="submit" class="w-full bg-blue-500 text-white py-2 rounded" data-testid="login-btn">
                Login
            </button>
        </form>
        <p class="mt-4 text-sm text-center">
            No account? <NuxtLink to="/register" class="text-blue-500">Register</NuxtLink>
        </p>
    </div>
</template>