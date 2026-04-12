<script setup>
import { ref, computed } from "vue";
import { usecouplesStore } from "@/stores/couples.js";
import { useAuthStore } from "@/stores/auth.js";
import CoupleCard from "@/components/common/CoupleCard.vue";
import { useUiStore } from "@/stores/ui";

const uiStore = useUiStore();
const coupleStore = usecouplesStore();
const authStore = useAuthStore();
const keyword = ref("");

const limitedSearchResults = computed(() =>
  coupleStore.searchResults.slice(0, 5),
);

const handleSearch = () => {
  if (!keyword.value.trim()) {
    coupleStore.searchResults = [];
    return;
  }
  coupleStore.searchUsers(keyword.value, authStore.user.id);
};

const resetSearch = () => {
  keyword.value = "";
  coupleStore.searchResults = [];
};

const getUserCardType = (user) => {
  const receivedReq = coupleStore.pendingReceivedRequests.find(
    (req) => req.user?.id === user.id,
  );
  if (receivedReq) return "received";

  const sentReq = coupleStore.pendingSentRequests.find(
    (req) => req.user?.id === user.id,
  );
  if (sentReq) return "sent";

  if (coupleStore.isTargetAlreadyCoupled(user.id)) {
    return "matched";
  }

  return "search";
};

const getRequestIdByUser = (user) => {
  const sentReq = coupleStore.pendingSentRequests.find(
    (req) => req.user?.id === user.id,
  );
  return sentReq?.id ?? null;
};

const getReceivedRequestUser = (user) => {
  const receivedReq = coupleStore.pendingReceivedRequests.find(
    (req) => req.user?.id === user.id,
  );
  return receivedReq ?? user;
};

const handleAction = async ({ type, user, requestId }) => {
  const myId = authStore.user.id;

  if (type === "request") {
    const result = await coupleStore.sendcoupleRequest({
      requesterId: myId,
      targetUserId: user.id,
    });

    if (result.success) {
      await coupleStore.fetchSentRequests(myId);
      uiStore.showToast("파트너 요청을 보냈습니다.");
    } else {
      uiStore.showToast(result.message || "요청 전송에 실패했습니다.");
    }
  }

  if (type === "accept") {
    const result = await coupleStore.acceptcoupleRequest(user);

    if (result.success) {
      uiStore.showToast("커플 연결이 완료되었습니다.");
      return;
    }

    uiStore.showToast(result.message || "요청 수락에 실패했습니다.");
  }

  if (type === "reject") {
    const result = await coupleStore.rejectcoupleRequest(user.id);

    if (result.success) {
      await coupleStore.fetchReceivedRequests(myId);
      uiStore.showToast("요청을 거절했습니다.", "error");
    } else {
      uiStore.showToast(result.message || "거절에 실패했습니다.", "error");
    }
  }

  if (type === "cancel") {
    const result = await coupleStore.cancelcoupleRequest(requestId);

    if (result.success) {
      await coupleStore.fetchSentRequests(myId);
      uiStore.showToast("요청을 취소했습니다.", "error");
    } else {
      uiStore.showToast(result.message || "취소에 실패했습니다.", "error");
    }
  }
};
</script>

