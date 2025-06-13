const translations = {
  en: {
    title: "Age Calculator",
    labelBirth: "Choose your birth date:",
    countdown: "Next birthday in: {d} day(s)",
    yearsLabel: "Years",
    monthsLabel: "Months",
    daysLabel: "Days",
    hoursLabel: "Hours",
    minutesLabel: "Minutes",
    secondsLabel: "Seconds",
    millisecondsLabel: "Milliseconds",
    bornOn: "You were born on a {day}",
    lived: "You've lived: {time}"
  },
  uz: {
    title: "Yosh hisoblagich",
    labelBirth: "Tug‘ilgan sanangizni tanlang:",
    countdown: "Keyingi tug‘ilgan kuningizgacha: {d} kun",
    yearsLabel: "Yil",
    monthsLabel: "Oy",
    daysLabel: "Kun",
    hoursLabel: "Soat",
    minutesLabel: "Daqiqa",
    secondsLabel: "Sekund",
    millisecondsLabel: "Millisekund",
    bornOn: "Siz {day} kuni tug‘ilgansiz",
    lived: "Siz yashagansiz: {time}"
  },
  ru: {
    title: "Калькулятор возраста",
    labelBirth: "Выберите дату рождения:",
    countdown: "Следующий день рождения через: {d} дней",
    yearsLabel: "Лет",
    monthsLabel: "Месяцев",
    daysLabel: "Дней",
    hoursLabel: "Часов",
    minutesLabel: "Минут",
    secondsLabel: "Секунд",
    millisecondsLabel: "Миллисекунд",
    bornOn: "Вы родились в {day}",
    lived: "Вы прожили: {time}"
  }
};

const languageSelector = document.getElementById("language");

function applyLanguage(lang) {
  const t = translations[lang] || translations.en;

  document.getElementById("title").textContent = t.title;
  document.getElementById("label-birth").textContent = t.labelBirth;
  document.getElementById("years-label").textContent = t.yearsLabel;
  document.getElementById("months-label").textContent = t.monthsLabel;
  document.getElementById("days-label").textContent = t.daysLabel;
  document.getElementById("hours-label").textContent = t.hoursLabel;
  document.getElementById("seconds-label").textContent = t.secondsLabel;
  document.getElementById("milliseconds-label").textContent = t.millisecondsLabel;

  const birthInput = document.getElementById("birthdate");
  if (birthInput.value) {
    updateBirthdayText(new Date(birthInput.value), lang);
  }

  localStorage.setItem("language", lang);
}

function updateBirthdayText(birthDate, lang) {
  const now = new Date();
  const t = translations[lang] || translations.en;

  const weekdays = {
    en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    uz: ["Yakshanba", "Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba"],
    ru: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"]
  };

  const weekday = weekdays[lang][birthDate.getDay()];
  document.getElementById("birth-weekday").textContent = t.bornOn.replace("{day}", weekday);

  const nextBirthday = new Date(now.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  if (nextBirthday < now) nextBirthday.setFullYear(now.getFullYear() + 1);
  const diffDays = Math.ceil((nextBirthday - now) / (1000 * 60 * 60 * 24));

  document.getElementById("countdown").textContent = t.countdown.replace("{d}", diffDays);

  // 🛠️ SHU QATORNI QO‘SHING
  localStorage.setItem("lastBirthdate", birthDate.toISOString());
}


function formatDuration(seconds, lang) {
  const t = translations[lang] || translations.en;

  const years = Math.floor(seconds / (365 * 24 * 60 * 60));
  seconds %= 365 * 24 * 60 * 60;

  const months = Math.floor(seconds / (30 * 24 * 60 * 60));
  seconds %= 30 * 24 * 60 * 60;

  const days = Math.floor(seconds / (24 * 60 * 60));
  seconds %= 24 * 60 * 60;

  const hours = Math.floor(seconds / 3600);
  seconds %= 3600;

  const minutes = Math.floor(seconds / 60);
  seconds = Math.floor(seconds % 60);

  return `${years} ${t.yearsLabel}, ${months} ${t.monthsLabel}, ${days} ${t.daysLabel}, ${hours} ${t.hoursLabel}, ${minutes} ${t.minutesLabel || "Minutes"}, ${seconds} ${t.secondsLabel}`;
}



// Saqlangan tilni yuklash
const savedLang = localStorage.getItem("language") || "en";
languageSelector.value = savedLang;
applyLanguage(savedLang);

// Til o‘zgartirilganda
languageSelector.addEventListener("change", () => {
  const selectedLang = languageSelector.value;
  applyLanguage(selectedLang);
});

// Yashagan vaqtni har sekund yangilab turish
setInterval(() => {
  const birth = localStorage.getItem("lastBirthdate");
  if (!birth) return;

  const lang = localStorage.getItem("language") || "en";
  const t = translations[lang];
  const birthDate = new Date(birth);
  const seconds = Math.floor((new Date() - birthDate) / 1000);
  const livedText = formatDuration(seconds, lang);
  document.getElementById("live-time").textContent = t.lived.replace("{time}", livedText);
}, 1000);
