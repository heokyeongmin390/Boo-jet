<template>
  <div class="mypage-page">
    <div class="mypage-inner">
      <div
        class="mypage-header d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-3"
      >
        <div class="text-start">
          <h2 class="fs-4 fw-bold mb-1">마이페이지</h2>
          <p class="mypage-desc fw-medium m-0">
            개인 정보와 계정 상태를 확인하고 수정할 수 있어요.
          </p>
        </div>
      </div>

      <div class="row g-4 align-items-stretch">
        <div class="col-12 col-lg-5 col-xl-4 d-flex flex-column">
          <MyPageProfileCard
            class="flex-grow-1"
            :user="user"
            :profile-image-src="profileImageMap[selectedProfileImageKey]"
            :is-editing="isEditing"
            :profile-badge-label="profileBadgeLabel"
            :profile-badge-tone="profileBadgeTone"
            :special-badges="specialBadges"
            @open-profile-image-picker="$emit('open-profile-image-picker')"
          />
          <button class="btn btn-danger w-100 mt-3" @click="$emit('logout')">로그아웃</button>
        </div>

        <div class="col-12 col-lg-7 col-xl-8">
          <div
            class="mypage-detail-card p-3 p-md-4 p-lg-4 h-100 d-flex flex-column"
            style="border-radius: 2rem"
          >
            <div
              class="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between mb-4 gap-3"
            >
              <h4 class="fs-5 fw-bold m-0">상세 정보</h4>

              <div class="d-flex flex-wrap gap-2 ms-sm-auto">
                <button
                  v-if="!isEditing"
                  type="button"
                  class="btn custom-edit-btn btn-sm"
                  @click="$emit('edit-start')"
                >
                  <i class="fa-solid fa-pencil"></i>
                </button>

                <template v-else>
                  <button
                    type="button"
                    class="btn btn-outline-secondary btn-sm"
                    @click="$emit('edit-cancel')"
                  >
                    취소
                  </button>
                  <button
                    type="button"
                    class="btn btn-dark btn-sm"
                    :disabled="isSaving"
                    @click="$emit('save')"
                  >
                    {{ isSaving ? '저장 중..' : '저장' }}
                  </button>
                </template>
              </div>
            </div>

            <div v-if="errorMessage" class="alert alert-danger py-2 mb-4" role="alert">
              {{ errorMessage }}
            </div>

            <div class="d-flex flex-column gap-4">
              <MyPageFieldRow icon="badge" label="이름">
                <template #value>
                  <input
                    v-if="isEditing"
                    class="form-control"
                    type="text"
                    :value="form.name"
                    @input="
                      $emit('update:form', {
                        ...form,
                        name: $event.target.value,
                      })
                    "
                    placeholder="이름을 입력하세요"
                  />
                  <p v-else class="fw-bold m-0">{{ displayName }}</p>
                </template>
              </MyPageFieldRow>

              <MyPageFieldRow icon="mail" label="이메일 주소">
                <template #value>
                  <input
                    v-if="isEditing"
                    class="form-control"
                    type="email"
                    :value="form.email"
                    @input="
                      $emit('update:form', {
                        ...form,
                        email: $event.target.value,
                      })
                    "
                    placeholder="이메일을 입력하세요"
                  />
                  <p v-else class="fw-bold m-0">
                    {{ user?.email || '등록된 이메일이 없습니다.' }}
                  </p>
                </template>
              </MyPageFieldRow>

              <MyPageFieldRow icon="smartphone" label="전화번호">
                <template #value>
                  <input
                    v-if="isEditing"
                    class="form-control"
                    type="tel"
                    :value="form.phone"
                    @input="
                      $emit('update:form', {
                        ...form,
                        phone: $event.target.value,
                      })
                    "
                    placeholder="010-1234-5678"
                  />
                  <p v-else class="fw-bold m-0">
                    {{ user?.phone || '등록된 전화번호가 없습니다.' }}
                  </p>
                </template>
              </MyPageFieldRow>

              <MyPageFieldRow icon="calendar_month" label="가입일" :bordered="false">
                <template #value>
                  <p class="fw-bold m-0">{{ formattedJoinDate }}</p>
                </template>
              </MyPageFieldRow>
            </div>

            <div class="mt-4 pt-4 border-top">
              <div
                class="info-summary-box w-100 d-flex align-items-center justify-content-between px-4 py-3 rounded-4 text-start"
              >
                <div class="d-flex align-items-center gap-3 info-summary-left">
                  <span class="material-symbols-outlined info-summary-icon">account_circle</span>
                  <span class="small fw-bold m-0">
                    {{
                      isEditing
                        ? '수정 후 저장 버튼을 누르면 프로필이 반영됩니다.'
                        : '현재 로그인한 계정 정보를 보고 있어요.'
                    }}
                  </span>
                </div>
                <span class="material-symbols-outlined info-summary-icon">
                  {{ isEditing ? 'edit' : 'check_circle' }}
                </span>
              </div>
            </div>

            <div class="mt-auto pt-3 d-flex justify-content-end">
              <div class="profile-action-links">
                <button
                  type="button"
                  class="profile-text-action profile-text-action-primary"
                  @click="$emit('open-password-modal')"
                >
                  비밀번호 변경
                </button>
                <button
                  type="button"
                  class="profile-text-action profile-text-action-danger"
                  @click="$emit('open-delete-modal')"
                >
                  회원탈퇴
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-if="isProfileImagePickerOpen" class="password-modal-backdrop">
    <div
      class="password-modal-card profile-image-modal-card"
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-image-modal-title"
      @click.stop
    >
      <div class="d-flex align-items-start justify-content-between gap-3 mb-3">
        <div>
          <h5 id="profile-image-modal-title" class="fw-bold mb-1">프로필 사진 변경</h5>
          <p class="modal-desc small mb-0">마음에 드는 기본 프로필 이미지를 선택해주세요.</p>
        </div>
        <button
          type="button"
          class="btn-close"
          aria-label="닫기"
          @click="$emit('close-profile-image-picker')"
        ></button>
      </div>

      <div class="profile-image-picker-grid">
        <button
          v-for="imageKey in profileImageOptions"
          :key="imageKey"
          type="button"
          class="profile-image-option"
          :class="{ active: selectedProfileImageKey === imageKey }"
          @click="$emit('update:selected-profile-image-key', imageKey)"
        >
          <img
            :src="profileImageMap[imageKey]"
            :alt="imageKey"
            class="profile-image-option-img"
          />
        </button>
      </div>

      <div class="d-flex justify-content-end mt-4">
        <button
          type="button"
          class="btn btn-outline-secondary"
          @click="$emit('close-profile-image-picker')"
        >
          닫기
        </button>
      </div>
    </div>
  </div>

  <div v-if="isPasswordModalOpen" class="password-modal-backdrop">
    <div
      class="password-modal-card"
      role="dialog"
      aria-modal="true"
      aria-labelledby="password-modal-title"
      @click.stop
    >
      <div class="d-flex align-items-start justify-content-between gap-3 mb-3">
        <div>
          <h5 id="password-modal-title" class="fw-bold mb-1">비밀번호 변경</h5>
          <p class="modal-desc small mb-0">
            현재 비밀번호를 확인하고 새로운 비밀번호를 입력해주세요.
          </p>
        </div>
        <button
          type="button"
          class="btn-close"
          aria-label="닫기"
          @click="$emit('close-password-modal')"
        ></button>
      </div>

      <div class="d-flex flex-column gap-3">
        <div>
          <label class="form-label fw-semibold small">현재 비밀번호</label>
          <input
            class="form-control"
            type="password"
            :value="passwordForm.currentPassword"
            @input="
              $emit('update:password-form', {
                ...passwordForm,
                currentPassword: $event.target.value,
              })
            "
            placeholder="현재 비밀번호를 입력하세요"
          />
        </div>

        <div>
          <label class="form-label fw-semibold small">새 비밀번호</label>
          <input
            class="form-control"
            type="password"
            :value="passwordForm.newPassword"
            @input="
              $emit('update:password-form', {
                ...passwordForm,
                newPassword: $event.target.value,
              })
            "
            placeholder="새 비밀번호를 입력하세요"
          />
        </div>

        <div>
          <label class="form-label fw-semibold small">새 비밀번호 확인</label>
          <input
            class="form-control"
            type="password"
            :value="passwordForm.confirmPassword"
            @input="
              $emit('update:password-form', {
                ...passwordForm,
                confirmPassword: $event.target.value,
              })
            "
            placeholder="새 비밀번호를 다시 입력하세요"
          />
        </div>
      </div>

      <div v-if="passwordErrorMessage" class="alert alert-danger py-2 mt-3 mb-0" role="alert">
        {{ passwordErrorMessage }}
      </div>
      <div class="d-flex justify-content-end gap-2 mt-4">
        <button
          type="button"
          class="btn btn-outline-secondary"
          @click="$emit('close-password-modal')"
        >
          취소
        </button>
        <button
          type="button"
          class="btn btn-dark"
          :disabled="isPasswordSaving"
          @click="$emit('password-change')"
        >
          {{ isPasswordSaving ? '변경 중..' : '확인' }}
        </button>
      </div>
    </div>
  </div>

  <div v-if="isLogoutModalOpen" class="password-modal-backdrop">
    <div
      class="password-modal-card logout-modal-card"
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-modal-title"
      @click.stop
    >
      <div class="d-flex align-items-start justify-content-between gap-3 mb-3">
        <div>
          <h5 id="logout-modal-title" class="fw-bold mb-1">로그아웃</h5>
          <p class="modal-desc small mb-0">정말 로그아웃 하시겠어요?</p>
        </div>
        <button
          type="button"
          class="btn-close"
          aria-label="닫기"
          @click="$emit('close-logout-modal')"
        ></button>
      </div>

      <div class="logout-modal-copy">
        현재 세션을 종료하고 로그인 페이지로 이동합니다.
      </div>

      <div class="d-flex justify-content-end gap-2 mt-4">
        <button
          type="button"
          class="btn btn-outline-secondary"
          @click="$emit('close-logout-modal')"
        >
          취소
        </button>
        <button type="button" class="btn btn-dark" @click="$emit('confirm-logout')">
          로그아웃
        </button>
      </div>
    </div>
  </div>

  <div v-if="isDeleteModalOpen" class="password-modal-backdrop">
    <div
      class="password-modal-card delete-modal-card"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
      @click.stop
    >
      <div class="d-flex align-items-start justify-content-between gap-3 mb-3">
        <div>
          <h5 id="delete-modal-title" class="fw-bold mb-1 text-danger">회원탈퇴</h5>
          <p class="modal-desc small mb-0">탈퇴 전 아래 내용을 꼭 확인해주세요.</p>
        </div>
        <button
          type="button"
          class="btn-close"
          aria-label="닫기"
          @click="$emit('close-delete-modal')"
        ></button>
      </div>

      <ViewCharacter
        type="withdraw"
        message="정말 회원탈퇴를 진행하시겠어요?"
        :size="320"
      />

      <div class="delete-warning-box">
        <div class="d-flex align-items-center gap-2 mb-2 text-danger fw-bold">
          <i class="fa-solid fa-triangle-exclamation"></i>
          <span>주의</span>
        </div>

        <p class="mb-2">회원탈퇴를 진행하면 현재 계정 정보가 삭제됩니다.</p>
        <p class="mb-2">
          Mock 서버 환경에서는 데이터 정합성을 위해 거래내역, 커플 정보, 커플 요청 데이터도
          함께 정리됩니다.
        </p>
        <p class="mb-0 fw-semibold">이 작업은 되돌릴 수 없습니다.</p>
      </div>

      <ul class="delete-checklist mt-3 mb-0">
        <li>계정 정보가 삭제됩니다.</li>
        <li>로그인 세션이 종료됩니다.</li>
        <li>관련 Mock 데이터가 함께 정리됩니다.</li>
      </ul>

      <div class="d-flex justify-content-end gap-2 mt-4">
        <button
          type="button"
          class="btn btn-outline-secondary"
          @click="$emit('close-delete-modal')"
        >
          취소
        </button>
        <button
          type="button"
          class="btn btn-danger"
          :disabled="isDeletingAccount"
          @click="$emit('confirm-delete-account')"
        >
          {{ isDeletingAccount ? '회원탈퇴 처리 중..' : '회원탈퇴' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import ViewCharacter from '@/components/common/ViewCharacter.vue';
import MyPageFieldRow from '@/components/mypage/MyPageFieldRow.vue';
import MyPageProfileCard from '@/components/mypage/MyPageProfileCard.vue';

const props = defineProps({
  user: {
    type: Object,
    default: () => ({}),
  },
  form: {
    type: Object,
    default: () => ({
      name: '',
      email: '',
      phone: '',
    }),
  },
  isEditing: {
    type: Boolean,
    default: false,
  },
  isSaving: {
    type: Boolean,
    default: false,
  },
  errorMessage: {
    type: String,
    default: '',
  },
  isPasswordModalOpen: {
    type: Boolean,
    default: false,
  },
  passwordForm: {
    type: Object,
    default: () => ({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }),
  },
  passwordErrorMessage: {
    type: String,
    default: '',
  },
  isPasswordSaving: {
    type: Boolean,
    default: false,
  },
  isLogoutModalOpen: {
    type: Boolean,
    default: false,
  },
  isDeleteModalOpen: {
    type: Boolean,
    default: false,
  },
  isDeletingAccount: {
    type: Boolean,
    default: false,
  },
  isProfileImagePickerOpen: {
    type: Boolean,
    default: false,
  },
  selectedProfileImageKey: {
    type: String,
    default: 'profile-1',
  },
  profileImageOptions: {
    type: Array,
    default: () => [],
  },
  profileImageMap: {
    type: Object,
    default: () => ({}),
  },
  profileBadgeLabel: {
    type: String,
    default: '개인 회원',
  },
  profileBadgeTone: {
    type: String,
    default: 'default',
  },
  specialBadges: {
    type: Array,
    default: () => [],
  },
});

defineEmits([
  'logout',
  'open-profile-image-picker',
  'close-profile-image-picker',
  'confirm-logout',
  'edit-start',
  'edit-cancel',
  'save',
  'update:form',
  'open-password-modal',
  'close-password-modal',
  'password-change',
  'update:password-form',
  'close-logout-modal',
  'open-delete-modal',
  'close-delete-modal',
  'confirm-delete-account',
  'update:selected-profile-image-key',
]);

const displayName = computed(() => props.user?.name || props.user?.nickname || '사용자');

const formattedJoinDate = computed(() => {
  if (!props.user?.createdAt) {
    return '가입일 정보가 없습니다.';
  }

  const date = new Date(props.user.createdAt);

  if (Number.isNaN(date.getTime())) {
    return '가입일 정보가 없습니다.';
  }

  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
});
</script>

<style scoped>
.material-symbols-outlined {
  font-variation-settings:
    'FILL' 0,
    'wght' 400,
    'GRAD' 0,
    'opsz' 24;
}

.mypage-inner {
  max-width: 86rem;
  margin: 0 auto;
  padding: 5.5rem 1.5rem 1.5rem;
}

.custom-edit-btn {
  color: #4f473d;
  background-color: #fff3c4;
  border: 1px solid #e0b93f;
  border-radius: 0.75rem;
  font-weight: 700;
  padding: 0.45rem 1rem;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease,
    box-shadow 0.2s ease;
}

.custom-edit-btn:hover {
  color: #3f392f;
  background-color: #ffe082;
  border-color: #cfa62b;
  box-shadow: 0 4px 12px rgba(224, 185, 63, 0.22);
}

.profile-action-links {
  display: flex;
  justify-content: flex-end;
  gap: 0.9rem;
  flex-wrap: wrap;
}

.profile-text-action {
  padding: 0;
  border: none;
  background: transparent;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    color 0.2s ease,
    opacity 0.2s ease;
}

.profile-text-action:hover {
  opacity: 0.75;
  text-decoration: underline;
}

.profile-text-action-primary {
  color: #0d6efd;
}

.profile-text-action-danger {
  color: #dc3545;
}

.form-control {
  background-color: var(--sub-bg);
  border: 1px solid var(--border-light);
  color: var(--text-color);
}

.form-control::placeholder {
  color: var(--text-muted);
}

.form-control:focus {
  background-color: var(--sub-bg);
  color: var(--text-color);
  border-color: var(--kb-yellow);
  box-shadow: 0 0 0 0.2rem rgba(255, 188, 0, 0.16);
}

.form-label {
  color: var(--text-color);
}

.info-summary-box {
  border-radius: 1.25rem;
}

@media (max-width: 768px) {
  .custom-edit-btn {
    width: 100%;
    justify-content: center;
  }

  .profile-action-links {
    justify-content: flex-start;
    gap: 0.75rem;
  }

  .profile-text-action {
    font-size: 0.88rem;
  }
}

.mypage-page {
  min-height: 100vh;
  width: calc(100% + 3rem);
  margin: -1.5rem;
  background: var(--page-bg);
  color: var(--text-color);
}

.mypage-detail-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
}

.mypage-desc {
  color: var(--text-muted);
}

.info-summary-box {
  background: var(--sub-bg);
  border: 1px solid var(--border-color);
  color: var(--text-color);
}

.info-summary-left {
  color: var(--text-color);
}

.info-summary-icon {
  color: var(--text-muted);
}

.modal-desc {
  color: var(--text-muted);
}

.password-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1050;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  overflow-y: auto;
  background-color: rgba(17, 24, 39, 0.45);
}

