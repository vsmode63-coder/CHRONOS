
"use strict";

const $ = (id) => document.getElementById(id);

const hourHand = $("hourHand");
const minuteHand = $("minuteHand");
const secondHand = $("secondHand");
const digitalTime = $("digitalTime");
const dateLabel = $("dateLabel");

const motionButton = $("motionButton");
const motionIcon = $("motionIcon");
const motionLabel = $("motionLabel");
const fullscreenButton = $("fullscreenButton");

let paused = false;
let previousDate = "";

function updateClock() {
  const now = new Date();

  const seconds =
    now.getSeconds() + now.getMilliseconds() / 1000;

  const minutes =
    now.getMinutes() + seconds / 60;

  const hours =
    (now.getHours() % 12) + minutes / 60;

  secondHand.style.transform =
    `translateX(-50%) rotate(${seconds * 6}deg)`;

  minuteHand.style.transform =
    `translateX(-50%) rotate(${minutes * 6}deg)`;

  hourHand.style.transform =
    `translateX(-50%) rotate(${hours * 30}deg)`;

  digitalTime.textContent = now.toLocaleTimeString(
    "en-GB",
    { hour12: false }
  );

  const today = now.toLocaleDateString("ar", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  if (today !== previousDate) {
    dateLabel.textContent = today;
    previousDate = today;
  }

  requestAnimationFrame(updateClock);
}

updateClock();

// إيقاف التروس أو استئنافها
motionButton.addEventListener("click", () => {
  paused = !paused;
  document.body.classList.toggle("paused", paused);

  motionIcon.textContent = paused ? "▶" : "Ⅱ";
  motionLabel.textContent = paused
    ? "تشغيل حركة التروس"
    : "إيقاف حركة التروس";

  motionButton.setAttribute(
    "aria-pressed",
    String(paused)
  );
});

// ملء الشاشة؛ قد يحتاج إلى دعم المتصفح
fullscreenButton.addEventListener("click", async () => {
  try {
    if (!document.fullscreenElement) {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      } else {
        showMessage("استخدم وضع التثبيت لعرض التطبيق مستقلًا");
      }
    } else if (document.exitFullscreen) {
      await document.exitFullscreen();
    }
  } catch {
    showMessage("ملء الشاشة غير متاح في هذا المتصفح");
  }
});

function showMessage(message) {
  let toast = $("toast");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    toast.setAttribute("role", "status");
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(showMessage.timer);

  showMessage.timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}

// تسجيل عامل الخدمة لدعم التثبيت والعمل دون اتصال
if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      await navigator.serviceWorker.register("./sw.js");
    } catch (error) {
      console.error("Service worker registration failed:", error);
    }
  });
}
