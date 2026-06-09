// overlay.js — 套圖工具主邏輯 v2（矩形照片）

let allAgents   = [];
let selAgent    = null;
let selTemplate = null;

const searchInput  = document.getElementById("search-input");
const agentList    = document.getElementById("agent-list");
const selectedCard = document.getElementById("selected-card");
const tmplGrid     = document.getElementById("tmpl-grid");
const btnGenerate  = document.getElementById("btn-generate");
const btnDownload  = document.getElementById("btn-download");
const canvas       = document.getElementById("preview-canvas");
const placeholder  = document.getElementById("preview-placeholder");
const loadingEl    = document.getElementById("preview-loading");
const statusBar    = document.getElementById("status-bar");
const corsNotice   = document.getElementById("cors-notice");

const ctx = canvas.getContext("2d");

(async function init() {
  buildTemplatePicker();
  await loadAgents();
})();

// ── 模板選擇器 ────────────────────────────────────────
function buildTemplatePicker() {
  Object.entries(TEMPLATES).forEach(([key, tmpl]) => {
    const btn = document.createElement("button");
    btn.className = "tmpl-btn";
    btn.dataset.key = key;

    const img = document.createElement("img");
    img.src = tmpl.file;
    img.alt = tmpl.label;
    img.onerror = () => {
      const ph = document.createElement("div");
      ph.className = "tmpl-placeholder";
      ph.textContent = ["🅰️","🅱️","🆎"][Object.keys(TEMPLATES).indexOf(key)];
      img.replaceWith(ph);
    };

    const label = document.createElement("span");
    label.textContent = tmpl.label;
    btn.appendChild(img);
    btn.appendChild(label);
    btn.addEventListener("click", () => selectTemplate(key));
    tmplGrid.appendChild(btn);
  });
}

function selectTemplate(key) {
  selTemplate = key;
  document.querySelectorAll(".tmpl-btn").forEach(b =>
    b.classList.toggle("active", b.dataset.key === key)
  );
  checkReady();
}

