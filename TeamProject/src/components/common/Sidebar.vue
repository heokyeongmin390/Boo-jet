<script setup>
import { getProfileImageSrc } from '@/components/common/profileImages.js';
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Home, BookOpen, Users, User, Menu, X, Moon, Sun } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth';
import { useUiStore } from '@/stores/ui';
import DelayModal from '@/components/common/DelayModal.vue';
import { mockDelay } from '@/service/mockDelay';

const uiStore = useUiStore();
const authstore = useAuthStore();
const route = useRoute();
const router = useRouter();

const isProfileMenuOpen = ref(false);
const isLogoutModalOpen = ref(false);
const isLoggingOut = ref(false);

const props = defineProps({
  currentView: {
    type: String,
    default: '',
  },
});

const menuItems = [
  { id: 'home', label: '홈', icon: Home, to: '/home' },
  { id: 'ledger', label: '가계부', icon: BookOpen, to: '/ledger' },
  { id: 'couples', label: '부부 가계부', icon: Users, to: '/couples' },
  { id: 'mypage', label: '마이페이지', icon: User, to: '/mypage' },
];

const activeView = computed(() => {
  if (props.currentView) return props.currentView;
  const path = route.path;
  if (path === '/') return 'home';
  if (path.startsWith('/ledger')) return 'ledger';
  if (path.startsWith('/couples')) return 'couples';
  if (path.startsWith('/mypage')) return 'mypage';
  return 'home';
});

const toggleProfileMenu = () => {
  isProfileMenuOpen.value = !isProfileMenuOpen.value;
};

const goToPartnerInfo = () => {
  router.push('/couples');
  isProfileMenuOpen.value = false;
  uiStore.isSidebarOpen = false;
};

const closeProfileMenu = () => {
  isProfileMenuOpen.value = false;
};

const closeSidebar = () => {
  uiStore.isSidebarOpen = false;
};

const toggleSidebar = () => {
  uiStore.toggleSidebar();
};

const handleThemeToggle = () => {
  uiStore.toggleTheme();
  uiStore.showToast(
    uiStore.isDarkMode ? '다크모드로 변경되었습니다.' : '라이트모드로 변경되었습니다.',
    'info',
  );
};

const openLogoutModal = () => {
  isLogoutModalOpen.value = true;
  isProfileMenuOpen.value = false;
};

const closeLogoutModal = () => {
  isLogoutModalOpen.value = false;
};

const handleLogout = async () => {
  closeLogoutModal();
  isLoggingOut.value = true;
  await mockDelay();
  authstore.logout();
  uiStore.showToast('로그아웃 했습니다.');
  isProfileMenuOpen.value = false;
  uiStore.isSidebarOpen = false;
  isLoggingOut.value = false;
  router.push('/auth/login');
};

const handleMenuClick = () => {
  isProfileMenuOpen.value = false;
  uiStore.isSidebarOpen = false;
};

const sidebarProfileImageSrc = computed(() => {
  return getProfileImageSrc(authstore.user?.profileImageKey);
});
</script>

