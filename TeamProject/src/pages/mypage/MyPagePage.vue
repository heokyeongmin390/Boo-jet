<template>
  <!--
    MyPageContent 화면을 표시합니다.
    실제 상태(form, isEditing, 각종 모달 상태)는 이 페이지가 소유합니다.
  -->
  <DelayModal
    :is-open="isProfileSaving"
    type="loading"
    message="프로필을 저장하고 있어요.."
    :size="1000"
  />
  <DelayModal
    :is-open="isDeletingAccount"
    type="withdraw"
    message="회원 탈퇴를 진행하고 있어요.."
    :size="1000"
  />
  <DelayModal :is-open="isLoggingOut" type="goodbye" message="금방 돌아오실거죠?" :size="1000" />
  <MyPageContent
    :user="authStore.user"
    :form="form"
    :is-editing="isEditing"
    :is-saving="isSaving"
    :error-message="authStore.errorMessage"
    :is-password-modal-open="isPasswordModalOpen"
    :password-form="passwordForm"
    :password-error-message="passwordErrorMessage"
    :is-password-saving="isPasswordSaving"
    :is-logout-modal-open="isLogoutModalOpen"
    :is-delete-modal-open="isDeleteModalOpen"
    :is-deleting-account="isDeletingAccount"
    :is-profile-image-picker-open="isProfileImagePickerOpen"
    :selected-profile-image-key="selectedProfileImageKey"
    :profile-image-options="profileImageOptions"
    :profile-image-map="profileImage"
    :profile-badge-label="profileBadge.label"
    :profile-badge-tone="profileBadge.tone"
    :special-badges="specialBadges"
    @open-profile-image-picker="openProfileImagePicker"
    @close-profile-image-picker="closeProfileImagePicker"
    @update:selected-profile-image-key="selectedProfileImageKey = $event"
    @update:form="form = $event"
    @edit-start="handleEditStart"
    @edit-cancel="handleEditCancel"
    @save="handleSave"
    @logout="openLogoutModal"
    @confirm-logout="handleLogout"
    @close-logout-modal="closeLogoutModal"
    @open-password-modal="openPasswordModal"
    @close-password-modal="closePasswordModal"
    @update:password-form="passwordForm = $event"
    @password-change="handlePasswordChange"
    @delete-account="handleDeleteAccount"
    @open-delete-modal="openDeleteModal"
    @close-delete-modal="closeDeleteModal"
    @confirm-delete-account="handleDeleteAccount"
  />
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { usecouplesStore } from '@/stores/couples';
import { useUiStore } from '@/stores/ui';
import MyPageContent from '@/components/mypage/MyPageContent.vue';
import DelayModal from '@/components/common/DelayModal.vue';
import { mockDelay } from '@/service/mockDelay';

import { withdrawUser } from '@/service/withdrawUser';

import {
  profileImages as profileImage,
  profileImageOptions,
  DEFAULT_PROFILE_IMAGE_KEY,
} from '@/components/common/profileImages.js';

const authStore = useAuthStore();
const couplesStore = usecouplesStore();
const uiStore = useUiStore();
const router = useRouter();

/**
 * 마이페이지가 현재 수정 모드인지 여부
 *
 * false면 보기 모드, true면 input이 보이는 편집 모드입니다.
 */
const isEditing = ref(false);

/**
 * 마이페이지 편집용 로컬 폼 상태
 *
 * authStore.user를 직접 수정하지 않고,
 * 편집 중에는 별도의 form 객체로 복사해서 다룹니다.
 * 그래서 사용자가 취소를 눌러도 원본을 안전하게 유지할 수 있습니다.
 */
const form = ref({
  name: '',
  email: '',
  phone: '',
});

const selectedProfileImageKey = ref(DEFAULT_PROFILE_IMAGE_KEY);

// 비밀번호 변경 관련 상태
const isPasswordModalOpen = ref(false);

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
});

const passwordErrorMessage = ref('');

const isPasswordSaving = ref(false);
const isProfileSaving = ref(false);
const isLogoutModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const isDeletingAccount = ref(false);
const isLoggingOut = ref(false);
const isProfileImagePickerOpen = ref(false);

