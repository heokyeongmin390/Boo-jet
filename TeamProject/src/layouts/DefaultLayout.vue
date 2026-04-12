<script setup>
import { ref } from "vue";
import Sidebar from "@/components/common/Sidebar.vue";
import FloatingAddButton from "@/components/ledger/FloatingAddButton.vue";
import AddLedgerDialog from "@/components/ledger/AddLedgerDialog.vue";
import { useLedgerStore } from "@/stores/ledger";

const ledgerStore = useLedgerStore();
const isAddDialogOpen = ref(false);

/**
 * 가계부 추가 핸들러
 * @param {Object} data - 다이얼로그에서 검증되어 올라온 가계부 데이터
 */
const handleAddLedger = async (data) => {
  console.log("Received data from AddLedgerDialog:", data);
  try {
    // ledgerStore의 addTransaction 액션 실행
    await ledgerStore.addTransaction(data);

    // 성공 시 다이얼로그 닫기
    isAddDialogOpen.value = false;

    // 필요 시 사용자 알림 (Toast 등)
    console.log("Successfully added:", data);
  } catch (error) {
    console.error("Failed to add ledger:", error);
    alert(error.message || "저장 중 오류가 발생했습니다.");
  }
};
</script>

<template>
  <div class="default-layout">
    <Sidebar />

    <main class="layout-main">
      <RouterView />
    </main>

    <FloatingAddButton @click="isAddDialogOpen = true" />

    <AddLedgerDialog
      :isOpen="isAddDialogOpen"
      @close="isAddDialogOpen = false"
      @add="handleAddLedger"
    />
  </div>
</template>

<style scoped>
.default-layout {
  width: 100%;
  min-height: 100vh;
  display: flex;
  background: var(--page-bg);
}

.layout-main {
  flex: 1;
  min-width: 0;
  overflow: auto;
  padding: 1.5rem;
  background: var(--page-bg);
}

@media (min-width: 992px) {
  .layout-main {
    padding: 3rem;
  }
}

@media (max-width: 991.98px) {
  .default-layout {
    display: block;
  }

  .layout-main {
    width: 100%;
    min-height: 100vh;
    padding: 0;
    background: var(--page-bg);
  }
}
</style>