.mypage-header {
  margin-bottom: 2rem;
}

@media (min-width: 768px) {
  .mypage-header {
    margin-bottom: 1.5rem;
  }
}

.password-modal-card {
  width: min(100%, 30rem);
  max-height: calc(100dvh - 2rem);
  border: 1px solid var(--border-color);
  border-radius: 1.25rem;
  background-color: var(--card-bg);
  color: var(--text-color);
  box-shadow: 0 1.25rem 2.5rem rgba(15, 23, 42, 0.18);
  padding: 1.25rem;
  overflow-y: auto;
}

@media (min-width: 768px) {
  .mypage-page {
    width: calc(100% + 6rem);
    margin: -3rem;
  }

  .mypage-inner {
    padding: 5.5rem 1.5rem 1.5rem;
  }
}

@media (max-width: 768px) {
  .password-modal-card {
    width: 100%;
    max-height: calc(100dvh - 1.5rem);
    padding: 1rem;
    border-radius: 1rem;
  }

  .profile-image-picker-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.password-error-text {
  margin-top: 0.75rem;
  color: #dc3545;
  font-size: 0.92rem;
  font-weight: 500;
}

.profile-image-modal-card {
  width: min(100%, 34rem);
}

.profile-image-picker-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.9rem;
}

.profile-image-option {
  padding: 0.35rem;
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  background: var(--sub-bg);
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.profile-image-option:hover {
  transform: translateY(-2px);
  border-color: var(--kb-yellow);
  box-shadow: 0 10px 24px rgba(255, 188, 0, 0.18);
}

.profile-image-option.active {
  border-color: var(--kb-yellow);
  box-shadow: 0 0 0 0.2rem rgba(255, 188, 0, 0.16);
}

.profile-image-option-img {
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: 0.8rem;
  display: block;
}

.logout-modal-card {
  width: min(100%, 26rem);
}

.logout-modal-copy {
  border-radius: 1rem;
  border: 1px solid var(--border-color);
  background: var(--sub-bg);
  padding: 1rem;
  color: var(--text-color);
  line-height: 1.55;
}

.delete-modal-card {
  width: min(100%, 32rem);
}

.delete-warning-box {
  border-radius: 1rem;
  border: 1px solid rgba(220, 53, 69, 0.35);
  background: rgba(220, 53, 69, 0.08);
  padding: 1rem;
  color: var(--text-color);
}

.delete-checklist {
  padding-left: 1.2rem;
  color: var(--text-muted);
  font-size: 0.95rem;
}

.delete-checklist li + li {
  margin-top: 0.35rem;
}

.btn-danger:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
