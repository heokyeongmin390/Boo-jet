import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { findUserByEmail, createUser, getUserById, updateUser, deleteUser } from '@/api/auth';
import { mockDelay } from '@/service/mockDelay';
import { DEFAULT_PROFILE_IMAGE_KEY } from '@/components/common/profileImages.js';

/**
 * 로그인 사용자 정보를 저장할 sessionStorage 키
 *
 * localStorage가 아니라 sessionStorage를 쓰기 때문에
 * 브라우저 탭/창을 닫으면 로그인 정보가 사라진다.
 */
const STORAGE_KEY = 'budget-auth-user';

/**
 * 인증 상태 전용 Pinia 스토어
 *
 * 역할:
 * 1. 현재 로그인 사용자 정보 관리
 * 2. 로그인/회원가입/로그아웃 처리
 * 3. 프로필 수정 처리
 * 4. 세션 스토리지와 상태 동기화
 *
 * 즉, "인증 관련 비즈니스 로직의 중심" 역할을 한다.
 */
export const useAuthStore = defineStore('auth', () => {
  /**
   * 현재 로그인한 사용자 정보
   *
   * 화면에서는 이 값을 기준으로 로그인 여부를 판단하고,
   * 마이페이지/라우터 가드에서 사용자 정보를 표시한다.
   */
  const user = ref(null);

  /**
   * 인증 관련 비동기 작업 진행 여부
   *
   * 로그인 버튼, 회원가입 버튼, 저장 버튼 등의 disabled 처리에 사용된다.
   */
  const isLoading = ref(false);

  /**
   * 최근 인증 작업에서 발생한 에러 메시지
   *
   * 로그인 실패, 이메일 중복, 프로필 저장 실패 등의 메시지를
   * 화면에서 그대로 보여주기 위해 사용한다.
   */
  const errorMessage = ref('');

  /**
   * 로그인 여부를 계산하는 getter
   *
   * user 객체가 존재하면 true, 없으면 false다.
   * 라우터 가드에서 보호 페이지 접근을 막을 때 사용한다.
   */
  const isLoggedIn = computed(() => !!user.value);

  /**
   * 이전 작업에서 남은 에러 메시지를 지운다.
   *
   * 새 요청 시작 전 호출해서, 예전 실패 메시지가 화면에 남아 있지 않게 한다.
   */
  const clearError = () => {
    errorMessage.value = '';
  };

  /**
   * 현재 로그인 사용자 상태를 메모리 + sessionStorage에 함께 저장한다.
   *
   * 여기서 저장하는 객체는 "화면에 필요한 안전한 사용자 정보"만 유지한다.
   * 비밀번호는 저장하지 않는다.
   */
  const setUser = (userData) => {
    user.value = userData;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
  };

  /**
   * 현재 로그인 사용자 상태를 완전히 제거한다.
   *
   * 로그아웃 시 호출되며, 메모리 상태와 브라우저 세션 저장소를 둘 다 비운다.
   */
  const clearUser = () => {
    user.value = null;
    sessionStorage.removeItem(STORAGE_KEY);
  };

  /**
   * sessionStorage에 저장된 로그인 사용자 정보를 다시 불러온다.
   *
   * 앱 새로고침 후에도 같은 탭 안에서는 로그인 상태를 유지하기 위해 사용한다.
   * 저장된 데이터가 깨져 있으면 자동으로 제거해 잘못된 상태를 방지한다.
   */
  const loadUserFromStorage = () => {
    const savedUser = sessionStorage.getItem(STORAGE_KEY);

    if (!savedUser) {
      user.value = null;
      return;
    }

    try {
      user.value = JSON.parse(savedUser);
    } catch (error) {
      console.error('저장된 로그인 정보 파싱 실패:', error);
      sessionStorage.removeItem(STORAGE_KEY);
      user.value = null;
    }
  };

  /**
   * 로그인 처리
   *
   * 흐름:
   * 1. 이메일로 사용자 조회
   * 2. 사용자가 없으면 실패
   * 3. 비밀번호 비교
   * 4. 성공 시 안전한 사용자 정보만 추려서 setUser 호출
   */
  const login = async ({ email, password }) => {
    isLoading.value = true;
    clearError();

    await mockDelay();
    try {
      const users = await findUserByEmail(email);
      const foundUser = users[0];

      if (!foundUser) {
        errorMessage.value = '존재하지 않는 이메일입니다.';
        return {
          success: false,
          message: errorMessage.value,
        };
      }

      if (foundUser.password !== password) {
        errorMessage.value = '비밀번호가 올바르지 않습니다.';
        return {
          success: false,
          message: errorMessage.value,
        };
      }

      const safeUser = {
        id: foundUser.id,
        name: foundUser.name ?? foundUser.nickname,
        email: foundUser.email,
        phone: foundUser.phone,
        createdAt: foundUser.createdAt,
        profileImageKey: foundUser.profileImageKey ?? DEFAULT_PROFILE_IMAGE_KEY,
      };

      setUser(safeUser);

      return {
        success: true,
        message: '로그인 성공',
      };
    } catch (error) {
      console.error('로그인 실패:', error);
      errorMessage.value = '로그인 중 오류가 발생했습니다.';
      return {
        success: false,
        message: errorMessage.value,
      };
    } finally {
      isLoading.value = false;
    }
  };

  // 비밀번호 변경 로직 추가
  const changePassword = async ({ currentPassword, newPassword, confirmPassword }) => {
    if (!user.value?.id) {
      return {
        success: false,
        message: '로그인된 사용자 정보가 없습니다.',
      };
    }

    if (!currentPassword.trim()) {
      return {
        success: false,
        message: '현재 비밀번호를 입력해주세요.',
      };
    }

    if (!newPassword.trim()) {
      return {
        success: false,
        message: '새 비밀번호를 입력해주세요.',
      };
    }

    if (!confirmPassword.trim()) {
      return {
        success: false,
        message: '새 비밀번호 확인을 입력해주세요.',
      };
    }

    if (newPassword !== confirmPassword) {
      return {
        success: false,
        message: '새 비밀번호가 일치하지 않습니다.',
      };
    }

    try {
      const currentUser = await getUserById(user.value.id);

      if (currentUser.password !== currentPassword) {
        return {
          success: false,
          message: '현재 비밀번호가 올바르지 않습니다.',
        };
      }

      await updateUser(user.value.id, {
        ...currentUser,
        password: newPassword,
      });

      return {
        success: true,
        message: '비밀번호가 변경되었습니다.',
      };
    } catch (error) {
      return {
        success: false,
        message: '비밀번호 변경 중 오류가 발생했습니다.',
      };
    }
  };

  /**
   * 회원가입 처리
   *
   * 흐름:
   * 1. 이메일 중복 확인
   * 2. 새 사용자 생성
   * 3. 생성된 사용자 정보로 즉시 로그인 상태 구성
   *
   * 회원가입 성공 후 별도 로그인 과정을 다시 거치지 않도록
   * setUser를 호출해 바로 로그인 상태로 만든다.
   */
  const signup = async ({ name, email, phone, password }) => {
    isLoading.value = true;
    clearError();
    await mockDelay();

    try {
      const users = await findUserByEmail(email);

      if (users.length > 0) {
        errorMessage.value = '이미 사용 중인 이메일입니다.';
        return {
          success: false,
          message: errorMessage.value,
        };
      }

      const createdAt = new Date().toISOString();
      const createdUser = await createUser({
        name,
        email,
        phone,
        password,
        createdAt,
        profileImageKey: DEFAULT_PROFILE_IMAGE_KEY,
      });

      const safeUser = {
        id: createdUser.id,
        name: createdUser.name,
        email: createdUser.email,
        phone: createdUser.phone,
        createdAt: createdUser.createdAt,
        profileImageKey: createdUser.profileImageKey ?? DEFAULT_PROFILE_IMAGE_KEY,
      };

      // setUser(safeUser);

      return {
        success: true,
        message: '회원가입 성공',
      };
    } catch (error) {
      console.error('회원가입 실패:', error);
      errorMessage.value = '회원가입 중 오류가 발생했습니다.';
      return {
        success: false,
        message: errorMessage.value,
      };
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * 로그아웃 처리
   *
   * 내부적으로는 clearUser만 호출한다.
   * 화면 이동은 페이지 컴포넌트 쪽에서 담당한다.
   */
  const logout = () => {
    clearUser();
  };

  /**
   * 프로필 수정 처리
   *
   * 흐름:
   * 1. 현재 로그인 사용자 존재 여부 확인
   * 2. 변경하려는 이메일이 다른 사용자와 중복되는지 검사
   * 3. 현재 서버 사용자 전체 정보 조회
   * 4. 변경값(name/email/phone)을 덮어쓴 전체 객체를 PUT으로 저장
   * 5. 저장 성공 후 현재 로그인 상태(user/sessionStorage)도 새 값으로 갱신
   *
   * PUT은 전체 리소스 교체 방식이라,
   * 일부 필드만 보내지 않고 기존 사용자 전체 객체를 다시 만들어 보내는 것이 중요하다.
   */
  const updateProfile = async ({ name, email, phone, profileImageKey }) => {
    if (!user.value?.id) {
      errorMessage.value = '로그인된 사용자 정보가 없습니다.';
      return {
        success: false,
        message: errorMessage.value,
      };
    }

    isLoading.value = true;
    clearError();
    await mockDelay();

    try {
      const usersWithSameEmail = await findUserByEmail(email);
      const duplicatedUser = usersWithSameEmail.find(
        (foundUser) => Number(foundUser.id) !== Number(user.value.id),
      );

      if (duplicatedUser) {
        errorMessage.value = '이미 사용 중인 이메일입니다.';
        return {
          success: false,
          message: errorMessage.value,
        };
      }

      const currentUser = await getUserById(user.value.id);
      const updatedUser = await updateUser(user.value.id, {
        ...currentUser,
        name,
        email,
        phone,
        profileImageKey: profileImageKey ?? currentUser.profileImageKey ?? DEFAULT_PROFILE_IMAGE_KEY,
      });

      setUser({
        ...user.value,
        id: updatedUser.id,
        name: updatedUser.name ?? user.value.name,
        email: updatedUser.email ?? user.value.email,
        phone: updatedUser.phone ?? user.value.phone,
        createdAt: updatedUser.createdAt ?? user.value.createdAt,
        profileImageKey:
          updatedUser.profileImageKey ?? user.value.profileImageKey ?? DEFAULT_PROFILE_IMAGE_KEY,
      });

      return {
        success: true,
        message: '프로필이 수정되었습니다.',
      };
    } catch (error) {
      console.error('프로필 수정 실패:', error);
      errorMessage.value = '프로필 수정 중 오류가 발생했습니다.';
      return {
        success: false,
        message: errorMessage.value,
      };
    } finally {
      isLoading.value = false;
    }
  };

  return {
    user,
    isLoading,
    errorMessage,
    isLoggedIn,
    clearError,
    setUser,
    clearUser,
    loadUserFromStorage,
    login,
    signup,
    updateProfile,
    logout,
    changePassword,
  };
});
