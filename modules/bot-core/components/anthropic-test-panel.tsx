'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Brain, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

export default function AnthropicTestPanel() {
  const [testMessage, setTestMessage] = useState('Hello, I need help with my account balance.')
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null)
  const [errorDetails, setErrorDetails] = useState('')

  const testAnthropicConnection = async () => {
    setIsLoading(true)
    setTestResult(null)
    setErrorDetails('')
    setResponse('')

    try {
      const res = await fetch('/api/anthropic-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: testMessage })
      })

      const data = await res.json()

      if (data.success) {
        setTestResult('success')
        setResponse(data.response)
      } else {
        setTestResult('error')
        setErrorDetails(data.error + (data.details ? `: ${data.details}` : ''))
      }
    } catch (error) {
      setTestResult('error')
      setErrorDetails('Network error: Could not connect to API')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-600" />
          Test Anthropic Claude Integration
        </CardTitle>
        <CardDescription>
          Test your Anthropic API connection and Claude model response
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">Test Message</label>
          <Input
            value={testMessage}
            onChange={(e) => setTestMessage(e.target.value)}
            placeholder="Enter a test customer message..."
            className="mt-1"
          />
        </div>

        <Button 
          onClick={testAnthropicConnection} 
          disabled={isLoading || !testMessage.trim()}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Testing Connection...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Test Anthropic Claude
            </>
          )}
        </Button>

        {testResult === 'success' && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span className="font-medium">Connection Successful!</span>
              <Badge variant="secondary">Claude 3.5 Sonnet</Badge>
            </div>
            <div>
              <label className="text-sm font-medium">Claude's Response:</label>
              <Textarea
                value={response}
                readOnly
                className="mt-1 bg-green-50 border-green-200"
                rows={4}
              />
            </div>
          </div>
        )}

        {testResult === 'error' && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span className="font-medium">Connection Failed</span>
            </div>
            <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800">
              <strong>Error:</strong> {errorDetails}
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm">
              <strong>Setup Instructions:</strong>
              <ol className="mt-2 space-y-1 list-decimal list-inside">
                <li>Visit <a href="https://console.anthropic.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">console.anthropic.com</a></li>
                <li>Create an account or sign in</li>
                <li>Go to API Keys section</li>
                <li>Create a new API key</li>
                <li>Add it to your environment: <code className="bg-gray-100 px-1 rounded">ANTHROPIC_API_KEY=your_key_here</code></li>
                <li>Install the SDK: <code className="bg-gray-100 px-1 rounded">npm install @ai-sdk/anthropic</code></li>
              </ol>
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500 space-y-1">
          <p><strong>What this tests:</strong></p>
          <ul className="list-disc list-inside space-y-1">
            <li>Anthropic API key configuration</li>
            <li>Claude 3.5 Sonnet model access</li>
            <li>Response generation capability</li>
            <li>Integration with AI SDK</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
