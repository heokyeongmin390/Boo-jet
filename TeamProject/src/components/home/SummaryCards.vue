<template>
  <div :class="vertical ? 'd-flex flex-column gap-3' : 'row g-3'">
    <div :class="vertical ? '' : 'col-12 col-md-4'">
      <div class="summary-card rounded-4 p-4 h-100">
        <div class="d-flex align-items-center gap-3 mb-2">
          <div
            class="d-flex align-items-center justify-content-center rounded bg-primary bg-opacity-10"
            style="width: 32px; height: 32px"
          >
            <TrendingUp
              class="text-primary"
              style="width: 16px; height: 16px"
            />
          </div>
          <span class="small fw-medium summary-label">총 수입</span>
        </div>
        <div class="fs-4 fw-bold text-primary" style="padding-left: 44px">
          +{{ totalIncome.toLocaleString() }}원
        </div>
      </div>
    </div>

    <div :class="vertical ? '' : 'col-12 col-md-4'">
      <div class="summary-card rounded-4 p-4 h-100">
        <div class="d-flex align-items-center gap-3 mb-2">
          <div
            class="d-flex align-items-center justify-content-center rounded"
            style="
              width: 32px;
              height: 32px;
              background-color: rgba(240, 68, 82, 0.1);
            "
          >
            <TrendingDown
              style="width: 16px; height: 16px; color: rgb(240, 68, 82)"
            />
          </div>
          <span class="small fw-medium summary-label">총 지출</span>
        </div>
        <div
          class="fs-4 fw-bold"
          style="padding-left: 44px; color: rgb(240, 68, 82)"
        >
          -{{ totalExpense.toLocaleString() }}원
        </div>
      </div>
    </div>

    <div :class="vertical ? '' : 'col-12 col-md-4'">
      <div class="summary-card rounded-4 p-4 h-100">
        <div class="d-flex align-items-center gap-3 mb-2">
          <div
            class="d-flex align-items-center justify-content-center rounded"
            style="
              width: 32px;
              height: 32px;
              background-color: rgb(255, 204, 80);
            "
          >
            <Wallet class="netprofit-icon" style="width: 16px; height: 16px" />
          </div>
          <span class="small fw-medium summary-label">순 수익</span>
        </div>
        <div
          class="fs-4 fw-bold"
          style="padding-left: 44px"
          :class="netProfit >= 0 ? 'text-primary' : ''"
          :style="netProfit < 0 ? 'color: rgb(240,68,82);' : ''"
        >
          {{ netProfit >= 0 ? "+" : "" }}{{ netProfit.toLocaleString() }}원
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { TrendingUp, TrendingDown, Wallet } from "lucide-vue-next";
import { computed } from "vue";

const props = defineProps({
  totalIncome: {
    type: Number,
    required: true,
  },
  totalExpense: {
    type: Number,
    required: true,
  },
  vertical: {
    type: Boolean,
    default: false,
  },
});

const netProfit = computed(() => props.totalIncome - props.totalExpense);
</script>
<style scoped>
.summary-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
}

.summary-label {
  color: var(--text-muted);
}

.netprofit-icon {
  color: #1f2937;
}

:global(html.dark) .netprofit-icon {
  color: #111827;
}
</style>
