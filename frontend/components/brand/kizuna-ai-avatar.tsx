"use client"

import { KIZUNA_AI_BRAND } from "../../../backend/config/branding-system"
import { Bot, Heart, Sparkles, MessageCircle } from "lucide-react"

interface KizunaAIAvatarProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  variant?: "orb" | "ribbon" | "geometric" | "simple"
  mood?: "happy" | "thinking" | "excited" | "calm"
  isActive?: boolean
  className?: string
}

export default function KizunaAIAvatar({
  size = "md",
  variant = "orb",
  mood = "happy",
  isActive = false,
  className = "",
}: KizunaAIAvatarProps) {
  const getSizeClasses = () => {
    switch (size) {
      case "xs":
        return "w-6 h-6"
      case "sm":
        return "w-8 h-8"
      case "md":
        return "w-12 h-12"
      case "lg":
        return "w-16 h-16"
      case "xl":
        return "w-24 h-24"
      default:
        return "w-12 h-12"
    }
  }

  const getIconSize = () => {
    switch (size) {
      case "xs":
        return "h-3 w-3"
      case "sm":
        return "h-4 w-4"
      case "md":
        return "h-6 w-6"
      case "lg":
        return "h-8 w-8"
      case "xl":
        return "h-12 w-12"
      default:
        return "h-6 w-6"
    }
  }

  const getMoodIcon = () => {
    switch (mood) {
      case "thinking":
        return <MessageCircle className={getIconSize()} />
      case "excited":
        return <Sparkles className={getIconSize()} />
      case "calm":
        return <Heart className={getIconSize()} />
      default:
        return <Bot className={getIconSize()} />
    }
  }

  const getVariantStyles = () => {
    const baseClasses = `${getSizeClasses()} rounded-full flex items-center justify-center text-white transition-all duration-300 ${className}`

    switch (variant) {
      case "orb":
        return `${baseClasses} ${isActive ? "animate-pulse shadow-lg" : ""}`
      case "ribbon":
        return `${baseClasses} rounded-lg transform rotate-12 hover:rotate-0`
      case "geometric":
        return `${baseClasses} rounded-none clip-path-polygon`
      case "simple":
        return `${baseClasses} border-2 border-white/30`
      default:
        return baseClasses
    }
  }

  const getBackgroundStyle = () => {
    if (isActive) {
      return {
        background: KIZUNA_AI_BRAND.colors.gradient.glow,
        boxShadow: `0 0 20px ${KIZUNA_AI_BRAND.colors.primary}`,
      }
    }
    return {
      background: KIZUNA_AI_BRAND.colors.gradient.primary,
    }
  }

  return (
    <div className={getVariantStyles()} style={getBackgroundStyle()}>
      {getMoodIcon()}

      {/* Floating particles for active state */}
      {isActive && variant === "orb" && (
        <>
          <div
            className="absolute -top-1 -right-1 w-2 h-2 rounded-full animate-ping"
            style={{ backgroundColor: KIZUNA_AI_BRAND.colors.accent }}
          />
          <div
            className="absolute -bottom-1 -left-1 w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ backgroundColor: KIZUNA_AI_BRAND.colors.secondary }}
          />
        </>
      )}
    </div>
  )
}
