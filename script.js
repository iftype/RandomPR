// =======================================================
// 1. 전역 상수 및 상태
// =======================================================

const NUM_REELS = 3;
const ITEM_HEIGHT = 100;
const SYMBOLS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const SYMBOL_COUNT = SYMBOLS.length;

// ⭐ 카테고리별 데이터 (PR 범위 및 스핀 속도)
let currentCategory = "fe";
const CATEGORY_DATA = {
  fe: {
    name: "FE",
    prCount: 214,
    duration: 3.0,
    path: "javascript-racingcar-8",
    bgClass: "bg-red-600",
    textClass: "text-red-400",
    hoverClass: "hover:bg-red-700",
  },
  be: {
    name: "BE",
    prCount: 915,
    duration: 4.0,
    path: "java-racingcar-8",
    bgClass: "bg-blue-600",
    textClass: "text-blue-400",
    hoverClass: "hover:bg-blue-700",
  },
  an: {
    name: "AN",
    prCount: 56,
    duration: 2.0,
    path: "kotlin-racingcar-8",
    bgClass: "bg-green-600",
    textClass: "text-green-400",
    hoverClass: "hover:bg-green-700",
  },
};

// ⭐ DOM 요소 참조
const slotMachineContainer = document.getElementById("slot-machine");
const spinButton = document.getElementById("spinButton");
const resultDisplay = document.getElementById("resultDisplay");
const currentCategorySpan = document.getElementById("current-category");
const tabSlider = document.getElementById("tab-slider");
const tabButtons = document.querySelectorAll(".tab-button");
const categoryTabsContainer = document.getElementById("category-tabs");
// =======================================================
// 2. 슬라이더/탭 기능
// =======================================================
const ALL_HOVER_CLASSES = [
  "hover:bg-red-700",
  "hover:bg-blue-700",
  "hover:bg-green-700",
];
const ALL_TEXT_CLASSES = ["text-red-400", "text-blue-400", "text-green-400"];
const ALL_BG_CLASSES = ["bg-red-600", "bg-blue-600", "bg-green-600"];

function selectCategory(category) {
  if (currentCategory === category) {
    const data = CATEGORY_DATA[category];
    spinButton.textContent = `SPIN! (총 ${data.prCount}개)`;
    // ⭐ 현재 카테고리여도 버튼 색상/hover를 재확인
    spinButton.classList.remove(...ALL_BG_CLASSES);
    spinButton.classList.remove(...ALL_HOVER_CLASSES);
    spinButton.classList.add(data.bgClass);
    spinButton.classList.add(data.hoverClass);
    return;
  }
  currentCategory = category;
  const data = CATEGORY_DATA[category];
  // 1. 슬라이더 배경색 변경
  tabSlider.classList.remove(...ALL_BG_CLASSES);
  tabSlider.classList.add(data.bgClass); // 2. 슬라이더 위치 및 크기 계산

  const selectedButton = document.querySelector(
    `[data-category="${category}"]`
  );
  if (selectedButton) {
    tabSlider.style.width = `${selectedButton.offsetWidth}px`;
    tabSlider.style.height = `${selectedButton.offsetHeight}px`;
    tabSlider.style.transform = `translateX(${selectedButton.offsetLeft}px)`;
  } // 3. 버튼 텍스트 색상 및 상태 업데이트 (탭)
  tabButtons.forEach((button) => {
    if (button.dataset.category === category) {
      button.classList.add("text-white");
      button.classList.remove("text-gray-300", "hover:text-white");
    } else {
      button.classList.add("text-gray-300", "hover:text-white");
      button.classList.remove("text-white");
    }
  }); // 4. 제목 및 SPIN 버튼 텍스트 업데이트

  currentCategorySpan.textContent = data.name;
  currentCategorySpan.classList.remove(...ALL_TEXT_CLASSES);
  currentCategorySpan.classList.add(data.textClass);

  spinButton.textContent = `SPIN! (총 ${data.prCount}개)`;

  // ⭐ 5. SPIN 버튼 배경색 및 Hover 색상 변경
  spinButton.classList.remove(...ALL_BG_CLASSES);
  spinButton.classList.remove(...ALL_HOVER_CLASSES);
  spinButton.classList.add(data.bgClass);
  spinButton.classList.add(data.hoverClass);
}

// =======================================================
// 3. 슬롯머신 스핀 기능 (수정됨)
// =======================================================

