// ====================================================================
// ARROW FLOW: Data Access Layer & Business Logic (Neon Tech & Fallback)
// Agency: Arrow Solutions
// ====================================================================

import { getNeonSql, isNeonConfigured } from '@/lib/neon/db';
import { createClient } from '@/lib/supabase/server';
import {
  Contact,
  InvoiceWithContact,
  Expense,
  Employee,
  PayrollWithEmployee,
  DashboardMetrics,
} from '@/types/database';

// In-memory fallback state for immediate zero-config demo / preview
let fallbackContacts: Contact[] = [
  {
    id: 'c1111111-1111-1111-1111-111111111111',
    name: 'Tanvir Ahmed',
    company: 'Apex Footwear Ltd',
    phone: '+8801711223344',
    email: 'tanvir@apexbd.com',
    service_domain: 'BTL & Activation',
    status: 'Won',
    deal_value: 350000,
    notes: 'Nationwide roadshow brand activation campaign across 12 divisional hubs.',
    created_at: new Date(Date.now() - 15 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 15 * 86400000).toISOString(),
  },
  {
    id: 'c2222222-2222-2222-2222-222222222222',
    name: 'Nazia Rahman',
    company: 'Shwapno Superstores',
    phone: '+8801819556677',
    email: 'nazia.r@shwapno.net',
    service_domain: 'Digital Marketing',
    status: 'Won',
    deal_value: 180000,
    notes: 'Q4 Social performance marketing, brand engagement & influencer management.',
    created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    id: 'c3333333-3333-3333-3333-333333333333',
    name: 'Rafiqul Islam',
    company: 'Square Toiletries',
    phone: '+8801912334455',
    email: 'rafiq@squaregroup.com',
    service_domain: 'Event Management',
    status: 'Proposal Sent',
    deal_value: 420000,
    notes: 'Annual Dealer Conference 2026 at Bangabandhu International Conference Center.',
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: 'c4444444-4444-4444-4444-444444444444',
    name: 'Zubair Hossain',
    company: 'Fintech Pulse Ltd',
    phone: '+8801755667788',
    email: 'zubair@pulsepay.io',
    service_domain: 'Web & IT',
    status: 'Won',
    deal_value: 275000,
    notes: 'Custom Next.js Merchant portal, payment gateway integration and UI redesign.',
    created_at: new Date(Date.now() - 8 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 8 * 86400000).toISOString(),
  },
  {
    id: 'c5555555-5555-5555-5555-555555555555',
    name: 'Farhana Karim',
    company: 'Bengal Meat Co.',
    phone: '+8801677889900',
    email: 'f.karim@bengalmeat.com',
    service_domain: 'BTL & Activation',
    status: 'Contacted',
    deal_value: 150000,
    notes: 'Pop-up sensory tasting booths across prime supermarket locations.',
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: 'c6666666-6666-6666-6666-666666666666',
    name: 'Kamrul Hasan',
    company: 'Walton Hi-Tech',
    phone: '+8801733445566',
    email: 'k.hasan@walton.com.bd',
    service_domain: 'Digital Marketing',
    status: 'New',
    deal_value: 210000,
    notes: 'Inquiry received for Smart TV digital awareness and YouTube bumper ads.',
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
];

let fallbackInvoices: InvoiceWithContact[] = [
  {
    id: 'inv-1',
    contact_id: 'c1111111-1111-1111-1111-111111111111',
    invoice_no: 'INV-2026-001',
    total_amount: 350000,
    paid_amount: 350000,
    status: 'Paid',
    due_date: new Date(Date.now() - 15 * 86400000).toISOString().split('T')[0],
    notes: 'Roadshow activation first phase full settlement.',
    created_at: new Date(Date.now() - 20 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 15 * 86400000).toISOString(),
    contact: fallbackContacts[0],
  },
  {
    id: 'inv-2',
    contact_id: 'c2222222-2222-2222-2222-222222222222',
    invoice_no: 'INV-2026-002',
    total_amount: 180000,
    paid_amount: 100000,
    status: 'Partially Paid',
    due_date: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
    notes: 'Advance paid ৳100,000. Balance due upon submission of final analytics report.',
    created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    contact: fallbackContacts[1],
  },
  {
    id: 'inv-3',
    contact_id: 'c4444444-4444-4444-4444-444444444444',
    invoice_no: 'INV-2026-003',
    total_amount: 275000,
    paid_amount: 0,
    status: 'Unpaid',
    due_date: new Date(Date.now() + 12 * 86400000).toISOString().split('T')[0],
    notes: 'Merchant portal milestone 1 delivery invoice.',
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    contact: fallbackContacts[3],
  },
];

let fallbackExpenses: Expense[] = [
  {
    id: 'exp-1',
    title: 'Gulshan Office Monthly Rent',
    category: 'Office & Rent',
    amount: 85000,
    expense_date: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0],
    receipt_url: null,
    notes: 'Agency studio & head office rental for November 2026.',
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: 'exp-2',
    title: 'Meta & Google Ads Credit Topup',
    category: 'Marketing',
    amount: 45000,
    expense_date: new Date(Date.now() - 6 * 86400000).toISOString().split('T')[0],
    receipt_url: null,
    notes: 'Paid media campaign billing for Shwapno & in-house agency outreach.',
    created_at: new Date(Date.now() - 6 * 86400000).toISOString(),
  },
  {
    id: 'exp-3',
    title: 'AWS & Vercel Enterprise Cloud',
    category: 'Domain & Hosting',
    amount: 16500,
    expense_date: new Date(Date.now() - 10 * 86400000).toISOString().split('T')[0],
    receipt_url: null,
    notes: 'Infrastructure and CDN hosting for client SaaS and agency web apps.',
    created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
  {
    id: 'exp-4',
    title: 'BTL Fabrication Props & Sound Lighting',
    category: 'Operational',
    amount: 52000,
    expense_date: new Date(Date.now() - 14 * 86400000).toISOString().split('T')[0],
    receipt_url: null,
    notes: 'Sound equipment, stage lighting and interactive kiosks for brand activation.',
    created_at: new Date(Date.now() - 14 * 86400000).toISOString(),
  },
  {
    id: 'exp-5',
    title: 'High-Speed Fiber Internet & Utilities',
    category: 'Misc',
    amount: 8200,
    expense_date: new Date(Date.now() - 8 * 86400000).toISOString().split('T')[0],
    receipt_url: null,
    notes: 'Dedicated 100Mbps studio fiber connection and utility bills.',
    created_at: new Date(Date.now() - 8 * 86400000).toISOString(),
  },
];

let fallbackEmployees: Employee[] = [
  {
    id: 'e1111111-1111-1111-1111-111111111111',
    full_name: 'Kazi Tariqul Islam',
    designation: 'Creative Director & Partner',
    base_salary: 95000,
    joining_date: '2024-01-15',
    phone: '+8801700112233',
    email: 'tariqul@arrowsolutions.com',
    is_active: true,
    created_at: new Date('2024-01-15').toISOString(),
  },
  {
    id: 'e2222222-2222-2222-2222-222222222222',
    full_name: 'Mahmudul Hasan',
    designation: 'Lead Full-Stack Engineer',
    base_salary: 85000,
    joining_date: '2024-03-01',
    phone: '+8801700223344',
    email: 'mahmud@arrowsolutions.com',
    is_active: true,
    created_at: new Date('2024-03-01').toISOString(),
  },
  {
    id: 'e3333333-3333-3333-3333-333333333333',
    full_name: 'Sadia Afrin',
    designation: 'BTL Activation Operations Lead',
    base_salary: 65000,
    joining_date: '2024-06-10',
    phone: '+8801700334455',
    email: 'sadia@arrowsolutions.com',
    is_active: true,
    created_at: new Date('2024-06-10').toISOString(),
  },
];

let fallbackPayroll: PayrollWithEmployee[] = [
  {
    id: 'pay-1',
    employee_id: 'e1111111-1111-1111-1111-111111111111',
    month_year: 'October 2026',
    bonus: 10000,
    deductions: 0,
    net_salary: 105000,
    status: 'Paid',
    disbursed_at: new Date(Date.now() - 4 * 86400000).toISOString().split('T')[0],
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    employee: fallbackEmployees[0],
  },
  {
    id: 'pay-2',
    employee_id: 'e2222222-2222-2222-2222-222222222222',
    month_year: 'October 2026',
    bonus: 5000,
    deductions: 0,
    net_salary: 90000,
    status: 'Paid',
    disbursed_at: new Date(Date.now() - 4 * 86400000).toISOString().split('T')[0],
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    employee: fallbackEmployees[1],
  },
  {
    id: 'pay-3',
    employee_id: 'e3333333-3333-3333-3333-333333333333',
    month_year: 'October 2026',
    bonus: 2000,
    deductions: 0,
    net_salary: 67000,
    status: 'Paid',
    disbursed_at: new Date(Date.now() - 4 * 86400000).toISOString().split('T')[0],
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    employee: fallbackEmployees[2],
  },
];

function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return !!(
    url &&
    key &&
    !url.includes('placeholder-project') &&
    !url.includes('your-project-id') &&
    key !== 'placeholder-anon-key'
  );
}

