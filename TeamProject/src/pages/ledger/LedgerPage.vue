<template>
  <div class="ledger-page">
    <div class="ledger-inner">
      <div class="d-flex flex-column gap-4">
        <div class="d-flex align-items-center justify-content-between">
          <h2 class="fs-4 fw-bold mb-0 ledger-title">
            {{ ledgerDate.getFullYear() }}년 {{ ledgerDate.getMonth() + 1 }}월
          </h2>

          <div class="d-flex gap-2">
            <button
              @click="prevMonth"
              class="month-nav-btn d-flex align-items-center justify-content-center p-0"
              type="button"
            >
              <ChevronLeft style="width: 20px; height: 20px" />
            </button>

            <button
              @click="nextMonth"
              class="month-nav-btn d-flex align-items-center justify-content-center p-0"
              type="button"
            >
              <ChevronRight style="width: 20px; height: 20px" />
            </button>
          </div>
        </div>

        <div class="row g-4">
          <div class="col-12 col-lg-8">
            <TransactionList 
              :selectedCategory="selectedCategory" 
              @itemClick="openEditModal"
            />
          </div>

          <div class="col-12 col-lg-4 d-flex flex-column gap-4">
            <CategoryBarChart
              :selectedCategory="selectedCategory"
              @selectCategory="handleCategorySelect"
            />
            <CategoryRanking />
          </div>
        </div>
      </div>
    </div>

    <EditLedgerDialog
      :is-open="isEditModalOpen"
      :item="selectedItem"
      @close="isEditModalOpen = false"
      @update="handleUpdate"
      @delete="handleDelete"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useLedgerStore } from "@/stores/ledger";
import { ChevronLeft, ChevronRight } from "lucide-vue-next";

// 컴포넌트 임포트
import TransactionList from "@/components/ledger/TransactionList.vue";
import CategoryBarChart from "@/components/ledger/CategoryBarChart.vue";
import CategoryRanking from "@/components/ledger/CategoryRanking.vue";
import EditLedgerDialog from "@/components/ledger/EditLedgerDialog.vue";

const ledgerStore = useLedgerStore();

// 상태 관리
const selectedCategory = ref(null);
const ledgerDate = ref(
  new Date(ledgerStore.currentYear, ledgerStore.currentMonth - 1, 1),
);

// 모달 관련 상태
const isEditModalOpen = ref(false);
const selectedItem = ref(null);

// 초기 데이터 로드
onMounted(() => {
  ledgerStore.fetchTransactions();
});

/**
 * 날짜 변경 감시: 
 * ledgerDate가 변하면 Store의 연/월 정보를 동기화합니다.
 */
watch(ledgerDate, (newDate) => {
  ledgerStore.currentYear = newDate.getFullYear();
  ledgerStore.currentMonth = newDate.getMonth() + 1;
  // 스토어의 computed 데이터들이 자동으로 반응하여 UI가 갱신됩니다.
});

/**
 * 모달 열기 함수:
 * 목록에서 클릭된 아이템 정보를 받아 모달을 활성화합니다.
 */
const openEditModal = (item) => {
  selectedItem.value = item;
  isEditModalOpen.value = true;
};

/**
 * 수정 처리 액션
 */
const handleUpdate = async (updatedItem) => {
  try {
    await ledgerStore.updateTransaction(updatedItem);
    isEditModalOpen.value = false;
  } catch (e) {
    alert("수정에 실패했습니다: " + e.message);
  }
};

/**
 * 삭제 처리 액션
 */
const handleDelete = async (id) => {
  try {
    await ledgerStore.deleteTransaction(id);
    isEditModalOpen.value = false;
  } catch (e) {
    alert("삭제에 실패했습니다: " + e.message);
  }
};

const handleCategorySelect = (category) => {
  selectedCategory.value = category;
};

const prevMonth = () => {
  ledgerDate.value = new Date(
    ledgerDate.value.getFullYear(),
    ledgerDate.value.getMonth() - 1,
    1,
  );
};

const nextMonth = () => {
  ledgerDate.value = new Date(
    ledgerDate.value.getFullYear(),
    ledgerDate.value.getMonth() + 1,
    1,
  );
};
</script>

<style scoped>
.ledger-page {
  min-height: 100vh;
  width: calc(100% + 3rem);
  margin: -2rem -1.5rem -1.5rem;
  background: var(--page-bg);
  color: var(--text-color);
}

.ledger-inner {
  max-width: 125rem;
  margin: 0 auto;
  padding: 5.5rem 1.5rem 1.5rem;
}

.ledger-title {
  color: var(--text-color);
}

.month-nav-btn {
  width: 36px;
  height: 36px;
  border-radius: 0.75rem;
  border: 1px solid var(--border-color);
  background: var(--card-bg);
  color: var(--text-color);
  box-shadow: var(--shadow-sm);
  transition: all 0.2s ease;
}

.month-nav-btn:hover {
  background: var(--sub-bg);
  border-color: var(--border-light);
  transform: translateY(-1px);
}

.month-nav-btn:active {
  transform: translateY(1px);
}

@media (min-width: 768px) {
  .ledger-page {
    width: calc(100% + 6rem);
    margin: -3rem;
  }

  .ledger-inner {
    padding: 3.5rem 1.5rem 1.5rem;
  }
}
</style>