<template>
  <div class="couples-page">
    <div class="couples-inner container-fluid mx-auto">
      <header class="mb-4">
        <h1 class="fs-4 fw-bold mb-2">배우자 관리</h1>
        <p class="small section-desc mb-0">
          함께 자산을 관리할 배우자를 찾고 연결해보세요.
        </p>
      </header>

      <main class="row g-4 align-items-start">
        <section class="col-12 col-xl-5">
          <div class="content-panel">
            <div class="d-flex align-items-center justify-content-between mb-3">
              <div>
                <h2 class="fs-5 fw-bold mb-1">배우자 검색</h2>
                <p class="small section-desc mb-0">
                  이름 또는 이메일로 검색할 수 있습니다.
                </p>
              </div>
            </div>

            <form class="form mb-4" @submit.prevent>
              <button type="button" aria-label="검색">
                <svg
                  width="17"
                  height="16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  role="img"
                  aria-labelledby="search"
                >
                  <path
                    d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9"
                    stroke="currentColor"
                    stroke-width="1.333"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>

              <input
                v-model="keyword"
                class="input"
                type="text"
                placeholder="배우자 검색(이름 또는 이메일)"
                @input="handleSearch"
              />

              <button
                type="reset"
                class="reset"
                aria-label="검색어 초기화"
                @click="resetSearch"
              >
                ×
              </button>
            </form>

            <div class="d-flex flex-column gap-3">
              <template v-if="limitedSearchResults.length > 0">
                <CoupleCard
                  v-for="user in limitedSearchResults"
                  :key="user.id"
                  :user="user"
                  :type="getUserCardType(user)"
                  :request-id="getRequestIdByUser(user)"
                  @action="
                    (payload) =>
                      handleAction({
                        ...payload,
                        user:
                          payload.type === 'accept' || payload.type === 'reject'
                            ? getReceivedRequestUser(user)
                            : user,
                      })
                  "
                />
              </template>

              <div v-else class="empty-box">검색 결과가 없습니다.</div>
            </div>
          </div>
        </section>

        <section class="col-12 col-xl-7">
          <div class="d-flex flex-column gap-4">
            <div class="content-panel">
              <div
                class="d-flex align-items-center justify-content-between mb-3"
              >
                <div>
                  <h2 class="fs-5 fw-bold mb-1">받은 요청</h2>
                  <p class="small section-desc mb-0">
                    상대방이 보낸 부부 연결 요청입니다.
                  </p>
                </div>
                <span class="count-badge">
                  {{ coupleStore.pendingReceivedRequests.length }}건
                </span>
              </div>

              <div class="d-flex flex-column gap-3">
                <template v-if="coupleStore.pendingReceivedRequests.length > 0">
                  <CoupleCard
                    v-for="req in coupleStore.pendingReceivedRequests"
                    :key="req.id"
                    :user="req.user"
                    type="received"
                    @action="
                      (payload) => handleAction({ ...payload, user: req })
                    "
                  />
                </template>

                <div v-else class="empty-box">아직 받은 요청이 없습니다.</div>
              </div>
            </div>

            <div class="content-panel">
              <div
                class="d-flex align-items-center justify-content-between mb-3"
              >
                <div>
                  <h2 class="fs-5 fw-bold mb-1">보낸 요청</h2>
                  <p class="small section-desc mb-0">
                    내가 보낸 부부 연결 요청입니다.
                  </p>
                </div>
                <span class="count-badge">
                  {{ coupleStore.pendingSentRequests.length }}건
                </span>
              </div>

              <div class="d-flex flex-column gap-3">
                <template v-if="coupleStore.pendingSentRequests.length > 0">
                  <CoupleCard
                    v-for="req in coupleStore.pendingSentRequests"
                    :key="req.id"
                    :user="req.user"
                    :request-id="req.id"
                    type="sent"
                    @action="handleAction"
                  />
                </template>

                <div v-else class="empty-box">아직 보낸 요청이 없습니다.</div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<style scoped>
.couples-page {
  min-height: 100vh;
  width: calc(100% + 3rem);
  margin: -1.5rem;
  background: var(--page-bg);
  color: var(--text-color);
}

.couples-inner {
  max-width: 86rem;
  padding: 5.5rem 1.5rem 1.5rem;
}

@media (min-width: 768px) {
  .couples-page {
    width: calc(100% + 6rem);
    margin: -3rem;
  }
}

.content-panel {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 1.5rem;
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
}

.section-desc {
  color: var(--text-muted);
}

.empty-box {
  background: var(--sub-bg);
  border: 1px dashed var(--border-light);
  border-radius: 1rem;
  padding: 1.2rem 1rem;
  color: var(--text-muted);
  font-size: 0.95rem;
}

.count-badge {
  background: rgba(255, 188, 0, 0.14);
  color: var(--kb-yellow);
  padding: 0.45rem 0.9rem;
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 700;
}

.form {
  --width-of-input: 100%;
  --height-of-input: 50px;
  --input-bg: var(--sub-bg);
  --border-radius: 30px;

  position: relative;
  width: var(--width-of-input);
  height: var(--height-of-input);
  display: flex;
  align-items: center;
  padding-inline: 1rem;
  border-radius: var(--border-radius);
  background: var(--input-bg);
  border: 1px solid var(--border-light);
  transition: all 0.25s ease;
}

.form button {
  border: none;
  background: transparent;
  color: var(--text-muted);
}

.input {
  flex: 1;
  border: none;
  background: transparent;
  color: var(--text-color);
  outline: none;
  padding-inline: 0.85rem;
}

.input::placeholder {
  color: var(--text-muted);
}

.reset {
  font-size: 1rem;
  line-height: 1;
}
</style>
