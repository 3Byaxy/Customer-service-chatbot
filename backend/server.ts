/**
 * Backend Server for Kyaku Shien Chatbot
 *
 * This file serves as a standalone backend server for the chatbot system.
 * Currently, the application primarily uses Next.js API routes, but this server
 * can be used for additional backend services or as a separate microservice.
 *
 * To run: npm run backend:dev
 */

import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import { approvalSystem } from './services/approval-system'
import { languageDetector } from './services/language-detection'

const app = express()
const PORT = process.env.BACKEND_PORT || 4000

// Middleware
app.use(helmet())
app.use(cors())
app.use(express.json())

// Health check endpoint
app.get('/health', (req: any, res: any) => {
  res.json({
    status: 'healthy',
    service: 'kyaku-shien-backend',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  })
})

// Language detection endpoint
app.post('/api/language-detect', async (req: any, res: any) => {
  try {
    const { message } = req.body
    const detection = languageDetector.detectLanguage(message)
    res.json(detection)
  } catch (error) {
    console.error('Language detection error:', error)
    res.status(500).json({ error: 'Language detection failed' })
  }
})

// Approval system endpoint
app.post('/api/approval/check', async (req: any, res: any) => {
  try {
    const { message, businessType } = req.body
    const needsApproval = await approvalSystem.checkApprovalRequired(message, businessType)
    res.json({ needsApproval })
  } catch (error) {
    console.error('Approval check error:', error)
    res.status(500).json({ error: 'Approval check failed' })
  }
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Kyaku Shien Backend Server running on port ${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/health`)
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Shutting down gracefully...')
  process.exit(0)
})

process.on('SIGINT', () => {
  console.log('🛑 Shutting down gracefully...')
  process.exit(0)
})

export default app