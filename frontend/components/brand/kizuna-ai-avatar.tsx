"use client"

import { useState, useEffect } from "react"
import { KIZUNA_AI_BRAND } from "../../../backend/config/branding-system"

interface KizunaAIAvatarProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  variant?: "orb" | "character" | "minimal"
  mood?: "happy" | "thinking" | "helping" | "concerned" | "neutral"
  isActive?: boolean
  isTyping?: boolean
  className?: string
  onClick?: () => void
}

export default function KizunaAIAvatar({
  size = "md",
  variant = "orb",
  mood = "neutral",
  isActive = false,
  isTyping = false,
  className = "",
  onClick,
}: KizunaAIAvatarProps) {
  const [currentMood, setCurrentMood] = useState(mood)

  useEffect(() => {
    if (isTyping) {
      setCurrentMood("thinking")
    } else {
      setCurrentMood(mood)
    }
  }, [isTyping, mood])

  const sizeClasses = {
    xs: "w-6 h-6",
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  }

  const getMoodColor = () => {
    switch (currentMood) {
      case "happy":
        return KIZUNA_AI_BRAND.colors.mood.happy
      case "thinking":
        return KIZUNA_AI_BRAND.colors.mood.thinking
      case "helping":
        return KIZUNA_AI_BRAND.colors.mood.helping
      case "concerned":
        return KIZUNA_AI_BRAND.colors.mood.concerned
      default:
        return KIZUNA_AI_BRAND.colors.primary
    }
  }

  const getGradientStyle = () => {
    if (variant === "orb") {
      return {
        background: isActive
          ? KIZUNA_AI_BRAND.colors.gradient.primary
          : `linear-gradient(135deg, ${getMoodColor()} 0%, ${KIZUNA_AI_BRAND.colors.secondary} 100%)`,
      }
    }
    return {}
  }

  const renderOrbAvatar = () => (
    <div
      className={`
        ${sizeClasses[size]} 
        rounded-full 
        flex items-center justify-center 
        text-white font-bold 
        transition-all duration-300 
        ${isActive ? "animate-pulse-soft shadow-lg" : ""} 
        ${isTyping ? "animate-bounce-gentle" : ""} 
        ${onClick ? "cursor-pointer hover:scale-110" : ""} 
        ${className}
      `}
      style={getGradientStyle()}
      onClick={onClick}
    >
      {/* AI Symbol */}
      <div className="relative">
        <div className="w-3 h-3 bg-white rounded-full opacity-90"></div>
        <div className="absolute top-0 left-0 w-3 h-3 bg-white rounded-full animate-ping opacity-30"></div>
      </div>
    </div>
  )

  const renderCharacterAvatar = () => (
    <div
      className={`
        ${sizeClasses[size]} 
        rounded-full 
        flex items-center justify-center 
        text-white font-bold 
        transition-all duration-300 
        ${isActive ? "animate-glow" : ""} 
        ${isTyping ? "animate-bounce-gentle" : ""} 
        ${onClick ? "cursor-pointer hover:scale-110" : ""} 
        ${className}
      `}
      style={getGradientStyle()}
      onClick={onClick}
    >
      {/* Character representation */}
      <div className="text-lg">🤖</div>
    </div>
  )

  const renderMinimalAvatar = () => (
    <div
      className={`
        ${sizeClasses[size]} 
        rounded-lg 
        flex items-center justify-center 
        border-2 
        transition-all duration-300 
        ${isActive ? "border-opacity-100" : "border-opacity-50"} 
        ${isTyping ? "animate-pulse" : ""} 
        ${onClick ? "cursor-pointer hover:scale-105" : ""} 
        ${className}
      `}
      style={{
        borderColor: getMoodColor(),
        backgroundColor: isActive ? `${getMoodColor()}20` : "transparent",
      }}
      onClick={onClick}
    >
      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: getMoodColor() }}></div>
    </div>
  )

  switch (variant) {
    case "character":
      return renderCharacterAvatar()
    case "minimal":
      return renderMinimalAvatar()
    case "orb":
    default:
      return renderOrbAvatar()
  }
}