<template>
  <DelayModal :is-open="isLoggingOut" type="goodbye" message="금방 돌아오실거죠?" :size="1000" />

  <!-- 모바일 상단 바 -->
  <div v-if="!uiStore.isSidebarOpen" class="mobile-topbar d-lg-none">
    <button type="button" class="hamburger-btn" @click="toggleSidebar">
      <Menu :size="22" />
    </button>
  </div>

  <!-- 모바일 오버레이 -->
  <div v-if="uiStore.isSidebarOpen" class="sidebar-overlay d-lg-none" @click="closeSidebar"></div>

  <!-- 사이드바 -->
  <aside
    class="app-sidebar d-flex flex-column border-end"
    :class="{ 'sidebar-open': uiStore.isSidebarOpen }"
  >
    <div class="sidebar-header p-4 d-flex align-items-center justify-content-between">
      <div class="d-flex align-items-center gap-3">
        <div
          class="d-flex align-items-center justify-content-center rounded-3"
          style="width: 40px; height: 40px; background-color: rgb(255, 204, 80)"
        >
          <div class="logo-box">
            <img src="@/assets/Logo.png" alt="KB 가계부 로고" class="sidebar-logo" />
          </div>
        </div>
        <div>
          <h1 class="fw-bold fs-5 mb-0">가계쀼</h1>
          <p class="small mb-0 brand-subtitle">Boo-jet</p>
        </div>
      </div>

      <!-- 모바일 닫기 버튼 -->
      <button type="button" class="sidebar-close-btn d-lg-none" @click="closeSidebar">
        <X :size="20" />
      </button>
    </div>

    <nav class="flex-grow-1 px-3 py-4 d-flex flex-column">
      <RouterLink
        v-for="item in menuItems"
        :key="item.id"
        :to="item.to"
        class="w-100 d-flex align-items-center gap-3 px-4 py-3 rounded-4 mb-2 border-0 text-start btn sidebar-btn text-decoration-none"
        :class="activeView === item.id ? 'sidebar-link-active fw-medium' : 'sidebar-link'"
        :style="activeView === item.id ? 'background-color: rgb(255,204,80);' : ''"
        @click="handleMenuClick"
      >
        <component :is="item.icon" class="sidebar-icon" />
        <span>{{ item.label }}</span>
      </RouterLink>
    </nav>

    <div class="p-4 border-top">
      <div class="profile-area">
        <button
          type="button"
          class="profile-trigger d-flex align-items-center gap-3 px-2 py-2 rounded-4 w-100 border-0 text-start"
          :class="{ 'profile-trigger-open': isProfileMenuOpen }"
          @click="toggleProfileMenu"
        >
          <div
            class="d-flex align-items-center justify-content-center rounded-circle overflow-hidden"
            style="width: 40px; height: 40px"
          >
            <img
              v-if="sidebarProfileImageSrc"
              :src="sidebarProfileImageSrc"
              alt="프로필 이미지"
              style="width: 100%; height: 100%; object-fit: cover"
            />
            <span v-else>{{ authstore.user?.name?.slice(0, 1) }}</span>
          </div>

          <div class="flex-grow-1">
            <p class="fw-medium mb-0 profile-name">
              {{ authstore.user?.name ?? '' }}
            </p>
            <p class="small mb-0 profile-email">
              {{ authstore.user?.email ?? '' }}
            </p>
          </div>
        </button>

        <div v-if="isProfileMenuOpen" class="profile-menu-card">
          <button type="button" class="profile-menu-item" @click="handleThemeToggle">
            <span class="menu-item-inner">
              <component :is="uiStore.isDarkMode ? Sun : Moon" :size="16" />
              <span>{{ uiStore.isDarkMode ? '라이트모드' : '다크모드' }}</span>
            </span>
          </button>

          <RouterLink
            to="/mypage"
            class="profile-menu-item text-decoration-none"
            @click="handleMenuClick"
          >
            설정
          </RouterLink>

          <button type="button" class="profile-menu-item" @click="goToPartnerInfo">
            파트너 정보
          </button>

          <button
            type="button"
            class="profile-menu-item profile-menu-item-danger"
            @click="openLogoutModal"
          >
            로그아웃
          </button>
        </div>
      </div>
    </div>
  </aside>

  <div v-if="isLogoutModalOpen" class="password-modal-backdrop" @click="closeLogoutModal">
    <div
      class="password-modal-card logout-modal-card"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sidebar-logout-modal-title"
      @click.stop
    >
      <div class="d-flex align-items-start justify-content-between gap-3 mb-3">
        <div>
          <h5 id="sidebar-logout-modal-title" class="fw-bold mb-1">로그아웃</h5>
          <p class="modal-desc small mb-0">정말 로그아웃 하시겠어요?</p>
        </div>
        <button
          type="button"
          class="btn-close"
          aria-label="닫기"
          @click="closeLogoutModal"
        ></button>
      </div>

      <div class="logout-modal-copy">현재 세션을 종료하고 로그인 페이지로 이동합니다.</div>

      <div class="d-flex justify-content-end gap-2 mt-4">
        <button type="button" class="btn btn-outline-secondary" @click="closeLogoutModal">
          취소
        </button>
        <button type="button" class="btn btn-dark" @click="handleLogout">로그아웃</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.mobile-topbar {
  position: fixed;
  top: 0.75rem;
  left: 0.75rem;
  z-index: 1060;
  height: auto;
  padding: 0;
  background: transparent;
  border-bottom: none;
  color: var(--text-color);
  display: flex;
  align-items: center;
  gap: 0;
}

