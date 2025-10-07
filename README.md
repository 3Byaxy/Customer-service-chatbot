# AI Customer Support System

A comprehensive AI-powered customer support system with multi-language support, multiple AI providers, and intelligent escalation.

## Features

- 🤖 **Multiple AI Providers**: Support for Anthropic Claude, OpenAI GPT-4, Google Gemini, and Groq Llama
- 🌍 **Multi-Language Support**: English, Luganda, and Swahili
- 🏢 **Business-Specific**: Tailored prompts for Telecom, Banking, Utilities, and E-commerce
- 🚀 **Smart Escalation**: Automatic detection of complex issues requiring human intervention
- 📱 **Responsive Design**: Works perfectly on desktop and mobile devices
- ⚡ **Real-time Chat**: Instant responses with typing indicators
- 🔒 **Session Management**: Secure session handling for each customer interaction

## Quick Start

### 1. Clone and Install

\`\`\`bash
git clone <your-repo-url>
cd ai-customer-support
npm install
\`\`\`

### 2. Environment Setup

Copy `.env.example` to `.env.local` and add your API keys:

\`\`\`bash
cp .env.example .env.local
\`\`\`

Add at least one AI provider API key:
- **Anthropic Claude** (recommended): Get key from [console.anthropic.com](https://console.anthropic.com)
- **OpenAI GPT-4**: Get key from [platform.openai.com](https://platform.openai.com)
- **Google Gemini**: Get key from [ai.google.dev](https://ai.google.dev)
- **Groq**: Get key from [console.groq.com](https://console.groq.com)

### 3. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Deployment to Vercel

### Option 1: Deploy from GitHub (Recommended)

1. Push your code to GitHub
2. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
3. Click "New Project" and import your GitHub repository
4. Add environment variables in Vercel dashboard:
   - `ANTHROPIC_API_KEY`
   - `OPENAI_API_KEY` (optional)
   - `GOOGLE_GENERATIVE_AI_API_KEY` (optional)
   - `GROQ_API_KEY` (optional)
5. Deploy!

### Option 2: Deploy with Vercel CLI

\`\`\`bash
npm i -g vercel
vercel
\`\`\`

Follow the prompts and add your environment variables when asked.

## Usage

1. **Start a Session**: Enter your email and select business type, language, and AI provider
2. **Chat**: Type your customer service questions in your preferred language
3. **Smart Responses**: Get contextual responses based on your business type
4. **Escalation**: Complex issues are automatically flagged for human intervention

## API Endpoints

- `POST /api/sessions` - Create a new chat session
- `POST /api/chat` - Send messages and get AI responses
- `GET /api/sessions` - Health check for sessions API
- `GET /api/chat` - Health check for chat API

## Supported Languages

- **English**: Full support with business-specific prompts
- **Luganda**: Native Ugandan language support
- **Swahili**: East African language support

## Business Types

- **Telecommunications**: Billing, technical issues, service plans
- **Banking & Finance**: Account inquiries, transactions, loans
- **Utilities**: Billing, outages, meter readings, connections
- **E-commerce**: Orders, returns, payments, product inquiries

## Architecture

- **Frontend**: Next.js 14 with React Server Components
- **Backend**: Next.js API Routes (serverless functions)
- **AI**: Multiple providers via Vercel AI SDK
- **Styling**: Tailwind CSS with shadcn/ui components
- **Deployment**: Optimized for Vercel platform

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | Yes* | Anthropic Claude API key |
| `OPENAI_API_KEY` | No | OpenAI GPT-4 API key |
| `GOOGLE_GENERATIVE_AI_API_KEY` | No | Google Gemini API key |
| `GROQ_API_KEY` | No | Groq Llama API key |

*At least one AI provider API key is required.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For support, please open an issue on GitHub or contact the development team.
