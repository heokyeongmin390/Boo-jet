import { deleteUser } from '@/api/auth';
import { getTransactionsByUserId, deleteTransaction } from '@/api/ledger';
import {
  getcouplesByUserId,
  getReceivedcoupleRequests,
  getSentcoupleRequests,
  deletecouple,
  deletecoupleRequest,
} from '@/api/couples';
import { mockDelay } from '@/service/mockDelay';

// MOCK SERVER ONLY:
// 실제 서버 전환 시 회원탈퇴 후 연관 데이터 정리는 백엔드가 처리하는 것이 맞다.
// 현재 아래 로직은 json-server 환경에서 시연용 데이터 정합성을 맞추기 위한
// 프론트엔드 임시 처리이며, 서버 구현이 완료되면 단일 회원탈퇴 API 호출로
// 대체되거나 제거되어야 한다.
export async function withdrawUser(userId) {
  const numericUserId = Number(userId);
  await mockDelay(500);

  // MOCK SERVER ONLY:
  // 실제 서버 전환 시 아래 연관 데이터 조회/삭제 코드는 프론트에서 제거되어야 한다.
  const [receivedRequests, sentRequests, couples, transactions] = await Promise.all([
    getReceivedcoupleRequests(numericUserId),
    getSentcoupleRequests(numericUserId),
    getcouplesByUserId(numericUserId),
    getTransactionsByUserId(numericUserId),
  ]);

  const requestIds = [
    ...new Set([...receivedRequests, ...sentRequests].map((request) => request.id)),
  ];

  for (const requestId of requestIds) {
    await deletecoupleRequest(requestId);
  }

  for (const couple of couples) {
    await deletecouple(couple.id);
  }

  for (const transaction of transactions) {
    await deleteTransaction(transaction.id);
  }

  // 계정 자체 삭제 요청은 실제 서버 전환 이후에도 프론트에서 호출될 수 있다.
  await deleteUser(numericUserId);
}
