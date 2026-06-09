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
  // Line 環境：顯示全螢幕引導，阻止繼續使用
  if (isLineBrowser()) {
    showLineBlockScreen();
    return; // 不初始化工具
  }
  buildTemplatePicker();
  await loadAgents();
})();

// ── Line 內建瀏覽器偵測 ───────────────────────────────
function isLineBrowser() {
  return /Line\//.test(navigator.userAgent);
}

function showLineBlockScreen() {
  const currentUrl = location.href;
  const isAndroid  = /Android/.test(navigator.userAgent);
  const isIOS      = /iPad|iPhone|iPod/.test(navigator.userAgent);

  // ── 嘗試直接喚起外部瀏覽器 ──────────────────────────
  if (isAndroid) {
    // Android：intent scheme 喚起 Chrome
    const intent = "intent://" + currentUrl.replace(/^https?:\/\//, "") +
      "#Intent;scheme=https;package=com.android.chrome;end";
    setTimeout(() => { location.href = intent; }, 100);
  } else if (isIOS) {
    // iOS：嘗試 Chrome，失敗後嘗試 Safari（Safari 無需特殊 scheme）
    const chromeUrl = currentUrl.replace(/^https/, "googlechrome")
                                .replace(/^http/, "googlechrome");
    setTimeout(() => { location.href = chromeUrl; }, 100);
  }

  // ── 顯示備用引導畫面（跳轉失敗或未安裝時看到）────────
  const screen = document.createElement("div");
  screen.id = "line-block-screen";
  screen.style.cssText = [
    "position:fixed", "inset:0", "background:#fff", "z-index:99999",
    "display:flex", "flex-direction:column", "align-items:center",
    "justify-content:center", "padding:32px 24px",
    "box-sizing:border-box", "text-align:center", "font-family:sans-serif"
  ].join(";");

  // 按鈕區：依裝置顯示對應選項
  const btnAndroid = isAndroid ? [
    "<button onclick="location.href='intent://" + currentUrl.replace(/^https?:\/\//, "") +
    "#Intent;scheme=https;package=com.android.chrome;end'" ",
    "style='width:100%;padding:14px;border:none;border-radius:12px;",
    "background:#1A73E8;color:#fff;font-size:15px;font-weight:700;",
    "cursor:pointer;margin-bottom:10px'>",
    "🔵 用 Chrome 開啟</button>"
  ].join("") : "";

  const btnIOS = isIOS ? [
    "<button onclick="location.href='" + currentUrl.replace(/^https/, "googlechrome").replace(/^http/, "googlechrome") + "'" ",
    "style='width:100%;padding:14px;border:none;border-radius:12px;",
    "background:#1A73E8;color:#fff;font-size:15px;font-weight:700;",
    "cursor:pointer;margin-bottom:10px'>",
    "🔵 用 Chrome 開啟</button>",
    "<button onclick="location.href='" + currentUrl.replace(/^https/, "x-web-search") + "'" ",
    "style='width:100%;padding:14px;border:none;border-radius:12px;",
    "background:#000;color:#fff;font-size:15px;font-weight:700;cursor:pointer'>",
    "⚫ 用 Safari 開啟</button>"
  ].join("") : "";

  const btnFallback = (!isAndroid && !isIOS) ? "" : "";

  screen.innerHTML = [
    "<div style='font-size:52px;margin-bottom:14px'>🌐</div>",
    "<h1 style='font-size:20px;font-weight:700;color:#1c1c1e;margin:0 0 8px'>正在開啟瀏覽器…</h1>",
    "<p style='font-size:14px;color:#777;line-height:1.6;margin:0 0 24px'>",
    "若未自動跳轉，請點下方按鈕<br>或手動選擇「用瀏覽器開啟」</p>",
    "<div style='width:100%;max-width:300px;margin-bottom:20px'>",
    btnAndroid, btnIOS, btnFallback,
    "</div>",
    "<div style='background:#f5f5f5;border-radius:12px;padding:16px 20px;",
    "text-align:left;width:100%;max-width:300px;box-sizing:border-box'>",
    "<p style='margin:0;font-size:13px;line-height:2;color:#555'>",
    "手動方式：點右上角 <b>「···」</b><br>→ 選 <b>「用瀏覽器開啟」</b></p>",
    "</div>"
  ].join("");

  document.body.appendChild(screen);
}

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
        const photo = await loadPhotoImage(selAgent.photo_url);
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
let _cachedDataUrl = null;

function cacheCanvasResult() {
  _cachedDataUrl = canvas.toDataURL("image/png");
}

// iOS 長按遮罩層（建立一次，重複使用）
function createIOSOverlay() {
  if (document.getElementById("ios-save-overlay")) return;

  const overlay = document.createElement("div");
  overlay.id = "ios-save-overlay";
  overlay.style.cssText = [
    "display:none",
    "position:fixed",
    "inset:0",
    "background:rgba(0,0,0,0.92)",
    "z-index:9999",
    "flex-direction:column",
    "align-items:center",
    "justify-content:center",
    "padding:20px",
    "box-sizing:border-box"
  ].join(";");

  const hint = document.createElement("p");
  hint.textContent = "👆 長按圖片，選擇「儲存圖片」或「下載圖片」";
  hint.style.cssText = "color:#fff;font-size:16px;margin:0 0 16px;font-family:sans-serif;text-align:center";

  const img = document.createElement("img");
  img.id = "ios-save-img";
  img.style.cssText = "max-width:100%;max-height:75vh;border-radius:8px;display:block";

  const closeBtn = document.createElement("button");
  closeBtn.textContent = "✕ 關閉";
  closeBtn.style.cssText = [
    "margin-top:20px",
    "padding:10px 28px",
    "border:1.5px solid rgba(255,255,255,0.4)",
    "border-radius:8px",
    "background:transparent",
    "color:#fff",
    "font-size:15px",
    "cursor:pointer"
  ].join(";");
  closeBtn.addEventListener("click", () => {
    overlay.style.display = "none";
  });

  overlay.appendChild(hint);
  overlay.appendChild(img);
  overlay.appendChild(closeBtn);
  document.body.appendChild(overlay);
}

btnDownload.addEventListener("click", () => {
  const name    = selAgent?.name || "業務";
  const tmplLb  = TEMPLATES[selTemplate]?.label || selTemplate;
  const dataUrl = _cachedDataUrl || canvas.toDataURL("image/png");
  const ua      = navigator.userAgent;

  // Line 內建瀏覽器：顯示引導 modal，要求用外部瀏覽器開啟
  if (isLineBrowser()) {
    showLineGuideModal();
    return;
  }

  // iOS Safari
  const isIOS = /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
  if (isIOS) {
    createIOSOverlay();
    document.getElementById("ios-save-img").src = dataUrl;
    document.getElementById("ios-save-overlay").style.display = "flex";
    return;
  }

  // 一般瀏覽器
  const link = document.createElement("a");
  link.download = name + "_" + tmplLb + ".png";
  link.href     = dataUrl;
  link.click();
});

function showLineGuideModal() {
  // 建立引導 modal
  if (document.getElementById("line-guide-modal")) {
    document.getElementById("line-guide-modal").style.display = "flex";
    return;
  }

  const modal = document.createElement("div");
  modal.id = "line-guide-modal";
  modal.style.cssText = [
    "display:flex",
    "position:fixed",
    "inset:0",
    "background:rgba(0,0,0,0.85)",
    "z-index:9999",
    "flex-direction:column",
    "align-items:center",
    "justify-content:center",
    "padding:24px",
    "box-sizing:border-box",
    "text-align:center"
  ].join(";");

  modal.innerHTML = [
    "<div style='background:#fff;border-radius:16px;padding:28px 24px;max-width:320px;width:100%'>",
    "<div style='font-size:40px;margin-bottom:12px'>🌐</div>",
    "<h2 style='font-size:18px;margin:0 0 12px;color:#1c1c1e;font-family:sans-serif'>請用瀏覽器開啟</h2>",
    "<p style='font-size:14px;color:#555;line-height:1.6;margin:0 0 20px;font-family:sans-serif'>",
    "Line 內建瀏覽器不支援圖片下載<br>請依以下步驟操作：</p>",
    "<div style='background:#f5f5f5;border-radius:10px;padding:14px;margin-bottom:20px;text-align:left'>",
    "<p style='margin:0;font-size:14px;font-family:sans-serif;line-height:2;color:#333'>",
    "① 點右上角 <b>「···」</b><br>",
    "② 選擇 <b>「用瀏覽器開啟」</b><br>",
    "③ 再次點擊「下載賀卡」",
    "</p></div>",
    "<button id='line-guide-close' style='width:100%;padding:12px;border:none;border-radius:10px;",
    "background:#06C755;color:#fff;font-size:15px;font-weight:700;cursor:pointer;font-family:sans-serif'>",
    "我知道了</button>",
    "</div>"
  ].join("");

  document.body.appendChild(modal);

  document.getElementById("line-guide-close").addEventListener("click", () => {
    modal.style.display = "none";
  });
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
  });
}

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

// 載入底圖（本地路徑，不需轉換）
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload  = () => resolve(img);
    img.onerror = () => reject(new Error("底圖載入失敗：" + src));
    img.src = src;
  });
}

// 載入業務照片：依序嘗試多種 URL 格式
function loadPhotoImage(src) {
  function extractId(url) {
    const m1 = url.match(/[/]d[/]([a-zA-Z0-9_-]+)/);
    if (m1) return m1[1];
    const m2 = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (m2) return m2[1];
    return null;
  }

  const fileId = extractId(src);
  const candidates = fileId ? [
    "https://lh3.googleusercontent.com/d/" + fileId,
    "https://drive.google.com/thumbnail?id=" + fileId + "&sz=w800",
    "https://drive.google.com/uc?export=view&id=" + fileId,
  ] : [src];

  function tryNext(list) {
    if (!list.length) return Promise.reject(new Error("照片載入失敗"));
    const url = list[0];
    const remaining = list.slice(1);
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload  = () => resolve(img);
      img.onerror = () => tryNext(remaining).then(resolve).catch(reject);
      img.src = url;
    });
  }

  return tryNext(candidates);
}

function setStatus(msg, isError = false) {
  statusBar.textContent = msg;
  statusBar.className   = isError ? "error" : "";
}
