<template>
  <div class="pie-card rounded-4 p-4">
    <h3 class="fw-bold mb-4 fs-5">카테고리별 지출</h3>

    <div class="position-relative" style="height: 16rem">
      <div
        v-if="total === 0"
        class="position-absolute top-50 start-50 translate-middle pie-empty-text small z-1"
      >
        지출 내역이 없습니다
      </div>
      <Pie :data="chartData" :options="chartOptions" />
    </div>

    <div class="d-flex flex-column gap-2 mt-4">
      <div
        v-for="item in sortedSource"
        :key="item.category"
        class="d-flex align-items-center justify-content-between"
      >
        <div class="d-flex align-items-center gap-2">
          <div
            class="rounded-circle"
            :style="{
              backgroundColor: item.color,
              width: '12px',
              height: '12px',
            }"
          />
          <span class="small">{{ item.category }}</span>
        </div>

        <div class="small">
          <span class="fw-medium">{{ item.value.toLocaleString() }}원</span>
          <span class="pie-meta ms-2">
            ({{ getPercentage(item.value) }}%)
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { Pie } from "vue-chartjs";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
});

// 원본 데이터
const chartSource = computed(() => props.data || []);

/**
 * [추가] 내림차순 정렬된 데이터
 * 비중(item.value)이 큰 순서대로 리스트를 정렬합니다.
 */
const sortedSource = computed(() => {
  return [...chartSource.value].sort((a, b) => b.value - a.value);
});

const total = computed(() =>
  chartSource.value.reduce((sum, item) => sum + item.value, 0),
);

const chartData = computed(() => {
  const values = chartSource.value.map((item) => item.value);
  const isAllZero = total.value === 0;

  if (isAllZero) {
    return {
      labels: ["내역 없음"],
      datasets: [
        {
          backgroundColor: ["#f0f0f0"],
          data: [1],
          borderWidth: 0,
          hoverBackgroundColor: ["#f0f0f0"],
        },
      ],
    };
  }

  return {
    labels: chartSource.value.map((item) => item.category),
    datasets: [
      {
        backgroundColor: chartSource.value.map((item) => item.color),
        data: values,
        borderWidth: 0,
      },
    ],
  };
});

const getPercentage = (value) => {
  if (total.value === 0) return "0.0";
  return ((value / total.value) * 100).toFixed(1);
};

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: total.value !== 0 },
  },
  cutout: "60%",
}));
</script>

<style scoped>
.pie-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
}

.pie-empty-text,
.pie-meta {
  color: var(--text-muted);
}

.z-1 {
  z-index: 1;
}
</style>
