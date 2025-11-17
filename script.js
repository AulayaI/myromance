document.addEventListener("DOMContentLoaded", () => {
  /* =========================
     NAVIGATION + GLASS TRANSITION
  ========================== */
  const navButtons = document.querySelectorAll(".nav-btn");
  const sections = document.querySelectorAll(".section");

  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.dataset.target;
      if (!targetId) return;

      navButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      sections.forEach((sec) => {
        if (sec.id === targetId) {
          sec.classList.add("section-active");
        } else {
          sec.classList.remove("section-active");
        }
      });
    });
  });

  /* =========================
     COUNTER (SINCE 13 MAY 2025 19:13)
  ========================== */
  const startDate = new Date(2025, 4, 13, 19, 4, 0); // month index 4 = May

  const monthsEl = document.getElementById("months-count");
  const daysEl = document.getElementById("days-count");
  const hoursEl = document.getElementById("hours-count");
  const minutesEl = document.getElementById("minutes-count");
  const secondsEl = document.getElementById("seconds-count");

  function updateCounter() {
    const now = new Date();

    let months =
      (now.getFullYear() - startDate.getFullYear()) * 12 +
      (now.getMonth() - startDate.getMonth());

    let monthAdjustedDate = new Date(startDate.getTime());
    monthAdjustedDate.setMonth(monthAdjustedDate.getMonth() + months);

    if (monthAdjustedDate > now) {
      months--;
      monthAdjustedDate.setMonth(monthAdjustedDate.getMonth() - 1);
    }

    let diffMs = now - monthAdjustedDate;
    const totalSeconds = Math.floor(diffMs / 1000);

    const days = Math.floor(totalSeconds / (24 * 3600));
    let remaining = totalSeconds - days * 24 * 3600;
    const hours = Math.floor(remaining / 3600);
    remaining -= hours * 3600;
    const minutes = Math.floor(remaining / 60);
    const seconds = remaining - minutes * 60;

    if (monthsEl) monthsEl.textContent = Math.max(months, 0);
    if (daysEl) daysEl.textContent = Math.max(days, 0);
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, "0");
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, "0");
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, "0");
  }

  updateCounter();
  setInterval(updateCounter, 1000);

  /* =========================
     FOOTER YEAR
  ========================== */
  const footerYearEl = document.getElementById("footer-year");
  if (footerYearEl) {
    footerYearEl.textContent = new Date().getFullYear();
  }

  /* =========================
     PLAYLIST (3 TRACKS, PLAY/PAUSE & SEEK)
  ========================== */
  const tracks = document.querySelectorAll(".track");

  function formatTime(seconds) {
    if (!isFinite(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${String(s).padStart(2, "0")}`;
  }

  function pauseAllExcept(currentAudio) {
    tracks.forEach((track) => {
      const audio = track.querySelector("audio");
      const playBtn = track.querySelector(".play-pause");
      const seek = track.querySelector(".seek");
      const currentTimeEl = track.querySelector(".current-time");
      if (audio && audio !== currentAudio) {
        audio.pause();
        if (playBtn) {
          playBtn.classList.remove("playing");
          playBtn.textContent = "▶";
        }
        if (seek) seek.value = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
        if (currentTimeEl) currentTimeEl.textContent = formatTime(audio.currentTime || 0);
      }
    });
  }

  tracks.forEach((track) => {
    const audio = track.querySelector("audio");
    const playBtn = track.querySelector(".play-pause");
    const seek = track.querySelector(".seek");
    const currentTimeEl = track.querySelector(".current-time");
    const durationEl = track.querySelector(".duration");

    if (!audio || !playBtn || !seek || !currentTimeEl || !durationEl) return;

    audio.addEventListener("loadedmetadata", () => {
      durationEl.textContent = formatTime(audio.duration);
    });

    playBtn.addEventListener("click", (e) => {
      e.preventDefault();

      if (audio.paused) {
        pauseAllExcept(audio);
        audio.play().catch(() => {});
        playBtn.classList.add("playing");
        playBtn.textContent = "❚❚";
      } else {
        audio.pause();
        playBtn.classList.remove("playing");
        playBtn.textContent = "▶";
      }
    });

    audio.addEventListener("timeupdate", () => {
      currentTimeEl.textContent = formatTime(audio.currentTime);
      if (audio.duration > 0) {
        const percent = (audio.currentTime / audio.duration) * 100;
        seek.value = percent;
      }
    });

    seek.addEventListener("input", () => {
      if (audio.duration > 0) {
        const newTime = (seek.value / 100) * audio.duration;
        audio.currentTime = newTime;
      }
    });

    audio.addEventListener("ended", () => {
      playBtn.classList.remove("playing");
      playBtn.textContent = "▶";
      seek.value = 0;
      currentTimeEl.textContent = "0:00";
    });
  });

  /* =========================
     SECRET MESSAGE (PASSWORD 30162007)
  ========================== */
  const SECRET_PASSWORD = "30162007";

  const secretInput = document.getElementById("secret-password");
  const secretSubmit = document.getElementById("secret-submit");
  const secretFeedback = document.getElementById("secret-feedback");
  const secretMessage = document.getElementById("secret-message");

  function tryUnlock() {
    if (!secretInput || !secretFeedback || !secretMessage) return;

    const value = (secretInput.value || "").trim();
    if (!value) return;

    if (value === SECRET_PASSWORD) {
      secretFeedback.textContent = "Unlocked. Ini cuma buat kamu.";
      secretFeedback.classList.remove("error");
      secretFeedback.classList.add("success");
      secretMessage.classList.remove("hidden");
    } else {
      secretFeedback.textContent =
        "Kok password salah sih? Coba ingat lagi tanggal dan angka kelahiran kita.";
      secretFeedback.classList.remove("success");
      secretFeedback.classList.add("error");
      secretMessage.classList.add("hidden");
    }
  }

  if (secretSubmit) {
    secretSubmit.addEventListener("click", tryUnlock);
  }

  if (secretInput) {
    secretInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        tryUnlock();
      }
    });
  }

  /* =========================
     HEART CURSOR EFFECT
  ========================== */
  const heartLayer = document.getElementById("heart-layer");
  let lastHeartTime = 0;

  function spawnHeart(x, y) {
    if (!heartLayer) return;
    const span = document.createElement("span");
    span.className = "heart";
    span.textContent = "❤";
    span.style.left = x + "px";
    span.style.top = y + "px";

    heartLayer.appendChild(span);

    setTimeout(() => {
      span.remove();
    }, 1200);
  }

  window.addEventListener("pointermove", (e) => {
    const now = performance.now();
    if (now - lastHeartTime < 50) return; // throttle
    lastHeartTime = now;
    spawnHeart(e.clientX, e.clientY);
  });
});
