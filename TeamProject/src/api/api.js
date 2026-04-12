/**
 * @fileoverview API 기본 설정 및 공통 axios 인스턴스
 * @description json-server와의 통신을 위한 기본 axios 설정을 제공합니다.
 * 배포 환경에서는 Render에 배포된 API 서버 주소를 사용합니다.
 */

import axios from 'axios';

/**
 * 기본 API 클라이언트 인스턴스
 * - baseURL: 배포된 Render API 서버 주소 (https://boo-jet-api.onrender.com)
 * - 로컬 환경과 배포 환경 모두에서 작동하도록 설정
 */
const api = axios.create({
  baseURL: import.meta.env.PROD 
    ? 'https://boo-jet-api.onrender.com' 
    : '/api',
});

export default api;
