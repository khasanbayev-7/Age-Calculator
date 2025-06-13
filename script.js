const birthInput = document.getElementById("birthdate");
const results = document.getElementById("results");
const countdown = document.getElementById("countdown");
const toggleBtn = document.getElementById("theme-toggle");

// Load theme from localStorage
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

// Toggle theme
toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
});

birthInput.addEventListener("change", () => {
  const birthDate = new Date(birthInput.value);
  const now = new Date();
  if (isNaN(birthDate.getTime())) return;

  localStorage.setItem("lastBirthdate", birthInput.value);

  const diff = now - birthDate;
  const milliseconds = diff;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30.4375);
  const years = Math.floor(months / 12);

  document.getElementById("milliseconds").textContent = milliseconds.toLocaleString();
  document.getElementById("seconds").textContent = seconds.toLocaleString();
  document.getElementById("hours").textContent = hours.toLocaleString();
  document.getElementById("days").textContent = days.toLocaleString();
  document.getElementById("months").textContent = months.toLocaleString();
  document.getElementById("years").textContent = years.toLocaleString();

  // Birthday countdown
  const thisYearBirthday = new Date(now.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  const nextBirthday = thisYearBirthday < now
    ? new Date(now.getFullYear() + 1, birthDate.getMonth(), birthDate.getDate())
    : thisYearBirthday;
  const daysToBirthday = Math.ceil((nextBirthday - now) / (1000 * 60 * 60 * 24));
  countdown.textContent = `Next birthday in: ${daysToBirthday} day(s)`;

  results.classList.remove("hidden");
});

// Load last date
const saved = localStorage.getItem("lastBirthdate");
if (saved) {
  birthInput.value = saved;
  birthInput.dispatchEvent(new Event("change"));
}

// ... Sening mavjud koding o'zgarishsiz qoladi ...

// Qo‘shimcha: Tug‘ilgan sana haftaning qaysi kuni ekanligini ko‘rsatish
birthInput.addEventListener("change", () => {
  const birthDate = new Date(birthInput.value);
  const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const weekday = weekdays[birthDate.getDay()];
  document.getElementById("birth-weekday").textContent = `You were born on a ${weekday}`;
});

// Qo‘shimcha: Umumiy yashagan soniyalarni ko‘rsatish (aniqroq)
function formatDuration(seconds, lang) {
  const y = Math.floor(seconds / (365.25 * 24 * 3600));
  const d = Math.floor((seconds % (365.25 * 24 * 3600)) / (24 * 3600));
  const h = Math.floor((seconds % (24 * 3600)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  // Ixtiyoriy: Agar har bir birlikni tarjima qilmoqchi bo‘lsangiz
  const labels = {
    en: ["y", "d", "h", "m", "s"],
    uz: ["y", "k", "s", "d", "s"], // yoki "yil", "kun", ...
    ru: ["л", "д", "ч", "м", "с"]
  }[lang] || ["y", "d", "h", "m", "s"];

  return `${y}${labels[0]} ${d}${labels[1]} ${h}${labels[2]} ${m}${labels[3]} ${s}${labels[4]}`;
}

// Qo‘shimcha: Har soniyada yangilab turuvchi taymer
setInterval(() => {
  const savedDate = localStorage.getItem("lastBirthdate");
  if (!savedDate) return;

  const birthDate = new Date(savedDate);
  const now = new Date();
  const seconds = Math.floor((now - birthDate) / 1000);
  const lang = localStorage.getItem("language") || "en";

  const livedText = formatDuration(seconds, lang);
  const t = translations[lang] || translations.en;

  document.getElementById("live-time").textContent = t.lived.replace("{time}", livedText);
}, 1000);