const profileBadge = computed(() => {
  if (couplesStore.coupleCount > 0) {
    return {
      label: '커플 회원',
      tone: 'couple',
    };
  }

  if (couplesStore.pendingReceivedRequests.length > 0 || couplesStore.pendingSentRequests.length > 0) {
    return {
      label: '연결 대기',
      tone: 'pending',
    };
  }

  return {
    label: '개인 회원',
    tone: 'default',
  };
});

const specialBadges = computed(() => {
  const badges = [];
  const hasCustomProfileImage =
    !!authStore.user?.profileImageKey &&
    authStore.user.profileImageKey !== DEFAULT_PROFILE_IMAGE_KEY;
  const createdAt = authStore.user?.createdAt ? new Date(authStore.user.createdAt) : null;
  const isNewMember =
    createdAt instanceof Date &&
    !Number.isNaN(createdAt.getTime()) &&
    Date.now() - createdAt.getTime() <= 7 * 24 * 60 * 60 * 1000;

  if (isNewMember) {
    badges.push({
      label: '새내기 회원',
      tone: 'newcomer',
    });
  }

  if (
    authStore.user?.name?.trim() &&
    authStore.user?.email?.trim() &&
    authStore.user?.phone?.trim() &&
    hasCustomProfileImage
  ) {
    badges.push({
      label: '프로필 완성',
      tone: 'profile-complete',
    });
  }

  if (couplesStore.pendingReceivedRequests.length >= 2) {
    badges.push({
      label: '인기 회원',
      tone: 'popular',
    });
  }

  return badges;
});

/**
 * 현재 로그인 사용자의 정보를 form으로 복사합니다.
 *
 * 사용 시점:
 * - 페이지 첫 진입
 * - 편집 시작 직전
 * - 편집 취소 직후
 * - 저장 성공 직후
 */
const syncForm = () => {
  form.value = {
    name: authStore.user?.name || '',
    email: authStore.user?.email || '',
    phone: authStore.user?.phone || '',
  };

  selectedProfileImageKey.value =
    authStore.user?.profileImageKey && profileImage[authStore.user.profileImageKey]
      ? authStore.user.profileImageKey
      : DEFAULT_PROFILE_IMAGE_KEY;
};

/**
 * 페이지 진입 시 현재 로그인 사용자 정보를 복원합니다.
 *
 * 로그인 정보가 없으면 마이페이지를 볼 수 없으므로
 * 로그인 페이지로 이동시킵니다.
 */
const loadCoupleStatus = async () => {
  if (!authStore.user?.id) return;

  try {
    await Promise.all([
      couplesStore.fetchcouples(authStore.user.id),
      couplesStore.fetchReceivedRequests(authStore.user.id),
      couplesStore.fetchSentRequests(authStore.user.id),
    ]);
  } catch (error) {
    console.error('커플 상태 불러오기 실패:', error);
  }
};

onMounted(async () => {
  authStore.loadUserFromStorage();
  authStore.clearError();
  if (!authStore.user) {
    router.push({ name: 'login' });
    return;
  }

  syncForm();
  await loadCoupleStatus();
});

/**
 * 로그아웃 버튼 처리
 *
 * 확인 모달을 닫고 로딩을 보여준 뒤 authStore.logout을 실행하고
 * 로그인 페이지로 이동합니다.
 */
const handleLogout = async () => {
  closeLogoutModal();
  isLoggingOut.value = true;
  await mockDelay();
  authStore.logout();
  uiStore.showToast('로그아웃 했습니다.');
  isLoggingOut.value = false;
  router.push({ name: 'login' });
};

const openLogoutModal = () => {
  isLogoutModalOpen.value = true;
};

const closeLogoutModal = () => {
  isLogoutModalOpen.value = false;
};

const openProfileImagePicker = () => {
  if (!isEditing.value) return;
  isProfileImagePickerOpen.value = true;
};

const closeProfileImagePicker = () => {
  isProfileImagePickerOpen.value = false;
};

