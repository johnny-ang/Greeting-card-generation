// overlay.js — 套圖工具主邏輯 v3（矩形照片 + letterSpacing + maxWidth）

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

// ── 產生賀卡 ──────────────────────────────────────────
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

    // 照片（矩形）
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

    // 文字欄位
    const fields = [
      { cfg: tmpl.name,   text: selAgent.name   || "" },
      { cfg: tmpl.phone,  text: selAgent.phone  || "" },
      { cfg: tmpl.branch, text: selAgent.branch || "" },
    ];

    fields.forEach(({ cfg, text }) => {
      if (!cfg || !text) return;
      drawText(cfg, text);
    });

    loadingEl.style.display   = "none";
    canvas.style.display      = "block";
    btnDownload.style.display = "block";
    cacheCanvasResult(); // iOS 預先快取 dataUrl
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

// ── 文字繪製（支援 letterSpacing + maxWidth + stroke）─
function drawText(cfg, text) {
  const {
    x, y, size, weight, color,
    strokeColor = null,
    strokeWidth = 0,
    align = "center",
    letterSpacing = 0,
    maxWidth = null,
  } = cfg;

  ctx.save();
  ctx.font         = `${weight} ${size}px "${FONT_FAMILY}", "Noto Sans TC", sans-serif`;
  ctx.textBaseline = "middle";

  if (strokeColor && strokeWidth > 0) {
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth   = strokeWidth * 2;
    ctx.lineJoin    = "round";
  }

  if (letterSpacing === 0) {
    ctx.textAlign = align;
    // 先畫框線，再畫填色（確保框線在底層）
    if (strokeColor && strokeWidth > 0) {
      if (maxWidth) ctx.strokeText(text, x, y, maxWidth);
      else          ctx.strokeText(text, x, y);
    }
    ctx.fillStyle = color;
    if (maxWidth) ctx.fillText(text, x, y, maxWidth);
    else          ctx.fillText(text, x, y);

  } else {
    // 逐字繪製（letterSpacing 模式）
    const chars = [...text];
    const charWidths = chars.map(ch => ctx.measureText(ch).width);
    const totalWidth = charWidths.reduce((a, b) => a + b, 0)
                     + letterSpacing * (chars.length - 1);

    let scale = 1;
    if (maxWidth && totalWidth > maxWidth) {
      scale = maxWidth / totalWidth;
    }

    let startX;
    if (align === "center") {
      startX = x - (totalWidth * scale) / 2;
    } else if (align === "right") {
      startX = x - totalWidth * scale;
    } else {
      startX = x;
    }

    ctx.textAlign = "left";

    // 先全部畫框線
    if (strokeColor && strokeWidth > 0) {
      let curX = startX;
      chars.forEach((ch, i) => {
        ctx.save();
        ctx.translate(curX, y);
        if (scale !== 1) ctx.scale(scale, 1);
        ctx.strokeText(ch, 0, 0);
        ctx.restore();
        curX += (charWidths[i] + letterSpacing) * scale;
      });
    }

    // 再全部畫填色
    ctx.fillStyle = color;
    let curX = startX;
    chars.forEach((ch, i) => {
      ctx.save();
      ctx.translate(curX, y);
      if (scale !== 1) ctx.scale(scale, 1);
      ctx.fillText(ch, 0, 0);
      ctx.restore();
      curX += (charWidths[i] + letterSpacing) * scale;
    });
  }

  ctx.restore();
}

// ── 矩形照片 ─────────────────────────────────────────
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
// iOS 專用：產生完圖後預先存好 dataUrl，點擊時直接跳轉
let _cachedDataUrl = null;

function cacheCanvasResult() {
  _cachedDataUrl = canvas.toDataURL("image/png");
}

btnDownload.addEventListener("click", () => {
  const name   = selAgent?.name || "業務";
  const tmplLb = TEMPLATES[selTemplate]?.label || selTemplate;

  // 優先用快取（iOS 需要在點擊瞬間同步執行）
  const dataUrl = _cachedDataUrl || canvas.toDataURL("image/png");

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  if (isIOS) {
    // iOS：直接在同一頁顯示圖片，使用者長按儲存
    const w = window.open("", "_blank");
    if (w) {
      w.document.write(
        "<html><head>" +
        "<title>" + name + "_" + tmplLb + "</title>" +
        "<meta name='viewport' content='width=device-width,initial-scale=1'>" +
        "<style>body{margin:0;background:#111;text-align:center;padding:20px}" +
        "img{max-width:100%;border-radius:8px}" +
        "p{color:#fff;font-size:15px;margin-top:16px;font-family:sans-serif}</style>" +
        "</head><body>" +
        "<img src='" + dataUrl + "'>" +
        "<p>長按圖片 → 儲存到相片</p>" +
        "</body></html>"
      );
      w.document.close();
    } else {
      // 彈窗被封鎖：直接換頁到圖片
      document.location.href = dataUrl;
    }
    return;
  }

  // Android / 電腦：正常下載
  const link = document.createElement("a");
  link.download = name + "_" + tmplLb + ".png";
  link.href     = dataUrl;
  link.click();
});

// ── 工具函式 ──────────────────────────────────────────

// Google Drive 連結轉成 thumbnail 格式（較少跨域限制）
function normalizeDriveUrl(url) {
  if (!url) return url;
  const ucMatch = url.match(/uc\?(?:export=view&)?id=([a-zA-Z0-9_-]+)/);
  if (ucMatch) {
    return `https://drive.google.com/thumbnail?id=${ucMatch[1]}&sz=w800`;
  }
  const fileMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) {
    return `https://drive.google.com/thumbnail?id=${fileMatch[1]}&sz=w800`;
  }
  return url;
}

function loadImage(src) {
  const url = normalizeDriveUrl(src);
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload  = () => resolve(img);
    img.onerror = () => {
      // 第一次失敗：嘗試加時間戳繞過快取
      const img2 = new Image();
      img2.onload  = () => resolve(img2);
      img2.onerror = () => reject(new Error("照片載入失敗，請確認 Google Drive 共用權限為「知道連結的人」"));
      img2.src = url + (url.includes("?") ? "&t=" : "?t=") + Date.now();
    };
    img.src = url;
  });
}

function setStatus(msg, isError = false) {
  statusBar.textContent = msg;
  statusBar.className   = isError ? "error" : "";
}
