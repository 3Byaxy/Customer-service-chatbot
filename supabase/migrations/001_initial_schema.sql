-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    profile JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sessions table
CREATE TABLE sessions (
    id VARCHAR(255) PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    business_type VARCHAR(100) NOT NULL,
    language VARCHAR(10) NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    context JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(255) REFERENCES sessions(id) ON DELETE CASCADE,
    sender VARCHAR(20) NOT NULL CHECK (sender IN ('user', 'bot', 'agent')),
    content TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);

-- Create tickets table
CREATE TABLE tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(255) REFERENCES sessions(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    category VARCHAR(100),
    description TEXT,
    assigned_to VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create knowledge_base table
CREATE TABLE knowledge_base (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100),
    business_type VARCHAR(100),
    language VARCHAR(10),
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create analytics table
CREATE TABLE analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(255) REFERENCES sessions(id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL,
    event_data JSONB DEFAULT '{}',
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_status ON sessions(status);
CREATE INDEX idx_messages_session_id ON messages(session_id);
CREATE INDEX idx_messages_timestamp ON messages(timestamp);
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_priority ON tickets(priority);
CREATE INDEX idx_knowledge_base_business_type ON knowledge_base(business_type);
CREATE INDEX idx_knowledge_base_language ON knowledge_base(language);
CREATE INDEX idx_analytics_session_id ON analytics(session_id);
CREATE INDEX idx_analytics_event_type ON analytics(event_type);

-- Create full-text search index for knowledge base
CREATE INDEX idx_knowledge_base_content_fts ON knowledge_base USING gin(to_tsvector('english', content));

-- Insert sample knowledge base entries
INSERT INTO knowledge_base (title, content, category, business_type, language, tags) VALUES
-- Telecom entries
('Data Bundle Purchase', 'To purchase a data bundle, dial *100# and follow the prompts. You can also use our mobile app or visit our website.', 'data_services', 'telecom', 'en', ARRAY['data', 'bundle', 'purchase']),
('Network Coverage Issues', 'If you are experiencing network coverage issues, try restarting your phone or moving to a different location. Contact support if the issue persists.', 'technical_support', 'telecom', 'en', ARRAY['network', 'coverage', 'signal']),
('Bill Payment Methods', 'You can pay your bill through mobile money, bank transfer, or at any of our service centers. Online payment is also available on our website.', 'billing', 'telecom', 'en', ARRAY['payment', 'bill', 'methods']),

-- Banking entries
('Account Balance Inquiry', 'To check your account balance, dial *165# or use our mobile banking app. You can also visit any ATM or branch.', 'account_services', 'banking', 'en', ARRAY['balance', 'inquiry', 'account']),
('Lost Card Reporting', 'If your card is lost or stolen, immediately call our 24/7 hotline at 0800-123-456 to block the card and request a replacement.', 'card_services', 'banking', 'en', ARRAY['lost', 'card', 'block']),
('Loan Application Process', 'To apply for a loan, visit any branch with your ID, salary slip, and bank statements. You can also apply online through our website.', 'loan_services', 'banking', 'en', ARRAY['loan', 'application', 'requirements']),

-- Utilities entries
('Power Outage Reporting', 'To report a power outage, call 0800-POWER or use our mobile app. Please provide your meter number and location details.', 'power_services', 'utilities', 'en', ARRAY['power', 'outage', 'reporting']),
('Bill Payment Options', 'Pay your utility bills through mobile money, bank transfer, or at authorized payment points. Online payment is available on our website.', 'billing', 'utilities', 'en', ARRAY['payment', 'bill', 'utilities']),
('Meter Reading Schedule', 'Meter readings are conducted monthly. If you miss a reading, you can submit your own reading through our app or website.', 'meter_services', 'utilities', 'en', ARRAY['meter', 'reading', 'schedule']),

-- E-commerce entries
('Order Tracking', 'Track your order using the tracking number sent to your email or SMS. You can also check order status in your account dashboard.', 'order_management', 'ecommerce', 'en', ARRAY['order', 'tracking', 'status']),
('Return Policy', 'Items can be returned within 30 days of purchase if unused and in original packaging. Contact customer service to initiate a return.', 'returns', 'ecommerce', 'en', ARRAY['return', 'policy', 'refund']),
('Payment Methods', 'We accept mobile money, credit cards, and bank transfers. Payment is processed securely through our payment gateway.', 'payment', 'ecommerce', 'en', ARRAY['payment', 'methods', 'secure']);

-- Insert sample users and sessions for testing
INSERT INTO users (email, profile) VALUES
('test@example.com', '{"preferred_language": "en", "business_type": "telecom"}'),
('demo@example.com', '{"preferred_language": "lg", "business_type": "banking"}');

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust as needed for your security requirements)
CREATE POLICY "Allow public read access to knowledge_base" ON knowledge_base FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read access to users" ON users FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to sessions" ON sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read access to sessions" ON sessions FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to messages" ON messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read access to messages" ON messages FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to tickets" ON tickets FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read access to tickets" ON tickets FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to analytics" ON analytics FOR INSERT WITH CHECK (true);
