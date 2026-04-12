<template>
  <div class="auth-page d-flex align-items-center min-vh-100">
    <div class="container">
      <div class="row justify-content-center">
        <div :class="containerClass">
          <div class="card border-0 shadow auth-card">
            <div :class="bodyClass">
              <div class="auth-content">
                <div v-if="$slots.header" class="auth-topbar">
                  <h2 class="fw-bold auth-title auth-title-inline">
                    {{ title }}
                  </h2>
                  <div class="auth-header-slot">
                    <slot name="header"></slot>
                  </div>
                </div>
                <h2 v-else :class="titleClass" class="fw-bold auth-title">
                  {{ title }}
                </h2>
                <slot></slot>
              </div>

              <div v-if="asideImage" class="auth-aside">
                <div class="auth-aside-inner">
                  <img
                    :src="asideImage"
                    :alt="asideAlt"
                    class="auth-aside-image"
                  />
                  <p v-if="asideText" class="auth-aside-text">
                    {{ asideText }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  title: String,
  asideImage: {
    type: String,
    default: "",
  },
  asideAlt: {
    type: String,
    default: "Authentication illustration",
  },
  asideText: {
    type: String,
    default: "",
  },
});

const hasAside = computed(() => Boolean(props.asideImage));
const containerClass = computed(() =>
  hasAside.value
    ? "col-12 col-lg-11 col-xl-10"
    : "col-12 col-md-9 col-lg-7 col-xl-6",
);
const bodyClass = computed(() =>
  hasAside.value
    ? "card-body p-4 p-md-5 p-lg-5 auth-card-body with-aside"
    : "card-body p-4 p-md-5 p-lg-5 auth-card-body",
);
const titleClass = computed(() =>
  hasAside.value ? "mb-4 text-start" : "text-center mb-5",
);
</script>

<style scoped>
.auth-page {
  background: var(--bg-color-gradient);
}

.auth-card {
  border-radius: 1.25rem;
  background-color: var(--card-bg);
  color: var(--text-color);
  box-shadow: var(--shadow-sm);
}

.auth-card-body {
  display: flex;
  flex-direction: column;
}

.with-aside {
  gap: 0;
}

.auth-content {
  flex: 1 1 28rem;
}

.auth-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

.auth-header-slot {
  display: flex;
  align-items: center;
  margin-left: auto;
}

.auth-title {
  color: var(--text-color);
}

.auth-title-inline {
  margin: 0;
}

.auth-aside {
  display: none;
}

.auth-aside {
  border-radius: 1.5rem;
  background: var(--sub-bg);
  border: 1px solid var(--border-color);
}

.auth-aside-inner {
  display: flex;
  height: 100%;
  min-height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1.5rem 1rem;
  border-radius: inherit;
}

.auth-aside-text {
  order: -1;
  position: relative;
  margin: 0;
  max-width: 20rem;
  padding: 0.85rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  background: var(--card-bg);
  color: var(--text-color);
  font-size: 0.95rem;
  font-weight: 700;
  line-height: 1.4;
  text-align: center;
  box-shadow: 0 8px 18px rgba(79, 71, 61, 0.08);
}

.auth-aside-text::after {
  content: "";
  position: absolute;
  bottom: -10px;
  left: 50%;
  width: 18px;
  height: 18px;
  background: var(--card-bg);
  border-right: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
  transform: translateX(-50%) rotate(45deg);
}

.auth-aside-image {
  width: min(100%, 20rem);
  height: auto;
  object-fit: contain;
  animation: authFloaty 2.2s ease-in-out infinite;
}

@keyframes authFloaty {
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

@media (min-width: 992px) {
  .with-aside {
    flex-direction: row;
    align-items: stretch;
  }

  .with-aside .auth-content {
    padding-right: 2rem;
  }

  .auth-aside {
    display: block;
    flex: 0 0 clamp(18rem, 37%, 24rem);
    margin: -3rem -3rem -3rem 0;
    border-radius: 0 1.25rem 1.25rem 0;
  }
}
</style>
