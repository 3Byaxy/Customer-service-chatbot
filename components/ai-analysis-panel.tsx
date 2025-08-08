'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Brain, Target, Heart, Clock, AlertTriangle, MessageSquare } from 'lucide-react'

interface QuestionAnalysis {
  intent: string
  subIntent: string
  entities: Array<{
    type: string
    value: string
    confidence: number
  }>
  sentiment: {
    polarity: 'positive' | 'negative' | 'neutral'
    intensity: number
    emotions: string[]
  }
  language: {
    detected: string
    confidence: number
    localTerms: string[]
  }
  urgency: 'low' | 'medium' | 'high' | 'critical'
  businessContext: {
    category: string
    specificArea: string
    requiresEscalation: boolean
  }
  questionType: 'inquiry' | 'complaint' | 'request' | 'compliment' | 'emergency'
  complexity: 'simple' | 'moderate' | 'complex'
  contextNeeded: string[]
}

interface AIAnalysisPanelProps {
  analysis: QuestionAnalysis | null
  isAnalyzing: boolean
}

export default function AIAnalysisPanel({ analysis, isAnalyzing }: AIAnalysisPanelProps) {
  const [showDetails, setShowDetails] = useState(false)

  if (!analysis && !isAnalyzing) {
    return (
      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Brain className="h-4 w-4" />
            AI Question Analysis
          </CardTitle>
          <CardDescription className="text-xs">
            Advanced NLP analysis will appear here
            <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
              <div className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3 text-yellow-600" />
                <span className="text-yellow-800">Basic mode active - Configure AI providers for advanced analysis</span>
              </div>
            </div>
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (isAnalyzing) {
    return (
      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Brain className="h-4 w-4 animate-pulse" />
            Analyzing Question...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <span className="text-xs text-gray-600">Processing with AI...</span>
            </div>
            <Progress value={75} className="h-1" />
          </div>
        </CardContent>
      </Card>
    )
  }

  const getSentimentColor = (polarity: string, intensity: number) => {
    if (polarity === 'positive') return 'text-green-600'
    if (polarity === 'negative') return intensity > 0.7 ? 'text-red-600' : 'text-orange-600'
    return 'text-gray-600'
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default: return 'bg-green-100 text-green-800 border-green-200'
    }
  }

  const getComplexityIcon = (complexity: string) => {
    switch (complexity) {
      case 'complex': return '🔴'
      case 'moderate': return '🟡'
      default: return '🟢'
    }
  }

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-blue-600" />
            AI Question Analysis
          </div>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs text-blue-600 hover:underline"
          >
            {showDetails ? 'Hide' : 'Show'} Details
          </button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Overview */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="font-medium">Intent:</span>
            <Badge variant="outline" className="ml-1 text-xs">
              {analysis.intent}
            </Badge>
          </div>
          <div>
            <span className="font-medium">Type:</span>
            <Badge variant="secondary" className="ml-1 text-xs">
              {analysis.questionType}
            </Badge>
          </div>
        </div>

        {/* Urgency & Sentiment */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium">Urgency Level</span>
            <Badge className={`text-xs ${getUrgencyColor(analysis.urgency)}`}>
              {analysis.urgency.toUpperCase()}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium">Sentiment</span>
            <div className="flex items-center gap-1">
              <span className={`text-xs font-medium ${getSentimentColor(analysis.sentiment.polarity, analysis.sentiment.intensity)}`}>
                {analysis.sentiment.polarity}
              </span>
              <Progress 
                value={analysis.sentiment.intensity * 100} 
                className="w-12 h-1"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs font-medium">Complexity</span>
            <div className="flex items-center gap-1">
              <span>{getComplexityIcon(analysis.complexity)}</span>
              <span className="text-xs">{analysis.complexity}</span>
            </div>
          </div>
        </div>

        {/* Escalation Warning */}
        {analysis.businessContext.requiresEscalation && (
          <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded text-xs">
            <AlertTriangle className="h-3 w-3 text-red-600" />
            <span className="text-red-800 font-medium">Escalation Recommended</span>
          </div>
        )}

        {/* Entities Found */}
        {analysis.entities.length > 0 && (
          <div>
            <span className="text-xs font-medium">Key Entities:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {analysis.entities.slice(0, 3).map((entity, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {entity.type}: {entity.value}
                </Badge>
              ))}
              {analysis.entities.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{analysis.entities.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Local Terms */}
        {analysis.language.localTerms.length > 0 && (
          <div>
            <span className="text-xs font-medium">Local Terms:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {analysis.language.localTerms.map((term, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {term}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Detailed Analysis */}
        {showDetails && (
          <div className="space-y-3 pt-3 border-t">
            <div>
              <span className="text-xs font-medium">Sub-Intent:</span>
              <p className="text-xs text-gray-600 mt-1">{analysis.subIntent}</p>
            </div>

            <div>
              <span className="text-xs font-medium">Business Context:</span>
              <p className="text-xs text-gray-600 mt-1">
                {analysis.businessContext.category} → {analysis.businessContext.specificArea}
              </p>
            </div>

            <div>
              <span className="text-xs font-medium">Emotions Detected:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {analysis.sentiment.emotions.map((emotion, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {emotion}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs font-medium">Context Needed:</span>
              <ul className="text-xs text-gray-600 mt-1 space-y-1">
                {analysis.contextNeeded.map((context, idx) => (
                  <li key={idx}>• {context}</li>
                ))}
              </ul>
            </div>

            <div>
              <span className="text-xs font-medium">Language Detection:</span>
              <p className="text-xs text-gray-600 mt-1">
                {analysis.language.detected} ({Math.round(analysis.language.confidence * 100)}% confidence)
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
