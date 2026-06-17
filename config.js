// ============================================================
//  config.js — 套圖工具模板設定 v4
// ============================================================

const TEMPLATES = {

  A: {
    label: "永慶不動產",
    file: "templates/template_a.jpg",

    photo: {
      x: 130,
      y: 40,
      width: 390,
      height: 620,
    },

    name: {
      x: 315,
      y: 720,
      size: 85,
      weight: "700",
      color: "#FFFFFF",
      strokeColor: "#444444",
      strokeWidth: 12,
      align: "center",
      letterSpacing: 8,
      maxWidth: 390,
    },

    phone: {
      x: 130,
      y: 820,
      size: 60,
      weight: "700",
      color: "#FFFFFF",
      strokeColor: "#444444",
      strokeWidth: 10,
      align: "left",
      letterSpacing: 6,
    },

    branch: {
      x: 700,
      y: 970,
      size: 48,
      weight: "700",
      color: "#FFFFFF",
      strokeColor: "#444444",
      strokeWidth: 8,
      align: "center",
      letterSpacing: 4,
    },
  },

  B: {
    label: "永義房屋",
    file: "templates/template_b.jpg",

    photo: {
      x: 130,
      y: 40,
      width: 390,
      height: 620,
    },

    name: {
      x: 315,
      y: 720,
      size: 85,
      weight: "700",
      color: "#FFFFFF",
      strokeColor: "#444444",
      strokeWidth: 12,
      align: "center",
      letterSpacing: 8,
      maxWidth: 390,
    },

    phone: {
      x: 130,
      y: 820,
      size: 60,
      weight: "700",
      color: "#FFFFFF",
      strokeColor: "#444444",
      strokeWidth: 10,
      align: "left",
      letterSpacing: 6,
    },

    branch: {
      x: 700,
      y: 970,
      size: 48,
      weight: "700",
      color: "#FFFFFF",
      strokeColor: "#444444",
      strokeWidth: 8,
      align: "center",
      letterSpacing: 4,
    },
  },

  C: {
    label: "喆禮團隊",
    file: "templates/template_c.jpg",

    photo: {
      x: 130,
      y: 40,
      width: 390,
      height: 620,
    },

    name: {
      x: 315,
      y: 720,
      size: 85,
      weight: "700",
      color: "#FFFFFF",
      strokeColor: "#444444",
      strokeWidth: 12,
      align: "center",
      letterSpacing: 8,
      maxWidth: 390,
    },

    phone: {
      x: 130,
      y: 820,
      size: 60,
      weight: "700",
      color: "#FFFFFF",
      strokeColor: "#444444",
      strokeWidth: 10,
      align: "left",
      letterSpacing: 6,
    },

    branch: {
      x: 700,
      y: 970,
      size: 48,
      weight: "700",
      color: "#FFFFFF",
      strokeColor: "#444444",
      strokeWidth: 8,
      align: "center",
      letterSpacing: 4,
    },
  },

  D: {
    label: "新青安2.0",
    file: "templates/template_d.jpg",

    photo: {
      x: 700,
      y: 640,        // 1040 - 400 = 640，貼合底線
      width: 340,
      height: 400,
    },

    name: {
      x: 510,
      y: 830,
      size: 38,
      weight: "700",
      color: "#1A3A6B",
      strokeColor: "#FFFFFF",
      strokeWidth: 8,
      align: "left",
      letterSpacing: 10,
      maxWidth: 280,
    },

    phone: {
      x: 510,
      y: 890,
      size: 38,
      weight: "700",
      color: "#1A3A6B",
      strokeColor: "#FFFFFF",
      strokeWidth: 8,
      align: "left",
      letterSpacing: 0,
    },

    branch: null,    // 此模板不套入 branch
  },

};

const API_URL = "https://script.google.com/macros/s/AKfycbw-yw0sqW_PHb0AAEBGDEE1rB5kxxIVSLETWjjLVKnLmn0OZQ-zPn6y6-kBXHVtQvuf/exec";
const FONT_FAMILY = "Jf Open粉圓";
