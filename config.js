// ============================================================
//  config.js — 套圖工具模板設定 v2
//  照片區域改為矩形（x, y, width, height）
//  座標單位：像素（以 1040×1040 底圖為基準）
//  文字 align 可設 "left" / "center" / "right"
// ============================================================

const TEMPLATES = {

  A: {
    label: "模板 A",
    file: "templates/template_a.jpg",

    // 矩形照片：左上角座標 + 寬高
    photo: {
      x: 30,        // 白框左邊緣
      y: 40,        // 白框上邊緣
      width: 390,   // 白框寬度
      height: 620,  // 白框高度
    },

    name: {
      x: 215,       // 文字水平中心（白框中心）
      y: 720,       // 文字垂直中心
      size: 72,
      weight: "700",
      color: "#FFFFFF",
      align: "center",
    },

    phone: {
      x: 520,       // 電話橫跨全寬，置中
      y: 820,
      size: 60,
      weight: "400",
      color: "#FFFFFF",
      align: "center",
    },

    branch: {
      x: 700,       // 底部黃條右側灰框中心
      y: 975,
      size: 48,
      weight: "400",
      color: "#333333",
      align: "center",
    },
  },

  B: {
    label: "模板 B",
    file: "templates/template_b.jpg",

    photo: {
      x: 30,
      y: 40,
      width: 390,
      height: 620,
    },

    name: {
      x: 215,
      y: 720,
      size: 72,
      weight: "700",
      color: "#FFFFFF",
      align: "center",
    },

    phone: {
      x: 520,
      y: 820,
      size: 60,
      weight: "400",
      color: "#FFFFFF",
      align: "center",
    },

    branch: {
      x: 700,
      y: 975,
      size: 48,
      weight: "400",
      color: "#333333",
      align: "center",
    },
  },

  C: {
    label: "模板 C",
    file: "templates/template_C.png",

    photo: {
      x: 30,
      y: 40,
      width: 390,
      height: 620,
    },

    name: {
      x: 215,
      y: 720,
      size: 72,
      weight: "700",
      color: "#FFFFFF",
      align: "center",
    },

    phone: {
      x: 520,
      y: 820,
      size: 60,
      weight: "400",
      color: "#FFFFFF",
      align: "center",
    },

    branch: {
      x: 700,
      y: 975,
      size: 48,
      weight: "400",
      color: "#333333",
      align: "center",
    },
  },

};

// API 網址
const API_URL = "https://script.google.com/macros/s/AKfycbw-yw0sqW_PHb0AAEBGDEE1rB5kxxIVSLETWjjLVKnLmn0OZQ-zPn6y6-kBXHVtQvuf/exec";

// 字體
const FONT_FAMILY = "Jf Open粉圓";
