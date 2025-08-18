<script setup lang="ts">
</script>

<template>
  <div id="app" class="app-wrapper">
    <header class="app-header">
      <h1 class="logo">Project Management App</h1>
      <nav class="nav">
        <router-link to="/" exact-active-class="active">Головна</router-link>
        <router-link to="/projects" active-class="active">Projects</router-link>
      </nav>
    </header>
    <main class="p-4">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: system-ui, -apple-system, sans-serif;
  background: #f5f6fa;
}

.app-header {
  background: #3f51b5;
  color: white;
  padding: 0.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0,0,0,0.15);
}

.logo {
  font-size: 1.25rem;
  font-weight: 600;
}

.nav {
  display: flex;
  gap: 1.5rem;
}

.nav a {
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.2s ease;
}

.nav a:hover {
  opacity: 0.8;
}

.nav a.active {
  border-bottom: 2px solid white;
  padding-bottom: 2px;
}
</style>
