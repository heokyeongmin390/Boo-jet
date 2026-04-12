/**
 * @fileoverview 카테고리 관련 API 함수들
 * @description 수입/지출 카테고리 데이터를 조회하는 API 모듈
 */

import api from './api';

/**
 * 모든 카테고리 조회
 * @returns {Promise<Object>} 수입/지출 카테고리 객체
 * @returns {Array} return.income - 수입 카테고리 배열
 * @returns {Array} return.expense - 지출 카테고리 배열
 * @example
 * const categories = await getCategories();
 * // {
 * //   income: ['월급', '부수입', ...],
 * //   expense: ['식비', '교통비', ...]
 * // }
 */
export const getCategories = async () => {
  const response = await api.get('/categories');
  return response.data;
};
