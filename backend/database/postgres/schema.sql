-- ==========================================================
-- DukaanPayAI: PostgreSQL 16 Enterprise Production Schema
-- Supports 1M+ merchants, time-series transactions, and pgvector embeddings
-- ==========================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- 1. Merchants Table
CREATE TABLE IF NOT EXISTS merchants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_code VARCHAR(32) UNIQUE NOT NULL,
    phone_number VARCHAR(15) UNIQUE NOT NULL,
    email VARCHAR(255),
    full_name VARCHAR(120) NOT NULL,
    business_name VARCHAR(200) NOT NULL,
    kyc_status VARCHAR(30) DEFAULT 'VERIFIED' CHECK (kyc_status IN ('PENDING', 'VERIFIED', 'REJECTED')),
    subscription_tier VARCHAR(30) DEFAULT 'GROWTH_PRO' CHECK (subscription_tier IN ('STARTER', 'GROWTH_PRO', 'ENTERPRISE')),
    preferred_language VARCHAR(10) DEFAULT 'hi' CHECK (preferred_language IN ('hi', 'en', 'ta', 'te', 'mr', 'bn', 'gu', 'kn')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_merchants_phone ON merchants(phone_number);
CREATE INDEX IF NOT EXISTS idx_merchants_tier ON merchants(subscription_tier);

-- 2. Stores Table
CREATE TABLE IF NOT EXISTS stores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
    store_name VARCHAR(200) NOT NULL,
    address_line TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(10) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    soundbox_device_id VARCHAR(64) UNIQUE,
    upi_vpa VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_stores_merchant_id ON stores(merchant_id);
CREATE INDEX IF NOT EXISTS idx_stores_soundbox ON stores(soundbox_device_id);

-- 3. Transactions Table (Time-Series Partitioned by Month)
CREATE TABLE IF NOT EXISTS transactions (
    id UUID DEFAULT uuid_generate_v4(),
    merchant_id UUID NOT NULL REFERENCES merchants(id),
    store_id UUID NOT NULL REFERENCES stores(id),
    soundbox_device_id VARCHAR(64),
    txn_reference_id VARCHAR(100) NOT NULL,
    payer_vpa_masked VARCHAR(100),
    amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
    payment_mode VARCHAR(30) DEFAULT 'UPI' CHECK (payment_mode IN ('UPI', 'CARD', 'WALLET', 'NET_BANKING', 'CASH')),
    status VARCHAR(30) DEFAULT 'SUCCESS' CHECK (status IN ('SUCCESS', 'FAILED', 'PENDING', 'REFUNDED')),
    captured_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id, captured_at)
) PARTITION BY RANGE (captured_at);

-- Partition for current year / month
CREATE TABLE IF NOT EXISTS transactions_2026_09 PARTITION OF transactions
    FOR VALUES FROM ('2026-09-01 00:00:00+00') TO ('2026-10-01 00:00:00+00');
CREATE TABLE IF NOT EXISTS transactions_default PARTITION OF transactions DEFAULT;

CREATE INDEX IF NOT EXISTS idx_txn_merchant_captured ON transactions(merchant_id, captured_at DESC);
CREATE INDEX IF NOT EXISTS idx_txn_reference ON transactions(txn_reference_id);

-- 4. SKUs Table
CREATE TABLE IF NOT EXISTS skus (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
    sku_code VARCHAR(64) NOT NULL,
    product_name VARCHAR(200) NOT NULL,
    category VARCHAR(100) NOT NULL,
    brand VARCHAR(100),
    unit_of_measure VARCHAR(20) DEFAULT 'unit',
    standard_mrp DECIMAL(10, 2) NOT NULL,
    avg_purchase_price DECIMAL(10, 2) NOT NULL,
    selling_price DECIMAL(10, 2) NOT NULL,
    embedding vector(384),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(merchant_id, sku_code)
);
CREATE INDEX IF NOT EXISTS idx_skus_merchant_cat ON skus(merchant_id, category);

-- 5. Inventory Table
CREATE TABLE IF NOT EXISTS inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    sku_id UUID NOT NULL REFERENCES skus(id) ON DELETE CASCADE,
    current_stock_units DECIMAL(10, 2) NOT NULL DEFAULT 0,
    reorder_point_units DECIMAL(10, 2) NOT NULL DEFAULT 10,
    safety_stock_units DECIMAL(10, 2) NOT NULL DEFAULT 5,
    last_restocked_at TIMESTAMPTZ,
    predicted_stockout_at TIMESTAMPTZ,
    is_low_stock BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(store_id, sku_id)
);
CREATE INDEX IF NOT EXISTS idx_inventory_store_low_stock ON inventory(store_id, is_low_stock);

