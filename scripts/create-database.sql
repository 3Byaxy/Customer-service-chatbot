-- AI Customer Support Database Schema
-- Run this script in your SQL database management tool

-- Enable UUID extension (PostgreSQL)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table for customer information
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    language VARCHAR(10) DEFAULT 'en',
    location VARCHAR(255),
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_active TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'active'
);

-- Business configurations table
CREATE TABLE IF NOT EXISTS business_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_type VARCHAR(100) NOT NULL,
    config_name VARCHAR(255) NOT NULL,
    config_data JSONB NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    UNIQUE(business_type, config_name)
);

-- Conversations table
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(255) NOT NULL,
    session_id VARCHAR(255) NOT NULL,
    business_type VARCHAR(100),
    language VARCHAR(10) DEFAULT 'en',
    status VARCHAR(50) DEFAULT 'active',
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP WITH TIME ZONE,
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    message_count INTEGER DEFAULT 0,
    satisfaction_rating INTEGER CHECK (satisfaction_rating >= 1 AND satisfaction_rating <= 5),
    escalated BOOLEAN DEFAULT false,
    escalation_reason TEXT,
    metadata JSONB DEFAULT '{}'
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    message_type VARCHAR(50) NOT NULL CHECK (message_type IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    language VARCHAR(10) DEFAULT 'en',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ai_provider VARCHAR(100),
    response_time INTEGER, -- milliseconds
    confidence_score DECIMAL(3,2),
    intent VARCHAR(255),
    entities JSONB DEFAULT '[]',
    metadata JSONB DEFAULT '{}'
);

-- Context storage for conversation context
CREATE TABLE IF NOT EXISTS context_storage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    context_type VARCHAR(100) NOT NULL,
    context_data JSONB NOT NULL,
    relevance_score DECIMAL(3,2) DEFAULT 1.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE,
    access_count INTEGER DEFAULT 0,
    last_accessed TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Rules and business logic
CREATE TABLE IF NOT EXISTS rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rule_name VARCHAR(255) NOT NULL,
    business_type VARCHAR(100),
    rule_type VARCHAR(100) NOT NULL,
    conditions JSONB NOT NULL,
    actions JSONB NOT NULL,
    priority INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    usage_count INTEGER DEFAULT 0,
    last_used TIMESTAMP WITH TIME ZONE
);

-- Escalations tracking
CREATE TABLE IF NOT EXISTS escalations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id),
    escalation_type VARCHAR(100) NOT NULL,
    reason TEXT NOT NULL,
    severity VARCHAR(50) DEFAULT 'medium',
    status VARCHAR(50) DEFAULT 'pending',
    assigned_to VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolution_notes TEXT,
    customer_satisfaction INTEGER CHECK (customer_satisfaction >= 1 AND customer_satisfaction <= 5)
);

-- Analytics and metrics
CREATE TABLE IF NOT EXISTS analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_type VARCHAR(100) NOT NULL,
    metric_name VARCHAR(255) NOT NULL,
    metric_value DECIMAL(10,2) NOT NULL,
    dimensions JSONB DEFAULT '{}',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    business_type VARCHAR(100),
    language VARCHAR(10),
    user_segment VARCHAR(100),
    session_id VARCHAR(255)
);

-- System logs for monitoring
CREATE TABLE IF NOT EXISTS system_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    log_level VARCHAR(20) NOT NULL CHECK (log_level IN ('debug', 'info', 'warning', 'error', 'critical')),
    component VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    details JSONB DEFAULT '{}',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    user_id VARCHAR(255),
    session_id VARCHAR(255),
    request_id VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    endpoint VARCHAR(255),
    http_status INTEGER,
    response_time INTEGER,
    stack_trace TEXT
);

-- API usage tracking
CREATE TABLE IF NOT EXISTS api_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider VARCHAR(100) NOT NULL,
    endpoint VARCHAR(255) NOT NULL,
    method VARCHAR(10) NOT NULL,
    request_count INTEGER DEFAULT 1,
    total_tokens INTEGER DEFAULT 0,
    total_cost DECIMAL(10,4) DEFAULT 0.00,
    average_response_time INTEGER DEFAULT 0,
    success_count INTEGER DEFAULT 0,
    error_count INTEGER DEFAULT 0,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    hour INTEGER NOT NULL DEFAULT EXTRACT(HOUR FROM CURRENT_TIMESTAMP),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(provider, endpoint, method, date, hour)
);

