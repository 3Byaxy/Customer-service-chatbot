'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Plus, Edit, Trash2, Shield, Zap, Database } from 'lucide-react'

interface Rule {
  id: string
  name: string
  type: 'static' | 'dynamic'
  condition: string
  action: string
  priority: number
  enabled: boolean
  businessType?: string
}

interface RulesManagerProps {
  businessType: string
}

export default function RulesManager({ businessType }: RulesManagerProps) {
  const [rules, setRules] = useState<Rule[]>([
    {
      id: '1',
      name: 'Language Detection',
      type: 'static',
      condition: 'message.contains(luganda_keywords)',
      action: 'set_language("lg")',
      priority: 1,
      enabled: true,
      businessType: 'all'
    },
    {
      id: '2',
      name: 'Billing Inquiry Route',
      type: 'dynamic',
      condition: 'intent == "billing" && business == "telecom"',
      action: 'route_to_billing_agent()',
      priority: 2,
      enabled: true,
      businessType: 'telecom'
    },
    {
      id: '3',
      name: 'Emergency Response',
      type: 'static',
      condition: 'message.contains(["emergency", "urgent", "problem"])',
      action: 'escalate_priority()',
      priority: 10,
      enabled: true,
      businessType: 'all'
    }
  ])

  const [newRule, setNewRule] = useState<Partial<Rule>>({
    name: '',
    type: 'static',
    condition: '',
    action: '',
    priority: 5,
    enabled: true
  })

  const staticRuleTemplates = [
    {
      name: 'Greeting Response',
      condition: 'message.startsWith(["hello", "hi", "good"])',
      action: 'respond_greeting()'
    },
    {
      name: 'Profanity Filter',
      condition: 'message.contains(profanity_list)',
      action: 'filter_message()'
    },
    {
      name: 'Business Hours Check',
      condition: 'time.outside_business_hours()',
      action: 'show_offline_message()'
    }
  ]

  const dynamicRuleTemplates = [
    {
      name: 'Intent-Based Routing',
      condition: 'intent_confidence > 0.8',
      action: 'route_to_specialist(intent)'
    },
    {
      name: 'Sentiment Analysis',
      condition: 'sentiment == "negative"',
      action: 'escalate_to_human()'
    },
    {
      name: 'Context Memory',
      condition: 'user.previous_interactions > 0',
      action: 'load_conversation_history()'
    }
  ]

  const addRule = () => {
    if (newRule.name && newRule.condition && newRule.action) {
      const rule: Rule = {
        id: Date.now().toString(),
        name: newRule.name,
        type: newRule.type || 'static',
        condition: newRule.condition,
        action: newRule.action,
        priority: newRule.priority || 5,
        enabled: newRule.enabled !== false,
        businessType: businessType
      }
      setRules([...rules, rule])
      setNewRule({ name: '', type: 'static', condition: '', action: '', priority: 5, enabled: true })
    }
  }

  const toggleRule = (id: string) => {
    setRules(rules.map(rule => 
      rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
    ))
  }

  const deleteRule = (id: string) => {
    setRules(rules.filter(rule => rule.id !== id))
  }

  const filteredRules = rules.filter(rule => 
    rule.businessType === 'all' || rule.businessType === businessType
  )

  return (
    <div className="space-y-6">
      {/* Rules Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Static Rules</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredRules.filter(r => r.type === 'static').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Fixed condition-action pairs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dynamic Rules</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredRules.filter(r => r.type === 'dynamic').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Context-aware rules
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Rules</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredRules.filter(r => r.enabled).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently enabled
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="rules" className="space-y-4">
        <TabsList>
          <TabsTrigger value="rules">Active Rules</TabsTrigger>
          <TabsTrigger value="create">Create Rule</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rules for {businessType}</CardTitle>
              <CardDescription>
                Manage static and dynamic rules that control AI behavior
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredRules.map((rule) => (
                  <div key={rule.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{rule.name}</h3>
                        <Badge variant={rule.type === 'static' ? 'default' : 'secondary'}>
                          {rule.type}
                        </Badge>
                        <Badge variant="outline">Priority: {rule.priority}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={rule.enabled}
                          onCheckedChange={() => toggleRule(rule.id)}
                        />
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => deleteRule(rule.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>Condition:</strong> {rule.condition}</p>
                      <p><strong>Action:</strong> {rule.action}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create New Rule</CardTitle>
              <CardDescription>
                Define conditions and actions for AI behavior
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rule-name">Rule Name</Label>
                  <Input
                    id="rule-name"
                    value={newRule.name || ''}
                    onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                    placeholder="Enter rule name"
                  />
                </div>
                <div>
                  <Label htmlFor="rule-type">Rule Type</Label>
                  <select
                    id="rule-type"
                    className="w-full p-2 border rounded-md"
                    value={newRule.type || 'static'}
                    onChange={(e) => setNewRule({ ...newRule, type: e.target.value as 'static' | 'dynamic' })}
                  >
                    <option value="static">Static</option>
                    <option value="dynamic">Dynamic</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="rule-condition">Condition</Label>
                <Textarea
                  id="rule-condition"
                  value={newRule.condition || ''}
                  onChange={(e) => setNewRule({ ...newRule, condition: e.target.value })}
                  placeholder="e.g., message.contains(['help', 'support'])"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="rule-action">Action</Label>
                <Textarea
                  id="rule-action"
                  value={newRule.action || ''}
                  onChange={(e) => setNewRule({ ...newRule, action: e.target.value })}
                  placeholder="e.g., route_to_support_agent()"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rule-priority">Priority (1-10)</Label>
                  <Input
                    id="rule-priority"
                    type="number"
                    min="1"
                    max="10"
                    value={newRule.priority || 5}
                    onChange={(e) => setNewRule({ ...newRule, priority: parseInt(e.target.value) })}
                  />
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <Switch
                    id="rule-enabled"
                    checked={newRule.enabled !== false}
                    onCheckedChange={(checked) => setNewRule({ ...newRule, enabled: checked })}
                  />
                  <Label htmlFor="rule-enabled">Enabled</Label>
                </div>
              </div>

              <Button onClick={addRule} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Create Rule
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Static Rule Templates
                </CardTitle>
                <CardDescription>
                  Pre-defined rules with fixed conditions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {staticRuleTemplates.map((template, idx) => (
                  <div key={idx} className="border rounded-lg p-3">
                    <h4 className="font-medium mb-2">{template.name}</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>Condition:</strong> {template.condition}</p>
                      <p><strong>Action:</strong> {template.action}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-2"
                      onClick={() => setNewRule({
                        ...newRule,
                        name: template.name,
                        type: 'static',
                        condition: template.condition,
                        action: template.action
                      })}
                    >
                      Use Template
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Dynamic Rule Templates
                </CardTitle>
                <CardDescription>
                  Context-aware rules that adapt to situations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {dynamicRuleTemplates.map((template, idx) => (
                  <div key={idx} className="border rounded-lg p-3">
                    <h4 className="font-medium mb-2">{template.name}</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><strong>Condition:</strong> {template.condition}</p>
                      <p><strong>Action:</strong> {template.action}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-2"
                      onClick={() => setNewRule({
                        ...newRule,
                        name: template.name,
                        type: 'dynamic',
                        condition: template.condition,
                        action: template.action
                      })}
                    >
                      Use Template
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
