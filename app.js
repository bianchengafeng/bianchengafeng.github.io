const root = document.documentElement;
const themeToggle = document.querySelector("#theme-toggle");
const canvas = document.querySelector("#liquid-field");
const stage = document.querySelector("#liquid-stage");
const readout = document.querySelector("#coordinate-readout");
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
}

updateThemeButton();

themeToggle?.addEventListener("click", () => {
  root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
  localStorage.setItem("theme", root.dataset.theme);
  updateThemeButton();
  drawLiquidField(pointer.x, pointer.y);
});

const context = canvas?.getContext("2d");
const pointer = { x: 0.5, y: 0.5 };
let frameRequest = 0;

function cssColor(variable) {
  return getComputedStyle(root).getPropertyValue(variable).trim();
}

function fitCanvas() {
  if (!canvas || !stage) return;
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  const bounds = stage.getBoundingClientRect();
  canvas.width = Math.max(1, Math.round(bounds.width * ratio));
  canvas.height = Math.max(1, Math.round(bounds.height * ratio));
}

function drawLiquidField(focusX = 0.5, focusY = 0.5) {
  if (!context || !canvas) return;

  const width = canvas.width;
  const height = canvas.height;
  const lake = cssColor("--lake");
  const lakeLight = cssColor("--lake-light");
  const amber = cssColor("--amber");
  const targetX = focusX * width;
  const targetY = focusY * height;

  context.clearRect(0, 0, width, height);

  const wash = context.createRadialGradient(targetX, targetY, 0, targetX, targetY, Math.max(width, height) * 0.62);
  wash.addColorStop(0, `${lakeLight}66`);
  wash.addColorStop(0.34, `${lake}24`);
  wash.addColorStop(1, `${lake}00`);
  context.fillStyle = wash;
  context.fillRect(0, 0, width, height);

  context.lineCap = "round";
  for (let index = 0; index < 9; index += 1) {
    const normalized = index / 8;
    const baseY = height * (0.16 + normalized * 0.7);
    const distance = Math.abs(baseY - targetY) / height;
    const influence = Math.max(0, 1 - distance * 2.5);

    context.beginPath();
    for (let step = 0; step <= 64; step += 1) {
      const x = (step / 64) * width;
      const wave = Math.sin(step * 0.22 + index * 0.86) * height * (0.006 + influence * 0.012);
      const pull = Math.exp(-Math.pow((x - targetX) / (width * 0.2), 2)) * (targetY - baseY) * 0.12;
      const y = baseY + wave + pull;
      if (step === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    }
    context.strokeStyle = influence > 0.58 ? amber : lake;
    context.globalAlpha = 0.08 + influence * 0.16;
    context.lineWidth = Math.max(1, width * 0.0014);
    context.stroke();
  }

  context.globalAlpha = 0.42;
  context.strokeStyle = lakeLight;
  context.lineWidth = Math.max(1, width * 0.0012);
  context.beginPath();
  context.arc(targetX, targetY, Math.max(18, width * 0.035), 0, Math.PI * 2);
  context.stroke();
  context.globalAlpha = 1;
}

function renderPointer() {
  frameRequest = 0;
  root.style.setProperty("--mx", `${(pointer.x * 100).toFixed(1)}%`);
  root.style.setProperty("--my", `${(pointer.y * 100).toFixed(1)}%`);
  if (readout) {
    readout.textContent = `${(pointer.x * 100).toFixed(1)} — ${(pointer.y * 100).toFixed(1)}`;
  }
  drawLiquidField(pointer.x, pointer.y);
}

function updatePointer(event) {
  if (!stage || reducedMotion.matches) return;
  const bounds = stage.getBoundingClientRect();
  pointer.x = Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width));
  pointer.y = Math.min(1, Math.max(0, (event.clientY - bounds.top) / bounds.height));
  if (!frameRequest) frameRequest = requestAnimationFrame(renderPointer);
}

stage?.addEventListener("pointermove", updatePointer, { passive: true });
stage?.addEventListener("pointerleave", () => {
  pointer.x = 0.5;
  pointer.y = 0.5;
  renderPointer();
});

function resizeField() {
  fitCanvas();
  drawLiquidField(pointer.x, pointer.y);
}

window.addEventListener("resize", resizeField, { passive: true });

if (!reducedMotion.matches && "IntersectionObserver" in window) {
  const observedElements = document.querySelectorAll(".section-intro, .facts, .path-list, .exits");
  observedElements.forEach((element) => element.classList.add("reveal-ready"));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  observedElements.forEach((element) => observer.observe(element));
}

resizeField();
