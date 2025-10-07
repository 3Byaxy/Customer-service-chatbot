# 🏗️ KyakuShien Architecture (v2) — Scalable, Multi‑Tenant, and Modular

This document replaces and condenses the previous architecture write‑up. It focuses on a scalable, agile, and multi‑tenant design that matches the current Next.js codebase and the new multi‑tenant scaffolding.

## Goals
- Multi‑tenant by design (each business gets isolated data, keys, and dashboards)
- Modular services with clear boundaries (language, AI routing, approvals, realtime)
- Cost‑efficient provider routing (Gemini/Groq/OpenAI/Anthropic) with graceful fallbacks
- Realtime user experience (SSE/WebSocket) without locking us into one vendor
- Production‑grade observability, rate limiting, and security
- Simple first deployment (Vercel + Supabase/Neon/Upstash) with a path to containers/Kubernetes

---

## High‑Level Architecture
```
┌──────────────────────────────────────────────────────────────────────────┐
│                          Presentation & BFF (Next.js)                    │
│  - app/ pages & components (UI)                                          │
│  - app/api/* (BFF routes: chat, voice, approvals, admin, embed)          │
│  - Edge/Node runtimes chosen per route (streaming, CPU, secrets)         │
└──────────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                         Domain & Services (Core)                         │
│  - Core models (Tenant, Conversation, Approval, Event)                   │
│  - Service interfaces (LanguageDetector, Approvals, AI Router, Realtime) │
│  - Adapters in environment/* implement interfaces                        │
└──────────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                         Integration & Persistence                        │
│  - PostgreSQL (Supabase/Neon): tenants, members, conversations, logs     │
│  - Redis/Upstash: rate limits, sessions, job queue, pub/sub              │
│  - Object storage (S3/Supabase): exports, audio blobs (optional)         │
│  - Third‑party AI providers (Gemini/Groq/OpenAI/Anthropic)                │
└──────────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                        Observability & Operations                        │
│  - OpenTelemetry traces/metrics + logs                                   │
│  - Feature flags + safe migrations                                       │
│  - CI/CD + canary rollout                                                │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Multi‑Tenancy (per tenant isolation)
- Each tenant has: id, status (pending/approved/suspended), API/public keys, dashboard settings.
- All write/read operations are scoped by `tenant_id` (resolver in lib/tenant.ts).
- Embed flow issues short‑lived tokens for the compact widget.
- Admin dashboard and metrics are filtered by tenant.

Tables (proposed)
- tenants, tenant_api_keys, tenant_members, conversations, approvals, dashboards, events

See docs/MULTI_TENANCY.md for details and the provisioning/approval/token routes.

---

## Service Boundaries (Ports & Adapters)
- Language Detection: `environment/language-detection.ts` implements `ILanguageDetector`
- Approvals: `environment/approval-system.ts` implements `IApprovalsService`
- Realtime: `environment/realtime-apis.ts` implements `IRealtimeBus`
- AI Routing: app/api/chat/route.ts orchestrates selection; extract to adapter when we harden logic
- Logging: `environment/logging.ts` (dev‑safe DB fallback); in prod writes to DB and ships traces

Benefits
- Testable modules behind interfaces
- Swap implementations (e.g., cloud queue vs. in‑process) without changing API routes

---

## Request Lifecycle
1) UI calls app/api/* (BFF). Tenant context resolved (session, API key, or embed token).
2) BFF validates input, applies rate limits, and routes to domain services.
3) Services call adapters (AI, language, approvals) and DB/Redis as needed.
4) Responses stream back when possible (text streaming), otherwise JSON.
5) Events (complaint/escalation) broadcast via realtime bus (SSE/WebSocket) to tenant admins.

---

## Realtime
- Default: SSE (simple to run, works on serverless). WebSocket optional via Pusher/Ably/Supabase Realtime or a dedicated WS server.
- Realtime events: complaint updates, escalations, voice calls, system status.

---

## Scalability Plan
- Stateless BFF: keep session/ratelimit state in Redis and tenant/operational data in Postgres
- Horizontal scale:
  - Next.js on Vercel or containers (multiple instances)
  - Redis for queue/pub‑sub (Upstash), Postgres with read replicas
- Streaming: prefer Edge runtime for pure streaming routes; Node runtime for SDKs that require Node
- Background jobs (optional):
  - Queue worker for heavy tasks (transcription, export, analytics roll‑ups)
  - Triggered via Redis streams/queues
- Caching & performance:
  - Short‑term response cache for static admin metrics
  - Per‑tenant feature flags to gradually enable heavyweight features

---

## Security & Compliance
- Secrets via environment only (no hard‑coded fallbacks)
- Short‑lived embed tokens (JWT) for the widget; separate server API keys
- Row‑level security (if using Supabase Postgres)
- Rate limiting per tenant API key
- Audit logging for admin actions and approvals

---

## Observability & SLOs
- Tracing (OpenTelemetry): BFF route spans, provider calls, DB queries
- Metrics: p95 response time, error rate, token spend per tenant, approval SLAs
- Logs: structured logs with tenant_id, route, request_id
- SLO targets: 99.9% uptime for BFF, < 1s median response for chat with streaming

---

## Deployment Options
- Simple: Vercel (Next) + Supabase/Neon (Postgres) + Upstash (Redis)
- Container: Docker images + Fly.io/AWS ECS/GKE, using the same module boundaries
- Edge & Node mix: choose per route based on SDK/runtime needs

---

## Implementation Roadmap (phased)
- Phase 1 (Done/In Progress):
  - Clean landing, routed feature pages, dev‑safe embed & tenant scaffolding
  - Docs: WARP.md, DEVELOPERS.md, MULTI_TENANCY.md, EMBED.md
- Phase 2:
  - Wire tenant resolver into all APIs; scope queries by tenant_id
  - Add Redis rate limiting & queue; extract AI routing into its own adapter
  - Add OpenTelemetry + centralized logs
- Phase 3:
  - Multi‑tenant admin & billing, advanced analytics, exports to object storage
  - Optional WS server or Pusher/Ably for realtime at scale

---

## Current Module Map (repo)
- app/ … UI + BFF routes (API)
- components/ … UI components
- environment/ … service adapters (lang detection, approvals, realtime, logging, voice)
- backend/ … optional express service
- lib/ … tenant resolver, tokens, in‑memory dev store
- core/ … NEW (interfaces for domain & services)
- docs/ … NEW architecture/ADR/ops docs

This structure lets us grow from a single repo into a multi‑service deployment without churn.

## 🎯 System Overview

The Kyaku Shien (Customer Support) Chatbot is a comprehensive AI-powered customer service platform designed specifically for the Ugandan market, with multi-language support and advanced voice capabilities.

## 🏛️ Architecture Principles

### 1. **Modular Design**

- **Separation of Concerns**: Each service handles a specific responsibility
- **Microservices Architecture**: Independent, scalable components
- **Plugin-based Extensions**: Easy addition of new AI providers and features

### 2. **Security First**

- **API Key Protection**: Secure routing prevents direct key exposure
- **Rate Limiting**: Prevents API abuse and ensures fair usage
- **Environment-based Configuration**: Sensitive data stored securely

### 3. **Scalability & Performance**

- **Asynchronous Processing**: Non-blocking operations
- **Caching Layer**: Response optimization
- **Load Balancing Ready**: Horizontal scaling support

### 4. **Multi-language Support**

- **Local Language Priority**: Luganda, Swahili, English
- **Cultural Adaptation**: Context-aware responses
- **Unicode Support**: Proper character encoding

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    🎯 USER INTERFACE LAYER                      │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Web Chat Interface  │  Admin Dashboard  │  Voice Chat  │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                 🚀 API GATEWAY & ROUTING LAYER                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  /api/chat  │  /api/voice  │  /api/admin  │  /api/ai    │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                   🤖 AI AGENTS & SERVICES LAYER                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ ElevenLabs │  Vapi     │ Voiceflow │  Gemini   │ Groq   │    │
│  │ Conversational│ Voice   │ Dialogue  │  Primary  │ Fast   │    │
│  │ Agent       │ Agents  │ Flows    │  AI       │ AI     │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                 🔐 SECURITY & INTEGRATION LAYER                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ API Key Router │ Rate Limiting │ n8n Integration │ Auth │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                   💾 DATA & PERSISTENCE LAYER                    │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ PostgreSQL │ Redis Cache │ File Storage │  Logging     │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

## 🎨 Component Details

### 1. **User Interface Layer**

#### Web Chat Interface

- **Technology**: Next.js 14, React, TypeScript
- **Features**:
  - Real-time chat with WebSocket support
  - Multi-language interface
  - Voice message recording/playback
  - File upload capabilities
  - Responsive design for mobile/desktop

#### Admin Dashboard

- **Technology**: Next.js Admin Routes, Shadcn/ui
- **Features**:
  - Live monitoring and analytics
  - Conversation management
  - System configuration
  - Testing console for AI agents
  - Performance metrics

#### Voice Chat Interface

- **Technology**: Web Audio API, ElevenLabs Integration
- **Features**:
  - Voice message recording
  - Real-time audio playback
  - Multi-language voice support
  - Audio quality optimization

### 2. **API Gateway & Routing Layer**

#### RESTful API Design

- **Base URL**: `/api`
- **Endpoints**:
  - `/api/chat` - Main chat processing
  - `/api/voice` - Voice operations
  - `/api/admin` - Administrative functions
  - `/api/ai-agents` - AI agent management

#### Request Flow

```
Client Request → Middleware → Route Handler → Service Layer → Response
```

### 3. **AI Agents & Services Layer**

#### Agent Types

1. **Conversational Agents** (ElevenLabs)

   - Natural language processing
   - Context-aware responses
   - Multi-turn conversations

2. **Voice Agents** (Vapi)

   - Telephone-based conversations
   - Real-time voice processing
   - Call routing and management

3. **Dialogue Flow Agents** (Voiceflow)

   - Structured conversation flows
   - Intent recognition
   - Decision tree navigation

4. **General AI Agents** (Gemini, Groq)
   - Text-based responses
   - Fast inference
   - Cost-effective processing

#### Agent Selection Logic

```typescript
Priority Order:
1. ElevenLabs Conversational (for customer support)
2. Voiceflow Dialogue (for structured queries)
3. Vapi Voice (for phone calls)
4. Gemini/Groq (for general chat)
```

### 4. **Security & Integration Layer**

#### API Key Router

- **Purpose**: Secure API key management
- **Features**:
  - Encrypted key storage
  - Rate limiting per service
  - Automatic header injection
  - Request/response logging

#### n8n Integration

- **Purpose**: Workflow automation
- **Triggers**:
  - Conversation started/ended
  - Escalation events
  - System alerts
  - Performance monitoring

### 5. **Data & Persistence Layer**

#### Database Schema

```sql
-- Core Tables
conversations (id, user_id, agent_id, messages, metadata)
sessions (id, conversation_id, start_time, end_time, status)
agents (id, provider, config, status)
logs (id, level, message, timestamp, metadata)
```

#### Caching Strategy

- **Redis**: Session storage, rate limiting
- **Memory**: Frequently accessed configurations
- **CDN**: Static assets and audio files

## 🔄 Data Flow Architecture

### 1. **Incoming Message Flow**

```
User Message
    ↓
