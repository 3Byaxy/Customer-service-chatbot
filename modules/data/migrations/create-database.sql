-- AI Customer Support Database Schema
-- PostgreSQL Database Setup Script

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table for customer information
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone_number VARCHAR(20) UNIQUE,
    email VARCHAR(255) UNIQUE,
    name VARCHAR(255),
    language VARCHAR(10) DEFAULT 'en',
    business_type VARCHAR(50),
    location VARCHAR(255),
    preferences JSONB DEFAULT '{}',
    satisfaction_rating INTEGER CHECK (satisfaction_rating >= 1 AND satisfaction_rating <= 5),
    total_conversations INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Conversations table for chat sessions
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_id VARCHAR(255) UNIQUE NOT NULL,
    business_type VARCHAR(50) NOT NULL,
    language VARCHAR(10) DEFAULT 'en',
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'escalated', 'closed')),
    satisfaction_rating INTEGER CHECK (satisfaction_rating >= 1 AND satisfaction_rating <= 5),
    escalated BOOLEAN DEFAULT FALSE,
    escalation_reason TEXT,
    resolution_time INTEGER, -- in seconds
    total_messages INTEGER DEFAULT 0,
    ai_provider VARCHAR(50),
    context_summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table for individual chat messages
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    original_language VARCHAR(10),
    translated_content TEXT,
    intent VARCHAR(100),
    confidence_score DECIMAL(3,2),
    ai_provider VARCHAR(50),
    response_time INTEGER, -- in milliseconds
    tokens_used INTEGER,
    cost DECIMAL(10,6),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Business configurations for different business types
CREATE TABLE IF NOT EXISTS business_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_type VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    supported_languages TEXT[] DEFAULT ARRAY['en'],
    escalation_threshold DECIMAL(3,2) DEFAULT 0.7,
    auto_responses JSONB DEFAULT '{}',
    business_hours JSONB DEFAULT '{}',
    contact_info JSONB DEFAULT '{}',
    custom_prompts JSONB DEFAULT '{}',
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Rules table for business logic and routing
CREATE TABLE IF NOT EXISTS rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_type VARCHAR(50) REFERENCES business_configs(business_type),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    conditions JSONB NOT NULL, -- JSON conditions for rule matching
    actions JSONB NOT NULL, -- JSON actions to take when rule matches
    priority INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Context storage for conversation memory
CREATE TABLE IF NOT EXISTS context_storage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    context_type VARCHAR(50) NOT NULL, -- 'short_term', 'long_term', 'user_profile'
    context_data JSONB NOT NULL,
    relevance_score DECIMAL(3,2) DEFAULT 1.0,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Escalations table for human handoff tracking
CREATE TABLE IF NOT EXISTS escalations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    reason VARCHAR(255) NOT NULL,
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'assigned', 'in_progress', 'resolved', 'closed')),
    assigned_to VARCHAR(255),
    resolution_notes TEXT,
    escalated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics table for performance tracking
CREATE TABLE IF NOT EXISTS analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    business_type VARCHAR(50),
    language VARCHAR(10),
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(15,6) NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System logs table for monitoring
CREATE TABLE IF NOT EXISTS system_logs (
    id VARCHAR(255) PRIMARY KEY,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    level VARCHAR(20) NOT NULL CHECK (level IN ('debug', 'info', 'warning', 'error', 'success')),
    component VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    details TEXT,
    user_id VARCHAR(255),
    session_id VARCHAR(255),
    duration INTEGER,
    ip INET,
    endpoint VARCHAR(255),
    status_code INTEGER,
    request_id VARCHAR(255),
    user_agent TEXT,
    metadata JSONB DEFAULT '{}'
);

-- API usage tracking
CREATE TABLE IF NOT EXISTS api_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider VARCHAR(50) NOT NULL,
    model VARCHAR(100) NOT NULL,
    endpoint VARCHAR(255),
    request_count INTEGER DEFAULT 1,
    success_count INTEGER DEFAULT 0,
    error_count INTEGER DEFAULT 0,
    total_tokens INTEGER DEFAULT 0,
    total_cost DECIMAL(10,6) DEFAULT 0,
    average_response_time INTEGER DEFAULT 0,
    date DATE NOT NULL,
    hour INTEGER CHECK (hour >= 0 AND hour <= 23),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performance metrics table
