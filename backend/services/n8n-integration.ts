// N8N Integration Service for workflow automation
export interface WorkflowTriggerData {
  message: string
  businessType: string
  analysis?: any
  timestamp: Date
  [key: string]: any
}

class N8NIntegrationService {
  private baseUrl: string
  private webhookToken: string

  constructor() {
    this.baseUrl = process.env.N8N_WEBHOOK_URL || 'http://localhost:5678'
    this.webhookToken = process.env.N8N_WEBHOOK_TOKEN || 'demo-token'
  }

  async triggerWorkflow(workflowName: string, data: WorkflowTriggerData): Promise<boolean> {
    try {
      // In development, just log the workflow trigger
      if (process.env.NODE_ENV === 'development') {
        console.log(`🔄 N8N Workflow Triggered: ${workflowName}`, {
          message: data.message,
          businessType: data.businessType,
          timestamp: data.timestamp
        })
        return true
      }

      // In production, make actual HTTP request to N8N webhook
      const response = await fetch(`${this.baseUrl}/webhook/${workflowName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.webhookToken}`
        },
        body: JSON.stringify({
          ...data,
          workflowName,
          triggeredAt: new Date().toISOString()
        })
      })

      if (!response.ok) {
        console.error(`N8N workflow ${workflowName} failed:`, response.statusText)
        return false
      }

      console.log(`✅ N8N workflow ${workflowName} triggered successfully`)
      return true
    } catch (error) {
      console.error(`N8N workflow ${workflowName} error:`, error)
      return false
    }
  }

  async triggerComplaintEscalation(data: WorkflowTriggerData): Promise<boolean> {
    return this.triggerWorkflow('complaint-escalation', {
      ...data,
      priority: 'high',
      escalationType: 'complaint'
    })
  }

  async triggerLanguageDetection(data: WorkflowTriggerData): Promise<boolean> {
    return this.triggerWorkflow('language-detected', {
      ...data,
      eventType: 'language-detection'
    })
  }

  async triggerAnalyticsEvent(eventName: string, data: any): Promise<boolean> {
    return this.triggerWorkflow('analytics-event', {
      message: `Analytics event: ${eventName}`,
      businessType: 'analytics',
      eventName,
      data,
      timestamp: new Date()
    })
  }
}

export const n8nIntegrationService = new N8NIntegrationService()