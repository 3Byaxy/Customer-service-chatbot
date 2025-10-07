'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Lightbulb, TrendingUp, Users, Clock, Target, AlertTriangle } from 'lucide-react'

interface QuestionInsight {
  id: string
  pattern: string
  frequency: number
  trend: 'up' | 'down' | 'stable'
  businessImpact: 'high' | 'medium' | 'low'
  suggestedAction: string
  examples: string[]
}

interface QuestionInsightsProps {
  businessType: string
}

export default function QuestionInsights({ businessType }: QuestionInsightsProps) {
  const [insights, setInsights] = useState<QuestionInsight[]>([
    {
      id: '1',
      pattern: 'Data Bundle Confusion',
      frequency: 45,
      trend: 'up',
      businessImpact: 'high',
      suggestedAction: 'Create clearer bundle explanations and comparison charts',
      examples: [
        'Which bundle is best for me?',
        'How much data do I get?',
        'What\'s the difference between daily and weekly bundles?'
      ]
    },
    {
      id: '2',
      pattern: 'Local Language Mixing',
      frequency: 32,
      trend: 'stable',
      businessImpact: 'medium',
      suggestedAction: 'Improve local language detection and response capabilities',
      examples: [
        'I need sente for my simu',
        'Bundles zange ziggweewo',
        'Network ye masanyu terikola'
      ]
    },
    {
      id: '3',
      pattern: 'Billing Disputes',
      frequency: 28,
      trend: 'down',
      businessImpact: 'high',
      suggestedAction: 'Implement proactive billing transparency and alerts',
      examples: [
        'Why was I charged extra?',
        'I didn\'t use this much data',
        'My bill is wrong this month'
      ]
    },
    {
      id: '4',
      pattern: 'Network Coverage Issues',
      frequency: 38,
      trend: 'up',
      businessImpact: 'high',
      suggestedAction: 'Provide real-time network status and coverage maps',
      examples: [
        'No network in my area',
        'Calls keep dropping',
        'Internet is very slow'
      ]
    }
  ])

  const [selectedInsight, setSelectedInsight] = useState<QuestionInsight | null>(null)

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '📈'
      case 'down': return '📉'
      default: return '➡️'
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-red-600'
      case 'down': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default: return 'bg-green-100 text-green-800 border-green-200'
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Question Insights & Patterns
          </CardTitle>
          <CardDescription>
            AI-powered analysis of customer question patterns and trends for {businessType}
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Questions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,847</div>
            <p className="text-xs text-muted-foreground">
              +12% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2s</div>
            <p className="text-xs text-muted-foreground">
              -0.3s improvement
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">
              +5% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Escalation Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">13%</div>
            <p className="text-xs text-muted-foreground">
              -2% from last week
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Question Patterns
            </CardTitle>
            <CardDescription>
              Common patterns identified in customer questions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {insights.map((insight) => (
              <div
                key={insight.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedInsight?.id === insight.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedInsight(insight)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-sm">{insight.pattern}</h3>
                  <div className="flex items-center gap-2">
                    <Badge className={getImpactColor(insight.businessImpact)}>
                      {insight.businessImpact} impact
                    </Badge>
                    <span className={`text-sm ${getTrendColor(insight.trend)}`}>
                      {getTrendIcon(insight.trend)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">
                    {insight.frequency} occurrences this week
                  </span>
                  <Progress value={insight.frequency} className="w-20 h-1" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pattern Details</CardTitle>
            <CardDescription>
              {selectedInsight ? 'Detailed analysis and recommendations' : 'Select a pattern to view details'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedInsight ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Pattern: {selectedInsight.pattern}</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Frequency:</span>
                      <span className="ml-2 font-medium">{selectedInsight.frequency} times</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Trend:</span>
                      <span className={`ml-2 font-medium ${getTrendColor(selectedInsight.trend)}`}>
                        {selectedInsight.trend} {getTrendIcon(selectedInsight.trend)}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Business Impact</h4>
                  <Badge className={getImpactColor(selectedInsight.businessImpact)}>
                    {selectedInsight.businessImpact.toUpperCase()} IMPACT
                  </Badge>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Suggested Action</h4>
                  <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded">
                    {selectedInsight.suggestedAction}
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Example Questions</h4>
                  <div className="space-y-2">
                    {selectedInsight.examples.map((example, idx) => (
                      <div key={idx} className="text-sm bg-gray-50 p-2 rounded italic">
                        "{example}"
                      </div>
                    ))}
                  </div>
                </div>

                <Button size="sm" className="w-full">
                  Implement Suggested Action
                </Button>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <Lightbulb className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a question pattern to view detailed insights and recommendations</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>AI Analysis Recommendations</CardTitle>
          <CardDescription>
            Actionable insights based on question analysis patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <span className="text-lg">🎯</span>
                Improve Intent Detection
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                32% of questions show mixed intent. Enhance NLP models to better understand customer goals.
              </p>
              <Button variant="outline" size="sm">
                Update Models
              </Button>
            </div>

            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <span className="text-lg">🌍</span>
                Expand Local Language Support
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                28% of questions contain local terms. Add more Luganda and Swahili training data.
              </p>
              <Button variant="outline" size="sm">
                Train Models
              </Button>
            </div>

            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2 flex items-center gap-2">
                <span className="text-lg">⚡</span>
                Optimize Response Speed
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                Simple questions taking too long. Route basic queries to faster AI models.
              </p>
              <Button variant="outline" size="sm">
                Configure Routing
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
