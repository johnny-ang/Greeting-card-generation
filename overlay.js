// overlay.js — 喆禮賀卡生成工具

// ── Line 偵測（最優先，避免後續 DOM 操作出錯）────────
function isLineBrowser() {
  return /Line\//.test(navigator.userAgent);
}

if (isLineBrowser()) {
  showLineBlockScreen();
} else {
  initTool();
}

// ── Line 引導畫面 ─────────────────────────────────────
function showLineBlockScreen() {
  const currentUrl = location.href;
  const ua         = navigator.userAgent;
  const isAndroid  = /Android/.test(ua);
  const isIOS      = /iPad|iPhone|iPod/.test(ua);

  // 嘗試自動喚起外部瀏覽器
  if (isAndroid) {
    const intent = "intent://" + currentUrl.replace(/^https?:\/\//, "") +
      "#Intent;scheme=https;package=com.android.chrome;end";
    setTimeout(function() { location.href = intent; }, 300);
  } else if (isIOS) {
    const chromeUrl = currentUrl.replace(/^https:/, "googlechrome:").replace(/^http:/, "googlechrome:");
    setTimeout(function() { location.href = chromeUrl; }, 300);
  }

  // 等 DOM 載入後再插入畫面
  document.addEventListener("DOMContentLoaded", function() {
    const wrap = document.createElement("div");
    Object.assign(wrap.style, {
      position: "fixed", inset: "0", background: "#fff", zIndex: "99999",
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", padding: "32px 24px",
      boxSizing: "border-box", textAlign: "center", fontFamily: "sans-serif"
    });

    const emoji = document.createElement("div");
    emoji.textContent = "🌐";
    emoji.style.cssText = "font-size:52px;margin-bottom:14px";

    const title = document.createElement("h1");
    title.textContent = "正在開啟瀏覽器…";
    title.style.cssText = "font-size:20px;font-weight:700;color:#1c1c1e;margin:0 0 8px";

    const desc = document.createElement("p");
    desc.innerHTML = "若未自動跳轉，請點下方按鈕<br>或手動選擇「用瀏覽器開啟」";
    desc.style.cssText = "font-size:14px;color:#777;line-height:1.6;margin:0 0 24px";

    const btnWrap = document.createElement("div");
    btnWrap.style.cssText = "width:100%;max-width:300px;margin-bottom:20px";

    function makeBtn(text, bg, href) {
      const b = document.createElement("button");
      b.textContent = text;
      b.style.cssText = "width:100%;padding:14px;border:none;border-radius:12px;" +
        "background:" + bg + ";color:#fff;font-size:15px;font-weight:700;" +
        "cursor:pointer;margin-bottom:10px;display:block";
      b.addEventListener("click", function() { location.href = href; });
      return b;
    }

    if (isAndroid) {
      const intent = "intent://" + currentUrl.replace(/^https?:\/\//, "") +
        "#Intent;scheme=https;package=com.android.chrome;end";
      btnWrap.appendChild(makeBtn("🔵 用 Chrome 開啟", "#1A73E8", intent));
    } else if (isIOS) {
      const chromeUrl = currentUrl.replace(/^https:/, "googlechrome:").replace(/^http:/, "googlechrome:");
      btnWrap.appendChild(makeBtn("🔵 用 Chrome 開啟", "#1A73E8", chromeUrl));
      btnWrap.appendChild(makeBtn("⚫ 用 Safari 開啟", "#333", currentUrl));
    }

    const manual = document.createElement("div");
    manual.style.cssText = "background:#f5f5f5;border-radius:12px;padding:16px 20px;" +
      "text-align:left;width:100%;max-width:300px;box-sizing:border-box";
    manual.innerHTML = "<p style='margin:0;font-size:13px;line-height:2;color:#555'>" +
      "手動方式：點右上角 <b>「···」</b><br>→ 選 <b>「用瀏覽器開啟」</b></p>";

    wrap.appendChild(emoji);
    wrap.appendChild(title);
    wrap.appendChild(desc);
    wrap.appendChild(btnWrap);
    wrap.appendChild(manual);
    document.body.appendChild(wrap);
  });
}

// ── 主工具初始化 ──────────────────────────────────────
function initTool() {
  document.addEventListener("DOMContentLoaded", async function() {

    // DOM refs
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
    const ctx          = canvas.getContext("2d");

    let allAgents   = [];
    let selAgent    = null;
    let selTemplate = null;
    let cachedDataUrl = null;

    // ── 模板選擇器 ──────────────────────────────────────
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
          ph.textContent = ["🅰️","🅱️","🆎","🆔"][Object.keys(TEMPLATES).indexOf(key)];
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

    // ── 載入業務資料 ────────────────────────────────────
    async function loadAgents() {
      setStatus("載入業務資料中…");
      try {
        const res = await fetch(API_URL + "?action=getAgents", { mode: "cors" });
        if (!res.ok) throw new Error("HTTP " + res.status);
        const data = await res.json();
        allAgents = Array.isArray(data) ? data : (data.agents || []);
        setStatus("已載入 " + allAgents.length + " 位業務");
        corsNotice.style.display = "none";
      } catch (e) {
        console.error("載入業務失敗:", e);
        setStatus("業務資料載入失敗，請檢查 API", true);
        corsNotice.style.display = "block";
        allAgents = [
          { agent_id: "TEST001", name: "王小明", phone: "0912-345-678", branch: "台北信義分行", photo_url: "" },
          { agent_id: "TEST002", name: "林美華", phone: "0923-456-789", branch: "大安分行", photo_url: "" },
        ];
      }
    }

    // ── 搜尋 ────────────────────────────────────────────
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
        agentList.innerHTML = "<div class='agent-item'><div class='agent-info'><span>找不到符合的業務</span></div></div>";
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
        info.innerHTML = "<strong>" + agent.name + "</strong><span>" + agent.agent_id + " · " + (agent.phone || "") + "</span>";

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

    // ── 產生賀卡 ────────────────────────────────────────
    btnGenerate.addEventListener("click", generateImage);

    async function generateImage() {
      if (!selAgent || !selTemplate) return;
      const tmpl = TEMPLATES[selTemplate];
      btnGenerate.disabled = true;
      btnDownload.style.display = "none";
      placeholder.style.display = "none";
      loadingEl.style.display   = "flex";
      canvas.style.display      = "none";
      cachedDataUrl = null;
      setStatus("載入底圖中…");

      try {
        await document.fonts.ready;
        const bg = await loadImage(tmpl.file);
        canvas.width  = 1040;
        canvas.height = 1040;
        ctx.drawImage(bg, 0, 0, 1040, 1040);
        setStatus("套入業務資料中…");

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

        [
          { cfg: tmpl.name,   text: selAgent.name   || "" },
          { cfg: tmpl.phone,  text: selAgent.phone  || "" },
          { cfg: tmpl.branch, text: selAgent.branch || "" },
        ].forEach(({ cfg, text }) => {
          if (!cfg || !text) return;
          drawText(cfg, text);
        });

        // brand 圖片（依 agent.brand 查 BRAND_LOGOS 對照表，等比例縮放）
        if (tmpl.brand && selAgent.brand) {
          const logoUrl = BRAND_LOGOS[selAgent.brand];
          if (logoUrl) {
            try {
              const brandImg = await loadPhotoImage(logoUrl);
              const { x, y, width, height } = tmpl.brand;
              if (height === null) {
                // 依 width 等比例自動計算高度
                const scale = width / brandImg.width;
                const sw = width;
                const sh = brandImg.height * scale;
                ctx.drawImage(brandImg, x, y, sw, sh);
              } else {
                // contain 模式：等比例縮放置中
                const scale = Math.min(width / brandImg.width, height / brandImg.height);
                const sw = brandImg.width  * scale;
                const sh = brandImg.height * scale;
                const dx = x + (width  - sw) / 2;
                const dy = y + (height - sh) / 2;
                ctx.drawImage(brandImg, dx, dy, sw, sh);
              }
            } catch (e) {
              console.warn("brand logo 載入失敗:", e);
            }
          }
        }

        cachedDataUrl = canvas.toDataURL("image/png");
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

    // ── 文字繪製 ─────────────────────────────────────────
    function drawText(cfg, text) {
      const { x, y, size, weight, color,
        strokeColor = null, strokeWidth = 0,
        align = "center", letterSpacing = 0, maxWidth = null } = cfg;

      ctx.save();
      ctx.font         = weight + " " + size + "px \"" + FONT_FAMILY + "\", \"Noto Sans TC\", sans-serif";
      ctx.textBaseline = "middle";

      const hasStroke = strokeColor && strokeWidth > 0;
      const isGlow = hasStroke && strokeColor === "#FFFFFF" && cfg.glow !== false;

      if (isGlow) {
        // 白色光暈：用 shadowBlur 模擬柔和發光
        ctx.shadowColor   = "#FFFFFF";
        ctx.shadowBlur    = strokeWidth * 3;
      } else if (hasStroke) {
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth   = strokeWidth * 2;
        ctx.lineJoin    = "round";
      }

      if (letterSpacing === 0) {
        ctx.textAlign = align;
        if (hasStroke && !isGlow) ctx.strokeText(text, x, y, maxWidth || undefined);
        ctx.fillStyle = color;
        ctx.fillText(text, x, y, maxWidth || undefined);
      } else {
        const chars = [...text];
        const charWidths = chars.map(ch => ctx.measureText(ch).width);
        const totalWidth = charWidths.reduce((a, b) => a + b, 0) + letterSpacing * (chars.length - 1);
        let scale = 1;
        if (maxWidth && totalWidth > maxWidth) scale = maxWidth / totalWidth;

        let startX;
        if (align === "center") startX = x - (totalWidth * scale) / 2;
        else if (align === "right") startX = x - totalWidth * scale;
        else startX = x;

        ctx.textAlign = "left";

        if (hasStroke && !isGlow) {
          let cx = startX;
          chars.forEach((ch, i) => {
            ctx.save(); ctx.translate(cx, y);
            if (scale !== 1) ctx.scale(scale, 1);
            ctx.strokeText(ch, 0, 0); ctx.restore();
            cx += (charWidths[i] + letterSpacing) * scale;
          });
        }

        ctx.fillStyle = color;
        let cx = startX;
        chars.forEach((ch, i) => {
          ctx.save(); ctx.translate(cx, y);
          if (scale !== 1) ctx.scale(scale, 1);
          ctx.fillText(ch, 0, 0); ctx.restore();
          cx += (charWidths[i] + letterSpacing) * scale;
        });
      }
      ctx.restore();
    }

    // ── 矩形照片 ─────────────────────────────────────────
    function drawRectPhoto(img, { x, y, width, height, fit = "cover" }) {
      ctx.save();

      if (fit === "contain") {
        // 等比例縮小，完整顯示，不裁切，置中對齊
        const scale = Math.min(width / img.width, height / img.height);
        const sw = img.width  * scale;
        const sh = img.height * scale;
        const dx = x + (width  - sw) / 2;
        const dy = y + (height - sh) / 2;
        ctx.drawImage(img, dx, dy, sw, sh);
      } else {
        // cover：填滿框架（裁切）
        ctx.beginPath();
        ctx.rect(x, y, width, height);
        ctx.clip();
        const scale = Math.max(width / img.width, height / img.height);
        const sw = img.width  * scale;
        const sh = img.height * scale;
        ctx.drawImage(img, x + (width - sw) / 2, y + (height - sh) / 2, sw, sh);
      }

      ctx.restore();
    }

    function drawRectPlaceholder({ x, y, width, height }, name) {
      ctx.save();
      ctx.fillStyle = "#cccccc";
      ctx.fillRect(x, y, width, height);
      ctx.font = "700 " + Math.min(width, height) * 0.35 + "px \"" + FONT_FAMILY + "\", sans-serif";
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText((name || "?")[0], x + width / 2, y + height / 2);
      ctx.restore();
    }

    // ── 下載 ─────────────────────────────────────────────
    btnDownload.addEventListener("click", () => {
      const name    = selAgent?.name || "業務";
      const tmplLb  = TEMPLATES[selTemplate]?.label || selTemplate;
      const dataUrl = cachedDataUrl || canvas.toDataURL("image/png");
      const isIOS   = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

      if (isIOS) {
        showSaveOverlay(dataUrl);
        return;
      }

      const link = document.createElement("a");
      link.download = name + "_" + tmplLb + ".png";
      link.href     = dataUrl;
      link.click();
    });

    function showSaveOverlay(dataUrl) {
      let overlay = document.getElementById("ios-save-overlay");
      if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "ios-save-overlay";
        overlay.style.cssText = "display:none;position:fixed;inset:0;background:rgba(0,0,0,0.92);" +
          "z-index:9999;flex-direction:column;align-items:center;justify-content:center;padding:20px;box-sizing:border-box";

        const hint = document.createElement("p");
        hint.textContent = "👆 長按圖片，選擇「儲存圖片」";
        hint.style.cssText = "color:#fff;font-size:16px;margin:0 0 16px;font-family:sans-serif;text-align:center";

        const img = document.createElement("img");
        img.id = "ios-save-img";
        img.style.cssText = "max-width:100%;max-height:75vh;border-radius:8px;display:block";

        const closeBtn = document.createElement("button");
        closeBtn.textContent = "✕ 關閉";
        closeBtn.style.cssText = "margin-top:20px;padding:10px 28px;border:1.5px solid rgba(255,255,255,0.4);" +
          "border-radius:8px;background:transparent;color:#fff;font-size:15px;cursor:pointer";
        closeBtn.addEventListener("click", () => { overlay.style.display = "none"; });

        overlay.appendChild(hint);
        overlay.appendChild(img);
        overlay.appendChild(closeBtn);
        document.body.appendChild(overlay);
      }

      document.getElementById("ios-save-img").src = dataUrl;
      overlay.style.display = "flex";
    }

    // ── 圖片載入 ─────────────────────────────────────────
    function loadImage(src) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload  = () => resolve(img);
        img.onerror = () => reject(new Error("底圖載入失敗：" + src));
        img.src = src;
      });
    }

    function loadPhotoImage(src) {
      function extractId(url) {
        const m1 = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
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
        const url = list[0], rest = list.slice(1);
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload  = () => resolve(img);
          img.onerror = () => tryNext(rest).then(resolve).catch(reject);
          img.src = url;
        });
      }
      return tryNext(candidates);
    }

    function setStatus(msg, isError = false) {
      statusBar.textContent = msg;
      statusBar.className   = isError ? "error" : "";
    }

    // ── 啟動 ────────────────────────────────────────────
    buildTemplatePicker();
    await loadAgents();
  });
}
