<template>
  <div class="detail-card rounded-4 p-4 d-flex flex-column">
    <template v-if="dateString">
      <div class="mb-4">
        <h2 class="fs-5 fw-bold m-0">{{ displayDay }}일 상세 내역</h2>
        <p class="small sub-text m-0">{{ dateString }}</p>
      </div>

      <div class="row g-2 mb-4">
        <div class="col-6">
          <div class="income-box rounded-3 p-2 text-center">
            <div class="small sub-text">수입</div>
            <div class="fw-bold text-primary">
              +{{ income.toLocaleString() }}
            </div>
          </div>
        </div>
        <div class="col-6">
          <div class="expense-box rounded-3 p-2 text-center">
            <div class="small sub-text">지출</div>
            <div class="fw-bold expense-text">
              -{{ expense.toLocaleString() }}
            </div>
          </div>
        </div>
      </div>

      <div class="detail-list-container pe-1">
        <div v-if="details.length === 0" class="text-center py-5 sub-text">
          내역이 없습니다.
        </div>
        <div v-else class="d-flex flex-column gap-2 p-1">
          <div
            v-for="item in details"
            :key="item.id"
            @click="emit('itemClick', item)"
            class="detail-item rounded-3 p-3 d-flex align-items-center justify-content-between"
            style="cursor: pointer"
          >
            <div class="flex-grow-1 overflow-hidden">
              <div class="d-flex align-items-center gap-2 mb-1">
                <span
                  class="px-2 py-0.5 rounded-2 small fw-bold"
                  :class="
                    item.type === 'INCOME' ? 'income-badge' : 'expense-badge'
                  "
                >
                  {{ item.category }}
                </span>
              </div>
              <div
                v-if="item.memo"
                class="small sub-text text-truncate fw-medium"
              >
                {{ item.memo }}
              </div>
            </div>
            <div
              class="fw-bold ms-2 flex-shrink-0 fs-6"
              :class="item.type === 'INCOME' ? 'text-primary' : 'expense-text'"
            >
              {{ item.type === "INCOME" ? "+" : "-"
              }}{{ item.amount.toLocaleString() }}
            </div>
          </div>
        </div>
      </div>
    </template>

    <div
      v-else
      class="h-100 d-flex flex-column align-items-center justify-content-center text-center py-5"
    >
      <div class="empty-icon mb-3">📅</div>
      <h3 class="fs-6 fw-bold mb-1">상세 내역 확인</h3>
      <p class="small sub-text">
        달력에서 날짜를 클릭하여<br />수입/지출 내역을 확인하세요.
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
const props = defineProps({
  dateString: { type: String, default: "" },
  income: { type: Number, default: 0 },
  expense: { type: Number, default: 0 },
  details: { type: Array, default: () => [] },
});
const emit = defineEmits(["itemClick"]);
const displayDay = computed(() =>
  props.dateString ? Number(props.dateString.split("-")[2]) : "",
);
</script>

<style scoped>
.detail-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
  min-height: 480px;
}
.detail-list-container {
  max-height: 320px;
  overflow-y: auto;
}

/* 수입/지출 박스 */
.income-box {
  background: rgba(13, 110, 253, 0.08);
}
.expense-box {
  background: rgba(240, 68, 82, 0.08);
}
.expense-text {
  color: rgb(240, 68, 82);
}
.sub-text {
  color: var(--text-muted);
  font-size: 0.85rem;
}

/* 리스트 아이템 기본 스타일 */
.detail-item {
  background: var(--sub-bg);
  border: 2px solid transparent; /* 캘린더와 동일하게 기본 테두리 투명 */
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 1;
}

/* 마우스 호버 시 강조 효과 (캘린더 스타일 계승) */
.detail-item:hover {
  background: var(--card-bg) !important;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  transform: translateY(-3px);
  z-index: 2;
  border: 2px solid var(--kb-yellow, #ffcc50) !important;
}

/* 클릭 시 눌림 효과 */
.detail-item:active {
  transform: translateY(-1px);
}

.income-badge {
  background: rgba(13, 110, 253, 0.1);
  color: #0d6efd;
}
.expense-badge {
  background: rgba(240, 68, 82, 0.1);
  color: rgb(240, 68, 82);
}
.empty-icon {
  font-size: 2.5rem;
  opacity: 0.5;
}
</style>
