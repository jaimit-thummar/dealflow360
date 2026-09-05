-- ==========================================================================
-- DealFlow360 B2B Sales Operations - Supabase Database Schema
-- Run this script in the Supabase SQL Editor to setup tables & RLS policies
-- ==========================================================================

-- 1. Customers Table
CREATE TABLE IF NOT EXISTS public.customers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  contact_name TEXT,
  contact_email TEXT,
  tier TEXT DEFAULT 'Enterprise',
  credit_limit NUMERIC DEFAULT 250000,
  open_balance NUMERIC DEFAULT 0,
  account_manager TEXT,
  shipping_address TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  sku TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  list_price NUMERIC NOT NULL,
  cogs NUMERIC NOT NULL,
  min_margin_pct NUMERIC DEFAULT 18.0,
  default_discount_pct NUMERIC DEFAULT 5.0,
  upsell_ids JSONB DEFAULT '[]'::jsonb,
  cross_sell_ids JSONB DEFAULT '[]'::jsonb,
  in_stock INT DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Quotations Table
CREATE TABLE IF NOT EXISTS public.quotations (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  customer_id TEXT REFERENCES public.customers(id),
  customer_name TEXT NOT NULL,
  customer_contact TEXT,
  customer_email TEXT,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal NUMERIC DEFAULT 0,
  discount_amount NUMERIC DEFAULT 0,
  grand_total NUMERIC DEFAULT 0,
  total_cogs NUMERIC DEFAULT 0,
  margin_pct NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'draft',
  requires_approval BOOLEAN DEFAULT FALSE,
  approval_reason TEXT,
  created_date DATE DEFAULT CURRENT_DATE,
  valid_until DATE,
  sales_rep TEXT,
  warehouse_hub TEXT,
  delivery_request_date DATE,
  customer_comments TEXT,
  negotiation_history JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Approvals Table
CREATE TABLE IF NOT EXISTS public.approvals (
  id TEXT PRIMARY KEY,
  quotation_id TEXT REFERENCES public.quotations(id),
  quotation_code TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  sales_rep TEXT,
  requested_discount_pct NUMERIC,
  margin_pct NUMERIC,
  grand_total NUMERIC,
  trigger_reason TEXT,
  tier TEXT,
  status TEXT DEFAULT 'pending',
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_by TEXT,
  reviewed_at TIMESTAMPTZ,
  rationale TEXT
);

-- 5. Fulfillment Table
CREATE TABLE IF NOT EXISTS public.fulfillments (
  id TEXT PRIMARY KEY,
  quotation_id TEXT REFERENCES public.quotations(id),
  quotation_code TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  warehouse_hub TEXT NOT NULL,
  items_count INT DEFAULT 1,
  status TEXT DEFAULT 'pending_pick',
  carrier TEXT,
  tracking_number TEXT,
  dispatch_date DATE,
  estimated_delivery DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Subscriptions Table
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  plan_name TEXT NOT NULL,
  mrr NUMERIC DEFAULT 0,
  arr NUMERIC DEFAULT 0,
  billing_cycle TEXT DEFAULT 'Monthly',
  start_date DATE,
  renewal_date DATE,
  status TEXT DEFAULT 'active',
  auto_renew BOOLEAN DEFAULT TRUE,
  seats INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Invoices Table
CREATE TABLE IF NOT EXISTS public.invoices (
  id TEXT PRIMARY KEY,
  invoice_number TEXT NOT NULL UNIQUE,
  quotation_code TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  issue_date DATE DEFAULT CURRENT_DATE,
  due_date DATE,
  total_amount NUMERIC DEFAULT 0,
  amount_paid NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'sent',
  payment_terms TEXT DEFAULT 'Net 30',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS) and allow public read/write for hackathon demo
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fulfillments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Anon Access" ON public.customers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Anon Access" ON public.products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Anon Access" ON public.quotations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Anon Access" ON public.approvals FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Anon Access" ON public.fulfillments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Anon Access" ON public.subscriptions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Anon Access" ON public.invoices FOR ALL USING (true) WITH CHECK (true);
