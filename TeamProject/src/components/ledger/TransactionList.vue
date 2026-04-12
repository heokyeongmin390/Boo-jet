<template>
  <div class="ledger-card rounded-4 p-4" style="min-height: 400px">
    <div class="d-flex align-items-center justify-content-between mb-4">
      <h3 class="fw-bold m-0 fs-5">
        거래 내역
        <span v-if="selectedCategory" class="small fw-normal list-subtext ms-2">
          ({{ selectedCategory }})
        </span>
      </h3>

      <div v-if="selectedCategory" class="small list-subtext">
        {{ filteredTransactions.length }}건 검색됨
      </div>
    </div>

    <div
      v-if="filteredTransactions.length === 0"
      class="text-center py-5 list-subtext"
    >
      이번 달 거래 내역이 없습니다.
    </div>

    <div class="d-flex flex-column gap-3">
      <div
        v-for="transaction in filteredTransactions"
        :key="transaction.id"
        @click="handleItemClick(transaction)"
        class="transaction-row d-flex align-items-center justify-content-between p-3 rounded-3"
      >
        <div class="d-flex align-items-center gap-3">
          <div
            class="transaction-icon d-flex align-items-center justify-content-center rounded-3"
            :class="
              transaction.type === 'INCOME'
                ? 'transaction-icon-income'
                : 'transaction-icon-expense'
            "
          >
            <ArrowUpRight
              v-if="transaction.type === 'INCOME'"
              class="text-primary"
              style="width: 20px; height: 20px"
            />
            <ArrowDownRight
              v-else
              class="expense-arrow"
              style="width: 20px; height: 20px"
            />
          </div>

          <div>
            <div class="fw-bold mb-0">
              {{ transaction.memo || "내역 없음" }}
            </div>
            <div class="small list-subtext mb-0 fw-medium">
              {{ transaction.category }} · {{ formatDate(transaction.date) }}
            </div>
          </div>
        </div>

        <div
          class="fw-bold fs-5"
          :class="
            transaction.type === 'INCOME' ? 'text-primary' : 'expense-text'
          "
        >
          {{ transaction.type === "INCOME" ? "+" : "-"
          }}{{ transaction.amount.toLocaleString() }}원
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { ArrowDownRight, ArrowUpRight } from "lucide-vue-next";
import { useLedgerStore } from "@/stores/ledger";

const props = defineProps({
  selectedCategory: {
    type: String,
    default: null,
  },
});

// 부모(LedgerPage)로 클릭된 아이템을 전달하기 위한 emit 정의
const emit = defineEmits(["itemClick"]);

const ledgerStore = useLedgerStore();

const filteredTransactions = computed(() => {
  const data = ledgerStore.monthlyTransactions;
  if (props.selectedCategory) {
    return data.filter(
      (t) => t.category === props.selectedCategory && t.type === "EXPENSE",
    );
  }
  return data;
});

// 클릭 처리 함수
const handleItemClick = (item) => {
  emit("itemClick", item);
};

// 날짜 포맷팅 유틸리티
const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString("ko-KR", {
    month: "long",
    day: "numeric",
  });
};
</script>

<style scoped>
.ledger-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
}

.list-subtext {
  color: var(--text-muted);
}

/* 개별 행 스타일 및 애니메이션 */
.transaction-row {
  cursor: pointer;
  background: transparent;
  border: 2px solid transparent; /* 강조 테두리 준비 */
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

/* 마우스 올렸을 때 강조 효과 (캘린더/상세내역과 통일) */
.transaction-row:hover {
  background: var(--sub-bg) !important;
  border: 2px solid var(--kb-yellow, #ffcc50) !important;
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.08);
  z-index: 2;
}

/* 클릭 시 눌림 효과 */
.transaction-row:active {
  transform: translateY(-1px);
}

.transaction-icon {
  width: 44px;
  height: 44px;
}

.transaction-icon-income {
  background-color: rgba(13, 110, 253, 0.1);
}

.transaction-icon-expense {
  background-color: rgba(240, 68, 82, 0.1);
}

.expense-arrow,
.expense-text {
  color: rgb(240, 68, 82);
}
</style>