-- Performance metrics
CREATE TABLE IF NOT EXISTS performance_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_name VARCHAR(255) NOT NULL,
    metric_value DECIMAL(10,2) NOT NULL,
    metric_unit VARCHAR(50),
    component VARCHAR(100),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    tags JSONB DEFAULT '{}',
    threshold_warning DECIMAL(10,2),
    threshold_critical DECIMAL(10,2),
    is_alert BOOLEAN DEFAULT false
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_user_id ON users(user_id);
CREATE INDEX IF NOT EXISTS idx_users_last_active ON users(last_active);
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_session_id ON conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_conversations_status ON conversations(status);
CREATE INDEX IF NOT EXISTS idx_conversations_last_activity ON conversations(last_activity);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp);
CREATE INDEX IF NOT EXISTS idx_messages_message_type ON messages(message_type);
CREATE INDEX IF NOT EXISTS idx_context_storage_conversation_id ON context_storage(conversation_id);
CREATE INDEX IF NOT EXISTS idx_context_storage_expires_at ON context_storage(expires_at);
CREATE INDEX IF NOT EXISTS idx_rules_business_type ON rules(business_type);
CREATE INDEX IF NOT EXISTS idx_rules_is_active ON rules(is_active);
CREATE INDEX IF NOT EXISTS idx_escalations_conversation_id ON escalations(conversation_id);
CREATE INDEX IF NOT EXISTS idx_escalations_status ON escalations(status);
CREATE INDEX IF NOT EXISTS idx_analytics_timestamp ON analytics(timestamp);
CREATE INDEX IF NOT EXISTS idx_analytics_metric_type ON analytics(metric_type);
CREATE INDEX IF NOT EXISTS idx_system_logs_timestamp ON system_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_system_logs_log_level ON system_logs(log_level);
CREATE INDEX IF NOT EXISTS idx_system_logs_component ON system_logs(component);
CREATE INDEX IF NOT EXISTS idx_api_usage_provider ON api_usage(provider);
CREATE INDEX IF NOT EXISTS idx_api_usage_date ON api_usage(date);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_timestamp ON performance_metrics(timestamp);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_component ON performance_metrics(component);

-- Insert default business configurations
INSERT INTO business_configs (business_type, config_name, config_data) VALUES
('telecom', 'default_responses', '{
    "greeting": "Hello! I''m here to help you with your telecom services. How can I assist you today?",
    "data_bundle_help": "I can help you check your data balance, purchase bundles, or troubleshoot data issues.",
    "network_issues": "I understand you''re experiencing network issues. Let me help you troubleshoot this.",
    "billing_support": "I can assist you with billing inquiries, payment issues, and account balance checks."
}'),
('banking', 'default_responses', '{
    "greeting": "Welcome to our banking support! I''m here to help you with your banking needs securely.",
    "account_balance": "I can help you check your account balance and recent transactions.",
    "card_issues": "I can assist you with card-related issues, blocks, and replacements.",
    "loan_inquiry": "I can provide information about our loan products and application process."
}'),
('utilities', 'default_responses', '{
    "greeting": "Hello! I''m here to help you with your utility services. What can I do for you?",
    "bill_payment": "I can help you with bill payments, payment plans, and billing inquiries.",
    "service_outage": "I can check for service outages in your area and provide updates.",
    "meter_reading": "I can assist you with meter readings and consumption queries."
}'),
('ecommerce', 'default_responses', '{
    "greeting": "Hi there! Welcome to our store support. How can I help you today?",
    "order_status": "I can help you track your orders and check delivery status.",
    "returns": "I can assist you with returns, exchanges, and refund processes.",
    "product_info": "I can provide detailed information about our products and services."
}')
ON CONFLICT (business_type, config_name) DO NOTHING;

-- Insert sample rules
INSERT INTO rules (rule_name, business_type, rule_type, conditions, actions, priority) VALUES
('Escalate High Value Customer Issues', 'banking', 'escalation', 
'{"customer_tier": "premium", "issue_type": ["account_locked", "fraud_alert"]}',
'{"escalate": true, "priority": "high", "notify": ["senior_support", "account_manager"]}', 
10),
('Auto-resolve Data Balance Queries', 'telecom', 'automation',
'{"intent": "check_balance", "confidence": {"min": 0.8}}',
'{"provide_balance": true, "suggest_bundles": true}',
5),
('Billing Dispute Escalation', 'utilities', 'escalation',
'{"intent": "billing_dispute", "amount": {"min": 100}}',
'{"escalate": true, "collect_details": true, "priority": "medium"}',
8)
ON CONFLICT DO NOTHING;

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_business_configs_updated_at BEFORE UPDATE ON business_configs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rules_updated_at BEFORE UPDATE ON rules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_api_usage_updated_at BEFORE UPDATE ON api_usage FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create a function to clean up old data
CREATE OR REPLACE FUNCTION cleanup_old_data()
RETURNS void AS $$
BEGIN
    -- Clean up old system logs (older than 30 days)
    DELETE FROM system_logs WHERE timestamp < CURRENT_TIMESTAMP - INTERVAL '30 days';
    
    -- Clean up expired context storage
    DELETE FROM context_storage WHERE expires_at < CURRENT_TIMESTAMP;
    
    -- Clean up old performance metrics (older than 90 days)
    DELETE FROM performance_metrics WHERE timestamp < CURRENT_TIMESTAMP - INTERVAL '90 days';
    
    -- Update analytics for cleanup
    INSERT INTO analytics (metric_type, metric_name, metric_value, dimensions)
    VALUES ('system', 'data_cleanup', 1, '{"cleanup_date": "' || CURRENT_TIMESTAMP || '"}');
END;
$$ LANGUAGE plpgsql;

-- Grant permissions (adjust as needed for your setup)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_app_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_app_user;

-- Insert initial system log entry
INSERT INTO system_logs (log_level, component, message, details) 
VALUES ('info', 'Database', 'Database schema initialized successfully', 
'{"tables_created": ["users", "conversations", "messages", "business_configs", "rules", "context_storage", "escalations", "analytics", "system_logs", "api_usage", "performance_metrics"], "indexes_created": 16, "triggers_created": 4}');

COMMIT;
