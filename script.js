let isStarted = false;
let currentIndex = 0;

// 키보드 이벤트 리스너 등록
document.addEventListener("keydown", handleKeyDown);

function handleKeyDown(event) {
  // 숫자 키패드 입력 확인
  if (event.code.includes("Numpad") && !event.shiftKey) {
    const number = parseInt(event.code.replace("Numpad", ""));
    if (number >= 1 && number <= 9) {
      simulateButtonClick(number);
    }
  }

  // 엔터 키 처리
  if (event.code === "Enter" || event.code === "NumpadEnter") {
    document.getElementById("startButton").click();
  }

  // 백스페이스 키 처리
  if (event.code === "Backspace" && !isStarted) {
    deleteLastDigit();
  }

  // ESC 키 처리
  if (event.code === "Escape" && !isStarted) {
    clearResult();
  }
}

function simulateButtonClick(number) {
  if (isStarted) {
    // 스타트 모드에서는 우측 키패드의 버튼 클릭 시뮬레이션
    document.getElementById(`right${number}`).click();
  } else {
    // 입력 모드에서는 좌측 키패드의 버튼 클릭 시뮬레이션
    document.getElementById(`left${number}`).click();
  }
}

function appendNumber(number) {
  if (isStarted) return; // 스타트 상태일 때 좌측 버튼 비활성화
  const resultElement = document.getElementById("result");
  resultElement.textContent += number;
}

function clearResult() {
  const resultElement = document.getElementById("result");
  resultElement.textContent = "";
  resetHighlights();
  currentIndex = 0;
}

function deleteLastDigit() {
  const resultElement = document.getElementById("result");
  resultElement.textContent = resultElement.textContent.slice(0, -1);
  if (isStarted) {
    resetHighlights();
    highlightCurrentNumber();
  }
}

function toggleStart() {
  const resultElement = document.getElementById("result");

  // 입력값이 없으면 스타트 버튼이 작동하지 않음
  if (resultElement.textContent === "" && !isStarted) {
    return;
  }

  isStarted = !isStarted;
  const startButton = document.getElementById("startButton");
  const leftKeypad = document.getElementById("leftKeypad").children;

  if (isStarted) {
    startButton.textContent = "일시정지";
    startButton.className = "pause-button";

    // 좌측 버튼 비활성화
    for (let i = 0; i < leftKeypad.length; i++) {
      leftKeypad[i].classList.add("disabled");
    }

    // 현재 강조할 번호 하이라이트
    highlightCurrentNumber();
  } else {
    startButton.textContent = "스타트";
    startButton.className = "start-button";

    // 좌측 버튼 활성화
    for (let i = 0; i < leftKeypad.length; i++) {
      leftKeypad[i].classList.remove("disabled");
    }

    // 하이라이트 초기화
    resetHighlights();
    currentIndex = 0;
  }
}

function resetHighlights() {
  const rightButtons = document.getElementById("rightKeypad").children;
  for (let i = 0; i < rightButtons.length; i++) {
    rightButtons[i].classList.remove("highlight");
  }
}

function highlightCurrentNumber() {
  if (!isStarted) return;

  const resultElement = document.getElementById("result");
  const resultText = resultElement.textContent;

  if (resultText.length === 0) {
    // 입력값이 모두 지워졌으면 자동으로 일시정지 모드 해제
    toggleStart();
    return;
  }

  if (currentIndex >= resultText.length) {
    // 모든 숫자를 처리했으면 다시 처음부터
    currentIndex = 0;
  }

  // 현재 숫자 가져오기
  const currentNumber = parseInt(resultText[currentIndex]);

  // 해당하는 숫자 버튼 하이라이트
  resetHighlights();
  const rightButtonId = `right${currentNumber}`;
  const rightButton = document.getElementById(rightButtonId);
  if (rightButton) {
    rightButton.classList.add("highlight");
  }
}

function removeHighlightedNumber(number) {
  if (!isStarted) return;

  const resultElement = document.getElementById("result");
  const resultText = resultElement.textContent;

  if (currentIndex < resultText.length) {
    const currentNumber = parseInt(resultText[currentIndex]);

    if (currentNumber === number) {
      // 현재 하이라이트된 숫자와 클릭한 숫자가 일치하면 삭제
      const newResult =
        resultText.substring(0, currentIndex) +
        resultText.substring(currentIndex + 1);
      resultElement.textContent = newResult;

      if (newResult.length === 0) {
        // 입력값이 모두 지워졌으면 자동으로 일시정지 모드 해제
        toggleStart();
        return;
      }

      // 다음 숫자로 이동
      if (currentIndex >= newResult.length) {
        // 마지막 숫자였다면 첫 번째로 돌아감
        currentIndex = 0;
      }

      // 다음 숫자 하이라이트
      highlightCurrentNumber();
    }
  }
}
