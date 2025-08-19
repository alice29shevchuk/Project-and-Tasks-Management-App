<script setup lang="ts">
import { onMounted, computed, ref } from 'vue'
import { useTasksStore } from '@/stores/tasks'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, CategoryScale, LinearScale, BarElement)

const tasksStore = useTasksStore()
const chartKey = ref(0)

onMounted(async () => {
    await tasksStore.loadAllTasks?.()
})

const statusCounts = computed(() => {
  const counts = { todo: 0, 'in-progress': 0, done: 0 }
  tasksStore.allTasks.forEach(task => {
    if (counts[task.status] !== undefined) counts[task.status]++
  })
  return counts
})

const chartData = computed(() => ({
  labels: ['To Do', 'In Progress', 'Done'],
  datasets: [
    {
      label: 'Кількість завдань',
      data: [
        statusCounts.value.todo,
        statusCounts.value['in-progress'],
        statusCounts.value.done
      ],
      backgroundColor: ['#ff6384', '#36a2eb', '#4caf50'],
      borderRadius: 6
    }
  ]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        boxWidth: 12,
        padding: 12
      }
    },
    title: {
      display: true,
      text: 'Розподіл завдань за статусами',
      font: { size: 16 }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: { stepSize: 1 }
    },
    x: {
      grid: { display: false }
    }
  }
}
</script>

<template>
  <div class="task-status-chart">
    <Bar :key="chartKey" :data="chartData" :options="chartOptions" />
  </div>
</template>

<style scoped>
.task-status-chart {
  height: 300px;
  width: 100%;
  margin: 20px 0;
}
</style>