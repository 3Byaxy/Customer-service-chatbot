# AI Customer Support System

A comprehensive AI-powered customer support system with multi-language support, intelligent escalation, and multiple AI provider integration.

## Features

- **Multi-Language Support**: English, Luganda, and Swahili
- **Multiple AI Providers**: OpenAI, Anthropic Claude, Google Gemini, and Groq
- **Business Type Customization**: Telecom, Banking, Utilities, E-commerce
- **Intelligent Escalation**: Automatic detection of complex issues
- **Real-time Chat Interface**: Interactive chat with session management
- **Admin Dashboard**: Comprehensive management and analytics
- **Knowledge Base Integration**: Context-aware responses

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- API keys for your chosen AI providers

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd ai-customer-support
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env.local
\`\`\`

4. Add your API keys to `.env.local`:
\`\`\`env
ANTHROPIC_API_KEY=your_anthropic_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
GOOGLE_GENERATIVE_AI_API_KEY=your_google_api_key_here
GROQ_API_KEY=your_groq_api_key_here
\`\`\`

5. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Customer Interface

1. Enter your email address
2. Select your business type and preferred language
3. Choose an AI provider
4. Start chatting with the AI assistant

### Admin Interface

Visit `/admin` to access the administrative dashboard with:
- Real-time conversation monitoring
- System performance metrics
- User management
- Analytics and reporting

## API Endpoints

- `POST /api/sessions` - Create a new chat session
- `POST /api/chat` - Send messages and receive AI responses
- `GET /api/admin/system-status` - Get system health status
- `GET /api/admin/conversations` - Retrieve conversation history

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Manual Deployment

1. Build the application:
\`\`\`bash
npm run build
\`\`\`

2. Start the production server:
\`\`\`bash
npm start
\`\`\`

## Configuration

### Business Types

The system supports different business types with customized prompts:
- Telecommunications
- Banking & Finance
- Utilities
- E-commerce

### Languages

Currently supported languages:
- English (en)
- Luganda (lg)
- Swahili (sw)

### AI Providers

Integrated AI providers:
- OpenAI GPT-4
- Anthropic Claude
- Google Gemini
- Groq Llama

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
