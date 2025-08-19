import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useToastStore = defineStore('toast', () => {
  const message = ref('')
  const show = ref(false)

  const showToast = (msg: string, duration = 3000) => {
    message.value = msg
    show.value = true
    setTimeout(() => show.value = false, duration)
  }

  return { message, show, showToast }
})
