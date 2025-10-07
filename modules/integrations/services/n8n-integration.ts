export interface N8nWebhookPayload {
  event: string
  data: any
  timestamp: Date
}

export interface N8nWorkflow {
  id: string
  name: string
  webhookUrl: string
  triggers: string[]
}

class N8nIntegrationService {
  private workflows: N8nWorkflow[] = [
    {
      id: 'complaint-escalation',
      name: 'Complaint Escalation Workflow',
      webhookUrl: 'https://n8n-instance.com/webhook/complaint-escalation',
      triggers: ['complaint', 'escalation', 'urgent'],
    },
    {
      id: 'language-routing',
      name: 'Language-Based Routing',
      webhookUrl: 'https://n8n-instance.com/webhook/language-routing',
      triggers: ['language-detected', 'agent-routed'],
    },
    {
      id: 'notification-system',
      name: 'Admin Notifications',
      webhookUrl: 'https://n8n-instance.com/webhook/notifications',
      triggers: ['approval-requested', 'system-alert'],
    },
  ]

  async triggerWorkflow(trigger: string, data: any): Promise<void> {
    const matchingWorkflows = this.workflows.filter(w => w.triggers.includes(trigger))

    for (const workflow of matchingWorkflows) {
      await this.sendWebhook(workflow.webhookUrl, {
        event: trigger,
        data,
        timestamp: new Date(),
      })
    }
  }

  private async sendWebhook(url: string, payload: N8nWebhookPayload): Promise<void> {
    try {
      // In real implementation, make HTTP request to n8n webhook
      console.log(`Sending webhook to ${url}:`, payload)

      // Simulate webhook call
      // const response = await fetch(url, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(payload),
      // })

      // if (!response.ok) {
      //   throw new Error(`Webhook failed: ${response.statusText}`)
      // }
    } catch (error) {
      console.error('N8n webhook error:', error)
      // Handle error (retry, logging, etc.)
    }
  }

  getWorkflows(): N8nWorkflow[] {
    return this.workflows
  }

  addWorkflow(workflow: N8nWorkflow): void {
    this.workflows.push(workflow)
  }

  async handleIncomingWebhook(payload: N8nWebhookPayload): Promise<void> {
    console.log('Received n8n webhook:', payload)

    // Process incoming webhooks from n8n workflows
    switch (payload.event) {
      case 'workflow-completed':
        await this.handleWorkflowCompletion(payload.data)
        break
      case 'error':
        await this.handleWorkflowError(payload.data)
        break
      default:
        console.log('Unhandled webhook event:', payload.event)
    }
  }

  private async handleWorkflowCompletion(data: any): Promise<void> {
    // Handle successful workflow completion
    console.log('Workflow completed:', data)
    // Update database, send notifications, etc.
  }

  private async handleWorkflowError(data: any): Promise<void> {
    // Handle workflow errors
    console.error('Workflow error:', data)
    // Log error, retry, alert admins, etc.
  }
}

export const n8nIntegrationService = new N8nIntegrationService()