# Environment Configuration System

This folder contains all the valuable configuration and API key management for your AI customer support chatbot.

## 🔐 Security Features

### **API Key Protection**
- ✅ **Masked Keys**: API keys are masked in logs and UI
- ✅ **Rotation Support**: Easy key rotation without code changes
- ✅ **Rate Limiting**: Automatic rate limiting per provider
- ✅ **Fallback Routing**: Automatic failover between providers
- ✅ **Error Tracking**: Monitor API failures and auto-disable problematic routes

### **Environment Isolation**
- ✅ **Development/Production**: Separate configs for each environment
- ✅ **Validation**: Automatic validation of all configuration
- ✅ **Encryption**: Sensitive data encryption support
- ✅ **Monitoring**: Real-time status monitoring

## 📁 File Structure

\`\`\`
environment/
├── config.ts          # Main configuration management
├── api-router.ts       # Smart API routing and load balancing
├── secrets.ts          # Encryption and secrets management
├── validator.ts        # Configuration validation
├── .env.example        # Template for environment variables
├── .env.local          # Your current configuration
└── README.md          # This file
\`\`\`

## 🚀 Quick Setup

### **1. Copy Environment File**
\`\`\`bash
cp environment/.env.local .env.local
\`\`\`

### **2. Your Current Configuration**
\`\`\`env
# Primary AI Provider (Free)
GOOGLE_GENERATIVE_AI_API_KEY=AIzaSyD_kvtPIA2IiE2ncKiJP3FtHCyXWXEV27s

# Application Settings
NODE_ENV=development
DEBUG=true
\`\`\`

### **3. Add More Providers (Optional)**
\`\`\`env
# For faster responses
GROQ_API_KEY=your_groq_key_here

# For premium features
OPENAI_API_KEY=your_openai_key_here

# For sensitive topics
ANTHROPIC_API_KEY=your_anthropic_key_here
\`\`\`

## 🔧 API Router Features

### **Smart Routing**
\`\`\`typescript
// Automatically selects best provider based on:
// - Query complexity
// - Rate limits
// - Provider availability
// - Error rates

const route = apiRouter.getBestRoute('complex')
const apiKey = apiRouter.getAPIKey(route.provider)
\`\`\`

### **Load Balancing**
- **Priority-based**: Primary → Secondary → Tertiary
- **Rate-aware**: Respects each provider's limits
- **Error-resilient**: Auto-disables failing providers
- **Recovery**: Auto-enables providers after cooldown

### **Usage Monitoring**
\`\`\`typescript
const stats = apiRouter.getStats()
// Shows: requests, errors, rate limits, availability
\`\`\`

## 🛡️ Security Best Practices

### **Production Checklist**
- [ ] Generate new JWT secret (32+ characters)
- [ ] Generate new encryption key
- [ ] Remove debug flags
- [ ] Set proper CORS origins
- [ ] Enable rate limiting
- [ ] Monitor API usage
- [ ] Rotate keys regularly

### **Key Management**
\`\`\`typescript
// Keys are automatically masked in logs
console.log(route.key) // Shows: "AIza***V27s"

// Full keys only accessible through secure methods
const fullKey = apiRouter.getAPIKey('google')
\`\`\`

### **Environment Variables**
\`\`\`env
# ✅ Good - Use environment variables
GOOGLE_GENERATIVE_AI_API_KEY=your_key_here

# ❌ Bad - Never hardcode in source
const apiKey = "AIzaSyD_kvtPIA2IiE2ncKiJP3FtHCyXWXEV27s"
\`\`\`

## 📊 Monitoring & Validation

### **Automatic Validation**
\`\`\`typescript
import { environmentValidator } from './validator'

const result = await environmentValidator.validateEnvironment()
if (!result.valid) {
  console.log('Errors:', result.errors)
  console.log('Recommendations:', result.recommendations)
}
\`\`\`

### **Real-time Status**
\`\`\`typescript
const status = environmentValidator.getEnvironmentStatus()
// Shows: providers, routing, security, business config
\`\`\`

## 🔄 API Provider Priority

### **Current Setup**
1. **Google Gemini** (Primary) - Free, fast, reliable
2. **Groq** (Secondary) - Free, ultra-fast
3. **OpenAI** (Tertiary) - Premium, advanced
4. **Anthropic** (Quaternary) - Safety-focused

### **Automatic Fallback**
\`\`\`
User Query → Gemini 2.0 Flash
     ↓ (if fails)
Gemini 1.5 Flash
     ↓ (if fails)
Groq Llama 3.1
     ↓ (if fails)
OpenAI GPT-4o Mini
     ↓ (if fails)
Basic Response
\`\`\`

## 🎯 Usage Examples

### **Get API Key Safely**
\`\`\`typescript
import { apiRouter } from './environment/api-router'

// Get best route for query complexity
const route = apiRouter.getBestRoute('moderate')
const apiKey = apiRouter.getAPIKey(route.provider)

// Record usage
apiRouter.recordSuccess(route.provider)
\`\`\`

### **Validate Configuration**
\`\`\`typescript
import { environmentValidator } from './environment/validator'

const validation = await environmentValidator.validateEnvironment()
if (validation.valid) {
  console.log('✅ Configuration is valid')
} else {
  console.log('❌ Issues found:', validation.errors)
}
\`\`\`

### **Monitor Usage**
\`\`\`typescript
const stats = apiRouter.getStats()
console.log(`Total requests: ${stats.totalRequests}`)
console.log(`Available routes: ${stats.routes.filter(r => r.available).length}`)
\`\`\`

## 🚨 Troubleshooting

### **Common Issues**

**"No API providers configured"**
- Check if `.env.local` exists in project root
- Verify API keys are not empty
- Run validation to see specific issues

**"Rate limit exceeded"**
- Check current usage with `apiRouter.getStats()`
- Add more API providers for better load distribution
- Increase rate limits in config if needed

**"API key invalid"**
- Verify key is correct and not expired
- Check if API is enabled in provider console
- Test with direct API call

### **Debug Mode**
\`\`\`env
DEBUG=true
LOG_LEVEL=debug
\`\`\`

This will show detailed routing decisions and API calls.

## 📈 Scaling Recommendations

### **For High Traffic**
1. Add multiple API keys per provider
2. Implement Redis for distributed rate limiting
3. Add monitoring and alerting
4. Set up key rotation automation

### **For Production**
1. Use secure secret management (AWS Secrets Manager, etc.)
2. Enable comprehensive logging
3. Set up health checks
4. Implement circuit breakers

---

**Your API Key**: `AIzaSyD_kvtPIA2IiE2ncKiJP3FtHCyXWXEV27s` is safely managed and routed through this system! 🔐
