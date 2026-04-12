<template>
  <div class="login-page-shell">
    <AuthPage
      title="로그인"
      :aside-image="currentAsideImage"
      :aside-alt="currentAsideAlt"
      :aside-text="currentAsideText"
    >
      <template #header>
        <div class="login-brand">
          <div class="theme-toggle-inline">
            <label class="switch">
              <input
                type="checkbox"
                :checked="!uiStore.isDarkMode"
                @change="handleThemeToggle"
              />
              <span class="slider"></span>
            </label>
          </div>

          <div class="logo-box">
            <img :src="logoImage" alt="KB 가계부 로고" class="sidebar-logo" />
          </div>
        </div>
      </template>

      <Login
        v-model:email="email"
        v-model:password="password"
        v-model:rememberEmail="rememberEmail"
        :store="authStore"
        @submit="submitLogin"
      />
    </AuthPage>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useUiStore } from "@/stores/ui";
import AuthPage from "../../components/auth/AuthPage.vue";
import Login from "../../components/auth/Login.vue";
import happyCharacter from "@/assets/happy-character.png";
import errorCharacter from "@/assets/error-character.png";
import logoImage from "@/assets/Logo.png";

const REMEMBERED_EMAIL_KEY = "rememberedEmail";
const DEFAULT_ASIDE_TEXT = "가계쀼와 함께 오늘도 가볍게 시작해요";

const authStore = useAuthStore();
const uiStore = useUiStore();
const router = useRouter();

const email = ref("");
const password = ref("");
const rememberEmail = ref(false);

const currentAsideImage = computed(() =>
  authStore.errorMessage ? errorCharacter : happyCharacter,
);

const currentAsideAlt = computed(() =>
  authStore.errorMessage ? "Login error character" : "Happy character",
);

const currentAsideText = computed(
  () => authStore.errorMessage || DEFAULT_ASIDE_TEXT,
);

onMounted(() => {
  const savedEmail = localStorage.getItem(REMEMBERED_EMAIL_KEY);
  if (savedEmail) {
    email.value = savedEmail;
    rememberEmail.value = true;
  }
});

const syncRememberEmail = () => {
  if (rememberEmail.value) {
    localStorage.setItem(REMEMBERED_EMAIL_KEY, email.value);
    return;
  }

  localStorage.removeItem(REMEMBERED_EMAIL_KEY);
};
const handleThemeToggle = () => {
  uiStore.toggleTheme();
};
const submitLogin = async () => {
  const result = await authStore.login({
    email: email.value,
    password: password.value,
  });

  if (result.success) {
    syncRememberEmail();
    uiStore.showToast("로그인에 성공했습니다.");
    router.push({ name: "home" });
    return;
  }

  uiStore.showToast(result.message || "로그인에 실패했습니다.", "error");
};

onMounted(() => {
  authStore.clearError();
});
</script>

<style scoped>
.login-page-shell {
  position: relative;
  min-height: 100vh;
  background: var(--page-bg);
}

.theme-toggle-wrap {
  position: static;
}

.login-brand {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.logo-box {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: rgba(255, 204, 80, 0.16);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.sidebar-logo {
  width: 38px;
  height: 38px;
  object-fit: contain;
}

/* From Uiverse.io by alexruix */
.switch {
  font-size: 17px;
  position: relative;
  display: inline-block;
  width: 3.5em;
  height: 2em;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  --background: #28096b;
  position: absolute;
  cursor: pointer;
  inset: 0;
  background-color: var(--background);
  transition: 0.5s;
  border-radius: 30px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 1.4em;
  width: 1.4em;
  border-radius: 50%;
  left: 10%;
  bottom: 15%;
  box-shadow: inset 8px -4px 0px 0px #fff000;
  background: var(--background);
  transition: 0.5s;
}

input:checked + .slider {
  background-color: #522ba7;
}

input:checked + .slider:before {
  transform: translateX(100%);
  box-shadow: inset 15px -4px 0px 15px #fff000;
}
.theme-toggle-inline {
  display: flex;
  align-items: center;
}
@media (max-width: 768px) {
  .theme-toggle-wrap {
    top: 1rem;
    left: 1rem;
  }
}
</style>
