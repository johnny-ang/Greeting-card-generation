// ============================================================
//  config.js — 套圖工具模板設定
//  每張模板獨立設定座標、字體大小、顏色、字重
//  座標單位：像素（以 1040×1040 底圖為基準）
// ============================================================

const TEMPLATES = {

  A: {
    label: "模板 A",
    file: "templates/template_a.jpg",   // 底圖路徑（相對於 overlay.html）

    photo: {
      x: 520,        // 圓形中心 X
      y: 300,        // 圓形中心 Y
      radius: 120,   // 圓形半徑（px）
    },

    name: {
      x: 520,        // 文字中心 X（text-anchor: center）
      y: 520,        // 文字基線 Y
      size: 52,      // 字體大小（px）
      weight: "700", // "400" = Regular, "700" = Bold
      color: "#FFFFFF",
    },

    phone: {
      x: 520,
      y: 590,
      size: 34,
      weight: "400",
      color: "#FFFFFF",
    },

    brand: {
      x: 520,
      y: 660,
      size: 28,
      weight: "400",
      color: "#FFEEAA",
    },

    branch: {
      x: 520,
      y: 700,
      size: 24,
      weight: "400",
      color: "#FFEEAA",
    },
  },

  B: {
    label: "模板 B",
    file: "templates/template_b.jpg",

    photo: {
      x: 200,
      y: 520,
      radius: 140,
    },

    name: {
      x: 600,
      y: 440,
      size: 56,
      weight: "700",
      color: "#1A1A2E",
    },

    phone: {
      x: 600,
      y: 510,
      size: 36,
      weight: "400",
      color: "#1A1A2E",
    },

    brand: {
      x: 600,
      y: 570,
      size: 28,
      weight: "400",
      color: "#4A4A6A",
    },

    branch: {
      x: 600,
      y: 610,
      size: 24,
      weight: "400",
      color: "#4A4A6A",
    },
  },

  C: {
    label: "模板 C",
    file: "templates/template_c.jpg",

    photo: {
      x: 520,
      y: 220,
      radius: 100,
    },

    name: {
      x: 520,
      y: 400,
      size: 48,
      weight: "700",
      color: "#2D2D2D",
    },

    phone: {
      x: 520,
      y: 460,
      size: 32,
      weight: "400",
      color: "#2D2D2D",
    },

    brand: {
      x: 520,
      y: 520,
      size: 26,
      weight: "400",
      color: "#888888",
    },

    branch: {
      x: 520,
      y: 556,
      size: 22,
      weight: "400",
      color: "#888888",
    },
  },

};

// API 網址（不需修改）
const API_URL = "https://script.google.com/macros/s/AKfycbw-yw0sqW_PHb0AAEBGDEE1rB5kxxIVSLETWjjLVKnLmn0OZQ-zPn6y6-kBXHVtQvuf/exec";

// 字體（不需修改）
const FONT_FAMILY = "Jf Open粉圓";
const FONT_URL    = "https://fonts.googleapis.com/css2?family=Jf+Open+Maozi:wght@400;700&display=swap";
