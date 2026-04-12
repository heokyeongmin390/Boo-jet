<template>
  <div class="couple-detail-page">
    <div
      class="mx-auto d-flex flex-column gap-4 couple-detail-inner"
      style="max-width: 86rem"
    >
      <div class="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 class="fs-4 fw-bold m-0">부부 가계부</h2>
          <p class="section-desc m-0 mt-1">
            배우자와 함께 투명하고 꼼꼼하게 예산을 관리해보세요.
          </p>
        </div>
      </div>

      <div
        class="couple-hero p-5 rounded-4 position-relative overflow-hidden d-flex flex-column align-items-center mb-5"
      >
        <button
          type="button"
          class="couple-edit-btn rounded-circle d-flex align-items-center justify-content-center position-absolute top-0 end-0 m-3 shadow-sm border-0 z-3"
          style="width: 3rem; height: 3rem"
          @click="
            editingMessage === 'user'
              ? saveMessage('user')
              : startEditingMessage('user')
          "
          :title="editingMessage === 'user' ? '저장' : '상태 메시지 수정'"
        >
          <span class="material-symbols-outlined fs-5">
            {{ editingMessage === "user" ? "check" : "edit" }}
          </span>
        </button>

        <div
          class="position-relative z-3 d-flex align-items-center justify-content-center w-100"
          style="max-width: 64rem"
        >
          <div
            class="d-flex align-items-center justify-content-end gap-3 flex-grow-1"
          >
            <div
              class="message-box px-3 py-2 rounded-4 shadow-sm small fw-bold d-none d-xl-block position-relative"
              style="white-space: nowrap"
            >
              <template v-if="editingMessage === 'user'">
                <div class="d-flex align-items-center gap-2">
                  <input
                    v-model="editableMessages.user"
                    type="text"
                    class="form-control form-control-sm"
                    maxlength="20"
                  />
                </div>
              </template>
              <template v-else>
                {{ statusMessages.user }}
              </template>
            </div>

            <div class="d-flex flex-column align-items-center gap-2">
              <div
                class="profile-avatar rounded-circle border border-4 shadow-sm overflow-hidden"
                style="width: 96px; height: 96px"
              >
                <img
                  :src="userProfileImageSrc"
                  alt="내 프로필 이미지"
                  class="w-100 h-100 object-fit-cover"
                />
              </div>
              <span
                class="name-pill px-3 py-1 rounded-pill small fw-bold text-nowrap"
              >
                {{ userName }}
              </span>
            </div>
          </div>

          <div
            class="d-flex flex-column align-items-center gap-2 px-3 px-md-5 flex-shrink-0"
          >
            <button
              type="button"
              class="heart-badge rounded-circle d-flex align-items-center justify-content-center shadow-sm border-0"
              style="width: 48px; height: 48px; cursor: pointer"
              @click="confirmDisconnectCouple"
              @mouseenter="isHeartHovered = true"
              @mouseleave="isHeartHovered = false"
            >
              <span class="material-symbols-outlined filled-icon">
                {{ isHeartHovered ? "heart_broken" : "favorite" }}
              </span>
            </button>
            <div class="d-flex gap-4 mt-1">
              <span class="material-symbols-outlined sync-icon fs-5">
                sync_alt
              </span>
            </div>
          </div>

          <div
            class="d-flex align-items-center justify-content-start gap-3 flex-grow-1"
          >
            <div class="d-flex flex-column align-items-center gap-2">
              <div
                class="profile-avatar rounded-circle border border-4 shadow-sm overflow-hidden"
                style="width: 96px; height: 96px"
              >
                <img
                  :src="partnerProfileImageSrc"
                  alt="파트너 프로필 이미지"
                  class="w-100 h-100 object-fit-cover"
                />
              </div>
              <span
                class="name-pill px-3 py-1 rounded-pill small fw-bold text-nowrap"
              >
                {{ partnerName }}
              </span>
            </div>

            <div
              class="message-box px-3 py-2 rounded-4 shadow-sm small fw-bold d-none d-xl-block position-relative"
              style="white-space: nowrap"
            >
              {{ statusMessages.partner }}
            </div>
          </div>
        </div>

        <div class="mt-4 text-center">
          <p class="fs-5 fw-bold couple-summary-text m-0">
            연동한 지 {{ coupleDays }}일째, 오늘도 함께 가계부를 관리해요!
          </p>
        </div>
      </div>

      <div class="row g-4">
        <div class="col-12 col-lg-8">
          <div class="detail-card p-4 p-md-5 rounded-4 h-100">
            <div class="d-flex align-items-center justify-content-between mb-3">
              <h3 class="fs-5 fw-bold m-0">이번 달 가계 현황 비교</h3>
              <span class="small fw-medium meta-pill px-3 py-1 rounded-pill">
                2026년 4월 기준
              </span>
            </div>

            <p class="small section-desc mb-5">
              항목별 금액을 전체 금액 기준으로 비교해 보여줍니다.
            </p>

            <div class="d-flex flex-column gap-5">
              <div class="position-relative">
                <div
                  class="d-flex justify-content-between align-items-center mb-2 px-2"
                >
                  <div class="text-start flex-1" style="width: 33%">
                    <p class="stat-label fw-bold mb-1 small text-uppercase">
                      {{ userName }}
                    </p>
                    <p class="fs-5 fw-bold m-0 stat-income-user">
                      {{ summary.myIncome.toLocaleString() }}원
                    </p>
                  </div>

                  <div class="text-center flex-1" style="width: 33%">
                    <span
                      class="small fw-bold stat-pill px-3 py-1 rounded-pill"
                    >
                      수입
                    </span>
                    <p class="mt-2 small fw-bold stat-subtext m-0">
                      합산: {{ summary.totalIncome.toLocaleString() }}원
                    </p>
                  </div>

                  <div class="text-end flex-1" style="width: 33%">
                    <p class="stat-label fw-bold mb-1 small text-uppercase">
                      {{ partnerName }}
                    </p>
                    <p class="fs-5 fw-bold m-0 stat-income-partner">
                      {{ summary.partnerIncome.toLocaleString() }}원
                    </p>
                  </div>
                </div>

                <div
                  class="bar-track d-flex align-items-center w-100 rounded-pill overflow-hidden"
                  style="height: 1rem"
                >
                  <div class="flex-grow-1 d-flex justify-content-end h-100">
                    <div
                      class="bar-fill-income-user h-100"
                      :style="{
                        width: incomeBar.myWidth,
                        borderRadius: '50rem 0 0 50rem',
                      }"
                    ></div>
                  </div>

                  <div
                    class="bar-divider h-100"
                    style="width: 2px; z-index: 2"
                  ></div>

                  <div class="flex-grow-1 d-flex justify-content-start h-100">
                    <div
                      class="bar-fill-income-partner h-100"
                      :style="{
                        width: incomeBar.partnerWidth,
                        borderRadius: '0 50rem 50rem 0',
                      }"
                    ></div>
                  </div>
                </div>
              </div>

              <div class="position-relative">
                <div
                  class="d-flex justify-content-between align-items-center mb-2 px-2"
                >
                  <div class="text-start" style="width: 33%">
                    <p class="fs-5 fw-bold m-0 stat-expense-user">
                      {{ summary.myExpense.toLocaleString() }}원
                    </p>
                  </div>

                  <div class="text-center" style="width: 33%">
                    <span
                      class="small fw-bold stat-pill px-3 py-1 rounded-pill"
                    >
                      지출
                    </span>
                    <p class="mt-2 small fw-bold stat-subtext m-0">
                      합산: {{ summary.totalExpense.toLocaleString() }}원
                    </p>
                  </div>

                  <div class="text-end" style="width: 33%">
                    <p class="fs-5 fw-bold m-0 stat-expense-partner">
                      {{ summary.partnerExpense.toLocaleString() }}원
                    </p>
                  </div>
                </div>

                <div
                  class="bar-track d-flex align-items-center w-100 rounded-pill overflow-hidden"
                  style="height: 1rem"
                >
                  <div class="flex-grow-1 d-flex justify-content-end h-100">
                    <div
                      class="bar-fill-expense-user h-100"
                      :style="{
                        width: expenseBar.myWidth,
                        borderRadius: '50rem 0 0 50rem',
                      }"
                    ></div>
                  </div>

                  <div
                    class="bar-divider h-100"
                    style="width: 2px; z-index: 2"
                  ></div>

                  <div class="flex-grow-1 d-flex justify-content-start h-100">
                    <div
                      class="bar-fill-expense-partner h-100"
                      :style="{
                        width: expenseBar.partnerWidth,
                        borderRadius: '0 50rem 50rem 0',
                      }"
                    ></div>
                  </div>
                </div>
              </div>

              <div class="position-relative">
                <div
                  class="d-flex justify-content-between align-items-center mb-2 px-2"
                >
                  <div class="text-start" style="width: 33%">
                    <p class="fs-5 fw-bold m-0 stat-income-user">
                      {{ formatSignedCurrency(summary.myProfit) }}
                    </p>
                  </div>

                  <div
                    class="d-flex flex-column align-items-center text-center"
                    style="width: 33%"
                  >
                    <span
                      class="small fw-bold stat-pill px-3 py-1 rounded-pill"
                    >
                      순이익
                    </span>
                    <p class="mt-2 small fw-bold stat-subtext m-0">
                      합산: {{ formatSignedCurrency(summary.totalProfit) }}
                    </p>
                  </div>

                  <div class="text-end" style="width: 33%">
                    <p class="fs-5 fw-bold m-0 stat-income-partner">
                      {{ formatSignedCurrency(summary.partnerProfit) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 col-lg-4 d-flex flex-column gap-4">
          <div v-if="!goalCards.length || isGoalAddPageOpen" class="d-flex flex-column gap-3">
            <div
              v-if="goalCards.length > 0"
              class="goal-overview-nav d-flex align-items-center justify-content-end px-1"
            >
              <div class="d-flex align-items-center gap-2">
                <button
                  type="button"
                  class="goal-nav-btn d-flex align-items-center justify-content-center border-0"
                  @click="handleGoalNavigationLeft"
                  aria-label="새 목표 추가 또는 이전 목표"
                >
                  <span class="material-symbols-outlined">chevron_left</span>
                </button>
                <button
                  type="button"
                  class="goal-nav-btn d-flex align-items-center justify-content-center border-0"
                  @click="handleGoalNavigation"
                  aria-label="새 목표 추가 또는 다음 목표"
                >
                  <span class="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>
            <div
              class="goal-empty-card rounded-4 border shadow-sm text-center p-4 p-md-5"
              style="border-left: 4px solid #facc15 !important"
            >
              <div class="goal-empty-content">
                <button
                  type="button"
                  class="goal-empty-button mx-auto mb-3 d-flex align-items-center justify-content-center border-0 shadow-sm"
                  @click="openGoalModal()"
                  aria-label="공동 목표 추가"
                >
                  <span class="material-symbols-outlined">add</span>
                </button>
                <p class="small fw-bold text-primary mb-2">공동 목표</p>
                <h4 class="fs-5 fw-bold mb-2">목표 추가하기</h4>
                <p class="goal-subtext small mb-4">
                  수입 목표와 지출 목표를 만들고 커플 가계부와 연결해
                  관리해보세요.
                </p>
              </div>
            </div>
          </div>

          <div v-else class="d-flex flex-column gap-3">
            <div
              v-if="goalCards.length > 0"
              class="goal-overview-nav d-flex align-items-center justify-content-between px-1"
            >
              <div class="small goal-subtext fw-semibold">
                {{ currentGoalIndex + 1 }} / {{ goalCards.length }}
              </div>
              <div class="d-flex align-items-center gap-2">
                <button
                  type="button"
                  class="goal-nav-btn d-flex align-items-center justify-content-center border-0"
                  @click="handleGoalNavigationLeft"
                  aria-label="새 목표 추가 또는 이전 목표"
                >
                  <span class="material-symbols-outlined">chevron_left</span>
                </button>
                <button
                  type="button"
                  class="goal-nav-btn d-flex align-items-center justify-content-center border-0"
                  @click="handleGoalNavigation"
                  aria-label="새 목표 추가 또는 다음 목표"
                >
                  <span class="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>

            <div
              v-if="activeGoalCard"
              :key="activeGoalCard.id"
              class="goal-overview-card rounded-4 border shadow-sm p-4"
              :class="activeGoalCard.kindClass"
            >
              <div
                class="d-flex align-items-start justify-content-between gap-3 mb-3"
              >
                <div>
                  <span
                    class="goal-type-badge rounded-pill px-3 py-2 small fw-bold"
                  >
                    {{ activeGoalCard.typeLabel }}
                  </span>
                </div>
                <div class="d-flex align-items-center gap-2">
                  <button
                    v-if="activeGoalCard.type === 'INCOME'"
                    type="button"
                    class="btn btn-warning goal-action-btn fw-bold goal-action-add-icon"
                    @click="openIncomeTransactionForActiveGoal"
                    aria-label="수입 거래 추가"
                  >
                    추가
                  </button>
                  <button
                    type="button"
                    class="btn border goal-action-btn fw-bold"
                    @click="openGoalModal(activeGoalCard)"
                  >
                    수정
                  </button>
                  <button
                    type="button"
                    class="btn border border-danger text-danger goal-action-btn fw-bold"
                    @click="removeGoal(activeGoalCard.id)"
                  >
                    삭제
                  </button>
                </div>
              </div>

              <h4 class="goal-title-display fw-bold mb-2">
                {{ activeGoalCard.title }}
              </h4>
              <div class="goal-period-text mb-4">
                <div>{{ activeGoalCard.dateText }}</div>
                <div v-if="activeGoalCard.categoryText">
                  {{ activeGoalCard.categoryText }}
                </div>
              </div>

              <div
                class="d-flex justify-content-between align-items-center mb-2"
              >
                <span class="small fw-medium">{{
                  activeGoalCard.progressLabel
                }}</span>
                <span class="fs-5 fw-bold"
                  >{{ activeGoalCard.progressPercent }}%</span
                >
              </div>

              <div
                class="goal-progress-track rounded-pill overflow-hidden mb-4"
              >
                <div
                  class="goal-progress-fill h-100"
                  :class="activeGoalCard.progressClass"
                  :style="{ width: `${activeGoalCard.progressPercent}%` }"
                ></div>
              </div>

              <div class="row g-3 mb-4">
                <div class="col-6">
                  <div class="goal-stat-box rounded-4 p-3 h-100">
                    <div class="small goal-subtext mb-2">목표 금액</div>
                    <div class="fs-4 fw-bold">
                      {{ activeGoalCard.targetText }}
                    </div>
                  </div>
                </div>
                <div class="col-6">
                  <div class="goal-stat-box rounded-4 p-3 h-100">
                    <div class="small goal-subtext mb-2">
                      {{ activeGoalCard.amountLabel }}
                    </div>
                    <div class="fs-4 fw-bold">
                      {{ activeGoalCard.currentText }}
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="button"
                class="btn goal-detail-open-btn w-100 py-3 fw-bold rounded-4"
                @click="openGoalDetailModal(activeGoalCard)"
              >
                상세 내역 보기
              </button>
            </div>
          </div>

          <div class="detail-card p-4 rounded-4">
            <h3
              class="fw-bold mb-4 small d-flex align-items-center justify-content-between"
            >
              최근 활동 피드
              <span
                class="bg-primary text-white px-2 py-1 rounded-pill"
                style="font-size: 10px"
              >
                New
              </span>
            </h3>

            <div class="d-flex flex-column gap-3">
              <div
                class="feed-item p-3 rounded-3 d-flex align-items-center gap-3 border"
              >
                <div
                  class="feed-avatar rounded-circle d-flex align-items-center justify-content-center small fw-bold"
                  style="width: 32px; height: 32px"
                >
                  <img
                    :src="userProfileImageSrc"
                    alt="내 프로필 이미지"
                    class="feed-avatar-image"
                  />
                </div>
                <div class="flex-grow-1">
                  <p class="fw-medium m-0 feed-text" style="font-size: 11px">
                    {{ userName }}님이 {{ myLatestTransaction?.category }}
                    {{ myLatestTransaction?.amount }}원을 입력했습니다.
                  </p>
                  <p class="feed-time mt-1 m-0" style="font-size: 9px">
                    5분 전
                  </p>
                </div>
              </div>

              <div
                class="feed-item p-3 rounded-3 d-flex align-items-center gap-3 border"
              >
                <div
                  class="feed-avatar rounded-circle d-flex align-items-center justify-content-center small fw-bold"
                  style="width: 32px; height: 32px"
                >
                  <img
                    :src="partnerProfileImageSrc"
                    alt="파트너 프로필 이미지"
                    class="feed-avatar-image"
                  />
                </div>
                <div class="flex-grow-1">
                  <p class="fw-medium m-0 feed-text" style="font-size: 11px">
                    {{ partnerName }}님이
                    {{ partnerLatestTransaction?.category }}
                    {{ partnerLatestTransaction?.amount }}원을 입력했습니다.
                  </p>
                  <p class="feed-time mt-1 m-0" style="font-size: 9px">
                    5분 전
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-5">
        <div class="d-flex align-items-center justify-content-between mb-4">
          <h3 class="fs-4 fw-bold m-0">부부 카테고리 비교</h3>
          <button
            v-if="hasMoreCategories || showAllCategories"
            type="button"
            class="btn btn-warning rounded-circle d-flex align-items-center justify-content-center shadow-sm border-0"
            style="width: 3rem; height: 3rem"
            @click="showAllCategories = !showAllCategories"
          >
            <span class="material-symbols-outlined fs-4">
              {{ showAllCategories ? "remove" : "add" }}
            </span>
          </button>
        </div>

        <div class="row g-4">
          <div
            v-for="cat in visibleCategories"
            :key="cat.name"
            class="col-12 col-md-6 col-lg-3"
          >
            <div class="detail-card p-4 rounded-4 h-100">
              <div class="d-flex align-items-center gap-3 mb-3">
                <div
                  class="rounded-3 d-flex align-items-center justify-content-center"
                  :class="cat.bgClass"
                  style="width: 40px; height: 40px"
                >
                  <span class="material-symbols-outlined fs-5">
                    {{ cat.icon }}
                  </span>
                </div>
                <span class="fw-bold">{{ cat.name }}</span>
              </div>

              <div class="d-flex flex-column gap-2">
                <div
                  class="d-flex justify-content-between align-items-center small"
                >
                  <span class="category-label">{{ userName }}</span>
                  <span class="fw-bold" style="color: #e53935">
                    {{ cat.val1 }}
                  </span>
                </div>

                <div
                  class="d-flex justify-content-between align-items-center small"
                >
                  <span class="category-label">{{ partnerName }}</span>
                  <span class="fw-bold" style="color: #1e88e5">
                    {{ cat.val2 }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="isGoalModalOpen"
      class="goal-modal-backdrop position-fixed top-0 start-0 end-0 bottom-0 d-flex align-items-center justify-content-center p-3 p-md-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="goal-modal-title"
      @click="closeGoalModal"
    >
      <div
        class="goal-modal-card rounded-4 p-4"
        :class="{ 'is-create-mode': !editingGoalId }"
        @click.stop
      >
        <div
          class="d-flex align-items-start justify-content-between gap-3 mb-4"
        >
          <div>
            <h3 id="goal-modal-title" class="goal-modal-title fw-bold mb-2">
              공동 목표 만들기
            </h3>
            <p class="goal-modal-subtext mb-0">
              수입 목표와 지출 목표를 만들고 기간 내 거래 데이터와 연결해 진행
              현황을 관리합니다.
            </p>
          </div>
          <button
            type="button"
            class="goal-modal-close d-flex align-items-center justify-content-center border-0"
            @click="closeGoalModal"
            aria-label="닫기"
          >
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <div class="d-flex justify-content-end mb-4">
          <div class="goal-type-toggle d-inline-flex rounded-pill p-1">
            <button
              type="button"
              class="goal-type-option px-4 py-3 rounded-pill fw-bold border-0"
              :class="{ active: goalForm.type === 'INCOME' }"
              @click="goalForm.type = 'INCOME'"
            >
              수입 목표
            </button>
            <button
              type="button"
              class="goal-type-option px-4 py-3 rounded-pill fw-bold border-0"
              :class="{ active: goalForm.type === 'EXPENSE' }"
              @click="goalForm.type = 'EXPENSE'"
            >
              지출 목표
            </button>
          </div>
        </div>

        <form class="d-flex flex-column gap-4" @submit.prevent="submitGoal">
          <div>
            <label for="goal-title" class="form-label fw-bold">목표 이름</label>
            <input
              id="goal-title"
              v-model="goalForm.title"
              type="text"
              class="form-control goal-form-control"
              placeholder="예: 여행 자금 모으기"
              maxlength="30"
              required
            />
          </div>

          <div class="d-flex flex-column gap-4">
            <div>
              <label for="goal-amount" class="form-label fw-bold"
                >목표 금액</label
              >
              <input
                id="goal-amount"
                v-model.number="goalForm.targetAmount"
                type="number"
                min="1"
                class="form-control goal-form-control"
                placeholder="예: 1000000"
                required
              />
            </div>

            <div>
              <label class="form-label fw-bold">목표 기간</label>
              <div class="goal-date-range-picker rounded-4 border p-3 mt-2">
                <div class="goal-date-field mb-4">
                  <div class="d-flex align-items-center gap-2 mb-2">
                    <span class="material-symbols-outlined text-muted"
                      >calendar_month</span
                    >
                    <span class="goal-date-caption text-muted">Start</span>
                  </div>
                  <input
                    v-model="goalForm.startDate"
                    type="text"
                    class="form-control goal-form-control"
                    readonly
                    @focus="openGoalDatePicker('start')"
                    @click="openGoalDatePicker('start')"
                    aria-label="Start date"
                    required
                  />
                </div>
                <div class="date-range-separator text-center text-muted mb-4">
                  ~
                </div>
                <div class="goal-date-field">
                  <div class="d-flex align-items-center gap-2 mb-2">
                    <span class="material-symbols-outlined text-muted"
                      >calendar_month</span
                    >
                    <span class="goal-date-caption text-muted">End</span>
                  </div>
                  <input
                    v-model="goalForm.endDate"
                    type="text"
                    class="form-control goal-form-control"
                    readonly
                    @focus="openGoalDatePicker('end')"
                    @click="openGoalDatePicker('end')"
                    aria-label="End date"
                    required
                  />
                </div>
                <div
                  v-if="goalDatePicker.visible"
                  class="goal-date-picker-modal position-absolute top-100 start-50 translate-middle-x mt-3 p-3 rounded-4 border shadow"
                >
                  <div
                    class="d-flex align-items-center justify-content-between mb-3"
                  >
                    <div class="fw-semibold">
                      {{ goalPickerMonthItems[0].year }}년
                      {{ goalPickerMonthItems[0].month + 1 }}월
                    </div>
                    <div class="d-flex gap-2">
                      <button
                        type="button"
                        class="btn btn-sm btn-outline-secondary"
                        @click="prevGoalPickerMonth"
                      >
                        <span class="material-symbols-outlined"
                          >chevron_left</span
                        >
                      </button>
                      <button
                        type="button"
                        class="btn btn-sm btn-outline-secondary"
                        @click="nextGoalPickerMonth"
                      >
                        <span class="material-symbols-outlined"
                          >chevron_right</span
                        >
                      </button>
                    </div>
                  </div>

                  <div class="goal-date-picker-grid mb-3">
                    <div
                      v-for="monthItem in goalPickerMonthItems"
                      :key="`${monthItem.year}-${monthItem.month}`"
                      class="goal-date-calendar p-2 rounded-3 border"
                    >
                      <div class="mb-2 fw-semibold">
                        {{ monthItem.year }}년 {{ monthItem.month + 1 }}월
                      </div>
                      <div
                        class="d-grid gap-2"
                        :style="{
                          gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
                        }"
                      >
                        <div
                          v-for="dayName in [
                            'Su',
                            'Mo',
                            'Tu',
                            'We',
                            'Th',
                            'Fr',
                            'Sa',
                          ]"
                          :key="dayName"
                          class="text-center small text-muted"
                        >
                          {{ dayName }}
                        </div>
                        <template
                          v-for="(day, idx) in createCalendarDays(
                            monthItem.year,
                            monthItem.month,
                          )"
                          :key="`day-${monthItem.year}-${monthItem.month}-${idx}`"
                        >
                          <div v-if="!day"></div>
                          <button
                            v-else
                            type="button"
                            class="goal-date-picker-day border-0 rounded-2"
                            :class="{
                              'selected-day': isGoalPickerSelected(day.date),
                              'in-range-day': isGoalPickerInRange(day.date),
                            }"
                            @click="selectGoalDate(day.date)"
                          >
                            {{ day.day }}
                          </button>
                        </template>
                      </div>
                    </div>
                  </div>

                  <div class="d-flex justify-content-end gap-2">
                    <button
                      type="button"
                      class="btn btn-sm btn-outline-secondary"
                      @click="cancelGoalDateRange"
                    >
                      취소
                    </button>
                    <button
                      type="button"
                      class="btn btn-sm btn-primary"
                      @click="applyGoalDateRange"
                    >
                      적용
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="goalForm.type === 'EXPENSE'">
            <label class="form-label fw-bold">연결 카테고리</label>
            <div class="goal-category-chips d-flex flex-wrap gap-2">
              <button
                v-for="option in expenseCategoryOptions"
                :key="option"
                type="button"
                class="goal-category-chip border rounded-pill px-3 py-2 fw-medium"
                :class="{ active: goalForm.categories.includes(option) }"
                @click="toggleExpenseCategory(option)"
              >
                {{ option }}
              </button>
            </div>
            <p class="goal-subtext small mt-2 mb-0">
              선택하지 않으면 전체 지출을 기준으로 계산합니다.
            </p>
          </div>

          <div class="d-flex gap-2 flex-wrap">
            <button
              type="submit"
              class="btn goal-preview-btn py-3 px-4 fw-bold rounded-4"
            >
              {{ editingGoalId ? "목표 수정" : "추가" }}
            </button>
            <button
              type="button"
              class="btn goal-reset-btn py-3 px-4 fw-bold rounded-4"
              @click="resetGoalForm"
            >
              초기화
            </button>
          </div>
        </form>
      </div>
    </div>

    <div
      v-if="isGoalDetailModalOpen && selectedGoalDetail"
      class="goal-modal-backdrop position-fixed top-0 start-0 end-0 bottom-0 d-flex align-items-center justify-content-center p-3 p-md-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="goal-detail-modal-title"
      @click="closeGoalDetailModal"
    >
      <div class="goal-detail-modal-card rounded-4 p-4" @click.stop>
        <div
          class="d-flex align-items-start justify-content-between gap-3 mb-4"
        >
          <div>
            <span class="goal-type-badge rounded-pill px-3 py-2 small fw-bold">
              {{ selectedGoalDetail.typeLabel }}
            </span>
            <h3
              id="goal-detail-modal-title"
              class="goal-modal-title fw-bold mb-2 mt-3"
            >
              {{ selectedGoalDetail.title }}
            </h3>
            <div class="goal-modal-subtext mb-0">
              <div>{{ selectedGoalDetail.dateText }}</div>
              <div v-if="selectedGoalDetail.categoryText">
                {{ selectedGoalDetail.categoryText }}
              </div>
            </div>
          </div>
          <div class="d-flex align-items-center gap-2">
            <button
              v-if="selectedGoalDetail.type === 'INCOME'"
              type="button"
              class="goal-modal-close d-flex align-items-center justify-content-center border-0"
              @click="openGoalIncomeTransactionModal()"
              aria-label="수입 거래 추가"
            >
              <span class="material-symbols-outlined">add</span>
            </button>
            <button
              type="button"
              class="goal-modal-close d-flex align-items-center justify-content-center border-0"
              @click="closeGoalDetailModal"
              aria-label="닫기"
            >
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        <div class="row g-3 mb-4">
          <div class="col-6">
            <div class="goal-stat-box rounded-4 p-3 h-100">
              <div class="small goal-subtext mb-2">목표 금액</div>
              <div class="fs-4 fw-bold">
                {{ selectedGoalDetail.targetText }}
              </div>
            </div>
          </div>
          <div class="col-6">
            <div class="goal-stat-box rounded-4 p-3 h-100">
              <div class="small goal-subtext mb-2">
                {{ selectedGoalDetail.amountLabel }}
              </div>
              <div class="fs-4 fw-bold">
                {{ selectedGoalDetail.currentText }}
              </div>
            </div>
          </div>
        </div>

        <div class="goal-linked-box rounded-4 p-4">
          <h5 class="fw-bold mb-3">{{ selectedGoalDetail.linkedTitle }}</h5>
          <div
            v-if="selectedGoalDetail.linkedTransactions.length"
            class="goal-linked-scroll d-flex flex-column gap-3 pe-1"
          >
            <div
              v-for="item in selectedGoalDetail.linkedTransactions"
              :key="item.id"
              class="goal-linked-item rounded-4 p-3 d-flex align-items-center justify-content-between gap-3"
            >
              <div class="flex-grow-1">
                <div class="fw-bold mb-1">
                  {{ item.memo || selectedGoalDetail.defaultMemo }}
                </div>
                <div class="goal-subtext">
                  {{ item.date }} /
                  {{ item.category || selectedGoalDetail.defaultCategory }}
                </div>
              </div>
              <div class="d-flex align-items-center gap-2">
                <button
                  v-if="selectedGoalDetail.type === 'INCOME'"
                  type="button"
                  class="goal-row-edit-btn d-flex align-items-center justify-content-center border-0"
                  @click="openGoalIncomeTransactionModal(item)"
                  aria-label="거래 수정"
                >
                  <span class="material-symbols-outlined">edit</span>
                </button>
                <div class="fs-5 fw-bold">
                  {{ formatCurrency(item.amount) }}
                </div>
              </div>
            </div>
          </div>
          <div v-else class="goal-subtext">아직 연결된 거래가 없습니다.</div>
        </div>
      </div>
    </div>

    <div
      v-if="isGoalIncomeTransactionModalOpen"
      class="goal-modal-backdrop position-fixed top-0 start-0 end-0 bottom-0 d-flex align-items-center justify-content-center p-3 p-md-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="goal-income-transaction-title"
      @click="closeGoalIncomeTransactionModal"
    >
      <div class="goal-income-transaction-card rounded-4 p-4" @click.stop>
        <div
          class="d-flex align-items-center justify-content-between gap-3 mb-4"
        >
          <div>
            <h3 id="goal-income-transaction-title" class="fs-5 fw-bold mb-1">
              {{
                editingGoalTransactionId ? "커플 수입 수정" : "커플 수입 추가"
              }}
            </h3>
            <p class="goal-modal-subtext mb-0">
              카테고리는 자동으로 `커플`로 저장되고 현재 목표와 함께 연결됩니다.
            </p>
          </div>
          <button
            type="button"
            class="goal-modal-close d-flex align-items-center justify-content-center border-0"
            @click="closeGoalIncomeTransactionModal"
            aria-label="닫기"
          >
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <form
          class="d-flex flex-column gap-3"
          @submit.prevent="submitGoalIncomeTransaction"
        >
          <div>
            <label for="goal-income-amount" class="form-label fw-bold"
              >금액</label
            >
            <input
              id="goal-income-amount"
              v-model.number="goalIncomeForm.amount"
              type="number"
              min="1"
              class="form-control goal-form-control"
              placeholder="예: 50000"
              required
            />
          </div>

          <div>
            <label for="goal-income-date" class="form-label fw-bold"
              >날짜</label
            >
            <input
              id="goal-income-date"
              v-model="goalIncomeForm.date"
              type="date"
              class="form-control goal-form-control"
              :min="goalIncomeDateMin"
              :max="goalIncomeDateMax"
              required
            />
          </div>

          <div>
            <label for="goal-income-memo" class="form-label fw-bold"
              >메모</label
            >
            <input
              id="goal-income-memo"
              v-model="goalIncomeForm.memo"
              type="text"
              class="form-control goal-form-control"
              placeholder="예: 부모님 지원금"
            />
          </div>

          <div class="goal-income-fixed rounded-4 p-3">
            <div class="small goal-subtext mb-1">추가 정보</div>
            <div class="fw-semibold">카테고리: 커플</div>
            <div class="small goal-subtext">
              목표: {{ selectedGoalDetail?.title || "-" }}
            </div>
          </div>

          <div class="d-flex gap-2 mt-2">
            <button
              type="submit"
              class="btn goal-preview-btn py-3 px-4 fw-bold rounded-4 flex-grow-1"
            >
              {{ editingGoalTransactionId ? "수정" : "추가" }}
            </button>
            <button
              type="button"
              class="btn goal-reset-btn py-3 px-4 fw-bold rounded-4"
              @click="closeGoalIncomeTransactionModal"
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import { useAuthStore } from "../../stores/auth";
import { usecouplesStore } from "../../stores/couples";
import { getUserById } from "../../api/auth";
import api from "@/api/api";
import { useRouter } from "vue-router";
import { useUiStore } from "@/stores/ui";
import {
  getCoupleMonthlySummary,
  getCoupleTransactions,
} from "@/api/coupleLedger";
import { getProfileImageSrc } from "@/components/common/profileImages.js";

