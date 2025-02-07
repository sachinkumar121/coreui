import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useSidebarStore = defineStore('sidebar', () => {
  const visible = ref(undefined)
  const unfoldable = ref(false)
  const narrow = ref(false)

  const toggleVisible = (value) => {
    visible.value = value !== undefined ? value : !visible.value
  }

  const toggleUnfoldable = () => {
    unfoldable.value = !unfoldable.value
  }

  const toggleNarrow = () => {
    narrow.value = !narrow.value
  }

  return { visible, unfoldable, narrow, toggleVisible, toggleUnfoldable, toggleNarrow }
})