export function getActiveDatabaseProvider(): 'neon' | 'supabase' | 'fallback' {
  if (isNeonConfigured()) return 'neon';
  if (isSupabaseConfigured()) return 'supabase';
  return 'fallback';
}

// -------------------------------------------------------------------
// DATA RETRIEVAL METHODS
// -------------------------------------------------------------------

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const invoices = await getAllInvoices();
  const expenses = await getAllExpenses();
  const leads = await getAllLeads();

  const cashCollected = invoices.reduce((sum, inv) => sum + (Number(inv.paid_amount) || 0), 0);
  const totalReceivables = invoices.reduce((sum, inv) => sum + (Number(inv.total_amount) || 0), 0);
  const outstandingDue = Math.max(0, totalReceivables - cashCollected);
  const totalExpenses = expenses.reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);
  const netOperatingMargin = cashCollected - totalExpenses;

  const activeLeadsCount = leads.filter(
    (l) => l.status === 'New' || l.status === 'Contacted' || l.status === 'Proposal Sent'
  ).length;

  const totalDealsWonValue = leads
    .filter((l) => l.status === 'Won')
    .reduce((sum, l) => sum + (Number(l.deal_value) || 0), 0);

  return {
    cashCollected,
    outstandingDue,
    totalExpenses,
    netOperatingMargin,
    isProfitable: netOperatingMargin >= 0,
    activeLeadsCount,
    totalDealsWonValue,
  };
}