const router = useRouter();
const uiStore = useUiStore();
const authStore = useAuthStore();
const couplesStore = usecouplesStore();
const partner = ref(null);
const userProfileImageSrc = computed(() =>
  getProfileImageSrc(authStore.user?.profileImageKey),
);
const partnerProfileImageSrc = computed(() =>
  getProfileImageSrc(partner.value?.profileImageKey),
);

const userName = computed(() => authStore.user?.name || "사용자");
const userId = computed(() => authStore.user?.id);
const myCouple = computed(() => couplesStore.couples[0] || null);

const partnerId = computed(() => {
  if (!myCouple.value || !userId.value) return null;
  return myCouple.value.user1Id === userId.value
    ? myCouple.value.user2Id
    : myCouple.value.user1Id;
});

const partnerName = computed(() => partner.value?.name || "배우자");

const statusMessages = ref({
  user: "",
  partner: "",
});

const editableMessages = ref({
  user: statusMessages.value.user,
});

const isHeartHovered = ref(false);

const userStatusField = computed(() => {
  if (!myCouple.value || !userId.value) return null;
  return myCouple.value.user1Id === userId.value
    ? "user1Message"
    : "user2Message";
});

const partnerStatusField = computed(() => {
  if (!myCouple.value || !userId.value) return null;
  return myCouple.value.user1Id === userId.value
    ? "user2Message"
    : "user1Message";
});

