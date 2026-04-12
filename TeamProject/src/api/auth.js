import api from './api';

/**
 * 인증/사용자 관련 API 모듈
 *
 * 이 파일은 "서버에 어떤 요청을 보낼지"만 담당한다.
 * 로그인 성공/실패 판단, 입력값 검증, 스토리지 저장 같은 비즈니스 로직은
 * store(auth.js)에서 처리하고, 여기서는 HTTP 요청만 분리한다.
 */

/**
 * 이메일로 사용자를 조회한다.
 *
 * json-server에서는 /users?email=a@b.com 형태의 쿼리로
 * 조건에 맞는 사용자 배열을 반환하므로, 단건 조회처럼 보여도
 * 반환 타입은 항상 배열이다.
 *
 * 사용처:
 * - 로그인 시 이메일 존재 여부 확인
 * - 회원가입/프로필 수정 시 이메일 중복 확인
 */
export const findUserByEmail = async (email) => {
  const response = await api.get('/users', {
    params: { email },
  });

  return response.data;
};

/**
 * 새 사용자를 생성한다.
 *
 * 회원가입 페이지에서 받은 name/email/phone/password/createdAt 값을
 * 그대로 서버에 전달한다.
 *
 * 사용처:
 * - 회원가입 성공 시 users 컬렉션에 새 사용자 추가
 */
export const createUser = async (userData) => {
  const response = await api.post('/users', userData);
  return response.data;
};

/**
 * id로 특정 사용자 한 명을 조회한다.
 *
 * 프로필 수정은 PUT 방식으로 "사용자 전체 객체"를 다시 보내기 때문에,
 * 먼저 현재 서버에 저장된 사용자 전체 데이터를 가져와야 한다.
 *
 * 사용처:
 * - 프로필 수정 전 현재 사용자 원본 데이터 조회
 */
export const getUserById = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

/**
 * 사용자 정보를 전체 교체(PUT) 방식으로 수정한다.
 *
 * PATCH가 아닌 PUT을 사용하므로, 수정할 필드만 보내는 것이 아니라
 * 최종적으로 저장되어야 하는 사용자 전체 객체를 보내야 한다.
 *
 * 사용처:
 * - 마이페이지에서 이름/이메일/전화번호 수정 저장
 */
export const updateUser = async (id, userData) => {
  const response = await api.put(`/users/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};
