// MOCK SERVER ONLY:
// 실제 서버 전환 시 이 유틸은 제거하거나 더 이상 사용하지 않아야 한다.
// 현재는 json-server 환경에서 처리 중 UI를 시연하기 위한 인위적 지연 용도다.
export const mockDelay = (ms = Math.random() * (2000 - 500) + 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));
