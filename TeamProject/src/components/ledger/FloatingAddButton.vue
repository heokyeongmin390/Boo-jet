<script setup>
import { Plus } from 'lucide-vue-next'

const emit = defineEmits(['click'])
</script>

<template>
  <button
    @click="emit('click')"
    class="position-fixed bottom-0 end-0 m-4 rounded-4 shadow-lg d-flex align-items-center justify-content-center border-0 z-3"
    style="width: 56px; height: 56px; background-color: rgb(255,204,80); transition: transform 0.2s;"
    onmouseover="this.style.transform='scale(1.05)'"
    onmouseout="this.style.transform='scale(1)'"
  >
    <Plus style="width: 24px; height: 24px;" />
  </button>
</template>
