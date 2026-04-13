<template>
  <div class="home-page">
    <div class="home-inner d-flex flex-column gap-4">
      <SummaryCards
        :totalIncome="ledgerStore.totalIncome"
        :totalExpense="ledgerStore.totalExpense"
      />

      <div class="row g-4">
        <div class="col-12 col-lg-8">
          <LedgerCalendar @dateClick="handleDateClick" />
        </div>

        <div class="col-12 col-lg-4 d-flex flex-column gap-4">
          <DateDetailView
            :date-string="selectedDateString"
            :income="currentDateData.income"
            :expense="currentDateData.expense"
            :details="currentDateData.details"
            @itemClick="openEditModal"
          />
          <ExpensePieChart :data="ledgerStore.categoryExpenseChartData" />
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
import { ref, computed, onMounted, watch } from 'vue'; // watch 추가
import { useLedgerStore } from '@/stores/ledger';
import SummaryCards from '@/components/home/SummaryCards.vue';
import LedgerCalendar from '@/components/ledger/LedgerCalendar.vue';
import DateDetailView from '@/components/ledger/DateDetailView.vue';
import EditLedgerDialog from '@/components/ledger/EditLedgerDialog.vue';
import ExpensePieChart from '@/components/home/ExpensePieChart.vue';

const ledgerStore = useLedgerStore();
// 초기값: 오늘 날짜
const selectedDateString = ref(new Date().toISOString().split('T')[0]);
const isEditModalOpen = ref(false);
const selectedItem = ref(null);

/**
 * [추가] 월 변경 감시 로직
 * 캘린더에서 월이 바뀌면(monthKey 변동), 해당 월의 1일로 상세 내역을 갱신합니다.
 */
watch(
  () => ledgerStore.monthKey,
  (newMonthKey) => {
    if (newMonthKey) {
      selectedDateString.value = `${newMonthKey}-01`;
    }
  },
);

const currentDateData = computed(() => {
  if (!selectedDateString.value) return { income: 0, expense: 0, details: [] };
  const details = ledgerStore.activeUserTransactions.filter(
    (t) => t.date === selectedDateString.value,
  );
  const income = details
    .filter((t) => t.type === 'INCOME')
    .reduce((s, t) => s + t.amount, 0);
  const expense = details
    .filter((t) => t.type === 'EXPENSE')
    .reduce((s, t) => s + t.amount, 0);
  return { income, expense, details };
});

const handleDateClick = (dateString) => {
  selectedDateString.value = dateString;
};

const openEditModal = (item) => {
  selectedItem.value = item;
  isEditModalOpen.value = true;
};

const handleUpdate = async (updatedItem) => {
  try {
    await ledgerStore.updateTransaction(updatedItem);
    isEditModalOpen.value = false;
  } catch (e) {
    alert('수정 실패: ' + e.message);
  }
};

const handleDelete = async (id) => {
  try {
    await ledgerStore.deleteTransaction(id);
    isEditModalOpen.value = false;
  } catch (e) {
    alert('삭제 실패: ' + e.message);
  }
};

onMounted(() => ledgerStore.fetchTransactions());
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  width: 100%;
  margin: 0;
  padding: 0 16px;
  background: var(--page-bg);
  color: var(--text-color);
}

.home-inner {
  max-width: 125rem;
  margin: 0 auto;
  padding: 1rem 0 1.5rem;
}

@media (min-width: 768px) {
  .home-page {
    width: calc(100% + 6rem);
    margin: -3rem;
    padding: 0;
  }

  .home-inner {
    padding: 5.5rem 1.5rem 1.5rem;
  }
}
</style>
