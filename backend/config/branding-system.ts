/**
 * KyakuShien × KizunaAI Brand System
 * Complete branding configuration for the AI Customer Support System
 */

export const KYAKU_SHIEN_BRAND = {
  name: "KyakuShien",
  tagline: "Advanced AI Customer Support System",
  description: "Enterprise-grade customer support powered by artificial intelligence",
  colors: {
    primary: "#2563EB", // Professional blue
    secondary: "#1E40AF", // Darker blue
    accent: "#3B82F6", // Bright blue
    success: "#10B981", // Green
    warning: "#F59E0B", // Orange
    danger: "#EF4444", // Red
    neutral: {
      50: "#F8FAFC",
      100: "#F1F5F9",
      200: "#E2E8F0",
      300: "#CBD5E1",
      400: "#94A3B8",
      500: "#64748B",
      600: "#475569",
      700: "#334155",
      800: "#1E293B",
      900: "#0F172A",
    },
  },
  typography: {
    fontFamily: {
      primary: "Inter, system-ui, sans-serif",
      heading: "Poppins, system-ui, sans-serif",
      mono: "JetBrains Mono, monospace",
    },
    fontSize: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
    },
  },
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
  },
  borderRadius: {
    sm: "0.25rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "0.75rem",
    "2xl": "1rem",
    full: "9999px",
  },
  shadows: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  },
}

export const KIZUNA_AI_BRAND = {
  name: "KizunaAI",
  tagline: "Your Intelligent Support Companion",
  description: "Friendly AI assistant that understands and helps in multiple languages",
  personality: {
    tone: "friendly, helpful, empathetic",
    style: "conversational, professional, warm",
    traits: ["multilingual", "culturally aware", "patient", "solution-focused"],
  },
  colors: {
    primary: "#14B8A6", // Teal
    secondary: "#EC4899", // Pink
    accent: "#8B5CF6", // Purple
    gradient: {
      primary: "linear-gradient(135deg, #14B8A6 0%, #EC4899 100%)",
      secondary: "linear-gradient(135deg, #8B5CF6 0%, #14B8A6 100%)",
      accent: "linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)",
    },
    mood: {
      happy: "#10B981",
      thinking: "#F59E0B",
      helping: "#3B82F6",
      concerned: "#EF4444",
    },
  },
  typography: {
    fontFamily: {
      primary: "Quicksand, system-ui, sans-serif",
      heading: "Nunito, system-ui, sans-serif",
      chat: "Poppins, system-ui, sans-serif",
    },
  },
  avatar: {
    sizes: {
      xs: "1.5rem",
      sm: "2rem",
      md: "2.5rem",
      lg: "3rem",
      xl: "4rem",
    },
    variants: {
      orb: "rounded-full with gradient background",
      character: "anime-style character representation",
      minimal: "simple icon representation",
    },
  },
  animations: {
    bounce: "gentle bounce for attention",
    pulse: "soft pulse for thinking state",
    glow: "subtle glow for active state",
    typing: "typing indicator animation",
  },
}

export const BRAND_CONFIG = {
  kyakuShien: KYAKU_SHIEN_BRAND,
  kizunaAI: KIZUNA_AI_BRAND,
  integration: {
    headerBrand: "kyakuShien",
    chatBrand: "kizunaAI",
    dashboardBrand: "kyakuShien",
    publicBrand: "both",
  },
}

// CSS Custom Properties for the brand system
export const CSS_VARIABLES = `
:root {
  /* KyakuShien Colors */
  --ks-primary: ${KYAKU_SHIEN_BRAND.colors.primary};
  --ks-secondary: ${KYAKU_SHIEN_BRAND.colors.secondary};
  --ks-accent: ${KYAKU_SHIEN_BRAND.colors.accent};
  --ks-success: ${KYAKU_SHIEN_BRAND.colors.success};
  --ks-warning: ${KYAKU_SHIEN_BRAND.colors.warning};
  --ks-danger: ${KYAKU_SHIEN_BRAND.colors.danger};

  /* KizunaAI Colors */
  --ka-primary: ${KIZUNA_AI_BRAND.colors.primary};
  --ka-secondary: ${KIZUNA_AI_BRAND.colors.secondary};
  --ka-accent: ${KIZUNA_AI_BRAND.colors.accent};
  --ka-gradient-primary: ${KIZUNA_AI_BRAND.colors.gradient.primary};
  --ka-gradient-secondary: ${KIZUNA_AI_BRAND.colors.gradient.secondary};

  /* Typography */
  --font-primary: ${KYAKU_SHIEN_BRAND.typography.fontFamily.primary};
  --font-heading: ${KYAKU_SHIEN_BRAND.typography.fontFamily.heading};
  --font-chat: ${KIZUNA_AI_BRAND.typography.fontFamily.chat};

  /* Spacing */
  --spacing-xs: ${KYAKU_SHIEN_BRAND.spacing.xs};
  --spacing-sm: ${KYAKU_SHIEN_BRAND.spacing.sm};
  --spacing-md: ${KYAKU_SHIEN_BRAND.spacing.md};
  --spacing-lg: ${KYAKU_SHIEN_BRAND.spacing.lg};
  --spacing-xl: ${KYAKU_SHIEN_BRAND.spacing.xl};

  /* Animations */
  --animation-bounce: bounce 1s infinite;
  --animation-pulse: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  --animation-glow: glow 2s ease-in-out infinite alternate;
}

@keyframes bounce {
  0%, 20%, 53%, 80%, 100% {
    transform: translate3d(0,0,0);
  }
  40%, 43% {
    transform: translate3d(0, -8px, 0);
  }
  70% {
    transform: translate3d(0, -4px, 0);
  }
  90% {
    transform: translate3d(0, -2px, 0);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .7;
  }
}

@keyframes glow {
  from {
    box-shadow: 0 0 5px var(--ka-primary), 0 0 10px var(--ka-primary), 0 0 15px var(--ka-primary);
  }
  to {
    box-shadow: 0 0 10px var(--ka-primary), 0 0 20px var(--ka-primary), 0 0 30px var(--ka-primary);
  }
}

/* Utility Classes */
.ks-gradient {
  background: linear-gradient(135deg, var(--ks-primary) 0%, var(--ks-secondary) 100%);
}

.ka-gradient {
  background: var(--ka-gradient-primary);
}

.ka-text-gradient {
  background: var(--ka-gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.animate-bounce-gentle {
  animation: var(--animation-bounce);
}

.animate-pulse-soft {
  animation: var(--animation-pulse);
}

.animate-glow {
  animation: var(--animation-glow);
}
`

export default BRAND_CONFIG
