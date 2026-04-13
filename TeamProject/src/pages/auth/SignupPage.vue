<template>
  <AuthPage
    title="회원가입"
    :aside-image="currentAsideImage"
    :aside-alt="currentAsideAlt"
    :aside-text="currentAsideText"
  >
    <template #header>
      <div class="signup-brand">
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

    <DelayModal
      :is-open="store.isLoading"
      type="loading"
      message="회원가입을 준비 중이에요..."
      :size="1000"
    />

    <Signup
      v-model:name="name"
      v-model:phone="phone"
      v-model:email="email"
      v-model:password="password"
      v-model:confirmPassword="confirmPassword"
      :store="store"
      @submit="submitSignup"
    />
  </AuthPage>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useUiStore } from '@/stores/ui';
import AuthPage from '../../components/auth/AuthPage.vue';
import Signup from '../../components/auth/Signup.vue';
import DelayModal from '../../components/common/DelayModal.vue';
import happyCharacter from '@/assets/happy-character.png';
import happySunglass from '@/assets/happy_sunglass_Character.png';
import errorCharacter from '@/assets/error-character.png';
import logoImage from '@/assets/Logo.png';

const DEFAULT_ASIDE_TEXT = '가계쀼와 함께 새 가계부를 시작해요';

const store = useAuthStore();
const uiStore = useUiStore();
const router = useRouter();

const name = ref('');
const email = ref('');
const phone = ref('');
const password = ref('');
const confirmPassword = ref('');

const currentAsideImage = computed(() => {
  if (store.errorMessage) return errorCharacter;
  return uiStore.isDarkMode ? happySunglass : happyCharacter;
});

const currentAsideAlt = computed(() =>
  store.errorMessage ? 'Signup error character' : 'Happy character',
);

const currentAsideText = computed(
  () => store.errorMessage || DEFAULT_ASIDE_TEXT,
);

const handleThemeToggle = () => {
  uiStore.toggleTheme();
};

const submitSignup = async () => {
  store.clearError();

  if (password.value !== confirmPassword.value) {
    store.errorMessage = '비밀번호가 일치하지 않습니다.';
    return;
  }

  if (password.value.length < 4) {
    store.errorMessage = '비밀번호는 최소 4자 이상이어야 합니다.';
    return;
  }

  const result = await store.signup({
    name: name.value.trim(),
    email: email.value.trim(),
    phone: phone.value.trim(),
    password: password.value,
  });

  if (result.success) {
    uiStore.showToast('회원가입이 완료되었습니다. 로그인해주세요.');
    router.push({ name: 'login' });
  }
};

onMounted(() => {
  store.clearError();
});
</script>

<style scoped>
.signup-brand {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.theme-toggle-inline {
  display: flex;
  align-items: center;
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
  box-shadow: none;
}

.slider:before {
  position: absolute;
  content: '';
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
</style>
