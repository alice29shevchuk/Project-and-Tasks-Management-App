<script setup lang="ts">
import type { Project } from '@/types';
import { defineProps, defineEmits } from 'vue'
import VueTableLite from 'vue3-table-lite'

defineProps<{
  columns: Array<{
    label: string
    field: string
    width?: string
    sortable?: boolean
    isKey?: boolean
  }>
  data: Project[]
  loading?: boolean
}>()

const emit = defineEmits(['row-clicked'])

const handleRowClick = (row: Project) => {
  emit('row-clicked', row)
}
</script>

<template>
  <VueTableLite
    :is-static-mode="true"
    :is-loading="loading"
    :columns="columns"
    :rows="data"
    :total="data.length"
    @row-clicked="handleRowClick"
  />
</template>