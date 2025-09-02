"use client"

import { useState, useEffect } from "react"
import { KIZUNA_AI_BRAND } from "../../../backend/config/branding-system"

interface KizunaAIAvatarProps {
  size?: "sm" | "md" | "lg" | "xl"
  variant?: "orb" | "ribbon" | "geometric" | "full"
  isActive?: boolean
  isTyping?: boolean
  mood?: "happy" | "thinking" | "helpful" | "excited"
  onClick?: () => void
  className?: string
}

export default function KizunaAIAvatar({
  size = "md",
  variant = "orb",
  isActive = false,
  isTyping = false,
  mood = "happy",
  onClick,
  className = "",
}: KizunaAIAvatarProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-20 h-20",
  }

  const moodColors = {
    happy: "from-kai-primary to-kai-secondary",
    thinking: "from-purple-400 to-kai-primary",
    helpful: "from-green-400 to-kai-primary",
    excited: "from-kai-secondary to-yellow-400",
  }

  useEffect(() => {
    if (isActive || isTyping) {
      setIsAnimating(true)
      const timer = setTimeout(() => setIsAnimating(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [isActive, isTyping])

  const renderOrbAvatar = () => (
    <div
      className={`
        kai-orb relative rounded-full cursor-pointer transition-all duration-300
        bg-gradient-to-br ${moodColors[mood]}
        ${sizeClasses[size]}
        ${isActive ? "animate-pulse shadow-glow" : ""}
        ${isAnimating ? "animate-bounce" : ""}
        ${className}
      `}
      onClick={onClick}
    >
      {/* Inner glow */}
      <div className="absolute inset-2 rounded-full bg-white/30 animate-pulse" />

      {/* Core */}
      <div className="absolute inset-4 rounded-full bg-white/50" />

      {/* Typing indicator */}
      {isTyping && (
        <div className="absolute -bottom-1 -right-1 flex gap-1">
          <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      )}

      {/* Floating particles */}
      <div className="absolute -inset-2 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-1 h-1 bg-kai-accent rounded-full animate-float opacity-60" />
        <div
          className="absolute top-1/4 right-0 w-0.5 h-0.5 bg-kai-secondary rounded-full animate-float opacity-40"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-1/4 left-0 w-0.5 h-0.5 bg-kai-primary rounded-full animate-float opacity-50"
          style={{ animationDelay: "2s" }}
        />
      </div>
    </div>
  )

  const renderRibbonAvatar = () => (
    <div
      className={`
        relative rounded-full cursor-pointer transition-all duration-300
        bg-gradient-to-br ${moodColors[mood]}
        ${sizeClasses[size]}
        ${isActive ? "animate-pulse shadow-glow" : ""}
        ${className}
      `}
      onClick={onClick}
    >
      {/* Ribbon/Bond Symbol */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg viewBox="0 0 24 24" className="w-1/2 h-1/2 text-white" fill="currentColor">
          <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.9 1 3 1.9 3 3V7H1V9H3V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V9H21ZM5 3H14.17L19 7.83V19H5V3Z" />
        </svg>
      </div>

      {/* Connection lines */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-1/2 h-0.5 bg-white/60 rounded-full transform rotate-45" />
        <div className="absolute top-1/4 left-1/4 w-1/2 h-0.5 bg-white/60 rounded-full transform -rotate-45" />
      </div>
    </div>
  )

  const renderGeometricAvatar = () => (
    <div
      className={`
        relative cursor-pointer transition-all duration-300
        ${sizeClasses[size]}
        ${isActive ? "animate-pulse" : ""}
        ${className}
      `}
      onClick={onClick}
    >
      {/* Geometric shapes */}
      <div className="absolute inset-0">
        <div className={`absolute inset-0 bg-gradient-to-br ${moodColors[mood]} rounded-lg transform rotate-45`} />
        <div className="absolute inset-2 bg-white/30 rounded-lg transform rotate-45" />
        <div className="absolute inset-4 bg-white/50 rounded-full" />
      </div>

      {/* Center dot */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
      </div>
    </div>
  )

  const renderFullAvatar = () => (
    <div
      className={`
        relative cursor-pointer transition-all duration-300
        ${sizeClasses[size]}
        ${isActive ? "animate-float" : ""}
        ${className}
      `}
      onClick={onClick}
    >
      {/* Main avatar container */}
      <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${moodColors[mood]} shadow-lg`}>
        {/* Inner glow */}
        <div className="absolute inset-1 rounded-full bg-gradient-to-br from-white/40 to-transparent" />

        {/* Heart symbol for connection */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-1/3 h-1/3 text-white" fill="currentColor">
            <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.27 2 8.5C2 5.41 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.08C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.41 22 8.5C22 12.27 18.6 15.36 13.45 20.03L12 21.35Z" />
          </svg>
        </div>

        {/* Connection dots */}
        <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white rounded-full animate-pulse" />
        <div
          className="absolute top-1/4 right-1/4 w-1 h-1 bg-white rounded-full animate-pulse"
          style={{ animationDelay: "0.5s" }}
        />
      </div>

      {/* Status indicator */}
      {isActive && (
        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse" />
      )}

      {/* Floating elements */}
      <div className="absolute -inset-4 pointer-events-none">
        <div className="absolute top-0 left-1/2 w-1 h-1 bg-kai-accent rounded-full animate-float opacity-60" />
        <div
          className="absolute right-0 top-1/2 w-0.5 h-0.5 bg-kai-secondary rounded-full animate-float opacity-40"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-0 left-1/4 w-0.5 h-0.5 bg-kai-primary rounded-full animate-float opacity-50"
          style={{ animationDelay: "2s" }}
        />
      </div>
    </div>
  )

  const avatarVariants = {
    orb: renderOrbAvatar,
    ribbon: renderRibbonAvatar,
    geometric: renderGeometricAvatar,
    full: renderFullAvatar,
  }

  return (
    <div className="relative inline-block">
      {avatarVariants[variant]()}

      {/* Name label */}
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
        <span className="text-xs font-medium text-kai-text-secondary kai-brand">{KIZUNA_AI_BRAND.name}</span>
      </div>
    </div>
  )
}