-- 6. Customers Table
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
    phone_number_masked VARCHAR(20) NOT NULL,
    full_name VARCHAR(120),
    rfm_segment VARCHAR(50) DEFAULT 'OCCASIONAL',
    churn_probability DECIMAL(5, 4) DEFAULT 0.0000,
    loyalty_score INT DEFAULT 50 CHECK (loyalty_score BETWEEN 0 AND 100),
    total_spend DECIMAL(12, 2) DEFAULT 0.00,
    total_visits INT DEFAULT 1,
    last_visit_at TIMESTAMPTZ NOT NULL,
    avg_days_between_visits DECIMAL(6, 2),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(merchant_id, phone_number_masked)
);
CREATE INDEX IF NOT EXISTS idx_customers_merchant_churn ON customers(merchant_id, churn_probability DESC);

-- 7. Invoices Table
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
    store_id UUID NOT NULL REFERENCES stores(id),
    distributor_name VARCHAR(200) NOT NULL,
    invoice_number VARCHAR(100),
    invoice_date DATE NOT NULL,
    total_amount DECIMAL(12, 2) NOT NULL,
    ocr_confidence_score DECIMAL(5, 4),
    mongo_document_id VARCHAR(64) NOT NULL,
    overcharge_detected DECIMAL(10, 2) DEFAULT 0.00,
    status VARCHAR(30) DEFAULT 'PROCESSED' CHECK (status IN ('QUEUED', 'PROCESSING', 'PROCESSED', 'FAILED')),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 8. Forecasts Table
CREATE TABLE IF NOT EXISTS forecasts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    sku_id UUID REFERENCES skus(id) ON DELETE CASCADE,
    forecast_type VARCHAR(50) NOT NULL CHECK (forecast_type IN ('REVENUE_DAILY', 'FOOTFALL_HOURLY', 'SKU_DEMAND')),
    forecast_start_date DATE NOT NULL,
    forecast_end_date DATE NOT NULL,
    predicted_value DECIMAL(12, 2) NOT NULL,
    lower_bound DECIMAL(12, 2),
    upper_bound DECIMAL(12, 2),
    confidence_interval DECIMAL(4, 2) DEFAULT 0.95,
    model_version VARCHAR(50) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 9. Recommendations Table
CREATE TABLE IF NOT EXISTS recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
    recommendation_type VARCHAR(60) NOT NULL CHECK (recommendation_type IN ('RESTOCK_SKU', 'DISTRIBUTOR_DISPUTE', 'CHURN_CAMPAIGN', 'PREPARE_PEAK_RUSH', 'WORKING_CAPITAL_LOAN')),
    title VARCHAR(255) NOT NULL,
    body_indic JSONB NOT NULL,
    expected_roi_amount DECIMAL(10, 2),
    priority VARCHAR(20) DEFAULT 'MEDIUM' CHECK (priority IN ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW')),
    status VARCHAR(30) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'DISMISSED', 'APPLIED')),
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 10. Campaigns Table
CREATE TABLE IF NOT EXISTS campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
    store_id UUID NOT NULL REFERENCES stores(id),
    title VARCHAR(200) NOT NULL,
    target_segment VARCHAR(50) NOT NULL,
    channel VARCHAR(30) DEFAULT 'WHATSAPP' CHECK (channel IN ('WHATSAPP', 'SMS')),
    template_slug VARCHAR(100) NOT NULL,
    parameters JSONB NOT NULL,
    approval_status VARCHAR(30) DEFAULT 'PENDING_APPROVAL' CHECK (approval_status IN ('DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED')),
    execution_status VARCHAR(30) DEFAULT 'NOT_STARTED' CHECK (execution_status IN ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'FAILED')),
    scheduled_at TIMESTAMPTZ,
    executed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 11. Campaign Results Table
