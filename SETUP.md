# 🚀 Kyaku Shien Chatbot - Setup & Run Guide

## 📋 Prerequisites

- **Node.js** 18+ (Download: https://nodejs.org/)
- **PostgreSQL** database (or use Neon for free cloud DB)
- **Git** for version control

## 🔧 Quick Setup (5 minutes)

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd Customer-service-chatbot
npm install
```

### 2. Environment Configuration

```bash
# Copy environment template
cp .env.example .env.local

# Edit with your API keys
nano .env.local  # or use your preferred editor
```

### 3. Database Setup

```bash
# If using Neon (recommended for beginners):
# 1. Go to https://neon.tech
# 2. Create free account
# 3. Create new project
# 4. Copy connection string to .env.local as DATABASE_URL

# Run database migrations
npm run db:migrate
npm run db:seed
```

### 4. Get FREE API Keys (Essential)

#### 🔥 **START HERE - FREE TIER KEYS**

```bash
# 1. Google Gemini (Primary AI - FREE)
# Visit: https://makersuite.google.com/app/apikey
# Add to .env.local: GOOGLE_GENERATIVE_AI_API_KEY=your_key_here

# 2. Groq (Fast AI Inference - FREE)
# Visit: https://console.groq.com/keys
# Add to .env.local: GROQ_API_KEY=your_key_here

# 3. Eleven Labs (Text-to-Speech - FREE)
# Visit: https://elevenlabs.io/app/profile
# Add to .env.local: ELEVENLABS_API_KEY=your_key_here

# 4. Voiceflow (Dialogue Flows - FREE)
# Visit: https://www.voiceflow.com/
# Add to .env.local: VOICEFLOW_API_KEY=your_key_here
```

### 5. Run the Application

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

## 🌐 Access Your Chatbot

- **Main App**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/admin
- **Testing Console**: http://localhost:3000/admin (Testing tab)

## 🔒 Security & API Key Management

### ✅ **Security Updates (Latest)**

**Recent Security Fixes:**

- ✅ **FIXED**: Removed hardcoded Google Gemini API key from all source files
- ✅ All API keys now use environment variables only
- ✅ No fallback placeholder keys in production code
- ✅ Status automatically updates based on environment variable presence
- ✅ Secure key validation prevents placeholder usage

**Security Best Practices:**

- Never commit `.env.local` or `.env` files to version control
- Use environment variables for all sensitive data
- Regularly rotate API keys
- Monitor API key usage and access logs

## API Keys Reference

### FREE TIER (Get these first!)

| Service       | URL                                      | Environment Variable           | Cost |
| ------------- | ---------------------------------------- | ------------------------------ | ---- |
| Google Gemini | https://makersuite.google.com/app/apikey | `GOOGLE_GENERATIVE_AI_API_KEY` | FREE |
| Groq          | https://console.groq.com/keys            | `GROQ_API_KEY`                 | FREE |
| Eleven Labs   | https://elevenlabs.io/app/profile        | `ELEVENLABS_API_KEY`           | FREE |
| Voiceflow     | https://www.voiceflow.com/               | `VOICEFLOW_API_KEY`            | FREE |

### PAID SERVICES (Optional - for production)

| Service          | URL                                  | Environment Variable | Cost |
| ---------------- | ------------------------------------ | -------------------- | ---- |
| Anthropic Claude | https://console.anthropic.com/       | `ANTHROPIC_API_KEY`  | Paid |
| OpenAI GPT       | https://platform.openai.com/api-keys | `OPENAI_API_KEY`     | Paid |
| Vapi Voice       | https://vapi.ai/                     | `VAPI_API_KEY`       | Paid |

### WORKFLOW & DATABASE

| Service         | Purpose             | Environment Variable |
| --------------- | ------------------- | -------------------- |
| Neon PostgreSQL | Database            | `DATABASE_URL`       |
| n8n             | Workflow Automation | `N8N_WEBHOOK_URL`    |

## 🧪 Testing Your Setup

### ✅ **Security Test First**

Before testing functionality, verify API keys are properly secured:

1. Check that no hardcoded API keys exist in source code
2. Ensure `.env.local` is not committed to version control
3. Verify environment variables are loaded correctly

### 1. Basic Chat Test

1. Open http://localhost:3000
2. Send a message: "Hello, I need help with my data bundle"
3. Should respond in English with AI analysis

### 2. Admin Testing Console

Access comprehensive testing at: http://localhost:3000/admin

#### **Single Test Tab**

- Test individual messages with different business types
- Supports English, Luganda, and Swahili
- Includes sample queries for each business type

#### **Bulk Test Tab**

- Test multiple messages at once (one per line)
- Useful for regression testing

#### **Stress Test Tab**

- Test system performance with concurrent requests
- ⚠️ Use carefully to avoid hitting API rate limits

#### **AI Agents Tab**

- Test AI agent routing and responses
- Verify different AI providers are working

#### **Language Tab**

- Test language detection and agent routing
- Try multilingual messages:
  - English: "Hello, I need help with my account"
  - Luganda: "Webale, njagala obuyambi ku account yange"
  - Swahili: "Habari, nataka msaada na akaunti yangu"

#### **Results Tab**

- View detailed test results
- Export results to JSON
- Analyze response times and success rates

### 3. API Endpoints Test

```bash
# Test language detection
curl -X POST http://localhost:3000/api/language-detection/test \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, I need help"}'

# Test AI agents
curl -X POST http://localhost:3000/api/ai-agents/test \
  -H "Content-Type: application/json" \
  -d '{"message": "Tell me about data bundles"}'

# Test main chat endpoint
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "Help me with my bill"}], "businessType": "telecom"}'
```

### 4. Environment Status Check

Visit: http://localhost:3000/api/environment-status

- Should show API key configuration status
- Verify all required services are active

## 🚨 Troubleshooting

### Common Issues:

1. **"No AI API keys configured"**

   - Solution: Add `GOOGLE_GENERATIVE_AI_API_KEY` to `.env.local`

2. **Database connection error**

   - Solution: Check `DATABASE_URL` in `.env.local`
   - For Neon: Make sure connection string is correct

3. **Build errors**

   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **Port already in use**
   ```bash
   # Kill process on port 3000
   lsof -ti:3000 | xargs kill -9
   npm run dev
   ```

## 📊 Features Overview

### ✅ **Implemented Features**

- ✅ Multilingual Support (English, Luganda, Swahili)
- ✅ AI Agent Routing (Eleven Labs, Vapi, Voiceflow)
- ✅ Language Detection & Auto-switching
- ✅ n8n Workflow Integration
- ✅ Admin Dashboard with Live Monitoring
- ✅ Comprehensive Testing Console
- ✅ Real-time Chat with AI Analysis

### 🔄 **Architecture Highlights**

- **Modular Services**: Clean separation of concerns
- **Scalable Design**: Easy to add new AI providers
- **Real-time Capabilities**: WebSocket-ready
- **Security**: Environment-based secrets management

## 🎯 Next Steps

1. **Test all features** using the testing console
2. **Customize AI prompts** in `businessContexts` (chat/route.ts)
3. **Add more languages** to language detection service
4. **Set up n8n workflows** for automation
5. **Configure monitoring** and logging

## 📞 Support

- Check the **Testing Console** for debugging
- Review **environment/secrets.ts** for configuration
- Use **Admin Dashboard** for monitoring

---

**🎉 Your AI-powered multilingual chatbot is ready!**

Start with the free API keys and scale up to paid services as needed.
