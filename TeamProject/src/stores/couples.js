/**
 * @fileoverview 부부(커플) 상태 관리 스토어
 * @description 부부 연결, 친구 요청 등의 소셜 기능을 관리
 */

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import {
  searchUsersByKeyword,
  getReceivedcoupleRequests,
  getSentcoupleRequests,
  createcoupleRequest,
  updatecoupleRequest,
  getcouplesByUserId,
  createcouple,
  deletecouple,
  getAllcoupleRequests,
} from '@/api/couples';
import { getUserById } from '@/api/auth';
import { deletecoupleRequest } from '@/api/couples'; //요청취소 불러오기
import { getAllcouples } from '@/api/couples'; //커플 목록
export const usecouplesStore = defineStore('couples', () => {
  const couples = ref([]);

  /** 받은 부부 요청 목록 */
  const receivedRequests = ref([]);

  /** 보낸 부부 요청 목록 */
  const sentRequests = ref([]);

  /** 사용자 검색 결과 */
  const searchResults = ref([]);

  /** 로딩 상태 - API 요청 중인지 여부 */
  const isLoading = ref(false);
  const errorMessage = ref('');
  const allcouples = ref([]); //커플 리스트 추가

  // ===== GETTERS (계산된 값) =====
  /** 대기 중인 받은 요청들 (status: 'pending') */
  const pendingReceivedRequests = computed(() =>
    receivedRequests.value.filter((item) => item.status === 'pending'),
  );

  /** 대기 중인 보낸 요청들 (status: 'pending') */
  const pendingSentRequests = computed(() =>
    sentRequests.value.filter((item) => item.status === 'pending'),
  );

  /** 연결된 부부 수 */
  const coupleCount = computed(() => couples.value.length);

  /** 연결된 부부들의 사용자 ID 배열 */
  const coupleIds = computed(() =>
    couples.value.map((item) => item.coupleUserId),
  );

  // ===== ACTIONS (액션들) =====

  /**
   * 사용자 검색
   * @param {string} keyword - 검색 키워드
   * @param {number} myUserId - 현재 사용자 ID (본인 제외)
   * @returns {Promise<void>}
   * @example
   * await searchUsers('홍길동', 1);
   * // searchResults에 검색 결과 저장
   */
  const searchUsers = async (keyword, myUserId) => {
    try {
      isLoading.value = true;
      errorMessage.value = '';

      const users = await searchUsersByKeyword(keyword);
      searchResults.value = users.filter((user) => user.id !== myUserId);
    } catch (error) {
      errorMessage.value = error.message || '사용자 검색에 실패했습니다.';
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * 연결된 부부 목록 조회
   * @param {number} userId - 사용자 ID
   * @returns {Promise<void>}
   * @example
   * await fetchcouples(1);
   * // couples에 부부 목록 저장
   */
  const fetchcouples = async (userId) => {
    try {
      isLoading.value = true;
      errorMessage.value = '';
      couples.value = await getcouplesByUserId(userId);
    } catch (error) {
      errorMessage.value = error.message || '친구 목록 조회에 실패했습니다.';
    } finally {
      isLoading.value = false;
    }
  };

  // const fetchReceivedRequests = async (userId) => {
  //   try {
  //     isLoading.value = true;
  //     errorMessage.value = "";
  //     receivedRequests.value = await getReceivedcoupleRequests(userId);
  //   } catch (error) {
  //     errorMessage.value =
  //       error.message || "받은 친구 요청 조회에 실패했습니다.";
  //   } finally {
  //     isLoading.value = false;
  //   }
  // };

  // const fetchSentRequests = async (userId) => {
  //   try {
  //     isLoading.value = true;
  //     errorMessage.value = "";
  //     sentRequests.value = await getSentcoupleRequests(userId);
  //   } catch (error) {
  //     errorMessage.value =
  //       error.message || "보낸 친구 요청 조회에 실패했습니다.";
  //   } finally {
  //     isLoading.value = false;
  //   }
  // };

  // const sendcoupleRequest = async ({ requesterId, targetUserId }) => {
  //   try {
  //     isLoading.value = true;
  //     errorMessage.value = '';

  //     const created = await createcoupleRequest({
  //       requesterId,
  //       targetUserId,
  //       status: 'pending',
  //       createdAt: new Date().toISOString(),
  //     });

  //     sentRequests.value.unshift(created);

  //     return { success: true };
  //   } catch (error) {
  //     errorMessage.value = error.message || '친구 요청 전송에 실패했습니다.';
  //     return { success: false, message: errorMessage.value };
  //   } finally {
  //     isLoading.value = false;
  //   }
  // };

  /**
   * 부부 요청 수락
   * 요청을 수락하고 양방향 부부 관계 생성
   * @param {Object} request - 요청 객체
   * @param {number} request.id - 요청 ID
   * @param {number} request.requesterId - 요청자 ID
   * @param {number} request.targetUserId - 대상자 ID
   * @returns {Promise<{success: boolean, message?: string}>} 수락 결과
   * @example
   * const result = await acceptcoupleRequest(request);
   * // 요청 상태를 'accepted'로 변경하고 부부 관계 생성
   */
  // const acceptcoupleRequest = async (request) => {
  //   try {
  //     isLoading.value = true;
  //     errorMessage.value = '';

  //     // 1. 요청 상태를 수락으로 변경
  //     await updatecoupleRequest(request.id, { status: 'accepted' });

  //     // 2. 양방향 부부 관계 생성 (A-B, B-A)
  //     await createcouple({
  //       userId: request.requesterId,
  //       coupleUserId: request.targetUserId,
  //       createdAt: new Date().toISOString(),
  //     });

  //     await createcouple({
  //       userId: request.targetUserId,
  //       coupleUserId: request.requesterId,
  //       createdAt: new Date().toISOString(),
  //     });

  //     return { success: true };
  //   } catch (error) {
  //     errorMessage.value = error.message || "친구 요청 수락에 실패했습니다.";
  //     return { success: false, message: errorMessage.value };
  //   } finally {
  //     isLoading.value = false;
  //   }
  // };

  /**
   * 부부 요청 거절
   * @param {number} requestId - 거절할 요청 ID
   * @returns {Promise<{success: boolean, message?: string}>} 거절 결과
   * @example
   * const result = await rejectcoupleRequest(1);
   * // 요청 상태를 'rejected'로 변경
   */
  const rejectcoupleRequest = async (requestId) => {
    try {
      isLoading.value = true;
      errorMessage.value = '';

      await deletecoupleRequest(requestId);

      receivedRequests.value = receivedRequests.value.filter(
        (item) => item.id !== requestId,
      );

      return { success: true };
    } catch (error) {
      errorMessage.value = error.message || '친구 요청 거절에 실패했습니다.';
      return { success: false, message: errorMessage.value };
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * 부부 관계 제거
   * @param {number} coupleRelationId - 제거할 부부 관계 ID
   * @returns {Promise<{success: boolean, message?: string}>} 제거 결과
   * @example
   * const result = await removecouple(1);
   * // 부부 관계 삭제
   */
  const removecouple = async (coupleRelationId) => {
    try {
      isLoading.value = true;
      errorMessage.value = '';

      await deletecouple(coupleRelationId);
      couples.value = couples.value.filter(
        (item) => item.id !== coupleRelationId,
      );

      return { success: true };
    } catch (error) {
      errorMessage.value = error.message || '친구 삭제에 실패했습니다.';
      return { success: false, message: errorMessage.value };
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * 부부 관련 데이터 초기화
   * 모든 부부 데이터와 요청 데이터를 클리어
   */
  const clearcouplesData = () => {
    couples.value = [];
    receivedRequests.value = [];
    sentRequests.value = [];
    searchResults.value = [];
    errorMessage.value = '';
  };
  //추가(수정) - 기존 api변경으로 인해 stores도 이름 변경 fromId랑 toid사용
  const sendcoupleRequest = async ({ requesterId, targetUserId }) => {
    try {
      isLoading.value = true;
      errorMessage.value = '';

      const created = await createcoupleRequest({
        fromId: requesterId,
        toId: targetUserId,
        status: 'pending',
        createdAt: new Date().toISOString(),
      });
      //200~205  sentRequests.value.unshift(created); 수정및 추가
      const user = await getUserById(targetUserId);

      sentRequests.value.unshift({
        ...created,
        user,
      });

      return { success: true };
    } catch (error) {
      errorMessage.value = '요청 실패';
      return { success: false };
    } finally {
      isLoading.value = false;
    }
  };
  //추가(수정) - 기존 api변경으로 인해 stores도 이름 변경 fromId랑 toid사용
  const acceptcoupleRequest = async (request) => {
    try {
      isLoading.value = true;
      errorMessage.value = '';

      const createdCouple = await createcouple({
        user1Id: Number(request.fromId),
        user2Id: Number(request.toId),
        status: true,
        createdAt: new Date().toISOString(),
      });

      allcouples.value.unshift(createdCouple);

      await deleteRelatedPendingRequests(
        Number(request.fromId),
        Number(request.toId),
      );

      receivedRequests.value = receivedRequests.value.filter(
        (item) =>
          Number(item.fromId) !== Number(request.fromId) &&
          Number(item.toId) !== Number(request.fromId) &&
          Number(item.fromId) !== Number(request.toId) &&
          Number(item.toId) !== Number(request.toId),
      );

      sentRequests.value = sentRequests.value.filter(
        (item) =>
          Number(item.fromId) !== Number(request.fromId) &&
          Number(item.toId) !== Number(request.fromId) &&
          Number(item.fromId) !== Number(request.toId) &&
          Number(item.toId) !== Number(request.toId),
      );

      searchResults.value = searchResults.value.filter(
        (user) =>
          Number(user.id) !== Number(request.fromId) &&
          Number(user.id) !== Number(request.toId),
      );

      return { success: true };
    } catch (error) {
      errorMessage.value = error.message || '친구 요청 수락에 실패했습니다.';
      return { success: false, message: errorMessage.value };
    } finally {
      isLoading.value = false;
    }
  };
  //추가(수정) - 커플 보낸 요청과 받은 요청 할떄 상대방 toid나 formid가 표시되는데 상대방의 객체도 나와야 ui 설계가 가능함 그리고 상대방 데이터가 나오게 설정
  const fetchReceivedRequests = async (userId) => {
    try {
      isLoading.value = true;
      errorMessage.value = '';

      const requests = await getReceivedcoupleRequests(userId);

      const enriched = await Promise.all(
        requests.map(async (req) => {
          const user = await getUserById(req.fromId);
          return { ...req, user };
        }),
      );

      receivedRequests.value = enriched;
    } catch (error) {
      errorMessage.value = '받은 친구 요청 조회에 실패했습니다.';
    } finally {
      isLoading.value = false;
    }
  };
  //추가(수정) - 커플 보낸 요청과 받은 요청 할떄 상대방 toid나 formid가 표시되는데 상대방의 객체도 나와야 ui 설계가 가능함 그리고 상대방 데이터가 나오게 설정
  const fetchSentRequests = async (userId) => {
    try {
      isLoading.value = true;
      errorMessage.value = '';

      const requests = await getSentcoupleRequests(userId);

      const enriched = await Promise.all(
        requests.map(async (req) => {
          const user = await getUserById(req.toId);
          return { ...req, user };
        }),
      );

      sentRequests.value = enriched;
    } catch (error) {
      errorMessage.value = '보낸 친구 요청 조회에 실패했습니다.';
    } finally {
      isLoading.value = false;
    }
  };
  //추가 - 보내거나 받은 요청인지 확인하기 -> 이걸로 친구요청 중복 해결
  const isAlreadyRequested = (myId, targetId) => {
    return (
      sentRequests.value.some(
        (req) =>
          req.fromId === myId &&
          req.toId === targetId &&
          req.status === 'pending',
      ) ||
      receivedRequests.value.some(
        (req) =>
          req.fromId === targetId &&
          req.toId === myId &&
          req.status === 'pending',
      )
    );
  };
  //추가 - 요청 취소
  const cancelcoupleRequest = async (requestId) => {
    try {
      isLoading.value = true;
      errorMessage.value = '';

      await deletecoupleRequest(requestId);

      sentRequests.value = sentRequests.value.filter(
        (req) => req.id !== requestId,
      );

      return { success: true };
    } catch (error) {
      errorMessage.value = error.message || '보낸 요청 취소에 실패했습니다.';
      return { success: false, message: errorMessage.value };
    } finally {
      isLoading.value = false;
    }
  };
  //추가 - 전체 커플 조회하는 기능 -> 친구요청할떄 커플인 사용자 막기위해
  const fetchAllcouples = async () => {
    try {
      const data = await getAllcouples();
      allcouples.value = data;
    } catch (error) {
      errorMessage.value = '커플 전체 조회 실패';
    }
  };
  //추가 - 커플인지 아닌지 확인
  const isTargetAlreadyCoupled = (targetId) => {
    return allcouples.value.some(
      (c) => c.user1Id === targetId || c.user2Id === targetId,
    );
  };
  const deleteRelatedPendingRequests = async (userAId, userBId) => {
    const allRequests = await getAllcoupleRequests();

    const relatedPendingRequests = allRequests.filter(
      (req) =>
        req.status === 'pending' &&
        (req.fromId === userAId ||
          req.toId === userAId ||
          req.fromId === userBId ||
          req.toId === userBId),
    );

    await Promise.all(
      relatedPendingRequests.map((req) => deletecoupleRequest(req.id)),
    );
  };

  // ===== STORE 반환 =====
  return {
    // State
    couples,
    receivedRequests,
    sentRequests,
    searchResults,
    isLoading,
    errorMessage,

    // Getters
    pendingReceivedRequests,
    pendingSentRequests,
    coupleCount,
    coupleIds,

    // Actions
    searchUsers,
    fetchcouples,
    fetchReceivedRequests,
    fetchSentRequests,
    sendcoupleRequest,
    acceptcoupleRequest,
    rejectcoupleRequest,
    removecouple,
    clearcouplesData,
    isAlreadyRequested, //추가
    cancelcoupleRequest, //추가
    allcouples, //추가
    fetchAllcouples, //추가
    isTargetAlreadyCoupled, //추가
  };
});
