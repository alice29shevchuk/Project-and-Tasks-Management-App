<script setup lang="ts">
import TaskStatusChart from '@/components/common/TaskStatusChart.vue'
</script>

<template>
  <div class="statistics-container">
    <h3 class="statistics-title">Статистика завдань</h3>
    <div class="chart-wrapper">
      <TaskStatusChart />
    </div>
  </div>
</template>

<style scoped>
.statistics-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 100%;
  padding: 20px;
}

.statistics-title {
  margin-bottom: 20px;
  color: #333;
  font-size: 24px;
  font-weight: 600;
}

.chart-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
  margin: 0 auto;
}
</style>