function spin() {
  const categoryData = CATEGORY_DATA[currentCategory];
  const maxPrCount = categoryData.prCount;
  const DURATION_S = categoryData.duration; // 1. 버튼 상태 변경
  tabButtons.forEach((btn) => (btn.disabled = true));
  spinButton.disabled = true;
  spinButton.textContent = "ROLLING...";
  spinButton.classList.remove("ready-to-spin");
  categoryTabsContainer.classList.add("cursor-not-allowed");

  resultDisplay.textContent = "⏳ 회전 중..."; // 초기화: 모양/색상/애니메이션 관련 클래스 모두 제거 (생략)
  resultDisplay.classList.remove(
    "result-message-animated",
    "px-6",
    "py-3",
    "rounded-lg",
    "shadow-xl",
    "bg-gray-800",
    "bg-green-700",
    "bg-yellow-700",
    "text-green-300",
    "text-yellow-300"
  );

  // 💡 롤링 중에는 hover 효과만 제거하고 기본 배경색은 유지
  spinButton.classList.remove(...ALL_HOVER_CLASSES);

  resultDisplay.classList.add("text-white");
  resultDisplay.onclick = null;
  resultDisplay.classList.remove("cursor-pointer"); // 2. 난수 생성 (1부터 maxPrCount까지)

  const finalNumber = Math.floor(Math.random() * maxPrCount) + 1;
  const finalDigits = String(finalNumber)
    .padStart(3, "0")
    .split("")
    .map(Number);

  let allReels = []; // 3. 릴 애니메이션 적용

  for (let i = 0; i < NUM_REELS; i++) {
    const reel = document.getElementById(`reel${i}`);
    const finalValue = finalDigits[i];

    reel.style.transition = "none";
    reel.style.transform = "translateY(0px)";
    reel.offsetHeight;

    const targetSet = 2;
    const targetIndexInReel = targetSet * SYMBOL_COUNT + finalValue;
    const targetPosition = targetIndexInReel * -ITEM_HEIGHT;

    const delayMs = i * 100;

    reel.style.transition = `transform ${DURATION_S}s cubic-bezier(0.25, 0.8, 0.5, 1) ${
      delayMs / 1000
    }s`;

    reel.style.transform = `translateY(${targetPosition}px)`;
    allReels.push({ finalValue, delayMs });
  }

  const totalDuration = DURATION_S * 1000 + allReels[NUM_REELS - 1].delayMs; // 4. 결과 표시

  setTimeout(() => {
    let winTextColorClass = "text-yellow-300";
    let winBgColorClass = "bg-yellow-700";

    const path = CATEGORY_DATA[currentCategory].path;
    const prNumber = finalNumber;
    const prUrl = `https://github.com/woowacourse-precourse/${path}/pull/${prNumber}`;

    resultDisplay.textContent = `😎바로리뷰하기#${finalNumber}`;
    resultDisplay.classList.add(
      "text-center",
      "px-6",
      "py-3",
      "rounded-lg",
      "shadow-xl",
      "result-message-animated",
      winTextColorClass,
      winBgColorClass,
      "cursor-pointer"
    );

    resultDisplay.onclick = () => {
      window.open(prUrl, "_blank");
    }; // 6. 버튼 활성화 및 텍스트 복원

    spinButton.disabled = false;
    spinButton.textContent = `SPIN! (총 ${maxPrCount}개)`;
    spinButton.classList.add("ready-to-spin");
    // ⭐ 버튼 활성화 시 hover 효과 복구
    tabButtons.forEach((btn) => (btn.disabled = false));
    spinButton.classList.add(categoryData.hoverClass);
    categoryTabsContainer.classList.remove("cursor-not-allowed");
  }, totalDuration + 200);
}

// =======================================================
// 4. 초기화 기능 (유지)
// =======================================================

function initializeSlots() {
  for (let i = 0; i < NUM_REELS; i++) {
    const container = document.createElement("div");
    container.classList.add("slot-container");
    container.classList.add("flex-1");

    const reel = document.createElement("div");
    reel.classList.add("slot-reel");
    reel.id = `reel${i}`;

    const repeat = 3;
    for (let r = 0; r < repeat; r++) {
      SYMBOLS.forEach((symbol) => {
        const item = document.createElement("div");
        item.classList.add("slot-item");
        item.textContent = symbol;
        reel.appendChild(item);
      });
    }

    container.appendChild(reel);
    slotMachineContainer.appendChild(container);
  }
}

// =======================================================
// 5. 페이지 로드 및 초기화 (DOMContentLoaded 사용)
// =======================================================

document.addEventListener("DOMContentLoaded", function () {
  // 1. 슬롯 릴 요소 생성
  initializeSlots(); // 2. 초기 카테고리 설정 (FE) - 즉시 실행

  selectCategory("fe"); // 3. 윈도우 크기 변경 시 슬라이더 위치 재설정

  let resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      selectCategory(currentCategory);
    }, 10);
  });
});