CREATE TABLE IF NOT EXISTS performance_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    metric_type VARCHAR(50) NOT NULL, -- 'cpu', 'memory', 'disk', 'network', 'database'
    metric_name VARCHAR(100) NOT NULL,
    value DECIMAL(15,6) NOT NULL,
    unit VARCHAR(20),
    threshold_warning DECIMAL(15,6),
    threshold_critical DECIMAL(15,6),
    metadata JSONB DEFAULT '{}'
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone_number);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_business_type ON users(business_type);
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_session_id ON conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_conversations_status ON conversations(status);
CREATE INDEX IF NOT EXISTS idx_conversations_created_at ON conversations(created_at);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_role ON messages(role);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_context_storage_conversation_id ON context_storage(conversation_id);
CREATE INDEX IF NOT EXISTS idx_context_storage_type ON context_storage(context_type);
CREATE INDEX IF NOT EXISTS idx_escalations_conversation_id ON escalations(conversation_id);
CREATE INDEX IF NOT EXISTS idx_escalations_status ON escalations(status);
CREATE INDEX IF NOT EXISTS idx_analytics_date ON analytics(date);
CREATE INDEX IF NOT EXISTS idx_analytics_business_type ON analytics(business_type);
CREATE INDEX IF NOT EXISTS idx_system_logs_timestamp ON system_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_system_logs_level ON system_logs(level);
CREATE INDEX IF NOT EXISTS idx_system_logs_component ON system_logs(component);
CREATE INDEX IF NOT EXISTS idx_api_usage_provider ON api_usage(provider);
CREATE INDEX IF NOT EXISTS idx_api_usage_date ON api_usage(date);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_timestamp ON performance_metrics(timestamp);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_type ON performance_metrics(metric_type);

-- Create triggers for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_business_configs_updated_at BEFORE UPDATE ON business_configs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rules_updated_at BEFORE UPDATE ON rules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_context_storage_updated_at BEFORE UPDATE ON context_storage FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample business configurations
INSERT INTO business_configs (business_type, name, description, supported_languages, escalation_threshold, auto_responses, business_hours, contact_info, custom_prompts) VALUES
('telecom', 'Telecommunications', 'Mobile network and internet services', ARRAY['en', 'lg', 'sw'], 0.7, 
 '{"greeting": "Hello! I''m here to help with your mobile and internet services. How can I assist you today?"}',
 '{"monday": "08:00-20:00", "tuesday": "08:00-20:00", "wednesday": "08:00-20:00", "thursday": "08:00-20:00", "friday": "08:00-20:00", "saturday": "09:00-17:00", "sunday": "10:00-16:00"}',
 '{"phone": "+256-XXX-XXXXXX", "email": "support@telecom.ug", "website": "www.telecom.ug"}',
 '{"system_prompt": "You are a helpful customer service assistant for a telecommunications company in Uganda. You help customers with mobile services, data bundles, network issues, and billing inquiries. Always be polite and professional."}'),

('banking', 'Banking Services', 'Financial services and banking', ARRAY['en', 'lg', 'sw'], 0.8,
 '{"greeting": "Welcome to our banking services! I''m here to help with your account, transactions, and banking needs. How may I assist you?"}',
 '{"monday": "08:00-17:00", "tuesday": "08:00-17:00", "wednesday": "08:00-17:00", "thursday": "08:00-17:00", "friday": "08:00-17:00", "saturday": "09:00-13:00", "sunday": "closed"}',
 '{"phone": "+256-XXX-XXXXXX", "email": "support@bank.ug", "website": "www.bank.ug"}',
 '{"system_prompt": "You are a professional banking customer service assistant. Help customers with account inquiries, transactions, loans, and general banking services. Always prioritize security and verify customer identity when needed."}'),

('utilities', 'Utility Services', 'Electricity, water, and utility services', ARRAY['en', 'lg', 'sw'], 0.7,
 '{"greeting": "Hello! I''m here to help with your utility services including electricity, water, and billing. What can I help you with today?"}',
 '{"monday": "07:00-19:00", "tuesday": "07:00-19:00", "wednesday": "07:00-19:00", "thursday": "07:00-19:00", "friday": "07:00-19:00", "saturday": "08:00-16:00", "sunday": "emergency_only"}',
 '{"phone": "+256-XXX-XXXXXX", "email": "support@utilities.ug", "emergency": "+256-XXX-EMERGENCY"}',
 '{"system_prompt": "You are a utility services customer support assistant. Help customers with electricity, water, billing issues, outage reports, and service connections. Be helpful and provide clear information about utility services."}'),

('ecommerce', 'E-commerce Platform', 'Online shopping and marketplace', ARRAY['en', 'lg', 'sw'], 0.6,
 '{"greeting": "Welcome to our online marketplace! I''m here to help with orders, products, payments, and deliveries. How can I assist you?"}',
 '{"monday": "24/7", "tuesday": "24/7", "wednesday": "24/7", "thursday": "24/7", "friday": "24/7", "saturday": "24/7", "sunday": "24/7"}',
 '{"phone": "+256-XXX-XXXXXX", "email": "support@shop.ug", "website": "www.shop.ug", "chat": "24/7"}',
 '{"system_prompt": "You are an e-commerce customer service assistant. Help customers with product inquiries, orders, payments, shipping, returns, and account issues. Be friendly and focus on providing excellent shopping experience."}')

