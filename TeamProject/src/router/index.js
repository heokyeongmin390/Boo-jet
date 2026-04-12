import { createRouter, createWebHistory } from 'vue-router';

// layout은 "페이지들을 어떤 외곽 틀 안에서 보여줄지"를 결정한다.
// 인증 페이지는 AuthLayout, 로그인 이후 페이지는 DefaultLayout을 사용한다.
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import AuthLayout from '@/layouts/AuthLayout.vue';

// 실제 화면 컴포넌트들
import LoginPage from '@/pages/auth/LoginPage.vue';
import SignupPage from '@/pages/auth/SignupPage.vue';
import HomePage from '@/pages/home/HomePage.vue';
import LedgerPage from '@/pages/ledger/LedgerPage.vue';
import CoupleDashboardPage from '@/pages/couples/CoupleDashboardPage.vue'; //커플 페이지 통합
import MyPagePage from '@/pages/mypage/MyPagePage.vue';
import SettingsPage from '@/pages/settings/SettingsPage.vue';

// 라우터 가드에서 로그인 여부를 판단하기 위해 auth store를 사용한다.
import { useAuthStore } from '@/stores/auth';

/**
 * 라우트 정의
 *
 * 핵심 규칙:
 * - / 는 로그인 페이지로 시작
 * - DefaultLayout 아래 페이지들은 로그인 필요(meta.requiresAuth)
 * - /auth 아래 페이지들은 비로그인 사용자 전용(meta.guestOnly)
 */
const routes = [
  {
    path: '/',
    redirect: '/auth/login',
  },
  {
    path: '/',
    component: DefaultLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'home',
        name: 'home',
        component: HomePage,
      },
      {
        path: 'ledger',
        name: 'ledger',
        component: LedgerPage,
      },
      {
        path: 'couples',
        name: 'couples',
        component: CoupleDashboardPage,
      },
      {
        path: 'mypage',
        name: 'mypage',
        component: MyPagePage,
      },
      {
        path: 'settings',
        name: 'settings',
        component: SettingsPage,
      },
    ],
  },
  {
    path: '/auth',
    component: AuthLayout,
    meta: { guestOnly: true },
    children: [
      {
        path: 'login',
        name: 'login',
        component: LoginPage,
      },
      {
        path: 'signup',
        name: 'signup',
        component: SignupPage,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

/**
 * 전역 라우터 가드
 *
 * 페이지 이동 전마다 실행되며, 현재 세션 스토리지에 저장된
 * 로그인 사용자 정보를 store로 먼저 복원한다.
 *
 * 동작:
 * - 로그인 필요한 페이지인데 로그인 안 했으면 login으로 보냄
 * - guest 전용 페이지인데 이미 로그인했으면 home으로 보냄
 */
router.beforeEach((to) => {
  const authStore = useAuthStore();
  authStore.loadUserFromStorage();

  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    return { name: 'login' };
  }

  if (to.meta.guestOnly && authStore.isLoggedIn) {
    return { name: 'home' };
  }

  return true;
});

export default router;
