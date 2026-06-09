// ============================================================
//  config.js — 套圖工具模板設定 v3
//  letterSpacing: 文字間距（px），套用於 name / phone / branch
//  phone.align = "left"，x 與 photo 左邊緣對齊
//  branch.weight = "700"（粗體）
// ============================================================

const TEMPLATES = {

  A: {
    label: "模板 A",
    file: "templates/template_a.jpg",

    photo: {
      x: 30,
      y: 40,
      width: 390,
      height: 620,
    },

    name: {
      x: 215,           // photo 中心（30 + 390/2）
      y: 720,
      size: 85,
      weight: "700",
      color: "#FFFFFF",
      align: "center",
      letterSpacing: 8, // 字間距 px，超出 photo 寬度會自動縮放
      maxWidth: 390,    // 不超過 photo 寬度
    },

    phone: {
      x: 30,            // 與 photo 左邊緣對齊
      y: 820,
      size: 60,
      weight: "400",
      color: "#FFFFFF",
      align: "left",
      letterSpacing: 6,
    },

    branch: {
      x: 700,           // 底部黃條右側灰框中心（上傳後依實際調整）
      y: 975,           // 與左側 logo 同 y 軸（上傳後依實際調整）
      size: 48,
      weight: "700",    // 改為粗體
      color: "#333333",
      align: "center",
      letterSpacing: 4,
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
      size: 85,
      weight: "700",
      color: "#FFFFFF",
      align: "center",
      letterSpacing: 8,
      maxWidth: 390,
    },

    phone: {
      x: 30,
      y: 820,
      size: 60,
      weight: "400",
      color: "#FFFFFF",
      align: "left",
      letterSpacing: 6,
    },

    branch: {
      x: 700,
      y: 975,
      size: 48,
      weight: "700",
      color: "#333333",
      align: "center",
      letterSpacing: 4,
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
      size: 85,
      weight: "700",
      color: "#FFFFFF",
      align: "center",
      letterSpacing: 8,
      maxWidth: 390,
    },

    phone: {
      x: 30,
      y: 820,
      size: 60,
      weight: "400",
      color: "#FFFFFF",
      align: "left",
      letterSpacing: 6,
    },

    branch: {
      x: 700,
      y: 975,
      size: 48,
      weight: "700",
      color: "#333333",
      align: "center",
      letterSpacing: 4,
    },
  },

};

const API_URL = "https://script.google.com/macros/s/AKfycbw-yw0sqW_PHb0AAEBGDEE1rB5kxxIVSLETWjjLVKnLmn0OZQ-zPn6y6-kBXHVtQvuf/exec";
const FONT_FAMILY = "Jf Open粉圓";
