const root = document.documentElement;
const themeToggle = document.querySelector("#theme-toggle");
const themeLabel = document.querySelector(".theme-label");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark" || savedTheme === "light") {
  root.dataset.theme = savedTheme;
} else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
  root.dataset.theme = "dark";
}

function updateThemeButton() {
  if (!themeToggle) return;
  const isDark = root.dataset.theme === "dark";
  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeToggle.setAttribute("aria-label", isDark ? "切换为浅色主题" : "切换为深色主题");
  if (themeLabel) themeLabel.textContent = isDark ? "浅色" : "深色";
}

updateThemeButton();

themeToggle?.addEventListener("click", () => {
  root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
  localStorage.setItem("theme", root.dataset.theme);
  updateThemeButton();
});

if (!reducedMotion.matches && "IntersectionObserver" in window) {
  const sections = document.querySelectorAll(".section-header, .fact-list, .step-list, .link-cards");
  sections.forEach((element) => element.classList.add("reveal-ready"));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  sections.forEach((element) => observer.observe(element));
}