const loadStatusMessages = () => {
  if (!myCouple.value) return;

  const userMessage =
    myCouple.value[userStatusField.value] || statusMessages.value.user;
  const partnerMessage =
    myCouple.value[partnerStatusField.value] || statusMessages.value.partner;

  statusMessages.value.user = userMessage;
  statusMessages.value.partner = partnerMessage;
  editableMessages.value.user = userMessage;
};

const editingMessage = ref(null);

const coupleDays = computed(() => {
  if (!myCouple.value?.createdAt) return 0;
  const createdDate = new Date(myCouple.value.createdAt);
  const today = new Date();
  return Math.floor((today - createdDate) / (1000 * 60 * 60 * 24)) + 1;
});

const categoryMeta = {
  식비: {
    icon: "restaurant",
    bgClass: "bg-danger bg-opacity-10 text-danger",
  },
  "주거/통신": {
    icon: "home",
    bgClass: "bg-primary bg-opacity-10 text-primary",
  },
  "교통/차량": {
    icon: "directions_car",
    bgClass: "bg-warning bg-opacity-10 text-warning",
  },
  "쇼핑/생활": {
    icon: "shopping_bag",
    bgClass: "bg-success bg-opacity-10 text-success",
  },
  "의료/건강": {
    icon: "medical_services",
    bgClass: "bg-info bg-opacity-10 text-info",
  },
  "문화/여가": {
    icon: "sports_esports",
    bgClass: "culture-badge",
  },
  기타: {
    icon: "category",
    bgClass: "bg-dark bg-opacity-10 text-dark",
  },
};

