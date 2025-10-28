const PR_COUNT = 214;

const NUM_REELS = 3;
const ITEM_HEIGHT = 100;
const SYMBOLS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const SYMBOL_COUNT = SYMBOLS.length;
const DURATION_S = 3;

const slotMachineContainer = document.getElementById("slot-machine");
const spinButton = document.getElementById("spinButton");
const resultDisplay = document.getElementById("resultDisplay");

// 💡 버튼 흔들림 애니메이션 클래스 제거 및 결과창 초기화
function spin() {
  spinButton.textContent = `SPIN! (총 ${PR_COUNT}개)`;

  spinButton.disabled = true;
  spinButton.textContent = "ROLLING...";
  spinButton.classList.remove("ready-to-spin");

  resultDisplay.textContent = "⏳ 회전 중...";
  // 초기화: 모양/색상/애니메이션 관련 클래스 모두 제거
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
  resultDisplay.classList.add("text-white");
  resultDisplay.onclick = null;
  resultDisplay.classList.remove("cursor-pointer");
  // 000~999 난수 생성 유지
  const finalNumber = Math.floor(Math.random() * PR_COUNT);
  const finalDigits = String(finalNumber)
    .padStart(3, "0")
    .split("")
    .map(Number);

  let allReels = [];

  // 각 릴에 대해 애니메이션 적용 (기존 로직 유지)
  for (let i = 0; i < NUM_REELS; i++) {
    const reel = document.getElementById(`reel${i}`);
    const finalValue = finalDigits[i];

    // 느려짐 방지 초기화
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

  const totalDuration = DURATION_S * 1000 + allReels[NUM_REELS - 1].delayMs;

  setTimeout(() => {
    let winTextColorClass = "text-yellow-300";
    let winBgColorClass = "bg-yellow-700";

    const prNumber = finalNumber;
    const prUrl = `https://github.com/woowacourse-precourse/javascript-racingcar-8/pull/${prNumber}`;

    const prLink = document.createElement("a");
    prLink.href = prUrl;
    prLink.target = "_blank";
    prLink.className = `
        text-2xl font-bold 
        text-blue-300 hover:text-blue-200 underline transition duration-150
    `;
    const resultContent = document.createElement("div");
    resultContent.className = "w-full flex justify-center";
    resultDisplay.textContent = `😎바로리뷰하기#${finalNumber}`;
    resultDisplay.classList.add(
      // Flexbox는 제거하고, 텍스트 정렬만 유지하여 링크가 가운데 오도록 합니다.
      "text-center", // 텍스트 중앙 정렬
      "px-6",
      "py-3",
      "rounded-lg",
      "shadow-xl",
      "result-message-animated",
      winTextColorClass,
      winBgColorClass,
      "cursor-pointer"
    );
    // 💡 5. 결과창에 클릭 이벤트 리스너 추가 (링크 부여)
    resultDisplay.onclick = () => {
      window.open(prUrl, "_blank");
    };

    // 6. 버튼 활성화
    spinButton.disabled = false;
    spinButton.textContent = `SPIN! (총 ${PR_COUNT}개)`;

    spinButton.classList.add("ready-to-spin");
  }, totalDuration + 200);
}

window.onload = initializeSlots;

// (initializeSlots 함수는 변경 없음)
function initializeSlots() {
  for (let i = 0; i < NUM_REELS; i++) {
    const container = document.createElement("div");
    container.classList.add("slot-container");

    spinButton.textContent = `SPIN! (총 ${PR_COUNT}개)`;

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
