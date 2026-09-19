-- ====================================================================
-- DukaanPayAI – Master PostgreSQL 16 Production Database Schema
-- Includes UUIDs, Soft Deletes, Optimistic Locking, and Partitioning
-- ====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Merchants Table
CREATE TABLE IF NOT EXISTS merchants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_name VARCHAR(255) NOT NULL,
    owner_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255),
    category VARCHAR(100) NOT NULL DEFAULT 'Kirana & FMCG',
    pincode VARCHAR(10) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    kyc_status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    preferred_language VARCHAR(10) NOT NULL DEFAULT 'hi',
    settings JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE NULL,
    version INT NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_merchants_pincode ON merchants (pincode) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_merchants_phone ON merchants (phone_number) WHERE deleted_at IS NULL;

-- 2. Users Table (Authentication & RBAC)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID REFERENCES merchants(id) ON DELETE SET NULL,
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255) NOT NULL, -- Argon2id hash
    roles VARCHAR(50)[] NOT NULL DEFAULT ARRAY['MERCHANT'],
    permissions VARCHAR(50)[] NOT NULL DEFAULT ARRAY['READ_PROFILE'],
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE NULL,
    version INT NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_users_phone ON users (phone_number) WHERE deleted_at IS NULL;

-- 3. Partitioned Transactions Telemetry Table
CREATE TABLE IF NOT EXISTS transactions (
    id UUID DEFAULT uuid_generate_v4(),
    merchant_id UUID NOT NULL REFERENCES merchants(id),
    soundbox_device_id VARCHAR(100) NOT NULL,
    txn_reference_id VARCHAR(100) NOT NULL,
    payer_vpa_masked VARCHAR(100),
    amount NUMERIC(12, 2) NOT NULL,
    payment_mode VARCHAR(20) NOT NULL DEFAULT 'UPI',
    status VARCHAR(20) NOT NULL DEFAULT 'SUCCESS',
    captured_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (id, captured_at)
) PARTITION BY RANGE (captured_at);

-- Monthly partition examples
CREATE TABLE IF NOT EXISTS transactions_2026_09 PARTITION OF transactions
    FOR VALUES FROM ('2026-09-01 00:00:00+00') TO ('2026-10-01 00:00:00+00');
CREATE TABLE IF NOT EXISTS transactions_2026_10 PARTITION OF transactions
    FOR VALUES FROM ('2026-10-01 00:00:00+00') TO ('2026-11-01 00:00:00+00');

CREATE INDEX IF NOT EXISTS idx_txns_merchant_captured ON transactions (merchant_id, captured_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS uq_txns_soundbox_ref ON transactions (soundbox_device_id, txn_reference_id, captured_at);

-- 4. Campaigns Table
CREATE TABLE IF NOT EXISTS campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID NOT NULL REFERENCES merchants(id),
    title VARCHAR(255) NOT NULL,
    target_segment VARCHAR(100) NOT NULL,
    channel VARCHAR(50) NOT NULL DEFAULT 'WHATSAPP',
    template_slug VARCHAR(100) NOT NULL,
    template_parameters JSONB DEFAULT '{}'::jsonb,
    scheduled_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
    audience_count INT NOT NULL DEFAULT 0,
    delivered_count INT NOT NULL DEFAULT 0,
    failed_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE NULL,
    version INT NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_campaigns_merchant ON campaigns (merchant_id) WHERE deleted_at IS NULL;

-- 5. Notifications Log Table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID NOT NULL REFERENCES merchants(id),
    campaign_id UUID REFERENCES campaigns(id),
    channel VARCHAR(50) NOT NULL,
    recipient VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'QUEUED',
    provider_reference VARCHAR(100),
    retry_count INT NOT NULL DEFAULT 0,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE NULL,
    version INT NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_notifications_merchant ON notifications (merchant_id);

-- 6. Audit Trail Table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id VARCHAR(100) NOT NULL,
    actor_type VARCHAR(50) NOT NULL,
    action VARCHAR(100) NOT NULL,
    entity_name VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100) NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_actor ON audit_logs (actor_id, created_at DESC);

-- 7. Generic Webhook Subscriptions Table
CREATE TABLE IF NOT EXISTS webhook_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID NOT NULL REFERENCES merchants(id),
    target_url TEXT NOT NULL,
    secret VARCHAR(255) NOT NULL,
    subscribed_events TEXT[] NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    failure_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE NULL,
    version INT NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS idx_webhooks_merchant ON webhook_subscriptions (merchant_id) WHERE deleted_at IS NULL;