export async function getAllLeads(): Promise<Contact[]> {
  // 1. Neon Tech PostgreSQL
  const sql = getNeonSql();
  if (sql) {
    try {
      const rows = await sql`SELECT * FROM contacts ORDER BY created_at DESC;`;
      if (rows && rows.length > 0) {
        return rows as Contact[];
      }
    } catch (err) {
      console.warn('Neon query fallback:', err);
    }
  }

  // 2. Supabase
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('contacts')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data as Contact[];
      }
    } catch {
      // Fallback
    }
  }

  return [...fallbackContacts].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export async function getRecentLeads(limit = 6): Promise<Contact[]> {
  const leads = await getAllLeads();
  return leads.slice(0, limit);
}

export async function getAllInvoices(): Promise<InvoiceWithContact[]> {
  // 1. Neon Tech PostgreSQL
  const sql = getNeonSql();
  if (sql) {
    try {
      const rows = await sql`
        SELECT 
          i.*,
          CASE 
            WHEN c.id IS NOT NULL THEN json_build_object(
              'id', c.id,
              'name', c.name,
              'company', c.company,
              'phone', c.phone,
              'email', c.email,
              'service_domain', c.service_domain,
              'status', c.status
            )
            ELSE NULL
          END as contact
        FROM invoices i
        LEFT JOIN contacts c ON i.contact_id = c.id
        ORDER BY i.created_at DESC;
      `;
      if (rows && rows.length > 0) {
        return rows as InvoiceWithContact[];
      }
    } catch (err) {
      console.warn('Neon query fallback:', err);
    }
  }

  // 2. Supabase
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('invoices')
        .select('*, contact:contacts(*)')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data as InvoiceWithContact[];
      }
    } catch {
      // Fallback
    }
  }

  return [...fallbackInvoices].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export async function getAllExpenses(): Promise<Expense[]> {
  // 1. Neon Tech PostgreSQL
  const sql = getNeonSql();
  if (sql) {
    try {
      const rows = await sql`SELECT * FROM expenses ORDER BY expense_date DESC;`;
      if (rows && rows.length > 0) {
        return rows as Expense[];
      }
    } catch (err) {
      console.warn('Neon query fallback:', err);
    }
  }

  // 2. Supabase
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('expense_date', { ascending: false });

      if (!error && data && data.length > 0) {
        return data as Expense[];
      }
    } catch {
      // Fallback
    }
  }

  return [...fallbackExpenses].sort(
    (a, b) => new Date(b.expense_date).getTime() - new Date(a.expense_date).getTime()
  );
}

