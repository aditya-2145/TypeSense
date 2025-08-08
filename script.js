const text = `with great power comes great responsibility and who dare to face it will rise above all and save the humanity`;

const textDisplay = document.getElementById("textDisplay");
const caret = document.getElementById("caret");
const timerDisplay = document.getElementById("timer");
const wpmDisplay = document.getElementById("wpmCount");
const accuracyDisplay = document.getElementById("accuracyCount");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const autoStartCheckbox = document.getElementById("autoStartToggle");
const progressBar = document.getElementById("progressBar");

let currentIndex = 0;
let timeLeft = 20;
let isRunning = false;
let timer = null;

// Render the text into spans
textDisplay.innerHTML = text
  .split("")
  .map((char) => `<span class="default">${char}</span>`)
  .join("");
const spans = textDisplay.querySelectorAll("span");

function updateCaret() {
  const span = spans[currentIndex];
  if (!span) return;
  caret.style.left = `${span.offsetLeft}px`;
  caret.style.top = `${span.offsetTop}px`;
}

function updateProgressBar(value) {
  progressBar.value = value;
}

function startTest() {
  currentIndex = 0;
  timeLeft = 20;
  isRunning = true;
  startBtn.textContent = "Restart";

  wpmDisplay.textContent = "WPM: --";
  accuracyDisplay.textContent = "Accuracy: --";
  timerDisplay.textContent = `${timeLeft}s`;

  // Reset spans
  spans.forEach((span) => {
    span.classList.remove("correct", "incorrect");
    span.classList.add("default");
  });

  // Reset progress bar
  progressBar.max = 20;
  progressBar.value = 20;

  updateCaret();

  clearInterval(timer);
  timer = setInterval(() => {
    timeLeft--;
    updateProgressBar(timeLeft);
    timerDisplay.textContent = `${timeLeft}s`;

    if (timeLeft === 0) {
      clearInterval(timer);
      isRunning = false;
      showResults();
      stopBtn.disabled = true;
    }
  }, 1000);

  stopBtn.disabled = false;
}

function stopTest() {
  clearInterval(timer);
  isRunning = false;
  startBtn.textContent = "Start";
  stopBtn.disabled = true;
  currentIndex = 0;

  spans.forEach((span) => {
    span.classList.remove("correct", "incorrect");
    span.classList.add("default");
  });

  updateCaret();
  wpmDisplay.textContent = "WPM: --";
  accuracyDisplay.textContent = "Accuracy: --";
  timerDisplay.textContent = "20s";
  progressBar.value = 20;
}

function showResults() {
  const typedChars = currentIndex;
  const correctChars = [...spans].filter((s) =>
    s.classList.contains("correct")
  ).length;

  const accuracy =
    typedChars === 0 ? 100 : Math.round((correctChars / typedChars) * 100);

  const typedText = text.slice(0, currentIndex).trim();
  const wordsTyped = typedText.length === 0 ? 0 : typedText.split(/\s+/).length;
  const wpm = wordsTyped === 0 ? 0 : wordsTyped * 3;

  accuracyDisplay.textContent = `Accuracy: ${accuracy}%`;
  wpmDisplay.textContent = `WPM: ${wpm}`;
  stopBtn.disabled = true;
}

// Typing logic + auto-start
document.addEventListener("keydown", (e) => {
  if (!isRunning && e.key.length === 1 && autoStartCheckbox.checked) {
    startTest();
  }

  if (!isRunning) return;

  if (e.key.length === 1 && currentIndex < spans.length) {
    const expected = spans[currentIndex].textContent;
    spans[currentIndex].classList.remove("default");

    if (e.key === expected) {
      spans[currentIndex].classList.add("correct");
      spans[currentIndex].classList.remove("incorrect");
    } else {
      spans[currentIndex].classList.add("incorrect");
      spans[currentIndex].classList.remove("correct");
    }

    currentIndex++;
    updateCaret();
  } else if (e.key === "Backspace" && currentIndex > 0) {
    currentIndex--;
    spans[currentIndex].classList.remove("correct", "incorrect");
    spans[currentIndex].classList.add("default");
    updateCaret();
  }
});

// Button handlers
startBtn.addEventListener("click", () => {
  startBtn.blur();
  startTest();
});

stopBtn.addEventListener("click", stopTest);

updateCaret(); // Position caret initially
stopBtn.disabled = true; // Disable stop button at load
