import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import api from '../api/api.js';
import { useAuthStore } from './auth';

// 1. 카테고리별 색상 팔레트 정의
const categoryPalette = {
  '식비': '#f28b8b',
  '주거/통신': '#c89bff',
  '교통/차량': '#f5e27f',
  '쇼핑/생활': '#8ec5ff',
  '의료/건강': '#92e9dc',
  '문화/여가': '#809dff',
  '월급': '#4caf50',
  '용돈': '#ff9800',
  '보너스': '#26c6da',
  '기타': '#d8b86a',
};

// 2. 카테고리 목록 정의
export const incomeCategories = ['월급', '용돈', '보너스', '기타'];
export const expenseCategories = [
  '식비', '주거/통신', '교통/차량', '쇼핑/생활', '의료/건강', '문화/여가', '기타',
];

const categoryByType = {
  INCOME: incomeCategories,
  EXPENSE: expenseCategories,
};

export const useLedgerStore = defineStore('ledger', () => {
  const today = new Date();
  const authStore = useAuthStore();

  const currentYear = ref(today.getFullYear());
  const currentMonth = ref(today.getMonth() + 1);
  const selectedDate = ref(today.toISOString().slice(0, 10));
  const transactions = ref([]);
  const liveSyncTimer = ref(null);

  const monthKey = computed(() =>
    `${currentYear.value}-${String(currentMonth.value).padStart(2, '0')}`
  );

  // 현재 로그인한 사용자의 전체 거래
  const activeUserTransactions = computed(() => {
    const currentUserId = authStore.user?.id;
    if (!currentUserId) return [];
    return transactions.value.filter(
      (item) => Number(item.userId) === Number(currentUserId)
    );
  });

  // 현재 월의 거래 내역
  const monthlyTransactions = computed(() =>
    activeUserTransactions.value.filter((item) => item.date.startsWith(monthKey.value))
  );

  // 월 총 수입/지출 합계
  const totalIncome = computed(() =>
    monthlyTransactions.value
      .filter((item) => item.type === 'INCOME')
      .reduce((sum, item) => sum + item.amount, 0)
  );

  const totalExpense = computed(() =>
    monthlyTransactions.value
      .filter((item) => item.type === 'EXPENSE')
      .reduce((sum, item) => sum + item.amount, 0)
  );

  // 차트 데이터 계산
  const categoryExpenseChartData = computed(() => {
    const result = {};
    expenseCategories.forEach(cat => result[cat] = 0);

    monthlyTransactions.value
      .filter((item) => item.type === 'EXPENSE')
      .forEach((item) => {
        const cat = expenseCategories.includes(item.category) ? item.category : '기타';
        result[cat] += item.amount;
      });

    return Object.entries(result)
      .filter(([_, value]) => value > 0)
      .map(([category, value]) => ({
        category,
        value,
        color: categoryPalette[category] ?? '#cdd5df',
      }));
  });

  // 캘린더 날짜별 요약 데이터
  const calendarData = computed(() => {
    const map = {};
    monthlyTransactions.value.forEach((item) => {
      const day = parseInt(item.date.split('-')[2], 10);
      if (!map[day]) map[day] = { income: 0, expense: 0 };
      if (item.type === 'INCOME') map[day].income += item.amount;
      else if (item.type === 'EXPENSE') map[day].expense += item.amount;
    });
    return map;
  });

  // ===== ACTIONS =====
  async function fetchTransactions() {
    const currentUserId = authStore.user?.id;
    if (!currentUserId) return;
    try {
      const res = await api.get('/transactions', { params: { userId: currentUserId } });
      transactions.value = res.data;
    } catch (error) {
      console.error("데이터 로딩 실패:", error);
    }
  }

  async function refreshTransactions() {
    await fetchTransactions();
  }

  async function addTransaction(payload) {
    const currentUserId = authStore.user?.id;
    if (!currentUserId) throw new Error('로그인이 필요합니다.');

    const response = await api.post('/transactions', {
      ...payload,
      userId: currentUserId,
    });
    transactions.value.push(response.data);
    await refreshTransactions();
  }

  // 수정 액션 (URL에 ID 포함 필수)
  async function updateTransaction(payload) {
    const { id, ...data } = payload;
    if (!id) throw new Error('수정할 항목의 ID가 없습니다.');

    await api.patch(`/transactions/${id}`, data);
    await refreshTransactions();
  }

  // 삭제 액션 (URL에 ID 포함 필수)
  async function deleteTransaction(id) {
    if (!id) throw new Error('삭제할 항목의 ID가 없습니다.');
    await api.delete(`/transactions/${id}`);
    await refreshTransactions();
  }

  // 실시간 동기화 제어
  function startLiveSync(intervalMs = 3000) {
    if (liveSyncTimer.value) return;
    refreshTransactions();
    liveSyncTimer.value = window.setInterval(refreshTransactions, intervalMs);
  }

  function stopLiveSync() {
    if (!liveSyncTimer.value) return;
    window.clearInterval(liveSyncTimer.value);
    liveSyncTimer.value = null;
  }

  return {
    currentYear, currentMonth, selectedDate, transactions,
    monthKey, activeUserTransactions, monthlyTransactions,
    totalIncome, totalExpense, categoryExpenseChartData, calendarData,
    fetchTransactions, refreshTransactions, addTransaction,
    updateTransaction, deleteTransaction, startLiveSync, stopLiveSync
  };
});