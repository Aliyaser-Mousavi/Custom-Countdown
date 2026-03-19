/**
 * Pro Glass Countdown - Logic
 */

const countdownForm = document.getElementById("countdownForm");
const inputContainer = document.getElementById("input-container");
const countdownEl = document.getElementById("countdown");
const countdownTitleEl = document.getElementById("countdown-title");
const completeEl = document.getElementById("complete");

const timeElements = {
  days: document.getElementById("days"),
  hours: document.getElementById("hours"),
  mins: document.getElementById("minutes"),
  secs: document.getElementById("seconds"),
};

let countdownActive;
let savedCountdown;

// Initialize Flatpickr
const fp = flatpickr("#date-picker", {
  enableTime: true,
  dateFormat: "Y-m-d H:i",
  minDate: "today",
});

// Helper: Add leading zero to numbers < 10
const formatTime = (time) => (time < 10 ? `0${time}` : time);

function updateDOM() {
  countdownActive = setInterval(() => {
    const now = new Date().getTime();
    const distance = savedCountdown.value - now;

    if (distance < 0) {
      // Countdown Finished
      clearInterval(countdownActive);
      countdownEl.hidden = true;
      inputContainer.hidden = true;
      completeEl.hidden = false;
    } else {
      // Show Countdown
      inputContainer.hidden = true;
      completeEl.hidden = true;
      countdownEl.hidden = false;

      countdownTitleEl.textContent = savedCountdown.title;

      const d = Math.floor(distance / (1000 * 60 * 60 * 24));
      const h = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((distance % (1000 * 60)) / 1000);

      timeElements.days.textContent = formatTime(d);
      timeElements.hours.textContent = formatTime(h);
      timeElements.mins.textContent = formatTime(m);
      timeElements.secs.textContent = formatTime(s);
    }
  }, 1000);
}

function startCountdown(e) {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const dateValue = document.getElementById("date-picker").value;

  if (!dateValue || !title) {
    alert("Please enter a title and select a valid date.");
    return;
  }

  savedCountdown = {
    title: title,
    value: new Date(dateValue).getTime(),
  };

  localStorage.setItem("glass_countdown", JSON.stringify(savedCountdown));
  updateDOM();
}

function reset() {
  clearInterval(countdownActive);
  localStorage.removeItem("glass_countdown");

  // Reset UI visibility
  countdownEl.hidden = true;
  completeEl.hidden = true;
  inputContainer.hidden = false;

  // Clear inputs
  countdownForm.reset();
}

// Event Listeners
countdownForm.addEventListener("submit", startCountdown);
document.getElementById("countdown-button").addEventListener("click", reset);
document.getElementById("complete-button").addEventListener("click", reset);

// Check Local Storage on Load
function restorePreviousCountdown() {
  const saved = localStorage.getItem("glass_countdown");
  if (saved) {
    savedCountdown = JSON.parse(saved);
    updateDOM();
  }
}

restorePreviousCountdown();