Language Detection
    ↓
AI Agent Routing
    ↓
Service Processing
    ↓
Response Generation
    ↓
User Response
```

### 2. **Voice Processing Flow**

```
Audio Input
    ↓
Speech-to-Text
    ↓
Language Detection
    ↓
AI Processing
    ↓
Text-to-Speech
    ↓
Audio Response
```

### 3. **Admin Monitoring Flow**

```
System Events
    ↓
Logging Service
    ↓
Analytics Processing
    ↓
Dashboard Updates
    ↓
Admin Notifications
```

## 🛡️ Security Architecture

### 1. **API Security**

- **Authentication**: JWT tokens for admin access
- **Authorization**: Role-based access control
- **Rate Limiting**: Per-user and per-service limits
- **Input Validation**: Comprehensive request validation

### 2. **Data Security**

- **Encryption**: AES-256-GCM for sensitive data
- **Key Management**: Environment-based key storage
- **Audit Logging**: All API interactions logged
- **Data Sanitization**: Input/output filtering

### 3. **Infrastructure Security**

- **HTTPS Only**: All communications encrypted
- **CORS Policy**: Restricted cross-origin access
- **Helmet.js**: Security headers
- **Environment Isolation**: Separate dev/prod environments

## 📊 Performance Architecture

### 1. **Caching Strategy**

- **Application Level**: Response caching
- **Database Level**: Query result caching
- **CDN Level**: Static asset delivery

### 2. **Optimization Techniques**

- **Lazy Loading**: Components loaded on demand
- **Code Splitting**: Bundle size optimization
- **Image Optimization**: Automatic compression
- **Database Indexing**: Optimized queries

### 3. **Monitoring & Metrics**

- **Response Times**: API endpoint monitoring
- **Error Rates**: Comprehensive error tracking
- **Resource Usage**: Memory and CPU monitoring
- **User Analytics**: Conversation quality metrics

## 🚀 Scalability Architecture

### 1. **Horizontal Scaling**

- **Load Balancer**: Nginx/HAProxy
- **Application Servers**: Multiple Node.js instances
- **Database Clustering**: PostgreSQL replication
- **Cache Distribution**: Redis cluster

### 2. **Microservices Ready**

- **Service Discovery**: Consul/Eureka
- **API Gateway**: Kong/Traefik
- **Container Orchestration**: Docker/Kubernetes
- **Service Mesh**: Istio/Linkerd

### 3. **Cloud-Native Design**

- **Serverless Functions**: AWS Lambda/Azure Functions
- **Managed Databases**: AWS RDS/Google Cloud SQL
- **CDN Integration**: Cloudflare/AWS CloudFront
- **Auto Scaling**: Based on traffic patterns

## 🌍 Multi-language Architecture

### 1. **Language Detection**

- **Primary Detection**: Whatlanggo algorithm
- **Fallback Detection**: Custom keyword matching
- **Confidence Scoring**: Multi-factor analysis

### 2. **Language Processing**

- **English**: Native support
- **Luganda**: Custom phonetic processing
- **Swahili**: Regional dialect handling
- **Mixed Language**: Code-switching support

### 3. **Cultural Adaptation**

- **Local Context**: Uganda-specific references
- **Cultural Sensitivity**: Appropriate responses
- **Regional Variations**: Location-based customization

## 🔧 Development Architecture

### 1. **Technology Stack**

- **Frontend**: Next.js 14, React 18, TypeScript
- **Backend**: Next.js API Routes, Node.js
- **Database**: PostgreSQL, Redis
- **AI Integration**: Multiple providers (ElevenLabs, Gemini, etc.)
- **Deployment**: Vercel/Netlify

### 2. **Development Workflow**

- **Version Control**: Git with feature branches
- **Code Quality**: ESLint, Prettier, TypeScript
- **Testing**: Jest, React Testing Library
- **CI/CD**: GitHub Actions, Vercel deployments

### 3. **Code Organization**

```
src/
├── app/                 # Next.js app directory
├── backend/            # Backend services
├── components/         # React components
├── environment/        # Configuration & utilities
├── lib/               # Utility libraries
└── styles/            # CSS styles
```

## 🎯 Business Logic Architecture

### 1. **Customer Support Flow**

```
Customer Inquiry
    ↓
