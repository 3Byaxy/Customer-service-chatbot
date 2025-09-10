# Vercel Deployment Guide

This guide will walk you through deploying the AI Customer Support System to Vercel.

## Prerequisites

- GitHub account
- Vercel account (free tier available)
- At least one AI provider API key

## Step-by-Step Deployment

### 1. Prepare Your Repository

Ensure your code is pushed to GitHub:

\`\`\`bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
\`\`\`

### 2. Connect to Vercel

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Select "Import Git Repository"
4. Choose your GitHub repository
5. Click "Import"

### 3. Configure Environment Variables

In the Vercel dashboard, add these environment variables:

**Required (choose at least one):**
- `ANTHROPIC_API_KEY` - Your Anthropic Claude API key
- `OPENAI_API_KEY` - Your OpenAI API key
- `GOOGLE_GENERATIVE_AI_API_KEY` - Your Google Gemini API key
- `GROQ_API_KEY` - Your Groq API key

**Optional:**
- `DATABASE_URL` - If using a database
- `SUPABASE_URL` - If using Supabase
- `SUPABASE_ANON_KEY` - If using Supabase

### 4. Deploy

1. Click "Deploy"
2. Wait for the build to complete (usually 2-3 minutes)
3. Your app will be live at `https://your-project-name.vercel.app`

## Getting API Keys

### Anthropic Claude (Recommended)
1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up/login
3. Go to "API Keys"
4. Create a new key
5. Copy the key (starts with `sk-ant-`)

### OpenAI GPT-4
1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up/login
3. Go to "API Keys"
4. Create a new key
5. Copy the key (starts with `sk-`)

### Google Gemini
1. Go to [ai.google.dev](https://ai.google.dev)
2. Sign up/login
3. Go to "Get API Key"
4. Create a new key
5. Copy the key

### Groq
1. Go to [console.groq.com](https://console.groq.com)
2. Sign up/login
3. Go to "API Keys"
4. Create a new key
5. Copy the key

## Vercel CLI Deployment (Alternative)

If you prefer using the command line:

\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - What's your project's name? ai-customer-support
# - In which directory is your code located? ./
\`\`\`

Add environment variables:
\`\`\`bash
vercel env add ANTHROPIC_API_KEY
# Enter your API key when prompted
\`\`\`

Deploy to production:
\`\`\`bash
vercel --prod
\`\`\`

## Post-Deployment

### 1. Test Your Deployment

1. Visit your deployed URL
2. Start a chat session
3. Test different languages and business types
4. Verify AI responses are working

### 2. Custom Domain (Optional)

1. In Vercel dashboard, go to your project
2. Click "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

### 3. Monitor Performance

- Check Vercel Analytics for usage stats
- Monitor function execution times
- Set up alerts for errors

## Troubleshooting

### Build Errors

**Error: Missing environment variables**
- Add all required environment variables in Vercel dashboard
- Redeploy after adding variables

**Error: Module not found**
- Check that all imports are correct
- Ensure all dependencies are in package.json

### Runtime Errors

**Error: API key not configured**
- Verify environment variables are set correctly
- Check variable names match exactly

**Error: Function timeout**
- AI responses taking too long
- Consider using faster models or increasing timeout

### Performance Issues

**Slow responses**
- Try different AI providers
- Optimize prompts for shorter responses
- Consider caching common responses

## Environment Variables Reference

\`\`\`bash
# Required (at least one)
ANTHROPIC_API_KEY=sk-ant-your-key-here
OPENAI_API_KEY=sk-your-key-here
GOOGLE_GENERATIVE_AI_API_KEY=your-google-key-here
GROQ_API_KEY=your-groq-key-here

# Optional
DATABASE_URL=your-database-url
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-key
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
\`\`\`

## Security Best Practices

1. **Never commit API keys** to your repository
2. **Use environment variables** for all sensitive data
3. **Rotate API keys** regularly
4. **Monitor usage** to detect unusual activity
5. **Set up rate limiting** if needed

## Scaling Considerations

- **Function limits**: Vercel has execution time limits
- **API rate limits**: Each AI provider has different limits
- **Concurrent users**: Test with expected load
- **Database**: Consider adding persistent storage for production

## Support

If you encounter issues:

1. Check Vercel function logs
2. Review environment variables
3. Test API keys independently
4. Check AI provider status pages
5. Open an issue on GitHub

Your AI Customer Support System should now be live and ready to help customers in multiple languages!