const summary = ref({
  myIncome: 0,
  partnerIncome: 0,
  totalIncome: 0,
  myExpense: 0,
  partnerExpense: 0,
  totalExpense: 0,
  myProfit: 0,
  partnerProfit: 0,
  totalProfit: 0,
  transactions: [],
});

const allTransactions = ref([]);
const coupleGoals = ref([]);
const isGoalModalOpen = ref(false);
const isGoalAddPageOpen = ref(false);
const editingGoalId = ref(null);
const currentGoalIndex = ref(0);
const isGoalDetailModalOpen = ref(false);
const selectedGoalDetailId = ref(null);
const isGoalIncomeTransactionModalOpen = ref(false);
const editingGoalTransactionId = ref(null);

const createTodayDate = () => new Date().toISOString().slice(0, 10);

const createDefaultGoalForm = () => {
  const today = new Date();
  const end = new Date(today);
  end.setMonth(end.getMonth() + 1);

  return {
    type: "INCOME",
    title: "",
    targetAmount: "",
    startDate: today.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
    categories: [],
  };
};

const goalForm = ref(createDefaultGoalForm());
const goalIncomeForm = ref({
  amount: "",
  date: createTodayDate(),
  memo: "",
});

const pad2 = (value) => String(value).padStart(2, "0");

