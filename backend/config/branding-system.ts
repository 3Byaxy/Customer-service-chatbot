export const KYAKU_SHIEN_BRAND = {
  name: "KyakuShien",
  fullName: "KyakuShien (客支援)",
  tagline: "AI-powered Customer Support Platform",
  description: "The complete customer support solution",
  positioning: "Professional, corporate, trustworthy",

  colors: {
    primary: "#1B2A49", // Navy Blue
    secondary: "#2E2E2E", // Charcoal Gray
    accent: "#4A90E2", // Professional Blue
    background: "#F8FAFC", // Light Gray
    surface: "#FFFFFF", // White
    text: {
      primary: "#1B2A49",
      secondary: "#64748B",
      muted: "#94A3B8",
    },
  },

  typography: {
    primary: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
    headings: "Montserrat, Inter, sans-serif",
    mono: "JetBrains Mono, Consolas, monospace",
  },

  logo: {
    primary: "/assets/kyaku-shien-logo.png",
    icon: "/assets/kyaku-shien-icon.svg",
    wordmark: "/assets/kyaku-shien-wordmark.svg",
  },

  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    xxl: "3rem",
  },
}

export const KIZUNA_AI_BRAND = {
  name: "KizunaAI",
  fullName: "KizunaAI (絆AI)",
  tagline: "The bond between you and your customers",
  description: "Your intelligent customer support companion",
  positioning: "Friendly, approachable, human touch",
  personality: "Warm, helpful, intelligent, empathetic",

  colors: {
    primary: "#2EC4B6", // Teal
    secondary: "#FF6B81", // Soft Pink
    accent: "#A8E6CF", // Light Green
    background: "#F0FDFA", // Very Light Teal
    surface: "#FFFFFF", // White
    gradient: {
      primary: "linear-gradient(135deg, #2EC4B6 0%, #FF6B81 100%)",
      soft: "linear-gradient(135deg, #A8E6CF 0%, #FFE5E5 100%)",
      glow: "linear-gradient(135deg, #2EC4B6 0%, #FF6B81 50%, #A8E6CF 100%)",
    },
    text: {
      primary: "#1B2A49",
      secondary: "#4A5568",
      light: "#FFFFFF",
    },
  },

  typography: {
    primary: "Poppins, -apple-system, BlinkMacSystemFont, sans-serif",
    headings: "Nunito, Poppins, sans-serif",
    chat: "Quicksand, Poppins, sans-serif",
  },

  avatar: {
    primary: "/assets/kizuna-ai-avatar.png",
    orb: "/assets/kizuna-ai-orb.svg",
    ribbon: "/assets/kizuna-ai-ribbon.svg",
    geometric: "/assets/kizuna-ai-geometric.svg",
  },

  animations: {
    glow: "glow 2s ease-in-out infinite alternate",
    pulse: "pulse 1.5s ease-in-out infinite",
    float: "float 3s ease-in-out infinite",
  },
}

export const UNIFIED_BRAND = {
  marketing: {
    tagline: "Built on KyakuShien, powered by KizunaAI",
    description: "Professional AI customer support with a human touch",
  },

  usage: {
    website_header: KYAKU_SHIEN_BRAND,
    chat_interface: KIZUNA_AI_BRAND,
    admin_panel: KYAKU_SHIEN_BRAND,
    marketing_materials: "both",
  },

  voice: {
    kyaku_shien: "Professional, authoritative, solution-focused",
    kizuna_ai: "Warm, conversational, empathetic, helpful",
  },
}

// CSS Custom Properties for the design system
export const CSS_VARIABLES = `
:root {
  /* KyakuShien Colors */
  --ks-primary: ${KYAKU_SHIEN_BRAND.colors.primary};
  --ks-secondary: ${KYAKU_SHIEN_BRAND.colors.secondary};
  --ks-accent: ${KYAKU_SHIEN_BRAND.colors.accent};
  --ks-background: ${KYAKU_SHIEN_BRAND.colors.background};
  --ks-surface: ${KYAKU_SHIEN_BRAND.colors.surface};
  --ks-text-primary: ${KYAKU_SHIEN_BRAND.colors.text.primary};
  --ks-text-secondary: ${KYAKU_SHIEN_BRAND.colors.text.secondary};
  --ks-text-muted: ${KYAKU_SHIEN_BRAND.colors.text.muted};
  
  /* KizunaAI Colors */
  --kai-primary: ${KIZUNA_AI_BRAND.colors.primary};
  --kai-secondary: ${KIZUNA_AI_BRAND.colors.secondary};
  --kai-accent: ${KIZUNA_AI_BRAND.colors.accent};
  --kai-background: ${KIZUNA_AI_BRAND.colors.background};
  --kai-surface: ${KIZUNA_AI_BRAND.colors.surface};
  --kai-gradient-primary: ${KIZUNA_AI_BRAND.colors.gradient.primary};
  --kai-gradient-soft: ${KIZUNA_AI_BRAND.colors.gradient.soft};
  --kai-gradient-glow: ${KIZUNA_AI_BRAND.colors.gradient.glow};
  
  /* Typography */
  --font-ks-primary: ${KYAKU_SHIEN_BRAND.typography.primary};
  --font-ks-headings: ${KYAKU_SHIEN_BRAND.typography.headings};
  --font-kai-primary: ${KIZUNA_AI_BRAND.typography.primary};
  --font-kai-headings: ${KIZUNA_AI_BRAND.typography.headings};
  --font-kai-chat: ${KIZUNA_AI_BRAND.typography.chat};
  
  /* Animations */
  --animation-glow: ${KIZUNA_AI_BRAND.animations.glow};
  --animation-pulse: ${KIZUNA_AI_BRAND.animations.pulse};
  --animation-float: ${KIZUNA_AI_BRAND.animations.float};
}

@keyframes glow {
  from { box-shadow: 0 0 20px var(--kai-primary); }
  to { box-shadow: 0 0 30px var(--kai-secondary); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}
`

// Combined brand configuration for easy access
export const BRAND_CONFIG = {
  kyakuShien: KYAKU_SHIEN_BRAND,
  kizunaAI: KIZUNA_AI_BRAND,
  unified: UNIFIED_BRAND,
  cssVariables: CSS_VARIABLES,
}

export type BrandConfig = typeof BRAND_CONFIG
