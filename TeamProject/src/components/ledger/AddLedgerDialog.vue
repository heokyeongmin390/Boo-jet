<template>
  <div
    v-if="isOpen"
    class="ledger-create-backdrop position-fixed top-0 bottom-0 start-0 end-0 d-flex align-items-center justify-content-center z-3 p-4"
    @click.self="handleClose"
  >
    <div
      class="ledger-create-modal rounded-4 w-100 p-4 shadow-lg"
      style="max-width: 28rem"
    >
      <div class="d-flex align-items-center justify-content-between mb-4">
        <h2 class="fs-5 fw-bold m-0">가계부 생성</h2>
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
              @click="changeType('INCOME')"
              class="type-btn btn flex-grow-1 py-2 rounded-3 border-0 fw-bold"
              :class="
                type === 'INCOME'
                  ? 'btn-primary text-white'
                  : 'type-btn-inactive'
              "
              type="button"
            >
              수입
            </button>

            <button
              @click="changeType('EXPENSE')"
              class="type-btn btn flex-grow-1 py-2 rounded-3 border-0 fw-bold"
              :class="type === 'EXPENSE' ? 'text-white' : 'type-btn-inactive'"
              :style="
                type === 'EXPENSE' ? 'background-color: rgb(240,68,82);' : ''
              "
              type="button"
            >
              지출
            </button>
          </div>
        </div>

        <div>
          <label class="small form-label-custom mb-2 d-block">금액</label>
          <input
            type="text"
            placeholder="숫자만 입력해주세요"
            :value="amount"
            @input="handleAmountInput"
            class="form-control form-control-custom py-2 rounded-3 border-0 fw-bold"
          />
        </div>

        <div>
          <label class="small form-label-custom mb-2 d-block">카테고리</label>
          <div class="row g-2">
            <div
              class="col-4"
              v-for="cat in type === 'INCOME'
                ? incomeCategories
                : expenseCategories"
              :key="cat"
            >
              <button
                @click="category = cat"
                class="category-btn btn w-100 py-2 rounded-3 small border-0 text-truncate fw-bold"
                :class="
                  category === cat
                    ? type === 'INCOME'
                      ? 'btn-primary text-white'
                      : 'text-white'
                    : 'category-btn-inactive'
                "
                :style="
                  category === cat && type === 'EXPENSE'
                    ? 'background-color: rgb(240,68,82);'
                    : ''
                "
                type="button"
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
            v-model="date"
            :max="todayStr"
            class="form-control form-control-custom py-2 rounded-3 border-0 fw-bold"
          />
        </div>

        <div>
          <label class="small form-label-custom mb-2 d-block">메모(선택)</label>
          <textarea
            v-model="memo"
            placeholder="메모를 입력해주세요"
            rows="2"
            class="form-control form-control-custom py-2 rounded-3 border-0 fw-medium"
            style="resize: none"
          />
        </div>
      </div>

      <div class="d-flex gap-2 mt-4">
        <button
          @click="handleClose"
          class="cancel-btn btn flex-grow-1 py-2 rounded-3 border-0 fw-bold"
          type="button"
        >
          취소
        </button>
        <button
          @click="handleSubmit"
          class="create-btn btn flex-grow-1 py-2 rounded-3 border-0 fw-bold"
          type="button"
        >
          생성
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { X } from "lucide-vue-next";

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close", "add"]);

const todayStr = new Date().toISOString().split("T")[0];

const type = ref("INCOME");
const amount = ref("");
const category = ref("");
const date = ref(todayStr);
const memo = ref("");

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

const resetForm = () => {
  amount.value = "";
  category.value = "";
  memo.value = "";
  date.value = todayStr;
  type.value = "INCOME";
};

const handleClose = () => {
  resetForm();
  emit("close");
};

const changeType = (newType) => {
  if (type.value === newType) return;
  type.value = newType;
  amount.value = "";
  category.value = "";
  memo.value = "";
  date.value = todayStr;
};

const handleAmountInput = (e) => {
  const target = e.target;
  const cleanedValue = target.value.replace(/[^0-9]/g, "");
  amount.value = cleanedValue;
  target.value = cleanedValue;
};

const handleSubmit = () => {
  if (!amount.value || !category.value) {
    alert("금액과 카테고리는 필수로 선택해주세요.");
    return;
  }

  if (date.value > todayStr) {
    alert("미래 시점의 가계부는 생성할 수 없어요.");
    return;
  }

  const finalMemo =
    memo.value.trim() !== ""
      ? memo.value.trim()
      : type.value === "EXPENSE"
        ? "지출"
        : "수입";

  emit("add", {
    type: type.value,
    amount: parseInt(amount.value, 10),
    category: category.value,
    date: date.value,
    memo: finalMemo,
  });

  handleClose();
};
</script>

<style scoped>
.ledger-create-backdrop {
  background: rgba(17, 24, 39, 0.55);
}

.ledger-create-modal {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  color: var(--text-color);
}

/* 수정 모달의 닫기 버튼 스타일 이식 */
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

.form-label-custom {
  color: var(--text-muted);
}

.form-control-custom {
  background: var(--sub-bg);
  color: var(--text-color);
  border: 1px solid var(--border-light) !important;
}

.form-control-custom::placeholder {
  color: var(--text-muted);
}

/* 수정 모달과 동일한 버튼 공통 스타일 */
.btn {
  transition: all 0.25s ease;
  font-weight: 700 !important;
}

/* 생성 버튼: 수정 모달의 update-btn 스타일 이식 */
.create-btn {
  background-color: rgba(255, 204, 80, 0.2);
  color: #856404;
}

.create-btn:hover {
  background-color: rgb(255, 204, 80);
  color: #1f2937;
  transform: translateY(-1px);
}

/* 취소 버튼: 수정 모달의 delete-btn 로직과 유사한 흐름 (중립적 연한 빨강 또는 그레이) */
.cancel-btn {
  background-color: var(--sub-bg);
  color: var(--text-muted);
}

.cancel-btn:hover {
  background-color: var(--border-light);
  color: var(--text-color);
  transform: translateY(-1px);
}

/* 타입 및 카테고리 비활성 버튼 */
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