const goalDatePicker = ref({
  visible: false,
  activeField: "start",
  year: new Date().getFullYear(),
  month: new Date().getMonth(),
  tempStart: goalForm.value.startDate,
  tempEnd: goalForm.value.endDate,
  originalStart: goalForm.value.startDate,
  originalEnd: goalForm.value.endDate,
});

const goalPickerMonthItems = computed(() => {
  const year = goalDatePicker.value.year;
  const month = goalDatePicker.value.month;
  const next = new Date(year, month + 1, 1);

  return [
    { year, month },
    { year: next.getFullYear(), month: next.getMonth() },
  ];
});

const createCalendarDays = (year, month) => {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  return Array.from({ length: firstDay + daysInMonth }, (_, idx) => {
    if (idx < firstDay) return null;
    const day = idx - firstDay + 1;
    return {
      day,
      date: `${year}-${pad2(month + 1)}-${pad2(day)}`,
    };
  });
};

const openGoalDatePicker = (field) => {
  const startDate = goalForm.value.startDate || createTodayDate();
  const date = new Date(startDate);
  goalDatePicker.value.visible = true;
  goalDatePicker.value.activeField = field;
  goalDatePicker.value.year = date.getFullYear();
  goalDatePicker.value.month = date.getMonth();
  goalDatePicker.value.tempStart = goalForm.value.startDate;
  goalDatePicker.value.tempEnd = goalForm.value.endDate;
  goalDatePicker.value.originalStart = goalForm.value.startDate;
  goalDatePicker.value.originalEnd = goalForm.value.endDate;
};

const closeGoalDatePicker = () => {
  goalDatePicker.value.visible = false;
};

const isGoalPickerSelected = (date) => {
  return (
    date === goalDatePicker.value.tempStart ||
    date === goalDatePicker.value.tempEnd
  );
};

const isGoalPickerInRange = (date) => {
  const { tempStart, tempEnd } = goalDatePicker.value;
  if (!tempStart || !tempEnd) return false;
  return date > tempStart && date < tempEnd;
};

const selectGoalDate = (date) => {
  if (!goalDatePicker.value.tempStart || goalDatePicker.value.tempEnd) {
    goalDatePicker.value.tempStart = date;
    goalDatePicker.value.tempEnd = null;
    goalDatePicker.value.activeField = "end";
    goalForm.value.startDate = date;
    goalForm.value.endDate = date;
    return;
  }

  if (date < goalDatePicker.value.tempStart) {
    goalDatePicker.value.tempEnd = goalDatePicker.value.tempStart;
    goalDatePicker.value.tempStart = date;
    goalForm.value.startDate = goalDatePicker.value.tempStart;
    goalForm.value.endDate = goalDatePicker.value.tempEnd;
    return;
  }

  goalDatePicker.value.tempEnd = date;
  goalForm.value.startDate = goalDatePicker.value.tempStart;
  goalForm.value.endDate = goalDatePicker.value.tempEnd;
};

const prevGoalPickerMonth = () => {
  const year = goalDatePicker.value.year;
  const month = goalDatePicker.value.month;
  if (month === 0) {
    goalDatePicker.value.year = year - 1;
    goalDatePicker.value.month = 11;
  } else {
    goalDatePicker.value.month = month - 1;
  }
};

const nextGoalPickerMonth = () => {
  const year = goalDatePicker.value.year;
  const month = goalDatePicker.value.month;
  if (month === 11) {
    goalDatePicker.value.year = year + 1;
    goalDatePicker.value.month = 0;
  } else {
    goalDatePicker.value.month = month + 1;
  }
};

const applyGoalDateRange = () => {
  if (!goalDatePicker.value.tempStart) return;
  if (!goalDatePicker.value.tempEnd) {
    goalDatePicker.value.tempEnd = goalDatePicker.value.tempStart;
  }
  goalForm.value.startDate = goalDatePicker.value.tempStart;
  goalForm.value.endDate = goalDatePicker.value.tempEnd;
  closeGoalDatePicker();
};

const cancelGoalDateRange = () => {
  goalDatePicker.value.tempStart = goalDatePicker.value.originalStart;
  goalDatePicker.value.tempEnd = goalDatePicker.value.originalEnd;
  goalForm.value.startDate = goalDatePicker.value.originalStart;
  goalForm.value.endDate = goalDatePicker.value.originalEnd;
  closeGoalDatePicker();
};

const formatCurrency = (value) => `${Number(value || 0).toLocaleString()}원`;

const expenseCategoryOptions = computed(() => {
  const categories = allTransactions.value
    .filter((item) => item.type === "EXPENSE" && item.category)
    .map((item) => item.category);

  return [...new Set(categories)];
});

const goalCards = computed(() => {
  return [...coupleGoals.value]
    .sort((a, b) => {
      if (a.type === b.type) {
        return String(a.createdAt || "").localeCompare(
          String(b.createdAt || ""),
        );
      }
      return a.type === "INCOME" ? -1 : 1;
    })
    .map((goal) => {
      const matchedTransactions = allTransactions.value
        .filter((item) => {
          if (goal.type === "INCOME") {
            if (item.type !== "INCOME") return false;
            if (Number(item.goalId) !== Number(goal.id)) return false;
            return item.date >= goal.startDate && item.date <= goal.endDate;
          }
          if (goal.type === "EXPENSE" && item.type !== "EXPENSE") return false;
          if (
            goal.categories?.length &&
            !goal.categories.includes(item.category)
          ) {
            return false;
          }
          return item.date >= goal.startDate && item.date <= goal.endDate;
        })
        .sort((a, b) => String(b.date).localeCompare(String(a.date)));

      const linkedTransactions = matchedTransactions;
      const currentAmount = matchedTransactions.reduce(
        (sum, item) => sum + Number(item.amount || 0),
        0,
      );
      const targetAmount = Number(goal.targetAmount || 0);
      const rawPercent =
        targetAmount > 0 ? Math.round((currentAmount / targetAmount) * 100) : 0;
      const progressPercent = Math.max(0, Math.min(100, rawPercent));

      return {
        ...goal,
        linkedTransactions,
        currentAmount,
        progressPercent,
        typeLabel: goal.type === "INCOME" ? "수입 목표" : "지출 목표",
        amountLabel: goal.type === "INCOME" ? "현재 모은 금액" : "현재 지출",
        progressLabel: goal.type === "INCOME" ? "진행률" : "사용률",
        linkedTitle:
          goal.type === "INCOME"
            ? "연결된 수입 내역"
            : "기간 내 대상 지출 내역",
        kindClass: goal.type === "INCOME" ? "is-income" : "is-expense",
        progressClass: goal.type === "INCOME" ? "is-income" : "is-expense",
        targetText: formatCurrency(targetAmount),
        currentText: formatCurrency(currentAmount),
        dateText: `${goal.startDate} ~ ${goal.endDate}`,
        categoryText:
          goal.type === "EXPENSE"
            ? goal.categories?.length
              ? goal.categories.join(", ")
              : "전체 지출"
            : "",
        defaultMemo: goal.type === "INCOME" ? "수입 내역" : "지출 내역",
        defaultCategory:
          goal.type === "INCOME"
            ? "수입"
            : goal.categories?.length
              ? goal.categories.join(", ")
              : "전체 지출",
      };
    });
});

const activeGoalCard = computed(() => {
  if (!goalCards.value.length) return null;
  const safeIndex = Math.min(
    currentGoalIndex.value,
    goalCards.value.length - 1,
  );
  return goalCards.value[safeIndex];
});

const isFirstGoal = computed(() => currentGoalIndex.value <= 0);

const isLastGoal = computed(() => {
  if (!goalCards.value.length) return true;
  return currentGoalIndex.value >= goalCards.value.length - 1;
});

const showPrevGoal = () => {
  currentGoalIndex.value = Math.max(0, currentGoalIndex.value - 1);
};

const showNextGoal = () => {
  currentGoalIndex.value = Math.min(
    goalCards.value.length - 1,
    currentGoalIndex.value + 1,
  );
};

const selectedGoalDetail = computed(() => {
  if (!selectedGoalDetailId.value) return null;
  return (
    goalCards.value.find(
      (item) => Number(item.id) === Number(selectedGoalDetailId.value),
    ) || null
  );
});

const goalIncomeDateMin = computed(
  () => selectedGoalDetail.value?.startDate || "",
);

