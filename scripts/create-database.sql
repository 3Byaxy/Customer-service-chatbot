-- Customer Support System Database Schema
-- This script creates the necessary tables for the AI customer support system

-- Create database (if using PostgreSQL/MySQL)
-- CREATE DATABASE ai_customer_support;

-- Users table to store customer information
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    customer_id VARCHAR(50) UNIQUE NOT NULL,
    business_type VARCHAR(20) NOT NULL,
    preferred_language VARCHAR(5) DEFAULT 'en',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    profile_data JSONB
);

-- Conversations table to store chat sessions
CREATE TABLE IF NOT EXISTS conversations (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(100) UNIQUE NOT NULL,
    user_id INTEGER REFERENCES users(id),
    business_type VARCHAR(20) NOT NULL,
    language VARCHAR(5) DEFAULT 'en',
    status VARCHAR(20) DEFAULT 'active', -- active, completed, escalated
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP,
    context_data JSONB,
    summary TEXT
);

-- Messages table to store individual chat messages
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    conversation_id INTEGER REFERENCES conversations(id),
    message_type VARCHAR(10) NOT NULL, -- user, bot, system
    content TEXT NOT NULL,
    language VARCHAR(5),
    sentiment_score DECIMAL(3,2), -- -1.00 to 1.00
    intent VARCHAR(50),
    context_tags TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB
);

-- Business configurations table
CREATE TABLE IF NOT EXISTS business_configs (
    id SERIAL PRIMARY KEY,
    business_type VARCHAR(20) UNIQUE NOT NULL,
    config_data JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Rules table for static and dynamic rules
CREATE TABLE IF NOT EXISTS rules (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    business_type VARCHAR(20) NOT NULL,
    rule_type VARCHAR(10) NOT NULL, -- static, dynamic
    condition_logic TEXT NOT NULL,
    action_logic TEXT NOT NULL,
    priority INTEGER DEFAULT 5,
    enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Context storage table for managing AI memory
CREATE TABLE IF NOT EXISTS context_storage (
    id SERIAL PRIMARY KEY,
    context_key VARCHAR(100) NOT NULL,
    context_type VARCHAR(20) NOT NULL, -- conversation, user_profile, business_data, session
    data JSONB NOT NULL,
    size_mb DECIMAL(10,2),
    priority VARCHAR(10) DEFAULT 'medium', -- high, medium, low
    ttl_seconds INTEGER,
    last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);

-- Escalations table to track when conversations are escalated
CREATE TABLE IF NOT EXISTS escalations (
    id SERIAL PRIMARY KEY,
    conversation_id INTEGER REFERENCES conversations(id),
    reason VARCHAR(100) NOT NULL,
    escalated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP,
    resolution_notes TEXT,
    escalated_by VARCHAR(20) DEFAULT 'ai' -- ai, user, system
);

-- Analytics table for tracking performance metrics
CREATE TABLE IF NOT EXISTS analytics (
    id SERIAL PRIMARY KEY,
    business_type VARCHAR(20) NOT NULL,
    metric_name VARCHAR(50) NOT NULL,
    metric_value DECIMAL(10,2),
    date_recorded DATE DEFAULT CURRENT_DATE,
    metadata JSONB
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_conversations_session_id ON conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_conversations_business_type ON conversations(business_type);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_context_storage_key ON context_storage(context_key);
CREATE INDEX IF NOT EXISTS idx_context_storage_type ON context_storage(context_type);
CREATE INDEX IF NOT EXISTS idx_context_storage_expires_at ON context_storage(expires_at);
CREATE INDEX IF NOT EXISTS idx_rules_business_type ON rules(business_type);
CREATE INDEX IF NOT EXISTS idx_users_customer_id ON users(customer_id);

-- Insert sample business configurations
INSERT INTO business_configs (business_type, config_data) VALUES 
('telecom', '{
    "name": "Telecommunications",
    "languages": ["en", "lg", "sw"],
    "businessHours": {"start": "08:00", "end": "20:00", "timezone": "Africa/Kampala"},
    "contextRules": {"maxConversationLength": 50, "retentionDays": 30},
    "localTerms": {"bundles": "data packages", "airtime": "credit", "sente": "money", "simu": "phone"},
    "commonIssues": ["Data bundle purchase", "Network connectivity", "Billing inquiries", "Roaming charges", "SIM card issues"],
    "escalationRules": {"sentiment": true, "keywords": ["angry", "frustrated", "complaint"], "responseTime": 300}
}'),
('banking', '{
    "name": "Banking Services",
    "languages": ["en", "lg", "sw"],
    "businessHours": {"start": "09:00", "end": "17:00", "timezone": "Africa/Kampala"},
    "contextRules": {"maxConversationLength": 30, "retentionDays": 90},
    "localTerms": {"sente": "money", "akawuka": "small money", "mobile money": "mobile banking", "account": "akaunt"},
    "commonIssues": ["Account balance inquiry", "Mobile money transfer", "Loan application status", "Card activation", "ATM issues"],
    "escalationRules": {"sentiment": true, "keywords": ["fraud", "security", "unauthorized"], "responseTime": 180}
}');

-- Insert sample rules
INSERT INTO rules (name, business_type, rule_type, condition_logic, action_logic, priority) VALUES
('Language Detection', 'all', 'static', 'message.contains(luganda_keywords)', 'set_language("lg")', 1),
('Billing Inquiry Route', 'telecom', 'dynamic', 'intent == "billing" && business == "telecom"', 'route_to_billing_agent()', 2),
('Emergency Response', 'all', 'static', 'message.contains(["emergency", "urgent", "problem"])', 'escalate_priority()', 10),
('Greeting Response', 'all', 'static', 'message.startsWith(["hello", "hi", "good"])', 'respond_greeting()', 3),
('Sentiment Analysis', 'all', 'dynamic', 'sentiment == "negative"', 'escalate_to_human()', 8);
