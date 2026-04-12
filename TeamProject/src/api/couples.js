/**
 * @fileoverview 부부(커플) 관련 API 함수들
 * @description 부부 연결, 요청 조회/수정, 커플 관계 관리에 사용하는 API 모듈
 */

import api from './api';

/**
 * 키워드로 사용자 검색
 * @param {string} keyword - 검색 키워드
 * @returns {Promise<Array>} 검색된 사용자 배열
 */
export const searchUsersByKeyword = async (keyword) => {
  const response = await api.get(`/users?q=${keyword}`);
  return response.data;
};

/**
 * 받은 부부 요청 조회
 * @param {number} userId - 현재 사용자 ID
 * @returns {Promise<Array>} 받은 요청 배열
 */
export const getReceivedcoupleRequests = async (userId) => {
  const response = await api.get(`/coupleRequests?toId=${userId}`);
  return response.data;
};

/**
 * 보낸 부부 요청 조회
 * @param {number} userId - 현재 사용자 ID
 * @returns {Promise<Array>} 보낸 요청 배열
 */
export const getSentcoupleRequests = async (userId) => {
  const response = await api.get(`/coupleRequests?fromId=${userId}`);
  return response.data;
};

/**
 * 부부 요청 생성
 * @param {Object} payload - 요청 데이터
 * @returns {Promise<Object>} 생성된 요청 객체
 */
export const createcoupleRequest = async (payload) => {
  const response = await api.post('/coupleRequests', payload);
  return response.data;
};

/**
 * 부부 요청 상태 수정
 * @param {number} requestId - 요청 ID
 * @param {Object} payload - 수정할 데이터
 * @returns {Promise<Object>} 수정된 요청 객체
 */
export const updatecoupleRequest = async (requestId, payload) => {
  const { data: existing } = await api.get(`/coupleRequests/${requestId}`);
  const response = await api.put(`/coupleRequests/${requestId}`, {
    ...existing,
    ...payload,
  });
  return response.data;
};

/**
 * 특정 사용자와 연결된 커플 관계 조회
 * @param {number} userId - 사용자 ID
 * @returns {Promise<Array>} 커플 관계 배열
 */
// export const getcouplesByUserId = async (userId) => {
//   const response = await api.get(`/couples?user1Id=${userId}`);
//   return response.data;
// }; //getcouplesByuserId 수정했습니다 혹시 사용하고 계신분이 계신다면 아래 것으로 바꿨음을 확인해주세요

export const getcouplesByUserId = async (userId) => {
  const [asUser1, asUser2] = await Promise.all([
    api.get(`/couples?user1Id=${userId}`),
    api.get(`/couples?user2Id=${userId}`),
  ]);

  return [...asUser1.data, ...asUser2.data];
};
/**
 * 부부 관계 생성
 * @param {Object} payload - 커플 데이터
 * @returns {Promise<Object>} 생성된 커플 관계 객체
 */
export const createcouple = async (payload) => {
  const response = await api.post('/couples', payload);
  return response.data;
};

/**
 * 부부 관계 삭제
 * @param {number} id - 커플 관계 ID
 * @returns {Promise<Object>} 삭제 결과
 */
export const deletecouple = async (id) => {
  const response = await api.delete(`/couples/${id}`);
  return response.data;
};

/**
 * 요청 취소
 * @param {number} id - 요청 ID
 * @returns {Promise<Object>} 삭제 결과
 */
export const deletecoupleRequest = async (id) => {
  const response = await api.delete(`/coupleRequests/${id}`);
  return response.data;
};

/**
 * 전체 커플 조회
 * @returns {Promise<Array>} 전체 커플 배열
 */
export const getAllcouples = async () => {
  const response = await api.get('/couples');
  return response.data;
};
//전체 커플 요청 조회
export const getAllcoupleRequests = async () => {
  const response = await api.get('/coupleRequests');
  return response.data;
};

//추가
/**
 * 커플 정보 수정
 * @param {number} id - 커플 관계 ID
 * @param {Object} payload - 수정할 데이터
 * @returns {Promise<Object>} 수정된 커플 객체
 */
export const updatecouple = async (id, payload) => {
  const { data: existing } = await api.get(`/couples/${id}`);
  const response = await api.put(`/couples/${id}`, {
    ...existing,
    ...payload,
  });
  return response.data;
};