const goalIncomeDateMax = computed(
  () => selectedGoalDetail.value?.endDate || "",
);

const monthKey = computed(() => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
});

const comparisonScale = computed(() => {
  const incomeA = Number(summary.value.myIncome || 0);
  const incomeB = Number(summary.value.partnerIncome || 0);
  const expenseA = Number(summary.value.myExpense || 0);
  const expenseB = Number(summary.value.partnerExpense || 0);
  const netA = Number(summary.value.myProfit || 0);
  const netB = Number(summary.value.partnerProfit || 0);

  const globalMax = Math.max(
    Math.abs(incomeA),
    Math.abs(incomeB),
    Math.abs(expenseA),
    Math.abs(expenseB),
    Math.abs(netA),
    Math.abs(netB),
    1,
  );

  const toWidth = (value) =>
    `${(Math.abs(Number(value || 0)) / globalMax) * 100}%`;

  return {
    globalMax,
    incomeAWidth: toWidth(incomeA),
    incomeBWidth: toWidth(incomeB),
    expenseAWidth: toWidth(expenseA),
    expenseBWidth: toWidth(expenseB),
  };
});

const incomeBar = computed(() => ({
  myWidth: comparisonScale.value.incomeAWidth,
  partnerWidth: comparisonScale.value.incomeBWidth,
}));

const expenseBar = computed(() => ({
  myWidth: comparisonScale.value.expenseAWidth,
  partnerWidth: comparisonScale.value.expenseBWidth,
}));

const resetGoalForm = () => {
  editingGoalId.value = null;
  goalForm.value = createDefaultGoalForm();
};

const openGoalModal = (goal = null) => {
  if (goal) {
    editingGoalId.value = goal.id;
    goalForm.value = {
      type: goal.type,
      title: goal.title,
      targetAmount: goal.targetAmount,
      startDate: goal.startDate,
      endDate: goal.endDate,
      categories: goal.categories || (goal.category ? [goal.category] : []),
    };
  } else {
    resetGoalForm();

    const hasIncomeGoal = coupleGoals.value.some(
      (item) => item.type === "INCOME",
    );
    const hasExpenseGoal = coupleGoals.value.some(
      (item) => item.type === "EXPENSE",
    );

    if (hasIncomeGoal && !hasExpenseGoal) {
      goalForm.value.type = "EXPENSE";
    }
  }

  isGoalAddPageOpen.value = false;
  isGoalModalOpen.value = true;
};

const handleGoalNavigationLeft = () => {
  if (isGoalAddPageOpen.value) {
    if (goalCards.value.length > 0) {
      isGoalAddPageOpen.value = false;
      currentGoalIndex.value = goalCards.value.length - 1;
    }
    return;
  }

  if (!goalCards.value.length) return;
  if (isFirstGoal.value) {
    isGoalAddPageOpen.value = true;
    return;
  }
  showPrevGoal();
};

const handleGoalNavigation = () => {
  if (isGoalAddPageOpen.value) {
    if (goalCards.value.length > 0) {
      isGoalAddPageOpen.value = false;
      currentGoalIndex.value = 0;
    }
    return;
  }

  if (!goalCards.value.length) return;
  if (isLastGoal.value) {
    isGoalAddPageOpen.value = true;
    return;
  }
  showNextGoal();
};

const openIncomeTransactionForActiveGoal = () => {
  if (!activeGoalCard.value || activeGoalCard.value.type !== "INCOME") return;
  selectedGoalDetailId.value = activeGoalCard.value.id;
  openGoalIncomeTransactionModal();
};

const openGoalDetailModal = (goal) => {
  selectedGoalDetailId.value = goal.id;
  isGoalDetailModalOpen.value = true;
};

const closeGoalDetailModal = () => {
  isGoalDetailModalOpen.value = false;
  selectedGoalDetailId.value = null;
};

const resetGoalIncomeForm = () => {
  editingGoalTransactionId.value = null;
  goalIncomeForm.value = {
    amount: "",
    date: createTodayDate(),
    memo: "",
  };
};

const openGoalIncomeTransactionModal = (transaction = null) => {
  if (transaction) {
    editingGoalTransactionId.value = transaction.id;
    goalIncomeForm.value = {
      amount: transaction.amount,
      date:
        transaction.date < goalIncomeDateMin.value
          ? goalIncomeDateMin.value
          : transaction.date > goalIncomeDateMax.value
            ? goalIncomeDateMax.value
            : transaction.date,
      memo: transaction.memo || "",
    };
  } else {
    resetGoalIncomeForm();
    if (selectedGoalDetail.value?.startDate) {
      goalIncomeForm.value.date = selectedGoalDetail.value.startDate;
    }
  }

  isGoalIncomeTransactionModalOpen.value = true;
};

const closeGoalIncomeTransactionModal = () => {
  isGoalIncomeTransactionModalOpen.value = false;
  resetGoalIncomeForm();
};

const toggleExpenseCategory = (category) => {
  const selected = goalForm.value.categories || [];

  if (selected.includes(category)) {
    goalForm.value.categories = selected.filter((item) => item !== category);
    return;
  }

  goalForm.value.categories = [...selected, category];
};

const closeGoalModal = () => {
  isGoalModalOpen.value = false;
  resetGoalForm();
};

const loadCoupleGoals = async () => {
  if (!myCouple.value?.id) {
    coupleGoals.value = [];
    return;
  }

  try {
    const { data } = await api.get(
      `/coupleGoals?coupleId=${myCouple.value.id}`,
    );
    coupleGoals.value = Array.isArray(data) ? data : [];
    if (!coupleGoals.value.length) {
      currentGoalIndex.value = 0;
    } else if (currentGoalIndex.value > coupleGoals.value.length - 1) {
      currentGoalIndex.value = coupleGoals.value.length - 1;
    }
    if (
      selectedGoalDetailId.value &&
      !coupleGoals.value.some(
        (item) => Number(item.id) === Number(selectedGoalDetailId.value),
      )
    ) {
      selectedGoalDetailId.value = null;
      isGoalDetailModalOpen.value = false;
    }
  } catch (error) {
    coupleGoals.value = [];
    currentGoalIndex.value = 0;
  }
};

const refreshCoupleDetailData = async () => {
  if (!userId.value || !partnerId.value) return;

  allTransactions.value = await getCoupleTransactions(
    userId.value,
    partnerId.value,
  );

  summary.value = await getCoupleMonthlySummary(
    userId.value,
    partnerId.value,
    monthKey.value,
  );
};

const submitGoal = async () => {
  if (!myCouple.value?.id) return;

  const payload = {
    coupleId: myCouple.value.id,
    type: goalForm.value.type,
    title: goalForm.value.title.trim(),
    targetAmount: Number(goalForm.value.targetAmount),
    startDate: goalForm.value.startDate || createTodayDate(),
    endDate: goalForm.value.endDate || createTodayDate(),
    categories:
      goalForm.value.type === "EXPENSE" ? goalForm.value.categories || [] : [],
    category:
      goalForm.value.type === "EXPENSE"
        ? (goalForm.value.categories || [])[0] || ""
        : "",
  };

  if (!payload.title || !payload.targetAmount) {
    window.alert("목표 이름과 금액을 입력해주세요.");
    return;
  }

  if (payload.startDate > payload.endDate) {
    window.alert("목표 종료일은 시작일보다 빠를 수 없습니다.");
    return;
  }

  try {
    if (editingGoalId.value) {
      await api.patch(`/coupleGoals/${editingGoalId.value}`, payload);
      uiStore.showToast("공동 목표를 수정했어요.");
    } else {
      await api.post("/coupleGoals", {
        ...payload,
        createdAt: new Date().toISOString(),
      });
      uiStore.showToast("공동 목표를 추가했어요.");
    }

    await loadCoupleGoals();
    closeGoalModal();
  } catch (error) {
    uiStore.showToast("공동 목표 저장에 실패했어요.", "error");
  }
};

const submitGoalIncomeTransaction = async () => {
  if (!selectedGoalDetail.value?.id || !userId.value) return;

  const payload = {
    userId: userId.value,
    type: "INCOME",
    category: "커플",
    amount: Number(goalIncomeForm.value.amount),
    date: goalIncomeForm.value.date,
    memo: goalIncomeForm.value.memo.trim() || "공동 목표 수입",
    goalId: selectedGoalDetail.value.id,
  };

  if (!payload.amount || !payload.date) {
    window.alert("금액과 날짜를 입력해주세요.");
    return;
  }

  if (
    payload.date < goalIncomeDateMin.value ||
    payload.date > goalIncomeDateMax.value
  ) {
    window.alert("수입 날짜는 목표 기간 안에서만 선택할 수 있습니다.");
    return;
  }

  try {
    if (editingGoalTransactionId.value) {
      await api.patch(
        `/transactions/${editingGoalTransactionId.value}`,
        payload,
      );
      uiStore.showToast("수입 거래를 수정했어요.");
    } else {
      await api.post("/transactions", payload);
      uiStore.showToast("수입 거래를 추가했어요.");
    }

    await refreshCoupleDetailData();
    closeGoalIncomeTransactionModal();
  } catch (error) {
    uiStore.showToast("수입 거래 저장에 실패했어요.", "error");
  }
};

