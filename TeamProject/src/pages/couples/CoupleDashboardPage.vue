<script setup>
import { computed, onMounted, ref } from "vue";
import { usecouplesStore } from "@/stores/couples.js";
import { useAuthStore } from "@/stores/auth.js";
import CoupleDetail from "@/components/couple/CoupleDetail.vue";
import CoupleLink from "@/components/couple/CoupleLink.vue";

const coupleStore = usecouplesStore();
const authStore = useAuthStore();
const isReady = ref(false);

const isCoupled = computed(() => {
  const userId = Number(authStore.user?.id);
  if (!userId) return false;

  return (coupleStore.allcouples || []).some((c) => {
    return Number(c.user1Id) === userId || Number(c.user2Id) === userId;
  });
});

onMounted(async () => {
  const userId = Number(authStore.user?.id);

  await coupleStore.fetchAllcouples();

  if (!isCoupled.value) {
    await coupleStore.fetchReceivedRequests(userId);
    await coupleStore.fetchSentRequests(userId);
  }

  isReady.value = true;
});
</script>
<template>
  <div v-if="isReady">
    <CoupleDetail v-if="isCoupled" />
    <CoupleLink v-else />
  </div>
</template>
