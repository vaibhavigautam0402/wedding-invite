// =========================
// WEDDING DATE
// =========================

const weddingDate = new Date(
  "November 05, 2026 10:00:00"
).getTime();

const nextDate = new Date(
  "November 06, 2026 00:00:00"
).getTime();


// =========================
// COUNTDOWN
// =========================

function updateCountdown() {

  const now = new Date().getTime();

  const distance = weddingDate - now;

  const weddingOver = nextDate - now

  if (weddingOver <= 0) {
    document.getElementById("countdown").innerHTML =
      "<span><strong><p>We are officially happily ever after! ❤️</p></strong></span>";

    return;
  }

  if (distance <= 0) {
    document.getElementById("countdown").innerHTML =
      "<span><strong><p>Today is the day! ❤️</p></strong></span>";

    return;
  }

  const days = Math.floor(
    distance / (1000 * 60 * 60 * 24)
  );

  const hours = Math.floor(
    (distance / (1000 * 60 * 60)) % 24
  );

  const minutes = Math.floor(
    (distance / (1000 * 60)) % 60
  );

  const seconds = Math.floor(
    (distance / 1000) % 60
  );


  document.getElementById("days").textContent =
    String(days).padStart(2, "0");

  document.getElementById("hours").textContent =
    String(hours).padStart(2, "0");

  document.getElementById("minutes").textContent =
    String(minutes).padStart(2, "0");

  document.getElementById("seconds").textContent =
    String(seconds).padStart(2, "0");
}


updateCountdown();

setInterval(updateCountdown, 1000);