const removeGoal = async (goalId) => {
  const confirmed = window.confirm("이 공동 목표를 삭제할까요?");
  if (!confirmed) return;

  try {
    await api.delete(`/coupleGoals/${goalId}`);
    await loadCoupleGoals();
    uiStore.showToast("공동 목표를 삭제했어요.");
  } catch (error) {
    uiStore.showToast("공동 목표 삭제에 실패했어요.", "error");
  }
};

const formatSignedCurrency = (value) => {
  const amount = Number(value || 0);
  if (amount < 0) {
    return `-${Math.abs(amount).toLocaleString()}원`;
  }
  return `${amount.toLocaleString()}원`;
};

const categories = computed(() => {
  const map = {};

  summary.value.transactions.forEach((item) => {
    if (item.type !== "EXPENSE") return;

    const categoryName = item.category || "기타";
    const meta = categoryMeta[categoryName] || categoryMeta.기타;

    if (!map[categoryName]) {
      map[categoryName] = {
        name: categoryName,
        icon: meta.icon,
        bgClass: meta.bgClass,
        myAmount: 0,
        partnerAmount: 0,
      };
    }

    if (Number(item.userId) === Number(userId.value)) {
      map[categoryName].myAmount += item.amount;
    } else if (Number(item.userId) === Number(partnerId.value)) {
      map[categoryName].partnerAmount += item.amount;
    }
  });

  return Object.values(map)
    .sort((a, b) => {
      const totalA = a.myAmount + a.partnerAmount;
      const totalB = b.myAmount + b.partnerAmount;
      return totalB - totalA;
    })
    .map((item) => ({
      name: item.name,
      icon: item.icon,
      bgClass: item.bgClass,
      val1: `${item.myAmount.toLocaleString()}원`,
      val2: `${item.partnerAmount.toLocaleString()}원`,
    }));
});

const showAllCategories = ref(false);

const visibleCategories = computed(() => {
  if (showAllCategories.value) {
    return categories.value;
  }

  return categories.value.slice(0, 4);
});

const hasMoreCategories = computed(() => categories.value.length > 4);

const myLatestTransaction = computed(() => {
  const myTransactions = summary.value.transactions.filter(
    (item) => Number(item.userId) === Number(userId.value),
  );
  return myTransactions.at(-1) || null;
});

const partnerLatestTransaction = computed(() => {
  if (!partnerId.value) return null;

  const partnerTransactions = summary.value.transactions.filter(
    (item) => Number(item.userId) === Number(partnerId.value),
  );
  return partnerTransactions.at(-1) || null;
});

const startEditingMessage = (target) => {
  if (target !== "user") return;

  if (editingMessage.value === "user") {
    editableMessages.value.user = statusMessages.value.user;
    editingMessage.value = null;
    return;
  }

  editableMessages.value.user = statusMessages.value.user;
  editingMessage.value = "user";
};

const persistStatusMessage = async (message) => {
  if (!myCouple.value?.id || !userStatusField.value) return;

  const updatedCouple = {
    ...myCouple.value,
    [userStatusField.value]: message,
  };

  await api.put(`/couples/${myCouple.value.id}`, updatedCouple);

  const index = couplesStore.couples.findIndex(
    (item) => item.id === myCouple.value.id,
  );
  if (index !== -1) {
    couplesStore.couples.splice(index, 1, updatedCouple);
  }
};

const saveMessage = async (target) => {
  if (target !== "user") return;

  const message = editableMessages.value.user.trim();
  if (!message) {
    editingMessage.value = null;
    return;
  }

  statusMessages.value.user = message;
  editingMessage.value = null;

  try {
    await persistStatusMessage(message);
  } catch (error) {
    window.alert("상태 메시지 저장에 실패했습니다. 다시 시도해주세요.");
  }
};

const confirmDisconnectCouple = async () => {
  if (!myCouple.value?.id) {
    window.alert("연동된 배우자 정보가 없습니다.");
    return;
  }

  const confirmed = window.confirm("배우자와의 연동을 정말 해제하시겠습니까?");
  if (!confirmed) return;

  const result = await couplesStore.removecouple(myCouple.value.id);

  if (!result?.success) {
    window.alert(result?.message || "연동 해제에 실패했습니다.");
    return;
  }

  partner.value = null;
  uiStore.showToast("배우자 연동이 해지되었습니다.");
  setTimeout(() => {
    router.push("/couples");
  }, 900);
};

onMounted(async () => {
  await couplesStore.fetchcouples(userId.value);
  loadStatusMessages();

  if (myCouple.value && partnerId.value) {
    partner.value = await getUserById(partnerId.value);
    await refreshCoupleDetailData();
    await loadCoupleGoals();
  }
});
</script>

<style scoped>
.couple-detail-page {
  min-height: 100vh;
  width: 100%;
  margin: 0;
  overflow-x: hidden;
  background: var(--page-bg);
  color: var(--text-color);
}

.couple-detail-inner {
  padding: 3.5rem 1.5rem 1.5rem;
}

.section-desc {
  color: var(--text-muted);
}

.couple-hero {
  background: linear-gradient(135deg, #ffd86b 0%, #ffbf23 100%);
  color: #2a2112;
}

:global(html.dark) .couple-hero {
  background: linear-gradient(135deg, #3a2d10 0%, #5a430c 100%);
  color: #f7e7b6;
}

.couple-edit-btn {
  background: var(--card-bg);
  color: var(--text-color);
}

.couple-edit-btn:hover {
  background: var(--sub-bg);
  color: var(--text-color);
}

.detail-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
}

.message-box {
  background: var(--card-bg);
  color: var(--text-color);
  border: 1px solid var(--border-color);
}

.profile-avatar {
  border-color: rgba(255, 255, 255, 0.75) !important;
  background: var(--sub-bg);
}

.name-pill {
  background: rgba(255, 255, 255, 0.6);
  color: #2a2112;
}

:global(html.dark) .name-pill {
  background: rgba(17, 24, 39, 0.85);
  color: var(--text-color);
}

.heart-badge {
  background: var(--card-bg);
  color: #dc3545;
}

.sync-icon {
  color: rgba(0, 0, 0, 0.45);
}

:global(html.dark) .sync-icon {
  color: rgba(255, 255, 255, 0.55);
}

.couple-summary-text {
  color: inherit;
}

.meta-pill,
.stat-pill {
  background: var(--sub-bg);
  color: var(--text-color);
}

.stat-label,
.stat-subtext,
.goal-subtext,
.category-label,
.feed-text,
.feed-time {
  color: var(--text-muted);
}

.stat-income-user {
  color: #e53935;
}

.stat-income-partner {
  color: #1e88e5;
}

.stat-expense-user {
  color: #e53935;
}

.stat-expense-partner {
  color: #1e88e5;
}

.bar-track,
.goal-progress-track {
  background: var(--sub-bg);
  border-color: var(--border-light) !important;
}

.bar-divider {
  background: var(--card-bg);
}

.bar-fill-income-user {
  background-color: #e53935;
}

.bar-fill-income-partner {
  background-color: #1e88e5;
}

.bar-fill-expense-user {
  background-color: #e53935;
}

.bar-fill-expense-partner {
  background-color: #1e88e5;
}

.goal-card {
  background: var(--sub-bg);
  border-color: var(--border-color) !important;
}

.goal-empty-card,
.goal-overview-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color) !important;
  box-shadow: var(--shadow-sm) !important;
}

.goal-empty-card .text-primary {
  color: #facc15 !important;
}

