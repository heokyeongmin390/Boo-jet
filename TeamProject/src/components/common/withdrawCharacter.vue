<template>
  <div class="wrap">
    <img src="@/assets/withdraw-sad-character.png" class="character" />
  </div>
</template>

<style scoped>
.wrap {
  width: 200px;
  margin: 0 auto;
}

.character {
  width: 100%;
  animation: floaty 2.2s ease-in-out infinite;
}

/* 둥실 */
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

/* 울먹 떨림 */
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
</style>
