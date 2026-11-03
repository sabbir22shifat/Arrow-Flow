# Arrow Flow — Agency Operating System 🏹

> **Arrow Solutions** • Offline Marketing • Digital Growth • Software Solutions  
> Enterprise Internal Operating System engineered for permanent zero-cost execution on **Supabase (Free Tier)** & **Vercel (Free Tier)**.

---

## ⚡ Tech Stack & Architecture

- **Framework:** Next.js 14+ (App Router, Server Actions, TypeScript)
- **Database & Auth:** Supabase PostgreSQL with strict Row Level Security (RLS)
- **Design & Styling:** Tailwind CSS, Lucide Icons, Custom Dark-Mode Agency Aesthetics (`bg-slate-950`, `border-slate-800`)
- **Currency:** Bangladeshi Taka (৳ BDT)

---

## 🚀 Quick Start Guide

### 1. Run Migrations on Supabase
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard) and create a free project.
2. In the left navigation, open the **SQL Editor**.
3. Copy the entire contents of [`supabase/schema.sql`](./supabase/schema.sql) and click **Run**.
   - This creates all enums (`lead_status`, `service_domain`, `invoice_status`, `expense_category`, `staff_role`), all 6 relational tables (`profiles`, `contacts`, `invoices`, `expenses`, `employees`, `payroll`), automated timestamp triggers, Row Level Security policies, and realistic seed data.

### 2. Configure Environment Variables
Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here
```

*(Note: If env variables are not set yet, Arrow Flow automatically boots in zero-config preview mode with local mock storage so you can test all workflows immediately!)*

### 3. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (auto-redirects to `/dashboard`).

---

## 📦 Core Modules

1. **Executive Overview (`/dashboard`):**
   - KPI Cards: Cash Collected (৳), Outstanding Due / Receivables (৳), Total Operational Expenses (৳), Net Operating Margin (৳).
   - Domain Breakdown: BTL & Activation, Digital Marketing, Web & IT, Event Management.
   - Interactive Quick Add Lead card.
   - Real-time recent leads table with inline status toggles.

2. **Invoices & Billing (`/dashboard/invoices`):**
   - Full accounts receivable ledger with search and status filters.
   - **Printable Client Invoice Modal:** High-contrast, brand-aligned dispatch layout with `@media print` support, bank details, and signature blocks.
   - **Record Payment Modal:** Real-time balance calculations, auto-calculates 'Paid' vs 'Partially Paid'.
   - **Generate Invoice Modal:** Automatic sequential numbering, client linking, and due dates.

3. **Pipeline (Kanban) (`/dashboard/pipeline`):**
   - Visual drag-and-drop / single-click stage advancement across *New*, *Contacted*, *Proposal Sent*, *Won*, and *Lost*.
   - Live revenue sum per stage.

4. **Leads & CRM Directory (`/dashboard/leads`):**
   - Filterable by Service Domain and Status.
   - Search across client name, company, phone, and email.

5. **Operational Expenses (`/dashboard/expenses`):**
   - Category breakdowns: Office & Rent, Marketing, Domain & Hosting, Operational, Salaries, Misc.
   - Fast expense logging modal.

6. **Payroll & Staff Registry (`/dashboard/payroll`):**
   - Team salaries, bonus, deductions, and disbursement tracking.

---

## 🛡️ Database & Security (RLS)

All tables have Row Level Security enabled. Only authenticated agency staff members can read and mutate records, protecting confidential client deals and financial ledger data.