/**
 * 편집 시작 처리
 *
 * 최신 사용자 정보를 form에 다시 채우고
 * 이전 에러 메시지를 지운 뒤 편집 모드로 전환합니다.
 */
const handleEditStart = () => {
  syncForm();
  authStore.clearError();
  isEditing.value = true;
};

/**
 * 편집 취소 처리
 *
 * 서버 요청 없이 로컬 form만 원래 값으로 되돌리고
 * 편집 모드를 종료합니다.
 */
const handleEditCancel = () => {
  closeProfileImagePicker();
  syncForm();
  authStore.clearError();
  isEditing.value = false;
};

/**
 * 저장 버튼 처리
 *
 * 흐름:
 * 1. 입력값 trim
 * 2. 이름/이메일/전화번호 기본 검증
 * 3. authStore.updateProfile 호출
 * 4. 성공 시 편집 모드 종료 + 토스트 표시
 */
const handleSave = async () => {
  const trimmedName = form.value.name.trim();
  const trimmedEmail = form.value.email.trim();
  const trimmedPhone = form.value.phone.trim();

  authStore.clearError();

  if (!trimmedName) {
    authStore.errorMessage = '이름을 입력해주세요.';
    return;
  }

  if (!trimmedEmail) {
    authStore.errorMessage = '이메일을 입력해주세요.';
    return;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(trimmedEmail)) {
    authStore.errorMessage = '올바른 이메일 형식을 입력해주세요.';
    return;
  }

  if (!trimmedPhone) {
    authStore.errorMessage = '전화번호를 입력해주세요.';
    return;
  }

  isProfileSaving.value = true;
  const result = await authStore.updateProfile({
    name: trimmedName,
    email: trimmedEmail,
    phone: trimmedPhone,
    profileImageKey: selectedProfileImageKey.value,
  });
  isProfileSaving.value = false;

  if (result.success) {
    closeProfileImagePicker();
    // 편집 모드 종료 및 성공 메시지 표시
    isEditing.value = false;
    // form 동기화 (최신 사용자 정보로 업데이트)
    syncForm();
    uiStore.showToast('프로필 정보가 저장되었습니다.');
  }
};

/**
 * 저장 중 여부를 보여주는 계산값
 *
 * 실제 값은 authStore.isLoading이지만,
 * 템플릿에서는 isSaving이라는 이름이 더 읽기 쉽습니다.
 */
const isSaving = computed(() => authStore.isLoading);

// 모달 열기/닫기 함수
const openPasswordModal = () => {
  passwordForm.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };
  passwordErrorMessage.value = '';
  isPasswordModalOpen.value = true;
};

const closePasswordModal = () => {
  isPasswordModalOpen.value = false;
  passwordErrorMessage.value = '';
  passwordForm.value = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };
};

const openDeleteModal = () => {
  isDeleteModalOpen.value = true;
};

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false;
};

// 비밀번호 변경 처리
const handlePasswordChange = async () => {
  passwordErrorMessage.value = '';
  isPasswordSaving.value = true;

  const result = await authStore.changePassword({
    currentPassword: passwordForm.value.currentPassword,
    newPassword: passwordForm.value.newPassword,
    confirmPassword: passwordForm.value.confirmPassword,
  });

  isPasswordSaving.value = false;

  if (!result.success) {
    passwordErrorMessage.value = result.message;
    return;
  }

  uiStore.showToast('비밀번호가 변경되었습니다.');
  closePasswordModal();
};

// 계정 삭제 처리
const handleDeleteAccount = async () => {
  if (isDeletingAccount.value) return;

  closeDeleteModal();
  isDeletingAccount.value = true;

  try {
    await withdrawUser(authStore.user.id);
    authStore.logout();
    uiStore.showToast('계정을 삭제했습니다.');
    router.push({ name: 'login' });
  } catch (error) {
    console.error('회원탈퇴 실패:', error);
    uiStore.showToast('계정 삭제에 실패했습니다.', 'error');
  } finally {
    isDeletingAccount.value = false;
  }
};
</script>
