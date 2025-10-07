# Modular Refactoring Design Document

## Executive Summary

This document outlines a comprehensive architectural refactoring plan to transform the existing monolithic customer service chatbot codebase into a modular structure with four main modules: `bot-core`, `integrations`, `dashboard`, and `data`. The refactoring aims to improve maintainability, scalability, and enterprise readiness while preserving all existing functionality.

## Current Architecture Analysis

### Existing Structure

The current codebase is organized as follows:

- **app/**: Next.js pages and API routes
- **backend/**: Server-side logic, APIs, and services
- **components/**: React UI components
- **environment/**: Configuration files and utilities
- **frontend/**: Additional frontend components
- **lib/**: Shared utilities
- **public/**: Static assets
- **scripts/**: Database scripts
- **styles/**: CSS stylesheets

### Key Findings

- Mixed concerns across directories (UI, business logic, data access)
- Tight coupling between components and services
- Scattered configuration files
- No clear module boundaries
- Difficult to scale individual features

## Proposed Modular Architecture

### Module Overview

#### 1. bot-core Module

**Purpose**: Core chatbot functionality and user interaction
**Responsibilities**:

- Chat interfaces and user experience
- AI agent orchestration
- Context management
- Language detection and processing
- Conversation flow management
- Business rule processing

#### 2. integrations Module

**Purpose**: External API integrations and third-party services
**Responsibilities**:

- ElevenLabs TTS/STT integration
- N8N workflow automation
- Voice service providers (Vapi, Voiceflow)
- AI model providers (Anthropic, Gemini, Hugging Face)
- API key management and routing
- External service monitoring

#### 3. dashboard Module

**Purpose**: Administrative interface and system monitoring
**Responsibilities**:

- Admin dashboard components
- Performance metrics and analytics
- System logs and monitoring
- User management
- Conversation analytics
- Database health monitoring

#### 4. data Module

**Purpose**: Data management and persistence
**Responsibilities**:

- Database schemas and migrations
- Data access layer
- Connection pooling and optimization
- Data validation and sanitization
- Query optimization and caching

### Proposed Directory Structure

```
/
├── modules/
│   ├── bot-core/
│   │   ├── components/          # Chat-related UI components
│   │   ├── services/           # Core business logic services
│   │   ├── api/               # Chatbot API endpoints
│   │   ├── config/            # Module-specific configurations
│   │   └── types/             # TypeScript type definitions
│   ├── integrations/
│   │   ├── services/          # External service integrations
│   │   ├── api/              # Integration API endpoints
│   │   ├── config/           # API keys and connection configs
│   │   └── providers/        # Third-party provider abstractions
│   ├── dashboard/
│   │   ├── components/       # Admin UI components
│   │   ├── api/             # Admin API endpoints
│   │   ├── services/        # Dashboard business logic
│   │   └── config/          # Dashboard configurations
│   └── data/
│       ├── schema/          # Database schemas
│       ├── migrations/      # Database migrations
│       ├── config/         # Database configurations
│       └── utils/          # Data utilities and helpers
├── shared/
│   ├── components/         # Shared UI components (buttons, etc.)
│   ├── utils/             # Common utilities
│   ├── types/            # Shared type definitions
│   └── config/           # Global configurations
├── app/                   # Next.js app directory (preserved)
├── public/               # Static assets (preserved)
├── styles/              # Global styles (preserved)
├── scripts/             # Build and deployment scripts
├── package.json         # Dependencies (preserved)
├── next.config.mjs      # Next.js config (preserved)
└── ...
```

## Detailed File Mapping

### bot-core Module Migrations

| Current Location                               | New Location                                                    |
| ---------------------------------------------- | --------------------------------------------------------------- |
| `components/chat-interface.tsx`                | `modules/bot-core/components/chat-interface.tsx`                |
| `components/ai-analysis-panel.tsx`             | `modules/bot-core/components/ai-analysis-panel.tsx`             |
| `components/context-manager.tsx`               | `modules/bot-core/components/context-manager.tsx`               |
| `components/question-insights.tsx`             | `modules/bot-core/components/question-insights.tsx`             |
| `components/voice-chat-interface.tsx`          | `modules/bot-core/components/voice-chat-interface.tsx`          |
| `components/compact-chatbot-widget.tsx`        | `modules/bot-core/components/compact-chatbot-widget.tsx`        |
| `components/realtime-complaints-dashboard.tsx` | `modules/bot-core/components/realtime-complaints-dashboard.tsx` |
| `components/rules-manager.tsx`                 | `modules/bot-core/components/rules-manager.tsx`                 |
| `components/business-config.tsx`               | `modules/bot-core/components/business-config.tsx`               |
| `components/anthropic-test-panel.tsx`          | `modules/bot-core/components/anthropic-test-panel.tsx`          |
| `components/ai-providers-config.tsx`           | `modules/bot-core/components/ai-providers-config.tsx`           |
| `backend/services/ai-agents.ts`                | `modules/bot-core/services/ai-agents.ts`                        |
| `backend/services/language-detection.ts`       | `modules/bot-core/services/language-detection.ts`               |
| `backend/services/approval-system.ts`          | `modules/bot-core/services/approval-system.ts`                  |
| `app/api/chat/`                                | `modules/bot-core/api/chat/`                                    |
| `app/api/analyze-question/`                    | `modules/bot-core/api/analyze-question/`                        |
| `app/api/language-detection/`                  | `modules/bot-core/api/language-detection/`                      |
| `app/api/realtime/`                            | `modules/bot-core/api/realtime/`                                |
| `app/api/voice/`                               | `modules/bot-core/api/voice/`                                   |
| `app/api/chat-approval/`                       | `modules/bot-core/api/chat-approval/`                           |
| `app/api/complaints/`                          | `modules/bot-core/api/complaints/`                              |
| `environment/language-detection.ts`            | `modules/bot-core/config/language-detection.ts`                 |
| `environment/approval-system.ts`               | `modules/bot-core/config/approval-system.ts`                    |
| `environment/complaints-solutions.ts`          | `modules/bot-core/config/complaints-solutions.ts`               |
| `environment/realtime-apis.ts`                 | `modules/bot-core/config/realtime-apis.ts`                      |
| `environment/voice-integration.ts`             | `modules/bot-core/config/voice-integration.ts`                  |

### integrations Module Migrations

| Current Location                       | New Location                                        |
| -------------------------------------- | --------------------------------------------------- |
| `backend/services/elevenlabs-agent.ts` | `modules/integrations/services/elevenlabs-agent.ts` |
| `backend/services/n8n-integration.ts`  | `modules/integrations/services/n8n-integration.ts`  |
| `app/api/elevenlabs-agent/`            | `modules/integrations/api/elevenlabs-agent/`        |
| `app/api/free-apis-test/`              | `modules/integrations/api/free-apis-test/`          |
| `app/api/gemini-test/`                 | `modules/integrations/api/gemini-test/`             |
| `app/api/anthropic-test/`              | `modules/integrations/api/anthropic-test/`          |
| `app/api/direct-gemini-test/`          | `modules/integrations/api/direct-gemini-test/`      |
| `environment/api-key-router.ts`        | `modules/integrations/config/api-key-router.ts`     |
| `environment/api-keys.ts`              | `modules/integrations/config/api-keys.ts`           |
| `environment/api-router.ts`            | `modules/integrations/config/api-router.ts`         |
| `environment/secrets.ts`               | `modules/integrations/config/secrets.ts`            |
| `environment/supabase-client.ts`       | `modules/integrations/config/supabase-client.ts`    |

### dashboard Module Migrations

| Current Location            | New Location                             |
| --------------------------- | ---------------------------------------- |
| `components/admin/*`        | `modules/dashboard/components/admin/*`   |
| `app/admin/`                | `modules/dashboard/pages/admin/`         |
| `app/api/admin/*`           | `modules/dashboard/api/admin/*`          |
| `backend/api/admin/*`       | `modules/dashboard/services/admin/*`     |
| `environment/monitoring.ts` | `modules/dashboard/config/monitoring.ts` |
| `environment/logging.ts`    | `modules/dashboard/config/logging.ts`    |

### data Module Migrations

| Current Location              | New Location                                  |
| ----------------------------- | --------------------------------------------- |
| `backend/database/schema.ts`  | `modules/data/schema/schema.ts`               |
| `environment/database.ts`     | `modules/data/config/database.ts`             |
| `lib/database.ts`             | `modules/data/utils/database.ts`              |
| `scripts/create-database.sql` | `modules/data/migrations/create-database.sql` |
| `supabase/migrations/`        | `modules/data/migrations/supabase/`           |
| `environment/config.ts`       | `modules/data/config/config.ts`               |
| `environment/validator.ts`    | `modules/data/utils/validator.ts`             |

### Shared Resources

| Current Location                | New Location                           |
| ------------------------------- | -------------------------------------- |
| `components/ui/*`               | `shared/components/ui/*`               |
| `components/theme-provider.tsx` | `shared/components/theme-provider.tsx` |
| `lib/utils.ts`                  | `shared/utils/utils.ts`                |
| `lib/voice-commands.ts`         | `shared/utils/voice-commands.ts`       |
| `frontend/`                     | `shared/frontend/`                     |
| `styles/`                       | `shared/styles/`                       |
| `public/`                       | `public/` (unchanged)                  |

## Module Dependencies

### Dependency Flow Diagram

```
bot-core
├── integrations (AI agents, voice services)
├── data (conversation storage, context)
└── shared (utilities, UI components)

integrations
├── data (API usage tracking)
└── shared (utilities)

dashboard
├── data (metrics, logs)
├── bot-core (conversation analytics)
└── shared (UI components, utilities)

data
└── shared (utilities)
```

### Key Dependencies

1. **bot-core → integrations**: AI agent services, voice processing
2. **bot-core → data**: Conversation persistence, user context
3. **dashboard → data**: System metrics, audit logs
4. **dashboard → bot-core**: Real-time conversation monitoring
5. **integrations → data**: API usage statistics, rate limiting
6. **All modules → shared**: Common utilities and UI components

## Breaking Changes and Migration Strategy

### Import Path Changes

All relative imports will need to be updated to use module-based paths:

```typescript
// Before
import { aiAgentsService } from "../../backend/services/ai-agents";

// After
import { aiAgentsService } from "@/modules/bot-core/services/ai-agents";
```

### API Route Restructuring

Some API routes may need consolidation or splitting based on module boundaries:

- `/api/chat` → `modules/bot-core/api/chat`
- `/api/admin/*` → `modules/dashboard/api/admin/*`
- `/api/voice/*` → Split between `bot-core` and `integrations`

### Configuration Centralization

Environment configurations will be distributed across modules:

- Database configs → `modules/data/config/`
- API keys → `modules/integrations/config/`
- Bot settings → `modules/bot-core/config/`
- Dashboard settings → `modules/dashboard/config/`

### Database Connection Management

Database connections will be centralized in the `data` module with connection pooling managed at the module level.

## Implementation Phases

### Phase 1: Infrastructure Setup

1. Create new directory structure
2. Set up module entry points and exports
3. Configure TypeScript path mappings
4. Update build configurations

### Phase 2: Module Migration

1. Migrate `data` module (foundation)
2. Migrate `integrations` module (dependencies)
3. Migrate `bot-core` module (core functionality)
4. Migrate `dashboard` module (admin features)

### Phase 3: Integration and Testing

1. Update all import statements
2. Resolve circular dependencies
3. Comprehensive testing
4. Performance optimization

### Phase 4: Cleanup and Documentation

1. Remove old files
2. Update documentation
3. Code review and validation
4. Deployment preparation

## Benefits of Modular Architecture

### Maintainability

- Clear separation of concerns
- Easier to locate and modify specific features
- Reduced coupling between components

### Scalability

- Independent deployment of modules
- Horizontal scaling of specific services
- Easier addition of new features

### Developer Experience

- Faster development cycles
- Clearer code organization
- Easier onboarding for new developers

### Enterprise Readiness

- Better security boundaries
- Improved monitoring and logging
- Easier compliance with enterprise standards

## Risk Mitigation

### Testing Strategy

- Unit tests for each module
- Integration tests between modules
- End-to-end testing for critical paths
- Performance regression testing

### Rollback Plan

- Maintain current codebase during migration
- Feature flags for gradual rollout
- Database migration scripts with rollback capability

### Monitoring and Validation

- Comprehensive logging during migration
- Performance monitoring of new architecture
- User acceptance testing

## Conclusion

This modular refactoring will transform the current monolithic architecture into a scalable, maintainable enterprise-grade system. The four-module structure provides clear boundaries while maintaining the flexibility needed for rapid development and deployment.

The phased approach ensures minimal disruption to existing functionality while providing a solid foundation for future growth and feature development.
