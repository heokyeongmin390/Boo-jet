<template>
  <div
    v-if="isOpen"
    class="ledger-edit-backdrop position-fixed top-0 bottom-0 start-0 end-0 d-flex align-items-center justify-content-center z-3 p-4"
    @click.self="handleClose"
  >
    <div
      class="ledger-edit-modal rounded-4 w-100 p-4 shadow-lg"
      style="max-width: 28rem"
    >
      <div class="d-flex align-items-center justify-content-between mb-4">
        <h2 class="fs-5 fw-bold m-0">가계부 내역 수정</h2>
        <button
          @click="handleClose"
          class="modal-close-btn d-flex align-items-center justify-content-center p-0 border-0"
          type="button"
        >
          <X style="width: 20px; height: 20px" />
        </button>
      </div>

      <div class="d-flex flex-column gap-3">
        <div>
          <label class="small form-label-custom mb-2 d-block">구분</label>
          <div class="d-flex gap-2">
            <button
              @click="form.type = 'INCOME'"
              class="type-btn btn flex-grow-1 py-2 rounded-3 border-0 fw-bold"
              :class="
                form.type === 'INCOME'
                  ? 'btn-primary text-white'
                  : 'type-btn-inactive'
              "
            >
              수입
            </button>
            <button
              @click="form.type = 'EXPENSE'"
              class="type-btn btn flex-grow-1 py-2 rounded-3 border-0 fw-bold"
              :class="
                form.type === 'EXPENSE' ? 'text-white' : 'type-btn-inactive'
              "
              :style="
                form.type === 'EXPENSE'
                  ? 'background-color: rgb(240,68,82);'
                  : ''
              "
            >
              지출
            </button>
          </div>
        </div>

        <div>
          <label class="small form-label-custom mb-2 d-block">금액</label>
          <input
            type="text"
            :value="form.amount"
            @input="handleAmountInput"
            class="form-control form-control-custom py-2 rounded-3 border-0 fw-bold"
            placeholder="0"
            inputmode="numeric"
          />
        </div>

        <div>
          <label class="small form-label-custom mb-2 d-block">카테고리</label>
          <div class="row g-2">
            <div
              class="col-4"
              v-for="cat in form.type === 'INCOME'
                ? incomeCategories
                : expenseCategories"
              :key="cat"
            >
              <button
                @click="form.category = cat"
                class="category-btn btn w-100 py-2 rounded-3 small border-0 text-truncate fw-bold"
                :class="
                  form.category === cat
                    ? form.type === 'INCOME'
                      ? 'btn-primary text-white'
                      : 'text-white'
                    : 'category-btn-inactive'
                "
                :style="
                  form.category === cat && form.type === 'EXPENSE'
                    ? 'background-color: rgb(240,68,82);'
                    : ''
                "
              >
                {{ cat }}
              </button>
            </div>
          </div>
        </div>

        <div>
          <label class="small form-label-custom mb-2 d-block">날짜</label>
          <input
            type="date"
            v-model="form.date"
            class="form-control form-control-custom py-2 rounded-3 border-0 fw-bold"
          />
        </div>

        <div>
          <label class="small form-label-custom mb-2 d-block">메모(선택)</label>
          <textarea
            v-model="form.memo"
            rows="2"
            class="form-control form-control-custom py-2 rounded-3 border-0 fw-medium"
            style="resize: none"
          />
        </div>
      </div>

      <div class="d-flex gap-2 mt-4">
        <button
          @click="handleDelete"
          class="delete-btn btn flex-grow-1 py-2 rounded-3 border-0 fw-bold"
        >
          삭제
        </button>
        <button
          @click="handleUpdate"
          class="update-btn btn flex-grow-1 py-2 rounded-3 border-0 fw-bold"
        >
          수정
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { X } from "lucide-vue-next";

const props = defineProps({ isOpen: Boolean, item: Object });
const emit = defineEmits(["close", "update", "delete"]);

const incomeCategories = ["월급", "용돈", "보너스", "기타"];
const expenseCategories = [
  "식비",
  "주거/통신",
  "교통/차량",
  "쇼핑/생활",
  "의료/건강",
  "문화/여가",
  "기타",
];

const form = ref({
  id: null,
  date: "",
  type: "INCOME",
  amount: "",
  category: "",
  memo: "",
  userId: null,
});

const syncFormWithItem = () => {
  if (props.item) {
    form.value = {
      ...props.item,
      amount: String(props.item.amount),
    };
  }
};

watch(
  () => [props.isOpen, props.item],
  ([newIsOpen]) => {
    if (newIsOpen) {
      syncFormWithItem();
    }
  },
  { immediate: true },
);

/**
 * 숫자 이외의 모든 입력 차단 로직
 */
const handleAmountInput = (e) => {
  // 숫자만 남기고 나머지 제거
  const cleanValue = e.target.value.replace(/[^0-9]/g, "");

  // 데이터 업데이트
  form.value.amount = cleanValue;

  // 실제 DOM의 값도 즉시 변경 (한글/특수문자 입력 방지)
  e.target.value = cleanValue;
};

const handleClose = () => {
  syncFormWithItem();
  emit("close");
};

const handleUpdate = () => {
  if (!form.value.amount || !form.value.category || !form.value.date)
    return alert("모든 항목을 입력해주세요.");
  emit("update", { ...form.value, amount: parseInt(form.value.amount, 10) });
};

const handleDelete = () => {
  if (confirm("정말로 삭제할까요?")) emit("delete", form.value.id);
};
</script>

<style scoped>
/* 이전 스타일과 동일 */
.ledger-edit-backdrop {
  background: rgba(17, 24, 39, 0.55);
}
.ledger-edit-modal {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  color: var(--text-color);
}
.form-control-custom {
  background: var(--sub-bg);
  color: var(--text-color);
  border: 1px solid var(--border-light) !important;
}

.modal-close-btn {
  width: 32px;
  height: 32px;
  border-radius: 0.5rem;
  background: transparent;
  color: var(--text-muted);
  transition: all 0.2s ease;
}
.modal-close-btn:hover {
  background: var(--sub-bg);
  color: var(--text-color);
}

.btn {
  transition: all 0.25s ease;
  font-weight: 700 !important;
}
.update-btn {
  background-color: rgba(255, 204, 80, 0.2);
  color: #856404;
}
.update-btn:hover {
  background-color: rgb(255, 204, 80);
  color: #1f2937;
  transform: translateY(-1px);
}
.delete-btn {
  background-color: rgba(240, 68, 82, 0.1);
  color: rgb(240, 68, 82);
}
.delete-btn:hover {
  background-color: rgb(240, 68, 82);
  color: #ffffff;
  transform: translateY(-1px);
}
.type-btn-inactive,
.category-btn-inactive {
  background: var(--sub-bg);
  color: var(--text-muted);
  opacity: 0.6;
}
.type-btn-inactive:hover,
.category-btn-inactive:hover {
  opacity: 1;
  background: var(--border-light);
}
</style>
