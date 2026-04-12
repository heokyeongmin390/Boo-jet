<template>
  <div v-if="isOpen" class="delay-modal-backdrop" role="dialog" aria-modal="true">
    <div class="delay-modal-card" @click.stop>
      <ViewCharacter :type="type" :message="message" :size="size" />
    </div>
  </div>
</template>

<script setup>
import ViewCharacter from '@/components/common/ViewCharacter.vue';

defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: 'withdraw',
  },
  message: {
    type: String,
    default: '모아가 준비하고 있어요...',
  },
  size: {
    type: Number,
    default: 1000,
  },
});
</script>

<style scoped>
.delay-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  overflow-y: auto;
  background-color: rgba(17, 24, 39, 0.45);
}

.delay-modal-card {
  width: min(100%, 32rem);
  max-width: 100%;
  max-height: calc(100dvh - 2rem);
  padding: 1.25rem;
  overflow-x: hidden;
  overflow-y: auto;
  border: 1px solid #e5e7eb;
  border-radius: 1.5rem;
  background-color: #ffffff;
  box-shadow: 0 1.25rem 2.5rem rgba(15, 23, 42, 0.18);
}

@media (max-width: 768px) {
  .delay-modal-card {
    width: 100%;
    max-height: calc(100dvh - 1.5rem);
    padding: 1rem;
    border-radius: 1.25rem;
  }
}
</style>