.goal-empty-button {
  width: 5.25rem;
  height: 5.25rem;
  border-radius: 1.5rem;
  background: linear-gradient(135deg, #ffd96a 0%, #ffbf23 100%);
  color: #1f2937;
}

.goal-empty-card {
  min-height: 25rem;
}

.goal-empty-content {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.goal-overview-nav {
  padding-right: 0.25rem;
}

.goal-empty-button .material-symbols-outlined {
  font-size: 2.7rem;
  font-weight: 700;
}

.goal-create-btn,
.goal-preview-btn {
  background: linear-gradient(135deg, #ffd96a 0%, #ffbf23 100%);
  border: none;
  color: #4f3e10;
  box-shadow: 0 8px 18px rgba(255, 188, 0, 0.16);
}

.goal-reset-btn,
.goal-action-btn,
.goal-modal-close {
  background: var(--card-bg);
  color: var(--text-color);
  border: 1px solid var(--border-color);
}

.goal-create-btn,
.goal-preview-btn,
.goal-reset-btn,
.goal-action-btn {
  font-size: 0.92rem;
  padding-inline: 0.95rem;
  padding-block: 0.5rem;
}

.goal-title-display {
  font-size: clamp(1.05rem, 2vw, 1.45rem);
  line-height: 1.3;
  color: var(--text-color);
}

.goal-period-text {
  color: var(--text-muted);
  font-size: 0.88rem;
}

.goal-progress-track {
  height: 0.875rem;
  background: var(--sub-bg);
  border: 0;
}

.goal-progress-fill.is-income {
  background: linear-gradient(90deg, #ffd96a 0%, #ffbf23 100%);
}

.goal-progress-fill.is-expense {
  background: #8f96a3;
}

.goal-type-badge {
  display: inline-flex;
  padding: 0.38rem 0.8rem !important;
  background: #fff0b8;
  color: #735700;
  font-size: 0.72rem;
  font-weight: 800 !important;
}

.goal-overview-card.is-expense .goal-type-badge {
  background: #ececef;
  color: #5d6573;
}

:global(html.dark) .goal-overview-card.is-expense .goal-type-badge {
  background: #374151;
  color: #d1d5db;
}

.goal-stat-box,
.goal-linked-box,
.goal-income-fixed {
  background: var(--sub-bg);
  border: 1px solid var(--border-color);
}

.goal-linked-item {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
}

.goal-linked-scroll {
  max-height: 15.5rem;
  overflow-y: auto;
}

.goal-linked-scroll::-webkit-scrollbar {
  width: 8px;
}

.goal-linked-scroll::-webkit-scrollbar-thumb {
  background: rgba(143, 152, 163, 0.45);
  border-radius: 999px;
}

.goal-linked-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.goal-stat-box .goal-subtext,
.goal-linked-item .goal-subtext,
.goal-linked-box .goal-subtext,
.goal-modal-subtext,
.goal-empty-card .goal-subtext {
  color: var(--text-muted);
  font-size: 0.82rem;
}

.goal-stat-box .fs-4,
.goal-linked-item .fs-5,
.goal-progress-track + .row .fs-4 {
  font-size: 1.1rem !important;
  color: var(--text-color);
}

.goal-linked-box h5 {
  font-size: 1rem;
  color: var(--text-color);
}

.goal-detail-open-btn {
  background: var(--card-bg);
  color: var(--text-color);
  border: 1px solid var(--border-color);
}

.goal-nav-btn {
  width: 2.65rem;
  height: 2.65rem;
  border-radius: 999px;
  background: #ffffff;
  color: #1f2937;
  box-shadow: 0 10px 22px rgba(15, 23, 42, 0.08);
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    background-color 0.18s ease;
}

.goal-nav-btn .material-symbols-outlined {
  font-size: 1.45rem;
  font-weight: 500;
}

.goal-nav-btn:hover,
.goal-nav-btn:focus-visible {
  background: #fffdf7;
  box-shadow: 0 12px 26px rgba(15, 23, 42, 0.12);
  transform: translateY(-1px);
}

:global(html.dark) .goal-nav-btn {
  background: #f9fafb;
  color: #111827;
}

.goal-linked-item .fw-bold.mb-1 {
  font-size: 0.95rem;
  color: var(--text-color);
}

.goal-row-edit-btn {
  width: 2rem;
  height: 2rem;
  border-radius: 999px;
  background: #fff7df;
  color: #8a6a12;
  opacity: 0;
  transform: translateY(2px);
  transition:
    opacity 0.18s ease,
    transform 0.18s ease,
    background 0.18s ease;
}

.goal-linked-item:hover .goal-row-edit-btn,
.goal-row-edit-btn:focus-visible {
  opacity: 1;
  transform: translateY(0);
}

.goal-row-edit-btn:hover {
  background: #ffe9a6;
}

.goal-modal-title {
  font-size: 1.7rem;
  font-weight: 800 !important;
  color: var(--text-color);
}

.goal-modal-subtext {
  color: var(--text-muted);
  font-size: 0.95rem;
}

.goal-modal-backdrop {
  background: rgba(15, 23, 42, 0.52);
  z-index: 1100;
}

.goal-modal-card,
.goal-detail-modal-card,
.goal-income-transaction-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
  margin-inline: auto;
}

.goal-modal-card {
  width: min(100%, 44rem) !important;
  max-width: 44rem !important;
  max-height: 90vh;
  overflow-y: auto;
  overflow-x: hidden;
}

.goal-detail-modal-card {
  width: min(100%, 34rem);
  max-width: 34rem;
  max-height: 90vh;
  overflow-y: auto;
}

.goal-income-transaction-card {
  width: min(100%, 30rem);
  max-width: 30rem;
  max-height: 90vh;
  overflow-y: auto;
}

.goal-modal-card.is-create-mode {
  width: min(100%, 44rem) !important;
  max-width: 44rem !important;
}

.goal-modal-close {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.85rem;
}

.goal-type-toggle {
  background: transparent;
}

.goal-type-option {
  color: var(--text-muted);
  background: var(--card-bg);
  font-size: 0.95rem;
  border: 1px solid var(--border-color) !important;
}

.goal-type-option.active {
  background: #ffcc50;
  color: #4f3e10;
  border-color: #ffcc50 !important;
  box-shadow: 0 8px 18px rgba(255, 188, 0, 0.22);
}

.goal-form-control {
  min-height: 3.35rem;
  border-radius: 1.1rem;
  font-size: 0.95rem;
  border: 1px solid var(--border-light);
  padding-inline: 1rem;
  background-color: var(--sub-bg);
  color: var(--text-color);
}

.goal-form-control::placeholder {
  color: var(--text-muted);
}

.goal-form-control:focus {
  background-color: var(--sub-bg);
  color: var(--text-color);
  border-color: var(--kb-yellow);
  box-shadow: 0 0 0 0.2rem rgba(255, 188, 0, 0.18);
}

.goal-date-picker-modal {
  z-index: 20;
  width: min(44rem, calc(100vw - 2rem));
  max-width: 42rem;
  background: var(--card-bg);
  border-color: var(--border-color) !important;
  color: var(--text-color);
}

.goal-date-picker-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.goal-date-calendar {
  background: var(--sub-bg);
  border-color: var(--border-color) !important;
}

.goal-date-picker-day {
  min-height: 2.5rem;
  padding: 0.4rem;
  color: var(--text-color);
  background: transparent;
}

.goal-date-picker-day:hover {
  background: rgba(59, 130, 246, 0.12);
}

.selected-day {
  background: #2563eb;
  color: #fff;
}

.in-range-day {
  background: rgba(59, 130, 246, 0.16);
}

.goal-date-range-picker {
  position: relative;
  background: var(--card-bg);
  border-color: var(--border-color) !important;
}

.goal-date-range-picker .goal-date-field {
  width: 100%;
}

.goal-date-caption {
  font-size: 0.95rem;
  color: var(--text-muted);
}

.date-range-separator {
  width: 100%;
  text-align: center;
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text-muted);
}

.goal-date-range-picker .goal-date-field .material-symbols-outlined {
  font-size: 1.1rem;
}

.goal-category-chips {
  min-height: 2.75rem;
}

.goal-category-chip {
  background: var(--card-bg);
  border-color: var(--border-color) !important;
  color: var(--text-color);
  transition: all 0.18s ease;
  font-size: 0.9rem;
}

.goal-category-chip.active {
  background: #fff3cc;
  border-color: #ffcc50 !important;
  color: #6f5700;
  box-shadow: 0 8px 16px rgba(255, 204, 80, 0.18);
}

:global(html.dark) .goal-category-chip.active {
  background: rgba(255, 204, 80, 0.18);
  color: #ffd86b;
}

.goal-detail-btn {
  background: var(--card-bg);
  color: var(--text-color);
  border-color: var(--border-color);
}

.goal-detail-btn:hover {
  background: var(--sub-bg);
  color: var(--text-color);
}

.feed-item {
  background: var(--sub-bg);
  border-color: var(--border-color) !important;
}

.feed-avatar {
  background: rgba(107, 114, 128, 0.15);
  color: var(--text-color);
  overflow: hidden;
}

.feed-avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.form-control {
  background-color: var(--sub-bg);
  border: 1px solid var(--border-light);
  color: var(--text-color);
}

.form-control::placeholder {
  color: var(--text-muted);
}

.form-control:focus {
  background-color: var(--sub-bg);
  color: var(--text-color);
  border-color: var(--kb-yellow);
  box-shadow: 0 0 0 0.2rem rgba(255, 188, 0, 0.16);
}

.flex-1 {
  flex: 1;
}

.culture-badge {
  background-color: rgba(155, 81, 224, 0.14);
  color: #9b51e0;
}

:global(html.dark) .goal-row-edit-btn {
  background: rgba(255, 204, 80, 0.14);
  color: #facc15;
}

:global(html.dark) .goal-row-edit-btn:hover {
  background: rgba(255, 204, 80, 0.24);
}

:global(html.dark) .goal-empty-button {
  color: #111827;
}

@media (min-width: 768px) {
  .couple-detail-page {
    width: calc(100% + 6rem);
    margin: -3rem;
  }

  .couple-detail-inner {
    padding: 3.5rem 1.5rem 1.5rem;
  }
}

@media (max-width: 991.98px) {
  .goal-empty-button {
    width: 4.5rem;
    height: 4.5rem;
  }

  .goal-empty-button .material-symbols-outlined {
    font-size: 2.2rem;
  }

  .goal-modal-card {
    width: min(100%, 100%);
    max-width: 100% !important;
    max-height: 94vh;
  }

  .goal-detail-modal-card {
    width: min(100%, 100%);
    max-width: 100%;
    max-height: 94vh;
  }

  .goal-income-transaction-card {
    width: min(100%, 100%);
    max-width: 100%;
    max-height: 94vh;
  }

  .goal-modal-card.is-create-mode {
    width: min(100%, 100%) !important;
    max-width: 100% !important;
  }

  .goal-date-picker-grid {
    grid-template-columns: 1fr;
  }
}

.filled-icon {
  font-variation-settings: "FILL" 1;
}
</style>
