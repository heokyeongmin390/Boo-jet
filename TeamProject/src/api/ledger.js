/**
 * @fileoverview 가계부 거래 관련 API 함수들
 * @description 거래 내역의 CRUD 기능을 제공하는 API 모듈
 */

import api from './api';

/**
 * 특정 사용자의 모든 거래 내역 조회
 * @param {number} userId - 사용자 ID
 * @returns {Promise<Array>} 거래 내역 배열 (날짜 내림차순 정렬)
 * @example
 * const transactions = await getTransactionsByUserId(1);
 * // [
 * //   { id: 1, userId: 1, type: 'expense', category: '식비', amount: 10000, ... },
 * //   { id: 2, userId: 1, type: 'income', category: '월급', amount: 3000000, ... }
 * // ]
 */
export const getTransactionsByUserId = async (userId) => {
  const response = await api.get(`/transactions?userId=${userId}&_sort=date&_order=desc`);
  return response.data;
};

/**
 * 새 거래 생성
 * @param {Object} transactionData - 거래 데이터
 * @param {number} transactionData.userId - 사용자 ID
 * @param {string} transactionData.type - 거래 유형 ('income' | 'expense')
 * @param {string} transactionData.category - 카테고리
 * @param {number} transactionData.amount - 금액
 * @param {string} transactionData.memo - 메모
 * @param {string} transactionData.date - 거래일 (YYYY-MM-DD)
 * @returns {Promise<Object>} 생성된 거래 객체
 * @example
 * const transaction = await createTransaction({
 *   userId: 1,
 *   type: 'expense',
 *   category: '식비',
 *   amount: 15000,
 *   memo: '점심 식사',
 *   date: '2024-01-01'
 * });
 */
export const createTransaction = async (transactionData) => {
  const response = await api.post('/transactions', transactionData);
  return response.data;
};

/**
 * 거래 정보 수정
 * @param {number} id - 거래 ID
 * @param {Object} transactionData - 수정할 거래 데이터
 * @returns {Promise<Object>} 수정된 거래 객체
 * @example
 * const updated = await updateTransaction(1, {
 *   memo: '저녁 식사로 변경',
 *   amount: 20000
 * });
 */
export const updateTransaction = async (id, transactionData) => {
  const response = await api.put(`/transactions/${id}`, transactionData);
  return response.data;
};

/**
 * 거래 삭제
 * @param {number} id - 삭제할 거래 ID
 * @returns {Promise<Object>} 삭제된 거래 객체
 * @example
 * await deleteTransaction(1);
 */
export const deleteTransaction = async (id) => {
  const response = await api.delete(`/transactions/${id}`);
  return response.data;
};

/**
 * 단건 거래 조회
 * @param {number} id - 조회할 거래 ID
 * @returns {Promise<Object>} 거래 객체
 * @example
 * const transaction = await getTransactionById(1);
 * // { id: 1, userId: 1, type: 'expense', category: '식비', ... }
 */
export const getTransactionById = async (id) => {
  const response = await api.get(`/transactions/${id}`);
  return response.data;
};
