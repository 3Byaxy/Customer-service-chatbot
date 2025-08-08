'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Building2, Globe, MessageSquare, Settings, Plus, Edit } from 'lucide-react'

interface BusinessConfig {
  id: string
  name: string
  type: string
  languages: string[]
  businessHours: {
    start: string
    end: string
    timezone: string
  }
  contextRules: {
    maxConversationLength: number
    retentionDays: number
    escalationTriggers: string[]
  }
  localTerms: Record<string, string>
  commonIssues: string[]
  escalationRules: {
    sentiment: boolean
    keywords: string[]
    responseTime: number
  }
}

interface BusinessConfigProps {
  businessType: string
}

export default function BusinessConfig({ businessType }: BusinessConfigProps) {
  const [configs, setConfigs] = useState<Record<string, BusinessConfig>>({
    telecom: {
      id: 'telecom',
      name: 'Telecommunications',
      type: 'telecom',
      languages: ['en', 'lg', 'sw'],
      businessHours: {
        start: '08:00',
        end: '20:00',
        timezone: 'Africa/Kampala'
      },
      contextRules: {
        maxConversationLength: 50,
        retentionDays: 30,
        escalationTriggers: ['billing dispute', 'network outage', 'urgent']
      },
      localTerms: {
        'bundles': 'data packages',
        'airtime': 'credit',
        'sente': 'money',
        'simu': 'phone'
      },
      commonIssues: [
        'Data bundle purchase',
        'Network connectivity',
        'Billing inquiries',
        'Roaming charges',
        'SIM card issues'
      ],
      escalationRules: {
        sentiment: true,
        keywords: ['angry', 'frustrated', 'complaint'],
        responseTime: 300
      }
    },
    banking: {
      id: 'banking',
      name: 'Banking Services',
      type: 'banking',
      languages: ['en', 'lg', 'sw'],
      businessHours: {
        start: '09:00',
        end: '17:00',
        timezone: 'Africa/Kampala'
      },
      contextRules: {
        maxConversationLength: 30,
        retentionDays: 90,
        escalationTriggers: ['fraud', 'security', 'loan application']
      },
      localTerms: {
        'sente': 'money',
        'akawuka': 'small money',
        'mobile money': 'mobile banking',
        'account': 'akaunt'
      },
      commonIssues: [
        'Account balance inquiry',
        'Mobile money transfer',
        'Loan application status',
        'Card activation',
        'ATM issues'
      ],
      escalationRules: {
        sentiment: true,
        keywords: ['fraud', 'security', 'unauthorized'],
        responseTime: 180
      }
    },
    utilities: {
      id: 'utilities',
      name: 'Utility Services',
      type: 'utilities',
      languages: ['en', 'lg'],
      businessHours: {
        start: '07:00',
        end: '19:00',
        timezone: 'Africa/Kampala'
      },
      contextRules: {
        maxConversationLength: 40,
        retentionDays: 60,
        escalationTriggers: ['outage', 'emergency', 'no water', 'no power']
      },
      localTerms: {
        'masanyu': 'electricity',
        'amazzi': 'water',
        'bill': 'bili',
        'meter': 'mita'
      },
      commonIssues: [
        'Power outage reporting',
        'Water supply issues',
        'Billing disputes',
        'Meter reading',
        'Service connection'
      ],
      escalationRules: {
        sentiment: true,
        keywords: ['emergency', 'outage', 'no power', 'no water'],
        responseTime: 120
      }
    },
    ecommerce: {
      id: 'ecommerce',
      name: 'E-commerce Platform',
      type: 'ecommerce',
      languages: ['en', 'lg', 'sw'],
      businessHours: {
        start: '06:00',
        end: '22:00',
        timezone: 'Africa/Kampala'
      },
      contextRules: {
        maxConversationLength: 35,
        retentionDays: 45,
        escalationTriggers: ['refund', 'damaged product', 'delivery delay']
      },
      localTerms: {
        'boda': 'motorcycle taxi',
        'delivery': 'bringing items',
        'order': 'oda',
        'payment': 'okusasula'
      },
      commonIssues: [
        'Order tracking',
        'Delivery status',
        'Payment issues',
        'Product returns',
        'Account problems'
      ],
      escalationRules: {
        sentiment: true,
        keywords: ['refund', 'damaged', 'late delivery'],
        responseTime: 240
      }
    }
  })

  const [editingConfig, setEditingConfig] = useState<BusinessConfig | null>(null)
  const [newTerm, setNewTerm] = useState({ key: '', value: '' })
  const [newIssue, setNewIssue] = useState('')

  const currentConfig = configs[businessType]

  const updateConfig = (updates: Partial<BusinessConfig>) => {
    setConfigs(prev => ({
      ...prev,
      [businessType]: { ...prev[businessType], ...updates }
    }))
  }

  const addLocalTerm = () => {
    if (newTerm.key && newTerm.value) {
      updateConfig({
        localTerms: { ...currentConfig.localTerms, [newTerm.key]: newTerm.value }
      })
      setNewTerm({ key: '', value: '' })
    }
  }

  const addCommonIssue = () => {
    if (newIssue) {
      updateConfig({
        commonIssues: [...currentConfig.commonIssues, newIssue]
      })
      setNewIssue('')
    }
  }

  const removeLocalTerm = (key: string) => {
    const { [key]: removed, ...rest } = currentConfig.localTerms
    updateConfig({ localTerms: rest })
  }

  const removeCommonIssue = (index: number) => {
    updateConfig({
      commonIssues: currentConfig.commonIssues.filter((_, i) => i !== index)
    })
  }

  return (
    <div className="space-y-6">
      {/* Business Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            {currentConfig.name} Configuration
          </CardTitle>
          <CardDescription>
            Configure AI behavior and context rules for {currentConfig.name.toLowerCase()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-sm font-medium">Supported Languages</Label>
              <div className="flex gap-2 mt-1">
                {currentConfig.languages.map((lang) => (
                  <Badge key={lang} variant="secondary">
                    {lang.toUpperCase()}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium">Business Hours</Label>
              <p className="text-sm text-gray-600 mt-1">
                {currentConfig.businessHours.start} - {currentConfig.businessHours.end}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium">Context Retention</Label>
              <p className="text-sm text-gray-600 mt-1">
                {currentConfig.contextRules.retentionDays} days
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="local-terms" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="local-terms">Local Terms</TabsTrigger>
          <TabsTrigger value="common-issues">Common Issues</TabsTrigger>
          <TabsTrigger value="escalation">Escalation Rules</TabsTrigger>
          <TabsTrigger value="context-rules">Context Rules</TabsTrigger>
        </TabsList>

        <TabsContent value="local-terms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Local Language Terms
              </CardTitle>
              <CardDescription>
                Define local language mappings for better understanding
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="term-key">Local Term</Label>
                  <Input
                    id="term-key"
                    value={newTerm.key}
                    onChange={(e) => setNewTerm({ ...newTerm, key: e.target.value })}
                    placeholder="e.g., sente"
                  />
                </div>
                <div>
                  <Label htmlFor="term-value">English Meaning</Label>
                  <div className="flex gap-2">
                    <Input
                      id="term-value"
                      value={newTerm.value}
                      onChange={(e) => setNewTerm({ ...newTerm, value: e.target.value })}
                      placeholder="e.g., money"
                    />
                    <Button onClick={addLocalTerm}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Current Terms</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {Object.entries(currentConfig.localTerms).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">
                        <strong>{key}</strong> → {value}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeLocalTerm(key)}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="common-issues" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Common Customer Issues
              </CardTitle>
              <CardDescription>
                Define typical issues customers face for better context understanding
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newIssue}
                  onChange={(e) => setNewIssue(e.target.value)}
                  placeholder="Enter a common issue..."
                />
                <Button onClick={addCommonIssue}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Current Issues</Label>
                <div className="space-y-2">
                  {currentConfig.commonIssues.map((issue, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">{issue}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCommonIssue(index)}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="escalation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Escalation Rules
              </CardTitle>
              <CardDescription>
                Configure when conversations should be escalated to human agents
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Sentiment-based Escalation</Label>
                    <p className="text-sm text-gray-600">Escalate when negative sentiment is detected</p>
                  </div>
                  <Switch
                    checked={currentConfig.escalationRules.sentiment}
                    onCheckedChange={(checked) => 
                      updateConfig({
                        escalationRules: { ...currentConfig.escalationRules, sentiment: checked }
                      })
                    }
                  />
                </div>

                <div>
                  <Label>Response Time Limit (seconds)</Label>
                  <Input
                    type="number"
                    value={currentConfig.escalationRules.responseTime}
                    onChange={(e) => 
                      updateConfig({
                        escalationRules: { 
                          ...currentConfig.escalationRules, 
                          responseTime: parseInt(e.target.value) 
                        }
                      })
                    }
                  />
                </div>

                <div>
                  <Label>Escalation Keywords</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {currentConfig.escalationRules.keywords.map((keyword, index) => (
                      <Badge key={index} variant="outline">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Escalation Triggers</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {currentConfig.contextRules.escalationTriggers.map((trigger, index) => (
                      <Badge key={index} variant="secondary">
                        {trigger}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="context-rules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Context Management Rules
              </CardTitle>
              <CardDescription>
                Configure how AI manages conversation context and memory
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="max-conversation">Max Conversation Length</Label>
                  <Input
                    id="max-conversation"
                    type="number"
                    value={currentConfig.contextRules.maxConversationLength}
                    onChange={(e) => 
                      updateConfig({
                        contextRules: {
                          ...currentConfig.contextRules,
                          maxConversationLength: parseInt(e.target.value)
                        }
                      })
                    }
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    Number of messages to keep in active memory
                  </p>
                </div>

                <div>
                  <Label htmlFor="retention-days">Context Retention (days)</Label>
                  <Input
                    id="retention-days"
                    type="number"
                    value={currentConfig.contextRules.retentionDays}
                    onChange={(e) => 
                      updateConfig({
                        contextRules: {
                          ...currentConfig.contextRules,
                          retentionDays: parseInt(e.target.value)
                        }
                      })
                    }
                  />
                  <p className="text-xs text-gray-600 mt-1">
                    How long to store conversation history
                  </p>
                </div>
              </div>

              <div>
                <Label htmlFor="business-hours-start">Business Hours</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <Label className="text-sm">Start Time</Label>
                    <Input
                      type="time"
                      value={currentConfig.businessHours.start}
                      onChange={(e) => 
                        updateConfig({
                          businessHours: {
                            ...currentConfig.businessHours,
                            start: e.target.value
                          }
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label className="text-sm">End Time</Label>
                    <Input
                      type="time"
                      value={currentConfig.businessHours.end}
                      onChange={(e) => 
                        updateConfig({
                          businessHours: {
                            ...currentConfig.businessHours,
                            end: e.target.value
                          }
                        })
                      }
                    />
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
