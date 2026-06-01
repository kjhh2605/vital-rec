const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const dataEl = document.getElementById("site-data");
const siteData = JSON.parse(dataEl.textContent);
function formatValue(value) { return value.toFixed(3); }
function renderCharts(targetId, groups) {
  const target = document.getElementById(targetId);
  if (!target) return;
  target.innerHTML = groups.map((group) => {
    const max = Math.max(...group.models.map((model) => model.mae));
    const rows = group.models.map((model) => {
      const width = Math.max((model.mae / max) * 100, 8).toFixed(1);
      return `<div class="bar-row${model.highlight ? " is-highlight" : ""}"><span class="bar-label">${model.name}</span><span class="bar-track" aria-hidden="true"><span class="bar-fill" style="--w:${width}%"></span></span><span class="bar-value">${formatValue(model.mae)}</span></div>`;
    }).join("");
    const improvement = group.improvement ? `<span class="improvement">${group.improvement}</span>` : "";
    return `<article class="chart-card"><div class="chart-card__top"><h3>${group.title}</h3>${improvement}</div><div class="bar-list" aria-label="${group.title} MAE chart">${rows}</div><p class="chart-note">MAE, 낮을수록 좋음.</p></article>`;
  }).join("");
}
function renderTeam() {
  const target = document.getElementById("teamGrid");
  if (!target) return;
  target.innerHTML = siteData.team.map((member, index) => `<article class="team-card"><span class="avatar" aria-hidden="true">${member.name.slice(0, 1)}</span><h3>${member.name}</h3><p class="team-role">${member.role}</p><p class="team-bio">${member.bio}</p><a href="${member.github}" aria-label="${member.name} GitHub 링크 준비 중">GitHub 준비 중</a></article>`).join("");
}
function setupScrollFocus() {
  if (prefersReduced || window.matchMedia("(max-width: 860px)").matches) return;
  const elements = Array.from(document.querySelectorAll(".scroll-focus"));
  let raf = 0;
  const update = () => {
    const center = window.innerHeight / 2;
    for (const el of elements) {
      const rect = el.getBoundingClientRect();
      const elementCenter = rect.top + rect.height / 2;
      const t = Math.max(-1.25, Math.min(1.25, (elementCenter - center) / center));
      const at = Math.min(Math.abs(t), 1);
      el.style.setProperty("--t", t.toFixed(4));
      el.style.setProperty("--at", at.toFixed(4));
    }
    raf = 0;
  };
  const schedule = () => { if (!raf) raf = requestAnimationFrame(update); };
  update();
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
}
function setupIntro() {
  if (prefersReduced) return;
  const intro = document.querySelector(".intro");
  if (!intro) return;
  window.setTimeout(() => intro.setAttribute("hidden", ""), 1050);
}
renderCharts("baselineCharts", siteData.baseline);
renderCharts("ablationCharts", siteData.ablation);
renderTeam();
setupScrollFocus();
setupIntro();
