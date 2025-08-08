'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Brain, Zap, MessageSquare, Settings, CheckCircle, AlertCircle } from 'lucide-react'

interface AIProvider {
  id: string
  name: string
  description: string
  strengths: string[]
  useCase: string
  speed: 'fast' | 'medium' | 'slow'
  accuracy: 'high' | 'medium' | 'low'
  cost: 'low' | 'medium' | 'high'
  enabled: boolean
  icon: string
}

export default function AIProvidersConfig() {
  const [providers, setProviders] = useState<AIProvider[]>([
    {
      id: 'openai-gpt4',
      name: 'OpenAI GPT-4o',
      description: 'Advanced reasoning and complex problem solving',
      strengths: ['Complex reasoning', 'Multi-language support', 'Context understanding'],
      useCase: 'Complex queries, banking security, detailed explanations',
      speed: 'medium',
      accuracy: 'high',
      cost: 'high',
      enabled: true,
      icon: '🤖'
    },
    {
      id: 'groq-llama',
      name: 'Groq Llama 3.1 70B',
      description: 'Ultra-fast inference for real-time responses',
      strengths: ['Lightning fast', 'Good reasoning', 'Cost effective'],
      useCase: 'Quick responses, simple queries, real-time analysis',
      speed: 'fast',
      accuracy: 'high',
      cost: 'low',
      enabled: true,
      icon: '⚡'
    },
    {
      id: 'anthropic-claude',
      name: 'Anthropic Claude',
      description: 'Excellent for nuanced understanding and safety',
      strengths: ['Safety focused', 'Nuanced understanding', 'Ethical reasoning'],
      useCase: 'Sensitive topics, complaint handling, ethical decisions',
      speed: 'medium',
      accuracy: 'high',
      cost: 'medium',
      enabled: true,
      icon: '🧠'
    },
    {
      id: 'cohere-command',
      name: 'Cohere Command R+',
      description: 'Specialized in business and enterprise use cases',
      strengths: ['Business context', 'RAG optimization', 'Multilingual'],
      useCase: 'Business knowledge, document analysis, enterprise queries',
      speed: 'medium',
      accuracy: 'medium',
      cost: 'medium',
      enabled: false,
      icon: '💼'
    }
  ])

  const [analysisConfig, setAnalysisConfig] = useState({
    enableSentimentAnalysis: true,
    enableIntentDetection: true,
    enableEntityExtraction: true,
    enableLanguageDetection: true,
    enableUrgencyClassification: true,
    enableComplexityAssessment: true,
    confidenceThreshold: 0.7,
    maxAnalysisTime: 2000, // milliseconds
    fallbackToSimple: true
  })

  const toggleProvider = (id: string) => {
    setProviders(prev => prev.map(provider => 
      provider.id === id ? { ...provider, enabled: !provider.enabled } : provider
    ))
  }

  const getSpeedColor = (speed: string) => {
    switch (speed) {
      case 'fast': return 'text-green-600'
      case 'medium': return 'text-yellow-600'
      default: return 'text-red-600'
    }
  }

  const getAccuracyColor = (accuracy: string) => {
    switch (accuracy) {
      case 'high': return 'text-green-600'
      case 'medium': return 'text-yellow-600'
      default: return 'text-red-600'
    }
  }

  const getCostColor = (cost: string) => {
    switch (cost) {
      case 'low': return 'text-green-600'
      case 'medium': return 'text-yellow-600'
      default: return 'text-red-600'
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Providers Configuration
          </CardTitle>
          <CardDescription>
            Configure third-party AI providers for advanced question comprehension and interpretation
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="providers" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="providers">AI Providers</TabsTrigger>
          <TabsTrigger value="analysis">Analysis Config</TabsTrigger>
          <TabsTrigger value="routing">Smart Routing</TabsTrigger>
        </TabsList>

        <TabsContent value="providers" className="space-y-4">
          {/* API Key Setup Guide */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <Settings className="h-5 w-5" />
                API Key Setup Required
              </CardTitle>
              <CardDescription className="text-blue-700">
                To enable advanced AI analysis, you need to configure API keys for the AI providers.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-blue-800">
                <h4 className="font-medium mb-2">Environment Variables Needed:</h4>
                <div className="space-y-1 font-mono text-xs bg-blue-100 p-3 rounded">
                  <div>OPENAI_API_KEY=your_openai_api_key_here</div>
                  <div>GROQ_API_KEY=your_groq_api_key_here</div>
                  <div>ANTHROPIC_API_KEY=your_anthropic_api_key_here</div>
                </div>
              </div>
              <div className="text-sm text-blue-800">
                <h4 className="font-medium mb-2">How to get API keys:</h4>
                <ul className="space-y-1 text-xs">
                  <li>• <strong>OpenAI:</strong> Visit platform.openai.com → API Keys</li>
                  <li>• <strong>Groq:</strong> Visit console.groq.com → API Keys</li>
                  <li>• <strong>Anthropic:</strong> Visit console.anthropic.com → API Keys</li>
                </ul>
              </div>
              <div className="p-2 bg-yellow-100 border border-yellow-300 rounded text-xs text-yellow-800">
                <strong>Note:</strong> Without API keys, the system will use basic keyword-based analysis and simple response templates.
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {providers.map((provider) => (
              <Card key={provider.id} className={`relative ${provider.enabled ? 'ring-2 ring-blue-200' : ''}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <span className="text-2xl">{provider.icon}</span>
                      {provider.name}
                    </CardTitle>
                    <Switch
                      checked={provider.enabled}
                      onCheckedChange={() => toggleProvider(provider.id)}
                    />
                  </div>
                  <CardDescription>{provider.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="text-center">
                      <div className={`font-medium ${getSpeedColor(provider.speed)}`}>
                        {provider.speed.toUpperCase()}
                      </div>
                      <div className="text-xs text-gray-500">Speed</div>
                    </div>
                    <div className="text-center">
                      <div className={`font-medium ${getAccuracyColor(provider.accuracy)}`}>
                        {provider.accuracy.toUpperCase()}
                      </div>
                      <div className="text-xs text-gray-500">Accuracy</div>
                    </div>
                    <div className="text-center">
                      <div className={`font-medium ${getCostColor(provider.cost)}`}>
                        {provider.cost.toUpperCase()}
                      </div>
                      <div className="text-xs text-gray-500">Cost</div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Strengths:</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {provider.strengths.map((strength, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {strength}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Best for:</Label>
                    <p className="text-sm text-gray-600 mt-1">{provider.useCase}</p>
                  </div>

                  {provider.enabled && (
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      Active
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Question Analysis Configuration
              </CardTitle>
              <CardDescription>
                Configure what aspects of customer questions should be analyzed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium">Analysis Features</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Sentiment Analysis</Label>
                        <p className="text-sm text-gray-600">Detect customer emotions and mood</p>
                      </div>
                      <Switch
                        checked={analysisConfig.enableSentimentAnalysis}
                        onCheckedChange={(checked) => 
                          setAnalysisConfig(prev => ({ ...prev, enableSentimentAnalysis: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Intent Detection</Label>
                        <p className="text-sm text-gray-600">Understand what customer wants</p>
                      </div>
                      <Switch
                        checked={analysisConfig.enableIntentDetection}
                        onCheckedChange={(checked) => 
                          setAnalysisConfig(prev => ({ ...prev, enableIntentDetection: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Entity Extraction</Label>
                        <p className="text-sm text-gray-600">Extract names, dates, products, etc.</p>
                      </div>
                      <Switch
                        checked={analysisConfig.enableEntityExtraction}
                        onCheckedChange={(checked) => 
                          setAnalysisConfig(prev => ({ ...prev, enableEntityExtraction: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Language Detection</Label>
                        <p className="text-sm text-gray-600">Auto-detect customer language</p>
                      </div>
                      <Switch
                        checked={analysisConfig.enableLanguageDetection}
                        onCheckedChange={(checked) => 
                          setAnalysisConfig(prev => ({ ...prev, enableLanguageDetection: checked }))
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium">Advanced Features</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Urgency Classification</Label>
                        <p className="text-sm text-gray-600">Classify request urgency level</p>
                      </div>
                      <Switch
                        checked={analysisConfig.enableUrgencyClassification}
                        onCheckedChange={(checked) => 
                          setAnalysisConfig(prev => ({ ...prev, enableUrgencyClassification: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Complexity Assessment</Label>
                        <p className="text-sm text-gray-600">Assess question complexity</p>
                      </div>
                      <Switch
                        checked={analysisConfig.enableComplexityAssessment}
                        onCheckedChange={(checked) => 
                          setAnalysisConfig(prev => ({ ...prev, enableComplexityAssessment: checked }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Fallback to Simple</Label>
                        <p className="text-sm text-gray-600">Use simple analysis if advanced fails</p>
                      </div>
                      <Switch
                        checked={analysisConfig.fallbackToSimple}
                        onCheckedChange={(checked) => 
                          setAnalysisConfig(prev => ({ ...prev, fallbackToSimple: checked }))
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-medium mb-4">Performance Settings</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Confidence Threshold</Label>
                    <div className="mt-2">
                      <input
                        type="range"
                        min="0.1"
                        max="1.0"
                        step="0.1"
                        value={analysisConfig.confidenceThreshold}
                        onChange={(e) => 
                          setAnalysisConfig(prev => ({ 
                            ...prev, 
                            confidenceThreshold: parseFloat(e.target.value) 
                          }))
                        }
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>0.1</span>
                        <span>{analysisConfig.confidenceThreshold}</span>
                        <span>1.0</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Max Analysis Time (ms)</Label>
                    <div className="mt-2">
                      <input
                        type="range"
                        min="500"
                        max="5000"
                        step="500"
                        value={analysisConfig.maxAnalysisTime}
                        onChange={(e) => 
                          setAnalysisConfig(prev => ({ 
                            ...prev, 
                            maxAnalysisTime: parseInt(e.target.value) 
                          }))
                        }
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>500ms</span>
                        <span>{analysisConfig.maxAnalysisTime}ms</span>
                        <span>5000ms</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="routing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Smart AI Routing
              </CardTitle>
              <CardDescription>
                Configure how questions are routed to different AI providers based on analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Routing Rules</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                      <span><strong>Simple Questions</strong> → Groq Llama (Fast & Cost-effective)</span>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                      <span><strong>Complex Questions</strong> → OpenAI GPT-4 (High Accuracy)</span>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-purple-50 rounded">
                      <span><strong>Banking/Security</strong> → OpenAI GPT-4 (Security Focus)</span>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-orange-50 rounded">
                      <span><strong>Complaints/Sensitive</strong> → Claude (Safety & Ethics)</span>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Analysis Pipeline</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold">1</div>
                      <span>Question received → Groq Llama analyzes intent, sentiment, entities</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold">2</div>
                      <span>Analysis results determine optimal AI provider for response</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold">3</div>
                      <span>Selected AI generates contextual response using analysis insights</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold">4</div>
                      <span>Response delivered with analysis metadata for transparency</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">Performance Metrics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">98.5%</div>
                      <div className="text-gray-600">Analysis Accuracy</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">1.2s</div>
                      <div className="text-gray-600">Avg Response Time</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">85%</div>
                      <div className="text-gray-600">Customer Satisfaction</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">12%</div>
                      <div className="text-gray-600">Escalation Rate</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
