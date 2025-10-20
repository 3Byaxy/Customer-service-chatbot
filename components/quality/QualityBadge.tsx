'use client'

import React from 'react'

export interface QualityGrade {
  grade: 'A++' | 'A+' | 'B++' | 'B+'
  score: number
  description: string
}

interface QualityBadgeProps {
  grade: QualityGrade['grade']
  score?: number
  size?: 'small' | 'medium' | 'large'
  interactive?: boolean
  showScore?: boolean
  onClick?: () => void
}

const gradeConfig = {
  'A++': {
    colors: 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900',
    icon: '🏆',
    description: 'Premium Quality - Verified Authentic',
    scoreRange: '98-100%',
    features: ['30-day guarantee', 'Premium support', 'Verified authentic']
  },
  'A+': {
    colors: 'bg-gradient-to-r from-gray-300 to-gray-500 text-gray-900',
    icon: '⭐',
    description: 'High Quality - Excellent Standards',
    scoreRange: '90-97%',
    features: ['Quality assured', 'Fast shipping', 'Return policy']
  },
  'B++': {
    colors: 'bg-gradient-to-r from-orange-400 to-orange-600 text-white',
    icon: '✅',
    description: 'Good Quality - Reliable Choice',
    scoreRange: '80-89%',
    features: ['Quality checked', 'Standard shipping', 'Basic warranty']
  },
  'B+': {
    colors: 'bg-gradient-to-r from-green-400 to-green-600 text-white',
    icon: '👍',
    description: 'Standard Quality - Good Value',
    scoreRange: '70-79%',
    features: ['Basic quality', 'Standard shipping', 'Return available']
  }
}

export default function QualityBadge({ 
  grade, 
  score, 
  size = 'medium', 
  interactive = false,
  showScore = false,
  onClick 
}: QualityBadgeProps) {
  const config = gradeConfig[grade]
  
  const sizeClasses = {
    small: 'px-2 py-1 text-xs',
    medium: 'px-3 py-1.5 text-sm',
    large: 'px-4 py-2 text-base'
  }

  const badgeContent = (
    <span className={`
      inline-flex items-center gap-1 rounded-full font-semibold tracking-wide
      ${config.colors} ${sizeClasses[size]}
      ${interactive ? 'cursor-pointer hover:scale-105 transition-transform' : ''}
    `}>
      <span className="text-sm">{config.icon}</span>
      <span>{grade}</span>
      {showScore && score && (
        <span className="ml-1 opacity-90">({score}%)</span>
      )}
    </span>
  )

  if (interactive) {
    return (
      <div 
        onClick={onClick}
        className="inline-block group"
        title={`${config.description} - ${config.scoreRange}`}
      >
        {badgeContent}
        <div className="invisible group-hover:visible absolute z-10 mt-1 p-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg max-w-xs">
          <div className="font-semibold">{config.description}</div>
          <div className="text-gray-300">Score Range: {config.scoreRange}</div>
          <ul className="mt-1 space-y-1">
            {config.features.map((feature, index) => (
              <li key={index} className="text-gray-300">• {feature}</li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  return badgeContent
}

export { gradeConfig }