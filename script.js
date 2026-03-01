const countdownForm = document.getElementById("countdownForm");
const inputContainer = document.getElementById("input-container");
const countdownEl = document.getElementById("countdown");
const completeEl = document.getElementById("complete");

const timeElements = {
  days: document.getElementById("days"),
  hours: document.getElementById("hours"),
  mins: document.getElementById("minutes"),
  secs: document.getElementById("seconds"),
};

let countdownActive;
let savedCountdown;

const fp = flatpickr("#date-picker", {
  enableTime: true,
  dateFormat: "Y-m-d H:i",
  minDate: "today",
  theme: "material_blue",
});

function updateDOM() {
  countdownActive = setInterval(() => {
    const now = new Date().getTime();
    const distance = savedCountdown.value - now;

    if (distance < 0) {
      clearInterval(countdownActive);
      countdownEl.hidden = true;
      completeEl.hidden = false;
      // فیچر: لرزش صفحه هنگام اتمام
      document.body.style.animation = "shake 0.5s";
    } else {
      inputContainer.hidden = true;
      countdownEl.hidden = false;

      document.getElementById("countdown-title").textContent =
        savedCountdown.title;
      timeElements.days.textContent = Math.floor(
        distance / (1000 * 60 * 60 * 24),
      );
      timeElements.hours.textContent = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      timeElements.mins.textContent = Math.floor(
        (distance % (1000 * 60 * 60)) / (1000 * 60),
      );
      timeElements.secs.textContent = Math.floor(
        (distance % (1000 * 60)) / 1000,
      );
    }
  }, 1000);
}

function startCountdown(e) {
  e.preventDefault();
  const title = e.target[0].value;
  const dateValue = e.target[1].value;

  if (!dateValue) return;

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
  location.reload();
}

countdownForm.addEventListener("submit", startCountdown);
document.getElementById("countdown-button").addEventListener("click", reset);
document.getElementById("complete-button").addEventListener("click", reset);

const saved = localStorage.getItem("glass_countdown");
if (saved) {
  savedCountdown = JSON.parse(saved);
  updateDOM();
}
