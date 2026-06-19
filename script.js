const CONFIG = {
  weddingDate: "2026-09-26T13:00:00+09:00",
  rsvpEmail: "your-email@example.com"
};

const els = {
  days: document.getElementById("days"),
  hours: document.getElementById("hours"),
  minutes: document.getElementById("minutes"),
  seconds: document.getElementById("seconds")
};

function pad(value) {
  return String(value).padStart(2, "0");
}

function updateCountdown() {
  const target = new Date(CONFIG.weddingDate).getTime();
  const now = Date.now();
  const diff = Math.max(0, target - now);

  const day = 1000 * 60 * 60 * 24;
  const hour = 1000 * 60 * 60;
  const minute = 1000 * 60;

  els.days.textContent = Math.floor(diff / day);
  els.hours.textContent = pad(Math.floor((diff % day) / hour));
  els.minutes.textContent = pad(Math.floor((diff % hour) / minute));
  els.seconds.textContent = pad(Math.floor((diff % minute) / 1000));
}

updateCountdown();
setInterval(updateCountdown, 1000);

const form = document.getElementById("rsvpForm");
const status = document.getElementById("formStatus");

if (form && status) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = Object.fromEntries(new FormData(form).entries());
    const answer = {
      ...data,
      createdAt: new Date().toISOString()
    };

    // Локальная копия на устройстве гостя. Владелец сайта её не увидит без отправки письма.
    const saved = JSON.parse(localStorage.getItem("wedding_rsvp_answers") || "[]");
    saved.push(answer);
    localStorage.setItem("wedding_rsvp_answers", JSON.stringify(saved));

    const subject = encodeURIComponent(`RSVP на свадьбу 26.09.2026 — ${data.name}`);
    const body = encodeURIComponent(
`Здравствуйте!

Мой ответ на приглашение:

Имя: ${data.name}
Контакт: ${data.contact || "не указан"}
Присутствие: ${data.attendance}
Комментарий: ${data.message || "нет"}

Дата ответа: ${new Date().toLocaleString("ru-RU")}
`
    );

    status.textContent = "Спасибо! Сейчас откроется письмо с вашим ответом. Его нужно отправить вручную.";
    window.location.href = `mailto:${CONFIG.rsvpEmail}?subject=${subject}&body=${body}`;
  });
}
