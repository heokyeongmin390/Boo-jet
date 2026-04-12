<script setup>
import { computed } from "vue";
import { useLedgerStore } from "@/stores/ledger";

const props = defineProps({
  selectedCategory: {
    type: String,
    default: null,
  },
});

const emit = defineEmits(["selectCategory"]);
const ledgerStore = useLedgerStore();

// 1. 스토어의 실제 데이터를 가져오고 금액이 있는 것만 필터링
const chartData = computed(() => {
  return ledgerStore.categoryExpenseChartData
    .filter((item) => item.value > 0)
    .sort((a, b) => b.value - a.value); // 비중이 큰 순서대로 정렬
});

// 2. 전체 지출 합계 (비중 계산용)
const totalAmount = computed(() =>
  chartData.value.reduce((sum, item) => sum + item.value, 0),
);

// 카테고리 클릭 핸들러
const handleCategoryClick = (category) => {
  if (props.selectedCategory === category) {
    emit("selectCategory", null);
  } else {
    emit("selectCategory", category);
  }
};
</script>

<template>
  <div class="ledger-card rounded-4 p-4">
    <div class="d-flex align-items-center justify-content-between mb-4">
      <h3 class="fw-bold m-0 fs-5">카테고리별 지출 비중</h3>

      <button
        v-if="selectedCategory"
        @click="emit('selectCategory', null)"
        class="reset-filter-btn small p-0"
        type="button"
      >
        전체 보기
      </button>
    </div>

    <template v-if="chartData.length > 0">
      <div
        class="chart-track w-100 d-flex rounded-3 overflow-hidden mb-4"
        style="height: 32px"
      >
        <div
          v-for="item in chartData"
          :key="item.category"
          class="h-100 transition-all cursor-pointer position-relative"
          :style="{
            width: `${(item.value / totalAmount) * 100}%`,
            backgroundColor: item.color,
            opacity:
              selectedCategory && selectedCategory !== item.category
                ? '0.3'
                : '1',
          }"
          @click="handleCategoryClick(item.category)"
          :title="`${item.category}: ${((item.value / totalAmount) * 100).toFixed(1)}%`"
        ></div>
      </div>

      <div class="d-flex flex-column gap-3">
        <div
          v-for="item in chartData"
          :key="item.category"
          class="category-row d-flex align-items-center gap-3 cursor-pointer p-2 rounded-3"
          :class="
            selectedCategory === item.category ? 'category-row-active' : ''
          "
          @click="handleCategoryClick(item.category)"
        >
          <div
            class="rounded-circle flex-shrink-0"
            :style="{
              backgroundColor: item.color,
              width: '12px',
              height: '12px',
            }"
          />
          <span
            class="small fw-medium mb-0"
            :class="
              selectedCategory === item.category
                ? 'category-text-active'
                : 'category-text'
            "
          >
            {{ item.category }}
          </span>
          <span class="small fw-bold ms-auto mb-0">
            {{ ((item.value / totalAmount) * 100).toFixed(0) }}%
          </span>
        </div>
      </div>
    </template>

    <div v-else class="empty-box py-5 text-center rounded-3">
      <p class="small mb-0 category-text">지출 데이터가 없습니다.</p>
    </div>
  </div>
</template>

<style scoped>
.ledger-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
}

.transition-all {
  transition: all 0.3s ease;
}

.cursor-pointer {
  cursor: pointer;
}

.reset-filter-btn {
  border: none;
  background: transparent;
  color: var(--text-muted);
  text-decoration: none;
}

.reset-filter-btn:hover {
  color: var(--text-color);
}

.chart-track {
  background: var(--sub-bg);
}

.category-row {
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.category-row-active {
  background: var(--sub-bg);
}

.category-text {
  color: var(--text-muted);
}

.category-text-active {
  color: var(--text-color);
}

.empty-box {
  background: var(--sub-bg);
}
</style>
