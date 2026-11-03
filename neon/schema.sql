-- ====================================================================
-- ARROW FLOW: Neon Tech PostgreSQL Schema & Migration
-- Database: Neon Serverless Postgres (console.neon.tech)
-- Agency: Arrow Solutions (Offline Marketing, Brand Activation & Web/IT)
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. CUSTOM ENUMS & TYPES
DO $$ BEGIN
  CREATE TYPE lead_status AS ENUM (
    'New',
    'Contacted',
    'Proposal Sent',
    'Won',
    'Lost'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE service_domain AS ENUM (
    'BTL & Activation',
    'Digital Marketing',
    'Web & IT',
    'Event Management'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE invoice_status AS ENUM (
    'Unpaid',
    'Partially Paid',
    'Paid'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE expense_category AS ENUM (
    'Office & Rent',
    'Marketing',
    'Domain & Hosting',
    'Operational',
    'Salaries',
    'Misc'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE staff_role AS ENUM (
    'admin',
    'manager',
    'executive'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 3. TABLES DEFINITION

-- Table: profiles (Staff & Management Accounts)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role staff_role NOT NULL DEFAULT 'executive',
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Table: contacts (Leads & Clients)
CREATE TABLE IF NOT EXISTS contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    company TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    service_domain service_domain NOT NULL DEFAULT 'BTL & Activation',
    status lead_status NOT NULL DEFAULT 'New',
    deal_value NUMERIC(14,2) NOT NULL DEFAULT 0.00,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Table: invoices (Client Invoices and Receivables)
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
    invoice_no TEXT NOT NULL UNIQUE,
    total_amount NUMERIC(14,2) NOT NULL DEFAULT 0.00,
    paid_amount NUMERIC(14,2) NOT NULL DEFAULT 0.00,
    status invoice_status NOT NULL DEFAULT 'Unpaid',
    due_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT valid_payment CHECK (paid_amount <= total_amount + 0.01)
);

-- Table: expenses (Operational & Overhead Agency Expenses)
CREATE TABLE IF NOT EXISTS expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category expense_category NOT NULL DEFAULT 'Operational',
    amount NUMERIC(14,2) NOT NULL DEFAULT 0.00,
    expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
    receipt_url TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Table: employees (Agency Staff Registry)
CREATE TABLE IF NOT EXISTS employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    designation TEXT NOT NULL,
    base_salary NUMERIC(14,2) NOT NULL DEFAULT 0.00,
    joining_date DATE NOT NULL DEFAULT CURRENT_DATE,
    phone TEXT,
    email TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Table: payroll (Monthly Salary Disbursements & Adjustments)
CREATE TABLE IF NOT EXISTS payroll (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    month_year TEXT NOT NULL,
    bonus NUMERIC(14,2) NOT NULL DEFAULT 0.00,
    deductions NUMERIC(14,2) NOT NULL DEFAULT 0.00,
    net_salary NUMERIC(14,2) NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Pending', 'Paid')) DEFAULT 'Pending',
    disbursed_at DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);
CREATE INDEX IF NOT EXISTS idx_contacts_domain ON contacts(service_domain);
CREATE INDEX IF NOT EXISTS idx_invoices_contact ON invoices(contact_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(expense_date);
CREATE INDEX IF NOT EXISTS idx_payroll_employee ON payroll(employee_id);

-- 5. AUTOMATIC TIMESTAMP TRIGGERS
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_contacts_timestamp ON contacts;
CREATE TRIGGER trigger_update_contacts_timestamp
    BEFORE UPDATE ON contacts
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS trigger_update_invoices_timestamp ON invoices;
CREATE TRIGGER trigger_update_invoices_timestamp
    BEFORE UPDATE ON invoices
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

-- 6. INITIAL SAMPLE SEED DATA
DO $$
DECLARE
    v_c1 UUID := 'c1111111-1111-1111-1111-111111111111';
    v_c2 UUID := 'c2222222-2222-2222-2222-222222222222';
    v_c3 UUID := 'c3333333-3333-3333-3333-333333333333';
    v_c4 UUID := 'c4444444-4444-4444-4444-444444444444';
    v_c5 UUID := 'c5555555-5555-5555-5555-555555555555';
    v_c6 UUID := 'c6666666-6666-6666-6666-666666666666';
    v_e1 UUID := 'e1111111-1111-1111-1111-111111111111';
    v_e2 UUID := 'e2222222-2222-2222-2222-222222222222';
    v_e3 UUID := 'e3333333-3333-3333-3333-333333333333';
BEGIN
    -- Seed Staff Profile
    INSERT INTO profiles (email, full_name, role)
    VALUES ('tariqul@arrowsolutions.com', 'Kazi Tariqul Islam', 'admin')
    ON CONFLICT (email) DO NOTHING;

    -- Seed Contacts (BTL, Digital, IT, Event)
    INSERT INTO contacts (id, name, company, phone, email, service_domain, status, deal_value, notes)
    VALUES
        (v_c1, 'Tanvir Ahmed', 'Apex Footwear Ltd', '+8801711223344', 'tanvir@apexbd.com', 'BTL & Activation', 'Won', 350000.00, 'Nationwide roadshow brand activation campaign across 12 divisional hubs.'),
        (v_c2, 'Nazia Rahman', 'Shwapno Superstores', '+8801819556677', 'nazia.r@shwapno.net', 'Digital Marketing', 'Won', 180000.00, 'Q4 Social performance marketing & influencer management.'),
        (v_c3, 'Rafiqul Islam', 'Square Toiletries', '+8801912334455', 'rafiq@squaregroup.com', 'Event Management', 'Proposal Sent', 420000.00, 'Annual Dealer Conference 2026 at Bangabandhu Convention Hall.'),
        (v_c4, 'Zubair Hossain', 'Fintech Pulse Ltd', '+8801755667788', 'zubair@pulsepay.io', 'Web & IT', 'Won', 275000.00, 'Custom Next.js Merchant portal & API integrations.'),
        (v_c5, 'Farhana Karim', 'Bengal Meat Co.', '+8801677889900', 'f.karim@bengalmeat.com', 'BTL & Activation', 'Contacted', 150000.00, 'Pop-up tasting stalls across major Dhaka supermarkets.'),
        (v_c6, 'Kamrul Hasan', 'Walton Hi-Tech', '+8801733445566', 'k.hasan@walton.com.bd', 'Digital Marketing', 'New', 210000.00, 'Inquiry received for Smart TV digital launch campaign.')
    ON CONFLICT (id) DO NOTHING;

    -- Seed Invoices
    INSERT INTO invoices (id, contact_id, invoice_no, total_amount, paid_amount, status, due_date, notes)
    VALUES
        (gen_random_uuid(), v_c1, 'INV-2026-001', 350000.00, 350000.00, 'Paid', CURRENT_DATE - INTERVAL '15 days', 'Roadshow activation first phase full settlement.'),
        (gen_random_uuid(), v_c2, 'INV-2026-002', 180000.00, 100000.00, 'Partially Paid', CURRENT_DATE + INTERVAL '5 days', 'Advance paid ৳100,000. Balance due upon submission of final report.'),
        (gen_random_uuid(), v_c4, 'INV-2026-003', 275000.00, 0.00, 'Unpaid', CURRENT_DATE + INTERVAL '12 days', 'Merchant portal milestone 1 delivery invoice.')
    ON CONFLICT (invoice_no) DO NOTHING;

    -- Seed Expenses
    INSERT INTO expenses (id, title, category, amount, expense_date, notes)
    VALUES
        (gen_random_uuid(), 'Gulshan Office Monthly Rent', 'Office & Rent', 85000.00, CURRENT_DATE - INTERVAL '3 days', 'Office space lease for November 2026.'),
        (gen_random_uuid(), 'Meta & Google Ads Credit Topup', 'Marketing', 45000.00, CURRENT_DATE - INTERVAL '6 days', 'Digital ad spend for client campaigns & agency outreach.'),
        (gen_random_uuid(), 'AWS & Vercel Enterprise Cloud', 'Domain & Hosting', 16500.00, CURRENT_DATE - INTERVAL '10 days', 'Hosting infrastructure for client web apps and staging.'),
        (gen_random_uuid(), 'BTL Fabrication Props & Lighting', 'Operational', 52000.00, CURRENT_DATE - INTERVAL '14 days', 'Sound equipment and display kiosks for Apex activation.'),
        (gen_random_uuid(), 'High-Speed Fiber Internet & Utilities', 'Misc', 8200.00, CURRENT_DATE - INTERVAL '8 days', 'Dedicated studio 100Mbps fiber line & utilities.')
    ON CONFLICT DO NOTHING;

    -- Seed Employees
    INSERT INTO employees (id, full_name, designation, base_salary, joining_date, phone, email)
    VALUES
        (v_e1, 'Kazi Tariqul Islam', 'Creative Director & Partner', 95000.00, '2024-01-15', '+8801700112233', 'tariqul@arrowsolutions.com'),
        (v_e2, 'Mahmudul Hasan', 'Lead Full-Stack Engineer', 85000.00, '2024-03-01', '+8801700223344', 'mahmud@arrowsolutions.com'),
        (v_e3, 'Sadia Afrin', 'BTL Activation Operations Lead', 65000.00, '2024-06-10', '+8801700334455', 'sadia@arrowsolutions.com')
    ON CONFLICT (id) DO NOTHING;

    -- Seed Payroll
    INSERT INTO payroll (id, employee_id, month_year, bonus, deductions, net_salary, status, disbursed_at)
    VALUES
        (gen_random_uuid(), v_e1, 'October 2026', 10000.00, 0.00, 105000.00, 'Paid', CURRENT_DATE - INTERVAL '4 days'),
        (gen_random_uuid(), v_e2, 'October 2026', 5000.00, 0.00, 90000.00, 'Paid', CURRENT_DATE - INTERVAL '4 days'),
        (gen_random_uuid(), v_e3, 'October 2026', 2000.00, 0.00, 67000.00, 'Paid', CURRENT_DATE - INTERVAL '4 days')
    ON CONFLICT DO NOTHING;
END $$;