export async function getEmployees(): Promise<Employee[]> {
  const sql = getNeonSql();
  if (sql) {
    try {
      const rows = await sql`SELECT * FROM employees ORDER BY full_name ASC;`;
      if (rows && rows.length > 0) {
        return rows as Employee[];
      }
    } catch (err) {
      console.warn('Neon query fallback:', err);
    }
  }

  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('full_name', { ascending: true });

      if (!error && data && data.length > 0) {
        return data as Employee[];
      }
    } catch {
      // Fallback
    }
  }
  return [...fallbackEmployees];
}

export async function getPayrollRecords(): Promise<PayrollWithEmployee[]> {
  const sql = getNeonSql();
  if (sql) {
    try {
      const rows = await sql`
        SELECT 
          p.*,
          CASE 
            WHEN e.id IS NOT NULL THEN json_build_object(
              'id', e.id,
              'full_name', e.full_name,
              'designation', e.designation,
              'base_salary', e.base_salary
            )
            ELSE NULL
          END as employee
        FROM payroll p
        LEFT JOIN employees e ON p.employee_id = e.id
        ORDER BY p.created_at DESC;
      `;
      if (rows && rows.length > 0) {
        return rows as PayrollWithEmployee[];
      }
    } catch (err) {
      console.warn('Neon query fallback:', err);
    }
  }

  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('payroll')
        .select('*, employee:employees(*)')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data as PayrollWithEmployee[];
      }
    } catch {
      // Fallback
    }
  }
  return [...fallbackPayroll];
}

// -------------------------------------------------------------------
// FALLBACK MUTATION HELPERS
// -------------------------------------------------------------------

export function addFallbackLead(lead: Omit<Contact, 'id' | 'created_at' | 'updated_at'>): Contact {
  const newLead: Contact = {
    ...lead,
    id: `c-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  fallbackContacts.unshift(newLead);
  return newLead;
}

export function updateFallbackLeadStatus(id: string, status: Contact['status']): boolean {
  const found = fallbackContacts.find((c) => c.id === id);
  if (found) {
    found.status = status;
    found.updated_at = new Date().toISOString();
    return true;
  }
  return false;
}

export function addFallbackInvoice(
  invoice: Omit<InvoiceWithContact, 'id' | 'created_at' | 'updated_at'>
): InvoiceWithContact {
  const contact = fallbackContacts.find((c) => c.id === invoice.contact_id) || null;
  const newInvoice: InvoiceWithContact = {
    ...invoice,
    id: `inv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    contact,
  };
  fallbackInvoices.unshift(newInvoice);
  return newInvoice;
}

export function recordFallbackPayment(invoiceId: string, amount: number): InvoiceWithContact | null {
  const invoice = fallbackInvoices.find((i) => i.id === invoiceId);
  if (invoice) {
    invoice.paid_amount = Number(invoice.paid_amount || 0) + Number(amount);
    if (invoice.paid_amount >= invoice.total_amount) {
      invoice.status = 'Paid';
    } else if (invoice.paid_amount > 0) {
      invoice.status = 'Partially Paid';
    } else {
      invoice.status = 'Unpaid';
    }
    invoice.updated_at = new Date().toISOString();
    return invoice;
  }
  return null;
}

export function addFallbackExpense(expense: Omit<Expense, 'id' | 'created_at'>): Expense {
  const newExpense: Expense = {
    ...expense,
    id: `exp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    created_at: new Date().toISOString(),
  };
  fallbackExpenses.unshift(newExpense);
  return newExpense;
}

export { isSupabaseConfigured, isNeonConfigured };