Language Detection
    ↓
Intent Analysis
    ↓
Business Context Matching
    ↓
AI Agent Selection
    ↓
Response Generation
    ↓
Quality Assurance
    ↓
Customer Response
```

### 2. **Escalation Logic**

```
Low Complexity → AI Response
Medium Complexity → Human Review
High Complexity → Immediate Escalation
Critical Issues → Emergency Protocol
```

### 3. **Quality Assurance**

- **Response Validation**: AI-powered quality checks
- **Sentiment Analysis**: Customer satisfaction monitoring
- **Performance Metrics**: Response time and accuracy tracking
- **Continuous Learning**: Feedback loop for improvement

## 📈 Analytics & Reporting Architecture

### 1. **Real-time Metrics**

- **Conversation Volume**: Messages per hour/day
- **Response Times**: Average handling time
- **Customer Satisfaction**: Sentiment analysis scores
- **Agent Performance**: Success rates by agent type

### 2. **Business Intelligence**

- **Usage Patterns**: Peak hours, popular topics
- **Geographic Distribution**: Location-based analytics
- **Language Preferences**: Popular language usage
- **Escalation Rates**: Human intervention frequency

### 3. **Reporting Dashboard**

- **Executive Summary**: High-level KPIs
- **Detailed Analytics**: Drill-down capabilities
- **Custom Reports**: Configurable dashboards
- **Export Functionality**: PDF/Excel reports

## 🔮 Future Architecture Considerations

### 1. **AI Advancements**

- **Large Language Models**: GPT-4, Claude integration
- **Multi-modal AI**: Image/text/audio processing
- **Personalization**: User profile-based responses
- **Continuous Learning**: Model fine-tuning

### 2. **Platform Extensions**

- **Mobile Apps**: React Native implementation
- **Voice Assistants**: Alexa/Google Home integration
- **WhatsApp Integration**: Direct messaging support
- **Social Media**: Facebook Messenger, Twitter integration

### 3. **Advanced Features**

- **Predictive Analytics**: Issue prediction
- **Automated Workflows**: Complex business processes
- **Multi-channel Support**: Unified customer experience
- **Real-time Collaboration**: Agent-to-agent support

---

## 🎉 Conclusion

The Kyaku Shien Chatbot architecture represents a comprehensive, scalable, and secure solution for AI-powered customer service in Uganda. The modular design ensures easy maintenance and extension, while the security-first approach protects sensitive data and prevents misuse.

**Key Architectural Strengths:**

- ✅ Modular and extensible design
- ✅ Security-focused implementation
- ✅ Multi-language and cultural support
- ✅ Scalable microservices architecture
- ✅ Comprehensive monitoring and analytics
- ✅ Future-ready for advanced AI features

This architecture successfully bridges the gap between traditional customer service and modern AI-powered solutions, providing a robust foundation for delivering exceptional customer experiences in the Ugandan market.
