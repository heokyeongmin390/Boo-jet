<template>
  <div
    v-if="uiStore.hasToast"
    class="toast-container position-fixed top-0 end-0 p-3"
  >
    <div
      v-for="toast in uiStore.toasts"
      :key="toast.id"
      class="toast-box"
      :class="[
        toast.visible ? 'toast-show' : 'toast-hide',
        `toast-${toast.type}`,
      ]"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      {{ toast.message }}
    </div>
  </div>
</template>

<script setup>
import { useUiStore } from '@/stores/ui';

const uiStore = useUiStore();
</script>

<style scoped>
.toast-container {
  z-index: 9999;
  width: min(22rem, calc(100vw - 1.5rem));
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.toast-box {
  padding: 0.9rem 1rem;
  border-radius: 0.9rem;
  box-shadow: 0 0.75rem 1.5rem rgba(0, 0, 0, 0.14);
  font-weight: 600;
  line-height: 1.4;
  word-break: keep-all;
  transition:
    opacity 250ms ease,
    transform 250ms ease;
}

.toast-show {
  opacity: 1;
  transform: translateY(0);
}

.toast-hide {
  opacity: 0;
  transform: translateY(-6px);
}

.toast-info {
  background-color: var(--kb-yellow);
  color: var(--kb-gray);
}

.toast-success {
  background-color: #4caf50;
  color: white;
}

.toast-error {
  background-color: #e57373;
  color: white;
}

.toast-warning {
  background-color: #ff9800;
  color: white;
}

@media (max-width: 768px) {
  .toast-container {
    width: min(20rem, calc(100vw - 1rem));
    padding: 0.75rem;
  }

  .toast-box {
    padding: 0.8rem 0.9rem;
    font-size: 0.92rem;
  }
}
</style>
