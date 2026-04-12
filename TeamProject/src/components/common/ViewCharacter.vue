<template>
  <div class="wrap" :style="{ width: `${size}px`, maxWidth: '100%' }">
    <div v-if="message" class="speech-bubble">
      {{ message }}
    </div>
    <img :src="selectedImage" class="character" :alt="`${type} character`" />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import withdrawSadCharacter from '@/assets/withdraw-sad-character.png';
import happyCharacter from '@/assets/happy-character.png';
import errorCharacter from '@/assets/error-character.png';
import goodbyeCharacter from '@/assets/goodbye-character.png';

const props = defineProps({
  type: {
    type: String,
    default: 'withdraw',
  },
  message: {
    type: String,
    default: '',
  },
  size: {
    type: Number,
    default: 400,
  },
});

const imageMap = {
  withdraw: withdrawSadCharacter,
  loading: happyCharacter,
  error: errorCharacter,
  goodbye: goodbyeCharacter,
};

const selectedImage = computed(() => imageMap[props.type]);
</script>

<style scoped>
.wrap {
  margin: 0 auto;
  position: relative;
  max-width: 100%;
}

.character {
  width: 100%;
  display: block;
  animation: floaty 2.2s ease-in-out infinite;
}

.speech-bubble {
  position: relative;
  margin: 0 auto 1rem;
  width: fit-content;
  max-width: min(90%, 22rem);
  padding: 0.85rem 1rem;
  border-radius: 1rem;
  background: #fff8db;
  border: 1px solid #f2d675;
  color: #4f473d;
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.45;
  text-align: center;
  box-shadow: 0 8px 18px rgba(79, 71, 61, 0.08);
}

.speech-bubble::before,
.speech-bubble::after {
  content: '';
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.speech-bubble::before {
  bottom: -11px;
  border-width: 11px 11px 0 11px;
  border-style: solid;
  border-color: #f2d675 transparent transparent transparent;
}

.speech-bubble::after {
  bottom: -9px;
  transform: translateX(-50%);
  border-width: 10px 10px 0 10px;
  border-style: solid;
  border-color: #fff8db transparent transparent transparent;
}

@keyframes floaty {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px);
  }
  100% {
    transform: translateY(0);
  }
}

@keyframes sadShake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-1px);
  }
  75% {
    transform: translateX(1px);
  }
}

@media (max-width: 768px) {
  .speech-bubble {
    font-size: 0.9rem;
    padding: 0.75rem 0.9rem;
  }
}
</style>
