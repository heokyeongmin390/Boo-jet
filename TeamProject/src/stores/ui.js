/**
 * @fileoverview UI 상태 관리 스토어
 * @description 전역 UI 상태(모달, 사이드바, 토스트 등)를 중앙 집중 관리
 */

import { defineStore } from "pinia";
import { ref, computed } from "vue";
const THEME_KEY = "budget-theme"; //다크모드용

/**
 * UI 상태 관리 스토어
 * 모달, 사이드바, 토스트 메시지 등의 UI 상태를 관리
 */
export const useUiStore = defineStore("ui", () => {
  // ===== STATE (상태) =====
  /** 사이드바 열림/닫힘 상태 */
  const isSidebarOpen = ref(false);

  /** 가계부 추가 모달 열림 상태 */
  const isAddLedgerModalOpen = ref(false);

  /** 날짜 상세 모달 열림 상태 */
  const isDateDetailModalOpen = ref(false);

  // 토스트 스택 형식으로 바꾸기 위해 배열로 변경
  const toasts = ref([]);

  /** 전역 로딩 상태 (전체 앱에 걸친 로딩 표시) */
  const isGlobalLoading = ref(false);
  const theme = ref("light"); //다크모드용
  // ===== GETTERS (계산된 값) =====
  /** 토스트 메시지가 있는지 여부 */
  const hasToast = computed(() => toasts.value.length > 0);
  const isDarkMode = computed(() => theme.value === "dark");
  const applyThemeToDom = () => {
    const root = document.documentElement;

    if (theme.value === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  };

  // ===== ACTIONS (액션들) =====

  /**
   * 사이드바 토글 (열림 ↔ 닫힘)
   */
  const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value;
  };

  /**
   * 가계부 추가 모달 열기
   */
  const openAddLedgerModal = () => {
    isAddLedgerModalOpen.value = true;
  };

  /**
   * 가계부 추가 모달 닫기
   */
  const closeAddLedgerModal = () => {
    isAddLedgerModalOpen.value = false;
  };

  /**
   * 날짜 상세 모달 열기
   */
  const openDateDetailModal = () => {
    isDateDetailModalOpen.value = true;
  };

  /**
   * 날짜 상세 모달 닫기
   */
  const closeDateDetailModal = () => {
    isDateDetailModalOpen.value = false;
  };

  const hideToast = (id) => {
    const target = toasts.value.find((toast) => toast.id === id);
    if (target) {
      target.visible = false;
    }
  };

  // 특정 토스트를 배열에서 완전히 제거
  const removeToast = (id) => {
    toasts.value = toasts.value.filter((toast) => toast.id !== id);
  };

  /**
   * 토스트 메시지 표시
   * @param {string} message - 표시할 메시지
   */
  const showToast = (message, type = "info") => {
    const validTypes = ["info", "success", "error", "warning"];
    const safeType = validTypes.includes(type) ? type : "info";

    const id = Date.now() + Math.random();

    toasts.value.push({
      id,
      message,
      type: safeType,
      visible: true,
    });

    // 3초 뒤 먼저 fade-out 상태로 변경
    setTimeout(() => {
      hideToast(id);
    }, 3000);

    // fade-out 애니메이션이 끝난 뒤 실제 제거
    setTimeout(() => {
      removeToast(id);
    }, 3300);
  };

  // 모든 토스트 제거
  const clearToast = () => {
    toasts.value = [];
  };

  /**
   * 전역 로딩 상태 설정
   * @param {boolean} value - 로딩 상태 (true: 로딩 중, false: 로딩 완료)
   */
  const setGlobalLoading = (value) => {
    isGlobalLoading.value = value;
  };
  const setTheme = (newTheme) => {
    theme.value = newTheme === "dark" ? "dark" : "light";
    localStorage.setItem(THEME_KEY, theme.value);
    applyThemeToDom();
  };

  const toggleTheme = () => {
    setTheme(theme.value === "dark" ? "light" : "dark");
  };

  const initTheme = () => {
    const savedTheme = localStorage.getItem(THEME_KEY);

    if (savedTheme === "dark" || savedTheme === "light") {
      theme.value = savedTheme;
    } else {
      theme.value = "light";
    }

    applyThemeToDom();
  };

  // ===== STORE 반환 =====
  return {
    // State
    isSidebarOpen,
    isAddLedgerModalOpen,
    isDateDetailModalOpen,
    toasts,
    isGlobalLoading,
    theme,

    // Getters
    hasToast,
    isDarkMode,
    // Actions
    toggleSidebar,
    openAddLedgerModal,
    closeAddLedgerModal,
    openDateDetailModal,
    closeDateDetailModal,
    showToast,
    hideToast,
    removeToast,
    clearToast,
    setGlobalLoading,

    setTheme,
    toggleTheme,
    initTheme,
  };
});
