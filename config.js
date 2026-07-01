// ============================================================
//  config.js — 套圖工具模板設定 v5
// ============================================================

const TEMPLATES = {

  A: {
    label: "6月戰報",
    file: "templates/template_a.jpg",

    photo: {
      x: 734,        // 靠右貼合
      y: 610,        // 貼合底線
      width: 306,
      height: 430,
      fit: "contain",
    },

    name: {
      x: 510,
      y: 840,
      size: 38,
      weight: "700",
      color: "#1A3A6B",
      strokeColor: "#FFFFFF",
      strokeWidth: 6,
      glow: false,
      align: "left",
      letterSpacing: 20,
      maxWidth: 280,
    },

    phone: {
      x: 510,
      y: 905,
      size: 38,
      weight: "700",
      color: "#1A3A6B",
      strokeColor: "#FFFFFF",
      strokeWidth: 6,
      glow: false,
      align: "left",
      letterSpacing: 0,
    },

    branch: null,
  },

  B: {
    label: "新青安2.0",
    file: "templates/template_b.jpg",

    photo: {
      x: 734,
      y: 610,
      width: 306,
      height: 430,
      fit: "contain",
    },

    name: {
      x: 510,
      y: 840,
      size: 38,
      weight: "700",
      color: "#1A3A6B",
      strokeColor: "#FFFFFF",
      strokeWidth: 6,
      glow: false,
      align: "left",
      letterSpacing: 20,
      maxWidth: 280,
    },

    phone: {
      x: 510,
      y: 905,
      size: 38,
      weight: "700",
      color: "#1A3A6B",
      strokeColor: "#FFFFFF",
      strokeWidth: 6,
      glow: false,
      align: "left",
      letterSpacing: 0,
    },

    branch: null,
  },

  C: {
    label: "不動產安全",
    file: "templates/template_c.jpg",

    photo: {
      x: 734,
      y: 610,
      width: 306,
      height: 430,
      fit: "contain",
    },

    name: {
      x: 510,
      y: 840,
      size: 38,
      weight: "700",
      color: "#1A3A6B",
      strokeColor: "#FFFFFF",
      strokeWidth: 6,
      glow: false,
      align: "left",
      letterSpacing: 20,
      maxWidth: 280,
    },

    phone: {
      x: 510,
      y: 905,
      size: 38,
      weight: "700",
      color: "#1A3A6B",
      strokeColor: "#FFFFFF",
      strokeWidth: 6,
      glow: false,
      align: "left",
      letterSpacing: 0,
    },

    brand: {
      x: 61,
      y: 859,        // name 下緣（y=840 + 38/2 = 859）
      width: 436,
      height: 89,
    },

    branch: null,
  },

  D: {
    label: "空白版面",
    file: "templates/template_d.jpg",

    photo: {
      x: 734,
      y: 610,
      width: 306,
      height: 430,
      fit: "contain",
    },

    name: {
      x: 510,
      y: 840,
      size: 38,
      weight: "700",
      color: "#1A3A6B",
      strokeColor: "#FFFFFF",
      strokeWidth: 6,
      glow: false,
      align: "left",
      letterSpacing: 20,
      maxWidth: 280,
    },

    phone: {
      x: 510,
      y: 905,
      size: 38,
      weight: "700",
      color: "#1A3A6B",
      strokeColor: "#FFFFFF",
      strokeWidth: 6,
      glow: false,
      align: "left",
      letterSpacing: 0,
    },

    branch: null,
  },

};

const API_URL = "https://script.google.com/macros/s/AKfycbw-yw0sqW_PHb0AAEBGDEE1rB5kxxIVSLETWjjLVKnLmn0OZQ-zPn6y6-kBXHVtQvuf/exec";
const FONT_FAMILY = "Jf Open粉圓";

// 品牌 Logo 對照表（依 Google Sheets brand 欄位自動對應）
const BRAND_LOGOS = {
  "永慶不動產": "https://lh3.googleusercontent.com/d/1LcuW_637pHoTXDPW23Rk7UYZSjunWlA0",
  "永義房屋":   "https://lh3.googleusercontent.com/d/1EFqWLqVE69s1yANFGcWauNjkCGtiI5Vc",
};
// 暫存，實際改法見下方