CREATE TABLE IF NOT EXISTS campaign_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    recipients_targeted INT NOT NULL,
    messages_delivered INT DEFAULT 0,
    messages_read INT DEFAULT 0,
    offers_redeemed INT DEFAULT 0,
    incremental_revenue DECIMAL(12, 2) DEFAULT 0.00,
    cost_incurred DECIMAL(10, 2) DEFAULT 0.00,
    roi_multiple DECIMAL(6, 2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 12. Merchant Health Scores Table
CREATE TABLE IF NOT EXISTS health_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
    composite_score DECIMAL(5, 2) NOT NULL CHECK (composite_score BETWEEN 0 AND 100),
    revenue_stability_score DECIMAL(5, 2) NOT NULL,
    inventory_health_score DECIMAL(5, 2) NOT NULL,
    customer_retention_score DECIMAL(5, 2) NOT NULL,
    supplier_discipline_score DECIMAL(5, 2) NOT NULL,
    metrics_snapshot JSONB NOT NULL,
    grade VARCHAR(5) NOT NULL,
    evaluated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 13. Credit Eligibility Table
CREATE TABLE IF NOT EXISTS credit_eligibility (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
    pre_approved_amount DECIMAL(12, 2) NOT NULL,
    interest_rate_monthly DECIMAL(4, 2) NOT NULL,
    tenure_days INT NOT NULL,
    daily_soundbox_escrow_deduction DECIMAL(10, 2) NOT NULL,
    status VARCHAR(30) DEFAULT 'OFFERED' CHECK (status IN ('OFFERED', 'ACCEPTED', 'DISBURSED', 'CLOSED', 'EXPIRED')),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 14. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
    channel VARCHAR(30) NOT NULL CHECK (channel IN ('WHATSAPP', 'SMS', 'VOICE_CALL', 'EMAIL', 'PUSH')),
    recipient VARCHAR(100) NOT NULL,
    message_content TEXT NOT NULL,
    status VARCHAR(30) DEFAULT 'QUEUED' CHECK (status IN ('QUEUED', 'SENT', 'DELIVERED', 'FAILED', 'BOUNCED')),
    sent_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 15. Voice Calls Table
CREATE TABLE IF NOT EXISTS voice_calls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant_id UUID NOT NULL REFERENCES merchants(id) ON DELETE CASCADE,
    call_sid VARCHAR(100) UNIQUE,
    call_type VARCHAR(50) NOT NULL CHECK (call_type IN ('MORNING_BRIEFING', 'STOCKOUT_ALERT', 'PAYMENT_REMINDER')),
    language VARCHAR(10) DEFAULT 'hi',
    call_duration_seconds INT DEFAULT 0,
    call_status VARCHAR(30) DEFAULT 'QUEUED' CHECK (call_status IN ('QUEUED', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'NO_ANSWER')),
    audio_url VARCHAR(500),
    transcription TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================
-- SEED DATA: Target Persona - Rajesh "Rameshji" Gupta
-- Gupta Kirana Store, Kanpur, UP
-- ==========================================================

INSERT INTO merchants (id, merchant_code, phone_number, full_name, business_name, email, kyc_status, subscription_tier, preferred_language)
VALUES (
    'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
    'MER_KANPUR_001',
    '+919876543210',
    'Rajesh "Rameshji" Gupta',
    'Gupta Kirana Store',
    'rameshji.kirana@paytm.sample',
    'VERIFIED',
    'GROWTH_PRO',
    'hi'
) ON CONFLICT (phone_number) DO NOTHING;

INSERT INTO stores (id, merchant_id, store_name, address_line, city, state, pincode, soundbox_device_id, upi_vpa)
VALUES (
    'b2c3d4e5-f6a1-4b5c-9d0e-1f2a3b4c5d6e',
    'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
    'Gupta Kirana Store (Main Mandi)',
    'Shop No 14, Govind Nagar Market',
    'Kanpur',
    'Uttar Pradesh',
    '208006',
    'PAYTM_SBX_KANPUR_8829',
    'guptakirana@paytm'
) ON CONFLICT (soundbox_device_id) DO NOTHING;

-- Seed FMCG SKUs
INSERT INTO skus (id, merchant_id, sku_code, product_name, category, brand, unit_of_measure, standard_mrp, avg_purchase_price, selling_price)
VALUES 
(
    'c3d4e5f6-a1b2-4c5d-0e1f-2a3b4c5d6e7f',
    'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
    'SKU-OIL-01',
    'Fortune Sunlite Refined Mustard Oil 1L',
    'Edible Oils',
    'Fortune',
    'litre',
    160.00,
    130.00,
    155.00
),
(
    'd4e5f6a1-b2c3-4d5e-1f2a-3b4c5d6e7f8a',
    'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
    'SKU-ATA-02',
    'Aashirvaad Shudh Chakki Atta 5kg',
    'Flours & Grains',
    'ITC Aashirvaad',
    'kg',
    235.00,
    215.00,
    230.00
) ON CONFLICT (merchant_id, sku_code) DO NOTHING;

-- Seed Stock Levels
INSERT INTO inventory (store_id, sku_id, current_stock_units, reorder_point_units, safety_stock_units, is_low_stock)
VALUES
('b2c3d4e5-f6a1-4b5c-9d0e-1f2a3b4c5d6e', 'c3d4e5f6-a1b2-4c5d-0e1f-2a3b4c5d6e7f', 4, 15, 5, TRUE),
('b2c3d4e5-f6a1-4b5c-9d0e-1f2a3b4c5d6e', 'd4e5f6a1-b2c3-4d5e-1f2a-3b4c5d6e7f8a', 3, 12, 4, TRUE)
ON CONFLICT (store_id, sku_id) DO UPDATE SET is_low_stock = EXCLUDED.is_low_stock;

-- Seed Health Score & Credit Line
INSERT INTO health_scores (merchant_id, composite_score, revenue_stability_score, inventory_health_score, customer_retention_score, supplier_discipline_score, metrics_snapshot, grade)
VALUES (
    'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
    84.00,
    88.00,
    76.00,
    85.00,
    90.00,
    '{"rolling30dRevenue": 192500, "avgDailyTxnCount": 48, "churnRatePercentage": 4.2}',
    'AA'
);

INSERT INTO credit_eligibility (merchant_id, pre_approved_amount, interest_rate_monthly, tenure_days, daily_soundbox_escrow_deduction, status)
VALUES (
    'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
    330000.00,
    1.33,
    90,
    3815.00,
    'OFFERED'
);
