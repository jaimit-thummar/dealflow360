-- ==========================================================================
-- DealFlow360 B2B Sales Operations - Relational SQL Database Schema
-- Standard PostgreSQL / SQL Schema for Enterprise Sales Engine
-- ==========================================================================

-- 1. Customers Table
CREATE TABLE IF NOT EXISTS customers (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(64) NOT NULL UNIQUE,
  contact_name VARCHAR(255),
  contact_email VARCHAR(255),
  tier VARCHAR(64) DEFAULT 'Enterprise',
  credit_limit NUMERIC(12, 2) DEFAULT 250000.00,
  open_balance NUMERIC(12, 2) DEFAULT 0.00,
  account_manager VARCHAR(255),
  shipping_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Products Table
CREATE TABLE IF NOT EXISTS products (
  id VARCHAR(64) PRIMARY KEY,
  sku VARCHAR(64) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT,
  list_price NUMERIC(12, 2) NOT NULL,
  cogs NUMERIC(12, 2) NOT NULL,
  min_margin_pct NUMERIC(5, 2) DEFAULT 18.00,
  default_discount_pct NUMERIC(5, 2) DEFAULT 5.00,
  upsell_ids JSONB DEFAULT '[]'::jsonb,
  cross_sell_ids JSONB DEFAULT '[]'::jsonb,
  in_stock INTEGER DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Quotations Table
CREATE TABLE IF NOT EXISTS quotations (
  id VARCHAR(64) PRIMARY KEY,
  code VARCHAR(64) NOT NULL UNIQUE,
  customer_id VARCHAR(64) REFERENCES customers(id),
  customer_name VARCHAR(255) NOT NULL,
  customer_contact VARCHAR(255),
  customer_email VARCHAR(255),
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal NUMERIC(12, 2) DEFAULT 0.00,
  discount_amount NUMERIC(12, 2) DEFAULT 0.00,
  grand_total NUMERIC(12, 2) DEFAULT 0.00,
  total_cogs NUMERIC(12, 2) DEFAULT 0.00,
  margin_pct NUMERIC(5, 2) DEFAULT 0.00,
  status VARCHAR(50) DEFAULT 'draft',
  requires_approval BOOLEAN DEFAULT FALSE,
  approval_reason TEXT,
  created_date DATE DEFAULT CURRENT_DATE,
  valid_until DATE,
  sales_rep VARCHAR(255),
  warehouse_hub VARCHAR(255),
  delivery_request_date DATE,
  customer_comments TEXT,
  negotiation_history JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Approvals Table
CREATE TABLE IF NOT EXISTS approvals (
  id VARCHAR(64) PRIMARY KEY,
  quotation_id VARCHAR(64) REFERENCES quotations(id) ON DELETE CASCADE,
  quotation_code VARCHAR(64) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  sales_rep VARCHAR(255),
  requested_discount_pct NUMERIC(5, 2),
  margin_pct NUMERIC(5, 2),
  grand_total NUMERIC(12, 2),
  trigger_reason TEXT,
  tier VARCHAR(64),
  status VARCHAR(50) DEFAULT 'pending',
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  reviewed_by VARCHAR(255),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  rationale TEXT
);

-- 5. Fulfillment Table
CREATE TABLE IF NOT EXISTS fulfillments (
  id VARCHAR(64) PRIMARY KEY,
  quotation_id VARCHAR(64) REFERENCES quotations(id) ON DELETE CASCADE,
  quotation_code VARCHAR(64) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  warehouse_hub VARCHAR(255) NOT NULL,
  items_count INTEGER DEFAULT 1,
  status VARCHAR(50) DEFAULT 'pending_pick',
  carrier VARCHAR(255),
  tracking_number VARCHAR(255),
  dispatch_date DATE,
  estimated_delivery DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Subscriptions Table
CREATE TABLE IF NOT EXISTS subscriptions (
  id VARCHAR(64) PRIMARY KEY,
  code VARCHAR(64) NOT NULL UNIQUE,
  customer_name VARCHAR(255) NOT NULL,
  plan_name VARCHAR(255) NOT NULL,
  mrr NUMERIC(12, 2) DEFAULT 0.00,
  arr NUMERIC(12, 2) DEFAULT 0.00,
  billing_cycle VARCHAR(50) DEFAULT 'Monthly',
  start_date DATE,
  renewal_date DATE,
  status VARCHAR(50) DEFAULT 'active',
  auto_renew BOOLEAN DEFAULT TRUE,
  seats INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Invoices Table
CREATE TABLE IF NOT EXISTS invoices (
  id VARCHAR(64) PRIMARY KEY,
  invoice_number VARCHAR(64) NOT NULL UNIQUE,
  quotation_code VARCHAR(64) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  issue_date DATE DEFAULT CURRENT_DATE,
  due_date DATE,
  total_amount NUMERIC(12, 2) DEFAULT 0.00,
  amount_paid NUMERIC(12, 2) DEFAULT 0.00,
  status VARCHAR(50) DEFAULT 'sent',
  payment_terms VARCHAR(50) DEFAULT 'Net 30',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
