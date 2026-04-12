<template>
  <div
    class="d-flex flex-column align-items-center p-4 h-100 profile-card"
    style="border-radius: 2rem"
  >
    <div class="d-flex align-items-center justify-content-center mb-4 profile-badge">
      <img
        v-if="profileImageSrc"
        :src="profileImageSrc"
        alt="프로필 이미지"
        class="profile-image"
      />
      <span v-else class="display-5 fw-bold text-secondary">{{ userInitial }}</span>
      <button
        v-if="isEditing"
        type="button"
        class="profile-image-edit-btn"
        aria-label="프로필 사진 변경"
        @click="$emit('open-profile-image-picker')"
      >
        <i class="fa-solid fa-camera"></i>
      </button>
    </div>

    <div class="text-center">
      <h3 class="fs-3 fw-bold mb-1">{{ displayName }}</h3>
      <p class="small profile-subtext m-0">회원 ID: {{ user?.id ?? 'N/A' }}</p>
    </div>

    <div class="mt-4 d-flex flex-wrap justify-content-center gap-2">
      <span
        class="member-badge px-3 py-1 small fw-bold rounded-pill"
        :class="`member-badge-${profileBadgeTone}`"
      >
        {{ profileBadgeLabel }}
      </span>
      <span
        v-for="badge in specialBadges"
        :key="badge.label"
        class="special-badge px-3 py-1 small fw-bold rounded-pill"
        :class="`special-badge-${badge.tone}`"
      >
        {{ badge.label }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  user: {
    type: Object,
    default: () => ({}),
  },
  profileImageSrc: {
    type: String,
    default: '',
  },
  isEditing: {
    type: Boolean,
    default: false,
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

defineEmits(['open-profile-image-picker']);

const displayName = computed(() => props.user?.name || props.user?.nickname || '사용자');
const userInitial = computed(() => displayName.value.charAt(0).toUpperCase());
</script>

<style scoped>
.profile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  display: block;
}

.profile-badge {
  position: relative;
  padding: 0.22rem;
  border-radius: 50%;

  flex-shrink: 0;
}

.profile-image-edit-btn {
  position: absolute;
  right: 8%;
  bottom: 6%;
  width: clamp(2.8rem, 6.5vw, 3.6rem);
  height: clamp(2.8rem, 6.5vw, 3.6rem);
  border: 3px solid #fff;
  border-radius: 50%;
  background: #ffcc50;
  color: #4f473d;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 18px rgba(79, 71, 61, 0.18);
  transition:
    transform 0.2s ease,
    background-color 0.2s ease,
    box-shadow 0.2s ease;
  z-index: 1;
}

.profile-image-edit-btn i {
  font-size: clamp(1.15rem, 2.7vw, 1.5rem);
  line-height: 1;
  display: block;
}

.profile-image-edit-btn:hover {
  background: #ffbc00;
  transform: translateY(-1px);
  box-shadow: 0 10px 22px rgba(79, 71, 61, 0.24);
}

.profile-card {
  min-width: 220px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
}

.profile-subtext {
  color: var(--text-muted);
}

.member-badge {
  background: var(--sub-bg);
  color: var(--text-color);
  border: 1px solid var(--border-light);
}

.member-badge-pending {
  background: rgba(255, 188, 0, 0.14);
  color: #8a6500;
  border-color: rgba(255, 188, 0, 0.35);
}

.member-badge-couple {
  background: rgba(236, 72, 153, 0.14);
  color: #be185d;
  border-color: rgba(236, 72, 153, 0.28);
}

.special-badge {
  border: 1px solid transparent;
}

.special-badge-profile-complete {
  background: rgba(16, 185, 129, 0.14);
  color: #047857;
  border-color: rgba(16, 185, 129, 0.24);
}

.special-badge-newcomer {
  background: rgba(59, 130, 246, 0.14);
  color: #1d4ed8;
  border-color: rgba(59, 130, 246, 0.24);
}

.special-badge-popular {
  background: rgba(245, 158, 11, 0.14);
  color: #b45309;
  border-color: rgba(245, 158, 11, 0.24);
}

@media (max-width: 768px) {
  .profile-image-edit-btn {
    right: 7%;
    bottom: 5%;
    border-width: 2px;
  }

  .profile-image-edit-btn:hover {
    transform: translateY(-1px);
  }
}

</style>
