<script setup lang="ts">
const { loggedIn } = useUserSession()
if (loggedIn.value) await navigateTo('/')

const form = reactive({ name: '', email: '', password: '' })
const error = ref('')

async function submit() {
    error.value = ''
    try {
        await $fetch('/api/auth/register', { method: 'POST', body: form })
        await navigateTo('/')
    } catch (e: any) {
        error.value = e.data?.message ?? 'Registration failed'
    }
}
</script>

<template>
    <div class="max-w-md mx-auto mt-20 p-6">
        <h1 class="text-2xl font-bold mb-6">Register</h1>
        <form @submit.prevent="submit" class="space-y-4" data-testid="register-form">
            <input v-model="form.name" placeholder="Name" class="w-full border rounded p-2" data-testid="name-input"
                required />
            <input v-model="form.email" type="email" placeholder="Email" class="w-full border rounded p-2"
                data-testid="email-input" required />
            <input v-model="form.password" type="password" placeholder="Password (min 8 chars)"
                class="w-full border rounded p-2" data-testid="password-input" required />
            <p v-if="error" class="text-red-500 text-sm" data-testid="error-message">{{ error }}</p>
            <button type="submit" class="w-full bg-green-500 text-white py-2 rounded" data-testid="register-btn">
                Register
            </button>
        </form>
        <p class="mt-4 text-sm text-center">
            Already registered? <NuxtLink to="/login" class="text-blue-500">Login</NuxtLink>
        </p>
    </div>
</template>