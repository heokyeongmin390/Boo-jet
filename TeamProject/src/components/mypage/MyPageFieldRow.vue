<template>
  <!--
    이름/이메일/전화번호/가입일처럼
    "아이콘 + 라벨 + 값" 구조가 같은 줄 UI를 재사용하기 위한 컴포넌트다.

    실제 값은 slot으로 주입받기 때문에,
    보기 모드 문구든 input이든 모두 같은 레이아웃 안에 넣을 수 있다.
  -->
  <div
    class="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-3 pb-3"
    :class="{ 'border-bottom': bordered }"
  >
    <div class="d-flex align-items-center gap-3 flex-grow-1">
      <div
        class="detail-icon-wrap rounded-circle d-flex align-items-center justify-content-center"
      >
        <span class="material-symbols-outlined detail-icon-symbol">{{
          icon
        }}</span>
      </div>
      <div class="flex-grow-1">
        <p class="small field-label mb-1 d-block">{{ label }}</p>
        <slot name="value" />
      </div>
    </div>

    <!-- badge 슬롯은 전화번호 상태처럼 오른쪽 보조 표시가 필요할 때만 사용 -->
    <slot name="badge" />
  </div>
</template>

<script setup>
defineProps({
  // 머티리얼 심볼 아이콘 이름
  icon: {
    type: String,
    required: true,
  },
  // 줄 왼쪽에 표시할 항목명
  label: {
    type: String,
    required: true,
  },
  // 마지막 줄은 border-bottom을 빼기 위해 false로 넘길 수 있다.
  bordered: {
    type: Boolean,
    default: true,
  },
});
</script>

<style scoped>
.material-symbols-outlined {
  font-variation-settings:
    "FILL" 0,
    "wght" 400,
    "GRAD" 0,
    "opsz" 24;
}

.detail-icon {
  width: 40px;
  height: 40px;
}
.detail-icon-wrap {
  width: 40px;
  height: 40px;
  background: var(--sub-bg);
  color: var(--text-muted);
}

.detail-icon-symbol {
  color: inherit;
}

.field-label {
  color: var(--text-muted);
}
</style>
