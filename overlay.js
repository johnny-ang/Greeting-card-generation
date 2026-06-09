// overlay.js — 套圖工具主邏輯

// ── 狀態 ──────────────────────────────────────────────
let allAgents   = [];      // 從 API 讀取的全部業務
let selAgent    = null;    // 目前選取的業務
let selTemplate = null;    // 目前選取的模板 key (A/B/C)

// ── DOM refs ─────────────────────────────────────────
const searchInput    = document.getElementById("search-input");
const agentList      = document.getElementById("agent-list");
const selectedCard   = document.getElementById("selected-card");
const tmplGrid       = document.getElementById("tmpl-grid");
const btnGenerate    = document.getElementById("btn-generate");
const btnDownload    = document.getElementById("btn-download");
const canvas         = document.getElementById("preview-canvas");
const placeholder    = document.getElementById("preview-placeholder");
const loadingEl      = document.getElementById("preview-loading");
const statusBar      = document.getElementById("status-bar");
const corsNotice     = document.getElementById("cors-notice");

const ctx = canvas.getContext("2d");

// ── 初始化 ────────────────────────────────────────────
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

    // 嘗試顯示縮圖，失敗就顯示 emoji
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
    // Google Apps Script JSONP 或 CORS 模式
    const res = await fetch(API_URL + "?action=getAgents", { mode: "cors" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();

    // 支援兩種回傳格式：陣列 或 { agents: [...] }
    allAgents = Array.isArray(data) ? data : (data.agents || []);
    setStatus(`已載入 ${allAgents.length} 位業務`);
    corsNotice.style.display = "none";
  } catch (e) {
    console.error("載入業務失敗:", e);
    setStatus("業務資料載入失敗，請手動輸入或檢查 API", true);
    corsNotice.style.display = "block";

    // Fallback：提供測試用假資料讓畫面可操作
    allAgents = [
      { agent_id: "TEST001", name: "王小明", phone: "0912-345-678", brand: "信義房屋", branch: "台北信義分行", photo_url: "" },
      { agent_id: "TEST002", name: "林美華", phone: "0923-456-789", brand: "信義房屋", branch: "大安分行",   photo_url: "" },
    ];
  }
}

// ── 搜尋邏輯 ──────────────────────────────────────────
searchInput.addEventListener("input", () => {
  const q = searchInput.value.trim().toLowerCase();
  if (!q) { agentList.style.display = "none"; return; }

  const hits = allAgents.filter(a =>
    (a.name     || "").toLowerCase().includes(q) ||
    (a.agent_id || "").toLowerCase().includes(q) ||
    (a.phone    || "").includes(q)
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

    // 頭像
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

  // 更新 selected card
  selectedCard.style.display = "block";
  document.getElementById("sc-name").textContent   = agent.name;
  document.getElementById("sc-phone").textContent  = "📞 " + (agent.phone  || "—");
  document.getElementById("sc-brand").textContent  = "🏢 " + (agent.brand  || "—");
  document.getElementById("sc-branch").textContent = "📍 " + (agent.branch || "—");

  checkReady();
}

// 點擊外部關閉搜尋清單
document.addEventListener("click", e => {
  if (!e.target.closest("#agent-list") && !e.target.closest(".search-wrap")) {
    agentList.style.display = "none";
  }
});

// ── 產生按鈕狀態 ──────────────────────────────────────
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
  placeholder.style.display   = "none";
  loadingEl.style.display     = "flex";
  canvas.style.display        = "none";
  setStatus("載入底圖中…");

  try {
    // 1. 等字體載入完成
    await document.fonts.ready;

    // 2. 載入底圖
    const bg = await loadImage(tmpl.file);

    // 3. 設定 Canvas 尺寸
    canvas.width  = 1040;
    canvas.height = 1040;

    // 4. 畫底圖
    ctx.drawImage(bg, 0, 0, 1040, 1040);
    setStatus("套入業務資料中…");

    // 5. 套入業務照片（圓形）
    if (selAgent.photo_url) {
      try {
        const photo = await loadImage(selAgent.photo_url);
        drawCirclePhoto(photo, tmpl.photo);
      } catch {
        drawCirclePlaceholder(tmpl.photo, selAgent.name);
      }
    } else {
      drawCirclePlaceholder(tmpl.photo, selAgent.name);
    }

    // 6. 套入文字
    const fields = [
      { cfg: tmpl.name,   text: selAgent.name   || "" },
      { cfg: tmpl.phone,  text: selAgent.phone  || "" },
      { cfg: tmpl.brand,  text: selAgent.brand  || "" },
      { cfg: tmpl.branch, text: selAgent.branch || "" },
    ];

    fields.forEach(({ cfg, text }) => {
      if (!text) return;
      ctx.save();
      ctx.font         = `${cfg.weight} ${cfg.size}px "${FONT_FAMILY}", "Noto Sans TC", sans-serif`;
      ctx.fillStyle    = cfg.color;
      ctx.textAlign    = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, cfg.x, cfg.y);
      ctx.restore();
    });

    // 7. 顯示預覽
    loadingEl.style.display = "none";
    canvas.style.display    = "block";
    btnDownload.style.display = "block";
    setStatus(`✅ 完成！點擊下方按鈕下載`);

  } catch (err) {
    console.error(err);
    loadingEl.style.display  = "none";
    placeholder.style.display = "flex";
    setStatus("❌ 產生失敗：" + err.message, true);
  } finally {
    btnGenerate.disabled = false;
  }
}

// ── 圓形照片 ──────────────────────────────────────────
function drawCirclePhoto(img, { x, y, radius }) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.clip();

  // 等比例置中裁切
  const size = radius * 2;
  const scale = Math.max(size / img.width, size / img.height);
  const sw = img.width  * scale;
  const sh = img.height * scale;
  ctx.drawImage(img, x - sw / 2, y - sh / 2, sw, sh);
  ctx.restore();

  // 圓形邊框（可依模板顏色調整）
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(255,255,255,0.6)";
  ctx.lineWidth   = 4;
  ctx.stroke();
  ctx.restore();
}

function drawCirclePlaceholder({ x, y, radius }, name) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fillStyle = "#cccccc";
  ctx.fill();

  ctx.font         = `700 ${radius * 0.7}px "${FONT_FAMILY}", sans-serif`;
  ctx.fillStyle    = "#ffffff";
  ctx.textAlign    = "center";
  ctx.textBaseline = "middle";
  ctx.fillText((name || "?")[0], x, y);
  ctx.restore();
}

// ── 下載 ─────────────────────────────────────────────
btnDownload.addEventListener("click", () => {
  const name   = selAgent?.name   || "業務";
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