.hamburger-btn,
.sidebar-close-btn {
  border: 0;
  background: var(--card-bg);
  color: var(--text-color);
  width: 40px;
  height: 40px;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--shadow-sm);
}

.hamburger-btn:hover,
.sidebar-close-btn:hover {
  background: var(--sub-bg);
}

.mobile-brand {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.mobile-logo {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.mobile-title {
  font-weight: 700;
  color: var(--text-color);
}

.sidebar-overlay {
  position: fixed;
  inset: 0;
  z-index: 1045;
  background: rgba(15, 23, 42, 0.35);
}

.app-sidebar {
  width: 256px;
  height: 100vh;
  z-index: 1050;
  background: var(--card-bg);
  color: var(--text-color);
  border: none;
}

.profile-area {
  position: relative;
}

.profile-trigger {
  background-color: transparent;
  transition: background-color 0.2s ease;
}

.profile-trigger:hover {
  background-color: var(--sub-bg);
}

.profile-trigger-open {
  background-color: rgb(255, 204, 80);
}

.profile-menu-card {
  position: absolute;
  left: 0;
  right: 0;
  bottom: calc(100% + 8px);
  z-index: 30;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  background-color: var(--card-bg);
  box-shadow: var(--shadow-sm);
  max-width: 100%;
}

.profile-menu-item {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.8rem 0.9rem;
  border: 0;
  border-radius: 0.8rem;
  background: transparent;
  color: var(--text-color);
  font-size: 0.95rem;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.profile-menu-item:hover {
  background-color: var(--sub-bg);
}

.profile-menu-item-danger {
  color: #dc3545;
}

.password-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1080;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(15, 23, 42, 0.4);
  overflow-y: auto;
}

.password-modal-card {
  width: min(100%, 28rem);
  max-height: calc(100dvh - 2rem);
  overflow-y: auto;
  padding: 1.5rem;
  border-radius: 1.25rem;
  border: 1px solid var(--border-color);
  background: var(--card-bg);
  color: var(--text-color);
  box-shadow: var(--shadow-sm);
}

.logout-modal-card {
  width: min(100%, 30rem);
}

.logout-modal-copy {
  padding: 1rem 1.1rem;
  border-radius: 1rem;
  background: var(--sub-bg);
  border: 1px solid var(--border-color);
  color: var(--text-color);
  line-height: 1.6;
}
.modal-desc {
  color: var(--text-muted);
}

.logo-box {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background-color: var(--sub-bg);
  border: 2px solid rgb(255, 204, 80);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.sidebar-logo {
  width: 65px;
  height: 65px;
  object-fit: contain;
}

/* 데스크탑 */
@media (min-width: 992px) {
  .app-sidebar {
    position: sticky;
    top: 0;
    transform: none;
  }
}

/* 모바일/태블릿 */
@media (max-width: 991.98px) {
  .app-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    transform: translateX(-100%);
    transition: transform 0.28s ease;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.18);
  }

  .app-sidebar.sidebar-open {
    transform: translateX(0);
  }
}

@media (max-width: 768px) {
  .profile-menu-card {
    bottom: calc(100% + 6px);
    padding: 0.4rem;
  }

  .profile-menu-item {
    padding: 0.7rem 0.8rem;
    font-size: 0.9rem;
  }

  .password-modal-card {
    padding: 1.2rem;
  }
}

.menu-item-inner {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.sidebar-link {
  color: var(--text-muted) !important;
}

.sidebar-btn {
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.sidebar-btn:hover {
  background-color: var(--sub-bg);
}

.sidebar-link-active {
  color: var(--text-color) !important;
}

.sidebar-icon {
  width: 20px;
  height: 20px;
  color: inherit;
}

.profile-name {
  color: var(--text-color);
}

.profile-email {
  color: var(--text-muted);
}

/* 메뉴 hover */
.profile-menu-item:hover {
  background-color: var(--sub-bg);
}

/* 사이드바 전체 글자 */
.app-sidebar {
  color: var(--text-color);
}
.brand-subtitle {
  color: var(--text-muted);
}
</style>
