<template>
  <div class="ledger-card rounded-4 p-4">
    <h3 class="fw-bold mb-4 fs-5">카테고리별 지출 순위</h3>

    <div v-if="rankingData.length > 0" class="d-flex flex-column gap-4">
      <div v-for="(item, index) in rankingData" :key="item.category">
        <div class="d-flex align-items-center justify-content-between mb-2">
          <div class="d-flex align-items-center gap-3">
            <div
              class="rank-badge rounded-3 d-flex align-items-center justify-content-center fw-bold small"
              style="width: 32px; height: 32px"
            >
              {{ index + 1 }}
            </div>

            <div class="d-flex align-items-center gap-2">
              <div
                class="rounded-circle"
                :style="{
                  backgroundColor: item.color,
                  width: '12px',
                  height: '12px',
                }"
              />
              <span class="fw-medium m-0">{{ item.category }}</span>
            </div>
          </div>

          <div class="text-end">
            <div class="fw-bold m-0">{{ item.value.toLocaleString() }}원</div>
            <div class="small ranking-subtext m-0">
              {{ getCategoryCount(item.category) }}건
            </div>
          </div>
        </div>

        <div
          class="ranking-track w-100 rounded-pill overflow-hidden"
          style="height: 8px"
        >
          <div
            class="h-100 rounded-pill transition-all"
            :style="{
              width: `${(item.value / totalAmount) * 100}%`,
              backgroundColor: item.color,
            }"
          />
        </div>
      </div>
    </div>

    <div v-else class="py-5 text-center">
      <p class="ranking-subtext mb-0">이번 달 지출 내역이 없습니다.</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useLedgerStore } from "@/stores/ledger";

const ledgerStore = useLedgerStore();

// 스토어의 데이터를 기반으로 랭킹 데이터 생성
const rankingData = computed(() => {
  // 1. 스토어의 카테고리별 지출 데이터 가져오기 (이미 {category, value, color} 형태)
  // 2. 지출액(value)이 0보다 큰 것만 필터링
  // 3. 지출액 내림차순 정렬
  // 4. 상위 5개 추출
  return ledgerStore.categoryExpenseChartData
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);
});

// 전체 지출 합계 (프로그레스 바 비율 계산용)
const totalAmount = computed(() =>
  rankingData.value.reduce((sum, item) => sum + item.value, 0),
);

// 해당 카테고리의 결제 건수 계산 (선택 사항)
// 만약 스토어에서 count 정보를 주지 않는다면 monthlyTransactions에서 직접 계산해야 합니다.
const getCategoryCount = (categoryName) => {
  return ledgerStore.monthlyTransactions.filter(
    (item) => item.type === "EXPENSE" && item.category === categoryName,
  ).length;
};
</script>

<style scoped>
.ledger-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
}

.transition-all {
  transition: width 0.5s ease-in-out;
}

.rank-badge {
  background: var(--sub-bg);
  color: var(--text-color);
}

.ranking-subtext {
  color: var(--text-muted);
}

.ranking-track {
  background: var(--sub-bg);
}
</style>