// ── 載入業務資料 ──────────────────────────────────────
async function loadAgents() {
  setStatus("載入業務資料中…");
  try {
    const res = await fetch(API_URL + "?action=getAgents", { mode: "cors" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    allAgents = Array.isArray(data) ? data : (data.agents || []);
    setStatus(`已載入 ${allAgents.length} 位業務`);
    corsNotice.style.display = "none";
  } catch (e) {
    console.error("載入業務失敗:", e);
    setStatus("業務資料載入失敗，請檢查 API", true);
    corsNotice.style.display = "block";
    allAgents = [
      { agent_id: "TEST001", name: "王小明", phone: "0912-345-678", branch: "台北信義分行", photo_url: "" },
      { agent_id: "TEST002", name: "林美華", phone: "0923-456-789", branch: "大安分行",     photo_url: "" },
    ];
  }
}

// ── 搜尋 ─────────────────────────────────────────────
searchInput.addEventListener("input", () => {
  const q = searchInput.value.trim().toLowerCase();
  if (!q) { agentList.style.display = "none"; return; }
  const hits = allAgents.filter(a =>
    (a.name || "").toLowerCase().includes(q) ||
    (a.agent_id || "").toLowerCase().includes(q) ||
    (a.phone || "").includes(q)
  ).slice(0, 20);
  renderAgentList(hits);
});

function renderAgentList(agents) {
  agentList.innerHTML = "";
  if (!agents.length) {
    agentList.innerHTML = `<div class="agent-item"><div class="agent-info"><span>找不到符合的業務</span></div></div>`;
    agentList.style.display = "block";
    return;
  }
  agents.forEach(agent => {
    const item = document.createElement("div");
    item.className = "agent-item";
    if (selAgent && selAgent.agent_id === agent.agent_id) item.classList.add("selected");

    let avatarEl;
    if (agent.photo_url) {
      avatarEl = document.createElement("img");
      avatarEl.className = "agent-avatar";
      avatarEl.src = agent.photo_url;
      avatarEl.alt = agent.name;
      avatarEl.onerror = () => avatarEl.replaceWith(makePlaceholder(agent.name));
    } else {
      avatarEl = makePlaceholder(agent.name);
    }

    const info = document.createElement("div");
    info.className = "agent-info";
    info.innerHTML = `<strong>${agent.name}</strong><span>${agent.agent_id} · ${agent.phone || ""}</span>`;

    item.appendChild(avatarEl);
    item.appendChild(info);
    item.addEventListener("click", () => selectAgent(agent));
    agentList.appendChild(item);
  });
  agentList.style.display = "block";
}

function makePlaceholder(name) {
  const div = document.createElement("div");
  div.className = "agent-avatar-placeholder";
  div.textContent = (name || "?")[0];
  return div;
}

function selectAgent(agent) {
  selAgent = agent;
  searchInput.value = agent.name;
  agentList.style.display = "none";
  selectedCard.style.display = "block";
  document.getElementById("sc-name").textContent   = agent.name;
  document.getElementById("sc-phone").textContent  = "📞 " + (agent.phone  || "—");
  document.getElementById("sc-branch").textContent = "📍 " + (agent.branch || "—");
  checkReady();
}

document.addEventListener("click", e => {
  if (!e.target.closest("#agent-list") && !e.target.closest(".search-wrap")) {
    agentList.style.display = "none";
  }
});

function checkReady() {
  btnGenerate.disabled = !(selAgent && selTemplate);
}

// ── 產生套圖 ──────────────────────────────────────────
btnGenerate.addEventListener("click", generateImage);

async function generateImage() {
  if (!selAgent || !selTemplate) return;

  const tmpl = TEMPLATES[selTemplate];
  btnGenerate.disabled = true;
  btnDownload.style.display = "none";
  placeholder.style.display = "none";
  loadingEl.style.display   = "flex";
  canvas.style.display      = "none";
  setStatus("載入底圖中…");

  try {
    await document.fonts.ready;

    const bg = await loadImage(tmpl.file);
    canvas.width  = 1040;
    canvas.height = 1040;
    ctx.drawImage(bg, 0, 0, 1040, 1040);
    setStatus("套入業務資料中…");

    // 套入業務照片（矩形裁切）
    if (selAgent.photo_url) {
      try {
        const photo = await loadImage(selAgent.photo_url);
        drawRectPhoto(photo, tmpl.photo);
      } catch {
        drawRectPlaceholder(tmpl.photo, selAgent.name);
      }
    } else {
      drawRectPlaceholder(tmpl.photo, selAgent.name);
    }

    // 套入文字（name / phone / branch）
    const fields = [
      { cfg: tmpl.name,   text: selAgent.name   || "" },
      { cfg: tmpl.phone,  text: selAgent.phone  || "" },
      { cfg: tmpl.branch, text: selAgent.branch || "" },
    ];

    fields.forEach(({ cfg, text }) => {
      if (!cfg || !text) return;
      ctx.save();
      ctx.font         = `${cfg.weight} ${cfg.size}px "${FONT_FAMILY}", "Noto Sans TC", sans-serif`;
      ctx.fillStyle    = cfg.color;
      ctx.textAlign    = cfg.align || "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, cfg.x, cfg.y);
      ctx.restore();
    });

    loadingEl.style.display   = "none";
    canvas.style.display      = "block";
    btnDownload.style.display = "block";
    setStatus("✅ 完成！點擊下方按鈕下載");

  } catch (err) {
    console.error(err);
    loadingEl.style.display   = "none";
    placeholder.style.display = "flex";
    setStatus("❌ 產生失敗：" + err.message, true);
  } finally {
    btnGenerate.disabled = false;
  }
}

// ── 矩形照片（等比例置中裁切填滿）────────────────────
function drawRectPhoto(img, { x, y, width, height }) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, width, height);
  ctx.clip();

  const scale = Math.max(width / img.width, height / img.height);
  const sw = img.width  * scale;
  const sh = img.height * scale;
  ctx.drawImage(img, x + (width - sw) / 2, y + (height - sh) / 2, sw, sh);
  ctx.restore();
}

function drawRectPlaceholder({ x, y, width, height }, name) {
  ctx.save();
  ctx.fillStyle = "#cccccc";
  ctx.fillRect(x, y, width, height);
  ctx.font         = `700 ${Math.min(width, height) * 0.35}px "${FONT_FAMILY}", sans-serif`;
  ctx.fillStyle    = "#ffffff";
  ctx.textAlign    = "center";
  ctx.textBaseline = "middle";
  ctx.fillText((name || "?")[0], x + width / 2, y + height / 2);
  ctx.restore();
}

// ── 下載 ─────────────────────────────────────────────
btnDownload.addEventListener("click", () => {
  const name   = selAgent?.name || "業務";
  const tmplLb = TEMPLATES[selTemplate]?.label || selTemplate;
  const link   = document.createElement("a");
  link.download = `${name}_${tmplLb}.png`;
  link.href     = canvas.toDataURL("image/png");
  link.click();
});

// ── 工具函式 ──────────────────────────────────────────
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload  = () => resolve(img);
    img.onerror = () => reject(new Error("圖片載入失敗：" + src));
    img.src     = src;
  });
}

function setStatus(msg, isError = false) {
  statusBar.textContent = msg;
  statusBar.className   = isError ? "error" : "";
}
