// ============================================================
//  config.js — 套圖工具模板設定（由管理者工具產生）
// ============================================================

const TEMPLATES = {

  A: {
    label: "上半年戰報",
    file: "templates/template_a.jpg",

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
      y: 750,
      width: 400,
      height: null,
    },

    branch: {
      x: 261,
      y: 910,
      size: 38,
      weight: "700",
      color: "#1A3A6B",
      strokeColor: "#FFFFFF",
      strokeWidth: 6,
      glow: false,
      align: "center",
      letterSpacing: 0,
    },

  },

  B: {
    label: "防颱安全宣導",
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

    brand: {
      x: 61,
      y: 750,
      width: 400,
      height: null,
    },

    branch: {
      x: 261,
      y: 910,
      size: 38,
      weight: "700",
      color: "#1A3A6B",
      strokeColor: "#FFFFFF",
      strokeWidth: 6,
      glow: false,
      align: "center",
      letterSpacing: 0,
    },

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
      y: 859,
      width: 400,
      height: null,
    },

    branch: null,

  },

  D: {
    label: "永慶金獎肯定",
    file: "templates/template_d.jpg",

    photo: {
      x: 684,
      y: 90,
      width: 281,
      height: 328,
      fit: "contain",
    },

    name: {
      x: 395,
      y: 335,
      size: 38,
      weight: "700",
      color: "#1A3A6B",
      strokeColor: "#FFFFFF",
      strokeWidth: 6,
      glow: false,
      align: "left",
      letterSpacing: 20,
      maxWidth: 280,
      width: 228,
      height: 71,
    },

    phone: {
      x: 647,
      y: 336,
      size: 38,
      weight: "700",
      color: "#1A3A6B",
      strokeColor: "#FFFFFF",
      strokeWidth: 6,
      glow: false,
      align: "left",
      letterSpacing: 0,
      width: 349,
      height: 70,
    },

    brand: {
      x: 671,
      y: 18,
      width: 316,
      height: 79,
    },

    branch: {
      x: 642,
      y: 255,
      size: 38,
      weight: "700",
      color: "#1A3A6B",
      strokeColor: "#FFFFFF",
      strokeWidth: 6,
      glow: false,
      align: "center",
      letterSpacing: 0,
      width: 364,
      height: 75,
    },

  },

};

const API_URL = "https://script.google.com/macros/s/AKfycbw-yw0sqW_PHb0AAEBGDEE1rB5kxxIVSLETWjjLVKnLmn0OZQ-zPn6y6-kBXHVtQvuf/exec";
const FONT_FAMILY = "Jf Open粉圓";

// 品牌 Logo 對照表
const BRAND_LOGOS = {
  "永慶不動產": "https://lh3.googleusercontent.com/d/1LcuW_637pHoTXDPW23Rk7UYZSjunWlA0",
  "永義房屋": "https://lh3.googleusercontent.com/d/1EFqWLqVE69s1yANFGcWauNjkCGtiI5Vc"
};
