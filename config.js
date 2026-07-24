// ============================================================
//  config.js — 套圖工具模板設定（由管理者工具產生）
// ============================================================

const TEMPLATES = {

  A: {
    label: "第二季戰報",
    file: "templates/template_a.jpg",

    photo: {
      x: 0.5958,
      y: 0.2865,
      width: 0.4017,
      height: 0.5423,
      fit: "contain",
    },

    name: {
      x: 0.6702,
      y: 0.7894,
      size: 0.07,
      weight: "700",
      color: "#1A3A6B",
      strokeColor: "#FFFFFF",
      strokeWidth: 0.0058,
      glow: false,
      align: "left",
      letterSpacing: 0.04,
      maxWidth: 0.2692,
      width: 0.3439,
      height: 0.1281,
    },

    phone: {
      x: 0.4888,
      y: 0.9036,
      size: 0.07,
      weight: "700",
      color: "#1A3A6B",
      strokeColor: "#FFFFFF",
      strokeWidth: 0.0058,
      glow: false,
      align: "left",
      letterSpacing: 0,
      width: 0.4454,
      height: 0.1235,
    },

    brand: null,

    branch: null,

  },

  B: {
    label: "居家防颱宣導",
    file: "templates/template_b.jpg",

    photo: {
      x: 0.7058,
      y: 0.5865,
      width: 0.2942,
      height: 0.4135,
      fit: "contain",
    },

    name: {
      x: 0.4904,
      y: 0.8077,
      size: 0.0365,
      weight: "700",
      color: "#1A3A6B",
      strokeColor: "#FFFFFF",
      strokeWidth: 0.0058,
      glow: false,
      align: "left",
      letterSpacing: 0.0192,
      maxWidth: 0.2692,
    },

    phone: {
      x: 0.4904,
      y: 0.8702,
      size: 0.0365,
      weight: "700",
      color: "#1A3A6B",
      strokeColor: "#FFFFFF",
      strokeWidth: 0.0058,
      glow: false,
      align: "left",
      letterSpacing: 0,
    },

    brand: {
      x: 0.0587,
      y: 0.7212,
      width: 0.3846,
      height: null,
    },

    branch: {
      x: 0.251,
      y: 0.875,
      size: 0.0365,
      weight: "700",
      color: "#1A3A6B",
      strokeColor: "#FFFFFF",
      strokeWidth: 0.0058,
      glow: false,
      align: "center",
      letterSpacing: 0,
    },

  },

  C: {
    label: "不動產安全",
    file: "templates/template_c.jpg",

    photo: {
      x: 0.7058,
      y: 0.5865,
      width: 0.2942,
      height: 0.4135,
      fit: "contain",
    },

    name: {
      x: 0.4904,
      y: 0.8077,
      size: 0.0365,
      weight: "700",
      color: "#1A3A6B",
      strokeColor: "#FFFFFF",
      strokeWidth: 0.0058,
      glow: false,
      align: "left",
      letterSpacing: 0.0192,
      maxWidth: 0.2692,
    },

    phone: {
      x: 0.4904,
      y: 0.8702,
      size: 0.0365,
      weight: "700",
      color: "#1A3A6B",
      strokeColor: "#FFFFFF",
      strokeWidth: 0.0058,
      glow: false,
      align: "left",
      letterSpacing: 0,
    },

    brand: {
      x: 0.0653,
      y: 0.8027,
      width: 0.3455,
      height: 0.0981,
    },

    branch: null,

  },

  D: {
    label: "青安3.0",
    file: "templates/template_d.jpg",

    photo: {
      x: 0.6441,
      y: 0.0748,
      width: 0.2984,
      height: 0.261,
      fit: "contain",
    },

    name: {
      x: 0.8054,
      y: 0.3128,
      size: 0.0365,
      weight: "700",
      color: "#1A3A6B",
      strokeColor: "#FFFFFF",
      strokeWidth: 0.0058,
      glow: false,
      align: "center",
      letterSpacing: 0.0192,
      maxWidth: 0.2692,
      width: 0.2771,
      height: 0.0609,
    },

    phone: {
      x: 0.8255,
      y: 0.3685,
      size: 0.0365,
      weight: "700",
      color: "#1A3A6B",
      strokeColor: "#FFFFFF",
      strokeWidth: 0.0058,
      glow: false,
      align: "center",
      letterSpacing: 0,
      width: 0.3671,
      height: 0.0584,
    },

    brand: {
      x: 0.6337,
      y: 0.0134,
      width: 0.3155,
      height: 0.0624,
    },

    branch: {
      x: 0.536,
      y: 0.3677,
      size: 0.03,
      weight: "700",
      color: "#1A3A6B",
      strokeColor: "#FFFFFF",
      strokeWidth: 0.0058,
      glow: false,
      align: "center",
      letterSpacing: 0,
      width: 0.2132,
      height: 0.0562,
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
