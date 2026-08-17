// ============================================================
//  config.js — 套圖工具模板設定（由管理者工具產生）
// ============================================================

const TEMPLATES = {

  A: {
    label: "業績雙冠軍",
    file: "templates/template_a.jpg",

    photo: {
      x: 0.6824,
      y: 0.5097,
      width: 0.3118,
      height: 0.4824,
      fit: "contain",
    },

    name: {
      x: 0.4835,
      y: 0.7911,
      size: 0.05,
      weight: "700",
      color: "#000000",
      strokeColor: "#FFFFFF",
      strokeWidth: 0.0058,
      glow: false,
      align: "left",
      letterSpacing: 0.1,
      maxWidth: 0.2692,
      width: 0.3439,
      height: 0.1281,
    },

    phone: {
      x: 0.0488,
      y: 0.9002,
      size: 0.07,
      weight: "700",
      color: "#000000",
      strokeColor: "#FFFFFF",
      strokeWidth: 0.0058,
      glow: false,
      align: "left",
      letterSpacing: 0,
      width: 0.8387,
      height: 0.1235,
    },

    brand: {
      x: 0.0254,
      y: 0.686,
      width: 0.3572,
      height: 0.091,
    },

    branch: {
      x: 0.3959,
      y: 0.7783,
      size: 0.05,
      weight: "700",
      color: "#000000",
      strokeColor: "#FFFFFF",
      strokeWidth: 0.002,
      glow: false,
      align: "center",
      letterSpacing: 0.006,
      width: 0.5149,
      height: 0.0887,
    },

  },

  B: {
    label: "第二季戰報",
    file: "templates/template_b.jpg",

    photo: {
      x: 0.5108,
      y: 0.3598,
      width: 0.4851,
      height: 0.6673,
      fit: "contain",
    },

    name: {
      x: 0.6235,
      y: 0.7494,
      size: 0.07,
      weight: "700",
      color: "#000000",
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
      x: 0.4871,
      y: 0.9069,
      size: 0.07,
      weight: "700",
      color: "#000000",
      strokeColor: "#FFFFFF",
      strokeWidth: 0.0058,
      glow: false,
      align: "left",
      letterSpacing: 0,
      width: 0.4454,
      height: 0.1235,
    },

    brand: {
      x: 0.0237,
      y: 0.7127,
      width: 0.3572,
      height: 0.091,
    },

    branch: {
      x: 0.6692,
      y: 0.93,
      size: 0.05,
      weight: "700",
      color: "#000000",
      strokeColor: "#FFFFFF",
      strokeWidth: 0.002,
      glow: false,
      align: "center",
      letterSpacing: 0.006,
      width: 0.5149,
      height: 0.0887,
    },

  },

  C: {
    label: "特留份修法",
    file: "templates/template_c.jpg",

    photo: {
      x: 0.3892,
      y: 0.6081,
      width: 0.2383,
      height: 0.3107,
      fit: "contain",
    },

    name: {
      x: 0.6271,
      y: 0.7594,
      size: 0.05,
      weight: "700",
      color: "#1A3A6B",
      strokeColor: "#FFFFFF",
      strokeWidth: 0.003,
      glow: false,
      align: "left",
      letterSpacing: 0.0192,
      maxWidth: 0.2692,
      width: 0.3654,
      height: 0.081,
    },

    phone: {
      x: 0.6287,
      y: 0.8519,
      size: 0.05,
      weight: "700",
      color: "#1A3A6B",
      strokeColor: "#FFFFFF",
      strokeWidth: 0.003,
      glow: false,
      align: "left",
      letterSpacing: 0,
      width: 0.3621,
      height: 0.1002,
    },

    brand: {
      x: 0.0237,
      y: 0.7127,
      width: 0.3572,
      height: 0.091,
    },

    branch: {
      x: 0.1927,
      y: 0.8561,
      size: 0.04,
      weight: "700",
      color: "#1A3A6B",
      strokeColor: "#FFFFFF",
      strokeWidth: 0.003,
      glow: false,
      align: "center",
      letterSpacing: 0,
      width: 0.3681,
      height: 0.0661,
    },

  },

  D: {
    label: "青安3.0",
    file: "templates/template_d.jpg",

    photo: {
      x: 0.6691,
      y: 0.7198,
      width: 0.2984,
      height: 0.261,
      fit: "contain",
    },

    name: {
      x: 0.1821,
      y: 0.9311,
      size: 0.05,
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
      x: 0.4772,
      y: 0.9319,
      size: 0.05,
      weight: "700",
      color: "#1A3A6B",
      strokeColor: "#FFFFFF",
      strokeWidth: 0.0058,
      glow: false,
      align: "center",
      letterSpacing: 0,
      width: 0.3803,
      height: 0.064,
    },

    brand: {
      x: 0.0337,
      y: 0.8184,
      width: 0.2588,
      height: 0.0658,
    },

    branch: {
      x: 0.4827,
      y: 0.8527,
      size: 0.04,
      weight: "700",
      color: "#1A3A6B",
      strokeColor: "#FFFFFF",
      strokeWidth: 0.0058,
      glow: false,
      align: "center",
      letterSpacing: 0,
      width: 0.4114,
      height: 0.0661,
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
