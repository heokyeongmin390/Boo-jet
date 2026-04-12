/**
 * @fileoverview 카테고리 상태 관리 스토어
 * @description 수입/지출 카테고리 데이터를 관리하고 API와 연동
 */

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { getCategories } from '@/api/categories';

/**
 * 카테고리 상태 관리 스토어
 * 수입/지출 카테고리 목록을 관리하고 API와 동기화
 */
export const useCategoryStore = defineStore('category', () => {
  // ===== STATE (상태) =====
  /** 수입 카테고리 배열 */
  const incomeCategories = ref([]);

  /** 지출 카테고리 배열 */
  const expenseCategories = ref([]);

  /** 로딩 상태 - 카테고리 조회 중인지 여부 */
  const isLoading = ref(false);

  /** 에러 메시지 - 카테고리 조회 실패 시 표시 */
  const errorMessage = ref('');

  // ===== GETTERS (계산된 값) =====
  /** 모든 카테고리를 타입별로 그룹화한 객체 */
  const allCategories = computed(() => ({
    income: incomeCategories.value,
    expense: expenseCategories.value,
  }));

  // ===== ACTIONS (액션들) =====

  /**
   * 카테고리 목록 조회 및 상태 업데이트
   * API에서 수입/지출 카테고리를 가져와 스토어에 저장
   * @returns {Promise<void>}
   * @example
   * await fetchCategories();
   * // 이후 allCategories getter로 접근 가능
   */
  const fetchCategories = async () => {
    try {
      isLoading.value = true;
      errorMessage.value = '';

      const categories = await getCategories();

      incomeCategories.value = categories.income || [];
      expenseCategories.value = categories.expense || [];
    } catch (error) {
      errorMessage.value = error.message || '카테고리 조회에 실패했습니다.';
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * 타입별 카테고리 반환
   * @param {string} type - 카테고리 타입 ('income' | 'expense')
   * @returns {Array} 해당 타입의 카테고리 배열
   * @example
   * const expenseCats = getCategoriesByType('expense');
   * // ['식비', '교통비', '쇼핑', ...]
   */
  const getCategoriesByType = (type) => {
    if (type === 'income') return incomeCategories.value;
    if (type === 'expense') return expenseCategories.value;
    return [];
  };

  /**
   * 카테고리 데이터 초기화
   * 모든 카테고리 배열과 에러 메시지를 클리어
   */
  const clearCategories = () => {
    incomeCategories.value = [];
    expenseCategories.value = [];
    errorMessage.value = '';
  };

  // ===== STORE 반환 =====
  return {
    // State
    incomeCategories,
    expenseCategories,
    isLoading,
    errorMessage,

    // Getters
    allCategories,

    // Actions
    fetchCategories,
    getCategoriesByType,
    clearCategories,
  };
});