ON CONFLICT (business_type) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    supported_languages = EXCLUDED.supported_languages,
    escalation_threshold = EXCLUDED.escalation_threshold,
    auto_responses = EXCLUDED.auto_responses,
    business_hours = EXCLUDED.business_hours,
    contact_info = EXCLUDED.contact_info,
    custom_prompts = EXCLUDED.custom_prompts,
    updated_at = NOW();

-- Insert sample rules
INSERT INTO rules (business_type, name, description, conditions, actions, priority) VALUES
('telecom', 'Data Bundle Inquiry', 'Handle data bundle related questions', 
 '{"keywords": ["data", "bundle", "internet", "MB", "GB"], "intent": "data_inquiry"}',
 '{"response_template": "I can help you with data bundles. We offer various packages from daily to monthly bundles.", "escalate": false}', 1),

('telecom', 'Network Issue', 'Handle network connectivity problems',
 '{"keywords": ["network", "signal", "connection", "slow", "not working"], "intent": "technical_issue"}',
 '{"response_template": "I understand you''re experiencing network issues. Let me help you troubleshoot.", "escalate": false, "collect_info": ["location", "device_type"]}', 2),

('banking', 'Account Balance', 'Handle balance inquiries',
 '{"keywords": ["balance", "account", "money", "funds"], "intent": "balance_inquiry"}',
 '{"response_template": "I can help you check your account balance. For security, I''ll need to verify your identity.", "escalate": false, "require_verification": true}', 1),

('banking', 'Transaction Issue', 'Handle transaction problems',
 '{"keywords": ["transaction", "payment", "transfer", "failed", "error"], "intent": "transaction_issue"}',
 '{"response_template": "I''ll help you resolve this transaction issue. Can you provide more details?", "escalate": false, "collect_info": ["transaction_id", "amount", "date"]}', 2),

('utilities', 'Power Outage', 'Handle electricity outage reports',
 '{"keywords": ["power", "electricity", "outage", "blackout", "no power"], "intent": "outage_report"}',
 '{"response_template": "I''ll help you report this power outage. Can you confirm your location?", "escalate": false, "collect_info": ["location", "duration"]}', 3),

('ecommerce', 'Order Status', 'Handle order tracking inquiries',
 '{"keywords": ["order", "delivery", "shipping", "track", "status"], "intent": "order_inquiry"}',
 '{"response_template": "I can help you track your order. Please provide your order number.", "escalate": false, "collect_info": ["order_number"]}', 1)

ON CONFLICT DO NOTHING;

-- Create a function to clean up old data
CREATE OR REPLACE FUNCTION cleanup_old_data()
RETURNS void AS $$
BEGIN
    -- Delete system logs older than 30 days
    DELETE FROM system_logs WHERE timestamp < NOW() - INTERVAL '30 days';
    
    -- Delete performance metrics older than 7 days
    DELETE FROM performance_metrics WHERE timestamp < NOW() - INTERVAL '7 days';
    
    -- Delete expired context storage
    DELETE FROM context_storage WHERE expires_at IS NOT NULL AND expires_at < NOW();
    
    -- Update analytics for cleanup
    INSERT INTO analytics (date, metric_name, metric_value, metadata)
    VALUES (CURRENT_DATE, 'cleanup_executed', 1, '{"function": "cleanup_old_data"}')
    ON CONFLICT DO NOTHING;
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions (adjust as needed for your setup)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_app_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_app_user;

-- Insert initial analytics data
INSERT INTO analytics (date, business_type, language, metric_name, metric_value) VALUES
(CURRENT_DATE, 'telecom', 'en', 'conversations_started', 0),
(CURRENT_DATE, 'telecom', 'lg', 'conversations_started', 0),
(CURRENT_DATE, 'telecom', 'sw', 'conversations_started', 0),
(CURRENT_DATE, 'banking', 'en', 'conversations_started', 0),
(CURRENT_DATE, 'utilities', 'en', 'conversations_started', 0),
(CURRENT_DATE, 'ecommerce', 'en', 'conversations_started', 0)
ON CONFLICT DO NOTHING;

-- Create a view for conversation analytics
CREATE OR REPLACE VIEW conversation_analytics AS
SELECT 
    DATE(c.created_at) as date,
    c.business_type,
    c.language,
    COUNT(*) as total_conversations,
    COUNT(CASE WHEN c.status = 'resolved' THEN 1 END) as resolved_conversations,
    COUNT(CASE WHEN c.escalated = true THEN 1 END) as escalated_conversations,
    AVG(c.satisfaction_rating) as avg_satisfaction,
    AVG(c.resolution_time) as avg_resolution_time,
    AVG(c.total_messages) as avg_messages_per_conversation
FROM conversations c
GROUP BY DATE(c.created_at), c.business_type, c.language
ORDER BY date DESC, business_type, language;

-- Database setup complete
SELECT 'Database schema created successfully!' as status;
